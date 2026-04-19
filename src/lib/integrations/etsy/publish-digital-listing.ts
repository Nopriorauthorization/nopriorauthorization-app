import { readFile } from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import type { PrismaClient } from "@prisma/client";
import { EtsyService } from "./etsy.service";
import type { DraftListingInput } from "./types";

export type DigitalPublishRow = {
  productSlug: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
  taxonomyId: number;
  quantity?: number;
  /** Repo-relative or absolute path to listing image (PNG/JPEG). */
  imagePath: string;
  /** Repo-relative or absolute path to digital file (PDF, etc.). */
  digitalFilePath: string;
  /** If true, PATCH `state=active` after assets (charges / goes live per Etsy rules). */
  publish?: boolean;
};

export type PublishDigitalOptions = {
  prisma?: PrismaClient;
  /** Max attempts per HTTP step (429 / 5xx backoff). */
  maxAttempts?: number;
};

async function withRetry<T>(
  label: string,
  fn: () => Promise<T>,
  opts: { maxAttempts: number; isRetryable: (r: T) => boolean },
): Promise<T> {
  let last: T | undefined;
  let delay = 400;
  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    last = await fn();
    if (!opts.isRetryable(last)) return last;
    if (attempt < opts.maxAttempts) {
      console.warn(
        `[etsy-publish] ${label} retry ${attempt}/${opts.maxAttempts} after ${delay}ms`,
      );
      await new Promise((r) => setTimeout(r, delay));
      delay = Math.min(delay * 2, 8000);
    }
  }
  return last as T;
}

function idempotencyKey(slug: string, title: string): string {
  return createHash("sha256")
    .update(`${slug}\0${title}`, "utf8")
    .digest("hex")
    .slice(0, 64);
}

async function resolvePath(p: string, cwd: string): Promise<string> {
  if (path.isAbsolute(p)) return p;
  return path.join(cwd, p);
}

/**
 * Full digital pipeline: draft → image → file → type download → optional active.
 * Persists `EtsyListingSync` when `prisma` is passed (idempotency + resume).
 *
 * Order follows Etsy listing tutorial: assets before `state=active`.
 * `createDraftListing` already sends `type: "download"`; we still PATCH `type` for idempotency with physical→digital flows.
 */
