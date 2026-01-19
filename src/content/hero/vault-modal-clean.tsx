'use client';

import React, { useEffect, useMemo, useState } from 'react';

type VaultOnboardingModalProps = {
  open: boolean;
  onComplete: (name: string) => void;
  currentName?: string | null;
};

export default function VaultOnboardingModal({
  open,
  onComplete,
  currentName,
}: VaultOnboardingModalProps) {
  const [vaultName, setVaultName] = useState<string>(currentName ?? '');
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof currentName === 'string') {
      setVaultName(currentName);
    }
  }, [currentName]);

  const trimmed = useMemo(() => vaultName.trim(), [vaultName]);
  const isValid = trimmed.length > 0 && trimmed.length <= 50;
  const remaining = 50 - trimmed.length;

  const suggestions = useMemo(
    () => [
      'My Health Vault',
      'Wellness Archive',
      'Care Vault',
      'Sacred Vault',
      'Personal Health Locker',
    ],
    []
  );

  const label = currentName ? 'Update Name' : 'Create My Vault';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isValid || saving) return;
    setSaving(true);
    try {
      const res = await fetch('/api/vault/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vaultName: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || (data as any)?.error) {
        const msg = (data as any)?.error;
        setError(typeof msg === 'string' ? msg : 'Unable to save vault name.');
      } else {
        onComplete(trimmed);
      }
    } catch (err: any) {
      setError('Network error while saving.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {currentName ? 'Rename Your Vault' : 'Welcome to Your Vault'}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Give your personal health vault a memorable name.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">
            Vault Name
          </label>
          <input
            type="text"
            value={vaultName}
            onChange={(e) => setVaultName(e.target.value)}
            placeholder="e.g., My Health Vault"
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          />

          {error ? (
            <div className="mt-2 text-sm text-red-600">{error}</div>
          ) : !isValid && trimmed.length > 0 ? (
            <div className="mt-2 text-sm text-red-600">
              Name must be 1–50 characters.
            </div>
          ) : (
            <div className="mt-2 text-sm text-gray-500">
              {remaining} characters remaining
            </div>
          )}

          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-1">Suggestions:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setVaultName(s)}
                  className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid || saving}
            className={`mt-6 w-full rounded bg-blue-600 px-4 py-2 text-white ${
              !isValid || saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {saving ? 'Saving…' : label}
          </button>
        </form>
      </div>
    </div>
  );
}
