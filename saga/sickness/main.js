const $=id=>document.getElementById(id);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const lerp=(a,b,k)=>a+(b-a)*k;
const END=64;
let t0=0,playing=false,done={},nxt={},lastChord=-1,lastNote=-1,lastSub='';

/* ---------- script ---------- */
const LINES=[
 [20.3,24.0,'pietro','Pietro','Look who crawled back in. Anna… and her shadow, Lina.','p1'],
 [24.05,26.3,'elisa','Elisa','Strutting in like she owns the whole realm.','e1'],
 [26.6,28.7,'lina','Lina','They\u2019re staring at us again.','l1'],
 [28.8,30.3,'anna','Anna','Let them stare.','a1'],
 [38.2,42.2,'t0','Traveler','Water… please. We\u2019ve come from the east…','t1'],
 [42.95,46.55,'t0','Traveler','The villages there… are empty now.','t2'],
 [46.9,48.9,'elisa','Elisa','<i>(whispering)</i> Pietro… look at their skin.','e2'],
 [49.0,50.9,'pietro','Pietro','Don\u2019t breathe their air.','p2'],
 [51.2,53.7,'anna','Anna','Gods above… what have they brought here?','a2']];
const SHOTS=[ // [start, scene, cx0,cy0,z0, cx1,cy1,z1]
 [0,'ext',430,420,1.05,760,420,1.2],
 [12,'int',640,392,1.0,640,384,1.05],
 [20,'int',292,340,2.1,292,336,2.2],
 [26.4,'int',996,340,2.1,996,336,2.2],
 [30.5,'int',640,380,1.0,640,372,1.03],
 [38,'int',640,300,2.6,640,296,2.75],
 [46.7,'int',292,338,2.15,292,334,2.3],
 [51.0,'int',996,338,2.15,996,334,2.3],
 [53.8,'int',640,380,1.02,640,380,1.08],
 [55.4,'ext',720,400,1.18,680,390,1.05]];
const TR=[{a:31.6,x:640,y:262,s:.66,ph:0},{a:32.5,x:548,y:278,s:.6,ph:1.9},{a:33.3,x:738,y:282,s:.58,ph:3.3}];
const cam=$('cam');
function setCam(cx,cy,z){cam.setAttribute('transform',`translate(640,360) scale(${z}) translate(${-cx},${-cy})`)}
function shotAt(t){let s=SHOTS[0],e=END;for(let i=0;i<SHOTS.length;i++)if(t>=SHOTS[i][0]){s=SHOTS[i];e=SHOTS[i+1]?SHOTS[i+1][0]:END}return [s,seg(t,s[0],e)]}
function speaking(who,t){for(const L of LINES)if(L[2]===who&&t>=L[0]&&t<L[1])return 1;return 0}
function mouthK(t,ph){return (Math.sin(t*17+ph)+Math.sin(t*11.3+ph*2))>-.3?.45+.55*Math.abs(Math.sin(t*23+ph)):.08}
function blinkAt(t,ph){return ((t+ph*1.7)%3.7)<.13}
function tCough(i,t){if(i===0&&((t>42.25&&t<42.85)||(t>46.6&&t<46.9)))return true;return t>34&&Math.sin(t*1.35+TR[i].ph*2.1)>.88&&!(i===0&&t>38&&t<46.7)}

