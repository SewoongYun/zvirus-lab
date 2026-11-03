/* 좀비바이러스 연구실 — 장면(이미지 배경, 폰 세로 3:4)·스테이지·무전 대화·아이템·MAP (7차)
   · 배경 그림은 img 폴더, 눌러 볼 곳 좌표는 js/imgs.js. 이 파일은 그 위에 문 표시등·손전등·빛 번짐 같은 "변하는 것"만 겹쳐 그린다. */
(function(){
'use strict';
const ZV=window.ZV,{$,esc,clamp}=ZV;
const hs=(a,b)=>{let h=(a*374761393+b*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;};

/* ================= 이야기 ================= */
const STAGES=[
 {id:'s1',ch:1,chName:'1장 · 보안 구역 (경우의 수)',name:'보안 격리실',pids:['c1a','c1b','c1c','c1d','c1e'],
  intro:['……차갑다. 비상등이 붉게 깜빡인다.',['dojin','여긴…… 보안 격리실이군. 문은 잠겼고, 벽마다 소장님의 수학 자물쇠가 달려 있어.'],['dojin','책상, 캐비닛, 보관함……. 어딘가에 열쇠가 있을 거다.']],
  outro:['격벽이 천천히 열렸다. 더 깊은 곳으로 내려가는 통로가 보인다.']},
 {id:'s2',ch:1,name:'서버·기록실',pids:['c2a','c2b','c2c','c2d'],
  intro:['서버 팬이 멈춘 방. 먼지와 끊어진 케이블뿐이다.',['dojin','이번 철문엔 열쇠 구멍이 없어. 숫자 키패드뿐이야.'],['dojin','기록 어딘가에 소장님의 암호가 남아 있을 거야.']],
  outro:['서버실의 마지막 격벽이 열렸다.'],
  after:[['yeon','첫 번째 구역을 통과했어요! 아직 아무도 안 쫓아오고 있어요.'],['dojin','……아직은, 이겠지. 다음은 어디죠?'],['boss','감염 진단 구역이다. 확률로 감염 여부를 가려내는 시스템이지.'],['yeon','진단 키트, 추첨기……. 막히면 무전 주세요!']]},
 {id:'s3',ch:2,chName:'2장 · 감염 진단 구역 (확률)',name:'감염 관찰실',pids:['c3a','c3b','c3c','c3d'],
  intro:['서리 낀 유리 너머에 무언가 서 있다……. 움직이지는 않는다.',['dojin','문 표시등이 꺼져 있어. 전원이 나간 모양이야.'],['dojin','관찰실의 보안은 확률 자물쇠다. 침착하게 풀고, 전원부터 살리자.']],
  outro:['관찰실의 문이 열렸다. 안쪽으로 진단 센터가 이어진다.']},
 {id:'s4',ch:2,name:'진단 센터',pids:['c4a','c4b','c4c','c4d'],
  intro:['검사 장비가 모두 꺼져 있다. 마지막 검사 결과가 화면에 남아 있다.',['dojin','문 옆에 검체 분석기가 붙어 있어. 시료병을 꽂아야 열리는 문이군.'],['dojin','우연처럼 보여도, 그 속에는 규칙이 있어.']],
  outro:['안쪽 격벽이 열렸다. 아래층에서 희미한 초록빛이 새어 올라온다.'],
  after:[['yeon','진단 구역 통과! 이제 마지막 분석 구역이 남았어요.'],['boss','임상시험동, 데이터 분석실, 그리고 해독제 합성실이다. 통계를 알아야 길이 열리지.'],['dojin','열쇠고리가 꽤 무거워졌네요. 조금만 더 가 보죠.'],['yeon','조금만 더 힘내요. 힌트는 언제든 무전으로!']]},
 {id:'s5',ch:3,chName:'3장 · 임상·분석 구역 (통계)',name:'임상시험동 1층',pids:['c5a','c5b','c5c','c5e','c5d'],
  intro:['빈 병실. 가죽 결박 끈이 풀려 있는 침대가 보인다.',['dojin','……여기서 시험을 했던 건가. 문은 쇠사슬로 칭칭 감겨 있어.']],
  outro:['임상시험동의 문이 열렸다.']},
 {id:'s6',ch:3,name:'데이터 분석실',pids:['c6a','c6b','c6e','c6c','c6d'],
  intro:['초록빛 화면마다 종 모양 곡선이 떠 있다.',['dojin','표본을 모으면 전체를 알 수 있다……. 소장님 입버릇이었지.'],['dojin','문에는 레버가 네 개. 저 대형 화면은 꺼져 있고……. 데이터가 필요하겠어.']],
  outro:['분석실의 문이 열렸다. 마지막 구역으로 가는 길이다.']},
 {id:'s7',ch:3,name:'해독제 합성실',pids:['c7a','c7b'],
  intro:['합성 탱크가 초록빛으로 끓고 있다.',['dojin','마지막 자물쇠다. 원액을 모아 저 탱크에서 합성하면 해독제가 완성된다.'],['dojin','출구는 완성된 해독제를 인증해야 열린다고 했지.']],
  outro:['해독제가 완성되었다. 탈출 통로가 열렸다!']}
];
ZV.STAGES=STAGES;
/* 12차(피드백: 방마다 금고·열쇠로만 느껴짐 → 방마다 다른 사건 · 새 인물): 구역마다 한 번씩 일어나는 사건.
   when: 'enter'(도입 독백 뒤) | 'wall1'·'wall2'(그 벽을 처음 볼 때) | 'solved2'·'solved3'(그 방 자물쇠를 n개 풀었을 때)
   fx: 화면 효과 shake(흔들림+붉은 번쩍) / dark(정전) / glitch(화면 잡음) / sfx: 효과음 */
const EVENTS={
 s1:{when:'wall1',fx:'shake',sfx:'door',lines:[['dojin','……방금, 환기구 안에서 뭔가 긁는 소리가?'],['yeon','도진 씨? 무슨 소리예요?'],['dojin','……아무것도 아니길 바라야지. 서두르자.']]},
 s2:{when:'solved2',fx:'glitch',lines:['꺼져 있던 서버 모니터 하나가 지지직 켜졌다. 녹화 기록이 재생된다.',['rec','……기록 1347. Z-Virus 감염체가 규칙적인 패턴에 반응한다. 무작위가 아니다. 확률로 읽힌다.'],['rec','그래서 보안 장치를 수학으로 잠갔다. 감염체는 계산을 하지 못하니까.'],['dojin','소장님 목소리……. 이래서 자물쇠가 전부 수학이었군.']]},
 s3:{when:'wall2',fx:'shake',sfx:'door',lines:['쾅!',['zomb','그르르…… 크아아악!'],['dojin','……!! 유리 너머에서 감염자가 유리를 두드리고 있어!'],['yeon','괜찮아요?! 관찰실 유리는 강화유리예요. 버틸 거예요……. 아마도.'],['dojin','"아마도"라니……. 빨리 풀고 나가자.']]},
 s4:{when:'solved2',fx:'glitch',lines:['검사 장비 뒤 사물함에서 덜컹, 소리가 났다.',['minjun','쏘, 쏘지 마세요! 사람이에요! 저 감염 안 됐어요!'],['dojin','생존자……? 이름이 뭐죠?'],['minjun','인턴 연구원 민준이에요. 봉쇄될 때 여기 숨어 있었어요. 다리를 다쳐서 더는 못 걸어요.'],['minjun','대신…… 아래층 구조는 제가 알아요. 무전 채널을 맞춰 둘게요. 길이 막히면 알려 드릴게요.'],['yeon','민준 씨, 들려요? 통제실 서연이에요. 거기 그대로 있어요. 구조대가 갈 거예요.']]},
 s5:{when:'enter',fx:'dark',lines:['……파직. 전등이 한꺼번에 나갔다.',['boss','전력 계통이 나갔군. 그 층 비상 전원은 보안 자물쇠와 묶여 있네. 자물쇠를 모두 풀면 불이 다시 들어올 걸세.'],['dojin','어둠 속에서 뭔가가 움직였어……. 기분 탓이겠지.'],['dojin','손전등부터 찾자. 정면 책상 근처에 있었던 것 같아.']]},
 s6:{when:'solved3',fx:'glitch',lines:[['yeon','도진 씨…… 통제실 문을 누가…… 두드려요……. 지지직……'],['boss','서연, 뒤로 물러나! 격벽 닫아!'],['dojin','서연 씨? 소장님?! 대답해요!'],'……잠시 뒤, 무전이 다시 이어졌다.',['yeon','……괜찮아요. 격벽이 버텼어요. 하지만 시간이 별로 없어요. 서둘러 주세요!']]},
 s7:{when:'enter',fx:'shake',sfx:'door',lines:[['minjun','도진 씨! 위층 계단으로 감염자들이 내려가고 있어요! 합성실 문을 꼭 닫고 하세요!'],['dojin','민준 씨는요?'],['minjun','저는 사물함 안이라 괜찮아요. 해독제만 완성되면 다 같이 나갈 수 있어요!'],['dojin','……알았어요. 마지막이다.']]}};
STAGES.forEach(st=>{st.ev=EVENTS[st.id];});
/* 11차: 대화 장면에 나오는 인물. img 가 있으면 검은방처럼 초상화가 뜨고, 없으면 "SOUND ONLY" 무전 화면.
   12차: 민준·감염자 초상화(img/ch_minjun.png, ch_zombie.png — z_image 로 생성, 초상화만들기.ps1 -edge 로 배경 제거). cls 는 초상화에 붙는 효과 클래스 */
ZV.CAST={dojin:{n:'도진',c:'#e8f2e4',img:'img/ch_dojin.png',side:'l'},yeon:{n:'서연',c:'#7be04a',img:'img/ch_seoyeon.png',side:'r',radio:1},boss:{n:'한 소장',c:'#ffd84a',side:'r',radio:1},
 rec:{n:'한 소장 (녹화 기록)',c:'#9fd3ff',side:'r',tag:'녹화',sonly:'RECORD 1347'},
 zomb:{n:'???',c:'#ff6b5b',side:'r',img:'img/ch_zombie.png',cls:'zomb',tag:'감염자'},
 minjun:{n:'민준',c:'#9fd3ff',side:'r',img:'img/ch_minjun.png',tag:'생존자'}};
ZV.RADIO=ZV.CAST;
ZV.PROLOGUE=[['dojin','……으. 머리가 깨질 것 같다. 여긴…… 지하 격리실인가?'],['boss','도진 연구원, 들리나? 연구동이 봉쇄됐다. Z-Virus가 지하 1층까지 올라왔어.'],['yeon','도진 씨, 무사했군요! 저 서연이에요. 소장님과 지상 통제실에서 무전 연결했어요.'],['yeon','해독제 합성실까지는 일곱 개 구역이에요. 구역마다 소장님이 만든 보안 자물쇠가 잠겨 있어요.'],['boss','수학으로 풀어야 열린다. 데이터를 읽을 줄 아는 사람만 지나가게 설계했지.'],['dojin','……하필 수학이라니. 좋아요, 해 보죠.'],['yeon','구역마다 문을 여는 장치가 달라요. 열쇠, 비밀번호, 퓨즈, 시료병……. 소장님이 일부러 다 다르게 만들었대요.'],['yeon','찾은 물건은 허리춤 열쇠고리에 걸어 두세요. 쓸 때는 아래 칸에서 골라 들고, 쓸 곳을 누르면 돼요.'],['yeon','막히면 제가 무전으로 힌트를 드릴게요. 조금 기다려야 하지만요.'],['boss','행운을 비네, 도진.']];
ZV.EPILOGUE=[['yeon','해독제 합성 완료! 도진 씨, 정말 해냈어요!'],['dojin','……하아. 이걸로 끝, 인 거죠?'],['boss','Z-Virus의 백신이다. 이 한 병이 인류의 남은 10%를 구할 걸세.'],['minjun','도진 씨! 구조대가 진단 센터까지 왔어요. 저도 같이 올라갈게요!'],['yeon','출구가 열렸어요. 이제 다 같이 지상으로 올라와요, 도진 씨!']];

/* ================= 한 방의 3개 벽 (구경거리·문제 자물쇠의 위치는 imgs.js) ================= */
const ROLES=['desk','shelf','chest','alcove','ext'];
const LOOKTXT={chest:'굳게 잠긴 철제 보관함이다. 지금은 열 필요가 없을 것 같다.',alcove:'어두운 환기구다. 안쪽에는 아무것도 없다.',desk:'낡은 책상이다. 쓸 만한 것은 없다.',shelf:'먼지 쌓인 캐비닛이다. 쓸 만한 것은 없다.',ext:'빈 상자와 통뿐이다.'};
/* ================= 13차: 구역마다 문 여는 방식이 다르다 =================
   피드백 "열쇠 찾고 앰플 찾는 게 반복" → 수학 자물쇠(문항)는 그대로 두고, 푼 뒤 얻는 물건과 문을 여는 장치를 구역마다 바꾼다.
   s1 classic : 서랍 열쇠 → 보관함, 앰플 조각 → 철문 장착부 (튜토리얼, 12차와 같음)
   s2 code    : 자물쇠마다 쪽지 "암호 n번째 자리 = 이 정답의 일의 자리" → 철문 키패드에 직접 입력
   s3 power   : 자물쇠마다 퓨즈 → 왼쪽 벽 비상 배전반에 꽂아 전원 복구 → 전기 잠금 문
   s4 order   : 자물쇠마다 시료병(라벨 = 그 문항의 확률) → 검체 분석기에 '확률이 낮은 것부터' 꽂기 (틀리면 전부 튕겨 나옴)
   s5 dark    : 정전 — 손전등 없이는 아무것도 못 만짐 · 절단기 날 + 손잡이를 열쇠고리에서 조합 → 문의 쇠사슬 절단
   s6 lever   : 자물쇠마다 데이터 칩 → 대형 화면에 넣으면 막대그래프 → 평균보다 큰 막대는 레버 ▲ → 문 레버 4개 맞추기
   s7 brew    : 자물쇠마다 해독제 원액 → 합성 탱크에 붓고 합성 → 완성된 해독제로 출구 인증 */
const MECH={s1:'classic',s2:'code',s3:'power',s4:'order',s5:'dark',s6:'lever',s7:'brew'};
ZV.mech=st=>MECH[st.id]||'classic';
const TGT={power:'d2',lever:'d1',brew:'d1'};   /* 문이 아니라 물건을 넣는 곳 (구경거리 자리를 장치로 바꿔 쓴다) */
const ALLOW={classic:['key','piece'],code:['memo'],power:['fuse'],order:['v0','v1','v2','v3','v4'],dark:['blade','grip','cutter'],lever:['chip'],brew:['serum','antidote']};
const TGTTXT={power:'점검창 옆 비상 배전반',lever:'대형 분석 화면',brew:'해독제 합성 탱크'};
ZV.wallsFor=function(st){const pids=ZV.stagePids(st),pidOf={},m=ZV.mech(st),tg=TGT[m];ROLES.forEach((r,i)=>{if(pids[i])pidOf[r]=pids[i];});
 const hasKey=m==='classic'&&pids.length>=3;
 const pz=(role,need)=>({id:role+st.id,role,act:pidOf[role]?{k:'pz',pid:pidOf[role],need,role}:{k:'look',text:LOOKTXT[role]}});
 const look=r=>({id:r,role:r,act:r===tg?{k:'tgt'}:{k:'look'}});
 const walls=[
  {name:'정면',props:[{id:'door',role:'door',act:{k:'door'}},pz('desk',null),{id:'lamp',role:'lamp',act:{k:'lamp'}},look('d1')]},
  {name:'왼쪽 벽',props:[pz('shelf',null),look('d2'),pz('alcove','lamp')]},
  {name:'오른쪽 벽',props:[pz('chest',hasKey?'key':null),look('d3'),pidOf.ext?pz('ext',null):look('d4')]}];
 return{walls,pidOf,hasKey};};

/* ================= 상태 도우미 ================= */
ZV.curStage=function(){const L=ZV.stages(),G=ZV.G();G.si=clamp(G.si,0,L.length-1);return L[G.si];};
const hasItem=id=>ZV.G().items.includes(id);
const addItem=id=>{ZV.G().items.push(id);};
const delItem=id=>{const it=ZV.G().items,i=it.indexOf(id);if(i>=0)it.splice(i,1);};
const ITEM={lamp:{n:'손전등',d:'허리에 찬 손전등. 가지고 있으면 어두운 곳이 보인다.'},key:{n:'보관함 열쇠',d:'철제 보관함의 열쇠 구멍에 맞을 것 같다. 들고 보관함을 눌러 꽂아 보자.'},piece:{n:'해독제 앰플 조각',d:'정면 철문의 장착부에 끼워 넣는 조각이다. 들고 문을 눌러 끼워 보자.'},
 memo:{n:'암호 메모',d:()=>memoLines(ZV.curStage()).join(' / ')},
 fuse:{n:'예비 퓨즈',d:'배전반에 꽂는 유리 퓨즈다. 들고 왼쪽 벽 배전반을 눌러 꽂아 보자.'},
 blade:{n:'절단기 날',d:'손잡이가 빠진 절단기 날. 이것만으론 쓸 수 없다. 손잡이와 합쳐 보자.'},grip:{n:'절단기 손잡이',d:'날이 빠진 절단기 손잡이. 날과 합쳐 보자. (하나를 든 채 다른 하나를 누르기)'},
 cutter:{n:'절단기',d:'쇠사슬도 끊을 수 있을 것 같다. 들고 문을 눌러 보자.'},
 chip:{n:'데이터 칩',d:'분석 화면에 꽂는 데이터 칩. 들고 정면의 대형 화면을 눌러 보자.'},
 serum:{n:'해독제 원액',d:'합성 탱크에 부을 원액. 들고 정면의 탱크를 눌러 보자.'},
 antidote:{n:'완성된 해독제',d:'초록빛으로 빛나는 해독제. 들고 출구 문을 눌러 인증하자.'}};
/* 시료병 A~E (4구역): 라벨 = 그 자물쇠 문항의 확률 */
const VCOL=['#e0584a','#4aa3e0','#e8d04a','#b07be0','#e6f0ea'],VL='ABCDE';
VL.split('').forEach((L,i)=>{ITEM['v'+i]={n:'시료병 '+L,d:()=>`라벨: 감염 확률 ${vialP(ZV.curStage(),i).t}. 분석기에는 확률이 낮은 것부터 꽂아야 한다.`};});
ZV.ITEM=ITEM;
ZV.itemDesc=id=>{const d=ITEM[id].d;return typeof d==='function'?d():d;};
/* 문항의 정답 (교사가 값을 바꿔도 그 값으로 계산) */
const ansOf=pid=>{try{return ZV.RM[pid].build(ZV.getParams(pid)).ans;}catch(e){return{kind:'int',v:0};}};
const nOf=st=>ZV.stagePids(st).length;
const solvedCount=st=>ZV.stagePids(st).filter(ZV.isSolved).length;
/* 2구역 키패드: n번째 자리 = n번째 자물쇠 정답의 일의 자리 */
const codeOf=st=>ZV.stagePids(st).map(pid=>(ZV.ansPlain(ansOf(pid)).replace(/\D/g,'').slice(-1)||'0')).join('');
function memoLines(st){return ZV.stagePids(st).map((pid,i)=>ZV.isSolved(pid)?`${i+1}번째 자리 ← '${ZV.RM[pid].name}' 정답 ${ZV.ansPlain(ansOf(pid))}의 일의 자리`:`${i+1}번째 자리: ?`);}
/* 4구역 시료병 라벨 */
function vialP(st,i){const pid=ZV.stagePids(st)[i];if(!pid)return{x:0,t:'?'};const a=ansOf(pid);return a.kind==='pq'?{x:a.p/a.q,t:`${a.p}/${a.q}`}:{x:a.v,t:ZV.ansPlain(a)};}
/* 6구역 레버: 이름마다 다른 무늬(옆 친구 답을 그대로 베끼지 못하게). 막대 값의 평균 m은 정수, 어떤 막대도 m과 같지 않다 */
function leverSet(st){const nm=(ZV.S.cur||'')+st.id;let h=2166136261;for(const c of nm)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;
 const pat=[0,1,2,3].map(i=>hs(h%9973,i+11)<.5);if(pat.every(x=>x)||pat.every(x=>!x))pat[h%4]=!pat[(h%4+1)%4];
 const m=18+h%17,dev=pat.map((u,i)=>u?0:-(3+Math.floor(hs(h%7919,i+3)*7))),D=-dev.reduce((a,b)=>a+b,0),ups=pat.filter(x=>x).length,base=Math.floor(D/ups);let first=true;
 pat.forEach((u,i)=>{if(u){dev[i]=base+(first?D-base*ups:0);first=false;}});
 const U=pat.map((u,i)=>u?i:-1).filter(i=>i>=0);if(U.length>=2&&dev[U[1]]>=3){dev[U[0]]+=2;dev[U[1]]-=2;}   /* 위 막대끼리도 값이 달라 보이게 */
 return{pat,m,vals:dev.map(d=>m+d)};}
const lvState=st=>{const F=ZV.G().flags,k='lv:'+st.id;if(!Array.isArray(F[k]))F[k]=[false,false,false,false];return F[k];};
const blackout=st=>ZV.mech(st)==='dark'&&!ZV.stageDone(st);
/* 받침에 맞는 조사: ZV.jo('열쇠','을','를') → '열쇠를' */
ZV.jo=(w,a,b)=>{const c=w.charCodeAt(w.length-1)-0xAC00;return w+(c>=0&&c<11172&&c%28?a:b);};
/* 11차: 앰플 조각은 들고 문을 눌러 직접 끼운다. need = 그 방에서 나오는 조각 수(책상 문제는 열쇠를 주므로 빠짐), ins = 끼운 수 */
const cntItem=id=>ZV.G().items.filter(x=>x===id).length;
ZV.pieceNeed=st=>ZV.stagePids(st).length-(ZV.wallsFor(st).hasKey?1:0);
ZV.pieceIns=st=>Math.min(ZV.G().flags['ins:'+st.id]||0,ZV.pieceNeed(st));
/* 13차: 문이 열렸는지. 'door:' 플래그는 키패드·분석기·레버·해독제 인증에 성공했거나 그 방을 통과했을 때 */
ZV.doorOpen=st=>{const F=ZV.G().flags,m=ZV.mech(st);if(F['door:'+st.id])return true;if(!ZV.stageDone(st))return false;
 if(m==='classic')return ZV.pieceIns(st)>=ZV.pieceNeed(st);if(m==='power')return !!F['pow:'+st.id];if(m==='dark')return !!F['chain:'+st.id];return false;};
/* 이전 차수 기록(조각이 자동으로 끼워지던 방식)이나 MAP 이동으로 조각이 모자라 막히지 않게: 다 푼 방인데 들고 있는 조각으로도 못 채우면 채운 것으로 본다 */
ZV.insFix=function(st){const G=ZV.G(),need=ZV.pieceNeed(st),ins=ZV.pieceIns(st);if(ZV.stageDone(st)&&ins<need&&cntItem('piece')<need-ins){G.flags['ins:'+st.id]=need;ZV.save();}};
/* 13차: 12차 이하 기록 이어하기 — 예전 방식으로 문까지 연 방은 연 것으로, 풀었지만 새 물건을 못 받은 자물쇠는 새 물건을 준다. 예전 열쇠·조각은 (한 번만) 정리 */
ZV.fixStage=function(st){const G=ZV.G(),F=G.flags,m=ZV.mech(st),pids=ZV.stagePids(st),id=st.id;let ch=false;
 if(m==='classic'){ZV.insFix(st);pids.forEach(p=>{if(ZV.isSolved(p)&&!F['rw:'+p]){F['rw:'+p]=1;ch=true;}});}
 else{const oldNeed=pids.length-(pids.length>=3?1:0);if(!F['door:'+id]&&ZV.stageDone(st)&&(F['ins:'+id]||0)>=oldNeed){F['door:'+id]=1;ch=true;}
  if(!F.v13){const n0=G.items.length;G.items=G.items.filter(x=>x!=='key'&&x!=='piece');if(G.items.length!==n0)ch=true;if(G.sel&&!G.items.includes(G.sel))G.sel=null;}
  pids.forEach(p=>{if(ZV.isSolved(p)&&!F['rw:'+p]){if(F['door:'+id])F['rw:'+p]=1;else grant(st,p);ch=true;}});}
 if(!F.v13){F.v13=1;ch=true;}
 if(ch)ZV.save();};
/* 자물쇠를 풀면 받는 것 (구역마다 다름). 받은 자물쇠는 'rw:' 표시 → 다시 주지 않음. 돌려주는 값 = 나레이션 줄 */
const STORY5=['바닥에 떨어진 환자 기록: "피험자 12번 — 잠복기 평균 3.2일. 밤사이 결박을 풀고 사라짐."','찢어진 기록지: "치사율이 아니라 전염률이 문제다. 한 명이 평균 몇 명을 감염시키는가……."','손으로 쓴 메모: "분포를 알면 막을 수 있다. 우리에겐 시간이 없을 뿐." — 한 소장'];
function grant(st,pid){const G=ZV.G(),F=G.flags,m=ZV.mech(st),W=ZV.wallsFor(st),role=Object.keys(W.pidOf).find(r=>W.pidOf[r]===pid),pids=ZV.stagePids(st),idx=pids.indexOf(pid);
 const prev=pids.filter(p=>p!==pid&&F['rw:'+p]).length;F['rw:'+pid]=1;
 if(m==='classic'){if(role==='desk'&&W.hasKey){addItem('key');return['서랍 안에서 작은 놋쇠 열쇠를 찾았다. 허리춤 열쇠고리에 걸었다.',['dojin','오른쪽 벽의 철제 보관함 열쇠일 거야.']];}addItem('piece');return['해독제 앰플 조각을 손에 넣었다. 열쇠고리 주머니에 넣었다.'];}
 if(m==='code'){if(!hasItem('memo'))addItem('memo');return[`자물쇠 안쪽에 쪽지가 붙어 있다. "철문 암호 ${idx+1}번째 자리 = 이 자물쇠 정답의 일의 자리"`,['dojin',`이 자물쇠 정답은 ${ZV.ansPlain(ansOf(pid))}였지. 암호 메모에 적어 두자.`]];}
 if(m==='power'){addItem('fuse');return['자물쇠 안쪽에서 예비 퓨즈를 찾았다. 열쇠고리 주머니에 넣었다.'].concat(prev?[]:[['dojin','왼쪽 벽 점검창 옆에 배전반이 있었지. 퓨즈를 꽂으면 전원이 돌아올 거야.']]);}
 if(m==='order'){addItem('v'+idx);return[`잠금이 풀리며 시료병 ${VL[idx]}가 나왔다. 라벨: "감염 확률 ${vialP(st,idx).t}"`].concat(prev?[]:[['dojin','라벨의 확률이 방금 내가 구한 답이군. 잘 기억해 두자.']]);}
 if(m==='dark'){if(pids.length===1){addItem('cutter');return['자물쇠 안쪽에서 절단기를 찾았다!'];}
  if(prev===0){addItem('blade');return['자물쇠 안쪽에서 무거운 절단기 날을 찾았다. 손잡이가 빠져 있어 이것만으론 못 쓴다.'];}
  if(prev===1){addItem('grip');return['절단기 손잡이를 찾았다!',['dojin','아까 찾은 날과 합치면 절단기가 되겠어. 열쇠고리에서 하나를 골라 들고, 다른 하나를 눌러 보자.']];}
  return[STORY5[(prev-2)%STORY5.length]];}
 if(m==='lever'){addItem('chip');return['데이터 칩을 찾았다. 이 방의 대형 화면에 꽂는 칩 같다.'];}
 if(m==='brew'){addItem('serum');return['해독제 원액 한 병을 얻었다. 정면의 합성 탱크에 부어야 한다.'];}
 return[];}
/* 그 방 자물쇠를 다 풀었을 때 덧붙는 말 */
function doneLines(st){const m=ZV.mech(st),F=ZV.G().flags;
 if(m==='classic')return['모든 자물쇠를 풀었다.',['dojin','이제 앰플 조각을 정면 철문의 장착부에 끼워 넣으면 돼.']];
 if(m==='code')return['모든 자물쇠를 풀었다.',['dojin','암호 메모가 다 모였어. 정면 철문 키패드에 입력해 보자.']];
 if(m==='power')return F['pow:'+st.id]?['모든 자물쇠를 풀었다. 철문 표시등이 초록으로 바뀌었다!']:['모든 자물쇠를 풀었다.',['dojin','퓨즈를 왼쪽 벽 배전반에 모두 꽂으면 문에 전원이 들어올 거야.']];
 if(m==='order')return['시료병이 모두 모였다.',['dojin','분석기에는 감염 확률이 낮은 것부터 꽂으라고 했지. 라벨의 분수를 비교해 보자.']];
 if(m==='dark')return['모든 자물쇠를 풀었다. 파직— 비상등이 다시 들어왔다!'].concat(F['chain:'+st.id]?['쇠사슬도 끊어 두었으니, 문이 열렸다!']:[['dojin','이제 문의 쇠사슬만 끊으면 돼.']]);
 if(m==='lever')return['데이터 칩이 모두 모였다.',['dojin','정면 대형 화면에 칩을 넣어 보자.']];
 if(m==='brew')return['원액이 모두 모였다.',['dojin','정면의 합성 탱크에 부어 보자.']];
 return['모든 자물쇠를 풀었다.'];}
/* 열쇠고리에서 두 물건 합치기 (하나를 든 채 다른 하나를 누르기) */
const COMBO={'blade+grip':'cutter','grip+blade':'cutter'};
ZV.combine=function(a,b){const r=COMBO[a+'+'+b];if(!r)return false;const G=ZV.G();delItem(a);delItem(b);addItem(r);G.sel=null;ZV.AUDIO&&ZV.AUDIO.sfx('unlock');ZV.save();ZV.drawInv();
 ZV.say(['날을 손잡이에 끼우고 나사를 조였다. 철컥!',`${ITEM[r].n}${ZV.jo(ITEM[r].n,'을','를').slice(ITEM[r].n.length)} 완성했다.`,['dojin','이 정도면 쇠사슬도 끊을 수 있겠어.']]);return true;};

/* ================= 장면 그리기 ================= */
/* 그림이 없는 벽을 위한 최소 대체(어두운 바탕 + 눌러 볼 곳만 표시) */
const DEF_IM={src:'',sockY:.1,hot:{door:[38,22,38,70],desk:[6,70,46,50],lamp:[40,70,12,5],d1:[85,25,28,30],shelf:[0,14,50,120],alcove:[65,44,40,70],chest:[50,74,50,56],d3:[55,25,48,38],ext:[0,95,40,45],d4:[0,95,40,45]},text:{}};
const MINHIT=14;   /* 손가락으로 누르기 쉽게, 눌러 볼 곳의 최소 크기(화면 단위) */
/* ---------- 9차: 자물쇠가 풀리면 "열린 모습"을 사진 위에 겹쳐 그린다 ---------- */
const XDEFS='';
/* 열린 모습 사진: img/sN_w0_open.jpg(문 열림), img/sN_w2_open.jpg(보관함 열림)이 있으면, 해당 칸(문/보관함 주변)만 그 사진으로 부드럽게 바뀐다. 없으면 기존 사진 그대로. */
function openLayer(st,G,IM,fresh){const key=st.id+'_w'+G.wall;if(!(ZV.OPEN&&ZV.OPEN[key]))return'';let rect,on=false;
 if(G.wall===0){on=ZV.doorOpen(st);rect=IM.hot.door;}
 else if(G.wall===2){const pid=ZV.wallsFor(st).pidOf.chest;on=!!(pid&&ZV.isSolved(pid));rect=IM.hot.chest;}
 if(!on||!rect)return'';
 const pad=0,[x,y,w,h]=(ZV.OPEN_REGIONS&&ZV.OPEN_REGIONS[key])||rect;
 return`<defs><filter id="mfe" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation=".7"/></filter><mask id="mop" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="160"><rect x="${x-pad}" y="${y-pad}" width="${w+pad*2}" height="${h+pad*1.6}" rx="3" fill="#fff" filter="url(#mfe)"/></mask></defs><image class="${fresh?'fx-open':''}" href="img/${key}_open.jpg" x="0" y="0" width="120" height="160" preserveAspectRatio="xMidYMid slice" mask="url(#mop)" pointer-events="none"/>`;}/* 11차: 풀린 자물쇠 표시는 물건 한가운데에, 물건 크기에 맞춰 크게 + "해제" 글자 (예전엔 오른쪽 위 모서리에 작게 떠서 물건과 떨어져 보였음) */
function padOpen(cx,cy,fresh,s){return`<g pointer-events="none"><g transform="translate(${cx} ${cy}) scale(${s})"><circle r="4.6" fill="rgba(4,14,7,.72)" stroke="#7be04a" stroke-width=".35"/>${fresh?'<circle class="fx-ring" r="4.6" fill="none" stroke="#b6ff8a" stroke-width=".5"/>':''}<rect x="-2.2" y="-.9" width="4.4" height="3.6" rx=".7" fill="#0a1a0e" stroke="#7be04a" stroke-width=".45"/><path class="${fresh?'fx-shackle':''}" d="M-1.3 -.9v-1.7a1.3 1.3 0 0 1 2.6 0" fill="none" stroke="#7be04a" stroke-width=".55" transform="translate(1.6 -1.1)"/><circle cy=".9" r=".5" fill="#7be04a"/></g><text x="${cx}" y="${cy+4.6*s+3.4}" font-size="3.4" font-weight="800" text-anchor="middle" fill="#b6ff8a" stroke="#000" stroke-width=".7" paint-order="stroke">해제</text></g>`;}
/* 13차: 문 위에 겹쳐 그리는 장치 (구역마다 다름) */
const LED=(px,py,on,r=1.5)=>`<circle cx="${px}" cy="${py}" r="${r}" fill="${on?'#7be04a':'#2a0c0c'}" stroke="${on?'#d8ffc0':'#c0392b'}" stroke-width=".35"/>`+(on?`<circle cx="${px}" cy="${py}" r="${r*2.6}" fill="url(#gl2)" opacity=".7"/>`:'');
function doorOv(st,m,x,y,w,hh,IM,done){const F=ZV.G().flags,id=st.id,n=nOf(st),cx=x+w/2,top=y+hh*(IM.sockY||.1);let o='';
 const row=(k,on,col)=>{const sp=Math.min(5.2,(w-6)/Math.max(1,k));for(let i=0;i<k;i++){const px=cx+(i-(k-1)/2)*sp;o+=col&&col(i)?`<circle cx="${px}" cy="${top}" r="1.7" fill="${col(i)}" stroke="#fff" stroke-width=".35"/>`:LED(px,top,on(i));}};
 if(m==='classic'){const ins=ZV.pieceIns(st);row(ZV.pieceNeed(st),i=>i<ins);}
 else if(m==='code'){const P=ZV.stagePids(st),kx=x+w*.8,ky=y+hh*.45;row(n,i=>ZV.isSolved(P[i]));
  o+=`<rect x="${kx-3.6}" y="${ky-5}" width="7.2" height="10" rx=".7" fill="#0b120d" stroke="#7be04a" stroke-width=".35"/><rect x="${kx-2.8}" y="${ky-4.3}" width="5.6" height="1.5" fill="${done?'#3f9a2a':'#3a0c0c'}"/>`;
  for(let r=0;r<3;r++)for(let c=0;c<3;c++)o+=`<rect x="${kx-2.7+c*1.95}" y="${ky-2.2+r*2.3}" width="1.4" height="1.6" rx=".2" fill="#2f5a38"/>`;}
 else if(m==='power'){const on=!!F['pow:'+id];o+=LED(cx,top,on,1.9)+`<text x="${cx}" y="${top+5}" font-size="2.6" text-anchor="middle" fill="${on?'#b6ff8a':'#ff8a80'}" stroke="#000" stroke-width=".5" paint-order="stroke">${on?'전원 ON':'전원 없음'}</text>`;}
 else if(m==='order'){const ins=F['ord:'+id]||[],ax=x+w*.84,ay=y+hh*.38;row(n,()=>false,i=>ins[i]!=null?VCOL[ins[i]]:null);
  o+=`<rect x="${ax-3.4}" y="${ay-6}" width="6.8" height="12" rx=".8" fill="#0b120d" stroke="#9fd3ff" stroke-width=".35"/>`;for(let i=0;i<n;i++)o+=`<rect x="${ax-2.6+i*(5.2/n)}" y="${ay-1}" width="${5.2/n*.6}" height="5.5" rx=".4" fill="${ins[i]!=null?VCOL[ins[i]]:'#1a2a20'}"/>`;}
 else if(m==='dark'&&!F['chain:'+id]){const a=y+hh*.38,b=y+hh*.62,l=x+w*.12,r=x+w*.88;
  o+=`<path d="M${l} ${a}L${r} ${b}M${r} ${a}L${l} ${b}" stroke="#151515" stroke-width="3" stroke-linecap="round"/><path d="M${l} ${a}L${r} ${b}M${r} ${a}L${l} ${b}" stroke="#9aa2a8" stroke-width="2" stroke-dasharray="1.6 .8" stroke-linecap="round"/>`
   +`<g transform="translate(${cx} ${(a+b)/2})"><path d="M-2 0v-2.2a2 2 0 0 1 4 0V0" fill="none" stroke="#7a7f84" stroke-width=".9"/><rect x="-3" y="-.4" width="6" height="5" rx=".8" fill="#5a4a20" stroke="#222" stroke-width=".4"/></g>`;}
 else if(m==='lever'){const s=lvState(st),ly=y+hh*.6,sp=Math.min(6,w/5);s.forEach((u,i)=>{const px=cx+(i-1.5)*sp;o+=`<rect x="${px-1.4}" y="${ly-3}" width="2.8" height="6" rx=".5" fill="#0b120d" stroke="#7be04a" stroke-width=".3"/><line x1="${px}" y1="${ly}" x2="${px}" y2="${u?ly-5:ly+5}" stroke="#d9d9d9" stroke-width=".8"/><circle cx="${px}" cy="${u?ly-5:ly+5}" r="1.1" fill="#e0584a"/>`;});}
 else if(m==='brew'){const sx=x+w*.82,sy=y+hh*.45;o+=`<rect x="${sx-3.5}" y="${sy-4.5}" width="7" height="9" rx=".8" fill="#0b120d" stroke="#7be04a" stroke-width=".35"/><rect x="${sx-2.5}" y="${sy-3.5}" width="5" height="4" fill="${done?'#3f9a2a':'#10301a'}"/>`+LED(sx,sy+2.6,done,.9);}
 return o;}
/* 문 말고 물건을 넣는 곳(배전반·대형 화면·합성 탱크) */
function tgtOv(st,m,x,y,w,hh){const F=ZV.G().flags,id=st.id,n=nOf(st);let o='';
 if(m==='power'){const k=Math.min(F['fz:'+id]||0,n),on=!!F['pow:'+id],px=x+w*.08,pw=w*.84,ph=hh*.84,py=y+hh*.08;
  o+=`<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="1" fill="rgba(8,14,10,.82)" stroke="${on?'#7be04a':'#c0392b'}" stroke-width=".45"/><text x="${px+pw/2}" y="${py+4}" font-size="2.6" text-anchor="middle" fill="#ffd84a">배전반</text>`;
  for(let i=0;i<n;i++){const fx=px+pw*(i+.5)/n;o+=`<rect x="${fx-1.6}" y="${py+6}" width="3.2" height="${ph-12}" rx=".6" fill="${i<k?'#cfe9ff':'#1a221c'}" stroke="${i<k?'#ffb340':'#444'}" stroke-width=".35"/>`;}
  o+=LED(px+pw/2,py+ph-3,on,1.1);}
 else if(m==='lever'){const on=!!F['scr:'+id],k=Math.min(F['chip:'+id]||0,n),sx=x+w*.12,sw=w*.62,sh=hh*.6,sy=y+hh*.18;
  o+=`<rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="rgba(3,12,6,.85)" stroke="#7be04a" stroke-width=".4"/>`;
  if(on){const L=leverSet(st),mx=Math.max(...L.vals);L.vals.forEach((v,i)=>{const bh=(sh-6)*v/mx,bx=sx+sw*(i+.5)/4;o+=`<rect x="${bx-2.4}" y="${sy+sh-2-bh}" width="4.8" height="${bh}" fill="#7be04a" opacity=".85"/><text x="${bx}" y="${sy+sh-3-bh}" font-size="2.6" text-anchor="middle" fill="#eaffe0">${v}</text>`;});}
  else o+=`<text x="${sx+sw/2}" y="${sy+sh/2}" font-size="3.4" text-anchor="middle" fill="#ff8a80">NO DATA</text><text x="${sx+sw/2}" y="${sy+sh/2+4.5}" font-size="2.6" text-anchor="middle" fill="#9fc29e">칩 ${k}/${n}</text>`;}
 else if(m==='brew'){const k=Math.min(F['srm:'+id]||0,n),br=!!F['brew:'+id],tx=x+w*.2,tw=w*.6,ty=y+hh*.15,th=hh*.7,lh=th*(br?.95:k/Math.max(1,n)*.8);
  o+=`<rect x="${tx}" y="${ty+th-lh}" width="${tw}" height="${lh}" fill="${br?'#b6ff8a':'#5fd35a'}" opacity="${br?.55:.35}" style="mix-blend-mode:screen"/><text x="${tx+tw/2}" y="${ty+6}" font-size="3" text-anchor="middle" fill="#eaffe0" stroke="#000" stroke-width=".6" paint-order="stroke">원액 ${k}/${n}${br?' · 합성 완료':k>=n?' · 합성 대기':''}</text>`;}
 return o;}
function tgtTodo(st,m){const F=ZV.G().flags,id=st.id,n=nOf(st);
 if(m==='power')return !F['pow:'+id]&&hasItem('fuse');if(m==='lever')return hasItem('chip')||!!F['scr:'+id]&&!F['door:'+id];if(m==='brew')return hasItem('serum')||(F['srm:'+id]||0)>=n&&!F['brew:'+id];return false;}
function drawScene(){const st=ZV.curStage(),G=ZV.G(),svg=$('#scene');if(!svg||!st)return;
 const W=ZV.wallsFor(st),wall=W.walls[G.wall],done=ZV.doorOpen(st),lampHeld=hasItem('lamp'),m=ZV.mech(st),tg=TGT[m];
 const IM=(ZV.IMG&&ZV.IMG[st.id]&&ZV.IMG[st.id][G.wall])||DEF_IM,sd=ZV.stages().indexOf(st)*13+G.wall*5+1,glowOn=ZV.S.settings.glow;
 const BASE=`<defs>${XDEFS}<radialGradient id="gl2"><stop offset="0" stop-color="#c8ffa8" stop-opacity=".95"/><stop offset="1" stop-color="#7be04a" stop-opacity="0"/></radialGradient><radialGradient id="glw"><stop offset="0" stop-color="#fff2b0" stop-opacity=".95"/><stop offset="1" stop-color="#ffd84a" stop-opacity="0"/></radialGradient><linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff2b0" stop-opacity=".75"/><stop offset="1" stop-color="#fff2b0" stop-opacity="0"/></linearGradient><radialGradient id="vg" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient><filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${sd}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .6 -.2"/></filter></defs>${IM.src?`<image id="bgimg" href="${IM.src}" x="0" y="0" width="120" height="160" preserveAspectRatio="xMidYMid slice"/>`:'<rect id="bgimg" width="120" height="160" fill="#0d1410"/>'}`;
 let o='';const doorFresh=done&&ZV.fxDoor===st.id&&G.wall===0;if(doorFresh)ZV.fxDoor=null;
 const OLs=openLayer(st,G,IM,G.wall===0?doorFresh:!!(ZV.fxNew&&ZV.fxNew['chest'+st.id]));if(OLs)o+=OLs;const openShown=!!OLs;
 for(const p of wall.props){const key=p.role||p.id,h=IM.hot[key];if(!h)continue;if(key==='lamp'&&G.flags['lamp:'+st.id])continue;
  const[x,y,w,hh]=h,cx=x+w/2,cy=y+hh/2,solved=p.act.k==='pz'&&ZV.isSolved(p.act.pid);let ov='';
  if(key===tg)ov+=tgtOv(st,m,x,y,w,hh);
  if(key==='door'){ov+=doorOv(st,m,x,y,w,hh,IM,done);
   if(done)ov+=`<rect x="${x+w*.1}" y="${y+hh*.08}" width="${w*.8}" height="${hh*.9}" fill="url(#gl2)" opacity=".7" style="mix-blend-mode:screen"/>`;}
  else if(key==='lamp'){ov+=`<circle cx="${cx}" cy="${cy}" r="9" fill="url(#glw)" opacity=".5"/><polygon points="${x+w*.9},${cy} ${x+w+13},${cy-6} ${x+w+13},${cy+6}" fill="url(#beam)" style="mix-blend-mode:screen"/><rect x="${x}" y="${cy-1.7}" width="${w*.82}" height="3.4" rx="1.2" fill="#2d3238" stroke="#0a0c0e" stroke-width=".3"/><rect x="${x+w*.6}" y="${cy-2.2}" width="${w*.26}" height="4.4" rx=".8" fill="#59626b"/><circle cx="${x+w*.9}" cy="${cy}" r="2" fill="#fff6c8"/>`;}
  else if(key==='chest'&&solved)ov+=`<ellipse cx="${cx}" cy="${y+hh*.25}" rx="${w*.4}" ry="${hh*.2}" fill="url(#gl2)" opacity=".8" style="mix-blend-mode:screen"/>`;
  else if(key==='alcove'&&!solved&&lampHeld)ov+=`<circle cx="${cx}" cy="${cy+hh*.1}" r="${w*.34}" fill="url(#glw)" opacity=".3" style="mix-blend-mode:screen"/>`;
  if(openShown&&(key==='door'||key==='chest'))ov='';
  if(solved&&key!=='door'&&!(openShown&&key==='chest'))ov+=`<circle cx="${cx}" cy="${cy}" r="${Math.min(w,hh)*.3}" fill="url(#gl2)" opacity=".7" style="mix-blend-mode:screen"/>`+padOpen(cx,cy,!!(ZV.fxNew&&ZV.fxNew[key+st.id]),clamp(Math.min(w,hh)/14,1.3,2.2));
  const todo=(p.act.k==='pz'&&!solved)||p.act.k==='lamp'||(p.act.k==='door'&&done)||(p.act.k==='tgt'&&tgtTodo(st,m));
  const mw=Math.max(w,MINHIT),mh=Math.max(hh,MINHIT);
  o+=`<g class="hot ih" data-act="prop" data-p="${p.id}"><rect class="hl" x="${x}" y="${y}" width="${w}" height="${hh}" rx="1" fill="rgba(160,255,140,.10)" stroke="rgba(160,255,140,.6)" stroke-width=".35"/>${ov}<rect x="${cx-mw/2}" y="${cy-mh/2}" width="${mw}" height="${mh}" fill="transparent"/>${glowOn&&todo?`<circle class="spk" cx="${cx}" cy="${cy}" r="1.6"/>`:''}</g>`;}
 for(let i=0;i<7;i++)o+=`<circle class="dust" cx="${(hs(i,sd+4)*120).toFixed(1)}" cy="${(8+hs(i,sd+5)*140).toFixed(1)}" r=".3" style="animation-delay:-${(hs(i,sd+6)*9).toFixed(1)}s" pointer-events="none"/>`;
 o+=`<rect width="120" height="160" fill="url(#vg)" pointer-events="none"/><rect width="120" height="160" filter="url(#grain)" opacity=".3" style="mix-blend-mode:multiply" pointer-events="none"/>`;
 ZV.fxNew={};
 /* 배경 그림은 그대로 두고 위에 얹은 층만 다시 그린다 (다시 그릴 때 깜빡이지 않게) */
 const key2=IM.src||('none'+G.wall),ovg=$('#ovg');if(svg.dataset.src===key2&&ovg){ovg.innerHTML=o;}else{svg.innerHTML=BASE+`<g id="ovg">${o}</g>`;svg.dataset.src=key2;}
 /* 5구역 정전: 손전등 불빛(누른 곳 둘레)만 보인다. 자물쇠를 다 풀면 비상등이 들어와 원래대로 */
 const fr=$('#frame'),bo=blackout(st);if(fr){fr.classList.toggle('lit',lampHeld);fr.classList.toggle('blackout',bo);fr.style.setProperty('--rp',Math.round(fr.clientWidth*(bo?(lampHeld?.36:.17):lampHeld?.62:.4))+'px');if(bo)fr.style.setProperty('--da',lampHeld?'.9':'.97');else fr.style.removeProperty('--da');}
 const nm=$('#wname');if(nm)nm.textContent=`${st.name} · ${wall.name}`;
 document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('on',i===G.wall));}
ZV.drawScene=drawScene;
ZV.drawInv=function(){const el=$('#inv');if(!el)return;const G=ZV.G(),cnt={};G.items.forEach(i=>cnt[i]=(cnt[i]||0)+1);
 const ids=Object.keys(cnt);let h=`<div class="ringlbl" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="#b9a46a" stroke-width="2.4"/><circle cx="12" cy="12" r="8" fill="none" stroke="#f3e2a6" stroke-width=".8" stroke-dasharray="3 6"/></svg><span>열쇠고리</span></div>`;
 ids.forEach(id=>{h+=`<button class="slotb ${G.sel===id?'on':''}" data-act="itemTap" data-i="${id}" aria-label="${ITEM[id].n}">${ICO[id]}${cnt[id]>1?`<span class="cn">${cnt[id]}</span>`:''}</button>`;});
 for(let i=ids.length;i<4;i++)h+=`<div class="slotb empty"></div>`;el.innerHTML=h;
 /* 손에 든 물건 표시 (그림 아래쪽) */
 const fr=$('#frame');if(fr){let hd=$('#held');if(!hd){hd=document.createElement('div');hd.id='held';hd.className='held';fr.appendChild(hd);}
  if(G.sel&&ITEM[G.sel]){hd.innerHTML=`${ICO[G.sel]}<span><b>${ITEM[G.sel].n}</b>${ZV.jo(ITEM[G.sel].n,'을','를').slice(ITEM[G.sel].n.length)} 들었다 · 쓸 곳을 눌러 보자</span>`;hd.hidden=false;}else hd.hidden=true;}};
/* 열쇠고리 칸 그림 (11차: 키카드 → 놋쇠 열쇠) */
const ICO={lamp:`<svg viewBox="0 0 24 24"><rect x="3" y="9" width="13" height="6" rx="1.5" fill="#59626b" stroke="#0a0c0e"/><rect x="14" y="7" width="6" height="10" rx="1.5" fill="#8a949c"/><path d="M20 12l4-4v8z" fill="#ffe27a"/></svg>`,
 key:`<svg viewBox="0 0 24 24"><circle cx="7" cy="8" r="4.6" fill="#d9b44a" stroke="#4a3608" stroke-width="1"/><circle cx="7" cy="8" r="1.7" fill="#0e1a11"/><path d="M10.4 11.2l9.4 9.4" stroke="#d9b44a" stroke-width="3" stroke-linecap="round"/><path d="M10.4 11.2l9.4 9.4" stroke="#4a3608" stroke-width=".6" stroke-linecap="round" opacity=".5"/><path d="M16 16.8l-2 2M18.4 19.2l-1.8 1.8" stroke="#d9b44a" stroke-width="2.4" stroke-linecap="round"/></svg>`,
 piece:`<svg viewBox="0 0 24 24"><path d="M9 2h6v4l2 3v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9l2-3z" fill="#7be04a" stroke="#0a0c0e"/><rect x="9" y="2" width="6" height="3" fill="#e6e0cc"/><path d="M9 12h6" stroke="#d8ffc0" stroke-width="1.2"/></svg>`,
 /* 13차 물건들 */
 memo:`<svg viewBox="0 0 24 24"><path d="M5 3h11l3 3v15H5z" fill="#f1ead2" stroke="#4a3608"/><path d="M16 3v3h3" fill="none" stroke="#4a3608"/><path d="M8 9h8M8 12h8M8 15h4" stroke="#6b5a2a" stroke-width="1.2"/><text x="16" y="20" font-size="7" font-weight="900" text-anchor="middle" fill="#c0392b">#</text></svg>`,
 fuse:`<svg viewBox="0 0 24 24"><rect x="7" y="8.5" width="10" height="7" rx="1" fill="#cfe9ff" fill-opacity=".5" stroke="#8aa"/><path d="M7 12h10" stroke="#ffb340" stroke-width="1.3"/><rect x="2.5" y="7.5" width="5" height="9" rx="1.2" fill="#b9bec4" stroke="#333"/><rect x="16.5" y="7.5" width="5" height="9" rx="1.2" fill="#b9bec4" stroke="#333"/></svg>`,
 blade:`<svg viewBox="0 0 24 24"><path d="M4 3c3 1 6 4 7 8l-2 1C7 9 5 6 4 3z" fill="#b9c0c6" stroke="#333" stroke-width=".8"/><path d="M3 4c1 3 4 6 8 7l-1 2C6 12 4 8 3 4z" fill="#8f979d" stroke="#333" stroke-width=".8"/><circle cx="11" cy="12" r="1.8" fill="#555"/><path d="M12 13l3 3" stroke="#666" stroke-width="2.2"/></svg>`,
 grip:`<svg viewBox="0 0 24 24"><path d="M9 9l11 10M9 9l3 1" stroke="#c0392b" stroke-width="3.2" stroke-linecap="round"/><path d="M9 9l4 12" stroke="#a02a1e" stroke-width="3.2" stroke-linecap="round"/><circle cx="8" cy="8" r="2" fill="#888" stroke="#333"/></svg>`,
 cutter:`<svg viewBox="0 0 24 24"><path d="M3 3c3 1 5 3 6 6l-2 1C6 7 4 5 3 3z" fill="#b9c0c6" stroke="#333" stroke-width=".7"/><path d="M3 3c1 3 3 5 6 6l-1 2C6 9 4 6 3 3z" fill="#8f979d" stroke="#333" stroke-width=".7"/><circle cx="9" cy="10" r="1.6" fill="#555"/><path d="M10 11l10 9M10 11l3 11" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/></svg>`,
 chip:`<svg viewBox="0 0 24 24"><path d="M8 3v3M12 3v3M16 3v3M8 18v3M12 18v3M16 18v3M3 8h3M3 12h3M3 16h3M18 8h3M18 12h3M18 16h3" stroke="#d9b44a" stroke-width="1.3"/><rect x="6" y="6" width="12" height="12" rx="1.5" fill="#1d3a24" stroke="#7be04a"/><path d="M9 15v-3M12 15v-6M15 15v-4" stroke="#7be04a" stroke-width="1.6"/></svg>`,
 serum:`<svg viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="3" rx="1" fill="#e6e0cc"/><path d="M10 5h4v4l4 9a2 2 0 0 1-2 3H8a2 2 0 0 1-2-3l4-9z" fill="#ffffff22" stroke="#cfd8d0"/><path d="M7.5 15h9l1 3a2 2 0 0 1-2 3H8a2 2 0 0 1-2-3z" fill="#3fd0b0"/></svg>`,
 antidote:`<svg viewBox="0 0 24 24"><circle cx="12" cy="14" r="9" fill="#b6ff8a" opacity=".25"/><rect x="9" y="2" width="6" height="3" rx="1" fill="#e6e0cc"/><path d="M8 5h8v3l2 3v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9l2-3z" fill="#7be04a" stroke="#0a0c0e"/><path d="M12 11v7M8.5 14.5h7" stroke="#fff" stroke-width="2"/></svg>`};
VCOL.forEach((c,i)=>{ICO['v'+i]=`<svg viewBox="0 0 24 24"><rect x="8" y="1.5" width="8" height="3" rx="1" fill="#e6e0cc"/><path d="M9 4.5h6v14.5a3 3 0 0 1-6 0z" fill="#ffffff22" stroke="#cfd8d0"/><path d="M9 10h6v9a3 3 0 0 1-6 0z" fill="${c}"/><text x="12" y="18.5" font-size="6.5" font-weight="900" text-anchor="middle" fill="#111">${VL[i]}</text></svg>`;});
ZV.ICO=ICO;
/* 물건을 꽂는 연출: 그 물건이 화면의 (x,y) 자리로 날아가 꽂히고(열쇠는 돌아감) 찰칵 */
ZV.fxUse=function(id,x,y,cb){const fr=$('#frame');if(!fr){cb&&cb();return;}const d=document.createElement('div');d.className='fxuse '+(id==='key'?'fx-key':'fx-piece');d.style.left=(x/120*100)+'%';d.style.top=(y/160*100)+'%';d.innerHTML=ICO[id];fr.appendChild(d);
 setTimeout(()=>{ZV.AUDIO&&ZV.AUDIO.sfx('unlock');},620);setTimeout(()=>{d.remove();cb&&cb();},1150);};

/* ================= 나레이션 (검은방 방식) ================= */
/* 한 줄은 '문장'(나레이션) 또는 ['dojin','문장'](인물 대사 → 글상자 왼쪽에 얼굴 + 이름) */
let narr={q:[],cb:null,txt:'',who:null,i:0,timer:null,busy:false};
function nextLine(){const l=narr.q.shift();narr.who=Array.isArray(l)?l[0]:null;narr.txt=(Array.isArray(l)?l[1]:l).replace(/\{name\}/g,ZV.S.cur||'');}
function typeNow(){const el=$('#narr');if(!el)return;clearInterval(narr.timer);narr.i=0;const C=narr.who&&ZV.CAST[narr.who];
 el.classList.toggle('talk',!!C);
 el.innerHTML=(C?`${C.img?`<img class="nface" src="${C.img}" alt="">`:''}<b class="nname" style="color:${C.c}">${C.n}</b>`:'')+'<span id="nt"></span><span class="nx" id="nx" hidden>▼</span>';
 narr.timer=setInterval(()=>{narr.i+=2;const t=$('#nt');if(!t){clearInterval(narr.timer);return;}t.textContent=narr.txt.slice(0,narr.i);if(narr.i>=narr.txt.length){clearInterval(narr.timer);const nx=$('#nx');if(nx&&narr.q.length)nx.hidden=false;}},22);}
ZV.say=function(lines,cb){const arr=Array.isArray(lines)&&!(lines.length===2&&ZV.CAST[lines[0]]&&typeof lines[1]==='string')?lines.slice():[lines];narr.q=arr;narr.cb=cb||null;narr.busy=arr.length>1||!!cb;nextLine();typeNow();};
ZV.narrTap=function(){const el=$('#nt');if(!el)return;if(narr.i<narr.txt.length){narr.i=narr.txt.length;clearInterval(narr.timer);el.textContent=narr.txt;const nx=$('#nx');if(nx&&narr.q.length)nx.hidden=false;return;}
 if(narr.q.length){nextLine();typeNow();}else{narr.busy=false;const f=narr.cb;narr.cb=null;if(f)f();}};
ZV.narrBusy=()=>narr.busy;

/* ================= 대화 장면 (11차: 검은방처럼 초상화 + 글상자) =================
   도진은 왼쪽, 무전 상대(서연·한 소장)는 오른쪽. 말하는 사람은 밝게, 듣는 사람은 어둡게. 한 소장은 초상화가 없어 "SOUND ONLY" 무전 화면. */
let DL=null;
ZV.dialog=function(lines,cb){DL={lines,i:0,cb,shown:0,t:null,L:null,R:null};$('#ov').innerHTML=`<div class="ov dlgv" data-act="dlgTap"><div class="cast"><div class="por l" id="porL"></div><div class="por r" id="porR"></div></div><div class="dlgbox"><div class="radio"><span class="rd" id="dlgRd"></span><span class="dlgn" id="dlgN"></span><span class="dlgt" id="dlgT"></span></div><div class="dlgx" id="dlgX"></div><div class="nx">▼</div></div></div>`;dlgLine();};
function porHTML(k){const C=ZV.CAST[k];if(!C)return'';return C.img?`<img src="${C.img}" alt="${C.n}" class="${C.cls||''}">${C.radio?'<i class="scan"></i>':''}`:`<div class="sonly" style="${C.sonly?`border-color:${C.c};color:${C.c}`:''}"><b>${C.sonly||'SOUND ONLY'}</b><span>${C.n}</span><i class="wave" style="${C.sonly?`background:repeating-linear-gradient(90deg,${C.c} 0 3px,transparent 3px 7px)`:''}"></i></div>`;}
function dlgPor(k){const C=ZV.CAST[k];if(!C){['L','R'].forEach(s=>{const e=$('#por'+s);if(e&&e.innerHTML){e.classList.add('dim');e.classList.remove('on');}});return;}const side=C.side==='l'?'L':'R',el=$('#por'+side);if(!el)return;
 if(DL[side]!==k){DL[side]=k;el.innerHTML=porHTML(k);el.classList.remove('in');void el.offsetWidth;el.classList.add('in');}
 const o=$('#por'+(side==='L'?'R':'L'));el.classList.add('on');el.classList.remove('dim');if(o&&o.innerHTML)o.classList.add('dim'),o.classList.remove('on');}
function dlgLine(){let l=DL.lines[DL.i];if(typeof l==='string')l=['',l];   /* 12차: 문자열 한 줄 = 나레이션(이름 없음) */
 const R=ZV.CAST[l[0]]||{n:'',c:'#7be04a'},n=$('#dlgN');n.textContent=R.n;n.style.color=R.c;dlgPor(l[0]);
 $('#dlgT').textContent=R.tag||(R.radio?'무전':'');$('#dlgRd').style.visibility=R.radio?'':'hidden';
 DL.full=l[1].replace(/\{name\}/g,ZV.S.cur||'');DL.shown=0;clearInterval(DL.t);$('#dlgX').textContent='';
 DL.t=setInterval(()=>{DL.shown+=2;const x=$('#dlgX');if(!x){clearInterval(DL.t);return;}x.textContent=DL.full.slice(0,DL.shown);if(DL.shown>=DL.full.length)clearInterval(DL.t);},24);}
ZV.dlgTap=function(){if(!DL)return;if(DL.shown<DL.full.length){DL.shown=DL.full.length;$('#dlgX').textContent=DL.full;clearInterval(DL.t);return;}DL.i++;if(DL.i>=DL.lines.length){clearInterval(DL.t);const f=DL.cb;DL=null;$('#ov').innerHTML='';if(f)f();}else dlgLine();};

/* ================= 장면 조작 ================= */
ZV.renderGame=function(){ZV.screen='game';ZV.applyBody&&ZV.applyBody();const st=ZV.curStage();ZV.AUDIO&&ZV.AUDIO.mood(st.ch);
 $('#app').innerHTML=`<div class="game"><div class="frame" id="frame"><svg id="scene" viewBox="0 0 120 160" preserveAspectRatio="xMidYMid slice"></svg><div class="dark"></div><div class="vig"></div>
 <button class="nav l" data-act="navL" aria-label="왼쪽 벽">◀</button><button class="nav r" data-act="navR" aria-label="오른쪽 벽">▶</button>
 <div class="hud tl"><button class="hb" data-act="mapOpen">MAP</button><span class="hb dim" id="chn"></span></div>
 <div class="hud tr"><span class="hb dim" data-tm="1"></span><button class="hb" data-act="menuOpen">MENU</button></div>
 <div class="wname" id="wname"></div><div class="dots"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div></div>
 <div class="narr" id="narr" data-act="narrTap"></div><div class="inv" id="inv"></div></div>`;
 $('#chn').textContent=st.chName?st.chName.split(' · ')[0]:'';
 const fr=$('#frame'),mv=e=>{const r=fr.getBoundingClientRect();fr.style.setProperty('--mx',(e.clientX-r.left)+'px');fr.style.setProperty('--my',(e.clientY-r.top)+'px');};
 let sx=null,sy=0;fr.addEventListener('pointermove',mv);
 fr.addEventListener('pointerdown',e=>{mv(e);sx=e.clientX;sy=e.clientY;});
 fr.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){ZV.swiped=Date.now();ZV.navWall(dx<0?1:-1);}});
 fr.addEventListener('pointercancel',()=>{sx=null;});
 ZV.fixStage(st);ZV.drawScene();ZV.drawInv();ZV.tickTm&&ZV.tickTm();};
