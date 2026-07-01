"use client";

import { useState, useEffect } from "react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  scopes: string[];
  lastUsedAt: string | null;
  createdAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [name, setName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/api-keys")
      .then((res) => res.json())
      .then(setKeys);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setNewKey(null);

    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, scopes: ["read"] }),
      });

      if (!res.ok) return;

      const data = await res.json();
      setNewKey(data.key);
      setName("");

      const updated = await fetch("/api/api-keys").then((r) => r.json());
      setKeys(updated);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
      <p className="mt-2 text-muted-foreground">
        Manage API keys for programmatic access.
      </p>

      {newKey && (
        <div className="mt-6 rounded-lg border border-green-500/30 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            Key created! Copy it now — you won&apos;t see it again.
          </p>
          <code className="mt-2 block break-all rounded bg-green-100 px-3 py-2 text-sm font-mono">
            {newKey}
          </code>
        </div>
      )}

      <form onSubmit={handleCreate} className="mt-8 flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Production API"
          required
          className="flex-1 rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Key"}
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {keys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <p className="font-medium">{apiKey.name}</p>
              <code className="text-sm text-muted-foreground font-mono">
                {apiKey.key}
              </code>
              <p className="mt-1 text-xs text-muted-foreground">
                Created {new Date(apiKey.createdAt).toLocaleDateString()}
                {apiKey.lastUsedAt &&
                  ` · Last used ${new Date(apiKey.lastUsedAt).toLocaleDateString()}`}
              </p>
            </div>
            <div className="flex gap-1">
              {apiKey.scopes.map((scope) => (
                <span
                  key={scope}
                  className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize"
                >
                  {scope}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
