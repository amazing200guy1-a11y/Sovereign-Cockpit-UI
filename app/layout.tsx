import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sovereign Cockpit — Institutional Telemetry & Execution Grid",
  description: "Real-time execution telemetry, sub-millisecond stage latency, and consensus verification grid.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