addEventListener('resize',()=>{if(ZV.screen==='game')ZV.drawScene();});
ZV.enterStage=function(i,first){const G=ZV.G();G.si=i;G.wall=0;if(first)G.items=[];G.sel=null;ZV.save();ZV.renderGame();const st=ZV.curStage();
 if(!G.seen[st.id]){G.seen[st.id]=1;ZV.save();ZV.say(st.intro,()=>ZV.evCheck('enter'));}else ZV.say(`${st.name}. 문을 열려면 이 방의 자물쇠를 모두 풀어야 한다.`);};
ZV.navWall=function(d){if(ZV.narrBusy())return;const G=ZV.G();G.wall=(G.wall+d+3)%3;ZV.save();ZV.drawScene();ZV.evCheck('wall'+G.wall);};
/* 12차: 방마다 한 번 일어나는 사건 (EVENTS). 일어났으면 true */
ZV.evCheck=function(kind){const st=ZV.curStage(),G=ZV.G(),ev=st&&st.ev;if(!ev||G.flags['ev:'+st.id]||ZV.screen!=='game')return false;
 let ok=kind===ev.when;if(!ok&&kind==='solved'&&/^solved\d$/.test(ev.when))ok=ZV.stagePids(st).filter(ZV.isSolved).length>=+ev.when.slice(6);
 if(!ok)return false;G.flags['ev:'+st.id]=1;ZV.save();
 const fr=$('#frame');if(fr&&ev.fx){fr.classList.add('ev-'+ev.fx);setTimeout(()=>fr.classList.remove('ev-'+ev.fx),ev.fx==='dark'?2600:1300);}
 if(ev.sfx)ZV.AUDIO&&ZV.AUDIO.sfx(ev.sfx);
 setTimeout(()=>ZV.dialog(ev.lines,()=>{}),ev.fx==='dark'?900:350);return true;};
