"use client";
import React, { useEffect, useState } from "react";

const AGENT_CARDS = [
  { id: "market", name: "Market Agent", badge: "Bullish", color: "emerald",
    sub: "Class: Trending high vol", l1: "ATR", v1: "0.42", l2: "RST", v2: "64.2" },
  { id: "signal", name: "Signal Agent", badge: "Active", color: "purple",
    sub: "Signals: 14 long / 2 short", l1: "Cluster", v1: "MACD_CROSS", l2: "Strength", v2: "High" },
  { id: "ml", name: "ML Predictor", badge: "94% ACC", color: "blue",
    sub: "Pred: +1.2% in 4H", l1: "Model", v1: "Transformer_V8", l2: "Confidence", v2: "0.88" },
  { id: "risk", name: "Risk Control", badge: "Bullish", color: "emerald",
    sub: "Exposure: 75% Limit", l1: "Drawdown", v1: "0.12%", l2: "Breach", v2: "None" },
];

const BAR_DATA = [
  { day: "Mon 24", h: 40 }, { day: "Tue 25", h: 60 }, { day: "Wed 26", h: 24 },
  { day: "Thu 26", h: 70, active: true }, { day: "Fri 27", h: 20 },
  { day: "Sat 28", h: 35 }, { day: "Sun 29", h: 50 },
];

const NAV = ["Dashboard", "Markets", "Risk", "Portfolio", "Logs"];
const TABS = ["Ingest", "Features", "Agents", "Execute"];