/* ---------- frame ---------- */
function frame(t){
  let f=0;
  if(t<1.5)f=1-t/1.5;else if(t>=11.2&&t<12)f=seg(t,11.2,12);else if(t>=12&&t<12.8)f=1-seg(t,12,12.8);
  else if(t>=54.6&&t<55.4)f=seg(t,54.6,55.4);else if(t>=55.4&&t<56.4)f=1-seg(t,55.4,56.4);else if(t>=62.5)f=seg(t,62.5,64);
  $('fade').setAttribute('opacity',f);
  const [S,k]=shotAt(t),inside=S[1]==='int',ke=ease(k);
  $('ext').style.display=inside?'none':'';$('int').style.display=inside?'':'none';
  setCam(lerp(S[2],S[5],ke),lerp(S[3],S[6],ke),lerp(S[4],S[7],ke));
  if(!inside)extFrame(t);else intFrame(t);
  // tags + subs
  $('tagL').classList.toggle('on',t>13.2&&t<16.6);$('tagR').classList.toggle('on',t>16.4&&t<19.6);$('tagT').classList.toggle('on',t>34.5&&t<37.6);
  let sub='';for(const L of LINES)if(t>=L[0]-.1&&t<L[1]+.3)sub=`<b>${L[3].toUpperCase()}</b>${L[4]}`;
  if(sub!==lastSub){$('sub').innerHTML=sub;$('sub').style.opacity=sub?1:0;lastSub=sub}
  $('title').setAttribute('opacity',t>58.5?ease(seg(t,58.5,60.5))*(1-seg(t,62.5,64)):0);
  $('tint').setAttribute('opacity',inside?.1+.25*seg(t,31,53):(t>55?.45*seg(t,56,59):0));
}
function extFrame(t){
  const late=t>55,k=late?1:ease(seg(t,.3,10.8)),mv=late?0:1-seg(t,9.6,10.8);
  const wx=lerp(-420,520,k);
  P.wagon.setAttribute('transform',`translate(${wx},${640+Math.sin(t*9)*1.5*mv})`);
  P.wheels.forEach(r=>r.setAttribute('transform',`rotate(${wx*1.1})`));
  P.legs.forEach((l,i)=>l.setAttribute('transform',`rotate(${Math.sin(t*6.5+i*1.7)*16*mv} ${[62,44,-40,-56][i]} ${i<2?-88:-82})`));
  P.lantern.setAttribute('transform',`translate(6,-210) rotate(${Math.sin(t*2.6)*9*(.3+mv)} 0 -20)`);
  P.driver.setAttribute('transform',`translate(-30,${-150+Math.sin(t*4.5)*2*mv})`);
  const wkx=wx-40+(late?-30:0),bob=Math.abs(Math.sin(t*3.2))*6*mv;
  P.walker.setAttribute('transform',`translate(${wkx},${704-bob}) scale(1.15) rotate(${late?8:3})`);
  const wc=(t>6&&t<7)||(t>8.6&&t<9.4)||(late&&Math.sin(t*1.4)>.85);
  P.wPuffs.forEach((p,i)=>{const u=((t*1.6+i*.2)%1);if(wc){p.setAttribute('cx',wkx+40+u*50*1.15);p.setAttribute('cy',704-180*1.15-u*20);p.setAttribute('r',5+u*16);p.setAttribute('opacity',.5*(1-u))}else p.setAttribute('opacity',0)});
  P.clouds.forEach(([c,x,y,s,i])=>c.setAttribute('transform',`translate(${(x+t*(6+i*2))%1500-100},${y}) scale(${s})`));
  P.smoke.forEach((p,i)=>{const u=(t*.18+i/7)%1;p.setAttribute('cx',1161+Math.sin(u*6+i)*14+u*60);p.setAttribute('cy',262-u*200);p.setAttribute('r',12+u*30);p.setAttribute('opacity',.35*(1-u))});
  P.sign.setAttribute('transform',`translate(876,442) rotate(${Math.sin(t*1.8)*6} 0 0)`);
  P.fogs.forEach((e,i)=>e.setAttribute('cx',(200+i*360+t*(12+i*5))%1700-200));
  P.rain.setAttribute('transform',`translate(${(t*120)%60},${(t*420)%97})`);
  const sk=late?seg(t,56,59.5):0;
  P.wGlow.setAttribute('opacity',sk);P.extSick.setAttribute('opacity',sk*.55);
  P.wins.forEach(w=>w.setAttribute('opacity',.6-sk*.4+Math.sin(t*6)*.04));
  P.doorCrack.setAttribute('opacity',.8-sk*.6);
}
function intFrame(t){
  const fl=Math.sin(t*21)*.06+Math.sin(t*7.3)*.05,gut=seg(t,51,55);
  P.fireGlow.setAttribute('opacity',.6+fl-gut*.25);
  P.flames.forEach((p,i)=>{const h=[90,70,46][i]*(1+.18*Math.sin(t*13+i*2)),w=[52,38,22][i],x=155+Math.sin(t*5+i)*4;
    p.setAttribute('d',`M${x-w},452 Q${x-w*.9},${452-h*.5} ${x-w*.3+Math.sin(t*9+i)*8},${452-h} Q${x},${452-h*.55} ${x+w*.2},${452-h*1.15+Math.sin(t*11)*6} Q${x+w*.8},${452-h*.5} ${x+w},452Z`)});
  P.cand.forEach((c,i)=>{const fk=1+.15*Math.sin(t*19+i*3)+gut*.6*Math.sin(t*41+i);c.fl.setAttribute('transform',`translate(${c.x} ${c.y}) scale(${1-gut*.5} ${Math.max(.2,fk-gut*.6)}) translate(${-c.x} ${-c.y})`);c.cg.firstChild.setAttribute('opacity',.55*(1-gut*.7)+.05*Math.sin(t*17+i))});
  P.dark.setAttribute('opacity',seg(t,53.8,55.4)*.6+gut*.15);
  P.ray.setAttribute('opacity',1-seg(t,31,34)*.4);
  // door
  const dk=ease(seg(t,30.6,31.5));
  P.door.setAttribute('transform',`translate(574,0) scale(${1-dk*.9} 1) translate(-574,0)`);
  P.doorRays.setAttribute('opacity',dk*.9*(1-seg(t,40,48)*.6));
  P.bgPat.forEach((g,i)=>g.setAttribute('transform',g.getAttribute('transform').replace(/rotate\([^)]*\)/,'')+` rotate(${t>31?(i==2?-6:6):Math.sin(t+i)*2})`));
  // cast
  const C=[['pietro',P.pietro,0],['elisa',P.elisa,1.3],['anna',P.anna,2.6],['lina',P.lina,3.9]];
  C.forEach(([n,c,ph])=>{
    c.breathe(t,ph);c.blink(blinkAt(t,ph));
    let e='neutral',lx=0,ly=0,tl=Math.sin(t*.8+ph)*1.5,hand=0;
    const left=n==='pietro'||n==='elisa';
    if(t<20){ if(left){e=(t>15&&t<19)?'smug':'neutral';lx=n==='pietro'?4:-4} else {e=(t>16&&t<18.5)?'laugh':'smug';lx=n==='anna'?4:-4} }
    else if(t<30.5){ if(left){e='disgust';lx=6;tl+=n==='elisa'?-4:3} else {e=n==='anna'?'smug':'disgust';lx=-5;tl+=n==='anna'?-3:2} }
    else if(t<46.7){ e=t<32?'fear':(left?'disgust':'worry'); if(t>36)e='worry'; lx=left?5:-5; ly=-1; tl+=left?5:-5 }
    else { e=t<51?'fear':'worry'; if(n==='pietro'&&t<51)lx=t<49?-5:6;else lx=left?5:-5; ly=1; tl+=left?3:-3;
           if(n==='lina'&&t>51.2)hand=ease(seg(t,51.3,52.1))}
    if(n==='lina'&&t>=51&&t<51.3)e='fear';
    c.set(e);c.look(lx,ly);c.tilt(tl,0);c.hand(hand);
    c.talk(speaking(n,t)?mouthK(t,ph)*(n==='elisa'&&t>44?.6:1):0);
  });
  // travelers
  TR.forEach((T,i)=>{const c=P.trav[i];if(t<T.a){c.g.setAttribute('opacity',0);return}
    c.g.setAttribute('opacity',1);
    const k=ease(seg(t,T.a,T.a+4.6)),walking=k<1;
    const x=lerp(640,T.x,k),s=lerp(.36,T.s,k),y=lerp(456-600*.36,T.y,k);
    const bob=walking?Math.abs(Math.sin(t*5+T.ph))*7:0;
    c.pose(x+Math.sin(t*1.1+T.ph)*3,y-bob,s);c.breathe(t,T.ph);
    const cg=tCough(i,t);c.set(cg?'cough':'sick');c.blink(blinkAt(t,T.ph+5));
    c.tilt((cg?12:Math.sin(t*1.2+T.ph)*5)+(i==1?6:0),cg?6:0);
    c.look(i===0&&t>38&&t<46.7?0:Math.sin(t*.7+T.ph)*4,2);
    c.hand(i===0&&t>42.2&&t<42.9?1:0);
    c.talk(speaking('t'+i,t)?mouthK(t,T.ph)*.7:0);
    T.cg=cg;T.px=x;T.py=y-bob;T.ps=s});
  P.puffs.forEach((p,j)=>{const T=TR[j%3];if(!T.cg||t<T.a){p.setAttribute('opacity',0);return}
    const u=(t*1.4+j*.31)%1;p.setAttribute('cx',T.px+(20+u*90)*T.ps*1.4*(j%2?1:-.6));p.setAttribute('cy',T.py+(56-u*40)*T.ps);p.setAttribute('r',(6+u*26)*T.ps*1.6);p.setAttribute('opacity',.5*(1-u))});
}

