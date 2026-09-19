import {roles,sites,assets,sensors,seededBrief,initialAlerts,initialTickets,auditSeed} from './data.js';
import {SensorSimulator} from './simulator.js';
import {mountLanding} from './landing.js';

const state={section:'command',role:'Operations Controller',sensors:structuredClone(sensors),alerts:structuredClone(initialAlerts.filter(a=>a.id!=='AL-017')),tickets:structuredClone(initialTickets),audit:structuredClone(auditSeed.filter(a=>a.object!=='BR-2026-0919-017'&&a.object!=='DMA K-17')),briefStatus:'awaiting-approval',scenario:'normal',demo:{active:false,step:0,detected:false,resolved:false,lossM3Day:2340,avoidedM3Day:0,responseMinutes:23}};
const nav=[['command','Command Centre'],['sites','Sites & Assets'],['sensors','Sensors'],['alerts','Alert Centre'],['twin','Digital Twin'],['ai','AI Risk Briefs'],['tickets','Inspections & Maintenance'],['evidence','Evidence Store'],['audit','Audit Log'],['reports','Reports'],['integrations','API / Integrations'],['admin','Admin']];
const app=document.querySelector('#app');
let demoTimers=[];

const simulator=new SensorSimulator(sensors,(next,meta)=>{state.sensors=next;if(meta?.scenario)state.scenario=meta.scenario;updateLive();});

function sensor(id){return state.sensors.find(s=>s.id===id)}
function statusClass(v){return ['critical','warning','watch'].includes(v)?v:'normal'}
function toast(msg){const el=document.createElement('div');el.className='toast';el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),2600)}
function audit(actor,action,object,result){state.audit.unshift({time:new Date().toLocaleTimeString('en-ZA',{hour12:false}),actor,action,object,result});renderAudit();}

function shell(){
  document.body.classList.remove('marketing-mode');
  document.body.classList.add('platform-mode');
  app.innerHTML=`<div class="app-shell">
    <aside class="sidebar" id="sidebar"><div class="brand"><div class="brand-mark"><img class="brand-symbol" src="assets/gaba-monogram.svg" alt="GABA monogram" /><div><h1>GABA</h1><p>Water Intelligence</p></div></div><div class="brand-line">Inspired by nature.<br>Driven by a cleaner future.</div></div>
      <nav class="nav">${nav.map(([id,label])=>`<button data-nav="${id}" class="${state.section===id?'active':''}"><span>${label}</span>${id==='alerts'?`<span class="tag">${state.alerts.length}</span>`:''}</button>`).join('')}</nav>
      <div class="sidebar-footer"><div class="eyebrow">GABA WATER MVP</div><p>SIMULATED SENSOR ADAPTER ACTIVE</p><span class="mono">build 0.1.0 / HUMAN-GOVERNED AI</span></div></aside>
    <main class="main"><header class="topbar"><div class="top-left"><button class="btn mobile-menu" id="menuBtn">☰</button><div><div class="eyebrow">GABA / Water Intelligence</div><div class="page-title" id="pageTitle">Command Centre</div></div></div>
      <div class="top-actions"><button class="demo-launch ${state.demo.active?'active':''}" data-demo-launch>${state.demo.active?`Demo ${state.demo.step}/5`:'Hackathon Demo'}</button><span class="status-pill"><span class="dot"></span>Platform healthy</span><select id="roleSelect" class="role-select">${roles.map(r=>`<option ${r===state.role?'selected':''}>${r}</option>`).join('')}</select></div></header>
      <div id="demoCoach">${demoCoach()}</div>
      <div class="content">${sections()}</div></main></div>`;
  bind(); simulator.start();
}

function sections(){return `${commandSection()}${sitesSection()}${sensorsSection()}${alertsSection()}${twinSection()}${aiSection()}${ticketsSection()}${evidenceSection()}${auditSection()}${reportsSection()}${integrationsSection()}${adminSection()}`}

