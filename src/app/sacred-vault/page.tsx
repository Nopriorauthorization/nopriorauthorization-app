import React from "react";
import VaultClient, { type VaultData } from "../vault/vault-client";

export default async function SacredVaultPage() {
  let initialData: VaultData | null = null;
  try {
    const response = await fetch(`/api/vault/features`, {
      cache: "no-store"
    });
    if (response.ok) {
      initialData = (await response.json()) as VaultData;
    }
  } catch (error) {
    console.error("Failed to load vault data:", error);
  }
  return <VaultClient initialData={initialData} />;
}
