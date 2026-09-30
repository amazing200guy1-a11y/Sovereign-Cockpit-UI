"use client";
import React, { useEffect, useState, useRef } from "react";

interface AgentDetail {
  id: string;
  name: string;
  room: "Sentiment" | "Strategy" | "Math";
  model: string;
  weight: number;
  vote: "BUY" | "SELL" | "HOLD";
  score: number;
  confidence: number;
  latencyMs: number;
  logic: string;
}

const AGENTS: AgentDetail[] = [
  { id: "market", name: "Market Agent", room: "Sentiment", model: "Claude 3.5 Sonnet", weight: 0.30,
    vote: "BUY", score: 9.2, confidence: 94.1, latencyMs: 142, logic: "Order-flow delta & liquidity imbalance analysis across London/NY sessions." },
  { id: "signal", name: "Signal Agent", room: "Strategy", model: "GPT-4o", weight: 0.40,
    vote: "BUY", score: 9.6, confidence: 96.5, latencyMs: 110, logic: "FVG fair value gap mitigation & multi-timeframe market structure sweeps." },
  { id: "ml", name: "ML Predictor", room: "Strategy", model: "Transformer-V8", weight: 0.15,
    vote: "BUY", score: 8.8, confidence: 91.2, latencyMs: 85, logic: "Sequence forecasting over 256-tick feature embeddings with Hampel filtering." },
  { id: "risk", name: "Risk Governor", room: "Math", model: "C++20 SIMD Kernel", weight: 0.15,
    vote: "BUY", score: 9.9, confidence: 99.1, latencyMs: 18, logic: "Deterministic Kelly criterion sizing & hard 3.00% daily drawdown ceiling." },
];

const STAGES = [
  { id: "s1", name: "1. Ingestion", tech: "Kafka / Arrow", latency: "82 µs", detail: "Microsecond tick ingestion & pairwise Hampel outlier filtering." },
  { id: "s2", name: "2. Oracle", tech: "Tukey IQR", latency: "145 µs", detail: "Multi-venue L2 price comparison to prevent toxic arbitrage slip." },
  { id: "s3", name: "3. Swarm", tech: "11-Agent LLM", latency: "4.1 ms", detail: "Parallel AsyncIO inference enforcing strict ≥92.0% consensus gate." },
  { id: "s4", name: "4. Risk SIMD", tech: "C++20 Hardware", latency: "18 µs", detail: "Hardware-floor capital defense & VaR(95%) stress variance bounds." },
  { id: "s5", name: "5. Execution", tech: "FIX 4.4 Engine", latency: "185 µs", detail: "Sub-millisecond IOC/FOK order routing to liquidity gateways." },
];

