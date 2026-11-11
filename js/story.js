/* 좀비바이러스 연구실 — 15차 이야기 (scenes.js 다음, main.js 앞에 불러온다)
   · 새 인물 강 반장(인터폰) · 구역마다 기록물 1장(FILE) · 대화 선택지 · 건너뛰기 · 결말 3가지 · 긴장감 연출
   · 저장: flags['rec:s1'](기록물) · flags['ch:kang'|'ch:trust'|'ch:end'](선택) · flags['ev:s2:1'](구역의 둘째 사건) */
(function(){
'use strict';
const ZV=window.ZV,{$,esc}=ZV;
const FL=()=>ZV.G().flags;
const ch=k=>FL()['ch:'+k];

/* ================= 인물 ================= */
ZV.CAST.kang={n:'강 반장',c:'#ff9d5c',side:'r',tag:'인터폰',sonly:'INTERCOM B2'};

/* ================= 기록물 (구역마다 1장) =================
   role: 그 구역에서 기록물이 숨어 있는 구경거리(imgs.js 의 d1·d3). find: 발견 나레이션, say: 읽은 뒤 도진의 생각 */
const RECS={
 s1:{role:'d1',t:'격리 봉쇄 명령서 (사본)',find:'……화이트보드 뒤에 종이 한 장이 끼워져 있다.',
  body:'<b>격리 봉쇄 명령</b><br>대상: 연구동 지하 전 구역<br>발령 시각: <mark>02:10</mark><br>승인: 한 소장<hr><span class="hand">※ 경보 기록 대조 — 최초 감염 경보 <mark>02:47</mark></span>',
  say:[['dojin','봉쇄 명령이 02:10……. 그런데 첫 감염 경보는 02:47?'],['dojin','봉쇄가 경보보다 37분이나 빨랐다. ……일단 챙겨 두자. (화면 위 FILE 에서 다시 볼 수 있다.)']]},
 s2:{role:'d3',t:'기록 삭제 요청 로그',find:'……깜빡이는 화면에 지워지다 만 로그가 남아 있다.',
  body:'<b>서버 작업 로그</b><br>작업: 임상 기록 <mark>1301 ~ 1346</mark> 영구 삭제<br>요청 단말: <mark>소장실</mark><br>요청 시각: 02:31<br>상태: 중단됨 (전원 차단)',
  say:[['dojin','임상 기록 1301번부터 1346번까지 삭제 요청. 요청한 곳은 소장실.'],['dojin','남아 있던 녹화 기록이 1347번이었지. 그 앞의 기록은 전부 지우려 했다는 건가.']]},
 s3:{role:'d3',t:'피험자 명부 (12번)',find:'……관찰창 틀에 명부 한 장이 테이프로 붙어 있다.',
  body:'<b>임상 피험자 명부</b><br>번호: <mark>12</mark><br>구분: 자원자 <s>☑</s> ☐ &nbsp;/&nbsp; <mark>소속 연구원 ☑</mark><br>동의서: <mark>없음</mark><br>투여 물질: H-12',
  say:[['dojin','피험자 12번은 자원자가 아니야. 이 연구동의 연구원이었어. 동의서도 없이…….'],['dojin','유리 너머의 저 사람이……. 아니, 지금은 생각하지 말자.']]},
 s4:{role:'d1',t:'투여 승인서',find:'……검사 화면 아래에 서류철이 끼워져 있다.',
  body:'<b>후보 물질 H-12 투여 승인서</b><br>대상: 피험자 12번<br>윤리위원회 서명: <mark>(공란)</mark><br>승인자 서명: <span class="hand"><mark>한</mark></span><br>비고: 긴급 · 구두 승인으로 대체',
  say:[['dojin','윤리위원회 서명란이 비어 있어. 승인자 서명은…… "한".'],['dojin','승인받지 않은 투여였다는 뜻이군.']]},
 s5:{role:'d1',t:'결박 장치 작동 기록',find:'……침대 옆 단말에 작동 기록이 떠 있다.',
  body:'<b>12번 병상 결박 장치</b><br>원격 해제: <mark>02:05</mark><br>권한: <mark>소장 ID</mark><br>사유: 이송<br>이송 완료 기록: <mark>없음</mark>',
  say:[['dojin','결박이 풀린 시각이 02:05. 봉쇄 명령이 02:10이었지.'],['dojin','결박을 푼 것도, 5분 뒤에 문을 잠근 것도…… 같은 사람의 권한이야.']]},
 s6:{role:'d3',t:'염기 서열 분석 보고서 (조각)',find:'……찢어진 문서 사이에 온전한 한 장이 남아 있다.',
  body:'<b>분석 보고서</b><br>Z-Virus 와 후보 물질 H-12 의 염기 서열 일치도: <mark>97%</mark><br>결론: 외부 유입 가능성 낮음.<br><mark>H-12 가 체내에서 변이한 것으로 추정.</mark>',
  say:[['dojin','Z-Virus와 해독제 후보 H-12의 일치도가 97%…….'],['dojin','바이러스는 밖에서 온 게 아니었어. 이 연구동에서 만든 물질이 변이한 거야.']]},
 s7:{role:'d3',t:'손으로 쓴 메모',find:'……경고문 뒤에 접힌 메모지가 꽂혀 있다.',
  body:'<span class="hand">해독제만 완성되면 기록은 필요 없다.<br>지하의 것은 지하에 둔다.<br><mark>자물쇠는 그것들을 막으려는 것이 아니다.<br>이것을 묻으려는 것이다.</mark><br>— 한</span>',
  say:[['dojin','……소장님 글씨다.'],['dojin','수학 자물쇠는 감염자를 막는 벽이 아니었어. 증거를 가두는 금고였던 거야.']]}};
ZV.RECS=RECS;
const recIds=()=>ZV.allStages().map(s=>s.id).filter(id=>RECS[id]);
const recGot=()=>recIds().filter(id=>FL()['rec:'+id]);
const recNeed=()=>Math.min(5,Math.max(1,recIds().length-2));
ZV.recCount=()=>({n:recGot().length,of:recIds().length,need:recNeed()});
/* 장면 그리기에서: 이 구경거리에 아직 안 챙긴 기록물이 있나 (반짝임 표시) */
ZV.recHere=(st,key)=>{const R=RECS[st.id];return !!R&&R.role===key&&!FL()['rec:'+st.id];};
/* 구경거리를 눌렀을 때: 기록물이 있으면 챙기고 true */
ZV.recTry=function(st,key,txt){if(!ZV.recHere(st,key))return false;FL()['rec:'+st.id]=1;ZV.save();ZV.drawScene();ZV.fileUpd();
 ZV.say([txt||'자세히 살펴보았다.',RECS[st.id].find],()=>recShow(st.id,true));return true;};
const paper=(id)=>{const R=RECS[id],i=recIds().indexOf(id)+1;return`<div class="paper"><div class="pno">기록물 ${i}</div><h3>${R.t}</h3><div class="pbody">${R.body}</div></div>`;};
function recShow(id,isNew){ZV.AUDIO&&ZV.AUDIO.sfx('paper');const c=ZV.recCount();
 $('#ov').innerHTML=`<div class="ov recv"><div class="recw">${isNew?`<div class="recnew">기록물을 발견했다 (${c.n}/${c.of})</div>`:''}${paper(id)}<p style="text-align:center"><button class="btn" data-act="recClose" data-id="${id}" data-new="${isNew?1:''}">${isNew?'FILE 에 넣기':'닫기'}</button></p></div></div>`;}
ZV.fileUpd=function(){const b=$('#fileB');if(!b||!ZV.prof())return;const c=ZV.recCount();b.textContent=`FILE ${c.n}/${c.of}`;b.classList.toggle('got',c.n>0);};
function fileOpen(){const ids=recIds(),c=ZV.recCount(),L=ZV.allStages();
 $('#ov').innerHTML=`<div class="ov"><div class="box filebox"><h2>FILE · 모은 기록물 ${c.n}/${c.of}</h2><p class="small">구역마다 기록물이 한 장씩 숨어 있어요. 자물쇠가 없는 곳도 눌러 보세요. 많이 모을수록 마지막에 할 수 있는 일이 달라져요.</p>
 ${ids.map((id,i)=>{const st=L.find(s=>s.id===id),got=FL()['rec:'+id];return got?`<details class="frow" ${i===ids.length-1||c.n===1?'open':''}><summary><b>${i+1}. ${RECS[id].t}</b> <span class="small">· ${st.name}</span></summary>${paper(id)}</details>`:`<div class="frow none"><b>${i+1}. ？？？</b> <span class="small">· ${ZV.G().seen[id]?st.name+' 어딘가':'아직 가 보지 못한 구역'}</span></div>`;}).join('')}
 <p><button class="btn ghost" data-act="close">닫기</button></p></div></div>`;}
Object.assign(ZV.SACT,{fileOpen,recClose:t=>{$('#ov').innerHTML='';if(t.dataset.new)ZV.say(RECS[t.dataset.id].say);}});

/* ================= 대화 장면 (선택지 · 건너뛰기) =================
   한 줄: '나레이션' | ['인물','대사'] | {ask:'물음',who:'dojin',key:'kang',opts:[['보이는 글','값',[이어지는 줄] 또는 함수]]} | {if:()=>조건,then:[줄],else:[줄]} */
let DL=null;
const porHTML=k=>{const C=ZV.CAST[k];if(!C)return'';return C.img?`<img src="${C.img}" alt="${C.n}" class="${C.cls||''}">${C.radio?'<i class="scan"></i>':''}`:`<div class="sonly" style="${C.sonly?`border-color:${C.c};color:${C.c}`:''}"><b>${C.sonly||'SOUND ONLY'}</b><span>${C.n}</span><i class="wave" style="${C.sonly?`background:repeating-linear-gradient(90deg,${C.c} 0 3px,transparent 3px 7px)`:''}"></i></div>`;};
function dlgPor(k){const C=ZV.CAST[k];if(!C){['L','R'].forEach(s=>{const e=$('#por'+s);if(e&&e.innerHTML){e.classList.add('dim');e.classList.remove('on');}});return;}const side=C.side==='l'?'L':'R',el=$('#por'+side);if(!el)return;
 if(DL[side]!==k){DL[side]=k;el.innerHTML=porHTML(k);el.classList.remove('in');void el.offsetWidth;el.classList.add('in');}
 const o=$('#por'+(side==='L'?'R':'L'));el.classList.add('on');el.classList.remove('dim');if(o&&o.innerHTML)o.classList.add('dim'),o.classList.remove('on');}
/* 지금 줄을 꺼낸다 ({if} 는 그 자리에서 펼친다) */
function cur(){for(;;){const l=DL.q[DL.i];if(l&&!Array.isArray(l)&&typeof l==='object'&&l.if){const add=(l.if()?l.then:l.else)||[];DL.q.splice(DL.i,1,...add);continue;}return l;}}
function dlgEnd(){clearInterval(DL.t);const f=DL.cb;DL=null;$('#ov').innerHTML='';if(f)f();}
function dlgLine(){let l=cur();if(l===undefined){dlgEnd();return;}const isAsk=!Array.isArray(l)&&typeof l==='object';
 if(typeof l==='string')l=['',l];if(isAsk)l=[l.who||'dojin',l.ask,l];
 const R=ZV.CAST[l[0]]||{n:'',c:'#7be04a'},n=$('#dlgN');n.textContent=R.n;n.style.color=R.c;dlgPor(l[0]);
 $('#dlgT').textContent=isAsk?'선택':R.tag||(R.radio?'무전':'');$('#dlgRd').style.visibility=R.radio&&!isAsk?'':'hidden';
 DL.ask=isAsk?l[2]:null;const C=$('#dlgC'),v=$('#dlgV');v.classList.toggle('asking',isAsk);
 C.innerHTML=isAsk?l[2].opts.map((o,i)=>`<button class="chb" data-act="dlgPick" data-i="${i}">${o[0]}</button>`).join(''):'';
 if(isAsk)ZV.AUDIO&&ZV.AUDIO.sfx('sting');
 DL.full=l[1].replace(/\{name\}/g,ZV.S.cur||'');DL.shown=0;clearInterval(DL.t);$('#dlgX').textContent='';
 DL.t=setInterval(()=>{DL.shown+=2;const x=$('#dlgX');if(!x){clearInterval(DL.t);return;}x.textContent=DL.full.slice(0,DL.shown);if(DL.shown>=DL.full.length)clearInterval(DL.t);},24);}
ZV.dialog=function(lines,cb){if(typeof lines==='function')lines=lines();DL={q:lines.slice(),i:0,cb,shown:0,t:null,L:null,R:null,ask:null};
 $('#ov').innerHTML=`<div class="ov dlgv" id="dlgV" data-act="dlgTap"><button class="dlgskip" data-act="dlgSkip">건너뛰기 ▶▶</button><div class="cast"><div class="por l" id="porL"></div><div class="por r" id="porR"></div></div><div class="dlgbox"><div class="radio"><span class="rd" id="dlgRd"></span><span class="dlgn" id="dlgN"></span><span class="dlgt" id="dlgT"></span></div><div class="dlgx" id="dlgX"></div><div class="dlgch" id="dlgC"></div><div class="nx">▼</div></div></div>`;dlgLine();};
ZV.dlgTap=function(){if(!DL)return;if(DL.shown<DL.full.length){DL.shown=DL.full.length;$('#dlgX').textContent=DL.full;clearInterval(DL.t);return;}if(DL.ask)return;DL.i++;dlgLine();};
/* 건너뛰기: 다음 선택지(또는 끝)까지 넘긴다. 선택지는 건너뛸 수 없다 */
ZV.dlgSkip=function(){if(!DL||DL.ask)return;for(;;){DL.i++;const l=cur();if(l===undefined||(!Array.isArray(l)&&typeof l==='object'))break;}dlgLine();};
ZV.dlgPick=function(i){if(!DL||!DL.ask)return;const a=DL.ask,o=a.opts[i];if(!o)return;FL()['ch:'+a.key]=o[1];ZV.save();
 let re=o[2]||[];if(typeof re==='function')re=re();DL.ask=null;DL.q.splice(DL.i,1,...re);dlgLine();};
ZV.dlgAsk=()=>!!(DL&&DL.ask);
Object.assign(ZV.SACT,{dlgSkip:()=>ZV.dlgSkip(),dlgPick:t=>ZV.dlgPick(+t.dataset.i)});

/* ================= 이야기 고쳐 쓰기 ================= */
ZV.PROLOGUE=[['dojin','……으. 머리가 깨질 것 같다. 여긴…… 지하 격리실인가?'],['boss','도진 연구원, 들리나? 연구동이 봉쇄됐다. Z-Virus가 지하 1층까지 올라왔어.'],['yeon','도진 씨, 무사했군요! 저 서연이에요. 소장님과 지상 통제실에서 무전 연결했어요.'],
 ['yeon','해독제 합성실까지는 일곱 개 구역이에요. 구역마다 소장님이 만든 보안 자물쇠가 잠겨 있어요.'],['boss','수학으로 풀어야 열린다. 감염체는 계산을 못 하니까. 데이터를 읽을 줄 아는 사람만 지나가게 설계했지.'],['dojin','……하필 수학이라니. 좋아요, 해 보죠.'],
 ['yeon','구역마다 문을 여는 장치가 달라요. 열쇠, 비밀번호, 퓨즈, 시료병……. 찾은 물건은 허리춤 열쇠고리에 걸어 두세요.'],['yeon','막히면 제가 무전으로 힌트를 드릴게요. 조금 기다려야 하지만요.'],
 ['boss','한 가지만 당부하지. 내려가는 길에 굴러다니는 서류는 건드리지 말게. 오염됐을 수 있으니.'],['yeon','……서류요? 소장님, 종이로는 감염이——'],['boss','행운을 비네, 도진.'],'무전이 끊겼다. ……서류는 건드리지 말라고? 왜 굳이 그런 말을.'];

const S=id=>ZV.STAGES.find(s=>s.id===id);
/* 구역마다 사건을 여러 개 둘 수 있다 (evs). 첫째 사건은 14차와 같은 저장 표시('ev:s1')를 쓴다 */
S('s1').evs=[{when:'wall1',fx:'shake',sfx:'door',lines:[['dojin','……방금, 환기구 안에서 뭔가 긁는 소리가?'],['yeon','도진 씨? 무슨 소리예요?'],['dojin','……아무것도 아니길 바라야지. 서두르자.']]}];
S('s2').evs=[
 {when:'solved2',fx:'glitch',sfx:'static',lines:['꺼져 있던 서버 모니터 하나가 지지직 켜졌다. 녹화 기록이 재생된다.',['rec','……기록 1347. Z-Virus 감염체가 규칙적인 패턴에 반응한다. 무작위가 아니다. 확률로 읽힌다.'],['rec','그래서 보안 장치를 수학으로 잠갔다. 감염체는 계산을 하지 못하니까.'],['dojin','소장님 목소리……. 이래서 자물쇠가 전부 수학이었군.'],['dojin','(……그런데 왜 1347번부터 남아 있지? 그 앞의 기록은?)']]},
 {when:'wall2',fx:'glitch',sfx:'static',lines:['벽에 붙은 낡은 인터폰에서 지지직 소리가 났다.',['kang','……거기 누구 있나. 살아 있는 사람이면 대답해.'],['dojin','연구원 도진입니다. 당신은요?'],['kang','보안반장 강이다. 지하 2층 경비실에 갇혀 있어. 무전은 쓰지 마. 그 채널은 통제실이 전부 듣는다.'],['kang','하나만 알아 둬. 그날 밤 봉쇄 버튼은 경보가 울리기 전에 눌렸어. 내 부하 둘이 아직 안에 있었는데.'],['dojin','……누가 눌렀다는 겁니까?'],['kang','그 버튼을 누를 수 있는 사람은 이 연구동에 한 명뿐이야.'],['kang','……선이 불안정하군. 기록을 찾아. 종이는 거짓말을 못 하니까.'],'뚝. 인터폰이 끊겼다.']}];
S('s2').after=[['yeon','첫 번째 구역을 통과했어요! 아직 아무도 안 쫓아오고 있어요.'],['boss','다음은 감염 진단 구역이다. 확률로 감염 여부를 가려내는 시스템이지.'],
 {if:()=>FL()['ev:s2:1'],then:[['boss','그런데 도진. 방금 그 층 인터폰 회선에 신호가 잡혔네. 누군가와 이야기했나?'],
  {ask:'(……어떻게 대답하지?)',key:'kang',opts:[
   ['강 반장과 이야기했다고 말한다','tell',[['dojin','보안반장 강이라는 분이었습니다. 지하 2층 경비실에 갇혀 있다고…….'],['boss','……강 반장. 살아 있었군.'],['boss','그 친구 말은 걸러 듣게. 그날 밤 자기 자리를 비운 사람이야. 책임을 돌릴 곳이 필요하겠지.'],['yeon','소장님, 그래도 생존자잖아요. 구조 명단에 올릴게요.'],['boss','……그렇게 하게.']]],
   ['오래된 회선의 잡음이었다고 둘러댄다','hide',[['dojin','……잡음이었습니다. 오래된 회선이라 그런 것 같네요.'],['boss','……그런가. 알겠네.'],['boss','혹시 누가 말을 걸어오거든 바로 알리게. 감염 초기에는 그럴듯한 헛소리를 하는 법이니.'],['yeon','(……소장님이 왜 저렇게 예민하시지?)']]]]}]},
 ['yeon','진단 키트, 추첨기……. 막히면 무전 주세요!']];
S('s3').evs=[
 {when:'wall2',fx:'shake',sfx:'knock',lines:['쾅!',['zomb','그르르…… 크아아악!'],['dojin','……!! 유리 너머에서 감염자가 유리를 두드리고 있어!'],['yeon','괜찮아요?! 관찰실 유리는 강화유리예요. 버틸 거예요……. 아마도.'],['dojin','"아마도"라니……. 빨리 풀고 나가자.']]},
 {when:'solved3',fx:'glitch',sfx:'static',lines:['인터폰에 다시 불이 들어왔다.',
  {if:()=>ch('kang')==='tell',then:[['kang','……소장한테 내 얘기를 했더군. 방금 경비실 전원이 절반으로 줄었어.'],['dojin','그건…….'],['kang','됐다. 넌 네 눈으로 본 것만 믿어. 그게 맞는 거다.']],
   else:[{if:()=>ch('kang')==='hide',then:[['kang','소장한테 내 얘기를 안 했더군. 덕분에 이 회선이 아직 살아 있어. 고맙다.']],else:[['kang','도진. 아직 살아 있군.']]}]},
  ['kang','관찰창 쪽을 살펴봐. 12번 피험자의 명부가 어딘가 붙어 있을 거야. 그 사람이 누구였는지 확인해.'],['dojin','12번 피험자…….']]}];
S('s4').evs=[{when:'solved2',fx:'glitch',lines:['검사 장비 뒤 사물함에서 덜컹, 소리가 났다.',['minjun','쏘, 쏘지 마세요! 사람이에요! 저 감염 안 됐어요!'],['dojin','생존자……? 이름이 뭐죠?'],['minjun','인턴 연구원 민준이에요. 봉쇄될 때 여기 숨어 있었어요. 다리를 다쳐서 더는 못 걸어요.'],
 ['minjun','봉쇄 직전에 소장님이 인터폰으로 알려 주셨어요. "사물함에 숨어라, 문은 내가 잠가 주겠다"고요. 그분이 아니었으면 전 벌써…….'],['minjun','아래층 구조는 제가 알아요. 무전 채널을 맞춰 둘게요. 길이 막히면 알려 드릴게요.'],['yeon','민준 씨, 들려요? 통제실 서연이에요. 거기 그대로 있어요. 구조대가 갈 거예요.']]}];
S('s4').after=[['yeon','진단 구역 통과! 이제 마지막 분석 구역이 남았어요.'],['boss','임상시험동, 데이터 분석실, 그리고 해독제 합성실이다. 통계를 알아야 길이 열리지.'],'무전이 끝나자, 인터폰과 민준의 목소리가 거의 동시에 들려왔다.',
 ['kang','도진. 그 인턴 말은 너무 믿지 마. 소장이 직접 살려 둔 애야. 왜 그 애만 살려 뒀겠나.'],['minjun','반장님이야말로요! 그날 밤 경비실을 비우신 거, 제가 다 봤어요. 자리에 계셨으면 봉쇄가 그렇게 늦지는 않았을 거예요!'],['kang','늦어? 봉쇄는 빨랐다. 너무 빨랐지. 난 부하들을 꺼내러 내려간 거야.'],
 ['dojin','(두 사람의 말이 정반대다. 둘 다 거짓말을 하는 것 같지는 않은데…….)'],['dojin','(누가 맞는지는 기록이 말해 주겠지. 조금만 더 가 보자.)']];
S('s5').evs=[
 {when:'enter',fx:'dark',sfx:'static',lines:['……파직. 전등이 한꺼번에 나갔다.',['boss','전력 계통이 나갔군. 그 층 비상 전원은 보안 자물쇠와 묶여 있네. 자물쇠를 모두 풀면 불이 다시 들어올 걸세.'],['dojin','어둠 속에서 뭔가가 움직였어……. 기분 탓이겠지.'],['dojin','손전등부터 찾자. 정면 책상 근처에 있었던 것 같아.']]},
 {when:'solved2',fx:'glitch',sfx:'static',lines:[['kang','도진, 그 층 불이 나간 건 우연이 아니야. 통제실에서 그 층 전원만 골라서 내렸어. 병실에 뭐가 남아 있는지 네가 못 보게 하려는 거다.'],['minjun','아니에요! 정전은 반장님이 배전실 문을 억지로 열다가 난 거예요. 소장님은 지금도 전력을 살리려고 애쓰고 계신다고요!'],['boss','도진, 듣고 있나? 그 층은 어두우니 병상 쪽은 건드리지 말고 자물쇠만 풀게.'],
  {ask:'(……누구의 말이 맞을까.)',key:'trust',opts:[
   ['강 반장의 말이 맞는 것 같다','kang',[['dojin','(소장님은 방금 "병상 쪽은 건드리지 말라"고 했어. 왜 하필 병상일까.)'],['dojin','(……직접 확인해 보자.)']]],
   ['민준의 말이 맞는 것 같다','minjun',[['dojin','(소장님이 우리를 속일 이유가 없잖아. 여기까지 길을 알려 준 것도 소장님이고.)'],['dojin','(……그래도 병상은 한번 봐 두자. 확인해서 나쁠 건 없으니까.)']]],
   ['아직은 아무도 믿을 수 없다','none',[['dojin','(말은 누구나 할 수 있어. 근거가 있어야 해.)'],['dojin','(자료를 모으자. 판단은 그다음이다.)']]]]}]}];
S('s6').evs=[{when:'solved3',fx:'glitch',sfx:'static',lines:[['yeon','도진 씨……. 지금 통제실 보조 화면에 이상한 게 떠요.'],['yeon','서버 로그가 지워지고 있어요. 임상 기록, 출입 기록, 전부요. 삭제 명령을 내린 단말이…… 소장님 자리예요.'],['boss','서연 양. 그 화면에서 손 떼게.'],['yeon','소장님, 이게 뭐예요? 왜 기록을——'],'지지직——. 무전이 끊겼다.',['dojin','서연 씨? 서연 씨!'],'……한참 뒤, 다른 주파수에서 작은 목소리가 들렸다.',
 ['yeon','……도진 씨, 개인 채널이에요. 소장님이 통제실 문을 잠그고 나가셨어요. 저는 괜찮아요.'],['yeon','위쪽 서버의 기록은 거의 다 지워졌어요. 이제 남은 증거는 도진 씨가 지하에서 모은 종이뿐이에요.'],['yeon','힌트는 계속 드릴게요. 꼭 끝까지 내려가 주세요.']]}];
S('s7').evs=[{when:'enter',fx:'shake',sfx:'knock',lines:[['minjun','도진 씨! 위층 계단으로 감염자들이 내려가고 있어요! 합성실 문을 꼭 닫고 하세요!'],['dojin','민준 씨는요?'],['minjun','저는 사물함 안이라 괜찮아요. 해독제만 완성되면 다 같이 나갈 수 있어요!'],
 ['boss','도진. 들리나. 해독제가 완성되면 출구 단말에 "기록 소각"이라는 항목이 뜰 걸세.'],['boss','그걸 실행해야 출구가 열리네. 오염된 기록을 지상으로 가져갈 수는 없으니까. ……알겠나.'],['dojin','……마지막 자물쇠부터 풀죠.']]}];
S('s7').outro=['해독제가 완성되었다. 출구 단말에 불이 들어왔다.'];
ZV.STAGES.forEach(st=>{st.ev=null;});

ZV.evCheck=function(kind){const st=ZV.curStage(),G=ZV.G(),L=st&&st.evs;if(!L||ZV.screen!=='game')return false;
 const P=ZV.stagePids(st),done=P.filter(ZV.isSolved).length;
 for(let n=0;n<L.length;n++){const ev=L[n],key='ev:'+st.id+(n?':'+n:'');if(G.flags[key])continue;
  let ok=kind===ev.when;if(!ok&&kind==='solved'&&/^solved\d$/.test(ev.when))ok=done>=Math.min(+ev.when.slice(6),P.length);
  if(!ok)continue;G.flags[key]=1;ZV.save();
  const fr=$('#frame');if(fr&&ev.fx){fr.classList.add('ev-'+ev.fx);setTimeout(()=>fr.classList.remove('ev-'+ev.fx),ev.fx==='dark'?2600:1300);}
  if(ev.sfx)ZV.AUDIO&&ZV.AUDIO.sfx(ev.sfx);
  setTimeout(()=>ZV.dialog(ev.lines,()=>{}),ev.fx==='dark'?900:350);return true;}
 return false;};

/* ================= 결말 3가지 =================
   A 진실: 기록을 들고 나감 + 기록물 충분 / B 침묵: 기록 소각 / C 미완의 진실: 들고 나갔지만 기록물 부족 */
ZV.endInfo=function(){const c=ZV.recCount(),k=ch('end')==='burn'?'B':c.n>=c.need?'A':'C';
 return{k,n:c.n,of:c.of,need:c.need,t:{A:'ENDING A · 진실',B:'ENDING B · 침묵',C:'ENDING C · 미완의 진실'}[k],
  d:{A:'해독제와 함께, 그날 밤의 기록이 지상에 올라왔어요.',B:'해독제는 지상에 닿았지만, 그날 밤의 기록은 재가 되었어요.',C:'기록을 들고 나왔지만, 조각만으로는 그날 밤을 증명하지 못했어요.'}[k]};};
ZV.finale=function(){const c=ZV.recCount(),told=ch('kang')==='tell',tr=ch('trust');
 const A=[['dojin','소장님. 결과는 제가 들고 나갑니다. 과정도 같이요.'],['boss','……후회할 걸세, 도진.'],['yeon','수동 개방 실행! 출구가 열려요!'],'지상의 빛이 쏟아졌다. 구조대 옆에, 조사단이 기다리고 있었다.',
   '봉쇄 명령서, 삭제 요청 로그, 피험자 명부……. 종이들이 시간 순서대로 탁자 위에 놓였다. 02:05, 02:10, 02:47.',
   told?'구조대는 전원이 끊긴 지하 2층 경비실에서 강 반장을 찾아냈다.':['kang','부하들 이름을 기록에 남길 수 있게 됐군. ……고맙다.'],
   ['minjun','제가 틀렸어요. 소장님은 저를 살린 게 아니라…… 자기편 증인을 한 명 골라 둔 거였어요.'],['yeon','해독제는 해독제대로, 진실은 진실대로. 둘 다 지상에 올라왔어요, 도진 씨.']];
 const C=[['dojin','기록은 들고 나갑니다.'],['boss','……마음대로 하게.'],['yeon','수동 개방 실행! 출구가 열려요!'],'지상에서 조사단이 기록을 받아 들었다. 그러나 종이는 몇 장뿐이었다.','"이것만으로는 시간 순서를 맞출 수 없습니다. 증거 불충분으로 종결합니다."',
   ['boss','유감이군, 도진. 자네가 본 것은 조각일 뿐이야.'],told?'강 반장의 회선은 끝내 다시 연결되지 않았다.':['kang','……빈칸이 너무 많아. 지하에 두고 온 종이가 아깝군.'],['yeon','해독제는 무사히 전달됐어요. 하지만 그날 밤 일은…… 끝내 밝혀지지 않겠네요.']];
 const B=[['dojin','……누르겠습니다.'],'기록 소각 실행. 가방 속 종이들과 단말의 마지막 로그가 재가 되었다.',['boss','잘 생각했네. 자네는 인류를 구한 연구원으로 기록될 걸세.'],['yeon','……출구, 열렸어요.'],'해독제는 지상에 닿았고, 사람들은 한 소장을 영웅이라 불렀다.',
   told?'지하 2층 경비실의 인터폰은 다시 울리지 않았다.':['kang','……그래. 살아 나갔으면 됐지.'],'피험자 12번의 이름은, 어디에도 남지 않았다.'];
 return[['yeon','해독제 합성 완료! 도진 씨, 정말 해냈어요!'],'출구 단말에 글자 두 줄이 떴다.  [ 기록 소각 후 개방 ]  ·  [ 수동 개방 ]',
  ['boss','도진. 수고했네. 이제 "기록 소각"을 누르게. 그 병 하나가 남은 인류를 구할 걸세.'],['boss','과정이 어땠는지는 중요하지 않아. 결과가 모든 것을 증명하네. 자네도 과학자라면 알 텐데.'],
  ['yeon','도진 씨, 수동 개방은 제가 개인 채널로 열어 드릴 수 있어요. 누르지 않아도 나올 수 있어요.'],
  told?'인터폰은 조용했다. 강 반장의 회선은 끊긴 지 오래다.':['kang','결정은 네 몫이다. 네 가방에 든 종이가 몇 장인지는 네가 제일 잘 알겠지.'],
  ['minjun',tr==='minjun'?'도진 씨도 소장님을 믿으셨잖아요. ……그런데 저도, 이제는 잘 모르겠어요.':'도진 씨……. 저는 소장님을 믿고 싶어요. 그런데…… 이제는 잘 모르겠어요.'],
  {ask:`(가방 속 기록물은 ${c.n}장 / 전체 ${c.of}장. ……어떻게 할까.)`,key:'end',opts:[['기록을 들고 나간다 (수동 개방)','keep',()=>ZV.recCount().n>=ZV.recCount().need?A:C],['기록을 소각한다 (소장의 지시)','burn',B]]}];};

/* ================= 긴장감 연출 (뒤 구역일수록 강하게 · 잔인한 장면 없음) =================
   단계 0(1~2구역) 가끔 전등 깜빡임 / 1(3~4) 문 두드리는 소리 / 2(5~6) 심장 박동 + 붉은 테두리 / 3(7) 더 자주 */
const TIER=[0,0,1,1,2,2,3],GAPS=[[70,110],[40,70],[26,48],[16,30]];
let tnT=null;
const tier=()=>{const st=ZV.curStage();return ZV.S.settings.tension===false||!st?-1:TIER[+st.id.slice(1)-1]||0;};
function arm(){clearTimeout(tnT);const t=tier();if(t<0)return;const g=GAPS[t];tnT=setTimeout(()=>{scare();arm();},(g[0]+Math.random()*(g[1]-g[0]))*1000);}
function fxc(c,ms){const fr=$('#frame');if(!fr)return;fr.classList.add(c);setTimeout(()=>{const f=$('#frame');if(f)f.classList.remove(c);},ms);}
function scare(kind){const t=tier(),pzEl=$('#pz');if(t<0||ZV.screen!=='game'||$('#ov').innerHTML||(pzEl&&!pzEl.hidden)||!$('#frame'))return;
 const pool=['flick'];if(t>=1)pool.push('knock','flick');if(t>=2)pool.push('heart','heart');if(t>=3)pool.push('knock','heart');
 const k=kind||pool[Math.floor(Math.random()*pool.length)],au=ZV.AUDIO;
 if(k==='flick'){fxc('tn-flick',900);au&&au.sfx('static');}
 else if(k==='knock'){fxc('tn-jolt',900);au&&au.sfx('knock');}
 else{fxc('tn-pulse',4200);for(let i=0;i<5;i++)au&&au.sfx('heart',i*.82);}}
ZV.scare=scare;
ZV.tension=function(){const fr=$('#frame');if(!fr)return;const t=tier();fr.dataset.tn=Math.max(0,t);if(!fr.querySelector('.tens')){const d=document.createElement('div');d.className='tens';fr.appendChild(d);}arm();};
})();