export default function SovereignCockpit() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [activeTab, setActiveTab] = useState("Agents");
  const [isHalted, setIsHalted] = useState(false);
  const [msgs, setMsgs] = useState(1940);
  const [agreement, setAgreement] = useState(94.2);
  const [sharpe, setSharpe] = useState(3.82);
  const [bars, setBars] = useState(BAR_DATA.map(b => b.h));

  useEffect(() => {
    if (isHalted) return;
    const iv = setInterval(() => {
      setMsgs(p => Math.floor(p + Math.random() * 30 - 15));
      setAgreement(p => Math.min(99, Math.max(88, p + (Math.random() * 0.4 - 0.2))));
      setSharpe(p => Math.max(3.5, Math.min(4.2, p + (Math.random() * 0.04 - 0.02))));
      setBars(p => p.map((v, i) => BAR_DATA[i].active ? v : Math.max(10, Math.min(90, v + Math.random() * 6 - 3))));
    }, 1800);
    return () => clearInterval(iv);
  }, [isHalted]);

  return (
    <div className="app-shell">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="sb-mark">SC</div>
          <span className="sb-title">Sovereign</span>
        </div>

        <div className="sb-user">
          <div className="sb-avatar">UB</div>
          <div>
            <div className="sb-name">Usman Bamidele</div>
            <div className="sb-id">ID: 942-001</div>
          </div>
        </div>

        <nav className="sb-nav">
          <div className="sb-section">Project</div>
          {NAV.map(item => (
            <button key={item} className={`sb-item ${activeNav === item ? "active" : ""}`}
              onClick={() => setActiveNav(item)}>{item}</button>
          ))}
          <div className="sb-section">System</div>
          <button className="sb-item">Settings</button>
          <button className="sb-item">Support</button>
        </nav>

        <div className="sb-bottom">
          <a href="https://github.com/amazing200guy1-a11y" target="_blank" rel="noreferrer" className="sb-link">
            GitHub Portfolio (9 repos)
          </a>
          <a href="https://linkedin.com/in/usman-bamidele" target="_blank" rel="noreferrer" className="sb-link">
            LinkedIn
          </a>
          <a href="mailto:usmanbamidele200@gmail.com" className="sb-hire">
            Hire / Get in Touch
          </a>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="main-area">
        {/* Top bar */}
        <header className="top-bar">
          <div className="tb-tabs">
            {TABS.map(t => (
              <button key={t} className={`tb-tab ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}>{t}</button>
            ))}
          </div>
          <div className="tb-search">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input className="tb-input" placeholder="Search..." />
            <kbd className="tb-kbd">⌘K</kbd>
          </div>
          <div className="tb-actions">
            <div className={`pipeline-pill ${isHalted ? "halted" : "live"}`}>
              <span className="pipe-dot" />
              {isHalted ? "Pipeline halted" : "Pipeline live"}
            </div>
            <button className={`recal-btn ${isHalted ? "reset" : ""}`} onClick={() => setIsHalted(h => !h)}>
              {isHalted ? "Reset System" : "Recalibrate"}
            </button>
          </div>
        </header>

        {/* Dashboard */}
        <main className="dash">
          {/* Hero */}
          <div className="hero-row">
            <div className="hero-left">
              <div className="hero-eyebrow">Sovereign Cockpit</div>
              <div className="hero-sub">Aggregate consensus score</div>
              <div className="hero-val">{agreement.toFixed(2)}%</div>
              <span className="hero-badge">+{(agreement - 90).toFixed(1)}% above threshold · 11/11 agents aligned</span>
            </div>
            <div className="kpi-row">
              <div className="kpi-mini">
                <div className="kpi-lbl">Kelly Criterion</div>
                <div className="kpi-val">0.145</div>
                <svg viewBox="0 0 60 20" className="sparkline">
                  <polyline points="0,18 10,13 20,15 30,7 40,11 50,3 60,5"
                    fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="kpi-mini">
                <div className="kpi-lbl">Active Agents</div>
                <div className="kpi-val blue">11 / 11</div>
                <div className="kpi-sub-lbl">3 analytical rooms</div>
              </div>
              <div className="kpi-mini">
                <div className="kpi-lbl">Risk Parity</div>
                <div className="kpi-val">Balanced</div>
                <span className="live-badge">Live</span>
              </div>
            </div>
          </div>

          {/* Middle row */}
          <div className="mid-row">
            {/* Bar chart */}
            <div className="chart-card">
              <div className="chart-top">
                <div>
                  <div className="c-label">Pipeline Throughput</div>
                  <div className="c-val">{isHalted ? "0" : msgs.toLocaleString()}</div>
                  <span className={`c-badge ${isHalted ? "neg" : "pos"}`}>
                    {isHalted ? "SYSTEM HALTED" : "+10.5% from last period"}
                  </span>
                </div>
                <div className="msgs-pill">msgs / sec</div>
              </div>
              <div className="bar-area">
                {BAR_DATA.map((bar, i) => (
                  <div key={bar.day} className="bar-col">
                    <div className="bar-track">
                      <div className={`bar-fill ${bar.active ? "active" : ""}`}
                        style={{ height: `${isHalted && !bar.active ? 5 : bars[i]}%` }} />
                    </div>
                    <div className="bar-lbl">{bar.day}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk panel */}
            <div className="risk-card">
              <div className="rc-title">Global Risk Exposure</div>
              <div className="orb-wrap"><div className="orb" /></div>
              <div className="risk-stats">
                {[
                  { l: "VAR (95%)", v: "-2.4%", cls: "neg" },
                  { l: "Sharpe ratio", v: sharpe.toFixed(2), cls: "pos" },
                  { l: "Max Drawdown", v: "$12.5K", cls: "" },
                ].map(r => (
                  <div key={r.l} className="rs-row">
                    <span className="rs-lbl">{r.l}</span>
                    <span className={`rs-val ${r.cls}`}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="strategy-box">
                <div className="sb-eyebrow">Leader: RL Agent Strategy</div>
                <div className="sb-name">RL_BETA_V4</div>
                <span className="sb-alpha">Net Alpha: +22.4% / mo</span>
              </div>
            </div>
          </div>

          {/* Agent cards */}
          <div className="agents-section">
            <div className="sec-title">Multi Agent Decision Layer</div>
            <div className="agents-grid">
              {AGENT_CARDS.map(a => (
                <div key={a.id} className="ac">
                  <div className="ac-top">
                    <div className="ac-icon" />
                    <span className={`ac-badge ${a.color}`}>{a.badge}</span>
                  </div>
                  <div className="ac-name">{a.name}</div>
                  <div className="ac-sub">{a.sub}</div>
                  <div className="ac-stats">
                    <div className="ac-stat"><div className="asl">{a.l1}</div><div className="asv">{a.v1}</div></div>
                    <div className="ac-stat"><div className="asl">{a.l2}</div><div className="asv">{a.v2}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stealth footer */}
          <div className="stealth-bar">
            <span className="sb-dot" />
            <span>Proprietary execution kernel &amp; broker bridges operate under stealth NDA.</span>
            <span className="sb-divider">·</span>
            <span>Sovereign Cockpit — Architecture Demonstration by <strong>Usman Abayomi Bamidele</strong></span>
          </div>
        </main>
      </div>
    </div>
  );
}
