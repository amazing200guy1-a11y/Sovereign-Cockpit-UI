# Contributing to Sovereign-Cockpit-UI

## Setup
```bash
git clone https://github.com/amazing200guy1-a11y/Sovereign-Cockpit-UI
cd Sovereign-Cockpit-UI
npm install
npm run build   # type-check
npm run dev     # start dev server at localhost:3000
```

## WebSocket Protocol
The cockpit connects to the MEHD AI backend via WebSocket at `/ws/telemetry`.

Expected message schema:
```json
{
  "type": "consensus_update",
  "symbol": "EUR/USD",
  "direction": "BUY",
  "confidence": 88.4,
  "agents_agree": 9,
  "agents_total": 11
}
```

## Adding a New Panel
1. Create a component in `/components`
2. Add to the dashboard grid in `dashboard.tsx`
3. Wire WebSocket subscription in the `useEffect` hook
