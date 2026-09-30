"use client";

import React, { useEffect, useState, useRef } from "react";

interface Agent {
  name: string;
  room: "Sentiment" | "Strategy" | "Math";
  action: "BUY" | "SELL" | "HOLD";
  score: number;
  confidence: number;
  latencyMs: number;
}

interface ExecutionStage {
  id: string;
  name: string;
  subsystem: string;
  latencyUs: number;
  status: "OPTIMAL" | "ACTIVE" | "HALTED";
}

interface LogEntry {
  id: string;
  timestamp: string;
  subsystem: string;
  message: string;
  type: "info" | "success" | "warn" | "error";
}

const INITIAL_AGENTS: Agent[] = [
  { name: "The Don", room: "Sentiment", action: "BUY", score: 9.2, confidence: 94.1, latencyMs: 142 },
  { name: "Phantom", room: "Sentiment", action: "BUY", score: 8.8, confidence: 89.4, latencyMs: 165 },
  { name: "Oracle", room: "Sentiment", action: "BUY", score: 9.1, confidence: 92.0, latencyMs: 180 },
  { name: "Caesar", room: "Strategy", action: "BUY", score: 9.8, confidence: 96.5, latencyMs: 110 },
  { name: "Sage", room: "Strategy", action: "BUY", score: 8.9, confidence: 91.2, latencyMs: 125 },
  { name: "Guardian", room: "Strategy", action: "BUY", score: 8.7, confidence: 88.0, latencyMs: 140 },
  { name: "Vanguard", room: "Strategy", action: "BUY", score: 9.4, confidence: 93.8, latencyMs: 115 },
  { name: "Titan", room: "Math", action: "BUY", score: 9.5, confidence: 95.0, latencyMs: 85 },
  { name: "Atlas", room: "Math", action: "BUY", score: 9.0, confidence: 90.5, latencyMs: 92 },
  { name: "Forge", room: "Math", action: "BUY", score: 8.6, confidence: 87.2, latencyMs: 78 },
  { name: "Sentinel", room: "Math", action: "BUY", score: 9.9, confidence: 98.4, latencyMs: 82 },
];

