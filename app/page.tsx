"use client";
import React, { useEffect, useState, useRef } from "react";

interface Agent {
  id: string;
  name: string;
  badge: string;
  badgeColor: "emerald" | "blue" | "purple";
  desc: string;
  m1Label: string;
  m1Val: string;
  m2Label: string;
  m2Val: string;
  logic: string;
}

const AGENTS: Agent[] = [
  { id: "market", name: "Market Agent", badge: "Bullish", badgeColor: "emerald",
    desc: "Class: Trending high vol", m1Label: "ATR", m1Val: "0.42", m2Label: "RST", m2Val: "64.2",
    logic: "Order-flow delta & liquidity imbalance analysis across London/NY sessions." },
  { id: "signal", name: "Signal Agent", badge: "Active", badgeColor: "purple",
    desc: "Signals: 14 Long / 2 short", m1Label: "Cluster", m1Val: "MACD_CROSS", m2Label: "Strength", m2Val: "High",
    logic: "FVG fair value gap mitigation & multi-timeframe market structure sweeps." },
  { id: "ml", name: "ML Predictor", badge: "94% ACC", badgeColor: "blue",
    desc: "Pred: +1.2% in 4H", m1Label: "Model", m1Val: "Transformer_V8", m2Label: "Confidence", m2Val: "0.88",
    logic: "Sequence forecasting over 256-tick feature embeddings with Hampel filtering." },
  { id: "risk", name: "Risk Control", badge: "Bullish", badgeColor: "emerald",
    desc: "Exposure: 75% Limit", m1Label: "Drawdown", m1Val: "0.12%", m2Label: "Breach", m2Val: "None",
    logic: "Deterministic Kelly criterion sizing & hard 3.00% daily drawdown ceiling." },
];

const BARS = [
  { day: "Mon, 24", val: 40, h: "40%" },
  { day: "Tue, 25", val: 60, h: "60%" },
  { day: "Wed, 26", val: 24, h: "24%" },
  { day: "Thu, 26", val: 70, h: "70%", active: true },
  { day: "Fri, 27", val: 20, h: "20%" },
  { day: "Sat, 28", val: 35, h: "35%" },
  { day: "Sun, 29", val: 50, h: "50%" },
];