export default function SovereignCockpit() {
  const [selectedAgent, setSelectedAgent] = useState<AgentDetail | null>(null);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [showOverviewModal, setShowOverviewModal] = useState(false);
  const [activeSignalStage, setActiveSignalStage] = useState<number | null>(null);
  const [signalStatus, setSignalStatus] = useState<string>("Ready to test");
  const [isHalted, setIsHalted] = useState(false);
  const [agreement, setAgreement] = useState(94.2);
  const [msgs, setMsgs] = useState(1940);
  const [logs, setLogs] = useState<{ id: string; ts: string; tag: string; msg: string; type: string }[]>([
    { id: "1", ts: "01:30:00.104", tag: "CORE", msg: "Sovereign operator grid initialized. Telemetry live.", type: "info" },
    { id: "2", ts: "01:30:00.412", tag: "SWARM", msg: "11 agents synchronized across Sentiment, Strategy, and Math rooms.", type: "success" },
    { id: "3", ts: "01:30:00.780", tag: "ORACLE", msg: "Pairwise price divergence 0.02% [VERIFIED NOMINAL].", type: "success" },
    { id: "4", ts: "01:30:01.050", tag: "RISK", msg: "Drawdown governor: 0.12% daily / 3.00% hard circuit breaker ceiling.", type: "info" },
  ]);

  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Live telemetry pulse
  useEffect(() => {
    if (isHalted) return;
    const iv = setInterval(() => {
      setMsgs((p) => Math.floor(p + Math.random() * 26 - 13));
      setAgreement((p) => Math.min(98.5, Math.max(90.2, p + (Math.random() * 0.3 - 0.15))));
    }, 2200);
    return () => clearInterval(iv);
  }, [isHalted]);

  const pushLog = (tag: string, msg: string, type: "info" | "success" | "warn" | "error" = "info") => {
    const now = new Date();
    const ts = `${now.toTimeString().split(" ")[0]}.${String(now.getMilliseconds()).padStart(3, "0")}`;
    setLogs((prev) => [...prev.slice(-35), { id: String(Date.now() + Math.random()), ts, tag, msg, type }]);
  };

  // Visibly propagate demo signal through the 5 pipeline stages
  const runDemoSignal = () => {
    if (isHalted) {
      pushLog("CIRCUIT", "Signal dispatch blocked: Emergency circuit breaker engaged.", "error");
      return;
    }
    setActiveSignalStage(0);
    setSignalStatus("1/5 Ingesting EUR/USD tick...");
    pushLog("INGEST", "INCOMING TICK: EUR/USD @ 1.08502 (Spread: 0.6 pips).", "info");

    setTimeout(() => {
      setActiveSignalStage(1);
      setSignalStatus("2/5 Oracle verifying L2 pricing...");
      pushLog("ORACLE", "Hampel check PASSED. Multi-venue divergence: 0.015%.", "success");
    }, 550);

    setTimeout(() => {
      setActiveSignalStage(2);
      setSignalStatus("3/5 Swarm evaluating (11 LLMs)...");
      pushLog("SWARM", "11/11 agents consensus: 94.6% agreement [BUY AUTHORIZED].", "success");
    }, 1200);

    setTimeout(() => {
      setActiveSignalStage(3);
      setSignalStatus("4/5 SIMD risk bounds checking...");
      pushLog("RISK", "Hardware variance check cleared: risk 1.0% equity allocation.", "info");
    }, 1800);

    setTimeout(() => {
      setActiveSignalStage(4);
      setSignalStatus("5/5 FIX 4.4 routing to venue...");
      pushLog("EXEC", "IOC order filled @ 1.08502 (zero slippage, latency: 185 µs).", "success");
    }, 2350);

    setTimeout(() => {
      setActiveSignalStage(null);
      setSignalStatus("Signal completed successfully (248 µs kernel budget).");
    }, 3200);
  };

  return (
    <div className="cockpit-root">
      {/* 1. PROJECT IDENTITY PANEL */}
      <header className="identity-panel">
        <div className="id-left">
          <div className="avatar-chip">UB</div>
          <div>
            <div className="author-name-row">
              <span className="author-name">Usman Abayomi Bamidele</span>
              <span className="role-tag">Senior Backend &amp; AI Systems Engineer</span>
            </div>
            <p className="project-desc">
              Operator telemetry cockpit for a distributed 11-agent quantitative consensus swarm and sub-millisecond risk execution kernel.
            </p>
          </div>
        </div>
        <div className="id-right">
          <button className="btn-overview" onClick={() => setShowOverviewModal(true)}>
            View Project Overview &amp; Architecture
          </button>
          <a href="https://github.com/amazing200guy1-a11y" target="_blank" rel="noreferrer" className="btn-link">GitHub (9 Repos)</a>
          <a href="https://linkedin.com/in/usman-bamidele" target="_blank" rel="noreferrer" className="btn-link">LinkedIn</a>
          <a href="mailto:usmanbamidele200@gmail.com" className="btn-hire">Hire Me</a>
        </div>
      </header>

      {/* 2. DEMO MODE INDICATOR BANNER */}
      <div className="demo-banner">
        <div className="demo-badge">
          <span className="demo-dot" />
          <span>PORTFOLIO DEMO MODE · SIMULATED TELEMETRY</span>
        </div>
        <div className="demo-text">
          Live streaming figures are generated via deterministic replay. Proprietary FIX bridges &amp; risk kernels operate under stealth NDA.
        </div>
      </div>

      {/* 3. PIPELINE PROPAGATION RUNNER */}
      <section className="pipeline-strip">
        <div className="pipeline-header">
          <div>
            <span className="section-title">Deterministic Execution Pipeline</span>
            <span className="section-sub">Select any stage to inspect profiling telemetry or trigger a live test signal</span>
          </div>
          <div className="pipeline-actions">
            <span className="signal-status-pill">{signalStatus}</span>
            <button className="btn-dispatch" onClick={runDemoSignal} disabled={activeSignalStage !== null}>
              {activeSignalStage !== null ? "Propagating Signal..." : "⚡ Dispatch Test Signal"}
            </button>
            <button className={`btn-halt ${isHalted ? "active" : ""}`} onClick={() => setIsHalted((h) => !h)}>
              {isHalted ? "Resume System" : "Emergency Halt"}
            </button>
          </div>
        </div>

        <div className="pipeline-grid">
          {STAGES.map((st, i) => (
            <div
              key={st.id}
              className={`stage-card ${activeSignalStage === i ? "propagating" : ""} ${selectedStage === i ? "selected" : ""}`}
              onClick={() => setSelectedStage(i)}
            >
              <div className="stage-top">
                <span className="stage-name">{st.name}</span>
                <span className="stage-latency mono">{st.latency}</span>
              </div>
              <div className="stage-tech">{st.tech}</div>
              {selectedStage === i && <div className="stage-detail-bubble">{st.detail}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* 4. MAIN KPI ROW */}
      <section className="kpi-strip">
        <div className="kpi-card">
          <div className="kpi-label">Consensus Supermajority</div>
          <div className="kpi-value mono emerald">{agreement.toFixed(2)}%</div>
          <div className="kpi-foot">&ge; 92.0% Fail-Closed Gate</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Active Swarm Models</div>
          <div className="kpi-value mono blue">11 / 11</div>
          <div className="kpi-foot">Sentiment · Strategy · Math</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pipeline Ingestion Rate</div>
          <div className="kpi-value mono">{isHalted ? "0" : msgs.toLocaleString()}</div>
          <div className="kpi-foot">AsyncIO msgs / sec</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Kernel Risk Budget</div>
          <div className="kpi-value mono emerald">&lt; 250 µs</div>
          <div className="kpi-foot">Zero Override Tolerance</div>
        </div>
      </section>

      {/* 5. MULTI-AGENT LAYER (CLICKABLE AGENT INSPECTOR) */}
      <section className="agents-workspace">
        <div className="section-header-row">
          <div>
            <span className="section-title">Multi-Agent Decision Swarm</span>
            <span className="section-sub">Click any agent card below to inspect model prompt logic, conviction weight, and telemetry</span>
          </div>
          <span className="mono" style={{ fontSize: "11px", color: "var(--accent-emerald)" }}>
            CURRENT AGREEMENT: {agreement.toFixed(1)}% [BUY APPROVED]
          </span>
        </div>

        <div className="agents-row">
          {AGENTS.map((a) => (
            <div
              key={a.id}
              className={`agent-card ${selectedAgent?.id === a.id ? "inspected" : ""}`}
              onClick={() => setSelectedAgent(a)}
            >
              <div className="agent-top">
                <span className="agent-name">{a.name}</span>
                <span className={`agent-pill ${a.room.toLowerCase()}`}>{a.room}</span>
              </div>
              <div className="agent-model mono">{a.model}</div>
              <div className="agent-metrics">
                <div><span>Vote:</span> <strong className="emerald">{a.vote}</strong></div>
                <div><span>Score:</span> <strong>{a.score}/10</strong></div>
                <div><span>Weight:</span> <strong>{(a.weight * 100).toFixed(0)}%</strong></div>
                <div><span>Latency:</span> <strong className="mono">{a.latencyMs}ms</strong></div>
              </div>
              <div className="agent-click-hint">Click to inspect logic &rarr;</div>
            </div>
          ))}
        </div>

        {/* Selected Agent Inspector Drawer */}
        {selectedAgent && (
          <div className="inspector-panel">
            <div className="inspector-head">
              <div>
                <strong>{selectedAgent.name}</strong> · Model Architecture: <code className="mono">{selectedAgent.model}</code> ({selectedAgent.room} Room)
              </div>
              <button className="inspector-close" onClick={() => setSelectedAgent(null)}>&times; Close</button>
            </div>
            <p className="inspector-body">
              <strong>Prompt Logic:</strong> {selectedAgent.logic}
            </p>
            <div className="inspector-stats mono">
              <span>Conviction Score: {selectedAgent.score}/10</span>
              <span>Confidence: {selectedAgent.confidence}%</span>
              <span>Consensus Room Weight: {(selectedAgent.weight * 100).toFixed(0)}%</span>
              <span>Inference Latency: {selectedAgent.latencyMs}ms</span>
            </div>
          </div>
        )}
      </section>

      {/* 6. REAL-TIME AUDIT LOG */}
      <section className="terminal-section">
        <div className="terminal-header mono">SYS_OPERATOR_AUDIT_STREAM // Real-Time Execution Trace</div>
        <div className="terminal-body">
          {logs.map((l) => (
            <div key={l.id} className="term-line">
              <span className="term-ts mono">[{l.ts}]</span>
              <span className="term-tag mono">[{l.tag}]</span>
              <span className={`term-msg ${l.type === "success" ? "emerald" : l.type === "error" ? "rose" : ""}`}>{l.msg}</span>
            </div>
          ))}
          <div ref={logRef} />
        </div>
      </section>

      {/* 7. PROJECT OVERVIEW MODAL */}
      {showOverviewModal && (
        <div className="modal-backdrop" onClick={() => setShowOverviewModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Project Architecture &amp; Engineering Pedigree</h2>
              <button className="modal-close" onClick={() => setShowOverviewModal(false)}>&times;</button>
            </div>
            <div className="modal-content">
              <p>
                <strong>Sovereign Cockpit</strong> was designed and architected by <strong>Usman Abayomi Bamidele</strong> as the operator telemetry layer for a hybrid quantitative trading infrastructure.
              </p>
              <h3>Key Architectural Pillars</h3>
              <ul>
                <li><strong>11-Agent Consensus Swarm:</strong> Dispatches parallel AsyncIO evaluations across Sentiment (Claude 3.5), Strategy (GPT-4o), and Math (DeepSeek/SIMD) models, requiring &ge; 92.0% consensus before trade dispatch.</li>
                <li><strong>Sub-Millisecond Risk Governor:</strong> Hardware-floor capital constraints written with SIMD variance bounds, 3.00% daily drawdown circuit breaker, and zero override capability.</li>
                <li><strong>Production Verification:</strong> Tested under 240+ unit, integration, and chaos test suites with a 100% green pass rate, validating HMAC webhook verifications and race condition defenses.</li>
                <li><strong>Stealth Context:</strong> Core broker routing bridges and proprietary execution kernels remain under stealth NDA for commercial launch.</li>
              </ul>
              <div className="modal-actions">
                <a href="https://github.com/amazing200guy1-a11y/Sovereign-Cockpit-UI" target="_blank" rel="noreferrer" className="btn-link">View GitHub Repo</a>
                <button className="btn-hire" onClick={() => setShowOverviewModal(false)}>Back to Cockpit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