export default function SovereignShowcasePage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [isHalted, setIsHalted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [riskSlider, setRiskSlider] = useState(1.0);
  const [throughput, setThroughput] = useState(1940);
  const [stages, setStages] = useState<ExecutionStage[]>([
    { id: "s1", name: "Signal Ingestion", subsystem: "Kafka / Arrow Pipeline", latencyUs: 82, status: "OPTIMAL" },
    { id: "s2", name: "Price Oracle Verification", subsystem: "Tukey IQR / Hampel Filter", latencyUs: 145, status: "OPTIMAL" },
    { id: "s3", name: "11-Agent Consensus Swarm", subsystem: "AsyncIO Parallel Inference", latencyUs: 4180, status: "OPTIMAL" },
    { id: "s4", name: "Hardware Risk Governor", subsystem: "C++20 SIMD Variance Engine", latencyUs: 18, status: "OPTIMAL" },
    { id: "s5", name: "FIX Execution Bridge", subsystem: "QuickFIX/J 4.4 Direct Venue", latencyUs: 185, status: "OPTIMAL" },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", timestamp: "22:45:01.104", subsystem: "CORE", message: "Sovereign multi-agent telemetry initialized.", type: "info" },
    { id: "2", timestamp: "22:45:01.420", subsystem: "SWARM", message: "11 agents synchronized across Sentiment, Strategy, and Math rooms.", type: "info" },
    { id: "3", timestamp: "22:45:01.815", subsystem: "ORACLE", message: "Pairwise divergence 0.03% within 0.10% threshold [VERIFIED].", type: "success" },
    { id: "4", timestamp: "22:45:02.110", subsystem: "RISK", message: "Drawdown monitor nominal: 0.00% daily / 3.00% circuit ceiling.", type: "info" },
  ]);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Live streaming telemetry simulation
  useEffect(() => {
    if (isPaused || isHalted) return;

    const interval = setInterval(() => {
      setStages((prev) =>
        prev.map((s, idx) => {
          const jitter = Math.floor(Math.random() * 10 - 5);
          const base = [82, 145, 4180, 18, 185][idx];
          return {
            ...s,
            latencyUs: Math.max(12, base + jitter),
            status: isHalted ? "HALTED" : "OPTIMAL",
          };
        })
      );

      setThroughput((prev) => Math.floor(prev + (Math.random() * 30 - 15)));
    }, 1300);

    return () => clearInterval(interval);
  }, [isPaused, isHalted]);

  const pushLog = (subsystem: string, message: string, type: LogEntry["type"]) => {
    const now = new Date();
    const ts = `${now.toTimeString().split(" ")[0]}.${String(now.getMilliseconds()).padStart(3, "0")}`;
    setLogs((prev) => [...prev.slice(-30), { id: String(Date.now()), timestamp: ts, subsystem, message, type }]);
  };

  const handleDispatchSignal = () => {
    if (isHalted) {
      pushLog("CIRCUIT", "DISPATCH REJECTED: Emergency circuit breaker engaged.", "error");
      return;
    }

    pushLog("INGEST", "INCOMING TELEMETRY: EUR/USD 1.08502 (Spread: 0.8 pips)", "info");
    setTimeout(() => {
      pushLog("SWARM", "PARALLEL INFERENCE: 11/11 agents report 94.2% agreement [BUY AUTHORIZED]", "success");
    }, 300);

    setTimeout(() => {
      pushLog("RISK", `INVARIANT CHECK: Max risk allocated ${riskSlider.toFixed(1)}% | All safety gates [PASS]`, "success");
    }, 600);

    setTimeout(() => {
      pushLog("VENUE", "FIX 4.4 ORDER ROUTED: IOC execution filled with zero slippage.", "success");
    }, 900);
  };

  const handleToggleHalt = () => {
    if (isHalted) {
      setIsHalted(false);
      pushLog("CIRCUIT", "CIRCUIT BREAKER RESET: Normal execution state restored.", "success");
    } else {
      setIsHalted(true);
      pushLog("CIRCUIT", "EMERGENCY HALT: All order routing locked down instantly.", "error");
    }
  };

  return (
    <div className="showcase-container">
      {/* 1. RECRUITER EXECUTIVE HEADER */}
      <header className="recruiter-header">
        <div className="profile-summary">
          <div className="brand-row">
            <span className="brand-title">SOVEREIGN COCKPIT</span>
            <span className="brand-badge">ARCHITECTURE DEMONSTRATION</span>
          </div>
          <div className="author-line">
            Architected by <span className="author-name">Usman Abayomi Bamidele</span> · Senior Backend & AI Systems Engineer
          </div>
        </div>

        <div className="cta-group">
          <a
            href="https://github.com/amazing200guy1-a11y"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            GitHub Portfolio (9 Repos)
          </a>
          <a
            href="https://www.linkedin.com/in/usman-bamidele"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            LinkedIn
          </a>
          <a
            href="mailto:usmanbamidele200@gmail.com"
            className="btn-primary"
          >
            Get in Touch / Hire
          </a>
        </div>
      </header>

      {/* 2. RECRUITER CONTEXT & STEALTH NOTICE RIBBON */}
      <div className="disclaimer-strip">
        <div className="disclaimer-left">
          <span className={`pulse-dot ${isHalted ? "red" : ""}`} />
          <span>
            {isHalted
              ? "CIRCUIT BREAKER ENGAGED · EXECUTION GATES LOCKED"
              : "MULTI-AGENT CONSENSUS MESH: ACTIVE · TELEMETRY FEED LIVE"}
          </span>
        </div>
        <div style={{ color: "var(--text-dim)" }}>
          Notice: Proprietary execution kernel & broker bridges operate under stealth NDA. This demo simulates live telemetry.
        </div>
      </div>

      {/* 3. KEY METRICS STRIP */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">Consensus Super-Majority</div>
          <div className="kpi-number" style={{ color: "var(--accent-emerald)" }}>&ge; 92.0%</div>
          <div className="kpi-sub">Strict Fail-Closed Gate</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Active AI Agents</div>
          <div className="kpi-number">11 / 11</div>
          <div className="kpi-sub">3 Analytical Rooms</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Pipeline Throughput</div>
          <div className="kpi-number">{isHalted ? "0" : throughput.toLocaleString()}</div>
          <div className="kpi-sub">Messages / Second</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Execution Budget</div>
          <div className="kpi-number" style={{ color: "var(--accent-blue)" }}>&lt; 500 &micro;s</div>
          <div className="kpi-sub">Sub-ms Target SLA</div>
        </div>
      </section>

      {/* 4. MAIN WORKSTATION: MULTI-AGENT LAYER & PIPELINE */}
      <div className="workstation-layout">
        {/* LEFT PANEL: 11-AGENT DECISION MATRIX */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <div className="panel-heading">Multi-Agent Consensus Layer</div>
              <div className="panel-subheading">11 specialized models evaluating live market state in parallel</div>
            </div>
            <span className="mono" style={{ fontSize: "11px", color: "var(--accent-emerald)", fontWeight: 700 }}>
              AGREEMENT: 94.2% [BUY]
            </span>
          </div>

          <div className="agents-matrix">
            {agents.map((agent) => (
              <div key={agent.name} className="agent-item">
                <div className="agent-top">
                  <span className="agent-title">{agent.name}</span>
                  <span className={`agent-pill ${agent.room.toLowerCase()}`}>
                    {agent.room}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.4rem" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-emerald)" }}>
                    {agent.action} · {agent.confidence}% CONF
                  </span>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {agent.score.toFixed(1)}/10
                  </span>
                </div>
                <div className="agent-stats">
                  <span>Latency: {agent.latencyMs}ms</span>
                  <span>Model: Specialized</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: 5-STAGE PIPELINE & RISK CONTROLS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Sub-ms Pipeline */}
          <div className="panel-card">
            <div className="panel-header">
              <div>
                <div className="panel-heading">Sub-Millisecond Execution Pipeline</div>
                <div className="panel-subheading">Deterministic stage-by-stage profiling</div>
              </div>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-blue)" }}>
                IOC / FOK ENGINE
              </span>
            </div>

            <div className="pipeline-list">
              {stages.map((stage) => (
                <div key={stage.id} className="stage-row">
                  <div>
                    <div className="stage-name">{stage.name}</div>
                    <div className="stage-tech">{stage.subsystem}</div>
                  </div>
                  <div className="stage-metrics">
                    <div className="stage-latency">
                      {isHalted ? "—" : `${stage.latencyUs.toLocaleString()} µs`}
                    </div>
                    <div className="stage-status" style={{ color: isHalted ? "var(--accent-rose)" : "var(--accent-emerald)" }}>
                      {isHalted ? "HALTED" : stage.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Control Buttons */}
            <div className="control-footer">
              <button
                className="btn-primary"
                onClick={handleDispatchSignal}
                disabled={isHalted}
                style={{ opacity: isHalted ? 0.4 : 1 }}
              >
                Dispatch Test Execution Signal
              </button>
              <button
                className="btn-secondary"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? "Resume Telemetry" : "Freeze Stream"}
              </button>
              <button
                className="btn-secondary"
                onClick={handleToggleHalt}
                style={{
                  color: isHalted ? "var(--accent-emerald)" : "var(--accent-rose)",
                  borderColor: isHalted ? "var(--border-emerald)" : "rgba(244, 63, 94, 0.3)",
                }}
              >
                {isHalted ? "Reset Circuit Breaker" : "Engage Emergency Halt"}
              </button>
            </div>
          </div>

          {/* Risk Governor Panel */}
          <div className="panel-card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Deterministic Risk Governor</span>
              <span className="mono" style={{ color: "var(--accent-blue)", fontWeight: 700 }}>
                {riskSlider.toFixed(1)}% Capital Allocation
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={riskSlider}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setRiskSlider(val);
                pushLog("RISK", `Risk cap updated to ${val.toFixed(1)}% equity.`, "warn");
              }}
              style={{ width: "100%", accentColor: "var(--accent-blue)", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-dim)", marginTop: "0.35rem" }}>
              <span>0.1% (Low Exposure)</span>
              <span>2.5% (Institutional Normal)</span>
              <span>5.0% (Hard Max Floor)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. REAL-TIME AUDIT LOG */}
      <div className="stream-console">
        <div className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          SYS_AUDIT_STREAM // Real-Time Execution Log
        </div>
        {logs.map((log) => (
          <div key={log.id} className="log-line">
            <span style={{ color: "var(--text-dim)", marginRight: "0.6rem" }}>[{log.timestamp}]</span>
            <span style={{ color: "var(--accent-blue)", marginRight: "0.6rem" }}>[{log.subsystem}]</span>
            <span
              style={{
                color:
                  log.type === "success"
                    ? "var(--accent-emerald)"
                    : log.type === "warn"
                    ? "var(--accent-amber)"
                    : log.type === "error"
                    ? "var(--accent-rose)"
                    : "var(--text-main)",
              }}
            >
              {log.message}
            </span>
          </div>
        ))}
        <div ref={consoleEndRef} />
      </div>

      {/* 6. RECRUITER PROJECT OVERVIEW & ARCHITECTURE BRIEF */}
      <section style={{ marginTop: "2rem", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "1.75rem 2rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.5rem" }}>Engineering Architecture & System Invariants</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: "0 0 1.25rem", maxWidth: "900px" }}>
          Sovereign Cockpit is the operator telemetry layer for a hybrid quantitative trading system. It fuses a distributed 11-agent AI consensus swarm with a deterministic sub-millisecond execution kernel.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "1.1rem 1.25rem" }}>
            <div style={{ fontWeight: 600, color: "var(--accent-blue)", marginBottom: "0.35rem" }}>1. Multi-Agent Consensus Swarm</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Evaluates market data across Sentiment, Strategy, and Math rooms concurrently via AsyncIO. Enforces a strict 92% weighted consensus gate before authorizing any downstream execution signal.
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "1.1rem 1.25rem" }}>
            <div style={{ fontWeight: 600, color: "var(--accent-emerald)", marginBottom: "0.35rem" }}>2. Deterministic Risk Kernel</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Hardware-floor constraints written with SIMD variance checks and strict capital defense. Features a hard 3% daily drawdown kill-switch with zero override capability.
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "1.1rem 1.25rem" }}>
            <div style={{ fontWeight: 600, color: "var(--accent-amber)", marginBottom: "0.35rem" }}>3. Production Rigor & Testing</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Core execution layers are backed by 240+ automated unit, integration, and chaos tests with a 100% green pass rate, covering HMAC webhook verification and race condition defenses.
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="recruiter-footer">
        <div>
          <strong>Usman Abayomi Bamidele</strong> · Portfolio Showcase Edition
        </div>
        <div>
          Next.js 14 · React 18 · TypeScript Strict · Tailwind-Style Utilities
        </div>
      </footer>
    </div>
  );
}