/* ---------- sound ---------- */
function sounds(t){
  if(!A)return;
  const ci=Math.floor(t/8)%4;
  if(ci!==lastChord){lastChord=ci;const c=CH[ci],n=A.c.currentTime;A.pad.forEach((o,i)=>o.frequency.linearRampToValueAtTime(c[i%3]*(i>2?2:1),n+1.5));A.sub.frequency.linearRampToValueAtTime(c[0]/2,n+1.5)}
  const ni=Math.floor(t/2.7);if(ni!==lastNote&&t>5&&t<60){lastNote=ni;const sc=[69,72,71,67,64,69,68,72,76,74,71,67];if(Math.random()<.75)noteTone(hz(sc[ni%12]-(t>31?12:0)),A.c.currentTime,3.2,.045+(t>31?.03:0))}
  A.music.gain.value=t<2?.5*t/2:t>61?.5*(1-(t-61)/3):(t>12&&t<30.5?.32:.5);
  A.wind.gain.value=(t<12||t>55.4)?.08:(t>30.6&&t<34?.12*(1-seg(t,31.5,34))+.03:.02);
  const at=(key,time)=>{if(t>=time&&!done[key]){done[key]=1;return true}return false};
  const every=(key,from,to,gap,fn)=>{if(t>=from&&t<to&&t>=(nxt[key]||0)){fn();nxt[key]=t+gap()}};
  every('hoof',0.4,10.8,()=>.42+Math.random()*.06,()=>{thump(.06);burst(1600,3,.05,.1)});
  if(at('wc1',6.05)||at('wc2',8.65))cough();
  every('mur',12.4,30.6,()=>.22+Math.random()*.4,()=>{const b=[105,190,220,160,130][Math.floor(Math.random()*5)];voice(b,.15+Math.random()*.25,.035)});
  every('crk',12,54,()=>.15+Math.random()*.5,()=>burst(3000+Math.random()*2000,4,.03,.06));
  if(at('door',30.6)){thump(.35);const n=A.c.currentTime,o=A.c.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(70,n);o.frequency.linearRampToValueAtTime(150,n+1);const f=A.c.createBiquadFilter();f.type='bandpass';f.frequency.value=320;f.Q.value=6;const g=A.c.createGain();g.gain.setValueAtTime(.14,n);g.gain.linearRampToValueAtTime(0,n+1.1);o.connect(f);f.connect(g);g.connect(A.sfx);o.start(n);o.stop(n+1.2)}
  TR.forEach((T,i)=>{const c=!!T.cg;if(c&&!T.was)cough();T.was=c});
  every('hb',46.7,55,()=>1.05,()=>{thump(.3);setTimeout(()=>{if(A)thump(.2)},230)});
  LINES.forEach((L,i)=>{if(at('L'+i,L[0]))say(L)});
}
const CLIPS={};
function loadClips(){LINES.forEach(L=>{const id=L[5];if(CLIPS[id]!==undefined)return;CLIPS[id]=null;
  fetch('vo/'+id+'.mp3').then(r=>r.arrayBuffer()).then(b=>A.c.decodeAudioData(b)).then(buf=>{CLIPS[id]=buf}).catch(()=>{})})}
