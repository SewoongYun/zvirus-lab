/* 좀비바이러스 연구실 — 음침한 배경음 (10차)
   · 소리 파일 없이 브라우저(Web Audio)가 직접 합성한다. 인터넷·외부 파일 필요 없음.
   · 구성: 낮게 깔리는 불협화 드론(단2도) + 지하 울림 + 바람 소리 + 가끔 들리는 물방울·쿵·쇠 삐걱·속삭임·불길한 화음
   · 구역(장)이 깊어질수록 기준음이 조금씩 내려간다. 브라우저 정책상 첫 터치/클릭 뒤에 시작된다.
   · build(ctx,dest) 와 schedule(G,t0,t1) 는 실제 재생과 검증(오프라인 렌더)에서 똑같이 쓴다. */
(function(){
'use strict';
const ZV=window.ZV;
const ROOTS={1:82.41,2:77.78,3:73.42,0:92.5};   /* E2, D#2, D2 (끝: 조금 밝게) */
const A=ZV.AUDIO={ctx:null,G:null,master:null,timer:null,started:false};
const rnd=(a,b)=>a+Math.random()*(b-a);

function noiseBuf(ctx,sec,brown){const n=Math.floor(ctx.sampleRate*sec),b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);let l=0;
 for(let i=0;i<n;i++){const w=Math.random()*2-1;if(brown){l=(l+0.02*w)/1.02;d[i]=l*3.2;}else d[i]=w;}
 const f=Math.floor(ctx.sampleRate*.05);for(let i=0;i<f;i++){const k=i/f;d[i]*=k;d[n-1-i]*=k;}return b;}
function impulse(ctx,sec,pow){const n=Math.floor(ctx.sampleRate*sec),b=ctx.createBuffer(2,n,ctx.sampleRate);
 for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,pow);}return b;}
function osc(ctx,type,f,out,g){const o=ctx.createOscillator(),gn=ctx.createGain();o.type=type;o.frequency.value=f;gn.gain.value=g;o.connect(gn);gn.connect(out);o.start();return{o,gn};}
function lfo(ctx,f,amt,target){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=f;g.gain.value=amt;o.connect(g);g.connect(target);o.start();return o;}

/* 소리 그래프를 만든다 (ctx: AudioContext 또는 OfflineAudioContext, dest: 마지막 출력) */
function build(ctx,dest,root){
 const G={ctx,root:root||ROOTS[1],next:{drip:3,thud:12,creak:16,whisper:22,swell:20,song:7}};
 const master=ctx.createGain();master.gain.value=.9;master.connect(dest);G.master=master;
 const rev=ctx.createConvolver();rev.buffer=impulse(ctx,3.4,2.4);const revG=ctx.createGain();revG.gain.value=.6;rev.connect(revG);revG.connect(master);G.rev=rev;
 const bus=ctx.createGain();bus.gain.value=1;bus.connect(master);bus.connect(rev);G.bus=bus;
 const dly=ctx.createDelay(1.5);dly.delayTime.value=.43;const fb=ctx.createGain();fb.gain.value=.42;const dlp=ctx.createBiquadFilter();dlp.type='lowpass';dlp.frequency.value=2400;
 dly.connect(dlp);dlp.connect(fb);fb.connect(dly);dlp.connect(rev);dlp.connect(master);G.dly=dly;
 const mb=ctx.createGain();mb.gain.value=1.6;mb.connect(bus);mb.connect(dly);G.mb=mb;G.shift=0;G.major=false;   /* 노래(오르골·패드·베이스)가 지나가는 길 */
 /* 드론 */
 const dl=ctx.createBiquadFilter();dl.type='lowpass';dl.frequency.value=380;dl.Q.value=2.2;const dg=ctx.createGain();dg.gain.value=.34;dl.connect(dg);dg.connect(bus);
 G.drone=[osc(ctx,'sine',root/2,dl,.55),osc(ctx,'sawtooth',root,dl,.2),osc(ctx,'sawtooth',root*1.0595,dl,.12),osc(ctx,'triangle',root*1.5,dl,.12),osc(ctx,'sine',root*2,dl,.08)];
 lfo(ctx,.043,170,dl.frequency);                                   /* 필터가 천천히 열렸다 닫힘 */
 lfo(ctx,.067,.45,G.drone[1].o.frequency);lfo(ctx,.052,.55,G.drone[2].o.frequency);   /* 미세한 흔들림 */
 lfo(ctx,.029,.09,dg.gain);                                        /* 숨 쉬듯 커졌다 작아짐 */
 G.dg=dg;
 /* 지하 울림(갈색 소음) + 바람 */
 const br=ctx.createBufferSource();br.buffer=noiseBuf(ctx,8,true);br.loop=true;const bl=ctx.createBiquadFilter();bl.type='lowpass';bl.frequency.value=140;const bg=ctx.createGain();bg.gain.value=.3;br.connect(bl);bl.connect(bg);bg.connect(master);br.start();
 const wn=ctx.createBufferSource();wn.buffer=noiseBuf(ctx,6,false);wn.loop=true;const wb=ctx.createBiquadFilter();wb.type='bandpass';wb.frequency.value=520;wb.Q.value=11;const wg=ctx.createGain();wg.gain.value=.02;wn.connect(wb);wb.connect(wg);wg.connect(bus);wn.start();
 lfo(ctx,.031,260,wb.frequency);lfo(ctx,.057,.013,wg.gain);
 G.noiseBuf=noiseBuf(ctx,2,false);
 return G;}

