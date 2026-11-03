/* 좀비바이러스 연구실 — 화면 연결 (제목·문제 패널·메뉴·교사 설정·엔딩) */
(function(){
'use strict';
const ZV=window.ZV,{$,esc,clamp,fmtT}=ZV;
const app=$('#app'),ov=$('#ov'),pz=$('#pz');
ZV.load();
function setBright(b){ZV.S.settings.bright=b;document.body.className='b'+b+(ZV.screen==='game'?' ing':'');ZV.save();}
function applyBody(){document.body.className='b'+ZV.S.settings.bright+(ZV.screen==='game'?' ing':'');}
ZV.applyBody=applyBody;
const brightSeg=()=>`<span class="seg">${['어둡게','밝게','아주 밝게'].map((t,i)=>`<button data-act="bright" data-v="${i}" class="${ZV.S.settings.bright===i?'on':''}">${t}</button>`).join('')}</span>`;
const sndBtn=()=>`<button class="btn ghost sm" data-act="snd">전체 소리 ${ZV.S.settings.sound?'켜짐':'꺼짐'}</button>`;
const musBtn=()=>`<button class="btn ghost sm" data-act="mus">배경 음악 ${ZV.S.settings.music===false?'꺼짐':'켜짐'}</button>`;
const fxBtn=()=>`<button class="btn ghost sm" data-act="sfxToggle">효과음 ${ZV.S.settings.effects===false?'꺼짐':'켜짐'}</button>`;
const timerPill=()=>{const p=ZV.prof(),lim=ZV.S.settings.limitMin*60;return lim>0?`<span class="pill ${lim-p.totalSecs<=60?'warn':''}" data-tm="1">남은 시간 ${fmtT(lim-p.totalSecs)}</span>`:`<span class="pill" data-tm="1">경과 ${fmtT(p.totalSecs)}</span>`;};
ZV.tickTm=function(){const p=ZV.prof();if(!p)return;const lim=ZV.S.settings.limitMin*60;document.querySelectorAll('[data-tm]').forEach(e=>{e.textContent=lim>0?'남은 시간 '+fmtT(lim-p.totalSecs):'경과 '+fmtT(p.totalSecs);e.classList.toggle('warn',lim>0&&lim-p.totalSecs<=60);});};

/* ---------- 제목 ---------- */
function titleScreen(){ZV.screen='title';ZV.introOn=false;document.body.classList.remove('introing');ZV.CUR=null;applyBody();pz.hidden=true;pz.innerHTML='';ov.innerHTML='';const names=Object.keys(ZV.S.profiles);
 const bio=`<svg class="bio" viewBox="-50 -50 100 100" aria-hidden="true">${[90,210,330].map(a=>{const r=a*Math.PI/180;return`<circle cx="${(19*Math.cos(r)).toFixed(1)}" cy="${(19*Math.sin(r)).toFixed(1)}" r="17" fill="none" stroke="#7be04a" stroke-width="6"/>`;}).join('')}<circle r="7" fill="#0a0f0a" stroke="#7be04a" stroke-width="4"/><circle r="2" fill="#7be04a"/></svg>`;
 app.innerHTML=`<div class="titlebg"><div class="titlebox"><div class="small ver">${ZV.VER}차</div>${bio}<h1 class="logo">Z-VIRUS</h1><div class="logo2">좀비바이러스 연구실</div><div class="sub">확률과 통계 방탈출 · 2022 개정 교육과정</div>
 <p class="tinfo">2094년, 정체불명의 Z-Virus로 인류의 90%가 좀비가 되었다. 봉쇄된 연구동 지하에서 수학 자물쇠를 풀고 해독제를 완성해 탈출하라.</p>
 ${(()=>{const P=ZV.part();return P.of>1?`<p><span class="pill partp">이번 시간: ${P.no}차시 / ${P.of} · ${P.name}</span></p>`:'';})()}
 <p><input id="nm" class="nm" maxlength="12" placeholder="이름(또는 번호)" value="${esc(ZV.S.cur||'')}" autocomplete="off"></p>
 ${names.length?`<div class="small">이어서 하려면 이름을 눌러요</div><div class="names">${names.map(n=>`<button data-act="pick" data-n="${esc(n)}">${esc(n)}</button>`).join('')}</div>`:''}
 <p><button class="btn big" data-act="start">시작 / 이어하기</button></p><p>${brightSeg()}</p><p>${sndBtn()} ${musBtn()} ${fxBtn()} <button class="btn ghost sm" data-act="introAgain">인트로 영상</button> <button class="btn ghost sm" data-act="teacher">교사 설정</button></p></div></div>`;}
/* ---------- 문제 패널 (문제 → 조건 → 답 넣는 법 → 실험대 → 자물쇠) ---------- */
ZV.adv=function(k){if(!ZV.CUR||ZV.CUR.step>=k)return;ZV.CUR.step=k;drawSteps();};
function drawSteps(){const ul=$('#steps');if(!ul||!ZV.CUR)return;ul.innerHTML=ZV.CUR.B.steps.map((s,i)=>`<li class="${i<ZV.CUR.step?'done':i===ZV.CUR.step?'now':''}"><span class="ck"></span><span>${s}</span>${i===ZV.CUR.step?'<span class="tag">지금</span>':''}</li>`).join('');}
function drawHints(){if(!ZV.CUR)return;const st=ZV.rs(ZV.CUR.id),H=ZV.CUR.B.hints;$('#hints').innerHTML=H.slice(0,st.hints).map((h,i)=>`<div class="h"><b>서연의 힌트 ${i+1} (무전).</b> ${h}</div>`).join('');updHint();}
function updHint(){const btn=$('#hbtn');if(!btn||!ZV.CUR)return;const st=ZV.rs(ZV.CUR.id),H=ZV.CUR.B.hints;if(st.solved||st.hints>=H.length){btn.style.display='none';return;}btn.style.display='';const rem=Math.max(0,ZV.S.settings.hintWait-Math.floor((Date.now()-ZV.CUR.hintT)/1000));btn.disabled=rem>0;btn.textContent=rem>0?`서연의 힌트 ${st.hints+1} (${rem}초 후)`:`서연의 힌트 ${st.hints+1} 듣기${ZV.S.settings.hintPenalty?` (+${ZV.S.settings.hintPenalty}초)`:''}`;}
ZV.openPuzzle=function(pid){const R=ZV.RM[pid],P=ZV.getParams(pid),B=R.build(P),st=ZV.rs(pid);ZV.CUR={id:pid,P,B,step:st.solved?B.steps.length:0,hintT:Date.now()};ZV.BS=null;ZV.pending=null;
 pz.hidden=false;pz.scrollTop=0;
 pz.innerHTML=`<div class="wrap"><div class="top"><button class="btn ghost sm" data-act="pzClose">← 돌아가기</button><h1>${R.name}</h1>${timerPill()}</div><p class="story"><span class="pill">${R.tag}</span> ${R.topic}</p>
 <section class="card"><h3><span class="no">1</span>문제</h3><p class="q">${B.q}</p>${ZV.changed(pid)?'<div class="small" style="margin-top:6px">※ 교사가 값을 바꾼 문항이에요 (정답이 기본값과 달라요)</div>':''}</section>
 <section class="card"><h3><span class="no">2</span>조건</h3><ul class="chips">${B.conds.map(c=>`<li>${c}</li>`).join('')}</ul></section>
 <section class="card"><h3><span class="no">3</span>답 넣는 법</h3><div class="fmt">${B.fmt.rule}<div class="ex">${B.fmt.ex}</div></div></section>
 <section class="card"><h3><span class="no">4</span>실험대</h3><ul class="steps" id="steps"></ul><div class="bench" id="bench"></div></section>
 <section class="card"><h3><span class="no">5</span>자물쇠 (답 입력)</h3>
 <div class="lock"><input id="ans" inputmode="decimal" autocomplete="off" placeholder="답" ${st.solved?'disabled value="'+ZV.ansPlain(B.ans)+'"':''}><button class="btn" data-act="submit" ${st.solved?'disabled':''}>열어 보기</button></div>
 <div class="fb ${st.solved?'ok':''}" id="fb">${st.solved?'이미 푼 자물쇠예요. (정답 확인 완료)':''}</div>
 ${ZV.S.settings.showAns?`<div class="demo">시연용 정답 표시: <b>${ZV.ansText(B.ans)}</b></div>`:''}
 <div class="hintbox"><div id="hints"></div><button class="btn ghost sm" data-act="hint" id="hbtn"></button></div><div id="after"></div></section></div>`;
 const b=ZV.BENCH[B.bench.type];$('#bench').innerHTML=b.html(B.bench);b.init(B.bench);drawSteps();drawHints();
 const a=$('#ans');if(a&&!st.solved)a.addEventListener('keydown',e=>{if(e.key==='Enter')submit();});};
function submit(){if(!ZV.CUR)return;const id=ZV.CUR.id,st=ZV.rs(id);if(st.solved)return;const raw=$('#ans').value.trim(),res=ZV.judge(ZV.CUR.B,raw),fb=$('#fb');
 if(raw){st.tries++;st.inputs.push({t:Date.now(),v:raw,ok:res.ok});if(!res.ok)st.wrong.push(raw);}
 if(res.ok){st.solved=true;st.solvedAt=Date.now();ZV.CUR.step=ZV.CUR.B.steps.length;drawSteps();ZV.pending=id;ZV.save();
  fb.className='fb ok';fb.innerHTML='자물쇠가 열렸어요! 정답: <b>'+ZV.ansText(ZV.CUR.B.ans)+'</b>';$('#ans').disabled=true;
  $('#after').innerHTML=(ZV.CUR.B.after?`<div class="fmt" style="margin-top:10px">${ZV.CUR.B.after}</div>`:'')+`<p><button class="btn" data-act="pzClose" style="margin-top:12px">자물쇠를 열고 돌아가기</button></p>`;
  const sb=document.querySelector('[data-act=submit]');if(sb)sb.disabled=true;updHint();}
 else{fb.className='fb bad';fb.innerHTML=res.msg;ZV.save();}}
function closePuzzle(){pz.hidden=true;pz.innerHTML='';const p=ZV.pending;ZV.CUR=null;ZV.BS=null;ZV.pending=null;if(p)ZV.onSolved(p);else ZV.drawScene();}

/* ---------- 메뉴 ---------- */
function menuOpen(){const s=ZV.S.settings;ov.innerHTML=`<div class="ov"><div class="box"><h2>MENU</h2><div class="trow"><div>밝기 ${brightSeg()}</div><label><input type="checkbox" data-set="glow" ${s.glow?'checked':''}>눌러 볼 곳 반짝임</label></div><div class="trow"><div>${sndBtn()} ${musBtn()} ${fxBtn()}</div><label>음량 <input type="range" min="0" max="100" value="${Math.round((s.vol==null?.6:s.vol)*100)}" data-act="sndVol" style="width:150px"></label></div><div class="inrow"><button class="btn ghost sm" data-act="sndtest">소리 확인</button><button class="btn ghost sm" data-act="sfxTest">자물쇠 소리 확인</button><span class="small" data-audio-status>소리 상태: ${ZV.AUDIO.status()}</span></div><div class="inrow"><button class="btn" data-act="csvme">내 기록 CSV</button><button class="btn ghost" data-act="teacher">교사 설정</button><button class="btn ghost" data-act="home">처음으로</button><button class="btn ghost" data-act="close">닫기</button></div></div></div>`;}

/* ---------- 엔딩 ---------- */
/* 12차: 차시를 나눈 경우, 이번 차시 구역을 다 통과하면 "N차시 완료" 화면. 마지막 차시까지 7구역을 모두 풀면 원래의 탈출 엔딩. */
const PARTEND=P=>[['yeon',`${P.name} 통과! 오늘은 여기까지예요, 도진 씨.`],['boss','안전 격벽 안에서 쉬어 두게. 다음 구역은 다음 교신 때 열어 주지.'],['dojin','……다음엔 더 깊이 내려가야겠군.']];
const PARTSTART=P=>[['yeon','도진 씨, 다시 연결됐어요! 쉬는 동안 아무 일 없었죠?'],['boss',`오늘 열 구역은 ${P.name}이다. 서두르지 말고 하나씩.`],['dojin','좋아요. 이어서 내려가죠.']];
ZV.showEnding=function(){const p=ZV.prof(),P=ZV.part(),full=P.last&&ZV.allStages().every(ZV.stageDone);p.partEnd=p.partEnd||{};if(!p.partEnd[P.key])p.partEnd[P.key]=Date.now();if(full&&!p.finishedAt)p.finishedAt=Date.now();ZV.save();
 if(full)ZV.AUDIO&&ZV.AUDIO.mood(0);
 ZV.dialog(full?ZV.EPILOGUE:PARTEND(P),()=>{ZV.screen='end';applyBody();const SL=full?ZV.allStages():ZV.stages(),act=SL.flatMap(s=>ZV.stagePids(s)),sum=k=>act.reduce((a,id)=>a+(p.rooms[id]?p.rooms[id][k]||0:0),0);
  const head=full?`<h1 class="logo">ESCAPE</h1><div class="logo2">탈출 성공 · 해독제 완성</div><p class="tinfo">${esc(ZV.S.cur)} 님, 도진과 함께 일곱 구역의 모든 자물쇠를 풀고 해독제를 완성했어요.</p>`
   :`<h1 class="logo" style="font-size:clamp(34px,10vw,56px)">CLEAR</h1><div class="logo2">${P.of>1?`${P.of}차시 중 ${P.no}차시 완료`:'구역 통과'}</div><p class="tinfo">${esc(ZV.S.cur)} 님, 이번 시간 구역(${P.name.split(' (')[0]})을 모두 통과했어요.<br>${P.last?'앞 차시에서 아직 못 푼 구역이 있어요. 선생님께 말씀드려 그 차시로 바꾼 뒤 이어서 풀면 탈출할 수 있어요.':'다음 시간에 <b>같은 이름</b>으로 들어오면 이어서 할 수 있어요.'}</p>`;
  app.innerHTML=`<div class="titlebg"><div class="titlebox wide">${head}
  <div class="card endtbl"><table class="rec"><tr><th>방</th><th>시도</th><th>힌트</th><th>시간</th></tr>${SL.map(s=>ZV.stagePids(s).map(id=>{const r=p.rooms[id]||{};return`<tr><td>${ZV.RM[id].name}</td><td>${r.tries||0}</td><td>${r.hints||0}</td><td>${fmtT(r.secs||0)}</td></tr>`;}).join('')).join('')}<tr><th>합계</th><th>${sum('tries')}</th><th>${sum('hints')}</th><th>${fmtT(sum('secs'))}</th></tr></table><div class="small" style="margin-top:4px">시간 = 문제 창을 열고 풀이한 시간 · 전체 경과 ${fmtT(p.totalSecs)}</div></div>
  <p><button class="btn" data-act="csvme">내 기록 CSV 저장</button> <button class="btn ghost" data-act="backGame">방 다시 보기</button> <button class="btn ghost" data-act="home">처음으로</button></p></div></div>`;});};
/* 교사가 차시를 바꾸면, 그 학생의 진행 위치를 이번 차시의 첫 미해결 구역으로 옮긴다. 차시가 바뀌었으면 true */
function syncPart(){const G=ZV.G(),P=ZV.part();if(G.part===P.key)return false;
 if(G.part===undefined&&P.key==='all:1'){G.part=P.key;ZV.save();return false;}   /* 11차 이전 기록: 그대로 이어서 */
 G.part=P.key;const L=ZV.stages();let i=L.findIndex(s=>!ZV.stageDone(s));if(i<0)i=L.length-1;G.si=i;G.items=[];G.sel=null;G.wall=0;ZV.save();return true;}

/* ---------- 기록 CSV ---------- */
function csvRows(names){const rows=[['이름','장','방','방 이름','주제','해결','시도','오답 입력','힌트 수','소요(초)','입력 기록','값 변경(정답 변동)']];
 for(const n of names){const p=ZV.S.profiles[n];if(!p)continue;ZV.allStages().forEach((s,si)=>ZV.stagePids(s).forEach((id,i)=>{const r=p.rooms[id]||{},R=ZV.RM[id];rows.push([n,s.ch,`${si+1}-${i+1}`,R.name,R.topic,r.solved?'Y':'N',r.tries||0,(r.wrong||[]).join(' | '),r.hints||0,r.secs||0,(r.inputs||[]).map(x=>x.v+(x.ok?'(정답)':'')).join(' | '),ZV.changed(id)?'Y':'N']);}));}return rows;}
/* 12차: 순위표 (이번 차시 구역 기준, 나누지 않았으면 전체) */
function rankRows(){const ids=ZV.stages().flatMap(s=>ZV.stagePids(s)),P=ZV.part();
 const R=Object.keys(ZV.S.profiles).map(n=>{const p=ZV.S.profiles[n],rs=ids.map(id=>p.rooms[id]||{}),sum=k=>rs.reduce((a,r)=>a+(k==='wrong'?(r.wrong||[]).length:r[k]||0),0);
  return{n,solved:rs.filter(r=>r.solved).length,total:ids.length,secs:sum('secs'),hints:sum('hints'),wrong:sum('wrong'),tries:sum('tries'),done:!!(p.partEnd&&p.partEnd[P.key])||(P.key==='all:1'&&!!p.finishedAt)};});
 R.sort((a,b)=>b.solved-a.solved||a.secs-b.secs||a.hints-b.hints||a.wrong-b.wrong);
 R.forEach((r,i)=>{const pv=R[i-1];r.rank=pv&&pv.solved===r.solved&&pv.secs===r.secs&&pv.hints===r.hints&&pv.wrong===r.wrong?pv.rank:i+1;});return R;}
function dlRank(){const P=ZV.part(),rows=[['순위','이름','해결','문항 수','풀이 시간(초)','풀이 시간','힌트','오답','시도','차시 완료','기준']].concat(rankRows().map(r=>[r.rank,r.n,r.solved,r.total,r.secs,fmtT(r.secs),r.hints,r.wrong,r.tries,r.done?'Y':'N',P.of>1?`${P.no}차시(${P.name})`:'전체']));
 dlRows(rows,`좀비연구실확통방탈출_순위표_${P.of>1?P.no+'차시_':''}${ZV.VER}차.csv`);}
function dlRows(rows,fn){const t='﻿'+rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'}));a.download=fn;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}
function dlCSV(names,fn){const t='﻿'+csvRows(names).map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'}));a.download=fn;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}

/* ---------- 교사 설정 ---------- */
let TCH=false;
function teacher(){if(!TCH){ov.innerHTML=`<div class="ov"><div class="box"><h2>교사 설정</h2><p class="small">PIN을 입력하세요. (처음 PIN은 0000 → 설정에서 바꾸세요)</p><div class="inrow"><input id="pin" type="password" inputmode="numeric" maxlength="8" style="width:160px;font-size:20px"><button class="btn" data-act="pinok">확인</button><button class="btn ghost" data-act="close">닫기</button></div><div class="fb" id="pfb"></div></div></div>`;setTimeout(()=>{const e=$('#pin');if(e){e.focus();e.addEventListener('keydown',k=>{if(k.key==='Enter')pinOk();});}},30);return;}
 const s=ZV.S.settings;
 ov.innerHTML=`<div class="ov"><div class="box" style="max-width:820px"><h2>교사 설정 <span class="pill ver">${ZV.VER}차</span></h2>
 <div class="trow"><label><input type="checkbox" data-set="lock" ${s.lock?'checked':''}>방(스테이지) 순서 잠금</label><label><input type="checkbox" data-set="showAns" ${s.showAns?'checked':''}>정답 표시(시연용)</label>
 <label>제한 시간(분, 0=없음) <input type="number" data-set="limitMin" min="0" max="180" value="${s.limitMin}"></label><label>힌트 대기(초) <input type="number" data-set="hintWait" min="0" max="300" value="${s.hintWait}"></label>
 <label>힌트 페널티(초) <input type="number" data-set="hintPenalty" min="0" max="600" value="${s.hintPenalty}"></label>
 <label>교육과정 <select data-set="cur" style="width:auto"><option value="2015" ${s.cur==='2015'?'selected':''}>2015 개정</option><option value="2022" ${s.cur==='2022'?'selected':''}>2022 개정</option></select></label>
 <label>PIN 변경 <input type="text" data-set="pin" maxlength="8" value="${esc(s.pin)}"></label></div>
 <h3>수업 나누기 <span class="small">(28문항을 한 번에 풀면 약 1시간 — 차시별로 나눠 진행)</span></h3>
 <div class="trow"><label>나누기 <select data-set="part" style="width:auto">${Object.entries(ZV.PARTS).map(([k,v])=>`<option value="${k}" ${s.part===k?'selected':''}>${v.n}</option>`).join('')}</select></label>
 <label>이번 시간 <select data-set="partNo" style="width:auto">${(ZV.PARTS[s.part]||ZV.PARTS.all).gn.map((g,i)=>`<option value="${i+1}" ${ZV.part().no===i+1?'selected':''}>${i+1}차시 · ${g}</option>`).join('')}</select></label></div>
 <p class="small">학생은 같은 이름으로 들어오면 이번 시간 구역의 첫 미해결 방부터 이어서 해요. 이번 시간 구역을 모두 풀면 "차시 완료" 화면이 나오고, 마지막 차시까지 모두 풀어야 탈출 엔딩이 나와요. (같은 기기·같은 브라우저에서만 기록이 이어져요)</p>
 <p class="small">기본은 <b>2022 개정</b>입니다. 2015 개정을 고르면 원순열 문항이 추가돼요. (원순열은 2022 개정 확률과 통계에서 제외됨 — 기사 요약 기준이므로 교육과정 원문으로 한 번 더 확인해 주세요.) 장(스테이지)마다 문항 4개 안팎이라, 문항을 끄면 그만큼 수업 시간에 맞출 수 있어요.</p>
 <h3>문항 켜기/끄기 · 값 변경 <span class="small">(값을 바꾸면 정답이 달라져요)</span></h3>
 ${ZV.STAGES.map(st=>`<div class="chh">${st.name}</div>`+st.pids.map(id=>{const r=ZV.RM[id],P=ZV.getParams(id),on=!s.off[id],mm=r.cur&&r.cur!==s.cur;return`<div class="rs"><label><input type="checkbox" data-off="${id}" ${on?'checked':''}> <b>${r.name}</b> <span class="small">(${r.topic} · ${r.tag}${mm?' · 현재 교육과정에서는 안 나옴':''})</span></label>
 <div class="f">${r.fields.map(f=>f.sel?`<label>${f.label} <select data-par="${id}.${f.k}" style="width:auto">${f.sel.map(v=>`<option ${v===P[f.k]?'selected':''}>${v}</option>`).join('')}</select></label>`:`<label>${f.label} <input type="number" data-par="${id}.${f.k}" min="${f.min}" max="${f.max}" step="${f.step||1}" value="${P[f.k]}" style="width:80px"></label>`).join('')}${r.fields.length?`<button class="btn ghost sm" data-act="parReset" data-id="${id}">기본값</button>`:'<span class="small">값 변경 없음</span>'}</div></div>`;}).join('')).join('')}
 <h3>학생 기록 · 순위표 <span class="small">(상품 주기용 — ${esc(ZV.part().of>1?ZV.part().no+'차시 구역 기준':'전체 구역 기준')})</span></h3>${Object.keys(ZV.S.profiles).length?`<div class="tw"><table class="rec"><tr><th>순위</th><th>이름</th><th>해결</th><th>풀이 시간</th><th>힌트</th><th>오답</th><th>완료</th><th></th></tr>${rankRows().map(r=>`<tr class="${r.rank<=3&&r.solved?'top':''}"><td>${r.rank<=3&&r.solved?['🥇','🥈','🥉'][r.rank-1]:r.rank}</td><td>${esc(r.n)}</td><td>${r.solved}/${r.total}</td><td>${fmtT(r.secs)}</td><td>${r.hints}</td><td>${r.wrong}</td><td>${r.done?'✔':''}</td><td><button class="btn ghost sm" data-act="delOne" data-n="${esc(r.n)}">삭제</button></td></tr>`).join('')}</table></div>
 <p class="small">순위: 해결한 문항 수가 많을수록 → 같으면 풀이 시간(문제 창을 열고 푼 시간 + 힌트 페널티)이 짧을수록 → 같으면 힌트를 적게 쓸수록 앞.</p>`:'<p class="small">아직 기록이 없어요.</p>'}
 <div class="inrow"><button class="btn" data-act="csvRank">순위표 CSV</button><button class="btn" data-act="csvAll">전체 기록 CSV 내보내기</button><button class="btn warn" data-act="delAll">기록 전체 초기화</button><button class="btn ghost" data-act="close">닫기</button></div></div></div>`;}
function pinOk(){const v=($('#pin')||{}).value;if(v===ZV.S.settings.pin){TCH=true;teacher();}else{const f=$('#pfb');f.className='fb bad';f.textContent='PIN이 맞지 않아요.';}}
function confirmBox(msg,act,data){ov.innerHTML=`<div class="ov"><div class="box"><h2>확인</h2><p>${msg}</p><div class="inrow"><button class="btn warn" data-act="${act}" ${data?`data-n="${esc(data)}"`:''}>네, 진행</button><button class="btn ghost" data-act="teacher">취소</button></div></div></div>`;}
function afterClose(){ov.innerHTML='';TCH=false;if(ZV.screen==='title')titleScreen();else if(ZV.screen==='game'){if(ZV.prof()&&ZV.G().part!==ZV.part().key){resumeGame();return;}ZV.drawScene();ZV.drawInv();}}

/* ---------- 이벤트 ---------- */
function startGame(name){if(!ZV.S.profiles[name]){ZV.S.profiles[name]=ZV.newProfile({});ZV.S.cur=name;ZV.save();ZV.G().part=ZV.part().key;ZV.save();ZV.renderGame();ZV.dialog(ZV.PROLOGUE,()=>ZV.enterStage(0,true));return;}ZV.S.cur=name;ZV.save();resumeGame();}
function resumeGame(){const p=ZV.prof(),P=ZV.part(),moved=syncPart();if(ZV.allDone()&&p.partEnd&&p.partEnd[P.key]){ZV.showEnding();return;}
 if(ZV.allDone()&&!p.partEnd&&p.finishedAt){ZV.showEnding();return;}   /* 11차 이전에 탈출까지 마친 기록 */
 const G=ZV.G();G.sel=null;ZV.renderGame();const st=ZV.curStage();
 const go=()=>{if(!G.seen[st.id]){G.seen[st.id]=1;ZV.save();ZV.say(st.intro,()=>ZV.evCheck('enter'));}else ZV.say('……다시 돌아왔다.');};
 if(moved&&P.no>1)ZV.dialog(PARTSTART(P),go);else go();}
const ACT={
 bright:t=>{setBright(+t.dataset.v);if(ZV.screen==='title')titleScreen();else if(ov.innerHTML.includes('MENU'))menuOpen();},
 pick:t=>{$('#nm').value=t.dataset.n;},
 start:()=>{const n=($('#nm').value||'').trim().slice(0,12);if(!n){$('#nm').focus();return;}startGame(n);},
 home:()=>{ZV.save();ov.innerHTML='';titleScreen();},

 backGame:()=>{ZV.renderGame();ZV.say('……다시 돌아왔다.');},
 prop:t=>ZV.tapProp(t.dataset.p),
 navL:()=>ZV.navWall(-1),navR:()=>ZV.navWall(1),narrTap:()=>ZV.narrTap(),dlgTap:()=>ZV.dlgTap(),
 itemTap:t=>{if(ZV.using||ZV.narrBusy())return;const id=t.dataset.i,G=ZV.G();if(G.sel&&G.sel!==id&&ZV.combine(G.sel,id))return;   /* 13차: 든 물건으로 다른 물건을 누르면 합치기 */
  G.sel=G.sel===id?null:id;ZV.drawInv();const nj=ZV.jo(ZV.ITEM[id].n,'을','를');ZV.say(G.sel?`${nj} 열쇠고리에서 꺼내 들었다. ${ZV.itemDesc(id)}`:`${nj} 다시 열쇠고리에 걸었다.`);},
 introSnd:()=>{const v=$('#iv');if(!v)return;v.muted=!v.muted;if(v.paused)v.play().catch(()=>{});const b=$('#isnd');if(b)b.textContent=v.muted?'🔇 영상 소리 켜기':'🔊 영상 소리 끄기';},
 introPlay:()=>{const v=$('#iv');if(!v)return;v.play().then(()=>{const p=$('#iplay');if(p)p.hidden=true;}).catch(()=>{});},
 introSkip:()=>introEnd(),introAgain:()=>introScreen(),
 mapOpen:()=>ZV.mapOpen(),mapLock:()=>{const m=document.getElementById('mapMsg');if(m)m.textContent='봉쇄된 구역이에요. 앞 구역의 자물쇠를 모두 풀어야 들어갈 수 있어요.';},mapGo:t=>{ov.innerHTML='';ZV.enterStage(+t.dataset.i,false);},
 menuOpen:menuOpen,close:afterClose,
 mus:()=>{ZV.AUDIO.toggleMusic();if(ZV.screen==='title')titleScreen();else if(ov.innerHTML.includes('MENU'))menuOpen();},
 sfxToggle:()=>{ZV.AUDIO.toggleEffects();if(ZV.screen==='title')titleScreen();else menuOpen();},
 sfxTest:()=>{ZV.AUDIO.unlock();ZV.AUDIO.sfx('unlock');},
 sndtest:()=>{ZV.AUDIO.test();ZV.AUDIO.unlock();setTimeout(()=>{if(ov.innerHTML.includes('MENU'))menuOpen();},900);},
 snd:()=>{ZV.AUDIO.toggle();if(ZV.screen==='title')titleScreen();else if(ov.innerHTML.includes('MENU'))menuOpen();},
 submit:submit,pzClose:closePuzzle,
 hint:()=>{if(!ZV.CUR)return;const st=ZV.rs(ZV.CUR.id);if(st.hints>=ZV.CUR.B.hints.length)return;if(Date.now()-ZV.CUR.hintT<ZV.S.settings.hintWait*1000)return;st.hints++;ZV.CUR.hintT=Date.now();if(ZV.S.settings.hintPenalty){ZV.prof().totalSecs+=ZV.S.settings.hintPenalty;st.secs+=ZV.S.settings.hintPenalty;st.penalty+=ZV.S.settings.hintPenalty;}ZV.save();drawHints();},
 teacher:teacher,pinok:pinOk,
 parReset:t=>{delete ZV.S.settings.params[t.dataset.id];ZV.save();teacher();},
 csvRank:dlRank,
 csvAll:()=>dlCSV(Object.keys(ZV.S.profiles),`좀비연구실확통방탈출_기록_${ZV.VER}차.csv`),csvme:()=>dlCSV([ZV.S.cur],`좀비연구실확통방탈출_${ZV.S.cur}_${ZV.VER}차.csv`),
 delOne:t=>confirmBox(`'${esc(t.dataset.n)}' 학생의 기록을 삭제할까요? 되돌릴 수 없어요.`,'delOneOk',t.dataset.n),
 delOneOk:t=>{delete ZV.S.profiles[t.dataset.n];if(ZV.S.cur===t.dataset.n)ZV.S.cur=null;ZV.save();teacher();},
 delAll:()=>confirmBox('모든 학생의 기록을 초기화할까요? 되돌릴 수 없어요.','delAllOk'),
 delAllOk:()=>{ZV.S.profiles={};ZV.S.cur=null;ZV.save();teacher();}
};
Object.assign(ACT,ZV.SACT||{});   /* 13차: 키패드·레버 버튼 (scenes.js) */
ZV.ACT=ACT;

document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t||t.disabled)return;const a=t.dataset.act;const f=ACT[a]||ZV.BACT[a];if(f)f(t,e);});
document.addEventListener('input',e=>{const t=e.target;if(t.type==='range'&&t.dataset.act){const f=ZV.BACT[t.dataset.act];if(f)f(t,e);return;}ZV.benchInput&&ZV.benchInput(e);});
document.addEventListener('change',e=>{const t=e.target,s=ZV.S.settings;
 if(t.dataset.set){const k=t.dataset.set;if(t.type==='checkbox')s[k]=t.checked;else if(k==='cur'||k==='pin'||k==='part')s[k]=t.value||s[k];else s[k]=Math.max(0,+t.value||0);if(k==='part')s.partNo=1;ZV.save();if(k==='cur'||k==='part'||k==='partNo')teacher();}
 else if(t.dataset.off){s.off[t.dataset.off]=!t.checked;ZV.save();}
 else if(t.dataset.par){const[id,k]=t.dataset.par.split('.');s.params[id]=s.params[id]||{};s.params[id][k]=+t.value;ZV.save();teacher();}});
document.addEventListener('keydown',e=>{if(ZV.screen!=='game'||!pz.hidden||ov.innerHTML)return;if(e.key==='ArrowLeft')ZV.navWall(-1);else if(e.key==='ArrowRight')ZV.navWall(1);});

/* ---------- 시계 ---------- */
let saveN=0;
setInterval(()=>{if(document.visibilityState!=='visible')return;const p=ZV.prof();
 if(ZV.screen==='game'&&p){p.totalSecs++;if(ZV.CUR&&!pz.hidden){const st=ZV.rs(ZV.CUR.id);if(!st.solved){st.secs++;updHint();}}
  const lim=ZV.S.settings.limitMin*60;if(lim>0&&p.totalSecs===lim&&!p.timeUp){p.timeUp=true;ZV.save();ov.innerHTML='<div class="ov"><div class="box"><h2>시간 종료</h2><p>제한 시간이 끝났어요. 계속 풀어도 기록은 남아요.</p><div class="inrow"><button class="btn" data-act="close">계속 풀기</button></div></div></div>';}}
 ZV.tickTm();if(++saveN%5===0)ZV.save();},1000);
addEventListener('beforeunload',ZV.save);
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});

