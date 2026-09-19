<p align="center">
  <img src="assets/gaba-logo.svg" alt="GABA Water Intelligence" width="520" />
</p>

# GABA WATER INTELLIGENCE

**Inspired by nature. Driven by a cleaner future.**

**GABA Water Intelligence** is an African water-intelligence and digital-twin platform for monitoring infrastructure, detecting anomalies, supporting human decisions and measuring environmental action.

> **Scope lock:** Water first. GABA is focused on water-system intelligence, operational evidence and climate-resilient infrastructure.

## Product principle

**AI detects, predicts and recommends. Humans approve consequential actions.** Every AI recommendation must contain evidence, source, timestamp, confidence and a concise reasoning summary.

## Working MVP

This repository contains a dependency-light browser MVP designed to be demonstrable before field hardware is available. It includes:

- responsive PLC/HMI-inspired command centre
- operational geospatial map surface
- organisations / sites / assets / sensors
- deterministic sensor simulator
- leak, pressure, reservoir and pump-health scenarios
- live telemetry and sensor health
- alert centre
- water-system digital twin
- evidence-backed AI risk brief
- explicit **Approve / Amend / Reject** decision boundary
- inspection ticket creation after approval
- evidence store and audit log
- environmental/operational reports
- integration boundary for LoRaWAN, MQTT, Modbus, HTTP and CSV

### Run locally

```bash
npm run check
npm run serve
```

Then open `http://localhost:4173`.

No npm dependency installation is required for the current demo.

## Architecture

```text
Sensors / APIs / GIS / weather
          ↓
      ingestion
          ↓
environmental data lake
          ↓
    digital twin
          ↓
 time-series engine
          ↓
 anomaly detection
          ↓
AI environmental intelligence
          ↓
     risk scoring
          ↓
 HUMAN DECISION GATE
          ↓
  inspection / action
          ↓
 audit + evidence store
```

## Repository structure

```text
index.html                     browser entry
src/data.js                    deterministic African demo dataset
src/simulator.js               simulated telemetry adapter
src/app.js                     command-centre application and workflows
src/styles.css                 industrial UI system
db/schema.sql                  production-oriented PostgreSQL schema
docs/PRODUCT_SPEC.md           MVP scope, UX/UI/CX and acceptance criteria
docs/ARCHITECTURE.md           data, AI and digital-twin architecture
docs/ROADMAP_12_WEEKS.md       engineering roadmap
docs/PILOT_SPEC_AND_KPIS.md    pilot design and measurable environmental KPIs
.github/workflows/validate.yml  syntax/governance CI
```

## Seeded demonstration incident

The main demo uses a fictional South African water district. A probable DMA leak is inferred from elevated night flow, downstream pressure loss and accelerated reservoir drawdown. The AI brief includes multiple evidence sources and requires a human decision before an inspection ticket can be created. It does **not** perform autonomous valve isolation or other consequential control action.

## Next production engineering step

Replace browser-only state with the `db/schema.sql` persistence model and a server-side ingestion/API service while retaining the simulator as a deterministic test adapter. The first live hardware integration should be MQTT or LoRaWAN for flow, pressure and reservoir-level telemetry.
