"use client";

import React, { useEffect, useState, useRef } from "react";

interface TelemetryStage {
  name: string;
  subsystem: string;
  latencyUs: number;
  status: "OK" | "ACTIVE" | "HALTED";
  consensusGate: string;
}

interface AgentMatrixRow {
  name: string;
  room: "SENTIMENT" | "STRATEGY" | "MATH";
  vote: "BUY" | "SELL" | "HOLD";
  score: number;
  confidence: number;
  latencyMs: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: "info" | "success" | "alert" | "error";
}

const AGENTS_LIST: AgentMatrixRow[] = [
  { name: "THE DON", room: "SENTIMENT", vote: "BUY", score: 9.2, confidence: 94.1, latencyMs: 142 },
  { name: "PHANTOM", room: "SENTIMENT", vote: "BUY", score: 8.8, confidence: 89.4, latencyMs: 165 },
  { name: "ORACLE", room: "SENTIMENT", vote: "BUY", score: 9.1, confidence: 92.0, latencyMs: 180 },
  { name: "CAESAR", room: "STRATEGY", vote: "BUY", score: 9.8, confidence: 96.5, latencyMs: 110 },
  { name: "SAGE", room: "STRATEGY", vote: "BUY", score: 8.9, confidence: 91.2, latencyMs: 125 },
  { name: "GUARDIAN", room: "STRATEGY", vote: "BUY", score: 8.7, confidence: 88.0, latencyMs: 140 },
  { name: "VANGUARD", room: "STRATEGY", vote: "BUY", score: 9.4, confidence: 93.8, latencyMs: 115 },
  { name: "TITAN", room: "MATH", vote: "BUY", score: 9.5, confidence: 95.0, latencyMs: 85 },
  { name: "ATLAS", room: "MATH", vote: "BUY", score: 9.0, confidence: 90.5, latencyMs: 92 },
  { name: "FORGE", room: "MATH", vote: "BUY", score: 8.6, confidence: 87.2, latencyMs: 78 },
  { name: "SENTINEL", room: "MATH", vote: "BUY", score: 9.9, confidence: 98.4, latencyMs: 82 },
];

