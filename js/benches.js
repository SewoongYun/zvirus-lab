/* 좀비바이러스 연구실 — 실험대 (조작·관찰 → 규칙 발견) */
(function(){
'use strict';
const ZV=window.ZV,{$,fact,nPr,nCr,TBL,ZS,r2,r4,LET,rnd,randn}=ZV;
const B=ZV.BENCH={}, A=ZV.BACT={};
const adv=k=>ZV.adv&&ZV.adv(k);
const BS=()=>ZV.BS;
const P=()=>ZV.CUR.B.bench;
const CALC=`<div class="calc"><b>계산기</b> n <input type="number" data-c="n" value="6" min="0" max="12"> r <input type="number" data-c="r" value="2" min="0" max="12"><button class="btn sm ghost" data-act="calc" data-op="P">nPr</button><button class="btn sm ghost" data-act="calc" data-op="C">nCr</button><button class="btn sm ghost" data-act="calc" data-op="H">nHr</button><button class="btn sm ghost" data-act="calc" data-op="F">n!</button><output id="cOut">—</output></div>`;
A.calc=t=>{const n=+$('[data-c=n]').value,r=+$('[data-c=r]').value,op=t.dataset.op;let v,s;
 if(op==='P'){v=nPr(n,r);s=`${n}P${r}`;}else if(op==='C'){v=nCr(n,r);s=`${n}C${r}`;}else if(op==='H'){v=r>0||n>0?nCr(n+r-1,r):1;s=`${n}H${r}`;}else{v=fact(n);s=`${n}!`;}
 $('#cOut').textContent=s+' = '+v;adv(ZV.CUR.B.steps.length-1);};
const colors=['#2c9a57','#2a6fdb','#e8742a','#b53fb5','#d23f3f','#2a9fa0','#9a7a1a','#555'];
const wrap=(h,cls)=>`<div class="${cls||''}">${h}</div>`;

/* ---- 1. 동서 복도 (합의 법칙·곱의 법칙) ---- */
B.routes={html:()=>`<div class="bn">문을 차례로 눌러 길을 찾아 보세요. 찾은 길이 아래에 기록돼요.</div><div class="inrow"><b>동쪽 복도</b> 첫째 문:</div><div class="cards" id="rE"></div><div class="inrow" id="rFh"></div><div class="cards" id="rF"></div><div class="inrow"><b>서쪽 복도</b> 문:</div><div class="cards" id="rW"></div><div class="info" id="rI"></div><button class="btn ghost sm" data-act="rtClear">기록 지우기</button>`,
 init:b=>{ZV.BS={fe:null,found:new Set()};B.routes.draw(b);},
 draw:b=>{const s=ZV.BS;$('#rE').innerHTML=Array.from({length:b.a},(_,i)=>`<button class="cb ${s.fe===i+1?'on':''}" data-act="rtE" data-i="${i+1}">동${i+1}</button>`).join('');
  $('#rFh').innerHTML=s.fe?`<b>동${s.fe}</b> 다음 둘째 문 (누르면 길이 기록돼요):`:'';
  $('#rF').innerHTML=s.fe?Array.from({length:b.b},(_,j)=>`<button class="cb" data-act="rtF" data-j="${j+1}">${j+1}</button>`).join(''):'';
  $('#rW').innerHTML=Array.from({length:b.c},(_,k)=>`<button class="cb" data-act="rtW" data-k="${k+1}">서${k+1}</button>`).join('');
  const f=[...s.found],e=f.filter(x=>x[0]==='E').length,w=f.length-e;
  $('#rI').innerHTML=`찾은 서로 다른 길: 동쪽 <b>${e}</b>가지 · 서쪽 <b>${w}</b>가지 (모두 <b>${f.length}</b>가지)<br><span class="small">${f.join(', ')||'아직 없어요'}</span>`;}};
A.rtE=t=>{ZV.BS.fe=+t.dataset.i;B.routes.draw(P());};
A.rtF=t=>{const s=ZV.BS;s.found.add(`동${s.fe}-${t.dataset.j}`);B.routes.draw(P());adv(1);};
A.rtW=t=>{ZV.BS.found.add(`서${t.dataset.k}`);B.routes.draw(P());adv(2);};
A.rtClear=()=>{ZV.BS.found.clear();ZV.BS.fe=null;B.routes.draw(P());};

/* ---- 2. 보안 서랍 암호 (순열) ---- */
B.slots={html:()=>`<div class="bn">카드를 눌러 왼쪽 칸부터 채워 보세요.</div><div class="cards" id="sC"></div><div class="slots" id="sS"></div><div class="info" id="sI"></div><button class="btn ghost sm" data-act="slotClear">비우기</button>${CALC}`,
 init:b=>{ZV.BS={pl:[]};B.slots.draw(b);},
 draw:b=>{const pl=ZV.BS.pl;$('#sC').innerHTML=Array.from({length:b.n},(_,i)=>`<button class="cb" data-act="slotPick" data-i="${i+1}" ${pl.includes(i+1)?'disabled':''}>${i+1}</button>`).join('');
  $('#sS').innerHTML=Array.from({length:b.r},(_,i)=>`<div class="slot ${i===pl.length?'cur':''}"><div class="sv">${pl[i]!==undefined?pl[i]:'?'}</div><div class="sl">${i===pl.length?`고를 수 있는 카드 <b>${b.n-i}</b>장`:i<pl.length?`${b.n-i}장 중에서 골랐어요`:''}</div></div>`).join('');
  $('#sI').textContent=pl.length===b.r?`암호 ${pl.join(' ')} 완성! 칸마다 고를 수 있던 카드 수를 떠올려 보세요.`:'';}};
A.slotPick=t=>{const b=P(),s=ZV.BS;if(s.pl.length>=b.r)return;s.pl.push(+t.dataset.i);B.slots.draw(b);adv(Math.min(s.pl.length,2));};
A.slotClear=()=>{ZV.BS.pl=[];B.slots.draw(P());};

/* ---- 3. 시약 보관함 (조합) ---- */
B.pick={html:b=>`<div class="bn">시약 ${b.r}종을 눌러 골라 보세요. (A와 B를 같이 골라 보세요)</div><div class="cards" id="rC"></div><div class="info" id="rI"></div><button class="btn ghost sm" data-act="pkClear">비우기</button>${CALC}`,
 init:b=>{ZV.BS={sel:[]};B.pick.draw(b);},
 draw:b=>{const s=ZV.BS.sel;$('#rC').innerHTML=Array.from({length:b.n},(_,i)=>`<button class="cb ${s.includes(i)?'on':''}" data-act="pkTog" data-i="${i}">${LET[i]}</button>`).join('');
  const boom=s.includes(0)&&s.includes(1);let t=`고른 시약: ${s.map(i=>LET[i]).join(', ')||'없음'} (${s.length}/${b.r}종)`;
  if(boom)t+=`<br><b style="color:#d23f3f">폭발한다! A와 B는 함께 고를 수 없어요.</b> A, B를 이미 골랐다면 남은 <b>${b.r-2}</b>자리는 나머지 시약 <b>${b.n-2}</b>종 중에서 고르게 돼요.`;
  $('#rI').innerHTML=t;if(boom)adv(1);}};
A.pkTog=t=>{const b=P(),s=ZV.BS.sel,i=+t.dataset.i,k=s.indexOf(i);if(k>=0)s.splice(k,1);else if(s.length<b.r)s.push(i);B.pick.draw(b);};
A.pkClear=()=>{ZV.BS.sel=[];B.pick.draw(P());};

/* ---- 4. 봉인함 숫자 자물쇠 (중복순열) ---- */
B.rep={html:()=>`<div class="bn">숫자를 눌러 왼쪽 칸부터 채워 보세요. 같은 숫자를 또 써도 돼요.</div><div class="cards" id="pC"></div><div class="slots" id="pS"></div><div class="info" id="pI"></div><button class="btn ghost sm" data-act="repClear">비우기</button>${CALC}`,
 init:b=>{ZV.BS={pl:[]};B.rep.draw(b);},
 draw:b=>{const pl=ZV.BS.pl,first=pl.length===0;$('#pC').innerHTML=Array.from({length:b.n},(_,i)=>`<button class="cb" data-act="repPick" data-i="${i+1}" ${first&&i===0?'disabled':''}>${i+1}</button>`).join('');
  $('#pS').innerHTML=Array.from({length:b.r},(_,i)=>`<div class="slot ${i===pl.length?'cur':''}"><div class="sv">${pl[i]!==undefined?pl[i]:'?'}</div><div class="sl">${i===pl.length?`고를 수 있는 숫자 <b>${i===0?b.n-1:b.n}</b>개`:i<pl.length?`${i===0?b.n-1:b.n}개 중에서 골랐어요`:''}</div></div>`).join('');
  $('#pI').textContent=pl.length===b.r?`암호 ${pl.join(' ')} 완성! 칸마다 고를 수 있던 숫자의 개수를 떠올려 보세요.`:(first?'맨 앞자리는 1이 될 수 없어서 1 버튼이 눌리지 않아요.':'');}};
A.repPick=t=>{const b=P(),s=ZV.BS;if(s.pl.length>=b.r)return;s.pl.push(+t.dataset.i);B.rep.draw(b);adv(Math.min(s.pl.length,2));};
A.repClear=()=>{ZV.BS.pl=[];B.rep.draw(P());};

/* ---- 5. 원탁 (원순열, 2015 개정) ---- */
B.ring={html:()=>`<div class="bn">탁자를 돌려 보세요. 돌려서 겹치면 같은 방법이에요.</div><div class="ring" id="gR"></div><div class="info" id="gI"></div><button class="btn sm" data-act="ringRot">한 칸 돌리기</button>${CALC}`,
 init:b=>{ZV.BS={rot:0};B.ring.draw(b);},
 draw:b=>{const n=b.n,rot=ZV.BS.rot;$('#gR').innerHTML=Array.from({length:n},(_,i)=>{const a=(i/n)*2*Math.PI-Math.PI/2,x=120+95*Math.cos(a),y=120+95*Math.sin(a),w=((i-rot)%n+n)%n;return`<div class="seat" style="left:${x}px;top:${y}px;background:${colors[w]}">${LET[w]}</div>`;}).join('');
  const k=Math.min(rot+1,n);$('#gI').innerHTML=`돌려서 겹치는 같은 배열로 확인한 것: <b>${k}</b>개`+(rot>=n?`<br>${n}번 돌리면 처음 모양으로 돌아와요. 일렬 배열 하나가 <b>${n}</b>개씩 같은 방법이 돼요.`:'');}};
A.ringRot=()=>{ZV.BS.rot++;B.ring.draw(P());adv(1);if(ZV.BS.rot>=P().n)adv(2);};

/* ---- 6. 샘플 튜브 보관대 (같은 것이 있는 순열) ---- */
B.gems={html:()=>`<div class="bn">버튼을 눌러 튜브 배열을 만들어 보세요.</div><div class="tiles" id="dT"></div><div class="info" id="dI"></div><button class="btn sm" data-act="gemShuffle">섞기</button> <button class="btn ghost sm" data-act="gemNum">번호 붙이기/떼기</button>${CALC}`,
 init:b=>{const seq=[];for(const[c,k]of[['R',b.a],['B',b.b],['Y',b.c]])for(let i=0;i<k;i++)seq.push(c);ZV.BS={seq,seen:new Set([seq.join('')]),num:false};B.gems.draw(b);},
 draw:b=>{const s=ZV.BS,col={R:'#d23f3f',B:'#2a6fdb',Y:'#d9a400'},cnt={R:0,B:0,Y:0};
  $('#dT').innerHTML=s.seq.map(c=>{cnt[c]++;return`<div class="tile" style="background:${col[c]}">${s.num?`<span>${cnt[c]}</span>`:''}</div>`;}).join('');
  const prod=fact(b.a)*fact(b.b)*fact(b.c);
  $('#dI').innerHTML=`지금까지 만든 서로 다른 배열: <b>${s.seen.size}</b>개`+(s.num?`<br>같은 색 튜브에 번호를 붙이면, 지금 배열과 똑같이 보이는 번호 배열이 <b>${fact(b.a)}×${fact(b.b)}×${fact(b.c)} = ${prod}</b>가지예요.`:'');}};
A.gemShuffle=()=>{const s=ZV.BS,a=s.seq;for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}s.seen.add(a.join(''));B.gems.draw(P());adv(1);};
A.gemNum=()=>{ZV.BS.num=!ZV.BS.num;B.gems.draw(P());if(ZV.BS.num)adv(2);};

/* ---- 7. 앰플 보관함 나누기 (중복조합) ---- */
B.bins={html:()=>`<div class="bn">● 사이에 칸막이(|)를 놓아 보세요. 칸을 누르면 칸막이가 놓이고, 다시 누르면 사라져요.</div><div class="cards" id="bC"></div><div class="info" id="bI"></div><button class="btn ghost sm" data-act="binClear">비우기</button>${CALC}`,
 init:b=>{ZV.BS={bars:new Set(),seen:new Set()};B.bins.draw(b);},
 draw:b=>{const s=ZV.BS,L=b.n+b.k-1;$('#bC').innerHTML=Array.from({length:L},(_,i)=>`<button class="cb ${s.bars.has(i)?'on':''}" data-act="binTog" data-i="${i}" style="min-width:38px">${s.bars.has(i)?'|':'●'}</button>`).join('');
  let msg=`칸막이 ${s.bars.size} / ${b.k-1}개 · 놓인 ●: ${L-s.bars.size}개`;
  if(s.bars.size===b.k-1){const parts=[];let c=0;for(let i=0;i<L;i++){if(s.bars.has(i)){parts.push(c);c=0;}else c++;}parts.push(c);const key=parts.join(',');s.seen.add(key);msg+=`<br>보관함별 앰플: ${parts.map((x,i)=>`보관함${i+1}=<b>${x}</b>개`).join(' · ')}`;}
  msg+=`<br>지금까지 만든 서로 다른 나누기: <b>${s.seen.size}</b>가지`;$('#bI').innerHTML=msg;}};
A.binTog=t=>{const b=P(),s=ZV.BS,i=+t.dataset.i;if(s.bars.has(i))s.bars.delete(i);else if(s.bars.size<b.k-1)s.bars.add(i);B.bins.draw(b);adv(1);if(s.bars.size===b.k-1)adv(2);};
A.binClear=()=>{ZV.BS.bars.clear();B.bins.draw(P());};

/* ---- 8. 이항정리 기록지 (이항정리) ---- */
B.pascal={html:b=>`<div class="bn">파스칼의 삼각형이에요. 수를 눌러 보세요. 아래 도우미로 일반항의 두 부분을 구할 수 있어요.</div><div class="pas" id="pT"></div><div class="info" id="pI">수를 눌러 보세요.</div><div class="calc"><b>일반항 도우미</b> (ax+1)<sup>n</sup> 에서 x<sup>r</sup> 항: n <input type="number" data-p="n" value="4" min="0" max="9"> r <input type="number" data-p="r" value="2" min="0" max="9"> a <input type="number" data-p="a" value="2" min="1" max="5"><button class="btn sm ghost" data-act="pasCalc">계산</button><output id="pO">—</output></div>`,
 init:()=>{ZV.BS={};let h='';for(let n=0;n<=9;n++){h+=`<div class="pr">`+Array.from({length:n+1},(_,r)=>`<button class="pc" data-act="pasPick" data-n="${n}" data-r="${r}">${nCr(n,r)}</button>`).join('')+`</div>`;}$('#pT').innerHTML=h;}};
A.pasPick=t=>{const n=+t.dataset.n,r=+t.dataset.r;document.querySelectorAll('.pc').forEach(e=>e.classList.toggle('on',e===t));$('#pI').innerHTML=`${n}행 ${r+1}번째 수 = <sub>${n}</sub>C<sub>${r}</sub> = <b>${nCr(n,r)}</b>`;adv(1);};
A.pasCalc=()=>{const n=+$('[data-p=n]').value,r=+$('[data-p=r]').value,a=+$('[data-p=a]').value;$('#pO').innerHTML=`<sub>${n}</sub>C<sub>${r}</sub> = <b>${nCr(n,r)}</b> , ${a}<sup>${r}</sup> = <b>${a**r}</b>`;adv(2);};

/* ---- 9. 통로 지도 (최단 경로) ---- */
B.grid={html:b=>`<div class="bn">교차점을 눌러 그곳까지 오는 최단 경로의 수를 확인해 보세요. (왼쪽 점과 아래 점을 먼저 눌러야 해요)</div><div class="inrow">출발점: <span class="seg"><button data-act="grStart" data-s="A" class="on">A</button><button data-act="grStart" data-s="P">◆P</button></span></div><div class="gridw"><table class="gt" id="gT"></table></div><div class="info" id="gI"></div>`,
 init:b=>{ZV.BS={start:'A',rev:{}};B.grid.draw(b);},
 draw:b=>{const s=ZV.BS,[sx,sy]=s.start==='A'?[0,0]:[b.px,b.py];let h='';
  for(let y=b.U;y>=0;y--){h+='<tr>';for(let x=0;x<=b.R;x++){const ok=x>=sx&&y>=sy,key=x+','+y+s.start,isP=x===b.px&&y===b.py,v=s.rev[key];
   const lab=!ok?'':(x===sx&&y===sy)?'1':v!==undefined?String(v):'?';
   h+=`<td><button class="gn ${!ok?'off':''} ${isP?'p':''} ${x===b.R&&y===b.U?'b':''} ${v!==undefined||(x===sx&&y===sy)?'on':''}" data-act="grTap" data-x="${x}" data-y="${y}" ${ok?'':'disabled'}>${(x===0&&y===0&&s.start==='A')?'A':x===b.R&&y===b.U?'B':isP?'◆':''}${lab?`<span>${lab}</span>`:''}</button></td>`;}h+='</tr>';}
  $('#gT').innerHTML=h;const vP=s.rev[b.px+','+b.py+'A'],vB=s.rev[b.R+','+b.U+'P'];
  $('#gI').innerHTML=`출발점 <b>${s.start==='A'?'A':'◆P'}</b> · `+(vP!==undefined?`A→◆P: <b>${vP}</b>가지 `:'')+(vB!==undefined?`◆P→B: <b>${vB}</b>가지`:'');}};
A.grStart=t=>{ZV.BS.start=t.dataset.s;document.querySelectorAll('[data-act=grStart]').forEach(e=>e.classList.toggle('on',e===t));B.grid.draw(P());};
A.grTap=t=>{const b=P(),s=ZV.BS,x=+t.dataset.x,y=+t.dataset.y,[sx,sy]=s.start==='A'?[0,0]:[b.px,b.py];if(x===sx&&y===sy)return;
 const get=(xx,yy)=>(xx<sx||yy<sy)?0:(xx===sx&&yy===sy)?1:s.rev[xx+','+yy+s.start];const L=get(x-1,y),D=get(x,y-1);
 if(L===undefined||D===undefined){$('#gI').innerHTML='먼저 <b>왼쪽 점</b>과 <b>아래 점</b>의 수를 확인해야 해요.';return;}
 s.rev[x+','+y+s.start]=L+D;B.grid.draw(b);adv(1);if(s.rev[b.px+','+b.py+'A']!==undefined)adv(2);if(s.rev[b.R+','+b.U+'P']!==undefined)adv(3);};

/* ---- 10. 검체 추첨기 (통계적 확률) ---- */
B.spin={html:b=>`<div class="bn">추첨기를 돌려 보세요. 양성 칸에 멈춘 횟수와 상대도수가 어떻게 변하는지 관찰해요.</div><div class="inrow"><svg id="spW" width="150" height="150" viewBox="-75 -75 150 150"></svg><div><button class="btn sm" data-act="spRun" data-k="1">1번</button> <button class="btn sm ghost" data-act="spRun" data-k="10">10번</button> <button class="btn sm ghost" data-act="spRun" data-k="100">100번</button> <button class="btn sm ghost" data-act="spRun" data-k="1000">1000번</button> <button class="btn sm ghost" data-act="spRun" data-k="0">지우기</button></div></div><div class="info" id="spI"></div><svg id="spG" class="norm" viewBox="0 0 320 130"></svg>`,
 init:b=>{ZV.BS={n:0,hit:0,pts:[],last:-1};B.spin.draw(b);},
 draw:b=>{const s=ZV.BS;let w='';for(let i=0;i<20;i++){const a0=i/20*2*Math.PI-Math.PI/2,a1=(i+1)/20*2*Math.PI-Math.PI/2,x0=70*Math.cos(a0),y0=70*Math.sin(a0),x1=70*Math.cos(a1),y1=70*Math.sin(a1);w+=`<path d="M0 0 L${x0} ${y0} A70 70 0 0 1 ${x1} ${y1} Z" fill="${i<b.a?'#d9534f':'#9db8c9'}" stroke="#fff" stroke-width="1" ${s.last===i?'style="filter:brightness(.7)"':''}/>`;if(i<b.a){const m=(a0+a1)/2;w+=`<text x="${48*Math.cos(m)}" y="${48*Math.sin(m)+4}" font-size="11" text-anchor="middle" fill="#fff">+</text>`;}}
  $('#spW').innerHTML=w;
  $('#spI').innerHTML=s.n?`돌린 횟수 <b>${s.n}</b>번 · 양성 칸에 멈춘 횟수 <b>${s.hit}</b>번 · 상대도수 <b>${(s.hit/s.n).toFixed(3)}</b>`:'버튼을 눌러 돌려 보세요.';
  let g=`<rect x="30" y="5" width="285" height="100" fill="#fff" stroke="#b8d4c1"/>`;for(const v of[0,0.5,1])g+=`<text x="26" y="${105-v*100+4}" font-size="9" text-anchor="end" fill="#4a6454">${v}</text><line x1="30" x2="315" y1="${105-v*100}" y2="${105-v*100}" stroke="#e3efe6"/>`;
  const mx=Math.max(10,s.n),X=n=>30+Math.log10(Math.max(1,n))/Math.log10(Math.max(10,mx))*285;
  if(s.pts.length>1)g+=`<polyline fill="none" stroke="#2c9a57" stroke-width="2" points="${s.pts.map(p=>`${X(p[0]).toFixed(1)},${(105-p[1]*100).toFixed(1)}`).join(' ')}"/>`;
  g+=`<text x="172" y="124" font-size="10" text-anchor="middle" fill="#4a6454">돌린 횟수 (로그 눈금) → 상대도수</text>`;$('#spG').innerHTML=g;}};
A.spRun=t=>{const b=P(),s=ZV.BS,k=+t.dataset.k;if(k===0){ZV.BS={n:0,hit:0,pts:[],last:-1};}else{const cps=new Set([1,2,3,5,10,20,50,100,200,500,1000,2000,5000,10000]);for(let i=0;i<k;i++){const c=Math.floor(rnd()*20);s.last=c;s.n++;if(c<b.a)s.hit++;if(cps.has(s.n)||i===k-1)s.pts.push([s.n,s.hit/s.n]);}adv(s.n>=500?2:1);}B.spin.draw(b);};

/* ---- 11. 동전 점괘 (여사건) ---- */
B.coins={html:b=>`<div class="bn">동전 ${b.n}개를 던져 나올 수 있는 모든 결과예요. (앞=앞면, 뒤=뒷면) 버튼으로 표시해 보세요.</div><div class="inrow"><button class="btn sm ghost" data-act="coF" data-f="all">전체 세기</button><button class="btn sm ghost" data-act="coF" data-f="0">앞면 0개</button><button class="btn sm ghost" data-act="coF" data-f="1">앞면 1개</button><button class="btn sm ghost" data-act="coF" data-f="ge1">앞면 1개 이상</button></div><div class="chipsw" id="cC"></div><div class="info" id="cI"></div>`,
 init:b=>{ZV.BS={f:null};B.coins.draw(b);},
 draw:b=>{const s=ZV.BS,L=2**b.n;let h='',c=0;for(let m=0;m<L;m++){let str='',heads=0;for(let i=b.n-1;i>=0;i--){const hd=(m>>i)&1;heads+=hd;str+=hd?'앞':'뒤';}
   const on=s.f==='all'||(s.f==='0'&&heads===0)||(s.f==='1'&&heads===1)||(s.f==='ge1'&&heads>=1);if(on)c++;h+=`<span class="cc ${on?'on':''}">${str}</span>`;}
  $('#cC').innerHTML=h;$('#cI').innerHTML=s.f?`표시한 결과: <b>${c}</b>가지 (전체 ${L}가지 중)`:'버튼을 눌러 표시해 보세요.';}};
A.coF=t=>{ZV.BS.f=t.dataset.f;B.coins.draw(P());const f=t.dataset.f;if(f==='all')adv(1);if(f==='0')adv(2);};

/* ---- 12. 주사위 (덧셈정리 / 조건부확률) ---- */
B.dice={html:b=>b.mode==='union'?`<div class="bn">버튼을 눌러 A, B에 해당하는 칸을 색칠해 보세요.</div><div class="inrow"><button class="btn ghost sm" data-act="diceA">A: 합이 4의 배수</button><button class="btn ghost sm" data-act="diceB">B: 곱이 홀수</button></div><div class="grid36" id="d36"></div><div class="info" id="dI"></div>`:
 `<div class="bn">버튼을 눌러 조건과 사건에 해당하는 칸을 색칠해 보세요. 칸 안의 수는 두 눈의 합이에요.</div><div class="inrow"><button class="btn ghost sm" data-act="diceA">조건: 합이 ${b.s}</button><button class="btn ghost sm" data-act="diceB">사건: 둘 다 짝수</button></div><div class="grid36" id="d36"></div><div class="info" id="dI"></div>`,
 init:b=>{ZV.BS={A:false,B:false};B.dice.draw(b);},
 draw:b=>{const s=ZV.BS;let h='<div class="h"></div>'+[1,2,3,4,5,6].map(j=>`<div class="h">${j}</div>`).join('');let cA=0,cB=0,cAB=0;
  for(let i=1;i<=6;i++){h+=`<div class="h">${i}</div>`;for(let j=1;j<=6;j++){const ia=b.mode==='union'?(i+j)%4===0:(i+j===b.s),ib=b.mode==='union'?(i%2===1&&j%2===1):(i%2===0&&j%2===0);const a=s.A&&ia,bb=s.B&&ib;if(a)cA++;if(bb)cB++;if(a&&bb)cAB++;h+=`<div class="${a&&bb?'ab':a?'a':bb?'bb':''}">${i+j}</div>`;}}
  $('#d36').innerHTML=h;
  $('#dI').innerHTML=b.mode==='union'?`전체 36칸 · `+(s.A?`A <b>${cA}</b>칸 `:'')+(s.B?`· B <b>${cB}</b>칸 `:'')+(s.A&&s.B?`· 겹친 칸(보라색) <b>${cAB}</b>칸`:''):
   `전체 36칸 · `+(s.A?`조건을 만족하는 칸 <b>${cA}</b>칸 `:'')+(s.B?`· 사건 칸 <b>${cB}</b>칸 `:'')+(s.A&&s.B?`· 조건과 사건이 모두 해당하는 칸(보라색) <b>${cAB}</b>칸`:'');}};
A.diceA=()=>{const s=ZV.BS;s.A=!s.A;B.dice.draw(P());if(s.A)adv(1);if(s.A&&s.B)adv(P().mode==='union'?3:2);};
A.diceB=()=>{const s=ZV.BS;s.B=!s.B;B.dice.draw(P());if(s.B)adv(P().mode==='union'?2:1);if(s.A&&s.B)adv(P().mode==='union'?3:2);};

/* ---- 13. 칸 채우기 (조건부확률 표 · 곱셈정리 · 평균과 분산) ---- */
B.fill={html:b=>`<div class="bn">${b.intro}</div><div class="pop" id="fP">${b.fields.map(f=>`<label for="f_${f.id}">${f.label}</label><input id="f_${f.id}" data-fill="${f.id}" inputmode="${f.frac?'text':'decimal'}" autocomplete="off"><span></span>`).join('')}</div><div class="info" id="fI"></div>`,
 init:b=>{ZV.BS={b};}};
function parseVal(t){t=t.trim();if(!t)return NaN;if(t.includes('/')){const[a,c]=t.split('/');const x=Number(a),y=Number(c);return y?x/y:NaN;}return Number(t);}
A.fillChk=()=>{const b=P();let ok=0;for(const f of b.fields){const el=$('#f_'+f.id),v=parseVal(el.value);el.className=el.value.trim()===''?'':(Math.abs(v-f.val)<1e-6?'ok':'no');if(el.className==='ok')ok++;}
 let stp=0;b.fields.forEach(f=>{if($('#f_'+f.id).className==='ok')stp=Math.max(stp,f.adv!==undefined?f.adv:ok);});adv(Math.min(stp,ZV.CUR.B.steps.length-1));$('#fI').innerHTML=ok===b.fields.length?b.done:'';};

/* ---- 14. 쌍둥이 거울 (독립) ---- */
B.indep={html:b=>`<div class="bn">큰 정사각형이 전체(확률 1)예요. 파란 띠는 A, 주황 띠는 B예요. B의 크기를 움직여 보세요.</div><div class="inrow"><svg id="inS" width="150" height="150" viewBox="0 0 150 150"></svg><div>P(B) = <b id="inT">0</b>/12<br><input type="range" id="inR" min="0" max="12" value="0" data-act="inMove" style="width:180px"><div id="inI" class="info"></div></div></div>`,
 init:b=>{ZV.BS={t:0};B.indep.draw(b);},
 draw:b=>{const t=ZV.BS.t,pa=1/b.da,pb=t/12,W=140,ax=W*pa,bh=W*pb;
  $('#inS').innerHTML=`<rect x="5" y="5" width="${W}" height="${W}" fill="#fff" stroke="#12281b"/><rect x="5" y="5" width="${ax}" height="${W}" fill="rgba(42,111,219,.35)"/><rect x="5" y="${5+W-bh}" width="${W}" height="${bh}" fill="rgba(232,116,42,.35)"/><rect x="5" y="${5+W-bh}" width="${ax}" height="${bh}" fill="rgba(140,60,180,.55)"/><text x="${5+ax/2}" y="16" font-size="11" text-anchor="middle" fill="#123">A</text><text x="${W-4}" y="${5+W-bh+13}" font-size="11" text-anchor="end" fill="#531">B</text>`;
  const u=pa+pb-pa*pb;$('#inT').textContent=t;
  $('#inI').innerHTML=`합사건 A∪B 넓이 ≈ <b>${u.toFixed(3)}</b><br>목표(문제의 P(A∪B)) ≈ <b>${b.target.toFixed(3)}</b><br>겹친 부분(A∩B) 넓이 ≈ <b>${(pa*pb).toFixed(3)}</b><br>${Math.abs(u-b.target)<1e-9?'<span style="color:#1f7a43"><b>목표와 같아졌어요!</b></span>':''}`;
  if(t>0)adv(1);if(Math.abs(u-b.target)<1e-9)adv(2);}};
A.inMove=t=>{ZV.BS.t=+t.value;B.indep.draw(P());};

/* ---- 15. 백신 투여 시험 (독립시행) ---- */
B.binom={html:b=>`<div class="bn">한 번 투여할 때 성공(○) 확률은 1/${b.q}이에요. 시뮬레이션해 보세요.</div><div class="inrow"><button class="btn sm" data-act="binRun" data-k="1">${b.n}번 시도 1회</button><button class="btn ghost sm" data-act="binRun" data-k="100">100회 반복</button><button class="btn ghost sm" data-act="binRun" data-k="0">지우기</button></div><div class="info" id="bI"></div><div class="hist" id="bH"></div><div class="hist-l" id="bL"></div>${CALC}`,
 init:b=>{ZV.BS={c:Array(b.n+1).fill(0),t:0,last:''};B.binom.draw(b);},
 draw:b=>{const s=ZV.BS,tot=s.t||1;$('#bH').innerHTML=s.c.map(v=>`<div style="height:${Math.round(v/tot*110)+2}px"><span>${s.t?(v/s.t).toFixed(2):''}</span></div>`).join('');$('#bL').innerHTML=s.c.map((_,i)=>`<div>${i}번</div>`).join('');
  $('#bI').innerHTML=(s.last?`마지막 1회: <b>${s.last}</b> (성공 ${[...s.last].filter(c=>c==='○').length}번)<br>`:'')+`누적 ${s.t}회 · 막대 위 숫자는 성공 횟수별 상대도수`;}};
A.binRun=t=>{const b=P(),s=ZV.BS,k=+t.dataset.k;if(k===0){s.c=Array(b.n+1).fill(0);s.t=0;s.last='';}else{for(let r=0;r<k;r++){let x=0,str='';for(let i=0;i<b.n;i++){const ok=rnd()<1/b.q;if(ok)x++;str+=ok?'○':'×';}s.c[x]++;s.t++;s.last=str;}adv(k===1?1:2);}B.binom.draw(b);};

/* ---- 16. 별빛 확률분포표 (확률의 총합) ---- */
B.sumone={html:b=>`<div class="bn">P(X=x) = kx 에서 k = 1/d 로 놓아요. d를 움직여 확률의 총합이 1이 되게 해 보세요.</div><div class="inrow">d = <b id="soD">1</b> <input type="range" id="soR" min="1" max="30" value="1" data-act="soMove" style="width:220px"></div><div class="hist" id="soH"></div><div class="hist-l" id="soL"></div><div class="info" id="soI"></div>`,
 init:b=>{ZV.BS={d:1};B.sumone.draw(b);},
 draw:b=>{const d=ZV.BS.d;$('#soD').textContent=d;$('#soH').innerHTML=Array.from({length:b.m},(_,i)=>{const p=(i+1)/d;return`<div style="height:${Math.round(Math.min(1,p)*110)+2}px;background:${p>1?'#d23f3f':'#2c9a57'}"><span>${(i+1)}/${d}</span></div>`;}).join('');
  $('#soL').innerHTML=Array.from({length:b.m},(_,i)=>`<div>X=${i+1}</div>`).join('');
  const f=ZV.frac(b.T,d);$('#soI').innerHTML=`확률의 총합 = ${Array.from({length:b.m},(_,i)=>i+1).join('+')} 을 ${d}로 나눈 값 = <b>${(b.T/d).toFixed(3)}</b> ${b.T===d?'<span style="color:#1f7a43"><b>= 1 !</b></span>':(b.T<d?'(1보다 작아요)':'(1보다 커요)')}`;
  if(d>1)adv(1);if(b.T===d)adv(2);}};
A.soMove=t=>{ZV.BS.d=+t.value;B.sumone.draw(P());};

/* ---- 17. 이항분포 수정구 (평균·분산) ---- */
const PRE=[[10,1,2],[20,1,2],[20,1,4],[40,1,4],[30,1,3],[60,1,3]];
B.binstat={html:()=>`<div class="bn">(n, p)를 고르고 시뮬레이션해 보세요. 성공 횟수 X의 표본평균과 표본분산을 관찰해요.</div><div class="inrow">${PRE.map((p,i)=>`<button class="btn ghost sm" data-act="bsPick" data-i="${i}">n=${p[0]}, p=${p[1]}/${p[2]}</button>`).join('')}</div><div class="info" id="bsI">(n, p)를 먼저 고르세요.</div><div class="calc"><b>규칙 확인</b> n <input type="number" data-b="n" value="20" min="1" max="200"> p = 1/<input type="number" data-b="q" value="4" min="2" max="10"><button class="btn sm ghost" data-act="bsCalc">n×p , n×p×(1−p)</button><output id="bsO">—</output></div>`,
 init:()=>{ZV.BS={i:null};}};
A.bsPick=t=>{const[n,a,q]=PRE[+t.dataset.i],p=a/q;let s1=0,s2=0;const T=500;for(let k=0;k<T;k++){let x=0;for(let i=0;i<n;i++)if(rnd()<p)x++;s1+=x;s2+=x*x;}const m=s1/T,v=s2/T-m*m;
 $('#bsI').innerHTML=`n=<b>${n}</b>, p=<b>${a}/${q}</b> 로 ${T}회 시행한 결과: 표본평균 <b>${m.toFixed(2)}</b>, 표본분산 <b>${v.toFixed(2)}</b>`;adv(1);};
A.bsCalc=()=>{const n=+$('[data-b=n]').value,q=+$('[data-b=q]').value,p=1/q;$('#bsO').innerHTML=`np = <b>${+(n*p).toFixed(3)}</b> , np(1−p) = <b>${+(n*p*(1-p)).toFixed(3)}</b>`;adv(2);};

/* ---- 18. 정규분포 (확률) ---- */
function normCanvas(cvId,shade,labels){const cv=$(cvId),x=cv.getContext('2d'),W=640,H=210,X0=30,X1=610,y0=150,sc=110;const px=z=>X0+(z+4)/8*(X1-X0),py=z=>y0-Math.exp(-z*z/2)*sc;
 x.clearRect(0,0,W,H);if(shade){const lo=Math.max(-4,shade[0]),hi=Math.min(4,shade[1]);x.fillStyle='rgba(44,154,87,.35)';x.beginPath();x.moveTo(px(lo),y0);for(let z=lo;z<=hi;z+=0.02)x.lineTo(px(z),py(z));x.lineTo(px(hi),y0);x.closePath();x.fill();}
 x.strokeStyle='#1f7a43';x.lineWidth=3;x.beginPath();for(let z=-4;z<=4.001;z+=0.04){z===-4?x.moveTo(px(z),py(z)):x.lineTo(px(z),py(z));}x.stroke();
 x.strokeStyle='#555';x.lineWidth=1;x.beginPath();x.moveTo(X0,y0);x.lineTo(X1,y0);x.stroke();x.font='13px sans-serif';x.textAlign='center';
 for(let z=-3;z<=3;z++){x.fillStyle='#12281b';if(labels)x.fillText(String(labels(z)),px(z),y0+18);x.fillStyle='#4a6454';x.fillText('z='+z,px(z),y0+36);x.strokeStyle='#555';x.beginPath();x.moveTo(px(z),y0);x.lineTo(px(z),y0+4);x.stroke();}
 x.fillStyle='#12281b';x.fillText(labels?'X (위) / Z (아래)':'Z',W/2,H-6);}
const ztable=(act)=>`<div class="tw"><table class="tbl" id="nT"><tr><th>z</th>${ZS.map(z=>`<th>${z.toFixed(1)}</th>`).join('')}</tr><tr><td>P(0≤Z≤z)</td>${ZS.map(z=>`<td ${act?`data-act="${act}" data-z="${z}"`:''}>${TBL[z].toFixed(4)}</td>`).join('')}</tr></table></div>`;
B.normal={html:b=>`<div class="bn">평균 ${b.m}, 표준편차 ${b.s}. 구간의 두 끝 a, b를 넣어 보세요.</div><div class="inrow">a <input id="nA" type="number" step="any" data-nin="1"> b <input id="nB" type="number" step="any" data-nin="1"></div><canvas class="norm" id="nC" width="640" height="210"></canvas><div class="info" id="nI"></div><div class="bn">표준정규분포표 P(0≤Z≤z) (표의 칸을 눌러 표시할 수 있어요)</div>${ztable('nTbl')}`,
 init:b=>{ZV.BS={b};B.normal.draw();},
 draw:()=>{const b=ZV.BS.b,a=parseFloat($('#nA').value),c=parseFloat($('#nB').value),ok=!isNaN(a)&&!isNaN(c)&&a<c;normCanvas('#nC',ok?[(a-b.m)/b.s,(c-b.m)/b.s]:null,z=>b.m+z*b.s);
  if(ok){adv(1);const za=(a-b.m)/b.s,zc=(c-b.m)/b.s;$('#nI').innerHTML=`표준화: Z = (X−${b.m})/${b.s} → a는 z = <b>${+za.toFixed(3)}</b>, b는 z = <b>${+zc.toFixed(3)}</b>`;}else $('#nI').textContent='a와 b를 입력하면 색칠된 구간과 표준화한 z값이 나와요.';}};
A.nTbl=t=>{document.querySelectorAll('#nT td[data-z]').forEach(e=>e.style.background=e===t?'#e3f58a':'');adv(2);};

/* ---- 19. 정규분포 별 눈금 (k 구하기) ---- */
B.ninv={html:b=>`<div class="bn">z를 눌러 오른쪽 꼬리(P(Z≥z))를 확인해 보세요. 문제의 확률과 같은 z를 찾아요.</div><div class="inrow">${ZS.map(z=>`<button class="btn sm ghost" data-act="niZ" data-z="${z}">z = ${z.toFixed(1)}</button>`).join('')}</div><canvas class="norm" id="nC" width="640" height="210"></canvas><div class="info" id="nI"></div><div class="bn">표준정규분포표 P(0≤Z≤z)</div>${ztable('')}`,
 init:b=>{ZV.BS={b,z:null};normCanvas('#nC',null,null);$('#nI').textContent='z를 눌러 보세요.';}};
A.niZ=t=>{const z=+t.dataset.z,tail=r4(0.5-TBL[z]);normCanvas('#nC',[z,4],null);$('#nI').innerHTML=`P(Z ≥ ${z.toFixed(1)}) = 0.5 − ${TBL[z].toFixed(4)} = <b>${tail.toFixed(4)}</b>`;adv(1);
 if(Math.abs(tail-P().tail)<1e-9)adv(2);};

/* ---- 20. 이항분포의 정규근사 ---- */
B.binapprox={html:b=>`<div class="bn">B(${b.n}, 1/2)의 막대그래프에 정규분포 곡선을 겹친 그림이에요. 슬라이더로 기준 값 k를 움직여 보세요.</div><div class="inrow">k = <b id="baK">${b.mu}</b> <input type="range" id="baR" min="${b.mu-4*b.sg}" max="${b.mu+4*b.sg}" value="${b.mu}" data-act="baMove" style="width:240px"></div><svg id="baS" class="norm" viewBox="0 0 640 190"></svg><div class="info" id="baI"></div><div class="calc"><b>평균·표준편차</b> n <input type="number" data-a="n" value="${b.n}" min="1" max="400"> p = 1/<input type="number" data-a="q" value="2" min="2" max="10"><button class="btn sm ghost" data-act="baCalc">np , √(np(1−p))</button><output id="baO">—</output></div><div class="bn">표준정규분포표 P(0≤Z≤z)</div>${ztable('')}`,
 init:b=>{ZV.BS={k:b.mu};B.binapprox.draw(b);},
 draw:b=>{const k=ZV.BS.k,lo=b.mu-4*b.sg,hi=b.mu+4*b.sg,N=hi-lo+1,bw=600/N;let lf=[0];for(let i=1;i<=b.n;i++)lf[i]=lf[i-1]+Math.log(i);const pm=x=>Math.exp(lf[b.n]-lf[x]-lf[b.n-x]-b.n*Math.log(2));let mx=0;for(let x=lo;x<=hi;x++)mx=Math.max(mx,pm(x));
  let s=`<line x1="20" x2="620" y1="160" y2="160" stroke="#555"/>`;for(let x=lo;x<=hi;x++){const h=pm(x)/mx*130;s+=`<rect x="${20+(x-lo)*bw}" y="${160-h}" width="${Math.max(1,bw-1)}" height="${h}" fill="${x>=k?'#e8742a':'#9fd0b0'}"/>`;}
  let pts='';for(let x=lo;x<=hi;x+=0.25){const z=(x-b.mu)/b.sg,y=Math.exp(-z*z/2)*130;pts+=`${20+(x-lo+0.5)*bw},${160-y} `;}s+=`<polyline fill="none" stroke="#1f7a43" stroke-width="2.5" points="${pts}"/>`;
  for(let z=-3;z<=3;z++){const xx=b.mu+z*b.sg;s+=`<text x="${20+(xx-lo+0.5)*bw}" y="178" font-size="11" text-anchor="middle" fill="#4a6454">${xx}</text>`;}
  $('#baS').innerHTML=s;$('#baK').textContent=k;$('#baI').innerHTML=`주황색 막대는 X ≥ ${k} 인 부분이에요. 초록 곡선은 정규분포 근사예요.`;}};
A.baMove=t=>{ZV.BS.k=+t.value;B.binapprox.draw(P());adv(1);};
A.baCalc=()=>{const n=+$('[data-a=n]').value,q=+$('[data-a=q]').value,p=1/q;$('#baO').innerHTML=`np = <b>${+(n*p).toFixed(3)}</b> , √(np(1−p)) = <b>${+Math.sqrt(n*p*(1-p)).toFixed(3)}</b>`;adv(2);};

/* ---- 21. 표본평균 별 저울 ---- */
B.sampmean={html:b=>`<div class="bn">모집단은 평균 ${b.m}, 표준편차 ${b.s}인 정규분포예요. 크기 ${b.n}인 표본을 뽑아 표본평균을 기록해요.</div><div class="inrow"><button class="btn sm" data-act="smRun" data-k="1">표본평균 1번</button><button class="btn ghost sm" data-act="smRun" data-k="200">200번</button><button class="btn ghost sm" data-act="smRun" data-k="0">지우기</button></div><svg id="smS" class="norm" viewBox="0 0 640 190"></svg><div class="info" id="smI"></div>`,
 init:b=>{ZV.BS={means:[]};B.sampmean.draw(b);},
 draw:b=>{const ms=ZV.BS.means,lo=b.m-3*b.s,hi=b.m+3*b.s,NB=30,bw=600/NB;const bins=Array(NB).fill(0);for(const v of ms){const i=Math.floor((v-lo)/(hi-lo)*NB);if(i>=0&&i<NB)bins[i]++;}const mx=Math.max(10,...bins);
  let s=`<line x1="20" x2="620" y1="160" y2="160" stroke="#555"/>`;let pts='';for(let i=0;i<=120;i++){const z=-3+i*6/120,y=Math.exp(-z*z/2)*120;pts+=`${20+i*5},${160-y} `;}s+=`<polyline fill="none" stroke="#b8d4c1" stroke-width="2" stroke-dasharray="5 3" points="${pts}"/><text x="470" y="40" font-size="11" fill="#6a8" >점선: 모집단의 분포</text>`;
  bins.forEach((c,i)=>{const h=c/mx*130;s+=`<rect x="${20+i*bw}" y="${160-h}" width="${bw-1}" height="${h}" fill="#e8742a" opacity=".8"/>`;});
  for(let z=-3;z<=3;z++)s+=`<text x="${20+(z+3)/6*600}" y="178" font-size="11" text-anchor="middle" fill="#4a6454">${+(b.m+z*b.s).toFixed(1)}</text>`;
  $('#smS').innerHTML=s;const n=ms.length;if(n){const mean=ms.reduce((a,v)=>a+v,0)/n,sd=Math.sqrt(ms.reduce((a,v)=>a+(v-mean)**2,0)/n);$('#smI').innerHTML=`표본평균 <b>${n}</b>개 · 표본평균들의 평균 <b>${mean.toFixed(2)}</b> · 표준편차 <b>${sd.toFixed(2)}</b> (모집단 표준편차는 ${b.s})`;}else $('#smI').textContent='버튼을 눌러 표본평균을 모아 보세요.';}};
A.smRun=t=>{const b=P(),s=ZV.BS,k=+t.dataset.k;if(k===0)s.means=[];else{for(let r=0;r<k;r++){let sum=0;for(let i=0;i<b.n;i++)sum+=b.m+b.s*randn();s.means.push(sum/b.n);}adv(s.means.length>=100?2:1);}B.sampmean.draw(b);};

/* ---- 22. 신뢰구간 (모평균·모비율) ---- */
B.ci={html:b=>`<div class="bn">${b.mode==='mean'?`모평균은 ${b.mu}이에요. 표본을 뽑아 95% 신뢰구간(막대)이 ${b.mu}을 포함하는지 보세요.`:`모비율은 ${b.pt}이에요. 표본을 뽑아 95% 신뢰구간(막대)이 ${b.pt}를 포함하는지 보세요.`}</div><div class="inrow"><button class="btn sm" data-act="ciRun" data-k="1">표본 1개</button><button class="btn ghost sm" data-act="ciRun" data-k="20">20개 한꺼번에</button><button class="btn ghost sm" data-act="ciRun" data-k="0">지우기</button></div><div class="info" id="cI"></div><svg id="cS" class="norm" viewBox="0 0 640 300"></svg>`,
 init:b=>{ZV.BS={b,rows:[],tot:0,hit:0};B.ci.draw();},
 draw:()=>{const s=ZV.BS,b=s.b,mu=b.mode==='mean'?b.mu:b.pt,se=b.mode==='mean'?b.s/Math.sqrt(b.n):Math.sqrt(b.pt*(1-b.pt)/b.n),L=mu-4*se,R=mu+4*se,X=v=>20+(v-L)/(R-L)*600;let g=`<line x1="${X(mu)}" y1="0" x2="${X(mu)}" y2="300" stroke="#555" stroke-dasharray="5 4"/>`;
  s.rows.forEach((r,i)=>{const y=14+i*14,c=r.hit?'#2c9a57':'#d23f3f';g+=`<line x1="${X(r.lo)}" y1="${y}" x2="${X(r.hi)}" y2="${y}" stroke="${c}" stroke-width="4"/><circle cx="${X(r.c)}" cy="${y}" r="3" fill="#12281b"/>`;});
  $('#cS').innerHTML=g;$('#cI').innerHTML=s.tot?`지금까지 ${s.tot}개 중 모수를 포함한 구간(초록): <b>${s.hit}</b>개 (<b>${(s.hit/s.tot*100).toFixed(1)}%</b>) · 빨강은 포함하지 못한 구간`:'버튼을 눌러 표본을 뽑아 보세요.';}};
A.ciRun=t=>{const s=ZV.BS,b=s.b,k=+t.dataset.k;if(k===0){s.rows=[];s.tot=0;s.hit=0;}else{for(let q=0;q<k;q++){let c,lo,hi,mu;if(b.mode==='mean'){const se=b.s/Math.sqrt(b.n);c=b.mu+se*randn();lo=c-1.96*se;hi=c+1.96*se;mu=b.mu;}
  else{let x=0;for(let i=0;i<b.n;i++)if(rnd()<b.pt)x++;c=x/b.n;const se=Math.sqrt(c*(1-c)/b.n);lo=c-1.96*se;hi=c+1.96*se;mu=b.pt;}
  const hit=lo<=mu&&mu<=hi;s.tot++;if(hit)s.hit++;s.rows.push({c,lo,hi,hit});if(s.rows.length>20)s.rows.shift();}adv(k===1?1:2);}B.ci.draw();};

/* ---- 23. 신뢰구간 길이 저울 ---- */
B.cilen={html:b=>`<div class="bn">표본 크기 n을 움직여 신뢰구간의 길이가 어떻게 변하는지 관찰해요. (σ=${b.s}, 신뢰도 95%)</div><div class="inrow">n = <b id="clN">4</b> <input type="range" id="clR" min="4" max="400" value="4" data-act="clMove" style="width:260px"><button class="btn sm ghost" data-act="clStep" data-d="-1">−1</button><button class="btn sm ghost" data-act="clStep" data-d="1">+1</button></div><svg id="clS" class="norm" viewBox="0 0 640 120"></svg><div class="info" id="clI"></div>`,
 init:b=>{ZV.BS={n:4};B.cilen.draw(b);},
 draw:b=>{const n=ZV.BS.n,w=2*1.96*b.s/Math.sqrt(n);let s=`<line x1="20" x2="620" y1="90" y2="90" stroke="#ccc"/>`;
  const cx=320;s+=`<line x1="${cx-Math.min(300,w/2*(300/(1.96*b.s)))}" x2="${cx+Math.min(300,w/2*(300/(1.96*b.s)))}" y1="50" y2="50" stroke="${w<=b.L+1e-12?'#2c9a57':'#d23f3f'}" stroke-width="8"/>`;
  const lx=cx+(b.L/2)*(300/(1.96*b.s));s+=`<line x1="${cx-(b.L/2)*(300/(1.96*b.s))}" x2="${cx-(b.L/2)*(300/(1.96*b.s))}" y1="25" y2="80" stroke="#555" stroke-dasharray="4 3"/><line x1="${lx}" x2="${lx}" y1="25" y2="80" stroke="#555" stroke-dasharray="4 3"/><text x="${cx}" y="110" font-size="12" text-anchor="middle" fill="#4a6454">점선 사이 = 한도 L = ${b.L}</text>`;
  $('#clS').innerHTML=s;$('#clN').textContent=n;
  $('#clI').innerHTML=`n = <b>${n}</b> 일 때 신뢰구간의 길이 = 2×1.96×${b.s}/√${n} ≈ <b>${w.toFixed(3)}</b> ${w<=b.L?'<span style="color:#1f7a43"><b>(≤ L : 한도 안)</b></span>':'<span style="color:#d23f3f">(> L : 한도 밖)</span>'}`;}};
const clAdv=()=>{adv(1);const b=P();if(2*1.96*b.s/Math.sqrt(ZV.BS.n)<=b.L)adv(2);};
A.clMove=t=>{ZV.BS.n=+t.value;B.cilen.draw(P());clAdv();};
A.clStep=t=>{const s=ZV.BS;s.n=ZV.clamp(s.n+ +t.dataset.d,4,400);$('#clR').value=s.n;B.cilen.draw(P());clAdv();};

/* ---- 24. 분석 곡선의 넓이 (연속확률변수·확률밀도함수) ---- */
B.pdf={html:b=>`<div class="bn">f(x)=kx (0≤x≤${b.m}) 의 그래프예요. k=1/d 로 놓고 d를 움직여, 그래프와 x축 사이의 <b>전체 넓이</b>가 1이 되게 해 보세요.</div><div class="inrow">d = <b id="pdD">1</b> <input type="range" id="pdR" min="1" max="40" value="1" data-act="pdMove" style="width:220px"></div><svg id="pdS" class="norm" viewBox="0 0 320 170"></svg><div class="inrow">t = <b id="pdT">0</b> <input type="range" id="pdTR" min="0" max="${b.m}" value="0" data-act="pdTMove" style="width:220px"> <span class="small">(x ≥ t 인 부분을 색칠해요)</span></div><div class="info" id="pdI"></div>`,
 init:b=>{ZV.BS={d:1,t:0};B.pdf.draw(b);},
 draw:b=>{const{d,t}=ZV.BS,m=b.m,X=x=>30+x/m*270,Y=v=>140-v*110,f=x=>x/d,tot=m*m/(2*d),ok=Math.abs(tot-1)<1e-9,area=(m*m-t*t)/(2*d);
  let s=`<line x1="30" y1="140" x2="305" y2="140" stroke="#555"/><line x1="30" y1="140" x2="30" y2="8" stroke="#555"/><text x="26" y="${Y(1)+4}" font-size="10" text-anchor="end" fill="#4a6454">1</text><line x1="28" x2="32" y1="${Y(1)}" y2="${Y(1)}" stroke="#555"/>`;
  s+=`<polygon points="${X(0)},140 ${X(m)},140 ${X(m)},${Y(f(m))}" fill="rgba(42,111,219,.22)"/>`;
  if(t>0)s+=`<polygon points="${X(t)},140 ${X(m)},140 ${X(m)},${Y(f(m))} ${X(t)},${Y(f(t))}" fill="rgba(232,116,42,.6)"/>`;
  s+=`<line x1="${X(0)}" y1="140" x2="${X(m)}" y2="${Y(f(m))}" stroke="#1f4fa0" stroke-width="2.5"/>`;
  for(let x=0;x<=m;x++)s+=`<line x1="${X(x)}" x2="${X(x)}" y1="140" y2="144" stroke="#555"/><text x="${X(x)}" y="157" font-size="11" text-anchor="middle" fill="#12281b">${x}</text>`;
  $('#pdS').innerHTML=s;$('#pdD').textContent=d;$('#pdT').textContent=t;
  $('#pdI').innerHTML=`k = 1/${d} → 높이 f(${m}) = ${m}/${d} = <b>${+(m/d).toFixed(3)}</b><br>전체 넓이 = ½ × ${m} × ${+(m/d).toFixed(3)} = <b>${tot.toFixed(4)}</b> `+(ok?'<span style="color:#1f7a43"><b>= 1 ! (확률밀도함수가 돼요)</b></span>':tot<1?'(1보다 작아요)':'(1보다 커요)')+(ok&&t>0?`<br>색칠한 부분(x ≥ ${t})의 넓이 = <b>${area.toFixed(4)}</b> → 이 넓이가 P(X ≥ ${t}) 예요.`:ok?'<br>t를 움직여 x ≥ t 인 부분의 넓이를 확인해 보세요.':'<br>전체 넓이가 1이 아니면 확률이 아니에요. d를 조절해 보세요.');
  if(d>1)adv(1);if(ok)adv(2);}};
A.pdMove=t=>{ZV.BS.d=+t.value;B.pdf.draw(P());};
A.pdTMove=t=>{ZV.BS.t=+t.value;B.pdf.draw(P());};

/* ---- 25. 두 장 뽑기 저울 (모집단과 표본, 표본평균의 분포) ---- */
/* 12차(피드백 반영): 버튼 하나로 두 장을 한꺼번에 뽑던 것을 → 첫째 뽑기 → 다시 넣기 → 둘째 뽑기 → 다시 넣기, 시행 2번을 학생이 직접 한다.
   phase 0: 첫째 뽑을 차례 / 1: 첫째 카드가 밖에 있음(다시 넣어야 함) / 2: 둘째 뽑을 차례 / 3: 둘째 카드가 밖에 있음 */
B.sample2={html:b=>`<div class="bn">주머니에 카드 ${b.cards.length}장(${b.cards.join(', ')})이 있어요. <b>한 장 뽑아 숫자를 보고 다시 넣는</b> 시행을 직접 2번 해 보세요.</div>
 <div class="pouch" id="s2P"></div><div class="inrow" id="s2B"></div><div class="info" id="s2I"></div>
 <div class="inrow"><button class="btn ghost sm" data-act="s2Fast" id="s2F" disabled>같은 시행 10번 더 (빠르게)</button><button class="btn ghost sm" data-act="s2All">모든 경우 보기</button><button class="btn ghost sm" data-act="s2Hi">X̄ ≥ ${b.t} 인 칸 색칠</button></div><div class="tw" id="s2T"></div>`,
 init:b=>{ZV.BS={log:[],all:false,hi:false,ph:0,a:null,c:null,tally:{}};B.sample2.draw(b);},
 draw:b=>{const s=ZV.BS,C=b.cards,lab=C.map((c,j)=>c+(C.slice(0,j).includes(c)?'′':''));let cnt=0,h='';
  const outI=s.ph===1?s.a:s.ph===3?s.c:null;
  $('#s2P').innerHTML=`<div class="pbag"><span class="small">주머니</span>${C.map((c,i)=>`<span class="pcard ${i===outI?'out':''}">${i===outI?'':lab[i]}</span>`).join('')}</div>`+
   `<div class="pdesk"><span class="small">꺼낸 카드</span>${outI!==null?`<span class="pcard up">${lab[outI]}</span>`:'<span class="small">없음</span>'}</div>`+
   `<div class="pnote"><span class="small">기록</span> 첫째 <b>${s.a!==null?lab[s.a]:'?'}</b> · 둘째 <b>${s.ph>=3&&s.c!==null?lab[s.c]:'?'}</b></div>`;
  const BT=[['s2D1','① 첫째 카드 뽑기',0],['s2Back','② 다시 넣기',1],['s2D2','③ 둘째 카드 뽑기',2],['s2Back','④ 다시 넣기',3]];
  $('#s2B').innerHTML=BT.map(([a,t,p])=>`<button class="btn sm ${s.ph===p?'':'ghost'}" data-act="${a}" ${s.ph===p?'':'disabled'}>${t}</button>`).join('');
  const f=$('#s2F');if(f)f.disabled=s.log.length<1;
  if(s.all){h='<table class="tbl"><tr><th>첫째＼둘째</th>'+lab.map(l=>`<th>${l}</th>`).join('')+'</tr>'+C.map((a,i)=>`<tr><th>${lab[i]}</th>`+C.map((c,j)=>{const m=(a+c)/2,on=s.hi&&m>=b.t,k=s.tally[i+','+j]||0;if(on)cnt++;return`<td class="${on?'hl':''}">${m}${k?`<sup class="tal">${k}</sup>`:''}</td>`;}).join('')+'</tr>').join('')+'</table>';}
  $('#s2T').innerHTML=h;
  const n=s.log.length,ge=s.log.filter(x=>(x[0]+x[1])/2>=b.t).length;
  const now=['① 주머니에서 카드 한 장을 뽑아 보세요.','뽑은 카드의 수를 기록했어요. 복원추출이니 ② 카드를 주머니에 <b>다시 넣어야</b> 해요.','주머니에 다시 4장이 있어요. ③ 둘째 카드를 뽑아 보세요. (방금 뽑은 카드가 또 나올 수도 있어요!)','두 수를 모두 얻었어요. ④ 카드를 다시 넣으면 시행 2번이 끝나요.'][s.ph];
  $('#s2I').innerHTML=`${now}<br>`+(n?`뽑은 표본(최근 5개): ${s.log.slice(-5).map(x=>`(${x[2]}, ${x[3]}) → X̄ = <b>${(x[0]+x[1])/2}</b>`).join(' · ')}<br>지금까지 표본 <b>${n}</b>개 중 X̄ ≥ ${b.t} 인 것: <b>${ge}</b>개 (상대도수 ${ge}/${n})<br>`:'')
   +(s.all?`칸 안의 수는 두 수의 평균 X̄ 예요. 모든 경우는 ${C.length}×${C.length} = <b>${C.length*C.length}</b>칸이고, 칸마다 일어날 확률이 같아요.${n?' (작은 숫자 = 내가 뽑은 횟수)':''}`:'')+(s.all&&s.hi?`<br>X̄ ≥ ${b.t} 인 칸: <b>${cnt}</b>칸 / 전체 ${C.length*C.length}칸`:'');}};
const s2Rec=(i,j)=>{const b=P(),s=ZV.BS,C=b.cards,lab=C.map((c,k)=>c+(C.slice(0,k).includes(c)?'′':''));s.log.push([C[i],C[j],lab[i],lab[j]]);s.tally[i+','+j]=(s.tally[i+','+j]||0)+1;};
A.s2D1=()=>{const s=ZV.BS;if(s.ph!==0)return;s.a=Math.floor(rnd()*P().cards.length);s.c=null;s.ph=1;B.sample2.draw(P());};
A.s2D2=()=>{const s=ZV.BS;if(s.ph!==2)return;s.c=Math.floor(rnd()*P().cards.length);s.ph=3;s2Rec(s.a,s.c);B.sample2.draw(P());adv(1);};
A.s2Back=()=>{const s=ZV.BS;if(s.ph===1)s.ph=2;else if(s.ph===3){s.ph=0;s.a=null;s.c=null;}B.sample2.draw(P());};
A.s2Fast=()=>{const s=ZV.BS,L=P().cards.length;for(let k=0;k<10;k++)s2Rec(Math.floor(rnd()*L),Math.floor(rnd()*L));B.sample2.draw(P());adv(1);};
A.s2All=()=>{ZV.BS.all=true;B.sample2.draw(P());adv(2);};
A.s2Hi=()=>{const s=ZV.BS;s.all=true;s.hi=!s.hi;B.sample2.draw(P());adv(2);};

/* ---- 입력 위임 (칸 채우기 / 정규분포 구간) ---- */
ZV.benchInput=function(e){const t=e.target;if(t.dataset.fill&&B.fill)A.fillChk();if(t.dataset.nin&&ZV.CUR&&ZV.CUR.B.bench.type==='normal')B.normal.draw();};
})();
