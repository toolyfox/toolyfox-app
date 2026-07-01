import type { Severity } from "@toolyfox/types";

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatScore(score: number): string {
  return `${Math.round(score)}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function severityColor(severity: Severity): string {
  const colors: Record<Severity, string> = {
    critical: "text-red-600",
    high: "text-orange-500",
    medium: "text-yellow-500",
    low: "text-blue-500",
    info: "text-gray-500",
  };
  return colors[severity];
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
