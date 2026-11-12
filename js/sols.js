/* 좀비바이러스 연구실 — 15차 단계별 풀이 (자물쇠를 푼 뒤에만 보여 준다)
   ZV.SOL[문항 id]=(P,B)=>[단계, 단계, …]  · P=문항 값, B=build 결과 */
(function(){
'use strict';
const ZV=window.ZV,{fact,nPr,nCr,frac,TBL}=ZV;
const fr=(a,b)=>{const f=frac(a,b);return f.q===1?String(f.p):`${f.p}/${f.q}`;};
const t4=z=>TBL[z].toFixed(4),d=(v,k=2)=>(+v.toFixed(k)).toString();
const pqEnd=B=>`기약분수 <b>${B.ans.p}/${B.ans.q}</b> 이므로 p+q = <b>${B.ans.v}</b>`;
const S={
c1a:({a,b,c})=>[`동쪽 복도: 문을 연달아 고르므로 곱의 법칙 → ${a}×${b} = <b>${a*b}</b>가지`,`서쪽 복도: <b>${c}</b>가지`,`두 복도 중 하나만 지나므로 합의 법칙 → ${a*b}+${c} = <b>${a*b+c}</b>가지`],
c1b:({n,r})=>[`서로 다른 ${n}개에서 ${r}개를 골라 <b>순서대로</b> 늘어놓으므로 순열 <sub>${n}</sub>P<sub>${r}</sub>`,`${Array.from({length:r},(_,i)=>n-i).join('×')} = <b>${nPr(n,r)}</b>`],
c1c:({n,r})=>[`조건 없이 ${n}종에서 ${r}종을 고르는 경우: <sub>${n}</sub>C<sub>${r}</sub> = <b>${nCr(n,r)}</b>`,`빼야 할 경우(A와 B를 함께 고름): A, B를 먼저 넣고 나머지 ${n-2}종에서 ${r-2}종 → <sub>${n-2}</sub>C<sub>${r-2}</sub> = <b>${nCr(n-2,r-2)}</b>`,`전체에서 뺀다 → ${nCr(n,r)}−${nCr(n-2,r-2)} = <b>${nCr(n,r)-nCr(n-2,r-2)}</b>`],
c1d:({n,r})=>[`맨 앞자리: 1을 뺀 <b>${n-1}</b>가지`,`나머지 ${r-1}자리: 같은 숫자를 또 써도 되므로 자리마다 ${n}가지 → ${n}<sup>${r-1}</sup> = <b>${n**(r-1)}</b> (중복순열)`,`곱의 법칙 → ${n-1}×${n**(r-1)} = <b>${(n-1)*n**(r-1)}</b>`],
c1e:({n})=>[`원형으로 앉으면 돌려서 같은 것은 한 가지로 센다. 한 명의 자리를 고정한다.`,`나머지 ${n-1}명을 한 줄로 세우는 것과 같다 → (${n}−1)! = ${n-1}! = <b>${fact(n-1)}</b>`],
c2a:({a,b,c})=>{const N=a+b+c;return[`모두 ${N}개를 한 줄로 늘어놓는다. 모두 다르다면 ${N}! 가지`,`같은 것끼리는 자리를 바꿔도 같은 배열이므로 ${a}!, ${b}!, ${c}! 로 나눈다 (같은 것이 있는 순열)`,`${N}! ÷ (${a}!×${b}!×${c}!) = <b>${fact(N)/(fact(a)*fact(b)*fact(c))}</b>`];},
c2b:({n,k})=>[`서로 다른 보관함 ${k}개에서 <b>중복을 허락하여</b> ${n}번 고르는 것과 같다 → 중복조합 <sub>${k}</sub>H<sub>${n}</sub>`,`<sub>${k}</sub>H<sub>${n}</sub> = <sub>${k}+${n}−1</sub>C<sub>${n}</sub> = <sub>${n+k-1}</sub>C<sub>${n}</sub> (앰플 ○ ${n}개와 칸막이 | ${k-1}개를 한 줄로 늘어놓기)`,`= <b>${nCr(n+k-1,n)}</b>`],
c2c:({n,k,a})=>[`(${a}x+1)<sup>${n}</sup> 의 일반항: <sub>${n}</sub>C<sub>r</sub> (${a}x)<sup>r</sup> · 1<sup>${n}−r</sup>`,`x<sup>${k}</sup> 항은 r = ${k} 일 때 → <sub>${n}</sub>C<sub>${k}</sub> × ${a}<sup>${k}</sup>`,`${nCr(n,k)} × ${a**k} = <b>${nCr(n,k)*a**k}</b>`],
c2d:({R,U,px,py})=>{const s1=nCr(px+py,px),s2=nCr(R-px+U-py,R-px);return[`A → P: →가 ${px}번, ↑가 ${py}번 → 같은 것이 있는 순열 ${px+py}!/(${px}!×${py}!) = <b>${s1}</b>`,`P → B: →가 ${R-px}번, ↑가 ${U-py}번 → ${R-px+U-py}!/(${R-px}!×${U-py}!) = <b>${s2}</b>`,`P를 지나 이어서 가므로 곱의 법칙 → ${s1}×${s2} = <b>${s1*s2}</b>`];},
c3a:({a,N})=>[`수학적 확률: 20칸 중 양성 ${a}칸 → ${a}/20 = <b>${fr(a,20)}</b>`,`시행 횟수가 많으면 상대도수는 수학적 확률에 가까워진다.`,`예상 횟수 = ${N} × ${fr(a,20)} = <b>${N*a/20}</b>번`],
c3b:({n},B)=>[`"적어도 한 개 앞면"의 여사건은 "<b>모두 뒷면</b>"`,`모두 뒷면일 확률 = (1/2)<sup>${n}</sup> = 1/${2**n}`,`1 − 1/${2**n} = <b>${2**n-1}/${2**n}</b>`,pqEnd(B)],
c3c:(P,B)=>{let A=0,Bn=0,AB=0;for(let i=1;i<=6;i++)for(let j=1;j<=6;j++){const a=(i+j)%4===0,b=i%2===1&&j%2===1;if(a)A++;if(b)Bn++;if(a&&b)AB++;}
 return[`A(합이 4의 배수: 합 4, 8, 12): <b>${A}</b>칸 → P(A) = ${A}/36`,`B(곱이 홀수 = 두 눈 모두 홀수): 3×3 = <b>${Bn}</b>칸 → P(B) = ${Bn}/36`,`A∩B(둘 다): <b>${AB}</b>칸 → P(A∩B) = ${AB}/36`,`덧셈정리 P(A∪B) = P(A)+P(B)−P(A∩B) = (${A}+${Bn}−${AB})/36 = ${A+Bn-AB}/36`,pqEnd(B)];},
c3d:({prev,sens,fpr},B)=>{const inf=prev*100,non=10000-inf,tp=prev*sens,fp=(100-prev)*fpr;return[`10,000명 중 감염자 ${prev}% = <b>${inf}</b>명, 비감염자 <b>${non}</b>명`,`감염자 중 양성: ${inf}×${sens}% = <b>${tp}</b>명 (진짜 양성)`,`비감염자 중 양성: ${non}×${fpr}% = <b>${fp}</b>명 (가짜 양성)`,`양성인 사람은 모두 ${tp}+${fp} = <b>${tp+fp}</b>명. 이 중 감염자는 ${tp}명`,`P(감염 | 양성) = ${tp}/${tp+fp}`,pqEnd(B)];},
c4a:({a,b},B)=>{const n=a+b;return[`첫 번째가 빨간 시료일 확률: ${a}/${n}`,`꺼낸 것을 다시 넣지 않으므로 빨간 시료 ${a-1}개, 전체 ${n-1}개가 남는다 → 두 번째도 빨간 시료일 확률: ${a-1}/${n-1}`,`곱셈정리 → (${a}/${n})×(${a-1}/${n-1}) = ${a*(a-1)}/${n*(n-1)}`,pqEnd(B)];},
c4b:({da,db},B)=>[`P(B) = x 라 하자. 독립이므로 P(A∩B) = P(A)P(B) = x/${da}`,`P(A∪B) = P(A)+P(B)−P(A∩B) = 1/${da} + x − x/${da} = ${fr(db+da-1,da*db)}`,`풀면 x = P(B) = <b>1/${db}</b>`,`P(A∩B) = (1/${da})×(1/${db}) = <b>1/${da*db}</b>`,pqEnd(B)],
c4c:({n,q,k},B)=>[`독립시행: ${n}번 중 ${k}번 성공하는 자리 고르기 → <sub>${n}</sub>C<sub>${k}</sub> = <b>${nCr(n,k)}</b>`,`성공 ${k}번: (1/${q})<sup>${k}</sup>, 실패 ${n-k}번: (${q-1}/${q})<sup>${n-k}</sup>`,`${nCr(n,k)} × ${(q-1)**(n-k)} / ${q}<sup>${n}</sup> = ${nCr(n,k)*(q-1)**(n-k)}/${q**n}`,pqEnd(B)],
c4d:({s},B)=>{const L=[],E=[];for(let i=1;i<=6;i++)for(let j=1;j<=6;j++)if(i+j===s){L.push(`(${i},${j})`);if(i%2===0&&j%2===0)E.push(`(${i},${j})`);}
 return[`조건(합이 ${s})을 만족하는 경우만 남긴다: ${L.join(', ')} → <b>${L.length}</b>가지`,`그중 두 눈이 모두 짝수: ${E.length?E.join(', '):'없음'} → <b>${E.length}</b>가지`,`P(B|A) = n(A∩B)/n(A) = ${E.length}/${L.length}`,pqEnd(B)];},
c5a:({m,t},B)=>{const T=m*(m+1)/2;let up=0;for(let x=t;x<=m;x++)up+=x;return[`확률의 합이 1: k(1+2+…+${m}) = ${T}k = 1 → <b>k = 1/${T}</b>`,`P(X≥${t}) = k(${Array.from({length:m-t+1},(_,i)=>t+i).join('+')}) = ${up}k = ${up}/${T}`,pqEnd(B)];},
c5b:({a})=>[`표에서 E(X) = Σ x·P(X=x), E(X²) = Σ x²·P(X=x) 를 구한다.`,`V(X) = E(X²) − {E(X)}² = <b>0.75</b>`,`V(aX+b) = a²V(X) 이므로 V(${a}X+1) = ${a}²×0.75 = <b>${d(a*a*.75)}</b> (더한 1은 분산에 영향을 주지 않는다)`],
c5c:({n,q})=>{const E=n/q,V=n*(q-1)/(q*q);return[`이항분포 B(n, p): E(X) = np = ${n}×1/${q} = <b>${d(E)}</b>`,`V(X) = np(1−p) = ${n}×(1/${q})×(${q-1}/${q}) = <b>${d(V)}</b>`,`V(X) = E(X²) − {E(X)}² 이므로 E(X²) = V(X) + {E(X)}²`,`= ${d(V)} + ${d(E)}² = <b>${d(V+E*E)}</b>`];},
c5d:({m,s,z1,z2})=>[`표준화 Z = (X−${m})/${s}`,`${m-z1*s} ≤ X ≤ ${m+z2*s} ⇔ −${z1} ≤ Z ≤ ${z2}`,`P(−${z1} ≤ Z ≤ 0) = P(0 ≤ Z ≤ ${z1}) = ${t4(z1)} (좌우 대칭), P(0 ≤ Z ≤ ${z2}) = ${t4(z2)}`,`${t4(z1)} + ${t4(z2)} = <b>${(TBL[z1]+TBL[z2]).toFixed(4)}</b>`],
c5e:({m,t},B)=>[`전체 넓이가 1: 밑변 ${m}, 높이 ${m}k 인 삼각형 → ½×${m}×${m}k = 1 → <b>k = 2/${m*m}</b>`,`P(X ≤ ${t}) = ½×${t}×${t}k = ${t*t}/${m*m}`,`P(X ≥ ${t}) = 1 − ${t*t}/${m*m} = ${m*m-t*t}/${m*m}`,pqEnd(B)],
c6a:({m,s,z})=>[`P(X ≥ k) = ${(0.5-TBL[z]).toFixed(4)} = 0.5 − ${t4(z)}`,`표에서 P(0 ≤ Z ≤ ${z}) = ${t4(z)} 이므로 P(Z ≥ <b>${z}</b>) = ${(0.5-TBL[z]).toFixed(4)}`,`(k − ${m})/${s} = ${z} → k = ${m} + ${z}×${s} = <b>${d(m+z*s)}</b>`],
c6b:({n,z})=>{const mu=n/2,sg=Math.sqrt(n)/2;return[`평균 np = ${n}×½ = <b>${mu}</b>, 분산 np(1−p) = ${n}×½×½ = ${n/4} → 표준편차 <b>${d(sg)}</b>`,`X는 근사적으로 N(${mu}, ${d(sg)}²) 을 따른다.`,`P(X ≥ ${mu+z*sg}) = P(Z ≥ (${mu+z*sg}−${mu})/${d(sg)}) = P(Z ≥ ${z})`,`= 0.5 − ${t4(z)} = <b>${(0.5-TBL[z]).toFixed(4)}</b>`];},
c6c:({m,s,n,z})=>{const se=s/Math.sqrt(n);return[`표본평균 X̄ 는 N(${m}, ${s}²/${n}) 을 따른다 → 표준편차 ${s}/√${n} = <b>${d(se)}</b>`,`P(X̄ ≤ ${d(m+z*se)}) = P(Z ≤ (${d(m+z*se)}−${m})/${d(se)}) = P(Z ≤ ${z})`,`= 0.5 + ${t4(z)} = <b>${(0.5+TBL[z]).toFixed(4)}</b>`];},
c6d:({n,xb,s})=>{const se=s/Math.sqrt(n);return[`신뢰도 95% 신뢰구간: x̄ − 1.96·σ/√n ≤ m ≤ x̄ + 1.96·σ/√n`,`σ/√n = ${s}/√${n} = <b>${d(se,4)}</b>`,`a = ${xb} − 1.96×${d(se,4)} = <b>${(xb-1.96*se).toFixed(2)}</b>`];},
c6e:({t},B)=>{const C=[1,3,3,5];let g=0;for(const a of C)for(const b of C)if(a+b>=2*t)g++;return[`복원추출 2번 → 모든 경우 4×4 = <b>16</b>가지 (3이 적힌 카드 두 장은 서로 다른 카드로 센다)`,`X̄ ≥ ${t} ⇔ 두 수의 합 ≥ ${2*t}`,`표에서 합이 ${2*t} 이상인 칸을 세면 <b>${g}</b>가지 → ${g}/16`,pqEnd(B)];},
c7a:({n,ph})=>{const se=Math.sqrt(ph*(1-ph)/n);return[`모비율의 신뢰도 95% 신뢰구간: p̂ − 1.96√(p̂(1−p̂)/n) ≤ p ≤ p̂ + 1.96√(p̂(1−p̂)/n)`,`√(${ph}×${d(1-ph)}/${n}) = <b>${d(se,4)}</b>`,`a = ${ph} − 1.96×${d(se,4)} = <b>${(ph-1.96*se).toFixed(4)}</b>`];},
c7b:({s,L})=>{const x=(3.92*s/L)**2;return[`신뢰도 95% 신뢰구간의 길이 = 2×1.96×σ/√n = 3.92×${s}/√n`,`3.92×${s}/√n ≤ ${L} → √n ≥ ${d(3.92*s/L,4)}`,`n ≥ ${d(x,2)} → 자연수 n의 최솟값은 <b>${Math.ceil(x-1e-9)}</b>`];}
};
ZV.SOL=S;
/* 정답을 맞힌 뒤 문제 창에 넣는 풀이 상자 */
ZV.solHTML=function(){const C=ZV.CUR,f=C&&S[C.id];if(!f)return'';let L;try{L=f(C.P,C.B);}catch(e){return'';}
 return`<details class="sol" open><summary>단계별 풀이 보기</summary><ol>${L.map(x=>`<li>${x}</li>`).join('')}</ol><div class="solans">정답: <b>${ZV.ansText(C.B.ans)}</b></div></details>`;};
})();
