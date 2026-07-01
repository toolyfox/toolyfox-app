"use client";

import { useState, useEffect } from "react";

interface Member {
  id: string;
  user: { id: string; name: string; email: string };
  role: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then(setMembers);
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to invite");
        return;
      }

      setInviteEmail("");
      alert("Invitation sent!");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">Team</h1>
      <p className="mt-2 text-muted-foreground">
        Manage your team members and invite new ones.
      </p>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Current Members</h2>
        <div className="mt-4 space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{member.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                {member.role}
              </span>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-sm text-muted-foreground">No members found.</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Invite Member</h2>
        <form onSubmit={handleInvite} className="mt-4 flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@example.com"
            required
            className="flex-1 rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Invite"}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
