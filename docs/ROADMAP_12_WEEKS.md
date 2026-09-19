# GABA Water Intelligence - 12-Week Engineering Roadmap

## Week 1 - Foundation and governance
- Product boundaries, threat model, user roles, engineering glossary
- Repository, CI, environments and coding standards
- Organisation/site/asset/sensor model
- AI recommendation governance contract

## Week 2 - Data platform baseline
- PostgreSQL/PostGIS schema
- Time-series design and retention policy
- Evidence/object-storage abstraction
- Ingestion adapter interface and validation rules

## Week 3 - Sensor simulator and telemetry
- Deterministic scenario engine
- Normal, leak, pressure, reservoir, pump-health and weather scenarios
- Live telemetry API/WebSocket path
- Sensor quality, last-seen and calibration states

## Week 4 - Map command centre
- Site GIS model
- Operational map, KPI strip, filters and search
- Site/asset drilldown
- Weather/environment overlay abstraction

## Week 5 - Digital twin
- Water topology graph
- State propagation
- Asset health and sensor linkage
- Historical state snapshots

## Week 6 - Anomaly engine
- Threshold and baseline rules
- Night-flow leak pattern
- Pressure anomaly and reservoir drawdown
- Alert deduplication, severity and acknowledgement

## Week 7 - AI environmental intelligence
- Evidence retrieval contract
- Structured AI risk brief schema
- Confidence and reasoning policy
- Prompt/model logging and model-evaluation harness

## Week 8 - Human decision workflow
- Approve / Amend / Reject
- RBAC checks
- Ticket creation from approved recommendation
- Immutable decision/audit events

## Week 9 - Field inspections
- Ticket queues, SLA, assignment and checklist
- Evidence/photo/document upload
- Offline-friendly PWA considerations
- Closure and outcome capture

## Week 10 - Reporting and environmental KPIs
- Water-loss and intervention dashboards
- Data quality and sensor uptime
- Environmental/climate risk reporting
- Exportable pilot report

## Week 11 - Pilot hardening
- Multi-tenant isolation
- Security review and audit controls
- Observability, backups and recovery
- Integration dry-runs with MQTT/HTTP
- Performance/load tests

## Week 12 - Demonstration and deployment
- Municipal and mine pilot configurations
- Pilot baseline and KPI targets
- Investor/accelerator demo scenario
- Documentation, operating handbook and pilot handover
- Go/no-go review for real sensor deployment

## Exit criteria
The 12-week MVP is successful when it can ingest real or simulated telemetry, detect an evidence-backed anomaly, present a traceable AI recommendation, require human approval, dispatch accountable work and measure/report the operational outcome.
