import { NPA_OG_IMAGE_PATH, NPA_SITE_URL } from "@/config/npa-brand.config";
import type { Metadata } from "next";
import type { ShopProduct } from "@/lib/shop/products";

export const DEFAULT_OG_IMAGE_ALT =
  "No Prior Authorization — The Operating System for the Modern Med Spa" as const;

export function defaultBrandOpenGraphImages(): NonNullable<
  Metadata["openGraph"]
>["images"] {
  return [
    {
      url: `${NPA_SITE_URL}${NPA_OG_IMAGE_PATH}`,
      width: 1024,
      height: 571,
      alt: DEFAULT_OG_IMAGE_ALT,
    },
  ];
}

export function defaultBrandTwitterImages(): NonNullable<Metadata["twitter"]>["images"] {
  return [`${NPA_SITE_URL}${NPA_OG_IMAGE_PATH}`];
}

export function baseOpenGraphSiteFields(): Pick<
  NonNullable<Metadata["openGraph"]>,
  "siteName" | "locale" | "type"
> {
  return {
    siteName: "No Prior Authorization",
    locale: "en_US",
    type: "website",
  };
}

/** First product preview as OG image, else brand default. */
export function openGraphImagesForProduct(product: ShopProduct): NonNullable<
  Metadata["openGraph"]
>["images"] {
  const first = product.previewImages[0];
  if (!first) return defaultBrandOpenGraphImages();
  const url = first.startsWith("http") ? first : `${NPA_SITE_URL}${first}`;
  return [{ url }];
}

export function twitterImagesForProduct(product: ShopProduct): NonNullable<
  Metadata["twitter"]
>["images"] {
  const imgs = openGraphImagesForProduct(product);
  const first = Array.isArray(imgs) ? imgs[0] : imgs;
  if (first && typeof first === "object" && "url" in first && first.url) {
    return [first.url.toString()];
  }
  return defaultBrandTwitterImages();
}
