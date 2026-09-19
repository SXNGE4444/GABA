# GABA Water - Data, AI and Digital-Twin Architecture

## Logical architecture

```text
Physical / external sources
  LoRaWAN | MQTT | Modbus | HTTP | GIS | weather | operator evidence
                         |
                         v
                Ingestion adapters
                         |
     validation / normalization / source identity
                         |
                         v
             Environmental data lake
             + time-series persistence
                         |
                         v
                Water digital twin
      organisation > site > zone > asset > sensor
                         |
            +------------+-------------+
            |                          |
            v                          v
   anomaly / state engine       climate-risk engine
            |                          |
            +------------+-------------+
                         v
               AI intelligence layer
          evidence retrieval + reasoning
                         |
                         v
            typed AI risk brief contract
  evidence + source + timestamp + confidence + summary
                         |
                         v
                HUMAN DECISION GATE
              approve / amend / reject
                         |
                         v
       inspection / maintenance / operational action
                         |
                         v
             append-only evidence + audit
                         |
                         v
                     reporting
```

## Data architecture
### Hot path
Telemetry is validated, assigned to a known sensor/asset/site and written to time-series storage. Recent windows drive live dashboards and anomaly features.

### Analytical path
Aggregated telemetry, weather, GIS layers, asset metadata, ticket outcomes and evidence references are persisted for trend analysis, model evaluation and reporting.

### Recommended production stack
- PostgreSQL + PostGIS for organisations, sites, assets, workflow and spatial entities
- TimescaleDB extension or a dedicated time-series service for readings
- Object storage for photos, inspection documents, raw payload archives and reports
- MQTT broker / LoRaWAN network-server integration at the ingestion boundary
- Server-side API in TypeScript or Python
- Queue/event bus for telemetry fan-out and asynchronous risk processing

## AI architecture
GABA should not use a single LLM as the anomaly detector.

1. **Rules / engineering constraints** - impossible ranges, pressure floors, reservoir operating bands, stale sensors.
2. **Statistical anomaly layer** - rolling baseline, median/MAD, z-score variants, changepoint and seasonality-aware deviation.
3. **Cross-sensor correlation** - e.g. elevated night flow + pressure drop + reservoir drawdown.
4. **Predictive models** - later: supervised leak classification, demand forecasting, reservoir forecasting, asset failure risk.
5. **AI reasoning layer** - turns structured anomaly evidence into a concise operational brief. It may recommend; it does not autonomously execute consequential action.
6. **Human decision layer** - role/permission checked approval with amend/reject path.
7. **Evaluation** - precision/recall, false-alarm rate, lead time, calibration of confidence and measured intervention outcome.

## AI risk brief contract
```json
{
  "brief_id": "BR-...",
  "site_id": "site-...",
  "asset_ids": ["asset-..."],
  "risk_type": "probable_leak",
  "severity": "critical",
  "confidence": 0.94,
  "generated_at": "ISO-8601",
  "reasoning_summary": "...",
  "predicted_impact": {"water_loss_m3_day_low": 1920, "water_loss_m3_day_high": 2640},
  "recommendation": "...",
  "evidence": [
    {"source_id":"sensor-id","source_type":"sensor","observed_at":"ISO-8601","value":47.2,"unit":"L/s","quality":"validated"}
  ],
  "decision_required": true
}
```

## Environmental digital twin
The twin is a stateful graph, not only a 3D model. Nodes represent assets/sites and edges represent hydraulic or operational relationships. Each node carries current state, telemetry, health, risk and evidence links. The MVP renders a topology schematic; production can add GIS geometry, DMA polygons, pipelines and elevation/hydraulic metadata.

## Simulator boundary
The simulator implements the same conceptual reading contract as a real adapter:

```text
source -> source identity -> timestamp -> metric -> value/unit -> quality -> ingest
```

Later LoRaWAN, MQTT, Modbus and HTTP adapters can replace the simulator without changing downstream anomaly, twin or workflow contracts.