/* 사건 소리들: 정해진 시각 t(초)에 예약 */
function env(G,node,t,peak,a,d){const g=node.gain;g.setValueAtTime(0.0001,t);g.exponentialRampToValueAtTime(peak,t+a);g.exponentialRampToValueAtTime(0.0001,t+a+d);}
const EV={
 drip(G,t){const c=G.ctx,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=rnd(900,2300);o.connect(g);g.connect(G.bus);g.connect(G.dly);env(G,g,t,.11,.004,.32);o.start(t);o.stop(t+.5);},
 thud(G,t){const c=G.ctx,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(rnd(60,75),t);o.frequency.exponentialRampToValueAtTime(34,t+.5);o.connect(g);g.connect(G.bus);env(G,g,t,.5,.01,.7);o.start(t);o.stop(t+1);},
 creak(G,t){const c=G.ctx,o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain(),v=c.createOscillator(),vg=c.createGain();o.type='sawtooth';const f0=rnd(120,190);o.frequency.setValueAtTime(f0,t);o.frequency.linearRampToValueAtTime(f0*rnd(.5,.75),t+1.7);
  f.type='bandpass';f.frequency.value=rnd(380,620);f.Q.value=7;v.frequency.value=rnd(6,10);vg.gain.value=9;v.connect(vg);vg.connect(o.frequency);o.connect(f);f.connect(g);g.connect(G.bus);env(G,g,t,.05,.5,1.4);o.start(t);v.start(t);o.stop(t+2.2);v.stop(t+2.2);},
 whisper(G,t){const c=G.ctx,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),p=c.createStereoPanner?c.createStereoPanner():null;s.buffer=G.noiseBuf;s.loop=true;f.type='bandpass';f.frequency.value=rnd(1800,3000);f.Q.value=3.5;s.connect(f);f.connect(g);
  if(p){p.pan.value=rnd(-.8,.8);g.connect(p);p.connect(G.bus);}else g.connect(G.bus);env(G,g,t,.04,1.4,2.2);s.start(t);s.stop(t+4);},
 swell(G,t){const c=G.ctx,r=G.root*4,g=c.createGain();g.connect(G.bus);[r,r*1.0595,r*1.498].forEach((f,i)=>{const o=c.createOscillator(),og=c.createGain();o.type='sine';o.frequency.value=f;og.gain.value=i?.6:1;o.connect(og);og.connect(g);o.start(t);o.stop(t+8.5);});env(G,g,t,.05,3.6,4.4);}
};
/* ---------- 노래: 느린 단조 오르골 자장가 (54 BPM, 8마디 = 약 36초, 곡 사이에 쉼) ----------
   멜로디 숫자는 E5(미)를 0으로 한 반음 수. 3마디의 -1(레#)과 7마디의 1(파)은 일부러 넣은 불안한 음 */
