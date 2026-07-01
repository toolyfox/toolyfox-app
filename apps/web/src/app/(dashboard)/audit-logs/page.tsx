"use client";

import { useState, useEffect } from "react";

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  details: Record<string, unknown> | null;
  createdAt: string;
  user: { name: string; email: string } | null;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    fetch("/api/audit-logs")
      .then((res) => res.json())
      .then(setLogs);
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
      <p className="mt-2 text-muted-foreground">
        Track all actions performed in your organization.
      </p>

      <div className="mt-8 space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start justify-between rounded-lg border p-4"
          >
            <div>
              <p className="font-medium capitalize">{log.action}</p>
              <p className="text-sm text-muted-foreground">{log.resource}</p>
              {log.user && (
                <p className="text-xs text-muted-foreground">
                  by {log.user.name}
                </p>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(log.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No audit logs yet. Actions will appear here as you use ToolyFox.
          </p>
        )}
      </div>
    </div>
  );
}
