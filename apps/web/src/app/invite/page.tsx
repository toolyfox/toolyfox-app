"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/team/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to accept invite");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return <p className="text-center text-muted-foreground">Invalid invitation link.</p>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold">Team Invitation</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;ve been invited to join an organization on ToolyFox.
        </p>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          onClick={handleAccept}
          disabled={loading}
          className="mt-6 rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-50"
        >
          {loading ? "Accepting..." : "Accept Invitation"}
        </button>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <InviteContent />
    </Suspense>
  );
}