function commandSection(){
 const f=sensor('F-K17-IN')||sensors[0],p=sensor('P-K17-DN')||sensors[1],l=sensor('L-KNR-01')||sensors[2];
 const loss=state.demo.detected&&!state.demo.resolved?'2,340':'0';
 const anomalies=state.demo.detected&&!state.demo.resolved?'1':'0';
 return `<section id="section-command" class="section ${state.section==='command'?'active':''}">
  ${state.demo.resolved?impactOutcome():''}
  <div class="grid kpis">
   ${metric('Estimated water loss',loss,'m³/day',state.demo.detected&&!state.demo.resolved?'critical':'')}${metric('NRW proxy','31.8','%','warning')}${metric('Active anomalies',anomalies,'',state.demo.detected&&!state.demo.resolved?'critical':'')}${metric('Avg zone pressure',Math.round((p.value+468)/2),'kPa','')}${metric('Reservoir level',l.value,'%',state.demo.resolved?'':'warning')}${metric('Sensor uptime','99.2','%','')}
  </div>
  <div class="grid command-grid"><div class="card"><div class="panel-head"><div><h2>Geospatial Operations Map</h2><p>Live site state • infrastructure overlays • weather/environment risk</p></div><div class="toolbar"><span class="chip">Rainfall overlay</span><span class="chip">Pressure zones</span></div></div>${mapMarkup()}</div>
  <div class="side-stack">${incidentCard(f,p)}${simCard()}</div></div></section>`
}
function incidentCard(f,p){
 if(state.demo.resolved)return `<div class="card incident resolved-incident"><div class="severity">Resolved • field evidence verified</div><h3>DMA K-17 returned to expected operating band</h3><p>The simulated repair is complete. Night flow and downstream pressure have returned to baseline, and the intervention is recorded in the audit trail.</p><div class="evidence-mini"><div><span>Night flow</span><strong class="mono">${f.value} ${f.unit}</strong></div><div><span>Pressure</span><strong class="mono">${p.value} ${p.unit}</strong></div><div><span>Projected loss avoided</span><strong class="mono">2.34 ML/day</strong></div></div></div>`;
 if(state.demo.detected)return `<div class="card incident"><div class="severity critical">Critical • AI evidence ready</div><h3>${seededBrief.title}</h3><p>${seededBrief.reasoning}</p><div class="evidence-mini"><div><span>Night flow</span><strong class="mono" id="cmdFlow">${f.value} ${f.unit}</strong></div><div><span>Pressure</span><strong class="mono" id="cmdPressure">${p.value} ${p.unit}</strong></div><div><span>Confidence</span><strong class="mono">94%</strong></div></div><button class="btn primary" data-demo-evidence>Open evidence & decision →</button></div>`;
 return `<div class="card incident normal-incident"><div class="severity">Normal • no critical water-loss anomaly</div><h3>DMA K-17 operating inside expected band</h3><p>Start the guided hackathon demo to inject a deterministic leak pattern and watch GABA detect, explain and route the event into a human-approved field response.</p><div class="evidence-mini"><div><span>Night flow</span><strong class="mono" id="cmdFlow">${f.value} ${f.unit}</strong></div><div><span>Pressure</span><strong class="mono" id="cmdPressure">${p.value} ${p.unit}</strong></div><div><span>Critical alerts</span><strong class="mono">0</strong></div></div><button class="btn primary" data-demo-launch>Run hackathon demo →</button></div>`;
}
function impactOutcome(){return `<div class="impact-outcome card"><div><div class="eyebrow">DEMO OUTCOME / VERIFIED INTERVENTION</div><h2>Projected 2.34 million litres of water loss avoided per day.</h2><p>Demo estimate based on the detected 2,340 m³/day loss rate after the simulated field repair returns the network to baseline.</p></div><div class="impact-outcome-grid"><div><span>Projected avoided loss</span><strong>2.34 ML/day</strong></div><div><span>Night flow</span><strong>22.4 L/s</strong></div><div><span>Pressure recovered</span><strong>421 kPa</strong></div><div><span>Demo response time</span><strong>${state.demo.responseMinutes} min</strong></div></div></div>`}
function metric(label,value,unit,kind=''){return `<div class="card metric ${kind}"><div class="label">${label}</div><div class="value mono">${value}${unit?` <span style="font-size:11px">${unit}</span>`:''}</div><div class="delta">Current operational estimate</div></div>`}
function mapMarkup(){
 const critical=state.demo.detected&&!state.demo.resolved;
 const khulaState=state.demo.resolved?'Resolved / verified':critical?'Leak risk • DMA K-17':'Normal operations';
 const pinColor=critical?'#ff6b5e':'#73c894';
 return `<div class="map"><svg viewBox="0 0 100 70" preserveAspectRatio="none" aria-label="Operational map"><path d="M3 19 C18 7, 34 10, 42 17 S70 13, 96 26" fill="none" stroke="#263a32" stroke-width="1"/><path d="M10 57 C23 44, 38 49, 52 39 S74 39, 91 52" fill="none" stroke="#1e3029" stroke-width="1.2"/><path d="M28 46 L39 40 L46 48 L60 42" fill="none" stroke="#567565" stroke-width=".45" stroke-dasharray="1.3 1.2"/><g class="site-pin ${critical?'critical':''}" data-site="site-khula" transform="translate(28 46)">${critical?'<circle class="pulse" r="15"/>':''}<circle class="outer" r="4.2"/><circle r="1.3" fill="${pinColor}"/><text x="6" y="-2" fill="#edf4f0" font-size="2.4">Khula Water District</text><text x="6" y="1.2" fill="#9db0a8" font-size="1.8">${khulaState}</text></g><g class="site-pin" data-site="site-motswedi" transform="translate(71 34)"><circle class="outer" r="4.2"/><circle r="1.3" fill="#73c894"/><text x="6" y="-2" fill="#edf4f0" font-size="2.4">Motswedi Industrial</text><text x="6" y="1.2" fill="#9db0a8" font-size="1.8">Normal operations</text></g></svg><div class="map-legend"><span style="color:${critical?'var(--critical)':'var(--ok)'}">● ${critical?'Critical incident':'Khula normal'}</span><span style="color:var(--ok)">● Motswedi normal</span><span>Grid = operational geospatial layer</span></div></div>`
}
function simCard(){return `<div class="card sim"><div class="panel-head" style="padding:0 0 10px;border:0"><div><h2>Sensor Simulator</h2><p>Hardware-independent MVP adapter</p></div><span class="chip" id="simState">${state.scenario}</span></div><div class="current">Inject deterministic operating conditions. Real LoRaWAN/MQTT/Modbus/HTTP adapters replace this interface later.</div><select id="scenarioSelect" style="width:100%;margin-bottom:8px"><option value="normal" ${state.scenario==='normal'?'selected':''}>Normal</option><option value="leak" ${state.scenario==='leak'?'selected':''}>Leak pattern</option><option value="pressure" ${state.scenario==='pressure'?'selected':''}>Pressure instability</option><option value="reservoir" ${state.scenario==='reservoir'?'selected':''}>Reservoir decline</option><option value="pump" ${state.scenario==='pump'?'selected':''}>Pump vibration</option></select><div class="sim-controls"><button class="btn primary" id="simStart">Start</button><button class="btn" id="simPause">Pause</button><button class="btn" id="simInject">Inject anomaly</button><button class="btn danger" id="simReset">Reset</button></div></div>`}
function sitesSection(){return `<section id="section-sites" class="section ${state.section==='sites'?'active':''}">${title('Sites & Assets','Organisation → site → zone → asset hierarchy for reservoirs, tanks, pumps, valves, pipelines and meters.')}${sites.map(s=>`<div class="card pad" style="margin-bottom:12px"><div class="brief-head"><div><div class="eyebrow">${s.region}</div><h3>${s.name}</h3></div><span class="state ${statusClass(s.status)}">${s.status}</span></div><div class="grid report-grid">${assets.filter(a=>a.siteId===s.id).map(a=>`<div class="report-card card"><div class="eyebrow">${a.type}</div><h3>${a.name}</h3><p>Asset ID <span class="mono">${a.id}</span><br>Status: ${a.status}<br>${a.level!=null?`Level ${a.level}%`:a.health?`Health ${a.health}%`:`Pressure ${a.pressure} kPa`}</p></div>`).join('')}</div></div>`).join('')}</section>`}
function sensorsSection(){return `<section id="section-sensors" class="section ${state.section==='sensors'?'active':''}">${title('Live Sensor Telemetry','Simulated readings use the same adapter boundary planned for LoRaWAN, MQTT, Modbus and HTTP integrations.') }<div class="card table-wrap"><table class="table"><thead><tr><th>Sensor</th><th>Type</th><th>Value</th><th>State</th><th>Battery</th><th>Signal</th><th>Last seen</th></tr></thead><tbody id="sensorRows">${sensorRows()}</tbody></table></div><div class="card pad" style="margin-top:14px"><div class="panel-head" style="padding:0 0 12px"><div><h2>DMA K-17 telemetry trend</h2><p>Rolling simulated pressure / flow pattern</p></div></div>${chartMarkup()}</div></section>`}
function sensorRows(){return state.sensors.map(s=>`<tr><td><strong>${s.name}</strong><br><span class="mono" style="color:var(--muted)">${s.id}</span></td><td>${s.kind}</td><td class="mono">${s.value} ${s.unit}</td><td><span class="state ${statusClass(s.status)}">${s.status}</span></td><td>${s.battery}%</td><td class="mono">${s.signal} dBm</td><td>${s.lastSeen}</td></tr>`).join('')}
function chartMarkup(){return `<div class="chart"><svg viewBox="0 0 600 180" preserveAspectRatio="none"><path class="chart-grid" d="M0 45H600 M0 90H600 M0 135H600 M120 0V180 M240 0V180 M360 0V180 M480 0V180"/><path class="chart-line" d="M0 130 C40 129 70 132 105 126 S180 127 220 124 S280 120 320 115 S360 95 400 76 S450 51 490 42 S540 46 600 35"/></svg></div>`}
function alertsSection(){return `<section id="section-alerts" class="section ${state.section==='alerts'?'active':''}">${title('Alert Centre','Every alarm must show what happened, where, when, confidence, evidence and who owns the next action.')}<div class="card table-wrap"><table class="table"><thead><tr><th>Severity</th><th>Type</th><th>Site</th><th>Asset</th><th>Confidence</th><th>Status</th><th>Detected</th></tr></thead><tbody>${state.alerts.map(a=>`<tr><td><span class="severity ${a.severity}">${a.severity}</span></td><td><strong>${a.type}</strong></td><td>${a.site}</td><td>${a.asset}</td><td class="mono">${a.confidence}%</td><td>${a.status}</td><td class="mono">${a.time}</td></tr>`).join('')}</tbody></table></div></section>`}
function twinSection(){const critical=state.demo.detected&&!state.demo.resolved;return `<section id="section-twin" class="section ${state.section==='twin'?'active':''}">${title('Environmental Digital Twin','A live operational representation of source, storage, pumping, pressure zones and sensor state—not a decorative diagram.')}<div class="card twin"><div class="twin-flow"><div class="node"><div class="eyebrow">Storage</div><strong>Khula North Reservoir</strong><div class="readout mono" id="twinLevel">${sensor('L-KNR-01')?.value||72}%</div></div><div class="pipe"></div><div class="node"><div class="eyebrow">Pump</div><strong>K-03 Pump Station</strong><div class="readout mono">92%</div></div><div class="pipe"></div><div class="node ${critical?'critical':''}"><div class="eyebrow">DMA</div><strong>K-17 Pressure Zone</strong><div class="readout mono" id="twinPressure">${sensor('P-K17-DN')?.value||421} kPa</div></div><div class="pipe"></div><div class="node ${critical?'critical':''}"><div class="eyebrow">Demand / Loss</div><strong>Night Flow</strong><div class="readout mono" id="twinFlow">${sensor('F-K17-IN')?.value||22.4} L/s</div></div></div></div></section>`}
function aiSection(){
 if(!state.demo.detected)return `<section id="section-ai" class="section ${state.section==='ai'?'active':''}">${title('AI Environmental Intelligence','AI detects, predicts and recommends. Consequential actions remain behind an explicit human decision boundary.')}<div class="card empty-state"><div class="eyebrow">NO ACTIVE HIGH-RISK BRIEF</div><h3>GABA is waiting for an evidence-backed anomaly.</h3><p>Run the guided hackathon demo to inject a leak pattern and generate the decision-support brief.</p><button class="btn primary" data-demo-launch>Run hackathon demo</button></div></section>`;
 return `<section id="section-ai" class="section ${state.section==='ai'?'active':''}">${title('AI Environmental Intelligence','AI detects, predicts and recommends. Consequential actions remain behind an explicit human decision boundary.')}<div class="grid split"><div class="card brief"><div class="brief-head"><div><div class="severity critical">Critical • ${seededBrief.id}</div><h3>${seededBrief.title}</h3></div><div><div class="eyebrow">Confidence</div><div class="confidence mono">94%</div></div></div><p><strong>Reasoning summary.</strong> ${seededBrief.reasoning}</p><p><strong>Predicted impact.</strong> ${seededBrief.impact}</p><p><strong>Recommended response.</strong> ${seededBrief.recommendation}</p><div class="evidence-list">${seededBrief.evidence.map(e=>`<div class="evidence-item"><div class="top"><span class="mono">${e.source}</span><span>${e.timestamp} SAST</span></div><strong>${e.reading}</strong><div style="font-size:10px;color:var(--muted);margin-top:3px">${e.note}</div></div>`).join('')}</div><div class="decision-bar"><div class="eyebrow" style="margin-bottom:8px">Human decision required • current: <span id="briefStatus">${state.briefStatus}</span></div><div class="btn-row"><button class="btn primary" id="approveBrief" ${state.briefStatus==='approved'?'disabled':''}>Approve & create inspection</button><button class="btn" id="amendBrief">Amend</button><button class="btn danger" id="rejectBrief">Reject</button></div></div></div><div class="card pad"><h3>Evidence contract</h3><p style="color:var(--muted);font-size:12px;line-height:1.6">Every AI brief contains source identifiers, source timestamps, generated timestamp, confidence, reasoning summary, predicted impact and human decision state.</p><div class="evidence-mini"><div><span>Generated</span><strong>${seededBrief.generatedAt}</strong></div><div><span>Model role</span><strong>Decision support</strong></div><div><span>Autonomous control</span><strong>Disabled</strong></div><div><span>Evidence items</span><strong>${seededBrief.evidence.length}</strong></div></div></div></div></section>`
}
function ticketsSection(){return `<section id="section-tickets" class="section ${state.section==='tickets'?'active':''}">${title('Inspections & Maintenance','Turn approved recommendations into accountable field work with ownership, SLA, checklists, evidence and closure.')}<div class="card table-wrap"><table class="table"><thead><tr><th>Ticket</th><th>Work</th><th>Site</th><th>Priority</th><th>Owner</th><th>Status</th><th>SLA</th><th>Action</th></tr></thead><tbody id="ticketRows">${ticketRows()}</tbody></table></div></section>`}
function ticketRows(){return state.tickets.map(t=>`<tr><td class="mono">${t.id}</td><td><strong>${t.title}</strong></td><td>${t.site}</td><td>${t.priority}</td><td>${t.owner}</td><td>${t.status}</td><td>${t.sla}</td><td>${t.id==='WO-031'&&t.status!=='Resolved'?'<button class="btn primary" data-complete-ticket="WO-031">Verify repair complete</button>':t.id==='WO-031'?'<span class="state">Evidence verified</span>':'—'}</td></tr>`).join('')}
function evidenceSection(){
 if(!state.demo.detected)return `<section id="section-evidence" class="section ${state.section==='evidence'?'active':''}">${title('Evidence Store','Traceable operational evidence linked to sensors, AI briefs, tickets, decisions and reports.')}<div class="card empty-state"><div class="eyebrow">NO ACTIVE INCIDENT EVIDENCE</div><h3>Evidence appears when GABA detects a verifiable event.</h3><p>The guided demo creates sensor, anomaly, AI, decision and field-response evidence as the workflow progresses.</p><button class="btn primary" data-demo-launch>Run hackathon demo</button></div></section>`;
 return `<section id="section-evidence" class="section ${state.section==='evidence'?'active':''}">${title('Evidence Store','Traceable operational evidence linked to sensors, AI briefs, tickets, decisions and reports.')}<div class="grid report-grid">${seededBrief.evidence.map((e,i)=>`<div class="card report-card"><div class="eyebrow">Evidence EV-${String(i+1).padStart(3,'0')}</div><h3>${e.source}</h3><p><strong>${e.reading}</strong><br>${e.timestamp} SAST<br>${e.note}<br><span class="mono">provenance: simulator://${e.source.toLowerCase()}</span><br><span class="mono">sha256: demo-${(i+1)*184739}</span></p></div>`).join('')}</div></section>`
}
function auditSection(){return `<section id="section-audit" class="section ${state.section==='audit'?'active':''}">${title('Audit Log','Chronological record of system inference, human decisions and workflow actions. Production architecture uses append-only audit persistence.')}<div class="card audit" id="auditRows">${auditRows()}</div></section>`}
function auditRows(){return state.audit.map(a=>`<div class="audit-row"><div class="mono">${a.time}</div><strong>${a.actor}</strong><div class="object">${a.action} • <span class="mono">${a.object}</span></div><div class="result">${a.result}</div></div>`).join('')}
function reportsSection(){return `<section id="section-reports" class="section ${state.section==='reports'?'active':''}">${title('Operational & Environmental Reports','Pilot-ready reporting centred on measurable water loss, interventions, asset health, climate risk and evidence-backed outcomes.')}<div class="grid report-grid">${[['Water Loss & NRW','Estimated input, authorised demand, night-flow anomalies, leak events and m³/day avoided.'],['Asset Health','Pump, valve, reservoir and sensor availability with maintenance evidence.'],['Environmental / Climate Risk','Rainfall, access, catchment and operational risk observations linked to sites.'],['Intervention Outcomes','Acknowledgement time, inspection SLA, closure evidence and estimated water saved.'],['Data Quality','Sensor uptime, data completeness, calibration status and stale telemetry.'],['Executive Pilot Summary','KPI trend, highest risks, closed actions, unresolved exposures and audit references.']].map(([h,p])=>`<div class="card report-card"><div class="eyebrow">GABA WATER REPORT</div><h3>${h}</h3><p>${p}</p><button class="btn">Generate demo report</button></div>`).join('')}</div></section>`}
function integrationsSection(){return `<section id="section-integrations" class="section ${state.section==='integrations'?'active':''}">${title('API & Sensor Integrations','Adapter boundary keeps the MVP usable today while preparing for field hardware and municipal/industrial APIs.')}<div class="grid report-grid">${[['Simulator Adapter','ACTIVE','Deterministic in-browser telemetry source for demos and QA.'],['LoRaWAN','READY','Planned network-server webhook / MQTT bridge.'],['MQTT','READY','Topic-based telemetry ingestion with device registry and quality checks.'],['Modbus','READY','Edge gateway adapter for RTU/TCP industrial equipment.'],['HTTP / REST','READY','Authenticated external telemetry and operational system feeds.'],['CSV / Batch','READY','Controlled bulk import for historic readings and asset registries.']].map(([h,s,p])=>`<div class="card report-card"><div class="eyebrow">${s}</div><h3>${h}</h3><p>${p}</p></div>`).join('')}</div></section>`}
function adminSection(){return `<section id="section-admin" class="section ${state.section==='admin'?'active':''}">${title('Administration','Role-based platform configuration for organisations, sites, users, integrations and data governance.')}<div class="grid report-grid">${[['Organisations','2 demo organisations / tenants'],['Users & Roles',`${roles.length} operational role types`],['Sites & Zones','2 sites / 2 pressure zones'],['Integration Sources','Simulator active / 5 adapters ready'],['API Keys','Server-side secrets only in production'],['Governance','Human approval required for consequential actions']].map(([h,p])=>`<div class="card report-card"><h3>${h}</h3><p>${p}</p><button class="btn">Configure</button></div>`).join('')}</div></section>`}
function title(h,p){return `<div class="section-title"><div><div class="eyebrow">GABA WATER INTELLIGENCE</div><h2>${h}</h2><p>${p}</p></div><div class="toolbar"><span class="chip">Role: ${state.role}</span><span class="chip">Water MVP</span></div></div>`}

