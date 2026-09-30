"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";

type NavTab = "Dashboard" | "Markets" | "Risk" | "Portfolio" | "Logs" | "Settings";
type StageTab = "Ingest" | "Features" | "Agents" | "Execute";

interface Agent {
  id: string;
  name: string;
  room: "Sentiment" | "Strategy" | "Math";
  badge: string;
  color: "emerald" | "purple" | "blue";
  sub: string;
  l1: string;
  v1: string;
  l2: string;
  v2: string;
  latencyMs: number;
}

const INITIAL_AGENTS: Agent[] = [
  { id: "market", name: "Market Agent", room: "Sentiment", badge: "Bullish", color: "emerald",
    sub: "Class: Trending High Vol", l1: "ATR", v1: "0.42", l2: "RST", v2: "64.2", latencyMs: 142 },
  { id: "signal", name: "Signal Agent", room: "Strategy", badge: "Active", color: "purple",
    sub: "Signals: 14 Long / 2 Short", l1: "Cluster", v1: "MACD_CROSS", l2: "Strength", v2: "High", latencyMs: 115 },
  { id: "ml", name: "ML Predictor", room: "Strategy", badge: "94% ACC", color: "blue",
    sub: "Pred: +1.2% in 4H", l1: "Model", v1: "Transformer_V8", l2: "Confidence", v2: "0.88", latencyMs: 165 },
  { id: "risk", name: "Risk Control", room: "Math", badge: "Optimal", color: "emerald",
    sub: "Exposure: 75% Limit", l1: "Drawdown", v1: "0.12%", l2: "Breach", v2: "None", latencyMs: 82 },
];

const MARKETS = [
  { symbol: "EUR/USD", price: "1.08502", change: "+0.28%", spread: "0.6 pips", vol: "148.2K", status: "Active" },
  { symbol: "GBP/USD", price: "1.29410", change: "-0.14%", spread: "0.8 pips", vol: "92.4K", status: "Active" },
  { symbol: "USD/JPY", price: "154.220", change: "+0.45%", spread: "0.9 pips", vol: "210.8K", status: "Active" },
  { symbol: "XAU/USD", price: "2,684.50", change: "+1.12%", spread: "1.8 pips", vol: "88.6K", status: "Active" },
];