const BEAT=60/54;
const MEL=[
 [[0,0,1],[1,3,1],[2,7,1.5],[3.5,5,.5]],
 [[0,3,2],[2,2,1],[3,0,1]],
 [[0,0,1],[1,3,1],[2,8,1.5],[3.5,7,.5]],
 [[0,5,1],[1,2,1],[2,-1,2]],
 [[0,5,1],[1,8,1],[2,12,1.5],[3.5,10,.5]],
 [[0,8,2],[2,7,1],[3,3,1]],
 [[0,5,1],[1,2,1],[2,1,1],[3,0,1]],
 [[0,0,4]]];
const CHORDS=['E','E','C','B','A','C','B','E'];
const PAD={E:[-24,-21,-17],C:[-28,-24,-21],B:[-29,-25,-22],A:[-31,-28,-24]},PADMAJ={E:[-24,-20,-17],C:[-28,-24,-21],B:[-29,-25,-22],A:[-31,-27,-24]};
const BASS={E:-36,C:-40,B:-41,A:-43},MAJ={3:4,8:9,10:11,1:2};
const fq=s=>659.26*Math.pow(2,s/12);
function bell(G,t,s,dur,vel){const c=G.ctx,g=c.createGain(),o1=c.createOscillator(),o2=c.createOscillator(),g2=c.createGain(),f=fq(s);
 o1.type='sine';o1.frequency.value=f;o1.detune.value=rnd(-14,14);o2.type='sine';o2.frequency.value=f*3.01;g2.gain.value=.2;o1.connect(g);o2.connect(g2);g2.connect(g);g.connect(G.mb);
 const L=Math.max(1.5,dur*1.3);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(.17*vel,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+L);o1.start(t);o2.start(t);o1.stop(t+L+.1);o2.stop(t+L+.1);}
function pad(G,t,tones,bass,len){const c=G.ctx,g=c.createGain(),f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=950;f.connect(g);g.connect(G.mb);
 g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(.05,t+1.5);g.gain.setValueAtTime(.05,t+len-1.5);g.gain.linearRampToValueAtTime(.0001,t+len+.4);
 tones.forEach((s,i)=>{const o=c.createOscillator();o.type=i%2?'sine':'triangle';o.frequency.value=fq(s);o.detune.value=rnd(-6,6);o.connect(f);o.start(t);o.stop(t+len+.6);});
 const bo=c.createOscillator(),bg=c.createGain();bo.type='sine';bo.frequency.value=fq(bass);bo.connect(bg);bg.connect(G.mb);bg.gain.setValueAtTime(0.0001,t);bg.gain.linearRampToValueAtTime(.12,t+.8);bg.gain.setValueAtTime(.12,t+len-1.2);bg.gain.linearRampToValueAtTime(.0001,t+len+.2);bo.start(t);bo.stop(t+len+.4);}
EV.song=function(G,t){const sh=G.shift||0,mj=!!G.major;
 for(let b=0;b<8;b++){const tb=t+b*4*BEAT,k=CHORDS[b];pad(G,tb,(mj?PADMAJ:PAD)[k].map(s=>s+sh),BASS[k]+sh,4*BEAT);
  for(const[bt,s,d]of MEL[b]){const n=(mj&&MAJ[s]!==undefined)?MAJ[s]:s;bell(G,tb+bt*BEAT+rnd(-.012,.012),n+sh,d*BEAT,rnd(.72,1));}}};
const GAP={song:[64,64],drip:[4,11],thud:[14,32],creak:[18,45],whisper:[25,55],swell:[28,60]};
function schedule(G,t0,t1){for(const k in EV){while(G.next[k]<t1){const t=Math.max(G.next[k],t0);EV[k](G,t);G.next[k]+=rnd(GAP[k][0],GAP[k][1]);}}}
A._build=build;A._schedule=schedule;A.ROOTS=ROOTS;

