"use client";

import React, { useEffect, useState } from "react";

interface TelemetryRow {
  id: string;
  stage: string;
  latencyMs: number;
  consensus: number;
  state: "idle" | "active" | "halted" | "approved";
  updatedAt: number;
  description: string;
}

interface AgentVote {
  name: string;
  room: "Sentiment" | "Strategy" | "Math";
  score: number;
  confidence: number;
  action: "BUY" | "SELL" | "HOLD";
  latencyMs: number;
}

const AGENTS: AgentVote[] = [
  { name: "The Don", room: "Sentiment", score: 9, confidence: 94, action: "BUY", latencyMs: 142 },
  { name: "Phantom", room: "Sentiment", score: 8, confidence: 89, action: "BUY", latencyMs: 165 },
  { name: "Oracle", room: "Sentiment", score: 9, confidence: 92, action: "BUY", latencyMs: 180 },
  { name: "Caesar", room: "Strategy", score: 10, confidence: 96, action: "BUY", latencyMs: 110 },
  { name: "Sage", room: "Strategy", score: 9, confidence: 91, action: "BUY", latencyMs: 125 },
  { name: "Guardian", room: "Strategy", score: 8, confidence: 88, action: "BUY", latencyMs: 140 },
  { name: "Vanguard", room: "Strategy", score: 9, confidence: 93, action: "BUY", latencyMs: 115 },
  { name: "Titan", room: "Math", score: 9, confidence: 95, action: "BUY", latencyMs: 85 },
  { name: "Atlas", room: "Math", score: 9, confidence: 90, action: "BUY", latencyMs: 92 },
  { name: "Forge", room: "Math", score: 8, confidence: 87, action: "BUY", latencyMs: 78 },
  { name: "Sentinel", room: "Math", score: 10, confidence: 98, action: "BUY", latencyMs: 82 },
];

const STAGES = [
  { name: "Signal Ingest", desc: "Tick feed validation and multi-source time synchronization" },
  { name: "Oracle Verification", desc: "Tukey IQR outlier detection across independent liquidity nodes" },
  { name: "Agent Consensus Swarm", desc: "11-agent parallel inference across Sentiment, Strategy, and Math" },
  { name: "Deterministic Risk Governor", desc: "SIMD variance check and drawdown circuit breaker verification" },
  { name: "FIX Execution Bridge", desc: "Sub-millisecond IOC order serialization to liquidity venues" },
];