/* ---------- 인트로 영상 (11차): 처음 열면 10초 영상(media/intro.mp4)이 먼저 나오고, 끝나거나 건너뛰면 제목 화면 ----------
   브라우저는 소리 있는 자동 재생을 막으므로 처음엔 음소거로 재생 → [영상 소리 켜기]로 켬. 자동 재생이 막히면 가운데 ▶ 버튼. */
function introScreen(){ZV.screen='intro';ZV.introOn=true;ZV.AUDIO&&ZV.AUDIO.apply&&ZV.AUDIO.apply();pz.hidden=true;ov.innerHTML='';document.body.classList.add('introing');
 app.innerHTML=`<div class="intro"><video id="iv" src="media/intro.mp4" playsinline webkit-playsinline muted autoplay preload="auto"></video>
 <button class="iplay" id="iplay" data-act="introPlay" hidden aria-label="영상 재생">▶</button>
 <div class="ibar"><button class="btn ghost sm" id="isnd" data-act="introSnd">🔇 영상 소리 켜기</button><button class="btn sm" data-act="introSkip">건너뛰기 ▶▶</button></div></div>`;
 const v=$('#iv');v.addEventListener('ended',introEnd);v.addEventListener('error',introEnd);v.addEventListener('playing',()=>{const b=$('#iplay');if(b)b.hidden=true;});
 const p=v.play();if(p&&p.catch)p.catch(()=>{if(v.paused){const b=$('#iplay');if(b)b.hidden=false;}});}
function introEnd(){if(ZV.screen!=='intro')return;const v=$('#iv');if(v){v.pause();v.removeAttribute('src');v.load();}ZV.introOn=false;document.body.classList.remove('introing');ZV.AUDIO&&ZV.AUDIO.apply&&ZV.AUDIO.apply();titleScreen();}

ZV.titleScreen=titleScreen;
window.__zv=ZV;
introScreen();
})();