/* ---------- 실제 재생 ---------- */
const S=()=>ZV.S.settings;
const target=()=>(S().sound&&!ZV.introOn?Math.pow(S().vol==null?.6:S().vol,1.6)*.9:0);
A.unlock=function(){if(!S().sound)return;if(A.ctx&&A.ctx.state==='running'){A.apply();A.wake();return;}
 try{if(!A.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC){A.err=new Error("Web Audio 미지원");A.wake();return;}const ctx=new AC(),out=ctx.createGain();out.gain.value=0;out.connect(ctx.destination);
   const comp=ctx.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=4;comp.connect(out);
   A.ctx=ctx;A.out=out;A.sfxOut=comp;ctx.onstatechange=()=>A.wake();A.G=build(ctx,comp,ROOTS[A.ch||1]);A.G.mb.gain.value=S().music===false?0:1.6;A.G.shift=SHIFT[A.ch||1]||0;A.G.major=false;A.timer=setInterval(()=>{if(A.ctx.state==='running')schedule(A.G,A.ctx.currentTime,A.ctx.currentTime+14);},4000);}
  A.apply();schedule(A.G,A.ctx.currentTime,A.ctx.currentTime+14);}catch(e){A.err=e;if(window.console)console.warn('audio',e);}setTimeout(A.wake,500);};
A.apply=function(){if(!A.ctx)return;const t=A.ctx.currentTime;A.out.gain.cancelScheduledValues(t);A.out.gain.setTargetAtTime(target(),t,.35);if(A.G)A.G.mb.gain.setTargetAtTime(S().music===false?0:1.6,t,.6);
 clearTimeout(A.sleepTimer);
 if(!S().sound)A.sleepTimer=setTimeout(()=>{if(!S().sound&&A.ctx&&A.ctx.state==='running')A.ctx.suspend().catch(e=>{A.err=e;A.wake();});},1600);
 else if(A.ctx.state!=='running'&&A.ctx.state!=='closed')A.ctx.resume().then(()=>{A.err=null;A.wake();}).catch(e=>{A.err=e;A.wake();});};
A.toggle=function(){S().sound=!S().sound;ZV.save();if(S().sound)A.unlock();else A.apply();A.wake();};
A.toggleEffects=function(){S().effects=S().effects===false;ZV.save();A.wake();};
A.toggleMusic=function(){S().music=S().music===false;ZV.save();A.apply();};
A.setVol=function(v){S().vol=Math.max(0,Math.min(1,v));ZV.save();if(S().sound&&!A.ctx)A.unlock();else A.apply();};
const SHIFT={1:0,2:-1,3:-2,0:0};
A.mood=function(ch){A.ch=ch;if(!A.ctx||!A.G)return;A.G.shift=SHIFT[ch]||0;A.G.major=ch===0;const r=ROOTS[ch]||ROOTS[1],t=A.ctx.currentTime,d=A.G.drone;A.G.root=r;
 d[0].o.frequency.setTargetAtTime(r/2,t,3);d[1].o.frequency.setTargetAtTime(r,t,3);d[2].o.frequency.setTargetAtTime(r*(ch===0?1.2599:1.0595),t,3);d[3].o.frequency.setTargetAtTime(r*1.5,t,3);d[4].o.frequency.setTargetAtTime(r*2,t,3);};
document.addEventListener('visibilitychange',()=>{if(!A.ctx)return;if(document.visibilityState==='hidden'){if(A.ctx.state==='running')A.ctx.suspend().catch(e=>{A.err=e;});}else if(S().sound)A.unlock();});
/* 소리가 막혔을 때(터치 기기·자동재생 제한 등) 눈에 보이는 "소리 켜기" 버튼을 띄운다 */
A.status=()=>!S().sound?'전체 소리 꺼짐':S().vol===0?'음량 0%':A.err?'소리 시작 실패 — 화면을 눌러 다시 시도':!A.ctx?'대기 중 — 시작 버튼을 눌러 주세요':A.ctx.state==='running'?'재생 중':'소리 시작 대기 — 소리 켜기를 눌러 주세요';
A.wake=function(){let b=document.getElementById('sndwake');const need=S().sound&&!(A.ctx&&A.ctx.state==='running');
 if(need&&!b){b=document.createElement('button');b.id='sndwake';b.className='sndwake';b.type='button';b.textContent='소리 켜기';document.body.appendChild(b);}
 if(!need&&b)b.remove();document.querySelectorAll('[data-audio-status]').forEach(el=>el.textContent='소리 상태: '+A.status());};
