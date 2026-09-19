export const roles = [
  'Platform Admin','Organisation Admin','Operations Controller','Engineer / Technical Manager',
  'Environmental Officer','Field Inspector','Executive / Read-only'
];

export const sites = [
  { id:'site-khula', name:'Khula Water District', region:'Western Cape, South Africa', status:'watch', x:28, y:46, nrw:31.8, pressure:412, reservoir:63 },
  { id:'site-motswedi', name:'Motswedi Industrial Water Scheme', region:'North West, South Africa', status:'normal', x:71, y:34, nrw:18.4, pressure:468, reservoir:78 }
];

export const assets = [
  {id:'res-01',siteId:'site-khula',name:'Khula North Reservoir',type:'Reservoir',status:'watch',capacityMl:18.0,level:63},
  {id:'pump-01',siteId:'site-khula',name:'Pump Station K-03',type:'Pump',status:'normal',health:92},
  {id:'zone-01',siteId:'site-khula',name:'DMA K-17',type:'Pipeline Zone',status:'critical',pressure:338},
  {id:'tank-02',siteId:'site-motswedi',name:'Process Water Tank 02',type:'Tank',status:'normal',capacityMl:4.2,level:78},
  {id:'pump-02',siteId:'site-motswedi',name:'Transfer Pump M-02',type:'Pump',status:'normal',health:96},
  {id:'zone-02',siteId:'site-motswedi',name:'Industrial Ring Main',type:'Pipeline Zone',status:'normal',pressure:468}
];

export const sensors = [
  {id:'F-K17-IN',siteId:'site-khula',assetId:'zone-01',name:'DMA K-17 Inlet Flow',kind:'flow',unit:'L/s',value:47.2,baseline:22.4,status:'critical',battery:87,signal:-71,lastSeen:'now'},
  {id:'P-K17-DN',siteId:'site-khula',assetId:'zone-01',name:'DMA K-17 Downstream Pressure',kind:'pressure',unit:'kPa',value:338,baseline:421,status:'critical',battery:91,signal:-65,lastSeen:'now'},
  {id:'L-KNR-01',siteId:'site-khula',assetId:'res-01',name:'Khula North Level',kind:'level',unit:'%',value:63,baseline:72,status:'watch',battery:100,signal:-58,lastSeen:'now'},
  {id:'V-K03',siteId:'site-khula',assetId:'pump-01',name:'K-03 Pump Vibration',kind:'vibration',unit:'mm/s',value:3.2,baseline:2.7,status:'normal',battery:100,signal:-54,lastSeen:'now'},
  {id:'Q-KNR-01',siteId:'site-khula',assetId:'res-01',name:'Reservoir Turbidity',kind:'quality',unit:'NTU',value:0.72,baseline:0.65,status:'normal',battery:83,signal:-76,lastSeen:'now'},
  {id:'F-MR-IN',siteId:'site-motswedi',assetId:'zone-02',name:'Ring Main Flow',kind:'flow',unit:'m³/h',value:181,baseline:176,status:'normal',battery:89,signal:-69,lastSeen:'now'},
  {id:'P-MR-01',siteId:'site-motswedi',assetId:'zone-02',name:'Ring Main Pressure',kind:'pressure',unit:'kPa',value:468,baseline:462,status:'normal',battery:94,signal:-62,lastSeen:'now'},
  {id:'L-MT-02',siteId:'site-motswedi',assetId:'tank-02',name:'Process Tank Level',kind:'level',unit:'%',value:78,baseline:76,status:'normal',battery:100,signal:-52,lastSeen:'now'}
];

export const seededBrief = {
  id:'BR-2026-0814-017', severity:'critical', status:'awaiting-approval', siteId:'site-khula', assetId:'zone-01',
  title:'Probable distribution leak — DMA K-17', confidence:0.94, generatedAt:'2026-08-14 23:18 SAST',
  reasoning:'Night-flow demand is 111% above the expected band while downstream pressure fell 19.7% in the same interval. Reservoir drawdown accelerated without a matching authorised consumption event. The multi-sensor pattern is consistent with a persistent distribution leak rather than normal demand variability.',
  impact:'Estimated 1,920–2,640 m³/day at current conditions; potential escalation if pressure cycling continues.',
  recommendation:'Approve a priority field inspection of DMA K-17 within 2 hours. Verify acoustic/leak evidence at the eastern branch, inspect isolation valves V17-4 and V17-6, and confirm customer-side demand exceptions before any isolation decision.',
  evidence:[
    {source:'F-K17-IN',timestamp:'2026-08-14 23:05',reading:'47.2 L/s',note:'Expected night-flow band 18–26 L/s'},
    {source:'P-K17-DN',timestamp:'2026-08-14 23:05',reading:'338 kPa',note:'Baseline 421 kPa'},
    {source:'L-KNR-01',timestamp:'2026-08-14 23:05',reading:'63%',note:'Decline rate 2.4× expected'},
    {source:'Weather API / simulator',timestamp:'2026-08-14 23:00',reading:'0 mm/h',note:'No rainfall/demand event explaining pattern'}
  ]
};

export const initialAlerts = [
  {id:'AL-017',severity:'critical',type:'Leak pattern',site:'Khula Water District',asset:'DMA K-17',confidence:94,status:'Awaiting approval',time:'23:18'},
  {id:'AL-012',severity:'warning',type:'Reservoir decline',site:'Khula Water District',asset:'Khula North Reservoir',confidence:82,status:'Acknowledged',time:'22:42'},
  {id:'AL-009',severity:'warning',type:'Weather risk',site:'Motswedi Industrial Water Scheme',asset:'Catchment / access road',confidence:76,status:'Watching',time:'21:55'},
  {id:'AL-004',severity:'info',type:'Sensor calibration due',site:'Motswedi Industrial Water Scheme',asset:'P-MR-01',confidence:100,status:'Planned',time:'18:30'}
];

export const initialTickets = [
  {id:'WO-028',title:'Inspect reservoir level transmitter',site:'Khula Water District',priority:'P2',owner:'Field Team Delta',status:'In progress',sla:'4h'},
  {id:'WO-021',title:'Calibrate ring-main pressure sensor',site:'Motswedi Industrial Water Scheme',priority:'P3',owner:'Instrumentation',status:'Scheduled',sla:'24h'}
];

export const auditSeed = [
  {time:'23:18:31',actor:'GABA Intelligence',action:'AI risk brief created',object:'BR-2026-0814-017',result:'Human approval required'},
  {time:'23:18:14',actor:'Anomaly Engine',action:'Cross-sensor correlation',object:'DMA K-17',result:'Leak probability 0.94'},
  {time:'23:05:09',actor:'Simulator Adapter',action:'Telemetry ingested',object:'F-K17-IN / P-K17-DN',result:'Validated'},
  {time:'22:42:50',actor:'N. Dlamini',action:'Alert acknowledged',object:'AL-012',result:'Investigation assigned'}
];