export default function SovereignCockpit() {
  const [activeNav, setActiveNav] = useState<NavTab>("Dashboard");
  const [activeTab, setActiveTab] = useState<StageTab>("Agents");
  const [isHalted, setIsHalted] = useState(false);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [msgs, setMsgs] = useState(1940);
  const [agreement, setAgreement] = useState(94.2);
  const [sharpe, setSharpe] = useState(3.82);
  const [riskSlider, setRiskSlider] = useState(2.5);
  const [searchQuery, setSearchQuery] = useState("");
  const [bars, setBars] = useState([40, 60, 24, 70, 20, 35, 50]);
  const [logs, setLogs] = useState<{ id: string; ts: string; tag: string; msg: string; type: string }[]>([
    { id: "1", ts: "01:20:02.104", tag: "CORE", msg: "Sovereign multi-agent consensus grid online.", type: "info" },
    { id: "2", ts: "01:20:02.420", tag: "SWARM", msg: "11 agents synchronized across Sentiment, Strategy, and Math rooms.", type: "success" },
    { id: "3", ts: "01:20:02.815", tag: "ORACLE", msg: "Pairwise price divergence 0.02% (within 0.10% threshold).", type: "success" },
    { id: "4", ts: "01:20:03.110", tag: "RISK", msg: "Drawdown governor nominal: 0.12% / 3.00% hard circuit ceiling.", type: "info" },
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeNav === "Logs") {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, activeNav]);

  useEffect(() => {
    if (isHalted) return;
    const iv = setInterval(() => {
      setMsgs((p) => Math.floor(p + Math.random() * 30 - 15));
      setAgreement((p) => Math.min(98.8, Math.max(89.5, p + (Math.random() * 0.4 - 0.2))));
      setSharpe((p) => Math.max(3.6, Math.min(4.1, p + (Math.random() * 0.04 - 0.02))));
      setBars((p) => p.map((v, i) => (i === 3 ? 70 : Math.max(15, Math.min(85, v + Math.random() * 8 - 4)))));
      
      const now = new Date();
      const ts = `${now.toTimeString().split(" ")[0]}.${String(now.getMilliseconds()).padStart(3, "0")}`;
      const events = [
        { tag: "SWARM", msg: `AsyncIO tick processed. Consensus conviction stable at ${agreement.toFixed(1)}%.`, type: "info" },
        { tag: "ORACLE", msg: "Ingested L2 snapshot. Zero arbitrage divergence detected.", type: "success" },
        { tag: "RISK", msg: `SIMD risk check cleared: capital utilization within ${riskSlider.toFixed(1)}% threshold.`, type: "info" },
      ];
      const ev = events[Math.floor(Math.random() * events.length)];
      setLogs((prev) => [...prev.slice(-40), { id: String(Date.now()), ts, tag: ev.tag, msg: ev.msg, type: ev.type }]);
    }, 2000);
    return () => clearInterval(iv);
  }, [isHalted, agreement, riskSlider]);

  const triggerRecalibrate = () => {
    setIsRecalibrating(true);
    const now = new Date();
    const ts = `${now.toTimeString().split(" ")[0]}.${String(now.getMilliseconds()).padStart(3, "0")}`;
    setLogs((prev) => [...prev, { id: String(Date.now()), ts, tag: "SYSTEM", msg: "Initiating live multi-agent re-weighting cycle...", type: "info" }]);
    setTimeout(() => {
      setAgreement(95.8);
      setIsRecalibrating(false);
      setLogs((prev) => [...prev, { id: String(Date.now()), ts, tag: "SWARM", msg: "Recalibration complete. Consensus weight updated: 95.80% [BUY]", type: "success" }]);
    }, 1200);
  };

  const filteredAgents = useMemo(() => {
    return INITIAL_AGENTS.filter(
      (a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.sub.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredLogs = useMemo(() => {
    return logs.filter(
      (l) => l.msg.toLowerCase().includes(searchQuery.toLowerCase()) || l.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [logs, searchQuery]);

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
          <div className="sb-section">Telemetry Views</div>
          {(["Dashboard", "Markets", "Risk", "Portfolio", "Logs"] as NavTab[]).map((tab) => (
            <button
              key={tab}
              className={`sb-item ${activeNav === tab ? "active" : ""}`}
              onClick={() => setActiveNav(tab)}
            >
              {tab}
            </button>
          ))}
          <div className="sb-section">System</div>
          <button
            className={`sb-item ${activeNav === "Settings" ? "active" : ""}`}
            onClick={() => setActiveNav("Settings")}
          >
            Settings
          </button>
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

      {/* ── MAIN VIEWPORT ── */}
      <div className="main-area">
        <header className="top-bar">
          <div className="tb-tabs">
            {(["Ingest", "Features", "Agents", "Execute"] as StageTab[]).map((t) => (
              <button
                key={t}
                className={`tb-tab ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="tb-search">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="tb-input"
              placeholder="Filter view, agents, logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <kbd className="tb-kbd">ESC</kbd>
          </div>

          <div className="tb-actions">
            <button
              className={`pipeline-pill ${isHalted ? "halted" : "live"}`}
              onClick={() => setIsHalted((h) => !h)}
              title="Click to toggle emergency halt"
            >
              <span className="pipe-dot" />
              {isHalted ? "Pipeline Halted (Click to Resume)" : "Pipeline Live"}
            </button>
            <button
              className={`recal-btn ${isRecalibrating ? "recalibrating" : ""}`}
              onClick={triggerRecalibrate}
              disabled={isRecalibrating}
            >
              {isRecalibrating ? "Recalibrating..." : "Recalibrate"}
            </button>
          </div>
        </header>

        {/* ── VIEW SWITCHER ── */}
        <main className="dash">
          {activeNav === "Dashboard" && (
            <>
              {/* Hero */}
              <div className="hero-row">
                <div className="hero-left">
                  <div className="hero-eyebrow">Sovereign Cockpit // Stage: {activeTab}</div>
                  <div className="hero-sub">Aggregate consensus super-majority score</div>
                  <div className="hero-val">{agreement.toFixed(2)}%</div>
                  <span className="hero-badge">+{(agreement - 90).toFixed(1)}% above 92.0% threshold · 11/11 models aligned</span>
                </div>
                <div className="kpi-row">
                  <div className="kpi-mini">
                    <div className="kpi-lbl">Kelly Criterion</div>
                    <div className="kpi-val">0.145</div>
                    <svg viewBox="0 0 60 20" className="sparkline">
                      <polyline points="0,18 10,13 20,15 30,7 40,11 50,3 60,5" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
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
                    <span className="live-badge">Optimal</span>
                  </div>
                </div>
              </div>

              {/* Middle row */}
              <div className="mid-row">
                {/* Bar chart */}
                <div className="chart-card">
                  <div className="chart-top">
                    <div>
                      <div className="c-label">Pipeline Throughput (AsyncIO)</div>
                      <div className="c-val">{isHalted ? "0" : msgs.toLocaleString()}</div>
                      <span className={`c-badge ${isHalted ? "neg" : "pos"}`}>
                        {isHalted ? "SYSTEM HALTED" : "+10.5% from last epoch"}
                      </span>
                    </div>
                    <div className="msgs-pill">msgs / sec</div>
                  </div>
                  <div className="bar-area">
                    {["Mon 24", "Tue 25", "Wed 26", "Thu 26", "Fri 27", "Sat 28", "Sun 29"].map((day, i) => (
                      <div key={day} className="bar-col">
                        <div className="bar-track">
                          <div
                            className={`bar-fill ${i === 3 ? "active" : ""}`}
                            style={{ height: `${isHalted && i !== 3 ? 5 : bars[i]}%` }}
                          />
                        </div>
                        <div className="bar-lbl">{day}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk panel */}
                <div className="risk-card">
                  <div className="rc-title">Global Risk Exposure</div>
                  <div className="orb-wrap"><div className="orb" /></div>
                  <div className="risk-stats">
                    <div className="rs-row"><span className="rs-lbl">VAR (95%)</span><span className="rs-val neg">-2.4%</span></div>
                    <div className="rs-row"><span className="rs-lbl">Sharpe Ratio</span><span className="rs-val pos">{sharpe.toFixed(2)}</span></div>
                    <div className="rs-row"><span className="rs-lbl">Max Drawdown</span><span className="rs-val">$12.5K</span></div>
                  </div>
                  <div className="strategy-box">
                    <div className="sb-eyebrow">Leader: RL Agent Strategy</div>
                    <div className="sb-name">RL_BETA_V4</div>
                    <span className="sb-alpha">Net Alpha: +22.4% / mo</span>
                  </div>
                </div>
              </div>

              {/* Multi-Agent Cards */}
              <div className="agents-section">
                <div className="sec-title">
                  Multi Agent Decision Layer
                  <span style={{ fontSize: "11px", fontWeight: 400, color: "var(--t3)", marginLeft: "0.75rem" }}>
                    Showing {filteredAgents.length} verified models
                  </span>
                </div>
                <div className="agents-grid">
                  {filteredAgents.map((a) => (
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
            </>
          )}

          {activeNav === "Markets" && (
            <div className="panel-card" style={{ padding: "1.5rem" }}>
              <div className="sec-title">Institutional Market Depth & Execution Venue Feeds</div>
              <div className="markets-table-wrap">
                <table className="markets-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Mid Price</th>
                      <th>24h Change</th>
                      <th>Spread</th>
                      <th>Volume</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MARKETS.map((m) => (
                      <tr key={m.symbol}>
                        <td className="m-symbol">{m.symbol}</td>
                        <td className="m-price mono">{m.price}</td>
                        <td className={`mono ${m.change.startsWith("+") ? "pos" : "neg"}`}>{m.change}</td>
                        <td className="mono">{m.spread}</td>
                        <td className="mono">{m.vol}</td>
                        <td><span className="live-badge">{m.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeNav === "Risk" && (
            <div className="panel-card" style={{ padding: "1.5rem" }}>
              <div className="sec-title">Deterministic Risk Governor & Capital Defense</div>
              <p style={{ color: "var(--t2)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                Hardware-enforced SIMD variance ceilings. Hard 3.00% daily drawdown circuit breaker with zero override tolerance.
              </p>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1.25rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>Max Capital Allocation Ceiling</span>
                  <span className="mono" style={{ color: "var(--blue)", fontWeight: 700 }}>{riskSlider.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={riskSlider}
                  onChange={(e) => setRiskSlider(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--blue)", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--t3)", marginTop: "0.3rem" }}>
                  <span>0.1% Conservative</span>
                  <span>2.5% Institutional Target</span>
                  <span>5.0% Emergency Cap</span>
                </div>
              </div>
              <div className="kpi-row">
                <div className="kpi-mini"><div className="kpi-lbl">Daily Max Loss</div><div className="kpi-val">3.00%</div><div className="kpi-sub-lbl">Hard Circuit</div></div>
                <div className="kpi-mini"><div className="kpi-lbl">Current Drawdown</div><div className="kpi-val pos">0.12%</div><div className="kpi-sub-lbl">Nominal</div></div>
                <div className="kpi-mini"><div className="kpi-lbl">Margin Buffer</div><div className="kpi-val blue">84.2%</div><div className="kpi-sub-lbl">Surplus</div></div>
              </div>
            </div>
          )}

          {activeNav === "Portfolio" && (
            <div className="panel-card" style={{ padding: "1.5rem" }}>
              <div className="sec-title">Consolidated Exposure Breakdown</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                <div className="kpi-mini"><div className="kpi-lbl">Forex Majors</div><div className="kpi-val">42.0%</div><div className="kpi-sub-lbl">EUR, GBP, JPY</div></div>
                <div className="kpi-mini"><div className="kpi-lbl">Commodities</div><div className="kpi-val">28.0%</div><div className="kpi-sub-lbl">XAU/USD</div></div>
                <div className="kpi-mini"><div className="kpi-lbl">Index Derivatives</div><div className="kpi-val">30.0%</div><div className="kpi-sub-lbl">SPX, NDX</div></div>
              </div>
            </div>
          )}

          {activeNav === "Logs" && (
            <div className="panel-card" style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
              <div className="sec-title">Real-Time Telemetry Audit Stream</div>
              <div className="terminal-box" style={{ flex: 1, minHeight: "360px" }}>
                {filteredLogs.map((l) => (
                  <div key={l.id} className="log-line">
                    <span style={{ color: "var(--t3)", marginRight: "0.5rem" }}>[{l.ts}]</span>
                    <span style={{ color: "var(--blue)", marginRight: "0.5rem", fontWeight: 600 }}>[{l.tag}]</span>
                    <span style={{ color: l.type === "success" ? "var(--emerald)" : "var(--t1)" }}>{l.msg}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          )}

          {activeNav === "Settings" && (
            <div className="panel-card" style={{ padding: "1.5rem" }}>
              <div className="sec-title">System Configuration & Node Topology</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                <div className="setting-row">
                  <div>
                    <div style={{ fontWeight: 600 }}>Execution Bridge Mode</div>
                    <div style={{ fontSize: "11px", color: "var(--t3)" }}>Simulated WebSocket Telemetry (Public) vs Direct FIX 4.4 Venue</div>
                  </div>
                  <span className="live-badge">Public Portfolio Demo</span>
                </div>
                <div className="setting-row">
                  <div>
                    <div style={{ fontWeight: 600 }}>Fail-Closed Super-Majority Threshold</div>
                    <div style={{ fontSize: "11px", color: "var(--t3)" }}>Strict consensus floor before signal broadcast</div>
                  </div>
                  <span className="mono" style={{ color: "var(--emerald)", fontWeight: 700 }}>&ge; 92.0%</span>
                </div>
              </div>
            </div>
          )}

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
