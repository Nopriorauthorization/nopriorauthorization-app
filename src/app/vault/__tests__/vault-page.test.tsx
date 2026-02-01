import React from "react";
import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import type { VaultData } from "../vault-client";
import VaultPage from "../page";

const mockGetServerSession = vi.fn();
const redirectMock = vi.fn();
const cookiesMock = vi.fn();

vi.mock("next-auth", () => ({
  getServerSession: (...args: unknown[]) => mockGetServerSession(...args),
}));

vi.mock("next/navigation", () => ({
  redirect: () => redirectMock(),
}));

vi.mock("next/headers", () => ({
  cookies: () => cookiesMock(),
}));

type FetchMock = ReturnType<typeof vi.fn>;

const originalEnv = process.env.NEXTAUTH_URL;
const originalFetch = global.fetch;

beforeAll(() => {
  process.env.NEXTAUTH_URL = "https://example.com";
});

afterAll(() => {
  if (typeof originalEnv === "undefined") {
    delete process.env.NEXTAUTH_URL;
  } else {
    process.env.NEXTAUTH_URL = originalEnv;
  }
  global.fetch = originalFetch;
});

beforeEach(() => {
  mockGetServerSession.mockReset();
  redirectMock.mockClear();
  cookiesMock.mockReset();
  const fetchMock = vi.fn() as FetchMock;
  global.fetch = fetchMock as unknown as typeof fetch;
});

describe("VaultPage", () => {
  it("redirects unauthenticated users", async () => {
    mockGetServerSession.mockResolvedValueOnce(null);
    cookiesMock.mockReturnValue({ toString: () => "" });

    await expect(VaultPage()).rejects.toMatchObject({ message: "NEXT_REDIRECT" });
    expect(redirectMock).toHaveBeenCalledWith("/login?callbackUrl=/vault");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("renders vault client with initial data when session exists", async () => {
    const sampleData: VaultData = {
      features: [
        {
          id: "feature-1",
          title: "Decoder",
          description: "Decode documents",
          tier: "instant",
          icon: "📄",
          status: "active",
          href: "/vault/decoder",
          hasData: true,
        },
      ],
      stats: {
        documents: 2,
        chats: 1,
        appointments: 0,
        decoded: 2,
      },
      vaultName: "My Vault",
      isEmpty: false,
    };

    mockGetServerSession.mockResolvedValueOnce({ user: { id: "user-1" } });
    cookiesMock.mockReturnValue({ toString: () => "session-cookie=value" });

    (global.fetch as FetchMock).mockResolvedValueOnce({
      ok: true,
      json: async () => sampleData,
    });

    const result = await VaultPage();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/api/vault/features",
      expect.objectContaining({
        cache: "no-store",
        headers: { cookie: "session-cookie=value" },
      })
    );
    expect(result).toBeTruthy();
    expect((result as React.ReactElement).props.initialData).toEqual(sampleData);
  });

  it("passes null to vault client when fetch fails", async () => {
    mockGetServerSession.mockResolvedValueOnce({ user: { id: "user-1" } });
    cookiesMock.mockReturnValue({ toString: () => "" });

    (global.fetch as FetchMock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({})
    });

    const result = await VaultPage();
    expect(result).toBeTruthy();
    expect((result as React.ReactElement).props.initialData).toBeNull();
  });
});
