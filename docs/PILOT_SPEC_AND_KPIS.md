# GABA Water — Pilot Specification and Environmental KPIs

## Recommended pilot shape
- Duration: 8–12 weeks after baseline commissioning
- Footprint: 1 organisation, 1–2 sites, 1–3 DMAs/operational zones
- Assets: reservoir/tank, pump station, key pipeline/zone, existing meters/sensors where available
- Telemetry: flow, pressure, level; optional water quality and equipment-health signals
- Weather: rainfall/temperature from approved source
- Users: operations controller, engineer/manager, environmental officer, field inspector, executive read-only

## Pilot stages
1. **Baseline** — asset registry, sensor QA, 2–4 weeks historical/observed baseline where practical.
2. **Observe** — GABA runs in shadow mode; no operational recommendation is acted on without existing procedures.
3. **Decision-support** — evidence-backed alerts reviewed by authorised staff.
4. **Field verification** — inspections confirm/deny anomalies and capture evidence.
5. **Outcome evaluation** — compare detection accuracy, response time and water-loss indicators against baseline.

## Measurable KPIs
### Water efficiency
- Estimated real loss, m³/day
- NRW proxy, % where input/authorised-demand data is available
- Minimum/night flow deviation from baseline, L/s or m³/h
- Estimated water saved after verified intervention, m³ and m³/day

### Detection performance
- Verified anomaly precision: confirmed events / investigated GABA events
- False-positive rate
- Median anomaly lead time vs existing detection method
- Confidence calibration by risk class

### Operational response
- Mean time to acknowledge alert
- Mean time from approval to inspection
- Mean time to close verified incident
- SLA compliance rate
- Percentage of critical recommendations with recorded human decision

### Asset and data health
- Sensor uptime %
- Data completeness %
- Stale-data event count
- Calibration compliance %
- Critical asset availability %

### Reservoir / pressure resilience
- Time outside approved pressure bands
- Reservoir/tank excursions below operating threshold
- Number and duration of abnormal pressure events

### Environmental / climate risk
- High-risk weather/environment events identified before operational impact
- Number of field actions linked to weather/environment evidence
- Avoided overflow/spill or supply-risk events where defensibly measurable

### Governance
- 100% of AI recommendations include evidence/source/timestamp/confidence/reasoning summary
- 100% of consequential actions linked to authorised human approval
- 100% of pilot decisions and ticket changes represented in audit history

## Pilot evidence package
- Before/after telemetry snapshots
- Alert and AI brief
- Human decision record
- Inspection notes/photos/documents
- Repair/maintenance action
- Post-action telemetry validation
- Water-saved estimate with calculation method
- Audit export

## Pilot success threshold
A pilot should not be judged by the number of alerts. It succeeds if GABA produces **fewer, more useful, verifiable interventions** that reduce detection time, improve operational accountability and demonstrate measurable water/environmental value.