export async function publishDigitalListing(
  row: DigitalPublishRow,
  etsy: EtsyService,
  options: PublishDigitalOptions = {},
): Promise<{
  ok: boolean;
  listingId?: number;
  url?: string;
  skipped?: boolean;
  error?: string;
}> {
  const cwd = process.cwd();
  const maxAttempts = options.maxAttempts ?? 4;
  const prisma = options.prisma;
  const idem = idempotencyKey(row.productSlug, row.title);

  if (prisma) {
    const existing = await prisma.etsyListingSync.findUnique({
      where: { productSlug: row.productSlug },
    });
    if (existing?.syncStatus === "active" && existing.etsyListingId) {
      if (row.publish) {
        return {
          ok: true,
          skipped: true,
          listingId: existing.etsyListingId,
          url: existing.listingUrl || undefined,
        };
      }
      return {
        ok: true,
        listingId: existing.etsyListingId,
        url: existing.listingUrl || undefined,
      };
    }
  }

  let listingId: number | undefined;
  let resumeFrom: string | null = null;

  if (prisma) {
    const rowDb = await prisma.etsyListingSync.findUnique({
      where: { productSlug: row.productSlug },
    });
    if (rowDb?.etsyListingId) {
      const s = rowDb.syncStatus;
      if (s === "active" && row.publish) {
        /* handled above */
      } else if (
        s === "draft" ||
        s === "has_image" ||
        s === "has_file" ||
        s === "type_download" ||
        s === "failed"
      ) {
        listingId = rowDb.etsyListingId;
        resumeFrom = s;
      }
    }
  }

  const draftInput: DraftListingInput = {
    title: row.title,
    description: row.description,
    price: row.price,
    quantity: row.quantity ?? 999,
    tags: row.tags.slice(0, 13),
    taxonomyId: row.taxonomyId,
    isDigital: true,
  };

  if (!listingId) {
    const created = await withRetry(
      "createDraft",
      () => etsy.createDraftListing(draftInput),
      {
        maxAttempts,
        isRetryable: (r) =>
          !r.ok && (r.httpStatus === 429 || (r.httpStatus ?? 0) >= 500),
      },
    );
    if (!created.ok || !created.listingId) {
      if (prisma) {
        await prisma.etsyListingSync.upsert({
          where: { productSlug: row.productSlug },
          create: {
            productSlug: row.productSlug,
            syncStatus: "failed",
            lastError: created.error || "create failed",
            idempotencyKey: idem,
          },
          update: {
            syncStatus: "failed",
            lastError: created.error || "create failed",
            lastSyncedAt: new Date(),
          },
        });
      }
      return { ok: false, error: created.error };
    }
    listingId = created.listingId;
    if (prisma) {
      await prisma.etsyListingSync.upsert({
        where: { productSlug: row.productSlug },
        create: {
          productSlug: row.productSlug,
          etsyListingId: listingId,
          syncStatus: "draft",
          listingUrl: `https://www.etsy.com/listing/${listingId}`,
          idempotencyKey: idem,
          lastSyncedAt: new Date(),
        },
        update: {
          etsyListingId: listingId,
          syncStatus: "draft",
          listingUrl: `https://www.etsy.com/listing/${listingId}`,
          lastError: null,
          lastSyncedAt: new Date(),
        },
      });
    }
  }

  if (resumeFrom === "active" && !row.publish) {
    return {
      ok: true,
      listingId,
      url: `https://www.etsy.com/listing/${listingId}`,
    };
  }

  const imgPath = await resolvePath(row.imagePath, cwd);
  const imgBytes = await readFile(imgPath);
  const imgName = path.basename(imgPath);

  const skipImage =
    resumeFrom === "has_image" ||
    resumeFrom === "has_file" ||
    resumeFrom === "type_download" ||
    (resumeFrom === "active" && !row.publish);

  const imgRes = skipImage
    ? ({ ok: true as const, raw: {} } as const)
    : await withRetry(
        "uploadImage",
        () => etsy.uploadListingImage(listingId!, imgBytes, imgName, 1),
        {
          maxAttempts,
          isRetryable: (r) =>
            !r.ok && (r.httpStatus === 429 || (r.httpStatus ?? 0) >= 500),
        },
      );
  if (!imgRes.ok) {
    if (prisma) {
      await prisma.etsyListingSync.update({
        where: { productSlug: row.productSlug },
        data: {
          syncStatus: "failed",
          lastError: imgRes.error,
          lastSyncedAt: new Date(),
        },
      });
    }
    return { ok: false, listingId, error: imgRes.error };
  }
  if (prisma && !skipImage) {
    await prisma.etsyListingSync.update({
      where: { productSlug: row.productSlug },
      data: { syncStatus: "has_image", lastSyncedAt: new Date(), lastError: null },
    });
  }

  const filePath = await resolvePath(row.digitalFilePath, cwd);
  const fileBytes = await readFile(filePath);
  const fileName = path.basename(filePath);

  const skipFile =
    resumeFrom === "has_file" ||
    resumeFrom === "type_download" ||
    (resumeFrom === "active" && !row.publish);

  const fileRes = skipFile
    ? ({ ok: true as const, raw: {} } as const)
    : await withRetry(
        "uploadFile",
        () => etsy.uploadListingFile(listingId!, fileBytes, fileName),
        {
          maxAttempts,
          isRetryable: (r) =>
            !r.ok && (r.httpStatus === 429 || (r.httpStatus ?? 0) >= 500),
        },
      );
  if (!fileRes.ok) {
    if (prisma) {
      await prisma.etsyListingSync.update({
        where: { productSlug: row.productSlug },
        data: {
          syncStatus: "failed",
          lastError: fileRes.error,
          lastSyncedAt: new Date(),
        },
      });
    }
    return { ok: false, listingId, error: fileRes.error };
  }
  if (prisma && !skipFile) {
    await prisma.etsyListingSync.update({
      where: { productSlug: row.productSlug },
      data: { syncStatus: "has_file", lastSyncedAt: new Date(), lastError: null },
    });
  }

  const skipType = resumeFrom === "type_download" || resumeFrom === "active";

  const typeRes = skipType
    ? ({ ok: true as const, raw: {} } as const)
    : await withRetry(
        "patchTypeDownload",
        () => etsy.patchListing(listingId!, { type: "download" }),
        {
          maxAttempts,
          isRetryable: (r) =>
            !r.ok && (r.httpStatus === 429 || (r.httpStatus ?? 0) >= 500),
        },
      );
  if (!typeRes.ok) {
    if (prisma) {
      await prisma.etsyListingSync.update({
        where: { productSlug: row.productSlug },
        data: {
          syncStatus: "failed",
          lastError: typeRes.error,
          lastSyncedAt: new Date(),
        },
      });
    }
    return { ok: false, listingId, error: typeRes.error };
  }
  if (prisma && !skipType) {
    await prisma.etsyListingSync.update({
      where: { productSlug: row.productSlug },
      data: {
        syncStatus: "type_download",
        lastSyncedAt: new Date(),
        lastError: null,
      },
    });
  }

  if (row.publish) {
    if (resumeFrom === "active") {
      return {
        ok: true,
        listingId,
        url: `https://www.etsy.com/listing/${listingId}`,
      };
    }
    const act = await withRetry(
      "patchActive",
      () => etsy.patchListing(listingId!, { state: "active" }),
      {
        maxAttempts,
        isRetryable: (r) =>
          !r.ok && (r.httpStatus === 429 || (r.httpStatus ?? 0) >= 500),
      },
    );
    if (!act.ok) {
      if (prisma) {
        await prisma.etsyListingSync.update({
          where: { productSlug: row.productSlug },
          data: {
            syncStatus: "failed",
            lastError: act.error,
            lastSyncedAt: new Date(),
          },
        });
      }
      return { ok: false, listingId, error: act.error };
    }
    if (prisma) {
      await prisma.etsyListingSync.update({
        where: { productSlug: row.productSlug },
        data: {
          syncStatus: "active",
          lastSyncedAt: new Date(),
          lastError: null,
        },
      });
    }
  }

  return {
    ok: true,
    listingId,
    url: `https://www.etsy.com/listing/${listingId}`,
  };
}