/* 진단도 게임과 동일한 AudioContext·음량·출력 경로를 사용한다. */
A.test=function(){A.unlock();if(!S().sound||!A.ctx)return;const play=()=>{if(A.ctx.state!=='running')return;const c=A.ctx,t=c.currentTime+.03;
 [523.25,659.26,783.99].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.frequency.value=f;o.connect(g);g.connect(A.sfxOut);g.gain.setValueAtTime(.0001,t+i*.18);g.gain.exponentialRampToValueAtTime(.3,t+i*.18+.015);g.gain.exponentialRampToValueAtTime(.0001,t+i*.18+.4);o.start(t+i*.18);o.stop(t+i*.18+.45);});};
 if(A.ctx.state==='running')play();else A.ctx.resume().then(play).catch(e=>{A.err=e;A.wake();});};
/* 브라우저가 "사용자가 직접 조작했다"고 인정하는 이벤트는 기기마다 다르다(마우스=pointerdown, 터치=touchend/click). 전부 듣는다. */
['pointerdown','pointerup','touchend','mousedown','click','keydown'].forEach(ev=>document.addEventListener(ev,()=>{A.unlock();},{passive:true,capture:true}));
setInterval(A.wake,1200);
/* 효과음(자물쇠·문): 소리가 켜져 있고 재생 중일 때만 */
A.sfx=function(name,delay=0){if(!S().sound||S().effects===false||!A.ctx||A.ctx.state!=='running'||!A.G)return;const c=A.ctx,T=c.currentTime+.03+delay,out=A.sfxOut;
 const burst=(t,f,q,len,peak)=>{const s=c.createBufferSource(),b=c.createBiquadFilter(),g=c.createGain();s.buffer=A.G.noiseBuf;s.loop=true;b.type='bandpass';b.frequency.value=f;b.Q.value=q;s.connect(b);b.connect(g);g.connect(out);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+len);s.start(t);s.stop(t+len+.05);};
 const tone=(t,type,f0,f1,len,peak,lp)=>{const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+len);let n=o;if(lp){const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;o.connect(f);n=f;}n.connect(g);g.connect(out);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+len);o.start(t);o.stop(t+len+.05);};
 if(name==='unlock'){burst(T,3600,6,.05,.5);burst(T+.13,2800,6,.05,.45);tone(T+.2,'sawtooth',170,330,.28,.1,900);burst(T+.5,900,3,.12,.6);tone(T+.5,'sine',95,48,.35,.55);}
 else if(name==='door'){burst(T,5200,.7,1.5,.5);tone(T,'sawtooth',130,55,1.1,.12,520);tone(T+.05,'sine',60,36,1.3,.5);burst(T+.85,700,2.5,.2,.6);tone(T+.85,'sine',80,40,.5,.6);}
 /* 13차: 틀린 암호·순서(삐-삐-) / 전원 복구(웅— 올라가는 소리) */
 else if(name==='buzz'){tone(T,'square',150,140,.28,.09,1100);tone(T+.34,'square',150,140,.38,.09,1100);}
 else if(name==='power'){burst(T,1800,2,.25,.35);tone(T,'sawtooth',45,180,1.3,.11,650);tone(T+.9,'sine',120,240,.6,.18);}
 else if(name==='heart'){tone(T,'sine',70,38,.16,.6);tone(T+.22,'sine',60,34,.2,.42);}
 else if(name==='knock'){[0,.28,.56].forEach(d=>{tone(T+d,'sine',95,45,.22,.7);burst(T+d,300,1.5,.12,.5);});}
 else if(name==='static'){burst(T,3200,.6,.5,.22);burst(T+.18,6000,1,.3,.16);}
 else if(name==='paper'){burst(T,4200,1.2,.16,.2);burst(T+.12,2600,1.5,.2,.16);}
 else if(name==='sting'){tone(T,'sine',220,208,.9,.14);tone(T,'sine',311,300,.9,.1);}};
ZV.BACT.sndVol=t=>A.setVol(+t.value/100);
})();