function demoCoach(){
 const steps=['Ready','Leak injected','Anomaly detected','Human decision','Field inspection','Impact verified'];
 const step=Math.max(0,Math.min(state.demo.step,5));
 const progress=steps.map((label,i)=>`<div class="demo-step ${i<=step?'done':''} ${i===step?'current':''}"><span>${i}</span><b>${label}</b></div>`).join('');
 let action='';
 if(!state.demo.active)action='<button class="btn primary" data-demo-launch>Run guided demo</button>';
 else if(step===1)action='<span class="demo-live"><span class="dot"></span> Injecting abnormal flow + pressure pattern…</span>';
 else if(step===2)action='<button class="btn primary" data-demo-evidence>Open evidence brief</button>';
 else if(step===3)action='<span>Review the evidence below, then approve the field inspection.</span>';
 else if(step===4)action='<button class="btn primary" data-demo-ticket>Open inspection WO-031</button>';
 else if(step===5)action='<button class="btn" data-demo-reset>Run demo again</button>';
 return `<div class="demo-coach ${state.demo.active?'active':''}"><div><div class="eyebrow">NEXTSTEP HACKS / GUIDED DEMO</div><div class="demo-progress">${progress}</div></div><div class="demo-action">${action}</div></div>`;
}
function bindDemoControls(){
 document.querySelectorAll('[data-demo-launch]').forEach(b=>b.onclick=startDemo);
 document.querySelectorAll('[data-demo-evidence]').forEach(b=>b.onclick=()=>{state.demo.step=3;state.section='ai';shell();});
 document.querySelectorAll('[data-demo-ticket]').forEach(b=>b.onclick=()=>{state.section='tickets';shell();});
 document.querySelectorAll('[data-demo-reset]').forEach(b=>b.onclick=startDemo);
 document.querySelectorAll('[data-complete-ticket]').forEach(b=>b.onclick=completeInspection);
}
function startDemo(){
 demoTimers.forEach(clearTimeout); demoTimers=[];
 state.demo={active:true,step:1,detected:false,resolved:false,lossM3Day:2340,avoidedM3Day:0,responseMinutes:23};
 state.section='command'; state.briefStatus='awaiting-approval';
 state.alerts=structuredClone(initialAlerts.filter(a=>a.id!=='AL-017'));
 state.tickets=structuredClone(initialTickets);
 state.audit=structuredClone(auditSeed.filter(a=>a.object!=='BR-2026-0919-017'&&a.object!=='DMA K-17'));
 simulator.reset(); state.scenario='normal'; shell();
 audit('Demo Orchestrator','Baseline established','DMA K-17','Normal operating band');
 toast('Baseline normal — injecting simulated leak');
 demoTimers.push(setTimeout(()=>{simulator.inject('leak');audit('Simulator Adapter','Leak pattern injected','DMA K-17','Flow elevated / pressure falling');},650));
 demoTimers.push(setTimeout(()=>{
   state.demo.detected=true; state.demo.step=2;
   state.alerts.unshift({id:'AL-017',severity:'critical',type:'Leak pattern',site:'Khula Water District',asset:'DMA K-17',confidence:94,status:'Awaiting approval',time:new Date().toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit',hour12:false})});
   audit('Anomaly Engine','Cross-sensor correlation','DMA K-17','Leak probability 0.94');
   audit('GABA Intelligence','AI risk brief created',seededBrief.id,'Human approval required');
   shell(); toast('Anomaly detected — evidence brief ready');
 },2100));
}
function completeInspection(){
 const ticket=state.tickets.find(t=>t.id==='WO-031');
 if(!ticket)return;
 ticket.status='Resolved'; ticket.owner='Field Team Alpha'; ticket.sla=`${state.demo.responseMinutes} min`;
 state.demo.resolved=true; state.demo.step=5; state.demo.avoidedM3Day=state.demo.lossM3Day;
 const alert=state.alerts.find(a=>a.id==='AL-017'); if(alert)alert.status='Resolved';
 simulator.setScenario('normal');
 audit('Field Team Alpha','Repair evidence uploaded','WO-031','Leak verified and repaired');
 audit('GABA Intelligence','Post-intervention verification','DMA K-17','Flow and pressure returned to baseline');
 state.section='command'; shell(); toast('Repair verified — projected water loss avoided: 2.34 ML/day');
}

function bind(){
 document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.nav)));
 document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
 document.querySelector('#roleSelect')?.addEventListener('change',e=>{state.role=e.target.value;toast(`Role switched to ${state.role}`);});
 document.querySelector('#menuBtn')?.addEventListener('click',()=>document.querySelector('#sidebar').classList.toggle('open'));
 document.querySelector('#simStart')?.addEventListener('click',()=>{simulator.start();toast('Sensor simulation running');});
 document.querySelector('#simPause')?.addEventListener('click',()=>{simulator.pause();toast('Simulation paused');});
 document.querySelector('#simReset')?.addEventListener('click',()=>{simulator.reset();toast('Simulation reset to normal');});
 document.querySelector('#simInject')?.addEventListener('click',()=>{const s=document.querySelector('#scenarioSelect').value;simulator.inject(s);audit(state.role,'Scenario injected',s,'Simulator updated');toast(`Injected ${s} scenario`);});
 document.querySelector('#scenarioSelect')?.addEventListener('change',e=>simulator.setScenario(e.target.value));
 document.querySelector('#approveBrief')?.addEventListener('click',()=>decide('approved'));
 document.querySelector('#amendBrief')?.addEventListener('click',()=>decide('amended'));
 document.querySelector('#rejectBrief')?.addEventListener('click',()=>decide('rejected'));
 document.querySelectorAll('.site-pin').forEach(p=>p.addEventListener('click',()=>{go('sites');toast(`Opened ${sites.find(s=>s.id===p.dataset.site)?.name}`)}));
 bindDemoControls();
}
function go(id){if(state.demo.active&&state.demo.detected&&id==='ai'&&state.demo.step<3)state.demo.step=3;state.section=id;document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));document.querySelector(`#section-${id}`)?.classList.add('active');document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===id));document.querySelector('#pageTitle').textContent=nav.find(n=>n[0]===id)?.[1]||'GABA Water Intelligence';document.querySelector('#sidebar').classList.remove('open');const coach=document.querySelector('#demoCoach');if(coach)coach.innerHTML=demoCoach();bindDemoControls();window.scrollTo({top:0,behavior:'smooth'});}
function decide(kind){state.briefStatus=kind;document.querySelector('#briefStatus').textContent=kind;audit(state.role,`AI recommendation ${kind}`,seededBrief.id,kind==='approved'?'Inspection workflow authorised':'Human decision recorded');if(kind==='approved'&&!state.tickets.some(t=>t.id==='WO-031')){state.tickets.unshift({id:'WO-031',title:'Priority leak inspection — DMA K-17',site:'Khula Water District',priority:'P1',owner:'Field Team Alpha',status:'Open',sla:'2h'});if(state.demo.active)state.demo.step=4;shell();toast('Approved. Inspection WO-031 created — no autonomous isolation action.');}else{const coach=document.querySelector('#demoCoach');if(coach)coach.innerHTML=demoCoach();bindDemoControls();toast(`Recommendation ${kind}. Audit event recorded.`)}}
function renderTickets(){const el=document.querySelector('#ticketRows');if(el)el.innerHTML=ticketRows()}
function renderAudit(){const el=document.querySelector('#auditRows');if(el)el.innerHTML=auditRows()}
function updateLive(){
 const rows=document.querySelector('#sensorRows');if(rows)rows.innerHTML=sensorRows();
 const f=sensor('F-K17-IN'),p=sensor('P-K17-DN'),l=sensor('L-KNR-01');
 const set=(id,text)=>{const el=document.querySelector(id);if(el)el.textContent=text};
 set('#cmdFlow',`${f.value} ${f.unit}`);set('#cmdPressure',`${p.value} ${p.unit}`);set('#twinFlow',`${f.value} L/s`);set('#twinPressure',`${p.value} kPa`);set('#twinLevel',`${l.value}%`);set('#simState',state.scenario);
}

if(location.hash==='#platform') shell();
else mountLanding(app,shell);
