/* 좀비바이러스 연구실 — 공통 코드 (15차) */
(function(){
'use strict';
const ZV=window.ZV={VER:15,KEY:'starshard_math_escape'};   /* 저장 키는 차수가 바뀌어도 그대로 → 이전 차수 기록이 이어짐 */
ZV.$=(s,r=document)=>r.querySelector(s);
ZV.esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
ZV.clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
ZV.fact=n=>{let r=1;for(let i=2;i<=n;i++)r*=i;return r;};
ZV.nPr=(n,r)=>(r<0||r>n)?0:ZV.fact(n)/ZV.fact(n-r);
ZV.nCr=(n,r)=>{if(r<0||r>n)return 0;let x=1;for(let i=1;i<=r;i++)x=x*(n-r+i)/i;return Math.round(x);};
ZV.gcd=(a,b)=>b?ZV.gcd(b,a%b):a;
ZV.frac=(a,b)=>{const g=ZV.gcd(a,b);return{p:a/g,q:b/g};};
ZV.pq=(a,b)=>{const f=ZV.frac(a,b);return f.p+f.q;};                 /* 분수 a/b를 기약분수로 만든 뒤 p+q */
ZV.r2=v=>Math.round(v*100)/100;
ZV.r4=v=>Math.round(v*10000)/10000;
ZV.rnd=()=>Math.random();
ZV.randn=()=>Math.sqrt(-2*Math.log(1-Math.random()))*Math.cos(2*Math.PI*Math.random());
ZV.fmtT=s=>{s=Math.max(0,Math.round(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');};
ZV.LET='ABCDEFGHI';
ZV.TBL={0.5:0.1915,1:0.3413,1.5:0.4332,2:0.4772,2.5:0.4938,3:0.4987};  /* 표준정규분포표 P(0≤Z≤z) */
ZV.ZS=[0.5,1,1.5,2,2.5,3];

/* ---------- 저장 ---------- */
const DEFSET={part:'all',partNo:1,sound:true,music:true,effects:true,vol:.6,bright:1,lock:true,showAns:false,limitMin:0,hintWait:20,hintPenalty:0,tension:true,cur:'2022',pin:'0000',off:{},params:{},glow:true};
ZV.S={settings:JSON.parse(JSON.stringify(DEFSET)),profiles:{},cur:null,lastVer:ZV.VER};
ZV.load=function(){try{const d=JSON.parse(localStorage.getItem(ZV.KEY)||'null');if(d){const S=ZV.S;S.settings=Object.assign(JSON.parse(JSON.stringify(DEFSET)),d.settings||{});S.settings.off=S.settings.off||{};S.settings.params=S.settings.params||{};S.profiles=d.profiles||{};S.cur=d.cur||null;}}catch(e){}};
ZV.save=function(){try{ZV.S.lastVer=ZV.VER;localStorage.setItem(ZV.KEY,JSON.stringify(ZV.S));}catch(e){}};
ZV.prof=()=>ZV.S.profiles[ZV.S.cur];
ZV.newProfile=look=>({created:Date.now(),look,totalSecs:0,rooms:{},finishedAt:null,game:{si:0,wall:0,items:[],flags:{},seen:{}}});
ZV.rs=function(id){const p=ZV.prof();return p.rooms[id]||(p.rooms[id]={solved:false,tries:0,wrong:[],hints:0,secs:0,inputs:[],penalty:0});};
ZV.G=()=>{const p=ZV.prof();if(!p.game)p.game={si:0,wall:0,items:[],flags:{},seen:{}};return p.game;};

/* ---------- 문항 값·활성 목록 ---------- */
ZV.getParams=function(id){const R=ZV.RM[id],o={},set=ZV.S.settings;for(const f of R.fields){let v=set.params[id]&&set.params[id][f.k];if(typeof v!=='number'||isNaN(v))v=f.def;
  if(f.sel)v=f.sel.includes(v)?v:f.def;else{v=ZV.clamp(v,f.min,f.max);if(f.step)v=Math.round(v/f.step)*f.step;}o[f.k]=v;}
 if(R.fix)R.fix(o);return o;};
ZV.changed=id=>ZV.RM[id].fields.some(f=>ZV.getParams(id)[f.k]!==f.def);
ZV.pActive=p=>(!p.cur||p.cur===ZV.S.settings.cur)&&!ZV.S.settings.off[p.id];
ZV.stagePids=st=>st.pids.filter(id=>ZV.pActive(ZV.RM[id]));
/* 12차: 수업 나누기 — 한 교시에 28문항은 많아서(약 1시간) 차시별로 구역을 나눠 진행. 교사 설정에서 고르고 "이번 시간"을 정한다. */
ZV.PARTS={all:{n:'한 번에 (7구역 모두)',g:[['s1','s2','s3','s4','s5','s6','s7']],gn:['1~7구역']},
 p3:{n:'3차시로 나누기',g:[['s1','s2','s3'],['s4','s5'],['s6','s7']],gn:['1~3구역 (경우의 수 · 확률 시작)','4~5구역 (확률 · 통계 시작)','6~7구역 (통계적 추정)']},
 p2:{n:'2차시로 나누기 (확률 / 통계)',g:[['s1','s2','s3','s4'],['s5','s6','s7']],gn:['1~4구역 (경우의 수 · 확률)','5~7구역 (통계)']}};
ZV.part=()=>{const s=ZV.S.settings,P=ZV.PARTS[s.part]||ZV.PARTS.all,no=ZV.clamp(s.partNo|0||1,1,P.g.length);return{key:(ZV.PARTS[s.part]?s.part:'all')+':'+no,no,of:P.g.length,ids:P.g[no-1],name:P.gn[no-1],last:no===P.g.length};};
ZV.stages=()=>{const ids=ZV.part().ids;return ZV.STAGES.filter(st=>ids.includes(st.id)&&ZV.stagePids(st).length>0);};
ZV.allStages=()=>ZV.STAGES.filter(st=>ZV.stagePids(st).length>0);
ZV.allActive=()=>ZV.allStages().flatMap(st=>ZV.stagePids(st));
ZV.isSolved=id=>{const p=ZV.prof();return !!(p.rooms[id]&&p.rooms[id].solved);};
ZV.stageDone=st=>ZV.stagePids(st).every(ZV.isSolved);
ZV.allDone=()=>ZV.stages().every(ZV.stageDone);
ZV.stageUnlocked=function(i){if(!ZV.S.settings.lock)return true;const L=ZV.stages();for(let k=0;k<i;k++)if(!ZV.stageDone(L[k]))return false;return true;};

/* ---------- 정답 판정 ---------- */
ZV.same=(kind,inp,v)=>kind==='int'||kind==='pq'?inp===v:kind==='dec2'?Math.abs(inp-v)<0.0051:Math.abs(inp-v)<0.00006;
ZV.ansText=a=>a.kind==='pq'?`${a.p}/${a.q} → ${a.p}+${a.q} = ${a.v}`:a.kind==='dec2'?a.v.toFixed(2):a.kind==='dec4'?a.v.toFixed(4):String(a.v);
ZV.ansPlain=a=>String(a.kind==='dec2'?a.v.toFixed(2):a.kind==='dec4'?a.v.toFixed(4):a.v);
ZV.judge=function(B,raw){const a=B.ans,k=a.kind,t=raw.replace(/\s/g,'');
 if(!t)return{ok:false,msg:'답을 입력해 주세요.'};
 if(k==='pq'&&t.includes('/'))return{ok:false,msg:'p/q 모양이 아니라, p+q를 계산한 <b>하나의 수</b>를 입력해야 해요. (예: 3/8 → 11)'};
 const v=Number(t);if(!isFinite(v))return{ok:false,msg:'숫자만 입력할 수 있어요.'};
 if((k==='int'||k==='pq')&&!Number.isInteger(v))return{ok:false,msg:'자연수(정수)로 입력해 주세요.'};
 if(ZV.same(k,v,a.v))return{ok:true};
 for(const w of B.wrong)if(w[0]!==a.v&&ZV.same(k,v,w[0]))return{ok:false,msg:w[1]};
 if(k==='dec2'&&Math.abs(v-a.v)<0.05)return{ok:false,msg:'가까워요! 소수 둘째 자리까지 정확히 계산했는지 확인해 보세요.'};
 if(k==='dec4'&&Math.abs(v-a.v)<0.005)return{ok:false,msg:'가까워요! 소수 넷째 자리까지, 표의 값을 정확히 더하고 뺐는지 확인해 보세요.'};
 return{ok:false,msg:'아직 아니에요. 실험대와 힌트를 활용해 다시 생각해 보세요.'};};

/* ---------- 답 형식 ---------- */
ZV.INT={kind:'int',rule:'답은 <b>자연수 하나</b>(가짓수)를 입력합니다.',ex:'예: 가짓수가 12가지이면 → <b>12</b>'};
ZV.PQ={kind:'pq',rule:'확률을 <b>기약분수 p/q</b>로 나타낸 뒤 <b>p+q의 값</b>을 입력합니다.',ex:'예: 3/8 이면 → 3 + 8 = <b>11</b>'};
ZV.DEC4={kind:'dec4',rule:'<b>소수 넷째 자리</b>까지 입력합니다. (표준정규분포표의 값을 그대로 더하고 빼서 구해요)',ex:'예: 0.3413 + 0.1915 = 0.5328 → <b>0.5328</b>'};
ZV.DEC2={kind:'dec2',rule:'<b>소수 둘째 자리</b>까지 입력합니다. (셋째 자리에서 반올림. 정수이면 12처럼 써도 돼요)',ex:'예: 12.345 → <b>12.35</b>'};
ZV.DEC4R={kind:'dec4',rule:'<b>소수 넷째 자리</b>까지 입력합니다. (다섯째 자리에서 반올림)',ex:'예: 0.12345 → <b>0.1235</b>'};
})();