const pieceInfo=st=>{const P=ZV.stagePids(st);return{solved:P.filter(ZV.isSolved).length,total:P.length};};
/* 이미 푼 자물쇠를 다시 누르면: 문제 창을 다시 열지 않고 "해결함"만 알려 준다 (11차) */
const SOLVEDTXT={desk:'서랍은 이미 열었다. 자물쇠는 해제되어 있다. (해결함)',shelf:'이미 해제한 자물쇠다. 캐비닛 안은 비어 있다. (해결함)',chest:'보관함은 이미 열려 있다. 안은 비었다. (해결함)',alcove:'환기구의 자물쇠도 이미 풀었다. (해결함)',ext:'이미 해제한 자물쇠다. (해결함)'};
ZV.tapProp=function(pid){if(ZV.swiped&&Date.now()-ZV.swiped<350)return;if(narr.busy){ZV.narrTap();return;}if(ZV.using)return;const st=ZV.curStage(),G=ZV.G(),W=ZV.wallsFor(st),p=W.walls[G.wall].props.find(x=>x.id===pid);if(!p)return;const a=p.act;
 const IMW=ZV.IMG&&ZV.IMG[st.id]&&ZV.IMG[st.id][G.wall],IMX=IMW||DEF_IM,imT=IMW&&IMW.text&&IMW.text[p.role||p.id];
 const sel=G.sel,hot=IMX.hot[p.role||p.id]||[50,70,20,20],hx=hot[0]+hot[2]/2,hy=hot[1]+hot[3]/2;
 const unsel=()=>{G.sel=null;ZV.drawInv();};
 /* 든 물건이 맞지 않는 곳 */
 const wrongUse=()=>{const n=ITEM[sel].n;unsel();ZV.say(`${ZV.jo(n,'은','는')} 여기에 쓸 수 없는 것 같다.`);};
 /* 5구역 정전: 손전등을 찾기 전에는 손전등 말고 아무것도 만질 수 없다 */
 if(blackout(st)&&!hasItem('lamp')&&a.k!=='lamp'){ZV.say(['너무 어둡다. 손을 더듬어도 아무것도 잡히지 않는다.',['dojin','손전등…… 정면 책상 근처에서 뭔가 반짝였던 것 같은데.']]);return;}
 if(a.k==='look'){if(sel&&sel!=='lamp'){wrongUse();return;}ZV.say(imT||a.text||'특별한 것은 없는 것 같다.');return;}
 if(a.k==='lamp'){if(G.flags['lamp:'+st.id]){ZV.say('이미 가져왔다.');return;}G.flags['lamp:'+st.id]=1;addItem('lamp');ZV.save();ZV.drawScene();ZV.drawInv();ZV.say(['손전등을 손에 넣었다. 허리춤에 찼다.',['dojin','이걸로 어두운 곳도 볼 수 있겠어.']]);return;}
 const c={st,G,a,sel,hot,hx,hy,IMX,unsel,wrongUse};
 if(a.k==='tgt'){tapTarget(c);return;}
 if(a.k==='door'){const need=ZV.pieceNeed(st),ins=ZV.pieceIns(st),held=cntItem('piece');
  if(ZV.doorOpen(st)){if(ZV.entering)return;unsel();ZV.entering=true;const fr=$('#frame');if(fr)fr.classList.add('enter');ZV.AUDIO&&ZV.AUDIO.sfx('door');setTimeout(()=>{ZV.entering=false;const f2=$('#frame');if(f2)f2.classList.remove('enter');ZV.stageClear(st);},650);return;}
  if(ZV.mech(st)!=='classic'){tapDoor(c);return;}
  if(sel==='piece'){const n=Math.min(held,need-ins);if(n<=0){unsel();ZV.say('장착부가 이미 모두 찼다.');return;}
   const y0=hot[1]+hot[3]*(IMX.sockY||.1);ZV.using=true;ZV.fxUse('piece',hx,y0+6,()=>{ZV.using=false;
    G.flags['ins:'+st.id]=ins+n;for(let k=0;k<n;k++)delItem('piece');G.sel=null;
    const open=ZV.doorOpen(st);if(open){ZV.fxDoor=st.id;ZV.AUDIO&&ZV.AUDIO.sfx('door',.3);}ZV.save();ZV.drawScene();ZV.drawInv();
    if(open)ZV.say([`앰플 조각을 장착부에 끼워 넣었다. (${need}/${need})`,'표시등이 모두 초록으로 바뀌었다. 철컹 — 철문이 열렸다!',['dojin','됐다……! 다음 구역으로 가자.']]);
    else ZV.say(ZV.stageDone(st)?`앰플 조각을 끼워 넣었다. (${ins+n}/${need})`:[`앰플 조각을 끼워 넣었다. (${ins+n}/${need})`,['dojin','아직 장착부가 비어 있어. 남은 자물쇠에서 조각을 더 찾아야 해.']]);});return;}
  if(sel){wrongUse();return;}
  if(held>0){ZV.say([`문 위 장착부 ${need}칸 중 ${ins}칸이 찼다.`,['dojin','허리춤에 앰플 조각이 있다. 아래 열쇠고리에서 조각을 골라 들고, 문을 눌러 끼워 보자.']]);blinkSlot('piece');return;}
  ZV.say(`문 위 장착부 ${need}칸 중 ${ins}칸이 찼다. 아직 열리지 않는다.`);return;}
 if(a.k==='pz'){
  if(ZV.isSolved(a.pid)){if(sel&&sel!=='lamp'){wrongUse();return;}ZV.say(SOLVEDTXT[a.role]||'이미 해제한 자물쇠다. (해결함)');return;}
  if(a.need==='lamp'&&!hasItem('lamp')){ZV.say('너무 어두워서 아무것도 보이지 않는다. 손전등이 필요하다.');return;}
  if(a.need==='key'&&!G.flags['chest:'+st.id]){
   if(sel==='key'){ZV.using=true;ZV.fxUse('key',hx,hy,()=>{ZV.using=false;delItem('key');G.sel=null;G.flags['chest:'+st.id]=1;ZV.fxNew={};ZV.save();ZV.drawScene();ZV.drawInv();ZV.say(['열쇠를 꽂고 돌렸다. 철컥 — 보관함 잠금이 풀렸다.','……안쪽에 수학 자물쇠가 하나 더 있다.'],()=>ZV.openPuzzle(a.pid));});return;}
   if(sel){wrongUse();return;}
   if(hasItem('key')){ZV.say(['굳게 잠긴 보관함. 열쇠 구멍이 보인다.',['dojin','서랍에서 찾은 열쇠가 맞을지도 몰라. 열쇠고리에서 골라 들고 꽂아 보자.']]);blinkSlot('key');return;}
   ZV.say(['굳게 잠겨 있다. 열쇠 구멍이 보인다.',['dojin','열쇠가 필요해. 어딘가 서랍 같은 데 있지 않을까?']]);return;}
  if(sel&&sel!=='lamp'){wrongUse();return;}
  ZV.openPuzzle(a.pid);}};
