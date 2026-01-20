import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import VaultClient, { type VaultData } from "./vault-client";
import { authOptions } from "@/lib/auth/auth-options";

export default async function VaultPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/vault");
  }

  const cookieHeader = cookies().toString();
  const origin =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  let initialData: VaultData | null = null;

  try {
    const response = await fetch(`${origin}/api/vault/features`, {
      cache: "no-store",
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });

    if (response.ok) {
      initialData = (await response.json()) as VaultData;
    }
  } catch (error) {
    console.error("Failed to load vault data:", error);
  }

  return <VaultClient initialData={initialData} />;
}
