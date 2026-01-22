"use client";
export const dynamic = 'force-dynamic';export const runtime = "edge";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/button";

type UserSettings = {
  role: string;
  name: string;
  email: string;
  lastAccessAt: string | null;
  consentToShareClinicalSummary: boolean;
  allowProviderToProviderSharing: boolean;
  emailNotificationsEnabled: boolean;
  defaultClinicalSummaryView: string | null;
  includeProviderNotesInShares: boolean;
  copyToEHRFormat: string | null;
};

type ShareLink = {
  id: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  accessCount: number;
};

const demoSettings: UserSettings = {
  role: "member",
  name: "Guest User",
  email: "guest@example.com",
  lastAccessAt: null,
  consentToShareClinicalSummary: false,
  allowProviderToProviderSharing: false,
  emailNotificationsEnabled: false,
  defaultClinicalSummaryView: null,
  includeProviderNotesInShares: false,
  copyToEHRFormat: null,
};

export default function SettingsPage() {
  const { status } = useSession();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [exportRequested, setExportRequested] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setSettings(demoSettings);
      setShareLinks([]);
      setLoading(false);
      return;
    }

    if (status === "authenticated") {
      loadSettings();
    }
  }, [status]);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) throw new Error("Failed to load settings");
      
      const data = await response.json();
      setSettings(data.settings);
      setShareLinks(data.shareLinks || []);
    } catch (err) {
      showMessage("error", "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const saveSettings = async () => {
    if (status !== "authenticated") {
      showMessage("error", "Saving settings requires a signed-in account in production.");
      return;
    }

    if (!settings) return;
    
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) throw new Error("Failed to save settings");
      
      showMessage("success", "Settings saved successfully");
    } catch (err) {
      showMessage("error", "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const requestPasswordReset = async () => {
    if (status !== "authenticated") {
      showMessage("error", "Password reset is unavailable in demo mode.");
      return;
    }

    try {
      const response = await fetch("/api/settings/password-reset", {
        method: "POST",
      });
      
      if (!response.ok) throw new Error("Failed to request password reset");
      
      setPasswordResetSent(true);
      showMessage("success", "Password reset email sent");
    } catch (err) {
      showMessage("error", "Failed to request password reset");
    }
  };

  const logOutAllSessions = async () => {
    if (status !== "authenticated") {
      showMessage("error", "Session management is disabled in demo mode.");
      return;
    }

    if (!confirm("This will log you out of all devices. Continue?")) return;
    
    try {
      await fetch("/api/settings/logout-all", { method: "POST" });
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      showMessage("error", "Failed to log out all sessions");
    }
  };

  const revokeShareLink = async (token: string) => {
    if (status !== "authenticated") {
      showMessage("error", "Share link management is disabled in demo mode.");
      return;
    }

    if (!confirm("This will immediately revoke provider access. Continue?")) return;
    
    try {
      const response = await fetch(`/api/provider-packet/share/${token}/revoke`, {
        method: "POST",
      });
      
      if (!response.ok) throw new Error("Failed to revoke access");
      
      setShareLinks(shareLinks.filter(link => link.token !== token));
      showMessage("success", "Access revoked successfully");
    } catch (err) {
      showMessage("error", "Failed to revoke access");
    }
  };

  const requestDataExport = async () => {
    if (status !== "authenticated") {
      showMessage("error", "Data export is unavailable in demo mode.");
      return;
    }

    if (!confirm("We'll prepare your complete data export and email it within 48 hours. Continue?")) return;
    
    try {
      const response = await fetch("/api/settings/export", { method: "POST" });
      if (!response.ok) throw new Error("Failed to request export");
      
      setExportRequested(true);
      showMessage("success", "Data export requested - you'll receive an email within 48 hours");
    } catch (err) {
      showMessage("error", "Failed to request data export");
    }
  };

  const requestAccountDeletion = async () => {
    if (status !== "authenticated") {
      showMessage("error", "Account deletion is unavailable in demo mode.");
      return;
    }

    if (!confirm("⚠️ This will permanently delete your account and all data within 30 days. This cannot be undone. Continue?")) return;
    
    try {
      const response = await fetch("/api/settings/delete-account", { method: "POST" });
      if (!response.ok) throw new Error("Failed to request deletion");
      
      setDeletionRequested(true);
      showMessage("success", "Account deletion scheduled - you have 30 days to cancel");
    } catch (err) {
      showMessage("error", "Failed to request account deletion");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-hot-pink border-t-transparent mx-auto"></div>
          <p className="text-sm text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">Settings</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Account Settings</h1>
          <p className="mt-2 text-sm text-gray-400">
            HIPAA-first privacy controls and account management
          </p>
        </div>

        {/* Status Messages */}
        {message && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-green-500/40 bg-green-500/10 text-green-400"
                : "border-red-500/40 bg-red-500/10 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-8">
          {/* SECTION 1: ACCOUNT */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-xl font-semibold text-hot-pink">Account</h2>
            
            <div className="space-y-4">
              <div>
              <div className="space-y-2">
                <label className="mb-2 block text-sm text-gray-300">Account Type</label>
                <input
                  type="text"
                  value={
                    settings.role === "PROVIDER"
                      ? "Provider"
                      : settings.role === "ADMIN"
                      ? "Admin"
                      : "Patient"
                  }
                  disabled
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-gray-400"
                />
                <p className="text-xs text-gray-400">
                  Your role is managed by support.
                </p>
              </div>

                <label className="mb-2 block text-sm text-gray-300">Name</label>
                <input
                  type="text"
                  value={settings.name || ""}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-transparent px-3 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={requestPasswordReset}
                  disabled={passwordResetSent}
                >
                  {passwordResetSent ? "✓ Reset Email Sent" : "Reset Password"}
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logOutAllSessions}
                >
                  Log Out of All Sessions
                </Button>
              </div>

              {settings.lastAccessAt && (
                <p className="text-xs text-gray-500">
                  Last access: {new Date(settings.lastAccessAt).toLocaleString()}
                </p>
              )}
            </div>
          </section>

          {/* SECTION 2: PRIVACY & CONSENT (CRITICAL) */}
          <section className="rounded-2xl border-2 border-hot-pink/40 bg-hot-pink/5 p-6">
            <h2 className="mb-2 text-xl font-semibold text-hot-pink">Privacy & Consent</h2>
            <p className="mb-6 text-xs text-gray-400">
              HIPAA-compliant controls for Clinical Summary sharing
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentShare"
                  checked={settings.consentToShareClinicalSummary}
                  onChange={(e) =>
                    setSettings({ ...settings, consentToShareClinicalSummary: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-700 bg-transparent text-hot-pink focus:ring-hot-pink"
                />
                <label htmlFor="consentShare" className="flex-1 text-sm">
                  <span className="font-medium text-white">
                    I consent to share my Clinical Summary with providers
                  </span>
                  <p className="mt-1 text-xs text-gray-400">
                    When enabled, you can generate secure share links for your Clinical Summary.
                    You control who has access and can revoke at any time.
                  </p>
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="p2pSharing"
                  checked={settings.allowProviderToProviderSharing}
                  onChange={(e) =>
                    setSettings({ ...settings, allowProviderToProviderSharing: e.target.checked })
                  }
                  disabled={!settings.consentToShareClinicalSummary}
                  className="mt-1 h-4 w-4 rounded border-gray-700 bg-transparent text-hot-pink focus:ring-hot-pink disabled:opacity-50"
                />
                <label htmlFor="p2pSharing" className="flex-1 text-sm">
                  <span className="font-medium text-white">
                    Allow provider-to-provider sharing
                  </span>
                  <p className="mt-1 text-xs text-gray-400">
                    If enabled, providers you've shared with can forward your Clinical Summary to
                    other providers in your care team. Default: OFF for maximum privacy.
                  </p>
                </label>
              </div>

              {/* Active Shares */}
              {settings.consentToShareClinicalSummary && shareLinks.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white">Active Shares</h3>
                  <div className="space-y-2">
                    {shareLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900/50 p-3"
                      >
                        <div className="flex-1">
                          <p className="text-xs font-mono text-gray-400">
                            ...{link.token.slice(-8)}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Created {new Date(link.createdAt).toLocaleDateString()} • Accessed{" "}
                            {link.accessCount} time{link.accessCount !== 1 ? "s" : ""}
                          </p>
                          {new Date(link.expiresAt) < new Date() && (
                            <p className="mt-1 text-xs text-red-400">Expired</p>
                          )}
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => revokeShareLink(link.token)}
                        >
                          Revoke
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {settings.consentToShareClinicalSummary && shareLinks.length === 0 && (
                <p className="text-xs text-gray-500">
                  No active shares. Visit Clinical Summary to generate a secure share link.
                </p>
              )}
            </div>
          </section>

          {/* SECTION 3: DATA CONTROLS */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-xl font-semibold text-hot-pink">Data Controls</h2>
            
            <div className="space-y-4">
              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={requestDataExport}
                  disabled={exportRequested}
                >
                  {exportRequested ? "✓ Export Requested" : "Request Data Export"}
                </Button>
                <p className="mt-2 text-xs text-gray-400">
                  Download a complete copy of your data in machine-readable format. Delivered via
                  email within 48 hours.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={requestAccountDeletion}
                  disabled={deletionRequested}
                >
                  {deletionRequested ? "⚠️ Deletion Scheduled" : "Request Account Deletion"}
                </Button>
                <p className="mt-2 text-xs text-gray-400">
                  Permanently delete your account and all associated data. 30-day grace period to
                  cancel.
                </p>
                {deletionRequested && (
                  <p className="mt-2 text-xs text-red-400">
                    ⚠️ Your account is scheduled for deletion. Contact support to cancel.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 4: NOTIFICATIONS */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-xl font-semibold text-hot-pink">Notifications</h2>
            
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotificationsEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, emailNotificationsEnabled: e.target.checked })
                }
                className="mt-1 h-4 w-4 rounded border-gray-700 bg-transparent text-hot-pink focus:ring-hot-pink"
              />
              <label htmlFor="emailNotifications" className="flex-1 text-sm">
                <span className="font-medium text-white">Email notifications</span>
                <p className="mt-1 text-xs text-gray-400">
                  Receive important account updates and security alerts via email
                </p>
              </label>
            </div>
          </section>

          {/* SECTION 5: PROVIDER-ONLY SETTINGS */}
          {/* Removed for V1 - will add back when role field is restored */}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={saveSettings}
            disabled={saving}
            isLoading={saving}
          >
            💾 Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
