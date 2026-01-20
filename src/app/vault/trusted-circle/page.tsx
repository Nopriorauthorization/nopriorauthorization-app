"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";

type CircleMember = {
  id: string;
  name: string;
  email: string;
  relationship: string;
  permissions: string[];
  status: "active" | "pending" | "expired";
  invitedAt: string;
  expiresAt?: string;
};

export default function TrustedCirclePage() {
  const [members, setMembers] = useState<CircleMember[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRelationship, setInviteRelationship] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expirationDays, setExpirationDays] = useState(30);

  const permissionOptions = [
    { id: "view-snapshot", label: "View Health Snapshot" },
    { id: "view-documents", label: "View Documents" },
    { id: "view-appointments", label: "View Appointments" },
    { id: "view-timeline", label: "View Timeline" },
    { id: "view-providers", label: "View Providers" },
    { id: "add-documents", label: "Add Documents" },
  ];

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const res = await fetch("/api/vault/trusted-circle");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error("Failed to load:", error);
    }
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const sendInvite = async () => {
    if (!inviteName || !inviteEmail || selectedPermissions.length === 0) return;

    try {
      const res = await fetch("/api/vault/trusted-circle/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inviteName,
          email: inviteEmail,
          relationship: inviteRelationship,
          permissions: selectedPermissions,
          expirationDays,
        }),
      });

      if (res.ok) {
        await loadMembers();
        setShowInvite(false);
        setInviteName("");
        setInviteEmail("");
        setInviteRelationship("");
        setSelectedPermissions([]);
      }
    } catch (error) {
      console.error("Failed to send invite:", error);
    }
  };

  const revokeMember = async (id: string) => {
    try {
      const res = await fetch(`/api/vault/trusted-circle/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Failed to revoke:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/vault"
            className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
          >
            ← Back to Sacred Vault
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Trusted Circle
          </h1>
          <p className="text-xl text-gray-400">
            Share vault access with family or providers — with granular control over what they see.
          </p>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Circle Members</h2>
            <Button onClick={() => setShowInvite(true)}>Invite Someone</Button>
          </div>

          {members.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">No Members Yet</h3>
              <p className="text-gray-400 mb-6">
                Invite family members or caregivers to access parts of your health vault.
              </p>
            </div>
          )}

          {members.length > 0 && (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white/5 rounded-xl border border-white/10 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-400">{member.email}</p>
                      {member.relationship && (
                        <p className="text-xs text-gray-500 mt-1">{member.relationship}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          member.status === "active"
                            ? "bg-green-500/20 text-green-300"
                            : member.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {member.status}
                      </span>
                      <button
                        onClick={() => revokeMember(member.id)}
                        className="text-sm text-gray-400 hover:text-red-400 transition"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {member.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="text-xs px-3 py-1 rounded-full bg-pink-500/20 text-pink-300"
                      >
                        {perm.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>

                  {member.expiresAt && (
                    <p className="text-xs text-gray-500 mt-3">
                      Expires: {new Date(member.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {showInvite && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
            <div className="bg-gray-900 rounded-2xl border border-white/20 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-6">Invite to Trusted Circle</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Relationship</label>
                  <input
                    type="text"
                    value={inviteRelationship}
                    onChange={(e) => setInviteRelationship(e.target.value)}
                    placeholder="e.g., Spouse, Parent, Caregiver"
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Permissions</label>
                  <div className="space-y-2">
                    {permissionOptions.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="w-5 h-5 rounded border-white/20 bg-white/10 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-sm">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Access Duration</label>
                  <select
                    value={expirationDays}
                    onChange={(e) => setExpirationDays(Number(e.target.value))}
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={365}>1 year</option>
                    <option value={-1}>Permanent</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button onClick={sendInvite} className="flex-1">
                    Send Invite
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowInvite(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span>🔒</span> Privacy & Security
          </h3>
          <p className="text-sm text-gray-300">
            All members receive read-only access unless specifically granted permission. You can
            revoke access at any time. We'll notify you whenever someone accesses your vault.
          </p>
        </div>
      </div>
    </div>
  );
}