function blinkSlot(id){const b=document.querySelector(`.slotb[data-i="${id}"]`);if(!b)return;b.classList.remove('blink');void b.offsetWidth;b.classList.add('blink');}
ZV.onSolved=function(pid){const st=ZV.curStage(),G=ZV.G(),W=ZV.wallsFor(st);const role=Object.keys(W.pidOf).find(r=>W.pidOf[r]===pid);
 const wasOpen=ZV.doorOpen(st);let msg=G.flags['rw:'+pid]?[]:grant(st,pid);
 ZV.fxNew={};ZV.fxNew[(role||'x')+st.id]=1;ZV.AUDIO&&ZV.AUDIO.sfx('unlock');
 if(ZV.stageDone(st)){msg=msg.concat(doneLines(st));if(!wasOpen&&ZV.doorOpen(st)){ZV.fxDoor=st.id;ZV.AUDIO&&ZV.AUDIO.sfx('door',.6);}}
 ZV.save();ZV.drawScene();ZV.drawInv();
 const ev=()=>ZV.evCheck('solved');
 ZV.say(msg.length?msg:['자물쇠가 풀렸다.'],ev);};
/* ---------- 13차: 문 (구역마다 다른 장치) ---------- */
const openNow=(st,lines)=>{const F=ZV.G().flags;F['door:'+st.id]=1;ZV.fxDoor=st.id;ZV.AUDIO&&ZV.AUDIO.sfx('door',.3);ZV.save();ZV.drawScene();ZV.drawInv();ZV.say(lines);};
const failFx=()=>{const fr=$('#frame');if(fr){fr.classList.add('ev-shake');setTimeout(()=>fr.classList.remove('ev-shake'),1100);}ZV.AUDIO&&ZV.AUDIO.sfx('buzz');};
function tapDoor(c){const{st,G,sel,hx,hy}=c,m=ZV.mech(st),F=G.flags,id=st.id,n=nOf(st),done=ZV.stageDone(st),left=n-solvedCount(st);
 if(m==='code'){if(sel&&sel!=='memo'){c.wrongUse();return;}c.unsel();
  if(!done){ZV.say([`철문에 숫자 ${n}자리 키패드가 달려 있다. 지금 아는 자리: ${solvedCount(st)}/${n}`,['dojin',solvedCount(st)?`암호 메모가 아직 ${left}자리 모자라. 남은 자물쇠에도 쪽지가 있을 거야.`:'암호를 모르겠어. 자물쇠 안에 단서가 있지 않을까?']]);return;}
  KP.buf='';kpDraw();return;}
 if(m==='power'){if(sel==='fuse'){ZV.say(['문에는 퓨즈 꽂을 곳이 없다.',['dojin','퓨즈는 왼쪽 벽 배전반에 꽂아야 해.']]);c.unsel();return;}if(sel){c.wrongUse();return;}
  if(!F['pow:'+id]){ZV.say(['철문의 전자 잠금장치가 꺼져 있다. 표시등도 죽어 있다.',['dojin','전원이 나갔어. 왼쪽 벽 점검창 옆 배전반에 퓨즈를 채워 보자.']]);return;}
  ZV.say(`전원은 들어왔다. 남은 보안 자물쇠 ${left}개를 풀어야 문이 열린다.`);return;}
 if(m==='order'){const ins=Array.isArray(F['ord:'+id])?F['ord:'+id]:(F['ord:'+id]=[]);
  if(sel&&/^v\d$/.test(sel)){const i=+sel.slice(1);ZV.using=true;ZV.fxUse(sel,hx+c.hot[2]*.34,hy,()=>{ZV.using=false;delItem(sel);ins.push(i);G.sel=null;
    if(ins.length>=n){const xs=ins.map(k=>vialP(st,k).x),ok=ins.length===n&&xs.every((x,k)=>!k||x>=xs[k-1]-1e-12);
     if(ok){openNow(st,[`시료병 ${VL[i]}를 꽂았다. (${n}/${n})`,'분석기: "판정 완료 — 감염 위험 순서 일치." 철컹, 문이 열렸다!',['dojin','확률이 낮은 것부터……. 맞았어!']]);return;}
     ins.forEach(k=>addItem('v'+k));F['ord:'+id]=[];failFx();ZV.save();ZV.drawScene();ZV.drawInv();
     ZV.say(['삐이익—! 분석기가 시료병을 모두 뱉어 냈다.',`꽂은 순서: ${ins.map(k=>`${VL[k]}(${vialP(st,k).t})`).join(' → ')}`,['dojin','순서가 틀렸어. 라벨의 확률을 비교해서, 낮은 것부터 다시 꽂아 보자.']]);return;}
    ZV.save();ZV.drawScene();ZV.drawInv();ZV.say(`시료병 ${VL[i]}를 분석기 ${ins.length}번째 칸에 꽂았다. (${ins.length}/${n})`);});return;}
  if(sel){c.wrongUse();return;}
  const have=G.items.filter(x=>/^v\d$/.test(x));
  ZV.say([`문 옆 검체 분석기. "시료를 감염 확률이 낮은 것부터 차례로 꽂으시오." (${ins.length}/${n}칸)`,['dojin',have.length?'열쇠고리에서 시료병을 하나씩 골라 들고, 분석기를 눌러 꽂자. 라벨을 먼저 비교해 봐야 해.':`시료병이 필요해. 남은 자물쇠 ${left}개에 들어 있을 거야.`]]);if(have.length)blinkSlot(have[0]);return;}
 if(m==='dark'){if(sel==='cutter'){ZV.using=true;ZV.fxUse('cutter',hx,hy,()=>{ZV.using=false;delItem('cutter');G.sel=null;F['chain:'+id]=1;const open=ZV.doorOpen(st);if(open){ZV.fxDoor=id;ZV.AUDIO&&ZV.AUDIO.sfx('door',.3);}else ZV.AUDIO&&ZV.AUDIO.sfx('unlock');ZV.save();ZV.drawScene();ZV.drawInv();
    ZV.say(['절단기로 쇠사슬을 끊었다. 철커덩— 사슬이 바닥에 떨어졌다.'].concat(open?['문이 열렸다!']:[['dojin',`사슬은 끊었어. 하지만 전자 잠금이 남아 있어. 남은 자물쇠 ${left}개.`]]));});return;}
  if(sel==='blade'||sel==='grip'){c.unsel();ZV.say(['이것만으로는 사슬을 끊을 수 없다.',['dojin','날과 손잡이를 합쳐 절단기를 만들어야 해. 하나를 든 채로 열쇠고리의 다른 하나를 눌러 보자.']]);return;}
  if(sel){c.wrongUse();return;}
  if(!F['chain:'+id]){ZV.say(['철문이 두꺼운 쇠사슬로 칭칭 감겨 있다. 자물통까지 채워져 있다.',['dojin',hasItem('cutter')?'절단기를 들고 사슬을 끊자!':hasItem('blade')&&hasItem('grip')?'날과 손잡이를 합치면 절단기가 될 거야.':'끊을 도구가 필요해. 자물쇠 안에 공구가 있을지도.']]);return;}
  ZV.say(`사슬은 끊었다. 남은 보안 자물쇠 ${left}개를 풀면 전자 잠금이 풀린다.`);return;}
 if(m==='lever'){if(sel){c.wrongUse();return;}
  if(!F['scr:'+id]){ZV.say(['문에 레버 네 개(①~④)가 달려 있다. 위·아래로 맞춰야 열리는 모양이다.',['dojin','어떻게 맞춰야 할지 모르겠어. 저 대형 화면에 데이터 칩을 넣으면 단서가 뜨지 않을까?']]);return;}
  lvDraw();return;}
 if(m==='brew'){if(sel==='antidote'){ZV.using=true;ZV.fxUse('antidote',hx+c.hot[2]*.32,hy,()=>{ZV.using=false;delItem('antidote');G.sel=null;openNow(st,['해독제를 인증 장치에 댔다. 삑— "해독제 확인. 출구 개방."','철컹— 마지막 출구가 열렸다!',['dojin','……드디어. 나가자!']]);});return;}
  if(sel){c.wrongUse();return;}
  ZV.say(['출구 보안문. 옆에 인증 장치가 있다. "완성된 해독제를 대시오."',['dojin',F['brew:'+id]?'해독제는 열쇠고리에 있어. 골라 들고 문을 누르자.':'먼저 정면의 합성 탱크에서 해독제를 만들어야 해.']]);if(hasItem('antidote'))blinkSlot('antidote');return;}}
