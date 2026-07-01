export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome to ToolyFox. Start by adding a website to monitor.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Websites</h3>
          <p className="mt-1 text-3xl font-bold">0</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No websites added yet
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Trust Score</h3>
          <p className="mt-1 text-3xl font-bold">—</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Run a scan to see your score
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Team Members</h3>
          <p className="mt-1 text-3xl font-bold">1</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You are the only member
          </p>
        </div>
      </div>
    </div>
  );
}