export default function SovereignCockpitPage() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "agents" | "governor">("pipeline");
  const [rows, setRows] = useState<TelemetryRow[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [emergencyHalt, setEmergencyHalt] = useState(false);
  const [activeSignal, setActiveSignal] = useState<string | null>(null);
  const [riskSlider, setRiskSlider] = useState(1.0);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // Streaming latency ticks
  useEffect(() => {
    if (isPaused || emergencyHalt) return;

    const tick = () => {
      const now = Date.now();
      const baseLatencies = [1.12, 0.74, 4.35, 0.42, 2.85];

      const nextRows: TelemetryRow[] = STAGES.map((s, idx) => {
        const jitter = Math.random() * 0.85;
        const latencyMs = Number((baseLatencies[idx] + jitter).toFixed(2));
        const consensus = Math.min(100, Math.floor(91 + Math.random() * 9));

        return {
          id: `stage-${idx}`,
          stage: s.name,
          description: s.desc,
          latencyMs,
          consensus,
          state: emergencyHalt ? "halted" : consensus >= 92 ? "approved" : "active",
          updatedAt: now,
        };
      });

      setRows(nextRows);
    };

    tick();
    const id = setInterval(tick, 1400);
    return () => clearInterval(id);
  }, [isPaused, emergencyHalt]);

  const handleSimulateSignal = () => {
    if (emergencyHalt) return;
    setActiveSignal("Processing EUR/USD 1.0850 Long Confluence...");
    setTimeout(() => {
      setActiveSignal("Consensus Verified (94.2% agreement) — Order Authorized.");
      setTimeout(() => setActiveSignal(null), 3000);
    }, 1200);
  };

  return (
    <main className="cockpit-root">
      {/* Top Header */}
      <header className="cockpit-header">
        <div>
          <h1>Sovereign Cockpit</h1>
          <p className="subtitle">
            Interactive Institutional Execution Terminal · 11-Agent AI Swarm · Sub-ms Risk Engine
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {emergencyHalt ? (
            <div className="header-meta" style={{ color: "var(--halted)", background: "rgba(248,113,113,0.15)", borderColor: "rgba(248,113,113,0.3)" }}>
              <span className="live-dot" style={{ background: "var(--halted)" }} />
              <span>CIRCUIT BREAKER: HALTED</span>
            </div>
          ) : (
            <div className="header-meta">
              <span className="live-dot" />
              <span>TELEMETRY: {isPaused ? "PAUSED" : "LIVE"}</span>
            </div>
          )}
        </div>
      </header>

      {/* Interactive Controls Bar */}
      <section style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem", alignItems: "center", justifyContent: "space-between" }}>
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "0.4rem", background: "var(--panel)", padding: "0.3rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <button
            onClick={() => setActiveTab("pipeline")}
            style={{
              background: activeTab === "pipeline" ? "var(--border)" : "transparent",
              color: activeTab === "pipeline" ? "#fff" : "var(--muted)",
              border: "none",
              padding: "0.45rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            ⚡ Pipeline Grid
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            style={{
              background: activeTab === "agents" ? "var(--border)" : "transparent",
              color: activeTab === "agents" ? "#fff" : "var(--muted)",
              border: "none",
              padding: "0.45rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            🧠 11-Agent Voting Room
          </button>
          <button
            onClick={() => setActiveTab("governor")}
            style={{
              background: activeTab === "governor" ? "var(--border)" : "transparent",
              color: activeTab === "governor" ? "#fff" : "var(--muted)",
              border: "none",
              padding: "0.45rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            🛡️ Risk Governor
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button
            onClick={handleSimulateSignal}
            disabled={emergencyHalt}
            style={{
              background: "#38bdf8",
              color: "#030712",
              border: "none",
              padding: "0.45rem 1rem",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: emergencyHalt ? "not-allowed" : "pointer",
              opacity: emergencyHalt ? 0.4 : 1,
            }}
          >
            ▶ Dispatch Test Signal
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            style={{
              background: "var(--panel)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              padding: "0.45rem 0.9rem",
              borderRadius: "6px",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            {isPaused ? "▶ Resume Stream" : "⏸ Pause Stream"}
          </button>

          <button
            onClick={() => setEmergencyHalt(!emergencyHalt)}
            style={{
              background: emergencyHalt ? "var(--approved)" : "rgba(248, 113, 113, 0.15)",
              color: emergencyHalt ? "#000" : "var(--halted)",
              border: "1px solid rgba(248, 113, 113, 0.3)",
              padding: "0.45rem 0.9rem",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            {emergencyHalt ? "✓ Reset Circuit Breaker" : "🛑 Emergency Halt"}
          </button>
        </div>
      </section>

      {/* Live Signal Banner */}
      {activeSignal && (
        <div style={{ background: "rgba(56, 189, 248, 0.12)", border: "1px solid #38bdf8", color: "#38bdf8", padding: "0.75rem 1.25rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span className="live-dot" style={{ background: "#38bdf8" }} />
          <strong>{activeSignal}</strong>
        </div>
      )}

      {/* TAB 1: PIPELINE GRID */}
      {activeTab === "pipeline" && (
        <>
          <section className="metric-strip">
            <div className="metric-card">
              <div className="metric-label">Pipeline State</div>
              <div className="metric-val" style={{ color: emergencyHalt ? "var(--halted)" : "var(--approved)" }}>
                {emergencyHalt ? "LOCKED" : "OPTIMAL"}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Consensus Gate</div>
              <div className="metric-val" style={{ color: "var(--high)" }}>&ge; 92.0%</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Max Risk Per Trade</div>
              <div className="metric-val">{riskSlider.toFixed(1)}% Equity</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Active Agents</div>
              <div className="metric-val">11 / 11 Online</div>
            </div>
          </section>

          <section className="grid-panel">
            <div className="table-wrapper">
              <table className="telemetry-grid">
                <thead>
                  <tr>
                    <th>Execution Stage</th>
                    <th style={{ textAlign: "right" }}>Latency (ms)</th>
                    <th>Consensus</th>
                    <th>State</th>
                    <th style={{ textAlign: "right" }}>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedStage(r.stage === selectedStage ? null : r.stage)}
                      style={{ cursor: "pointer", background: selectedStage === r.stage ? "rgba(56, 189, 248, 0.08)" : undefined }}
                    >
                      <td className="stage-cell">
                        <div>{r.stage}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "2px" }}>{r.description}</div>
                      </td>
                      <td className="numeric">{emergencyHalt ? "—" : r.latencyMs.toFixed(2)}</td>
                      <td>
                        <span className={`consensus-pill ${r.consensus >= 92 ? "consensus-high" : "consensus-mid"}`}>
                          {emergencyHalt ? "0" : r.consensus}% agreement
                        </span>
                      </td>
                      <td>
                        <span className={`state-pill ${emergencyHalt ? "state-halted" : "state-approved"}`}>
                          {emergencyHalt ? "HALTED" : r.state}
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
        </>
      )}

      {/* TAB 2: 11-AGENT VOTING ROOM */}
      {activeTab === "agents" && (
        <section className="grid-panel">
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.1rem" }}>11-Agent Autonomous Swarm</h2>
              <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "0.8rem" }}>
                Real-time multi-model inference breakdown across Sentiment, Strategy, and Math rooms
              </p>
            </div>
            <span className="consensus-pill consensus-high">Super-Majority: 11/11 BUY</span>
          </div>
          <div className="table-wrapper">
            <table className="telemetry-grid">
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Analytical Room</th>
                  <th>Action</th>
                  <th style={{ textAlign: "right" }}>Score (1–10)</th>
                  <th style={{ textAlign: "right" }}>Confidence</th>
                  <th style={{ textAlign: "right" }}>Latency</th>
                </tr>
              </thead>
              <tbody>
                {AGENTS.map((a) => (
                  <tr key={a.name}>
                    <td style={{ fontWeight: 700, color: "#fff" }}>{a.name}</td>
                    <td>
                      <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "4px", background: "var(--border)", color: "var(--muted)" }}>
                        {a.room}
                      </span>
                    </td>
                    <td>
                      <span className="consensus-pill consensus-high">{a.action}</span>
                    </td>
                    <td className="numeric" style={{ fontWeight: 700 }}>{a.score}/10</td>
                    <td className="numeric" style={{ color: "var(--approved)" }}>{a.confidence}%</td>
                    <td className="numeric time-cell">{a.latencyMs} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: RISK GOVERNOR */}
      {activeTab === "governor" && (
        <section className="grid-panel" style={{ padding: "2rem" }}>
          <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem" }}>Deterministic Risk Governor Parameters</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
            Hardware-level constraints executed prior to order dispatch. Zero override capability.
          </p>

          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Maximum Risk Per Trade</span>
              <span style={{ color: "#38bdf8", fontWeight: 700 }}>{riskSlider.toFixed(1)}% of Capital</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={riskSlider}
              onChange={(e) => setRiskSlider(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "#38bdf8", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>
              <span>0.1% (Ultra-Conservative)</span>
              <span>2.5% (Institutional Standard)</span>
              <span>5.0% (Hard Max Floor)</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Drawdown Circuit Breaker</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "0.25rem", color: "var(--approved)" }}>3.00% Daily Cap</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Order Flow Protection</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "0.25rem", color: "var(--approved)" }}>IOC / FOK Direct</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Spread Spike Filter</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "0.25rem", color: "var(--approved)" }}>Auto-Halt &ge; 2.5 pips</div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="cockpit-footer">
        <span>Sovereign Execution Cockpit · Built with Next.js 14 & TypeScript Strict</span>
        <span>Deterministic Architecture · Fail-Closed Invariants</span>
      </footer>
    </main>
  );
}
