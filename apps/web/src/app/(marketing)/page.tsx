import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <span className="text-xl font-bold">ToolyFox</span>
        <nav className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background hover:bg-foreground/90"
          >
            Get Started
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight">
          AI Website Intelligence Platform
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Monitor, analyze, secure, and improve your websites with
          AI-powered insights.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/sign-up"
            className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-8 text-sm font-medium text-background hover:bg-foreground/90"
          >
            Start Free Trial
          </Link>
          <Link
            href="#features"
            className="inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium hover:bg-accent"
          >
            Learn More
          </Link>
        </div>
      </main>
    </div>
  );
}