/* 배전반 · 대형 화면 · 합성 탱크: 모은 물건을 넣는다 (가진 만큼 한 번에) */
function fillTgt(c,tok,key,onFull,put){const{st,G,sel,hx,hy}=c,F=G.flags,n=nOf(st),have=Math.min(F[key+st.id]||0,n);
 const k=Math.min(cntItem(tok),n-have);ZV.using=true;ZV.fxUse(tok,hx,hy,()=>{ZV.using=false;for(let i=0;i<k;i++)delItem(tok);G.sel=null;F[key+st.id]=have+k;ZV.save();ZV.drawScene();ZV.drawInv();if(have+k>=n)onFull();else ZV.say(put(have+k,n));});}
function tapTarget(c){const{st,G,sel}=c,m=ZV.mech(st),F=G.flags,id=st.id,n=nOf(st),left=n-solvedCount(st),nm=TGTTXT[m];
 const glitch=()=>{const fr=$('#frame');if(fr){fr.classList.add('ev-glitch');setTimeout(()=>fr.classList.remove('ev-glitch'),1000);}};
 if(m==='power'){if(F['pow:'+id]){if(sel){c.wrongUse();return;}ZV.say('배전반이 정상 작동 중이다. 웅— 하는 소리가 난다.');return;}
  if(sel==='fuse'){fillTgt(c,'fuse','fz:',()=>{F['pow:'+id]=1;const open=ZV.doorOpen(st);if(open)ZV.fxDoor=id;ZV.save();glitch();ZV.AUDIO&&ZV.AUDIO.sfx('power');ZV.drawScene();
    ZV.say(['마지막 퓨즈를 꽂았다. 지지직— 배전반에 불이 들어왔다!',open?'정면 철문의 표시등이 초록으로 바뀌었다. 문이 열렸다!':['dojin',`문에 전원이 들어갔어. 남은 자물쇠 ${left}개만 풀면 돼.`]]);},(k,n)=>[`퓨즈를 꽂았다. (${k}/${n})`,['dojin','아직 빈 칸이 있어. 남은 자물쇠에서 퓨즈를 더 찾아야 해.']]);return;}
  if(sel){c.wrongUse();return;}
  ZV.say([`${nm}. 퓨즈 ${n}칸 중 ${Math.min(F['fz:'+id]||0,n)}칸이 꽂혀 있다.`,['dojin',hasItem('fuse')?'열쇠고리에서 퓨즈를 골라 들고 여기를 누르자.':'퓨즈가 필요해. 자물쇠 안에 예비 퓨즈가 있을 거야.']]);if(hasItem('fuse'))blinkSlot('fuse');return;}
 if(m==='lever'){if(F['scr:'+id]){if(sel){c.wrongUse();return;}scrDraw();return;}
  if(sel==='chip'){fillTgt(c,'chip','chip:',()=>{F['scr:'+id]=1;ZV.save();glitch();ZV.AUDIO&&ZV.AUDIO.sfx('power');ZV.drawScene();ZV.say(['데이터 칩을 모두 넣었다. 대형 화면에 막대그래프가 떠올랐다!'],scrDraw);},(k,n)=>[`데이터 칩을 꽂았다. (${k}/${n}) 화면: "데이터 부족"`]);return;}
  if(sel){c.wrongUse();return;}
  ZV.say([`${nm}. "NO DATA — 데이터 칩 ${n}개를 넣으시오." (${Math.min(F['chip:'+id]||0,n)}/${n})`,['dojin',hasItem('chip')?'열쇠고리에서 칩을 골라 들고 화면을 누르자.':'데이터 칩은 자물쇠 안에 있을 거야.']]);if(hasItem('chip'))blinkSlot('chip');return;}
 if(m==='brew'){const k=Math.min(F['srm:'+id]||0,n);
  if(sel==='serum'&&k<n){fillTgt(c,'serum','srm:',()=>{ZV.say(['원액을 모두 부었다. 탱크가 부글부글 끓기 시작한다.',['dojin','합성 준비 완료. 탱크를 한 번 더 눌러 합성을 시작하자.']]);},(k2,n2)=>[`원액을 부었다. (${k2}/${n2})`,['dojin','아직 모자라. 남은 자물쇠에서 원액을 더 찾자.']]);return;}
  if(sel){c.wrongUse();return;}
  if(k>=n&&!F['brew:'+id]){F['brew:'+id]=1;addItem('antidote');ZV.save();glitch();ZV.AUDIO&&ZV.AUDIO.sfx('power');ZV.drawScene();ZV.drawInv();ZV.say(['합성 버튼을 눌렀다. 탱크 속 용액이 초록빛으로 번쩍였다!','완성된 해독제를 얻었다!',['dojin','이걸 출구 인증 장치에 대면 돼.']]);return;}
  if(F['brew:'+id]){ZV.say('합성은 끝났다. 탱크가 조용히 식어 가고 있다.');return;}
  ZV.say([`${nm}. 원액 ${n}병 중 ${k}병이 들어 있다.`,['dojin',hasItem('serum')?'열쇠고리에서 원액을 골라 들고 탱크를 누르자.':'원액은 자물쇠 안에 있을 거야.']]);if(hasItem('serum'))blinkSlot('serum');return;}}
