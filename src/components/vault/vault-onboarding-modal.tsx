"use client";

import { useState } from "react";

type VaultOnboardingModalProps = {
  open: boolean;
  onComplete: (vaultName: string) => void;
};

const SUGGESTED_NAMES = [
  "My Health Circle",
  "My Sacred Space",
  "My Health Haven",
  "My Wellness Vault",
  "My Care Chronicles",
];

export default function VaultOnboardingModal({
  open,
  onComplete,
}: VaultOnboardingModalProps) {
  const [vaultName, setVaultName] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaultName.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/vault/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vaultName: vaultName.trim() }),
      });

      if (res.ok) {
        onComplete(vaultName.trim());
      }
    } catch (error) {
      console.error("Failed to save vault name:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="relative max-w-lg w-full bg-black border border-white/20 rounded-3xl p-8 shadow-2xl">
        {/* Decorative Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-4xl">
            🔐
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-3xl font-semibold text-white text-center mb-4">
          Welcome to Your Sacred Vault
        </h2>

        {/* Tagline */}
        <p className="text-gray-300 text-center text-lg leading-relaxed mb-8">
          Your safe place that <strong className="text-pink-400">remembers you</strong>,{" "}
          <strong className="text-pink-400">prepares you</strong>, and{" "}
          <strong className="text-pink-400">protects you</strong> — and NEVER asks you
          to do unnecessary work.
        </p>

        {/* Divider */}
        <div className="border-t border-white/10 mb-6"></div>

        {/* Input Section */}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-400 mb-3 text-center">
            What would you like to call it?
          </label>

          <input
            type="text"
            value={vaultName}
            onChange={(e) => setVaultName(e.target.value)}
            placeholder="My Health Circle"
            maxLength={50}
            className="w-full px-6 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white text-lg text-center placeholder:text-white/40 focus:outline-none focus:border-pink-400 transition"
            autoFocus
          />

          {/* Suggestions */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 text-center mb-2">Or choose one:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setVaultName(name)}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs hover:bg-white/10 hover:border-pink-400/30 hover:text-white transition"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!vaultName.trim() || saving}
            className="w-full mt-8 px-6 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
          >
            {saving ? "Saving..." : "Create My Vault"}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center mt-6">
          You can change this anytime in Settings
        </p>
      </div>
    </div>
  );
}
