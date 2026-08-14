# AEI Water Intelligence — MVP Product Specification

## Product objective
AEI Water Intelligence is an operational decision-support platform for African water infrastructure. The MVP must demonstrate that heterogeneous environmental and operational signals can be converted into evidence-backed anomalies, human-reviewed recommendations, field actions and auditable outcomes.

## Initial users
- Municipal water services and water utilities
- Mines and mine-water operators
- Agricultural estates and irrigation schemes
- Industrial facilities
- Infrastructure operators and environmental teams

## Core jobs to be done
1. See the current water-system state in one command interface.
2. Detect probable leaks, abnormal flow/pressure, reservoir decline, asset health deterioration and climate/environmental risk.
3. Understand why an alert exists and inspect its evidence.
4. Review an AI recommendation before consequential action.
5. Convert approved recommendations into inspections/maintenance tickets.
6. Upload evidence and close work with an audit trail.
7. Report measurable operational and environmental outcomes.

## MVP functional scope
### Command centre
- Map-first sites and incident state
- KPI strip: estimated water loss, NRW proxy, anomaly count, pressure, storage, sensor uptime
- Operational overlays and site drilldown
- Live incident summary

### Asset and telemetry management
- Organisation / site / zone / asset hierarchy
- Reservoir, tank, pump, valve, pipeline and meter support
- Sensor registry and sensor health
- Live time-series readouts and trends

### Alerting and AI risk briefs
- Threshold, trend and cross-sensor anomaly detection
- Alert severity, type, confidence, status and ownership
- Evidence-backed AI risk brief
- Source IDs, source timestamps, generation timestamp, confidence, reasoning summary, predicted impact and recommendation
- Human Approve / Amend / Reject decision
- No autonomous shutoff, isolation or destructive action in the MVP

### Inspection and maintenance workflow
- Ticket generation after approved recommendations
- Priority, owner, SLA, checklist, evidence and closure states
- Field-oriented workflow compatible with later mobile/PWA extension

### Evidence and audit
- Evidence references linked to alert, brief, ticket and asset
- Provenance identifier and integrity-hash field
- Append-only audit-event model

### Reporting
- Water-loss / NRW proxy
- Asset health and availability
- Climate/environmental risk
- Interventions and estimated water saved
- Data completeness and sensor uptime

## Non-goals for Water MVP
- AEI Air / Waste / Nature modules
- Fully autonomous SCADA actuation
- Regulatory compliance certification
- Production billing / customer metering
- Replacement of engineering judgement

## UX/UI/CX definition
- UX: map → operational state → anomaly → evidence → recommendation → human decision → ticket → field evidence → closure → audit.
- UI: Technical Minimalist + Reality-First, PLC/HMI-inspired density, high contrast, restrained environmental accents, monospaced telemetry readouts.
- CX: demonstrable trust. A municipal engineer, environmental officer, mine operator or investor should be able to see where every recommendation came from and what happened next.

## Acceptance criteria
- Works without physical hardware through deterministic simulated sensors.
- At least two sites and eight sensors are represented.
- A scripted leak scenario changes telemetry and visible system state.
- A leak risk brief cites multiple evidence sources with timestamps and confidence.
- A ticket cannot be generated from the seeded AI recommendation without human approval.
- The approval generates an auditable event.
- Responsive layout remains usable on tablet/mobile while desktop remains primary.