/* ---------- 키패드 · 분석 화면 · 레버 창 ---------- */
const KP={buf:''};
function devBox(title,body){$('#ov').innerHTML=`<div class="ov"><div class="box devbox"><h2>${title}</h2>${body}<div class="inrow"><button class="btn ghost" data-act="close">닫기</button></div></div></div>`;}
function kpDraw(msg,bad){const st=ZV.curStage(),n=nOf(st);
 devBox('철문 키패드',`<div class="kpd ${bad?'bad':''}">${[...Array(n)].map((_,i)=>`<span>${KP.buf[i]||'_'}</span>`).join('')}</div>
 <div class="kpg">${['1','2','3','4','5','6','7','8','9','←','0','OK'].map(k=>`<button class="kpb ${k==='OK'?'ok':''}" data-act="${k==='←'?'kpDel':k==='OK'?'kpOk':'kp'}" data-d="${k}">${k}</button>`).join('')}</div>
 <div class="memo"><b>암호 메모</b><br>${memoLines(st).join('<br>')}</div><div class="fb ${bad?'bad':''}">${msg||''}</div>`);}
function scrDraw(){const st=ZV.curStage(),L=leverSet(st),mx=Math.max(...L.vals),W=100,H=60;
 const bars=L.vals.map((v,i)=>{const bh=(H-16)*v/mx,x=12+i*22;return`<rect x="${x}" y="${H-8-bh}" width="14" height="${bh}" fill="#7be04a"/><text x="${x+7}" y="${H-10-bh}" font-size="5" text-anchor="middle" fill="#eaffe0">${v}</text><text x="${x+7}" y="${H-1.5}" font-size="5" text-anchor="middle" fill="#ffd84a">${'①②③④'[i]}</text>`;}).join('');
 devBox('데이터 분석 화면',`<svg viewBox="0 0 ${W} ${H}" class="scrsvg"><rect width="${W}" height="${H}" fill="#03100a"/><path d="M8 ${H-8}H${W-4}" stroke="#2f7d3a" stroke-width=".6"/>${bars}</svg>
 <p class="scrrule">보안 규칙: 막대의 값이 <b>네 값의 평균보다 크면 ▲(위)</b>, 작으면 <b>▼(아래)</b>로 같은 번호의 문 레버를 맞출 것.</p>`);}