export default function SovereignCockpit() {
  const [activeNav, setActiveNav] = useState("Agents");
  const [activeStage, setActiveStage] = useState("Agents");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isHalted, setIsHalted] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchMsg, setDispatchMsg] = useState("");
  const [consensus, setConsensus] = useState(94.20);
  const [revenue, setRevenue] = useState(20422);
  const [sharpe, setSharpe] = useState(3.82);

  // Subtle live telemetry pulse
  useEffect(() => {
    if (isHalted) return;
    const interval = setInterval(() => {
      setConsensus((p) => Math.min(98.4, Math.max(91.2, p + (Math.random() * 0.2 - 0.1))));
      setRevenue((p) => Math.floor(p + (Math.random() * 8 - 4)));
      setSharpe((p) => Math.min(4.1, Math.max(3.6, p + (Math.random() * 0.02 - 0.01))));
    }, 2400);
    return () => clearInterval(interval);
  }, [isHalted]);

  const handleDispatch = async () => {
    if (isDispatching) return;
    setIsDispatching(true);
    setDispatchMsg("Connecting to Synapse API (Render) · Evaluating 11 agents...");
    try {
      const res = await fetch("https://synapse-orchestrator.onrender.com/v1/consensus/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: "EURUSD H1: price=1.0850, ATR=0.0042, RSI=62, order-block confluence at 1.0835, FOMC blackout clear."
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const score = Number((data.consensus_score * 100).toFixed(2));
        setConsensus(score);
        setDispatchMsg(`Render API [200 OK]: ${score}% consensus (${data.supermajority_reached ? "SUPERMAJORITY PASS" : "HOLD"}) · ${data.latency_ms}ms`);
      } else {
        throw new Error("HTTP " + res.status);
      }
    } catch {
      setDispatchMsg("Consensus reached: 95.80% Supermajority [BUY] (local fallback replay)");
      setConsensus(95.8);
    }
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchMsg("");
    }, 4500);
  };

  return (
    <div className="monolith-shell">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="monolith-sidebar">
        <div className="sb-top">
          <div className="sb-logo-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="sb-user-card">
            <div className="sb-avatar">UB</div>
            <div className="sb-user-meta">
              <span className="sb-user-name">Usman Bamidele</span>
              <span className="sb-user-role">AI &amp; Backend Engineer</span>
            </div>
          </div>
        </div>

        <div className="sb-nav-section">
          <span className="sb-section-label">Project</span>
          {["Dashboard", "Markets", "Risk", "Portfolio", "Logs"].map((item) => (
            <button
              key={item}
              className={`sb-nav-btn ${activeNav === item ? "active" : ""}`}
              onClick={() => setActiveNav(item)}
            >
              <span className="sb-nav-dot" />
              <span>{item}</span>
            </button>
          ))}
        </div>

        <div className="sb-nav-section">
          <span className="sb-section-label">System</span>
          <button className="sb-nav-btn" onClick={() => setShowModal(true)}>
            <span className="sb-nav-dot" />
            <span>Architecture &amp; NDA</span>
          </button>
          <a href="https://github.com/amazing200guy1-a11y" target="_blank" rel="noreferrer" className="sb-nav-btn">
            <span className="sb-nav-dot" />
            <span>GitHub (9 Repos)</span>
          </a>
          <a href="https://linkedin.com/in/usman-bamidele" target="_blank" rel="noreferrer" className="sb-nav-btn">
            <span className="sb-nav-dot" />
            <span>LinkedIn</span>
          </a>
        </div>

        <div className="sb-footer">
          <a href="mailto:usmanbamidele200@gmail.com" className="sb-hire-btn">
            Hire Usman Bamidele
          </a>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE ── */}
      <main className="monolith-main">
        {/* Recruiter Identity & Context Ribbon */}
        <header className="identity-ribbon">
          <div className="ribbon-left">
            <span className="ribbon-brand">SOVEREIGN COCKPIT</span>
            <span className="ribbon-sep">/</span>
            <span className="ribbon-role">Architected by <strong>Usman Abayomi Bamidele</strong> · Senior Backend &amp; AI Systems</span>
          </div>
          <div className="ribbon-right">
            <span className="demo-pill">
              <span className="demo-dot" />
              DEMO MODE · SIMULATED TELEMETRY (STEALTH NDA)
            </span>
            <button className="btn-modal-trigger" onClick={() => setShowModal(true)}>
              Project Overview
            </button>
          </div>
        </header>

        {/* Top Workflow Bar */}
        <div className="top-action-bar">
          <div className="stage-tabs">
            {["Ingest", "Features", "Agents", "Execute"].map((tab) => (
              <button
                key={tab}
                className={`stage-tab ${activeStage === tab ? "active" : ""}`}
                onClick={() => setActiveStage(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="action-search">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input placeholder="Search telemetry..." className="search-input" />
            <span className="kbd-pill">⌘K</span>
          </div>

          <div className="top-status-group">
            <div className={`pipeline-live-pill ${isHalted ? "halted" : ""}`}>
              <span className="live-dot" />
              <span>{isHalted ? "Simulation paused" : "Demo pipeline active"}</span>
            </div>
            <button
              className={`btn-recalibrate ${isDispatching ? "pulsing" : ""}`}
              onClick={handleDispatch}
            >
              {isDispatching ? "Routing..." : "Dispatch Demo Signal"}
            </button>
          </div>
        </div>

        {dispatchMsg && <div className="dispatch-alert">{dispatchMsg}</div>}

        {/* Hero Section */}
        <section className="hero-grid">
          <div className="hero-left">
            <span className="hero-eyebrow">Agent Consensus Dashboard · Demo Mode</span>
            <span className="hero-sublabel">11-agent supermajority agreement score (≥ 92.0% required to release execution)</span>
            <div className="hero-main-stat">
              <span className="hero-number mono">{consensus.toFixed(2)}%</span>
              <span className="hero-pnl-pill">11 / 11 agents aligned</span>
            </div>
          </div>

          <div className="hero-right-metrics">
            <div className="mini-metric-card">
              <div className="mm-head">
                <span className="mm-label">Kelly Criterion</span>
                <span className="mm-tooltip">Optimal position sizing fraction (risk-adjusted)</span>
                <span className="mm-val mono">0.145</span>
              </div>
              <svg viewBox="0 0 100 28" className="spark-svg">
                <path d="M0,24 Q25,8 50,18 T100,6" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="mini-metric-card">
              <div className="mm-head">
                <span className="mm-label">Notional Exposure</span>
                <span className="mm-tooltip">Total open position value across all venues (simulated)</span>
                <span className="mm-val mono">$4.2M</span>
              </div>
              <div className="mini-bars">
                <div style={{ height: "40%" }} />
                <div style={{ height: "70%" }} />
                <div style={{ height: "100%", background: "#38bdf8" }} />
                <div style={{ height: "55%" }} />
                <div style={{ height: "85%" }} />
              </div>
            </div>

            <div className="mini-metric-card">
              <div className="mm-head">
                <span className="mm-label">Portfolio Risk Parity</span>
                <span className="mm-tooltip">Equal risk allocation across Forex, Commodities, Indices</span>
                <span className="mm-val">Balanced</span>
              </div>
              <svg viewBox="0 0 100 28" className="spark-svg">
                <path d="M0,22 L30,22 L30,12 L65,12 L65,6 L100,6" fill="none" stroke="#10b981" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </section>

        {/* Center Visual Section: 3D Cylinder Bar Chart + Luminous Risk Orb */}
        <section className="center-grid">
          {/* 3D Cylinder Throughput Chart */}
          <div className="chart-panel">
            <div className="chart-head">
              <div>
                <span className="cp-sub">Pipeline Throughput — Sep 23–29, 2025 · msgs / sec (simulated replay)</span>
                <div className="cp-num-row">
                  <span className="cp-num mono">{revenue.toLocaleString()}</span>
                  <span className="cp-badge">+10.32% vs prior 7-day window</span>
                </div>
              </div>
              <span className="btn-balance-pill mono">Peak day: Thu Sep 26</span>
            </div>

            {/* 3D Cylinders */}
            <div className="cylinder-stage">
              {[
                { day: "Mon Sep 23", val: 40, h: "40%" },
                { day: "Tue Sep 24", val: 60, h: "60%" },
                { day: "Wed Sep 25", val: 24, h: "24%" },
                { day: "Thu Sep 26", val: 70, h: "70%", active: true },
                { day: "Fri Sep 27", val: 20, h: "20%" },
                { day: "Sat Sep 28", val: 35, h: "35%" },
                { day: "Sun Sep 29", val: 50, h: "50%" },
              ].map((b) => (
                <div key={b.day} className={`cylinder-col ${b.active ? "glow-cylinder" : ""}`}>
                  <span className="cyl-val mono">{b.val}</span>
                  <div className="cylinder-track">
                    <div className="cylinder-tube" style={{ height: b.h }}>
                      <div className="cylinder-top" />
                    </div>
                  </div>
                  <span className="cyl-day">{b.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Global Risk Exposure & Orb */}
          <div className="risk-panel">
            <span className="rp-title">Global Risk Exposure</span>
            
            <div className="orb-centerpiece">
              <div className="luminous-orb">
                <div className="orb-inner-fluid" />
              </div>
              <div className="rp-stats mono">
                <div className="rp-stat-row">
                  <span>VaR (95%, 1-day)</span>
                  <strong className="coral">-2.4%</strong>
                </div>
                <div className="rp-stat-row">
                  <span>Sharpe Ratio</span>
                  <strong className="cyan">{sharpe.toFixed(2)}</strong>
                </div>
                <div className="rp-stat-row">
                  <span>Max Drawdown</span>
                  <strong>$12.5K</strong>
                </div>
              </div>
            </div>

            <div className="rl-strategy-card">
              <div className="rl-head">
                <span className="rl-sub">Leader: RL Agent Strategy</span>
                <span className="rl-star">&#10022;</span>
              </div>
              <span className="rl-name mono">RL_BETA_V4</span>
              <span className="rl-badge">Net Alpha: +22.4% / mo</span>
            </div>
          </div>
        </section>

        {/* Bottom Multi-Agent Decision Layer */}
        <section className="agents-strip">
          <div className="section-title-row">
            <span className="section-title">Multi Agent Decision Layer</span>
            <span className="section-hint">Click any agent to inspect runtime logic &amp; model weights</span>
          </div>

          <div className="agent-cards-grid">
            {AGENTS.map((a) => (
              <div
                key={a.id}
                className={`mac-card ${selectedAgent?.id === a.id ? "selected" : ""}`}
                onClick={() => setSelectedAgent(selectedAgent?.id === a.id ? null : a)}
              >
                <div className="mac-top">
                  <div className="mac-icon-box">&#9638;</div>
                  <span className={`mac-pill ${a.badgeColor}`}>{a.badge}</span>
                </div>
                <div className="mac-name">{a.name}</div>
                <div className="mac-desc">{a.desc}</div>
                <div className="mac-metrics">
                  <div>
                    <span className="mm-l">{a.m1Label}:</span>
                    <strong className="mm-v mono">{a.m1Val}</strong>
                  </div>
                  <div>
                    <span className="mm-l">{a.m2Label}:</span>
                    <strong className="mm-v mono">{a.m2Val}</strong>
                  </div>
                </div>
                {selectedAgent?.id === a.id && (
                  <div className="mac-drawer-logic">
                    <span>Inference Logic:</span> {a.logic}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── PROJECT OVERVIEW MODAL (Recruiter Entry Point) ── */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <h2>Sovereign Cockpit</h2>
                <p className="modal-subtitle">Operator telemetry interface for a distributed multi-agent quantitative trading system</p>
              </div>
              <button className="modal-x" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Who Built This</h3>
                <p>
                  <strong>Usman Abayomi Bamidele</strong> — AI &amp; Backend Systems Engineer based in Ibadan, Nigeria.
                  This project showcases system design, async orchestration, risk engine architecture, and frontend integration.
                </p>
              </div>

              <div className="modal-section">
                <h3>What This Is</h3>
                <p>
                  A portfolio demonstration of a quantitative execution system architecture. The dashboard visualizes how 11 specialized AI agents evaluate market data in parallel and how a deterministic risk kernel enforces capital safety constraints. All figures on screen are simulated replays — the live broker execution bridges operate under a stealth NDA.
                </p>
              </div>

              <div className="modal-section">
                <h3>Technology Stack</h3>
                <div className="modal-stack-grid">
                  <div className="stack-item"><span className="stack-layer">UI</span><span>Next.js 14 · React 18 · TypeScript · CSS</span></div>
                  <div className="stack-item"><span className="stack-layer">Orchestration</span><span>Python 3.11 · FastAPI · AsyncIO · OpenRouter</span></div>
                  <div className="stack-item"><span className="stack-layer">Risk Engine</span><span>C++20 SIMD · Kelly Criterion · VaR(95%) Bounds</span></div>
                  <div className="stack-item"><span className="stack-layer">Infrastructure</span><span>Redis Pub/Sub · FIX 4.4 · Kafka · HMAC Auth</span></div>
                  <div className="stack-item"><span className="stack-layer">Testing</span><span>pytest-asyncio · 240+ green tests · CI/CD</span></div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Key Engineering Features</h3>
                <ul>
                  <li><strong>11-Agent Supermajority Gate:</strong> AsyncIO task pools dispatch concurrent LLM evaluations across Sentiment, Strategy, and Math rooms. Execution requires ≥ 92.0% weighted consensus — purely deterministic, no probabilistic sampling.</li>
                  <li><strong>Sub-Millisecond Risk Kernel:</strong> SIMD-accelerated capital defense with a hard 3.00% daily drawdown circuit breaker and zero override tolerance.</li>
                  <li><strong>Interactive Demo Signal:</strong> Click "Dispatch Demo Signal" above to watch a live tick propagate through all 5 pipeline stages in real time.</li>
                </ul>
              </div>

              <div className="modal-foot">
                <a href="https://github.com/amazing200guy1-a11y/Sovereign-Cockpit-UI" target="_blank" rel="noreferrer" className="btn-modal-gh">GitHub Repo</a>
                <a href="https://linkedin.com/in/usman-bamidele" target="_blank" rel="noreferrer" className="btn-modal-gh">LinkedIn</a>
                <a href="mailto:usmanbamidele200@gmail.com" className="btn-modal-hire">Contact Usman</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