function say(L){
  const buf=CLIPS[L[5]];
  if(buf){const s=A.c.createBufferSource();s.buffer=buf;const g=A.c.createGain();g.gain.value=1.15;s.connect(g);g.connect(A.master);s.start();return}
  const male=L[2]==='pietro'||L[2]==='t0',dur=L[1]-L[0],n=Math.max(3,Math.round(dur*4));
  for(let k=0;k<n;k++)setTimeout(()=>{if(A)voice(male?110:200,.12+Math.random()*.1,.05)},k*dur*1000/n);
}

/* ---------- run ---------- */
function loop(){if(!playing)return;const t=(performance.now()-t0)/1000;frame(Math.min(t,END));sounds(t);if(t<END)requestAnimationFrame(loop);else playing=false}
function start(){
  if(!A){try{initAudio()}catch(e){A=null}}
  if(A&&A.c.state==='suspended')A.c.resume();
  if(A)loadClips();
  done={};nxt={};lastChord=-1;lastNote=-1;TR.forEach(T=>T.was=false);
  t0=performance.now();playing=true;loop();
}
$('start').addEventListener('click',()=>{$('start').style.display='none';start()});
$('rep').addEventListener('click',()=>{$('start').style.display='none';start()});
$('mute').addEventListener('click',()=>{muted=!muted;$('mute').textContent='Sound: '+(muted?'off':'on');if(A)A.master.gain.value=muted?0:.8});
frame(0);