function lvDraw(msg,bad){const st=ZV.curStage(),s=lvState(st);
 devBox('보안 레버',`<p class="small">레버를 누르면 위(▲)·아래(▼)가 바뀌어요. 단서는 정면 대형 화면에 있어요.</p><div class="lvg">${s.map((u,i)=>`<button class="lvb ${u?'up':''}" data-act="lvT" data-i="${i}"><i></i><b>${'①②③④'[i]}</b><span>${u?'▲ 위':'▼ 아래'}</span></button>`).join('')}</div>
 <div class="inrow"><button class="btn" data-act="lvOk">레버 당기기</button></div><div class="fb ${bad?'bad':''}">${msg||''}</div>`);}
ZV.SACT={
 kp:t=>{const n=nOf(ZV.curStage());if(KP.buf.length<n)KP.buf+=t.dataset.d;kpDraw();},
 kpDel:()=>{KP.buf=KP.buf.slice(0,-1);kpDraw();},
 kpOk:()=>{const st=ZV.curStage(),n=nOf(st);if(KP.buf.length<n){kpDraw(`${n}자리를 모두 눌러야 해요.`,true);return;}
  if(KP.buf===codeOf(st)){$('#ov').innerHTML='';openNow(st,[`삑, 삑, 삑— ${KP.buf}. 키패드에 초록불이 들어왔다.`,'철컹 — 철문이 열렸다!',['dojin','정답의 일의 자리를 이어 붙인 암호였어. 다음 구역으로!']]);return;}
  KP.buf='';ZV.AUDIO&&ZV.AUDIO.sfx('buzz');kpDraw('삐— 틀린 암호예요. 메모를 보고 각 정답의 일의 자리를 차례로 눌러 보세요.',true);},
 lvT:t=>{const s=lvState(ZV.curStage()),i=+t.dataset.i;s[i]=!s[i];ZV.save();ZV.drawScene();lvDraw();},
 lvOk:()=>{const st=ZV.curStage(),s=lvState(st),L=leverSet(st);
  if(s.every((u,i)=>u===L.pat[i])){$('#ov').innerHTML='';openNow(st,['레버를 당겼다. 덜컹, 덜컹……. 잠금쇠 네 개가 차례로 풀렸다.','철문이 열렸다!',['dojin','평균보다 큰지 작은지……. 그래프를 읽을 줄 알아야 열리는 문이었군.']]);return;}
  ZV.AUDIO&&ZV.AUDIO.sfx('buzz');lvDraw('덜컹! …… 레버가 걸려서 당겨지지 않아요. 네 값의 평균을 먼저 구해 보세요.',true);}};
