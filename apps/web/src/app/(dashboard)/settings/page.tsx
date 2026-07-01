"use client";

import { useState, useEffect } from "react";

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

export default function SettingsPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/organizations")
      .then((res) => res.json())
      .then((data) => {
        setOrg(data);
        setName(data.name);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/organizations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error ?? "Failed to save");
        return;
      }

      setMessage("Settings saved");
    } catch {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (!org) return <p>Loading...</p>;

  return (
    <div className="max-w-lg">
      <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Manage your organization details.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Organization Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Slug</label>
          <p className="mt-1 text-sm text-muted-foreground">{org.slug}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Plan</label>
          <p className="mt-1 text-sm font-medium capitalize">{org.plan}</p>
        </div>

        {message && (
          <p
            className={`text-sm ${message === "Settings saved" ? "text-green-600" : "text-red-600"}`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
