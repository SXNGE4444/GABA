-- AEI Water Intelligence production-oriented relational schema baseline.
-- PostgreSQL; enable PostGIS/TimescaleDB in deployment where available.

create extension if not exists pgcrypto;

create table organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organisation_type text not null,
  country_code char(2) not null default 'ZA',
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key,
  email text not null unique,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table memberships (
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (role in ('platform_admin','organisation_admin','operations_controller','technical_manager','environmental_officer','field_inspector','executive_readonly')),
  primary key (organisation_id,user_id)
);

create table sites (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  name text not null,
  site_type text not null,
  latitude double precision,
  longitude double precision,
  timezone text not null default 'Africa/Johannesburg',
  created_at timestamptz not null default now()
);

create table zones (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  name text not null,
  zone_type text not null,
  metadata jsonb not null default '{}'::jsonb
);

create table assets (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  zone_id uuid references zones(id) on delete set null,
  parent_asset_id uuid references assets(id) on delete set null,
  name text not null,
  asset_type text not null,
  external_ref text,
  operational_status text not null default 'unknown',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table sensors (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references assets(id) on delete cascade,
  source_key text not null unique,
  sensor_type text not null,
  unit text not null,
  adapter_type text not null,
  calibration_due_at timestamptz,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb
);

create table sensor_readings (
  sensor_id uuid not null references sensors(id) on delete cascade,
  observed_at timestamptz not null,
  received_at timestamptz not null default now(),
  value double precision not null,
  unit text not null,
  quality text not null default 'validated',
  source_payload_ref text,
  primary key (sensor_id, observed_at)
);

create index sensor_readings_time_idx on sensor_readings (observed_at desc);

create table weather_observations (
  id bigserial primary key,
  site_id uuid not null references sites(id) on delete cascade,
  observed_at timestamptz not null,
  source text not null,
  rainfall_mm double precision,
  temperature_c double precision,
  wind_ms double precision,
  payload jsonb not null default '{}'::jsonb
);

create table environmental_observations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  asset_id uuid references assets(id) on delete set null,
  observation_type text not null,
  observed_at timestamptz not null,
  source text not null,
  value jsonb not null,
  evidence_item_id uuid
);

create table anomalies (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  asset_id uuid references assets(id) on delete set null,
  anomaly_type text not null,
  severity text not null,
  score double precision not null,
  detected_at timestamptz not null,
  state text not null default 'open',
  feature_snapshot jsonb not null
);

create table alerts (
  id uuid primary key default gen_random_uuid(),
  anomaly_id uuid references anomalies(id) on delete set null,
  site_id uuid not null references sites(id) on delete cascade,
  asset_id uuid references assets(id) on delete set null,
  severity text not null,
  title text not null,
  status text not null default 'open',
  confidence double precision,
  detected_at timestamptz not null,
  acknowledged_at timestamptz,
  acknowledged_by uuid references users(id)
);

create table ai_risk_briefs (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null references alerts(id) on delete cascade,
  risk_type text not null,
  severity text not null,
  confidence double precision not null check (confidence between 0 and 1),
  reasoning_summary text not null,
  predicted_impact jsonb not null,
  recommendation text not null,
  model_id text not null,
  generated_at timestamptz not null default now(),
  decision_required boolean not null default true,
  status text not null default 'awaiting_approval'
);

create table evidence_items (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  source_type text not null,
  source_id text not null,
  observed_at timestamptz,
  captured_at timestamptz not null default now(),
  object_uri text,
  sha256 text,
  mime_type text,
  metadata jsonb not null default '{}'::jsonb
);

alter table environmental_observations
  add constraint environmental_observation_evidence_fk foreign key (evidence_item_id) references evidence_items(id);

create table ai_evidence_references (
  brief_id uuid not null references ai_risk_briefs(id) on delete cascade,
  evidence_item_id uuid not null references evidence_items(id) on delete restrict,
  relevance text,
  primary key (brief_id,evidence_item_id)
);

create table decisions (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references ai_risk_briefs(id) on delete cascade,
  decided_by uuid not null references users(id),
  decision text not null check (decision in ('approved','amended','rejected')),
  amendment text,
  decided_at timestamptz not null default now()
);

create table inspection_tickets (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  asset_id uuid references assets(id) on delete set null,
  source_brief_id uuid references ai_risk_briefs(id),
  title text not null,
  priority text not null,
  status text not null default 'open',
  assigned_to uuid references users(id),
  due_at timestamptz,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create table ticket_tasks (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references inspection_tickets(id) on delete cascade,
  task text not null,
  completed boolean not null default false,
  completed_by uuid references users(id),
  completed_at timestamptz
);

create table ticket_evidence (
  ticket_id uuid not null references inspection_tickets(id) on delete cascade,
  evidence_item_id uuid not null references evidence_items(id) on delete restrict,
  primary key (ticket_id,evidence_item_id)
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  report_type text not null,
  period_start timestamptz not null,
  period_end timestamptz not null,
  generated_by uuid references users(id),
  evidence_uri text,
  created_at timestamptz not null default now()
);

create table integration_sources (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  adapter_type text not null check (adapter_type in ('simulator','lorawan','mqtt','modbus','http','csv')),
  name text not null,
  status text not null default 'configured',
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table audit_events (
  id bigint generated always as identity primary key,
  organisation_id uuid references organisations(id) on delete set null,
  actor_type text not null,
  actor_id text not null,
  action text not null,
  object_type text not null,
  object_id text not null,
  result text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index audit_events_org_time_idx on audit_events (organisation_id, occurred_at desc);