ZV.stageClear=function(st){const L=ZV.stages(),G=ZV.G(),i=L.indexOf(st);G.flags['ins:'+st.id]=ZV.pieceNeed(st);G.flags['door:'+st.id]=1;ZV.say(st.outro,()=>{G.items=[];ZV.save();
  const next=()=>{if(i+1>=L.length){ZV.showEnding();}else ZV.enterStage(i+1,true);};
  if(st.after&&i+1<L.length)ZV.dialog(st.after,next);else next();});};

/* ================= MAP ================= */
ZV.mapOpen=function(){const L=ZV.stages(),cur=ZV.curStage(),G=ZV.G();
 /* 연구동 단면도: 지상에서 지하 깊은 곳까지 구역마다 한 칸. 각 칸은 그 방의 "보안 카메라 화면"(녹색 단색 + 주사선) */
 const RX=16,RW=92,RH=22,Y0=18,STEP=25,n=L.length,H=Y0+n*STEP+20,PH=RW*4/3;
 let d=`<defs>
  <pattern id="mgrid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#0f3d1c" stroke-width=".22"/></pattern>
  <pattern id="mrock" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="3.2" height="3.2" fill="#09120b"/><path d="M0 0V3.2" stroke="#16301c" stroke-width=".45"/></pattern>
  <pattern id="mscan" width="2" height="1.5" patternUnits="userSpaceOnUse"><rect width="2" height=".6" fill="#000" opacity=".3"/></pattern>
  <pattern id="mseal" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="2" height="4" fill="#b02a1e" opacity=".22"/></pattern>
  <filter id="mduo" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".24 .5 .1 0 0  .38 .85 .2 0 .03  .08 .3 .1 0 0  0 0 0 1 0"/></filter>
  <linearGradient id="mlab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".9"/></linearGradient>
  <linearGradient id="msky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0a0a"/><stop offset="1" stop-color="#0a1a10"/></linearGradient>
  ${L.map((s,i)=>`<clipPath id="mcp${i}"><rect x="${RX}" y="${Y0+i*STEP}" width="${RW}" height="${RH}" rx=".8"/></clipPath>`).join('')}</defs>`;
 d+=`<rect width="120" height="${H}" fill="#050c07"/><rect y="14" width="120" height="${H-14}" fill="url(#mrock)"/><rect width="120" height="${H}" fill="url(#mgrid)" opacity=".8"/>`;
 /* 지상 */
 d+=`<rect width="120" height="14" fill="url(#msky)"/><path d="M0 14H120" stroke="#7be04a" stroke-width=".7"/><path d="M0 14.9H120" stroke="#7be04a" stroke-width=".2" stroke-dasharray="1.5 1.2"/>
  <rect x="78" y="5" width="34" height="9" fill="#0d1f13" stroke="#7be04a" stroke-width=".5"/><path d="M82 5V2M108 5V1" stroke="#7be04a" stroke-width=".4"/><circle class="fl" cx="108" cy="1" r="1" fill="#ff3b30"/><rect x="82" y="8" width="5" height="3" fill="#3a2a0a" stroke="#ffd84a" stroke-width=".25"/><rect x="90" y="8" width="5" height="3" fill="#3a2a0a" stroke="#ffd84a" stroke-width=".25"/>
  <text x="4" y="8.4" font-size="3.5" fill="#e6ffd8" font-weight="700">지상 · 비상 통제실</text><text x="4" y="12" font-size="2.7" fill="#7da57c">한 소장 (무전 교신 중)</text>`;
 /* 고장 난 승강기 통로 */
 d+=`<rect x="3.5" y="14" width="9" height="${n*STEP+4}" fill="#060d08" stroke="#2f7d3a" stroke-width=".45"/><path d="M8 14V${14+n*STEP+4}M6.2 14V${14+n*STEP+4}M9.8 14V${14+n*STEP+4}" stroke="#1d4a28" stroke-width=".25"/>
  <rect x="5" y="${Y0+STEP*2.2}" width="6" height="8" fill="#150808" stroke="#b02a1e" stroke-width=".4"/><path d="M5.6 ${Y0+STEP*2.2+1}L10.4 ${Y0+STEP*2.2+7}M10.4 ${Y0+STEP*2.2+1}L5.6 ${Y0+STEP*2.2+7}" stroke="#b02a1e" stroke-width=".5"/>
  <text transform="translate(8.2,${Y0+STEP*4.2}) rotate(90)" font-size="2.6" fill="#7da57c" text-anchor="middle">승강기 고장 · 계단만 사용 가능</text>`;
 /* 구역(방)마다 한 칸 */
 L.forEach((s,i)=>{const y=Y0+i*STEP,done=ZV.stageDone(s),open=ZV.stageUnlocked(i),isCur=s===cur,pi=pieceInfo(s),IM=ZV.IMG&&ZV.IMG[s.id]&&ZV.IMG[s.id][0];
  const col=isCur?'#ffd84a':done?'#7be04a':open?'#4fa85a':'#31503a',op=isCur?1:open?.88:.42;
  d+=`<g class="mroom ${open?'open':'lock'}" ${open?`data-act="mapGo" data-i="${i}"`:`data-act="mapLock"`}>`;
  d+=`<rect x="${RX-1}" y="${y-1}" width="${RW+2}" height="${RH+2}" fill="#07140b" stroke="#1d4a28" stroke-width=".3"/>`;
  d+=`<g clip-path="url(#mcp${i})">`+(IM?`<image href="${IM.src}" x="${RX}" y="${(y+RH/2-.38*PH).toFixed(1)}" width="${RW}" height="${PH.toFixed(1)}" preserveAspectRatio="xMidYMid slice" filter="url(#mduo)" opacity="${op}"/>`:`<rect x="${RX}" y="${y}" width="${RW}" height="${RH}" fill="#0b1a0f"/>`)
   +`<rect x="${RX}" y="${y}" width="${RW}" height="${RH}" fill="url(#mscan)"/>`+(open?'':`<rect x="${RX}" y="${y}" width="${RW}" height="${RH}" fill="#000" opacity=".4"/><rect x="${RX}" y="${y}" width="${RW}" height="${RH}" fill="url(#mseal)"/>`)
   +`<rect x="${RX}" y="${y+RH-9.5}" width="${RW}" height="9.5" fill="url(#mlab)"/></g>`;
  d+=`<rect x="${RX}" y="${y}" width="${RW}" height="${RH}" rx=".8" fill="none" stroke="${col}" stroke-width="${isCur?1.1:.7}"/><rect x="${RX+.9}" y="${y+.9}" width="${RW-1.8}" height="${RH-1.8}" rx=".5" fill="none" stroke="${col}" stroke-width=".18" opacity=".6"/>`;
  d+=`<text x="${RX+2.6}" y="${y+4.4}" font-size="2.6" fill="#7be04a" opacity=".95">CAM ${String(i+1).padStart(2,'0')} · 지하 ${8+i*7}m</text>`;
  if(open&&!done)d+=`<circle class="fl" cx="${RX+RW-3.4}" cy="${y+3.6}" r=".95" fill="#ff3b30"/><text x="${RX+RW-5.4}" y="${y+4.4}" font-size="2.4" fill="#ff8a80" text-anchor="end">REC</text>`;
  d+=`<text x="${RX+2.6}" y="${y+RH-5.2}" font-size="4.1" font-weight="700" fill="${open?'#eaffe0':'#9aaa98'}">B${i+1} ${s.name}</text><text x="${RX+2.6}" y="${y+RH-1.5}" font-size="2.9" fill="${done?'#7be04a':open?'#bfe8b0':'#c0594c'}">${done?'해제 완료':open?`자물쇠 ${pi.solved}/${pi.total} 해제`:'봉쇄됨 · 앞 구역을 먼저 통과'}</text>`;
  for(let k=0;k<pi.total;k++){const cx=RX+RW-3.6-(pi.total-1-k)*3.3;d+=`<circle cx="${cx}" cy="${y+RH-3.6}" r="1.05" fill="${k<pi.solved?'#7be04a':'#240b0b'}" stroke="${k<pi.solved?'#d8ffc0':'#c0392b'}" stroke-width=".3"/>`;}
  if(isCur)d+=`<circle class="mping" cx="${RX+RW-10}" cy="${y+10}" r="2.2" fill="none" stroke="#ffd84a" stroke-width=".5"/><circle cx="${RX+RW-10}" cy="${y+10}" r="1.2" fill="#ffd84a"/><text x="${RX+RW-10}" y="${y+16.2}" font-size="2.7" fill="#ffd84a" text-anchor="middle" font-weight="700">현재 위치</text>`;
  else if(done)d+=`<circle cx="${RX+RW-10}" cy="${y+10}" r="3.2" fill="#0b2a12" stroke="#7be04a" stroke-width=".5"/><path d="M${RX+RW-11.8} ${y+10}l1.3 1.5 2.7-3" fill="none" stroke="#7be04a" stroke-width=".7" stroke-linecap="round"/>`;
  else if(!open)d+=`<g transform="translate(${RX+RW-10} ${y+9})"><rect x="-3" y="-.6" width="6" height="5" rx=".8" fill="#0a0f0b" stroke="#e0584a" stroke-width=".5"/><path d="M-2 -.6v-2a2 2 0 0 1 4 0v2" fill="none" stroke="#e0584a" stroke-width=".6"/><circle cy="1.9" r=".6" fill="#e0584a"/></g>`;
  d+=`<rect x="${RX}" y="${y}" width="${RW}" height="${RH}" fill="transparent"/></g>`;
  if(i<n-1){const sx=i%2===0?RX+RW-24:RX+5;d+=`<path d="M${sx} ${y+RH+2.4}l3 -1.8l3 1.8l3 -1.8l3 1.8l3 -1.8" fill="none" stroke="#7be04a" stroke-width=".4" opacity=".75"/><path d="M${sx+17} ${y+RH+.6}v1.8m-.9 -.8l.9 .9l.9 -.9" fill="none" stroke="#7be04a" stroke-width=".35" opacity=".75"/>`;}});
 /* 장(章) 표시 */
 const chs=[...new Set(L.map(s=>s.ch))];chs.forEach(c=>{const idx=L.map((s,i)=>s.ch===c?i:-1).filter(i=>i>=0),a=Y0+idx[0]*STEP,b=Y0+idx[idx.length-1]*STEP+RH,nm=((L[idx[0]].chName||'').split(' · ')[1]||'').split(' (')[0],mid=(a+b)/2;
  d+=`<path d="M110.2 ${a}h1.4v${b-a}h-1.4" fill="none" stroke="#7be04a" stroke-width=".4" opacity=".8"/><text transform="translate(116,${mid}) rotate(90)" font-size="3" fill="#bfe8b0" text-anchor="middle" letter-spacing=".3">${c}장 ${nm}</text>`;});
 /* 범례 */
 const ly=H-9;d+=`<g font-size="2.8" fill="#bfe8b0"><rect x="16" y="${ly}" width="3.2" height="3.2" fill="none" stroke="#ffd84a" stroke-width=".6"/><text x="20.6" y="${ly+2.7}">현재 위치</text><rect x="44" y="${ly}" width="3.2" height="3.2" fill="none" stroke="#7be04a" stroke-width=".6"/><text x="48.6" y="${ly+2.7}">들어갈 수 있음</text><rect x="78" y="${ly}" width="3.2" height="3.2" fill="#2a0c0c" stroke="#e0584a" stroke-width=".6"/><text x="82.6" y="${ly+2.7}">봉쇄됨</text></g>`;
 const cn=ZV.stages().indexOf(cur);
 $('#ov').innerHTML=`<div class="ov"><div class="box mapbox"><h2>MAP <span class="small">연구동 단면도 · 보안 카메라</span></h2><svg viewBox="0 0 120 ${H}" class="mapsvg" role="img" aria-label="연구동 단면도">${d}</svg><div class="small" id="mapMsg">지금 있는 곳: <b>${esc(cur.name)}</b> · 들어갈 수 있는 칸을 누르면 이동해요.</div><div class="inrow"><button class="btn ghost" data-act="close">닫기</button></div></div></div>`;};})();
