import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToolyFox — AI Website Intelligence Platform",
  description:
    "Monitor, analyze, secure, and improve websites using AI-powered insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