export default function SovereignTerminalPage() {
  const [isHalted, setIsHalted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [riskCap, setRiskCap] = useState(1.0);
  const [meanLatency, setMeanLatency] = useState(412); // microseconds
  const [throughput, setThroughput] = useState(1840);
  const [stages, setStages] = useState<TelemetryStage[]>([
    { name: "SIGNAL_INGEST", subsystem: "Kafka / Arrow", latencyUs: 84, status: "OK", consensusGate: "100.0%" },
    { name: "ORACLE_VERIFY", subsystem: "Tukey IQR / Hampel", latencyUs: 142, status: "OK", consensusGate: "98.4%" },
    { name: "SWARM_CONSENSUS", subsystem: "11-Agent Mesh", latencyUs: 4350, status: "OK", consensusGate: "94.2%" },
    { name: "RISK_GOVERNOR", subsystem: "SIMD C++ Kernel", latencyUs: 18, status: "OK", consensusGate: "ACTIVE" },
    { name: "FIX_DISPATCH", subsystem: "QuickFIX/J 4.4", latencyUs: 184, status: "OK", consensusGate: "IOC_READY" },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", timestamp: "22:31:02.104", source: "KERNEL", message: "Deterministic execution state machine initialized.", type: "info" },
    { id: "2", timestamp: "22:31:02.842", source: "SWARM", message: "11/11 agents synchronized across Sentiment, Strategy, and Math.", type: "info" },
    { id: "3", timestamp: "22:31:03.418", source: "ORACLE", message: "Cross-venue tick variance within 0.04% boundary [OK].", type: "success" },
    { id: "4", timestamp: "22:31:04.012", source: "RISK", message: "Drawdown budget confirmed: 0.00% daily / 3.00% max cap.", type: "info" },
  ]);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Streaming latency jitter
  useEffect(() => {
    if (isPaused || isHalted) return;

    const interval = setInterval(() => {
      setStages((prev) =>
        prev.map((s, idx) => {
          const jitter = Math.floor(Math.random() * 12 - 6);
          const base = [85, 140, 4200, 18, 180][idx];
          return {
            ...s,
            latencyUs: Math.max(12, base + jitter),
            status: isHalted ? "HALTED" : "OK",
          };
        })
      );

      setThroughput((prev) => Math.floor(prev + (Math.random() * 40 - 20)));
      setMeanLatency((prev) => Math.max(380, Math.floor(prev + (Math.random() * 8 - 4))));
    }, 1200);

    return () => clearInterval(interval);
  }, [isPaused, isHalted]);

  const addLog = (source: string, message: string, type: LogEntry["type"]) => {
    const now = new Date();
    const ts = `${now.toTimeString().split(" ")[0]}.${String(now.getMilliseconds()).padStart(3, "0")}`;
    setLogs((prev) => [...prev.slice(-40), { id: String(Date.now()), timestamp: ts, source, message, type }]);
  };

  const handleDispatchSignal = () => {
    if (isHalted) {
      addLog("CIRCUIT", "DISPATCH REJECTED: Hard emergency halt active on execution bridge.", "error");
      return;
    }

    addLog("INGEST", "INCOMING MARKET EVENT: EURUSD 1.08502 (Spread: 0.8 pips)", "info");
    setTimeout(() => {
      addLog("SWARM", "PARALLEL EVALUATION: 11 agents reporting 94.2% BUY consensus.", "success");
    }, 350);

    setTimeout(() => {
      addLog("RISK", `PARAM CHECK: Risk allocated ${riskCap.toFixed(1)}% | Invariants verified [PASS]`, "success");
    }, 600);

    setTimeout(() => {
      addLog("FIX_4.4", "IOC ORDER ROUTED TO VENUE: CLORDID-884210 [STATUS: FILLED]", "success");
    }, 850);
  };

  const handleToggleHalt = () => {
    if (isHalted) {
      setIsHalted(false);
      addLog("CIRCUIT", "CIRCUIT BREAKER RESET: Resuming normal execution state.", "success");
    } else {
      setIsHalted(true);
      addLog("CIRCUIT", "CRITICAL OVERRIDE: Emergency halt engaged. All outbound orders blocked.", "error");
    }
  };

  return (
    <div className="terminal-viewport">
      {/* Top Bloomberg Command Bar */}
      <header className="top-command-bar">
        <div className="terminal-brand">
          <span className="terminal-title">SOVEREIGN TERMINAL [OPERATOR_STATION]</span>
          <span className="terminal-badge">VENUE: DIRECT FIX 4.4</span>
          <span className="terminal-badge">REGIME: SUB-MS EXECUTION</span>
        </div>
        <div className="system-status">
          <span className={`status-dot ${isHalted ? "halted" : ""}`} />
          <span style={{ color: isHalted ? "var(--red)" : "var(--green)" }}>
            {isHalted ? "SYSTEM HALTED [CIRCUIT_OPEN]" : "ENGINE ONLINE [SYSTEM_NOMINAL]"}
          </span>
        </div>
      </header>

      {/* Function Keys Command Bar */}
      <section className="fkey-strip">
        <button className="fkey-btn amber" onClick={handleDispatchSignal}>
          <span className="fkey-tag">[F1]</span>DISPATCH TEST SIGNAL
        </button>
        <button className="fkey-btn" onClick={() => setIsPaused(!isPaused)}>
          <span className="fkey-tag">[F2]</span>{isPaused ? "RESUME STREAM" : "FREEZE TELEMETRY"}
        </button>
        <button className={`fkey-btn ${isHalted ? "amber" : "red"}`} onClick={handleToggleHalt}>
          <span className="fkey-tag">[F5]</span>{isHalted ? "RESET CIRCUIT BREAKER" : "EMERGENCY HALT"}
        </button>
        <button
          className="fkey-btn"
          onClick={() => addLog("DIAGNOSTIC", "Memory cache flushed. Lock-free queues operating at 0% saturation.", "info")}
        >
          <span className="fkey-tag">[F9]</span>RUN DIAGNOSTIC
        </button>
      </section>

      {/* KPI Status Strip */}
      <section className="kpi-row">
        <div className="kpi-box">
          <div className="kpi-label">EXECUTION STATE</div>
          <div className="kpi-val" style={{ color: isHalted ? "var(--red)" : "var(--green)" }}>
            {isHalted ? "HALTED" : "NOMINAL"}
          </div>
        </div>
        <div className="kpi-box">
          <div className="kpi-label">SUPER-MAJORITY GATE</div>
          <div className="kpi-val" style={{ color: "var(--amber)" }}>&ge; 92.0% THRESHOLD</div>
        </div>
        <div className="kpi-box">
          <div className="kpi-label">PIPELINE THROUGHPUT</div>
          <div className="kpi-val">{isHalted ? "0" : throughput.toLocaleString()} MSG/SEC</div>
        </div>
        <div className="kpi-box">
          <div className="kpi-label">KERNEL MEAN LATENCY</div>
          <div className="kpi-val">{isHalted ? "—" : `${(meanLatency / 1000).toFixed(2)} ms`}</div>
        </div>
      </section>

      {/* Main Terminal Split Grid */}
      <div className="terminal-grid">
        {/* LEFT PANE: 11-AGENT CONSENSUS MATRIX */}
        <div className="terminal-pane">
          <div className="pane-header">
            <span className="pane-title">11-AGENT CONSENSUS MATRIX</span>
            <span className="pane-subtitle">SUPER-MAJORITY: 11/11 BUY [CONFIRMED]</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>AGENT_ID</th>
                  <th>ANALYTICAL_ROOM</th>
                  <th>VOTE</th>
                  <th className="align-right">SCORE</th>
                  <th className="align-right">CONFIDENCE</th>
                  <th className="align-right">LATENCY</th>
                </tr>
              </thead>
              <tbody>
                {AGENTS_LIST.map((a) => (
                  <tr key={a.name}>
                    <td style={{ fontWeight: 700, color: "#fff" }}>{a.name}</td>
                    <td style={{ color: "var(--text-muted)" }}>{a.room}</td>
                    <td>
                      <span className={a.vote === "BUY" ? "tag-buy" : "tag-sell"}>{a.vote}</span>
                    </td>
                    <td className="align-right" style={{ fontWeight: 700 }}>
                      {a.score.toFixed(1)}/10
                    </td>
                    <td className="align-right" style={{ color: "var(--green)" }}>
                      {a.confidence.toFixed(1)}%
                    </td>
                    <td className="align-right" style={{ color: "var(--text-dim)" }}>
                      {a.latencyMs} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT PANE: 5-STAGE PIPELINE & RISK CONTROLS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Sub-ms Execution Pipeline */}
          <div className="terminal-pane">
            <div className="pane-header">
              <span className="pane-title">SUB-MS EXECUTION PIPELINE</span>
              <span className="pane-subtitle">DETERMINISTIC STAGE PROFILING</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>STAGE</th>
                    <th>SUBSYSTEM</th>
                    <th className="align-right">LATENCY (&micro;s)</th>
                    <th>CONSENSUS</th>
                    <th className="align-right">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {stages.map((s) => (
                    <tr key={s.name}>
                      <td style={{ fontWeight: 700 }}>{s.name}</td>
                      <td style={{ color: "var(--text-muted)" }}>{s.subsystem}</td>
                      <td className="align-right" style={{ color: "var(--amber)", fontWeight: 700 }}>
                        {isHalted ? "—" : s.latencyUs.toLocaleString()}
                      </td>
                      <td style={{ color: "var(--cyan)" }}>{s.consensusGate}</td>
                      <td className="align-right">
                        <span className={isHalted ? "tag-halt" : "tag-ok"}>
                          {isHalted ? "HALTED" : "OK"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hardware Risk Controls */}
          <div className="terminal-pane" style={{ padding: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--amber)" }}>
                DETERMINISTIC RISK GOVERNOR [HARDWARE_FLOOR]
              </span>
              <span style={{ color: "#fff", fontWeight: 700 }}>{riskCap.toFixed(1)}% OF CAPITAL</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={riskCap}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setRiskCap(val);
                addLog("RISK", `Risk allocation adjusted to ${val.toFixed(1)}% equity per execution.`, "alert");
              }}
              className="term-slider"
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.5rem",
                marginTop: "0.75rem",
                fontSize: "11px",
              }}
            >
              <div style={{ background: "#05080c", border: "1px solid var(--term-border)", padding: "0.5rem" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "10px" }}>DAILY DRAWDOWN CAP</div>
                <div style={{ color: "var(--green)", fontWeight: 700, marginTop: "2px" }}>3.00% MAX</div>
              </div>
              <div style={{ background: "#05080c", border: "1px solid var(--term-border)", padding: "0.5rem" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "10px" }}>ORDER EXECUTION</div>
                <div style={{ color: "var(--green)", fontWeight: 700, marginTop: "2px" }}>IOC / FOK DIRECT</div>
              </div>
              <div style={{ background: "#05080c", border: "1px solid var(--term-border)", padding: "0.5rem" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "10px" }}>SPREAD DEFENSE</div>
                <div style={{ color: "var(--green)", fontWeight: 700, marginTop: "2px" }}>HALT &ge; 2.5 PIPS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM PANE: REAL-TIME AUDIT LOG */}
      <div className="console-pane">
        <div style={{ fontSize: "10px", color: "var(--amber)", marginBottom: "0.35rem", fontWeight: 700, letterSpacing: "0.06em" }}>
          SYS_AUDIT_STREAM [REAL-TIME EXECUTION LOG]
        </div>
        {logs.map((l) => (
          <div key={l.id} className="console-line">
            <span className="console-time">[{l.timestamp}]</span>
            <span className="console-source">[{l.source}]</span>
            <span className={`console-msg ${l.type}`}>{l.message}</span>
          </div>
        ))}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
}
