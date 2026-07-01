export type Plan = "free" | "pro" | "business" | "enterprise";

export type MemberRole = "owner" | "admin" | "member" | "viewer";

export type ScanType =
  | "full"
  | "security"
  | "performance"
  | "seo"
  | "dns"
  | "ssl"
  | "malware";

export type ScanStatus = "pending" | "running" | "completed" | "failed";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type ReportType = "full" | "security" | "performance" | "seo";

export type ReportStatus = "generating" | "ready" | "failed";

export type AlertChannel = "email" | "slack" | "webhook";

export type AlertType =
  | "downtime"
  | "ssl_expiry"
  | "malware"
  | "score_drop"
  | "custom";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "incomplete";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  orgId: string;
  role: MemberRole;
  createdAt: string;
}

export interface Website {
  id: string;
  orgId: string;
  url: string;
  name: string;
  domain: string;
  isActive: boolean;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Scan {
  id: string;
  websiteId: string;
  type: ScanType;
  status: ScanStatus;
  score?: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface ScanResult {
  id: string;
  scanId: string;
  category: string;
  severity: Severity;
  title: string;
  description: string;
  remediation?: string;
  rawData?: Record<string, unknown>;
  createdAt: string;
}

export interface TrustScore {
  id: string;
  websiteId: string;
  overall: number;
  security: number;
  performance: number;
  seo: number;
  dns: number;
  ssl: number;
  uptime: number;
  calculatedAt: string;
}

export interface Report {
  id: string;
  orgId: string;
  websiteId: string;
  type: ReportType;
  status: ReportStatus;
  pdfUrl?: string;
  isWhiteLabel: boolean;
  branding?: Record<string, unknown>;
  createdAt: string;
}

export interface Alert {
  id: string;
  websiteId: string;
  type: AlertType;
  channel: AlertChannel;
  recipient: string;
  isEnabled: boolean;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  orgId: string;
  name: string;
  key: string;
  scopes: string[];
  lastUsedAt?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  orgId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
}
