/* 15차: 3D 실험대 — 주사위 · 시료 주머니 · 분포 막대 · 카드 뒤집기 (CSS 3D만 사용) */
(function(){
const ZV=window.ZV,B=ZV.BENCH,A=ZV.BACT,$=s=>document.querySelector(s),rnd=Math.random;
const sfx=n=>{try{ZV.AUDIO&&ZV.AUDIO.sfx(n);}catch(e){}};

/* ---- 공통: 무대 · 드래그 회전 ---- */
const css=document.createElement('style');
css.textContent=`
.b3{position:relative;height:190px;max-width:420px;margin:8px 0;border-radius:10px;background:radial-gradient(ellipse at 50% 30%,#24362b,#0a120d);perspective:700px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;-webkit-user-select:none;--rx:-24deg;--ry:-26deg}
.b3.sm{height:156px}.b3:active{cursor:grabbing}
.b3w{position:absolute;left:50%;top:72%;width:0;height:0;transform-style:preserve-3d;transform:rotateX(var(--rx)) rotateY(var(--ry))}
.b3tip{position:absolute;right:8px;top:6px;font-size:11px;color:#9fc29e;pointer-events:none}
.b3fl{position:absolute;background:rgba(123,224,74,.09);border:1px solid rgba(123,224,74,.35);transform:rotateX(90deg)}
.b3lb{position:absolute;left:0;top:0;color:#eaffe0;font-size:11px;font-weight:700;white-space:nowrap}
.b3lb.gd{color:#ffd84a}
.b3bar{position:absolute;left:0;top:0;width:0;height:0;transform-style:preserve-3d}
.b3bar i{position:absolute;display:block;box-sizing:border-box;border:1px solid rgba(0,0,0,.25)}
.b3bar .f{background:#4fae3a}.b3bar .s{background:#2f7d3a}.b3bar .t{background:#93ea6c}
.b3bar.gd .f{background:#e2b230}.b3bar.gd .s{background:#a98215}.b3bar.gd .t{background:#ffe27a}
.dc,.dcr{position:absolute;left:0;top:0;width:0;height:0;transform-style:preserve-3d}
.dcr{transition:transform .9s cubic-bezier(.2,.8,.3,1)}
.dcf{position:absolute;left:-28px;top:-28px;width:56px;height:56px;box-sizing:border-box;display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);padding:7px;background:#f4f1e4;border:1px solid #b9b39a;border-radius:8px}
.dc.d2 .dcf{background:#cdeebd;border-color:#8fb57e}
.dcf i{border-radius:50%;margin:2px}.dcf i.p{background:#16241a}
.dcsh{position:absolute;left:-30px;top:-30px;width:60px;height:60px;border-radius:12px;background:rgba(0,0,0,.45);filter:blur(4px);transform:rotateX(90deg)}
.grid36 .hit3{outline:3px solid var(--gold);outline-offset:-2px;font-weight:800}
.jw{position:absolute;box-sizing:border-box;background:rgba(170,225,255,.08);border:1.5px solid rgba(190,235,255,.5)}
.jb{position:absolute;left:0;top:0;width:28px;height:28px;border-radius:50%;transition:transform .55s ease-out,opacity .55s}
.jb.r{background:radial-gradient(circle at 35% 30%,#ffb0a8,#d23f3f 55%,#7a1616)}
.jb.b{background:radial-gradient(circle at 35% 30%,#b6d6ff,#3f78d2 55%,#16397a)}
.jdot{display:inline-block;width:14px;height:14px;border-radius:50%;vertical-align:-2px;margin:0 2px}
.jdot.r{background:#d23f3f}.jdot.b{background:#3f78d2}
.pcard.up{animation:b3flip .55s ease-out}
@keyframes b3flip{0%{transform:perspective(320px) translateY(-14px) rotateY(180deg);background:#44564a;color:transparent}55%{background:#44564a;color:transparent}56%{background:var(--acid)}100%{transform:perspective(320px) rotateY(0)}}
`;
document.head.appendChild(css);

let drag=null;
document.addEventListener('pointerdown',e=>{const s=e.target.closest&&e.target.closest('.b3');if(!s)return;const c=getComputedStyle(s);drag={s,x:e.clientX,y:e.clientY,rx:parseFloat(c.getPropertyValue('--rx'))||0,ry:parseFloat(c.getPropertyValue('--ry'))||0,m:e.pointerType==='mouse'};});
document.addEventListener('pointermove',e=>{if(!drag)return;const d=drag;d.s.style.setProperty('--ry',(d.ry+(e.clientX-d.x)*.6)+'deg');if(d.m)d.s.style.setProperty('--rx',Math.max(-80,Math.min(-4,d.rx-(e.clientY-d.y)*.5))+'deg');});
['pointerup','pointercancel'].forEach(n=>document.addEventListener(n,()=>{drag=null;}));

const bb=(x,y,z)=>`translate3d(${x}px,${y}px,${z}px) rotateY(calc(var(--ry)*-1)) rotateX(calc(var(--rx)*-1)) translate(-50%,-50%)`;
const stage=(id,inner,cls)=>`<div class="b3 ${cls||''}"><span class="b3tip">↔ 끌어서 돌려 보기</span><div class="b3w" id="${id}">${inner||''}</div></div>`;

/* 막대 한 개: 바닥(y=0)에서 위로 h만큼 */
function bar(x,w,d,h,gd){const hw=w/2,hd=d/2;h=Math.max(1,h);
 return `<div class="b3bar${gd?' gd':''}" style="transform:translate3d(${x}px,0,0)">`+
  `<i class="f" style="left:${-hw}px;top:${-h}px;width:${w}px;height:${h}px;transform:translateZ(${hd}px)"></i>`+
  `<i class="f" style="left:${-hw}px;top:${-h}px;width:${w}px;height:${h}px;transform:rotateY(180deg) translateZ(${hd}px)"></i>`+
  `<i class="s" style="left:${-hd}px;top:${-h}px;width:${d}px;height:${h}px;transform:rotateY(90deg) translateZ(${hw}px)"></i>`+
  `<i class="s" style="left:${-hd}px;top:${-h}px;width:${d}px;height:${h}px;transform:rotateY(-90deg) translateZ(${hw}px)"></i>`+
  `<i class="t" style="left:${-hw}px;top:${-h-hd}px;width:${w}px;height:${d}px;transform:rotateX(90deg)"></i></div>`;}
/* vals: 0~1 높이 비율, xl: 아래 라벨, tl: 위 라벨, gold: 강조할 번호 */
function bars3(el,vals,xl,tl,gold){if(!el)return;const n=vals.length,w=Math.min(26,Math.floor(250/n)-4),gap=4,d=22,W=n*(w+gap),H=100;
 let h=`<div class="b3fl" style="left:${-W/2-8}px;top:${-d/2-10}px;width:${W+16}px;height:${d+20}px"></div>`;
 vals.forEach((v,i)=>{const x=-W/2+(w+gap)*i+(w+gap)/2,bh=Math.round(v*H);h+=bar(x,w,d,bh,i===gold);
  if(xl&&xl[i]!=null&&xl[i]!=='')h+=`<span class="b3lb${i===gold?' gd':''}" style="transform:${bb(x,12,d/2+10)}">${xl[i]}</span>`;
  if(tl&&tl[i])h+=`<span class="b3lb${i===gold?' gd':''}" style="transform:${bb(x,-bh-11,0)}">${tl[i]}</span>`;});
 el.innerHTML=h;}

/* ---- 1. 3D 주사위 (c3c, c4d) ---- */
const PIP={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
const FT={1:'translateZ(28px)',6:'rotateY(180deg) translateZ(28px)',2:'rotateY(90deg) translateZ(28px)',5:'rotateY(-90deg) translateZ(28px)',3:'rotateX(90deg) translateZ(28px)',4:'rotateX(-90deg) translateZ(28px)'};
const TOP={3:[0,0],1:[90,0],6:[-90,0],4:[180,0],2:[0,-90],5:[0,90]};
const face=v=>`<div class="dcf" style="transform:${FT[v]}">${[0,1,2,3,4,5,6,7,8].map(i=>`<i${PIP[v].includes(i)?' class="p"':''}></i>`).join('')}</div>`;
const cube=(k,x)=>`<div class="dcsh" style="transform:translate3d(${x}px,0,0) rotateX(90deg)"></div><div class="dc d${k}" style="transform:translate3d(${x}px,-29px,0)"><div class="dcr" id="dc${k}">${[1,2,3,4,5,6].map(face).join('')}</div></div>`;
let R=null;
function dieSet(k,v){const el=$('#dc'+k);if(!el)return;const[rx,rz]=TOP[v];R.k++;el.style.transform=`rotateY(${360*R.k+90*Math.floor(rnd()*4)}deg) rotateX(${rx+360*R.k}deg) rotateZ(${rz}deg)`;}
function diceInfo(b){const el=$('#d3I');if(!el||!R)return;const L=R.last;let h=L?`주사위 1: <b>${L[0]}</b> · 주사위 2: <b>${L[1]}</b> → 합 <b>${L[0]+L[1]}</b>, 곱 <b>${L[0]*L[1]}</b><br>`:'[굴리기]를 눌러 주사위 두 개를 던져 보세요. 표에서 나온 칸에 금색 테두리가 생겨요.<br>';
 if(R.n)h+=b.mode==='union'?`${R.n}번 던짐 · A 또는 B가 일어난 횟수 <b>${R.h}</b>번 (상대도수 ${(R.h/R.n).toFixed(2)})`:
  `${R.n}번 던짐 · 합이 ${b.s}인 경우 <b>${R.c}</b>번`+(R.c?` · 그중 둘 다 짝수 <b>${R.h}</b>번 (상대도수 ${(R.h/R.c).toFixed(2)})`:'');
 el.innerHTML=h;}
function diceMark(){const g=$('#d36');if(!g||!R||!R.last)return;const c=g.children[7+(R.last[0]-1)*7+R.last[1]];if(c)c.classList.add('hit3');}
function diceRoll(t){const b=ZV.CUR.B.bench,k=+t.dataset.k;if(!R)return;let i,j;
 for(let r=0;r<k;r++){i=1+Math.floor(rnd()*6);j=1+Math.floor(rnd()*6);R.n++;
  if(b.mode==='union'){if((i+j)%4===0||(i%2===1&&j%2===1))R.h++;}else if(i+j===b.s){R.c++;if(i%2===0&&j%2===0)R.h++;}}
 R.last=[i,j];dieSet(1,i);dieSet(2,j);sfx('knock');B.dice.draw(b);diceInfo(b);}
A.d3Roll=diceRoll;
{const d=B.dice,h0=d.html,i0=d.init,d0=d.draw;
 d.html=b=>`<div class="bn">주사위 1은 표의 <b>세로</b>(흰색), 주사위 2는 <b>가로</b>(연두색)예요.</div>`+stage('d3w',cube(1,-46)+cube(2,46),'sm')+
  `<div class="inrow"><button class="btn sm" data-act="d3Roll" data-k="1">굴리기</button><button class="btn ghost sm" data-act="d3Roll" data-k="100">100번 굴리기</button></div><div class="info" id="d3I"></div>`+h0(b);
 d.init=b=>{R={n:0,h:0,c:0,last:null,k:0};i0(b);diceInfo(b);};
 d.draw=b=>{d0(b);diceMark();};}

/* ---- 2. 3D 시료 주머니 (c4a) ---- */
let J=null;
const isJar=()=>ZV.CUR&&ZV.CUR.id==='c4a';
function jarNew(){const{a,b}=ZV.CUR.P,pos=[];for(let y=0;y<2;y++)for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++)pos.push([x*36+(y?8:0),-15-y*29,z*36+(y?-8:0)]);
 const cs=[...Array(a).fill('r'),...Array(b).fill('b')];for(let i=cs.length-1;i>0;i--){const k=Math.floor(rnd()*(i+1));[cs[i],cs[k]]=[cs[k],cs[i]];}
 J.balls=cs.map((c,i)=>({c,p:pos[i%pos.length],out:false}));J.drawn=[];}
function jarDraw(){const w=$('#j3w');if(!w||!J)return;const S=62,Hh=74;
 w.innerHTML=`<div class="b3fl" style="left:${-S-6}px;top:${-S-6}px;width:${2*S+12}px;height:${2*S+12}px"></div>`+
  J.balls.map((o,i)=>`<div class="jb ${o.c}" id="jb${i}" style="transform:${bb(o.p[0],o.p[1]-(o.out?150:0),o.p[2])};opacity:${o.out?0:1}"></div>`).join('')+
  ['translateZ('+S+'px)','rotateY(180deg) translateZ('+S+'px)','rotateY(90deg) translateZ('+S+'px)','rotateY(-90deg) translateZ('+S+'px)'].map(t=>`<div class="jw" style="left:${-S}px;top:${-Hh}px;width:${2*S}px;height:${Hh}px;transform:${t}"></div>`).join('');
 jarInfo();}
function jarInfo(){const el=$('#j3I');if(!el||!J)return;const{a,b}=ZV.CUR.P,D=J.drawn,nm=c=>`<span class="jdot ${c}"></span>${c==='r'?'빨강':'파랑'}`,r=J.balls.filter(o=>!o.out&&o.c==='r').length,bl=J.balls.filter(o=>!o.out&&o.c==='b').length;
 let h=D.length===0?`주머니 안: 빨강 <b>${a}</b>개 · 파랑 <b>${b}</b>개 (전체 ${a+b}개)`:
  D.length===1?`첫 번째: ${nm(D[0])} → 남은 시료: 빨강 <b>${r}</b>개 · 파랑 <b>${bl}</b>개 (전체 <b>${r+bl}</b>개)`:
  `첫 번째 ${nm(D[0])}, 두 번째 ${nm(D[1])} → 둘 다 빨강 <b>${D[0]==='r'&&D[1]==='r'?'○':'×'}</b>`;
 if(J.t)h+=`<br>2개 꺼내기 ${J.t}회 · 둘 다 빨강 <b>${J.h}</b>회 (상대도수 ${(J.h/J.t).toFixed(2)})`;
 el.innerHTML=h;}
A.j3Draw=()=>{if(!J)return;if(J.drawn.length>=2){jarNew();jarDraw();return;}
 const rest=J.balls.map((o,i)=>i).filter(i=>!J.balls[i].out),i=rest[Math.floor(rnd()*rest.length)],o=J.balls[i];o.out=true;J.drawn.push(o.c);
 const el=$('#jb'+i);if(el){el.style.transform=bb(o.p[0],o.p[1]-150,o.p[2]);el.style.opacity=0;}
 if(J.drawn.length===2){J.t++;if(J.drawn[0]==='r'&&J.drawn[1]==='r')J.h++;}
 sfx('paper');jarInfo();const bt=$('#j3B');if(bt)bt.textContent=J.drawn.length>=2?'다시 넣고 처음부터':'하나 더 꺼내기';};
A.j3Run=()=>{if(!J)return;const{a,b}=ZV.CUR.P,n=a+b;for(let k=0;k<100;k++){J.t++;if(rnd()<a/n&&rnd()<(a-1)/(n-1))J.h++;}jarNew();jarDraw();const bt=$('#j3B');if(bt)bt.textContent='하나 꺼내기';};
{const f=B.fill,h0=f.html,i0=f.init;
 f.html=b=>(isJar()?`<div class="bn">주머니에서 시료를 직접 꺼내 보세요. 꺼낸 시료는 다시 넣지 않아요.</div>`+stage('j3w','','')+
  `<div class="inrow"><button class="btn sm" data-act="j3Draw" id="j3B">하나 꺼내기</button><button class="btn ghost sm" data-act="j3Run">2개 꺼내기 100회</button></div><div class="info" id="j3I"></div>`:'')+h0(b);
 f.init=b=>{i0&&i0(b);if(isJar()){J={t:0,h:0};jarNew();jarDraw();}else J=null;};}

/* ---- 3. 3D 분포 막대 (c4c 독립시행 · c5c 이항분포) ---- */
{const m=B.binom,h0=m.html,d0=m.draw;
 m.html=b=>h0(b).replace('<div class="hist" id="bH">',stage('b3bn','','')+'<div class="hist" id="bH" style="display:none">').replace('<div class="hist-l" id="bL">','<div class="hist-l" id="bL" style="display:none">');
 m.draw=b=>{d0(b);const s=ZV.BS,mx=Math.max(.5,...s.c.map(v=>s.t?v/s.t:0));
  bars3($('#b3bn'),s.c.map(v=>s.t?v/s.t/mx:0),s.c.map((_,i)=>i+'번'),s.c.map(v=>s.t?(v/s.t).toFixed(2):''),b.k);};}
{const m=B.binstat,h0=m.html,p0=A.bsPick;
 m.html=b=>h0(b).replace('<div class="calc">','<div id="b3bs"></div><div class="calc">');
 A.bsPick=(t,e)=>{p0(t,e);const g=/n=(\d+), p=(\d+)\/(\d+)/.exec(t.textContent),box=$('#b3bs');if(!g||!box)return;
  const n=+g[1],p=g[2]/g[3],mu=n*p,sd=Math.sqrt(n*p*(1-p));let lo=Math.max(0,Math.floor(mu-4*sd)),hi=Math.min(n,Math.ceil(mu+4*sd));
  const pm=[];let v=Math.pow(1-p,n);for(let k=0;k<=n;k++){pm.push(v);v=v*(n-k)/(k+1)*p/(1-p);}
  const st=Math.ceil((hi-lo+1)/17),ks=[];for(let k=lo;k<=hi;k+=st)ks.push(k);
  const mx=Math.max(...ks.map(k=>pm[k])),gi=ks.reduce((bi,k,i)=>Math.abs(k-mu)<Math.abs(ks[bi]-mu)?i:bi,0),ev=ks.length>9?2:1;
  box.innerHTML=`<div class="bn">B(${n}, ${g[2]}/${g[3]})의 분포 모양이에요. 금색 막대가 평균에 가장 가까운 값이에요.</div>`+stage('b3bw','','');
  bars3($('#b3bw'),ks.map(k=>pm[k]/mx),ks.map((k,i)=>i===gi||i%ev===0?k:''),null,gi);};}
})();
