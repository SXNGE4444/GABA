export class SensorSimulator {
  constructor(seedSensors, onTick) {
    this.seed = structuredClone(seedSensors);
    this.sensors = structuredClone(seedSensors);
    this.onTick = onTick;
    this.timer = null;
    this.scenario = 'leak';
    this.t = 0;
  }

  start(){ if(this.timer) return; this.timer = setInterval(()=>this.tick(), 1500); this.tick(); }
  pause(){ clearInterval(this.timer); this.timer = null; }
  reset(){ this.pause(); this.sensors = structuredClone(this.seed); this.t = 0; this.scenario='normal'; this.onTick(this.snapshot()); }
  setScenario(name){ this.scenario=name; this.t=0; this.tick(true); }
  inject(name){ this.setScenario(name); }
  snapshot(){ return structuredClone(this.sensors); }

  tick(force=false){
    this.t += 1;
    for(const s of this.sensors){
      const wobble = Math.sin((this.t + s.id.length) / 3) * (s.kind === 'flow' ? 0.8 : s.kind === 'pressure' ? 4 : 0.3);
      s.value = Number((s.baseline + wobble).toFixed(s.kind==='pressure'?0:1));
      s.status='normal'; s.lastSeen='now';
    }
    const byId = id => this.sensors.find(s=>s.id===id);
    if(this.scenario==='leak'){
      const flow=byId('F-K17-IN'), pressure=byId('P-K17-DN'), level=byId('L-KNR-01');
      flow.value=Number((45 + Math.sin(this.t/2)*3).toFixed(1)); flow.status='critical';
      pressure.value=Math.round(342 + Math.sin(this.t/2)*7); pressure.status='critical';
      level.value=Number((64 - Math.min(this.t*0.08,5)).toFixed(1)); level.status='watch';
    }
    if(this.scenario==='pressure'){
      const pressure=byId('P-K17-DN'); pressure.value=Math.round(288 + Math.sin(this.t)*20); pressure.status='critical';
    }
    if(this.scenario==='reservoir'){
      const level=byId('L-KNR-01'); level.value=Number(Math.max(41,66-this.t*0.6).toFixed(1)); level.status=level.value<50?'critical':'watch';
    }
    if(this.scenario==='pump'){
      const vibration=byId('V-K03'); vibration.value=Number((7.2+Math.sin(this.t)*0.9).toFixed(1)); vibration.status='critical';
    }
    this.onTick(this.snapshot(), {scenario:this.scenario, force});
  }
}
