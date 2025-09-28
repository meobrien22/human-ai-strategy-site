// Highlight current page in nav
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a=>{
    if(a.getAttribute('href')===path) a.style.textDecoration='underline';
  });
})();

// Fetch JSON helper
async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

// Format helpers
const fmt = {
  pct:x=>`${Math.round((x||0)*100)}%`,
  num:x=>Number(x||0).toLocaleString(),
  date:s=>s?new Date(s).toLocaleDateString():''
};

// Simple progress bar
function renderProgress(el, pct){
  el.innerHTML = `<div class="progress"><span style="width:${Math.max(0,Math.min(100,pct))}%"></span></div>`;
}

// Tiny bar chart
function drawBars(canvasId, labels, values){
  const c = document.getElementById(canvasId);
  if(!c) return;
  const ctx = c.getContext('2d');
  const w = c.width = c.clientWidth;
  const h = c.height = c.clientHeight;
  ctx.clearRect(0,0,w,h);
  const max = Math.max(1, ...values);
  const pad = 24, gap = 12;
  const bw = (w - pad*2 - gap*(values.length-1)) / values.length;
  ctx.fillStyle = '#cfe3ff';
  values.forEach((v,i)=>{
    const x = pad + i*(bw+gap);
    const bh = (v/max)*(h-pad*1.8);
    const y = h - pad - bh;
    ctx.fillRect(x,y,bw,bh);
  });
  ctx.fillStyle = '#8ea8cf';
  ctx.font = '12px sans-serif';
  labels.forEach((t,i)=>{
    const x = pad + i*(bw+gap) + bw/2;
    ctx.textAlign='center';
    ctx.fillText(t, x, h-6);
  });
}

/* ===== Export helpers ===== */
function download(filename, content, mime='text/plain'){
  const blob = new Blob([content], {type: mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
function toCSV(rows){
  if(!rows || !rows.length) return '';
  const headers = Object.keys(rows[0]);
  const esc = v => `"${String(v??'').replace(/"/g,'""')}"`;
  const body = rows.map(r=>headers.map(h=>esc(r[h])).join(',')).join('\n');
  return headers.join(',') + '\n' + body;
}
function exportJSON(filename, data){ download(filename, JSON.stringify(data, null, 2), 'application/json'); }
function exportCSV(filename, rows){ download(filename, toCSV(rows), 'text/csv'); }
window.__exportUtils = { exportJSON, exportCSV };
