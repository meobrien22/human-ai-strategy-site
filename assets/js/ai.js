// Lightweight scoring and “AI-ish” summaries (no external APIs)
function normalize(x, min=0, max=100){ return Math.max(0, Math.min(1, ((x??0)-min)/(max-min))); }

function scoreSolution(sol){
  const impact = normalize(sol.impact,0,100)*100;
  const complianceGain = normalize(sol.complianceGain,0,100)*100;
  const riskReduction = normalize(100-(sol.risk??40),0,100)*100; // lower risk => higher
  const effort = Math.max(1, sol.effort ?? 5); // 1-10
  const wsjf = Math.round((impact*0.5 + complianceGain*0.3 + riskReduction*0.2) / effort);
  const governance = Math.round(
    (normalize(sol.policy)+normalize(sol.ethics)+normalize(sol.bias)+normalize(sol.security)+normalize(sol.privacy))/5*100
  );
  const dailyImpact = Math.round((sol.dailyUsage||0) * (sol.impact||0) / 100);
  return { wsjf, governance, dailyImpact };
}

function topN(arr, n, by){ return [...arr].sort((a,b)=>by(b)-by(a)).slice(0,n); }

function statusBadge(score){
  if(score>=80) return {cls:'ok',label:'OK'};
  if(score>=60) return {cls:'warn',label:'Attention'};
  return {cls:'crit',label:'Critical'};
}

function summarizeSolution(sol, scores){
  const s = statusBadge(scores.governance);
  return `Governance ${scores.governance} (${s.label}) • Priority ${scores.wsjf} • KPIs: ${Object.keys(sol.kpis||{}).slice(0,3).join(', ')||'n/a'}`;
}

async function loadAllData(){
  const base = './data/';
  const [solutions, risks, cadence, members, phases, phaseActions, playbook, agenda] = await Promise.all([
    loadJSON(base+'solutions.json'),
    loadJSON(base+'riskRegister.json'),
    loadJSON(base+'governanceCadence.json'),
    loadJSON(base+'governanceMembers.json'),
    loadJSON(base+'phases.json'),
    loadJSON(base+'phasesActions.json'),
    loadJSON(base+'playbookSections.json'),
    loadJSON(base+'workshopAgenda.json')
  ]);
  return {solutions, risks, cadence, members, phases, phaseActions, playbook, agenda};
}
