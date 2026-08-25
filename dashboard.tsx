---

### 2. `dashboard.tsx`

```tsx
/**
 * Sovereign-Cockpit-UI — Live Execution & Telemetry Dashboard
 * Next.js 14 + React 18 + TypeScript + Tailwind-style utilities
 */

"use client";

import React, { useEffect, useState } from "react";

interface TelemetryRow {
  id: string;
  stage: string;
  latencyMs: number;
  consensus: number;        // 0–100
  state: "idle" | "active" | "halted" | "approved";
  updatedAt: number;
}

const STAGES = [
  "Signal Ingest",
  "Oracle Check",
  "Agent Swarm",
  "Risk Governor",
  "FIX Hand-off",
] as const;

function stateClass(state: TelemetryRow["state"]): string {
  switch (state) {
    case "approved":
      return "state-approved";
    case "active":
      return "state-active";
    case "halted":
      return "state-halted";
    default:
      return "state-idle";
  }
}

function consensusClass(score: number): string {
  if (score >= 92) return "consensus-high";
  if (score >= 80) return "consensus-mid";
  return "consensus-low";
}

export default function Dashboard() {
  const [rows, setRows] = useState<TelemetryRow[]>([]);

  // Simulated real-time stream (replace with WebSocket in production)
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const next: TelemetryRow[] = STAGES.map((stage, idx) => {
        const baseLatency = [1.2, 0.8, 4.5, 0.6, 3.1][idx];
        const latencyMs = Number((baseLatency + Math.random() * 1.8).toFixed(2));
        const consensus = Math.min(
          100,
          Math.round(78 + Math.random() * 22 + (idx === 2 ? 5 : 0))
        );
        let state: TelemetryRow["state"] = "active";
        if (consensus >= 92 && latencyMs < 6) state = "approved";
        else if (consensus < 80 || latencyMs > 9) state = "halted";

        return {
          id: `\( {stage}- \){now}`,
          stage,
          latencyMs,
          consensus,
          state,
          updatedAt: now,
        };
      });
      setRows(next);
    };

    tick();
    const id = setInterval(tick, 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="cockpit-root" aria-label="Sovereign execution cockpit">
      <header className="cockpit-header">
        <div>
          <h1>Sovereign Cockpit</h1>
          <p className="subtitle">
            Real-time telemetry · latency · agent consensus · execution state
          </p>
        </div>
        <div className="header-meta">
          <span className="live-dot" aria-hidden="true" />
          <span>LIVE</span>
        </div>
      </header>

      <section className="grid-panel" aria-label="Execution data grid">
        <table className="telemetry-grid">
          <thead>
            <tr>
              <th scope="col">Stage</th>
              <th scope="col">Latency (ms)</th>
              <th scope="col">Consensus</th>
              <th scope="col">State</th>
              <th scope="col">Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="grid-row">
                <td className="stage-cell">{r.stage}</td>
                <td className="numeric">{r.latencyMs.toFixed(2)}</td>
                <td>
                  <span className={`consensus-pill ${consensusClass(r.consensus)}`}>
                    {r.consensus}%
                  </span>
                </td>
                <td>
                  <span className={`state-pill ${stateClass(r.state)}`}>
                    {r.state}
                  </span>
                </td>
                <td className="numeric time-cell">
                  {new Date(r.updatedAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="cockpit-footer">
        Next.js 14 · TypeScript · Tailwind-style utilities · HTML5 semantic grid
      </footer>
    </main>
  );
}
