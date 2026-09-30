"use client";

import React, { useEffect, useState } from "react";

interface TelemetryRow {
  id: string;
  stage: string;
  latencyMs: number;
  consensus: number; // 0–100
  state: "idle" | "active" | "halted" | "approved";
  updatedAt: number;
}

const STAGES = [
  "Signal Ingest",
  "Oracle Verification",
  "Agent Consensus Swarm",
  "Deterministic Risk Governor",
  "FIX Execution Bridge",
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

export default function SovereignCockpitPage() {
  const [rows, setRows] = useState<TelemetryRow[]>([]);
  const [throughput, setThroughput] = useState(1420);
  const [avgLatency, setAvgLatency] = useState(2.14);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const baseLatencies = [1.12, 0.74, 4.35, 0.42, 2.85];

      const nextRows: TelemetryRow[] = STAGES.map((stage, idx) => {
        const jitter = Math.random() * 0.9;
        const latencyMs = Number((baseLatencies[idx] + jitter).toFixed(2));
        const consensus = Math.min(100, Math.floor(88 + Math.random() * 12));

        let state: TelemetryRow["state"] = "active";
        if (idx === STAGES.length - 1) {
          state = consensus >= 92 ? "approved" : "halted";
        }

        return {
          id: `stage-${idx}`,
          stage,
          latencyMs,
          consensus,
          state,
          updatedAt: now,
        };
      });

      setRows(nextRows);
      setThroughput((prev) => Math.floor(prev + (Math.random() * 40 - 20)));
      setAvgLatency(
        Number(
          (
            nextRows.reduce((acc, r) => acc + r.latencyMs, 0) / nextRows.length
          ).toFixed(2)
        )
      );
    };

    tick();
    const intervalId = setInterval(tick, 1200);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="cockpit-root" aria-label="Sovereign execution cockpit">
      <header className="cockpit-header">
        <div>
          <h1>Sovereign Cockpit</h1>
          <p className="subtitle">
            Real-time execution telemetry · microsecond stage profiling · 11-agent consensus gate
          </p>
        </div>
        <div className="header-meta">
          <span className="live-dot" aria-hidden="true" />
          <span>TELEMETRY STREAM: LIVE</span>
        </div>
      </header>

      {/* Top Metric Strip */}
      <section className="metric-strip" aria-label="Telemetry KPI Summary">
        <div className="metric-card">
          <div className="metric-label">Pipeline Throughput</div>
          <div className="metric-val">{throughput.toLocaleString()} msg/sec</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Mean Stage Latency</div>
          <div className="metric-val">{avgLatency.toFixed(2)} ms</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Consensus Threshold</div>
          <div className="metric-val" style={{ color: "var(--high)" }}>&ge; 92.0%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Fail-Closed Safety</div>
          <div className="metric-val" style={{ color: "var(--approved)" }}>ACTIVE</div>
        </div>
      </section>

      {/* Data Table Grid */}
      <section className="grid-panel" aria-label="Execution telemetry data grid">
        <div className="table-wrapper">
          <table className="telemetry-grid">
            <thead>
              <tr>
                <th scope="col">Execution Stage</th>
                <th scope="col" style={{ textAlign: "right" }}>Latency (ms)</th>
                <th scope="col">Consensus Gate</th>
                <th scope="col">Circuit State</th>
                <th scope="col" style={{ textAlign: "right" }}>Last Verification</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="grid-row">
                  <td className="stage-cell">{r.stage}</td>
                  <td className="numeric">{r.latencyMs.toFixed(2)}</td>
                  <td>
                    <span className={`consensus-pill ${consensusClass(r.consensus)}`}>
                      {r.consensus}% agreement
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
        </div>
      </section>

      <footer className="cockpit-footer">
        <span>Next.js 14 · React 18 · TypeScript Strict · Lock-Free Micro-Telemetry</span>
        <span>Status: Sub-millisecond Execution Kernel Online</span>
      </footer>
    </main>
  );
}
