const fs = require('fs');
const path = require('path');

const content = `"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

type CalendarSettings = {
  enabled: boolean;
  connected: boolean;
  lastSync: string | null;
  email: string | null;
};

export default function CalendarSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettings | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check for OAuth callback messages
  useEffect(() => {
    const connected = searchParams.get("calendar_connected");
    const error = searchParams.get("calendar_error");

    if (connected === "true") {
      setMessage({ type: "success", text: "Google Calendar connected successfully!" });
      // Refresh calendar settings
      fetchCalendarSettings();
      // Clean URL
      router.replace("/vault/settings");
    } else if (error) {
      const errorMessages: Record<string, string> = {
        denied: "Calendar connection was cancelled.",
        failed: "Failed to connect calendar. Please try again.",
      };
      setMessage({ type: "error", text: errorMessages[error] || "An error occurred." });
      router.replace("/vault/settings");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/vault/settings");
      return;
    }

    if (status === "authenticated") {
      fetchCalendarSettings();
    }
  }, [status, router]);

  const fetchCalendarSettings = async () => {
    try {
      const res = await fetch("/api/vault/calendar");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCalendarSettings(data);
    } catch (error) {
      console.error("Error fetching calendar settings:", error);
      setMessage({ type: "error", text: "Failed to load calendar settings" });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    setMessage(null);
    
    try {
      const res = await fetch("/api/vault/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect" }),
      });

      if (!res.ok) throw new Error("Failed to initiate OAuth");
      
      const data = await res.json();
      
      // Redirect to Google OAuth
      window.location.href = data.authUrl;
    } catch (error) {
      console.error("Error connecting calendar:", error);
      setMessage({ type: "error", text: "Failed to connect calendar" });
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your Google Calendar? This will remove access to calendar events.")) {
      return;
    }

    setDisconnecting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/vault/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      });

      if (!res.ok) throw new Error("Failed to disconnect");

      setMessage({ type: "success", text: "Calendar disconnected successfully" });
      await fetchCalendarSettings();
    } catch (error) {
      console.error("Error disconnecting calendar:", error);
      setMessage({ type: "error", text: "Failed to disconnect calendar" });
    } finally {
      setDisconnecting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 rounded-lg p-8 border border-white/10">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-white/10 rounded w-1/3"></div>
              <div className="h-4 bg-white/10 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Calendar Settings</h1>
            <p className="text-white/60 mt-2">
              Connect your Google Calendar to see upcoming appointments in your Visit Prep
            </p>
          </div>
          <button
            onClick={() => router.push("/vault/settings")}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition border border-white/20"
          >
            ← Back to Settings
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={\`p-4 rounded-lg border \${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }\`}
          >
            {message.text}
          </div>
        )}

        {/* Calendar Integration Card */}
        <div className="bg-white/5 rounded-lg p-8 border border-white/10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                📅 Google Calendar Integration
              </h2>
              <p className="text-white/60 text-sm max-w-2xl">
                Optionally connect your Google Calendar to view upcoming appointments in your
                Visit Prep. This is read-only and will never modify your calendar.
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="bg-black/20 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Connection Status</h3>
                <div className="flex items-center gap-2">
                  {calendarSettings?.connected ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-full text-sm font-medium">
                        ✓ Connected
                      </span>
                      <span className="text-white/60 text-sm">
                        {calendarSettings.email}
                      </span>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-500/20 border border-gray-500/30 text-gray-300 rounded-full text-sm font-medium">
                      ○ Not Connected
                    </span>
                  )}
                </div>
              </div>

              {calendarSettings?.connected ? (
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {disconnecting ? "Disconnecting..." : "Disconnect"}
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connecting ? "Connecting..." : "Connect Google Calendar"}
                </button>
              )}
            </div>

            {calendarSettings?.connected && calendarSettings.lastSync && (
              <div className="text-sm text-white/60">
                Last synced: {new Date(calendarSettings.lastSync).toLocaleString()}
              </div>
            )}
          </div>

          {/* How It Works */}
          <div className="bg-black/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-lg flex-shrink-0">1️⃣</span>
                <div>
                  <h4 className="text-white font-medium">Read-Only Access</h4>
                  <p className="text-white/60 text-sm">
                    We only request calendar.readonly permission - we can never modify your calendar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-lg flex-shrink-0">2️⃣</span>
                <div>
                  <h4 className="text-white font-medium">Smart Filtering</h4>
                  <p className="text-white/60 text-sm">
                    We only show health-related appointments (doctor, clinic, hospital, etc.)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-lg flex-shrink-0">3️⃣</span>
                <div>
                  <h4 className="text-white font-medium">Seamless Integration</h4>
                  <p className="text-white/60 text-sm">
                    Calendar events appear in your Visit Prep alongside user-created appointments
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-lg flex-shrink-0">4️⃣</span>
                <div>
                  <h4 className="text-white font-medium">Optional & Revocable</h4>
                  <p className="text-white/60 text-sm">
                    You can disconnect at any time - no calendar data is stored permanently
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/30">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">🔒 Privacy Notice</h3>
          <p className="text-blue-200/80 text-sm">
            Your calendar data is never shared with third parties. We only access events to display
            them in your Visit Prep. You can revoke access at any time through your Google Account
            settings or by disconnecting above.
          </p>
        </div>
      </div>
    </div>
  );
}
`;

const outputPath = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "vault",
  "settings",
  "page.tsx"
);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content, "utf8");

console.log(
  "✅ Calendar Settings page successfully written to:",
  outputPath
);
