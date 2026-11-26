const $=id=>document.getElementById(id);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const lerp=(a,b,k)=>a+(b-a)*k;
const END=86;
let t0=0,playing=false,done={},nxt={},lastChord=-1,lastNote=-1,lastSub='';

/* ---------- script: [start, end, who, name, line, clip] ---------- */
const LINES=[
 [7.2,16.9,'n','The Saga','In the darkest corner of Marchland, two warriors bent over a glowing glass… and the wickedness in their hearts began to show upon their faces.','n1'],
 [17.3,22.2,'anna','Anna','Eight thousand, seven hundred and sixty-three steps. Look at it, Lina. Beautiful.','a1'],
 [22.5,24.2,'lina','Lina','I barely walked half that today.','l1'],
 [24.5,28.8,'anna','Anna','Then take mine. One picture, two claims. Nobody ever checks.','a2'],
 [29.0,31.8,'lina','Lina','The very same picture? Oh, Anna. You are <i>wicked.</i>','l2'],
 [32.1,36.8,'anna','Anna','And this old one says seven thousand and ninety-two. I’ll use it again… and again!','a3'],
 [37.0,38.2,'anna','Anna','<i>Ha ha ha ha ha!</i>','a4'],
 [37.45,38.5,'lina','Lina','<i>Hee hee hee hee!</i>','l3'],
 [39.5,44.2,'t','Ant <span style="opacity:.6">(from the street)</span>','Everybody! Lina and Anna are scamming us! Look at the pictures. They are the exact same!','t1'],
 [44.5,46.1,'lina','Lina','Anna… somebody noticed.','l4'],
 [47.4,49.5,'g','The Gods','We. See. You.','g1'],
 [49.9,58.6,'g','The Gods','One picture. Two warriors. And an old picture, used twice. For this, the Ten Plagues shall fall upon your land.','g2'],
 [58.9,60.9,'anna','Anna','Ten plagues? It was only a picture!','a5'],
 [62.0,63.3,'anna','Anna','Why is the river <i>red?</i>','a6'],
 [64.3,66.1,'lina','Lina','Frogs! Thousands of frogs!','l5'],
 [67.0,68.9,'anna','Anna','What is that cloud? <i>Locusts!</i>','a7'],
 [70.0,71.6,'lina','Lina','Anna… it’s getting dark.','l6'],
 [72.8,78.8,'n','The Saga','And so, for one picture passed off as two, the plagues came for the land of Anna and Lina.','n2']];
const SHOTS=[ // [start, scene, cx0,cy0,z0, cx1,cy1,z1]
 [0,'den',640,380,1.0,640,380,1.0],
 [6,'den',640,390,1.0,640,350,1.28],
 [17.3,'den',420,330,2.0,420,325,2.12],
 [22.4,'den',860,330,2.0,860,325,2.12],
 [24.4,'den',640,370,1.3,640,365,1.36],
 [28.9,'den',860,330,2.0,860,325,2.12],
 [31.9,'den',420,330,2.0,420,325,2.1],
 [34.4,'den',640,450,2.4,640,450,2.6],
 [36.9,'den',640,360,1.3,640,352,1.42],
 [39.3,'den',1015,240,2.1,1015,240,2.3],
 [41.8,'den',640,450,2.4,640,450,2.7],
 [44.3,'den',860,330,2.1,860,326,2.25],
 [46.2,'den',1015,200,2.0,1015,190,2.7],
 [53.6,'den',640,340,1.25,640,336,1.36],
 [58.7,'den',420,330,2.1,420,326,2.3],
 [61.1,'vista',640,380,1.0,640,370,1.06],
 [64.0,'faces',640,340,1.0,640,340,1.06],
 [66.4,'vista',700,350,1.04,720,340,1.12],
 [69.6,'faces',640,340,1.04,640,340,1.1],
 [72.0,'vista',640,360,1.0,640,360,1.05]];
const cam=$('cam'),FX=$('fx'),fx=FX.getContext('2d');
let CAM={cx:640,cy:360,z:1};
function setCam(cx,cy,z){CAM={cx,cy,z};cam.setAttribute('transform',`translate(640,360) scale(${z}) translate(${-cx},${-cy})`)}
function shotAt(t){let s=SHOTS[0],e=END;for(let i=0;i<SHOTS.length;i++)if(t>=SHOTS[i][0]){s=SHOTS[i];e=SHOTS[i+1]?SHOTS[i+1][0]:END}return [s,seg(t,s[0],e)]}
function speaking(who,t){for(const L of LINES)if(L[2]===who&&t>=L[0]&&t<L[1])return 1;return 0}
function mouthK(t,ph){return (Math.sin(t*17+ph)+Math.sin(t*11.3+ph*2))>-.3?.45+.55*Math.abs(Math.sin(t*23+ph)):.08}
function blinkAt(t,ph){return ((t+ph*1.7)%3.7)<.13}
const FLASHES=[0.6,46.3,49.8,54.0,58.0,61.3,66.7,68.3,72.1];
function flashAt(t){let f=0;FLASHES.forEach(a=>{const d=t-a;if(d>=0&&d<.5)f=Math.max(f,d<.08?1:(d>.16&&d<.26?.6:Math.max(0,.3-(d-.26))))});return f}

/* ---------- the characters ---------- */
function actDen(t){
  const C=[['anna',P.anna,0],['lina',P.lina,1.9]],wk=ease(seg(t,12.3,16.6));
  C.forEach(([n,c,ph])=>{
    c.breathe(t,ph);c.blink(blinkAt(t,ph));c.warts(wk);
    const A=n==='anna';let e='smug',lx=A?4:-4,ly=3,tl=Math.sin(t*.8+ph)*1.5;
    if(t>=12.3&&t<17.3)e='wicked';
    if(t>=17.3&&t<37){ e=speaking(n,t)?'wicked':'smug'; if(!speaking(n,t)){lx=A?6:-6;ly=0} }
    if(t>=25.8&&t<28.5&&!A){lx=-2;ly=1;e='wicked'}
    if(t>=37&&t<39.3){e='cackle';tl+=-6+Math.sin(t*22+ph)*3;ly=-3}
    if(t>=39.3&&t<44.3){e='fear';lx=6;ly=-3;tl+=A?4:2}
    if(t>=44.3&&t<46.2){e=A?'fear':'terror';lx=A?6:-6;ly=0}
    if(t>=46.2){e='terror';lx=5;ly=-4;tl+=Math.sin(t*31+ph)*1.2+(A?5:3)}
    c.set(e);c.look(lx,ly);c.tilt(tl,0);
    let k=speaking(n,t)?mouthK(t,ph):0;if(e==='cackle')k=0;
    c.talk(k);
  });
}
function actFaces(t){
  [['anna',P.anna2,0],['lina',P.lina2,1.9]].forEach(([n,c,ph])=>{
    c.breathe(t*2,ph);c.blink(blinkAt(t,ph+3));c.set('terror');
    c.look(n==='anna'?3:-3,-5);c.tilt(Math.sin(t*29+ph)*1.4+(n==='anna'?3:-3),0);
    c.talk(speaking(n,t)?mouthK(t,ph):0);
  });
}

/* ---------- the effects canvas (drawn in the scene's own coordinates, under the same camera) ---------- */
const R=Math.random;
let fxP=[],fires=[],swarm=null,lastT=0;
function fxCam(){const k=FX.width/1280;fx.setTransform(k*CAM.z,0,0,k*CAM.z,k*(640-CAM.cx*CAM.z),k*(360-CAM.cy*CAM.z))}
function frog(x,y,s,t,ph,hop,dir){
  fx.save();fx.translate(x,y);fx.scale(dir,1);fx.fillStyle='#3f7d22';fx.strokeStyle='#183a0c';fx.lineWidth=Math.max(1,s*.12);
  if(hop){fx.beginPath();fx.moveTo(-s*.6,s*.2);fx.lineTo(-s*1.6,s*.9);fx.moveTo(-s*.4,s*.3);fx.lineTo(-s*1.3,s*1.1);fx.stroke()}
  else{fx.beginPath();fx.ellipse(-s*.55,s*.45,s*.45,s*.3,.3,0,6.284);fx.fill();fx.stroke()}
  fx.beginPath();fx.ellipse(0,0,s,s*.62,hop?-.4:-.1,0,6.284);fx.fill();fx.stroke();
  fx.fillStyle='#c9d98a';fx.beginPath();fx.ellipse(s*.45,s*.3,s*.35,s*.22,0,0,6.284);fx.fill();
  fx.fillStyle='#4f9a2c';fx.beginPath();fx.arc(s*.55,-s*.45,s*.3,0,6.284);fx.fill();fx.stroke();
  fx.fillStyle='#fff6c0';fx.beginPath();fx.arc(s*.6,-s*.5,s*.17,0,6.284);fx.fill();fx.fillStyle='#000';fx.beginPath();fx.arc(s*.65,-s*.5,s*.08,0,6.284);fx.fill();
  fx.restore();
}
function bolt(x0,x1,y1,seed){fx.save();fx.strokeStyle='rgba(240,245,255,.95)';fx.lineWidth=3;fx.shadowColor='#cfe0ff';fx.shadowBlur=18;fx.beginPath();fx.moveTo(x0,40);
  for(let i=1;i<=10;i++){const f=i/10;fx.lineTo(x0+(x1-x0)*f+(i<10?Math.sin(seed*13+i*7.1)*30:0),40+(y1-40)*f)}fx.stroke();fx.restore()}
function drawFx(t,scene){
  const dt=Math.min(.05,Math.max(0,t-lastT));lastT=t;
  fx.setTransform(1,0,0,1,0,0);fx.clearRect(0,0,FX.width,FX.height);
  if(scene==='den'){ fxCam();
    if(t>46.2){for(let i=0;i<40;i++){const u=(t*1.7+i*.13)%1;fx.strokeStyle='rgba(180,190,220,.35)';fx.lineWidth=1.2;fx.beginPath();const x=900+((i*37)%230),y=80+u*260;fx.moveTo(x,y);fx.lineTo(x-6,y+18);fx.stroke()}}   // rain beyond the window
    return }
  fxCam();
  if(scene==='vista'){
    // II. frogs come up out of the red river and hop toward the hill
    if(t>61.6&&t<66.4){ if(R()<.5)fxP.push({k:'frog',x:520+R()*200,y:520+R()*120,vx:(R()-.5)*120,vy:60+R()*60,s:6+R()*6,ph:R()*6,born:t});}
    // VII–VIII. locusts rise on the horizon and roll toward us; hail of fire comes down on the village
    if(t>66.4){ const k=ease(seg(t,66.4,71.5)),cx=lerp(1060,700,k),cy=lerp(320,290,k)-(t>72?seg(t,72,76)*40:0),Rr=lerp(170,640,k);
      const hg=fx.createRadialGradient(cx,cy+60,0,cx,cy+60,Rr*1.5);hg.addColorStop(0,'rgba(255,120,50,.45)');hg.addColorStop(1,'rgba(255,120,50,0)');fx.fillStyle=hg;fx.fillRect(cx-Rr*1.6,cy-Rr*1.4,Rr*3.2,Rr*3);   // fire-lit sky behind the swarm
      if(!swarm){swarm=[];for(let i=0;i<1400;i++){const a=R()*6.284,d=Math.pow(R(),.55);swarm.push([Math.cos(a)*d,Math.sin(a)*d*.55,R()*6.28,.6+R()])}}
      const hz=fx.createRadialGradient(cx,cy,0,cx,cy,Rr);hz.addColorStop(0,'rgba(14,9,4,.9)');hz.addColorStop(.6,'rgba(14,9,4,.55)');hz.addColorStop(1,'rgba(18,12,6,0)');fx.fillStyle=hz;fx.beginPath();fx.ellipse(cx,cy,Rr,Rr*.6,0,0,6.284);fx.fill();
      fx.strokeStyle='rgba(20,13,5,.97)';fx.lineWidth=1.8;fx.beginPath();
      swarm.forEach(L=>{const px=cx+L[0]*Rr+Math.sin(t*3*L[3]+L[2])*Rr*.07,py=cy+L[1]*Rr+Math.cos(t*4*L[3]+L[2])*Rr*.06,ln=2+L[3]*3*(.4+k);fx.moveTo(px,py);fx.lineTo(px+ln,py-ln*.3)});fx.stroke();
      if(t<71.6&&R()<.35){const tx=700+R()*260,ty=440+R()*90;fxP.push({k:'hail',x:tx+260,y:ty-520,tx,ty,u:0,v:1.4+R()})}
      P.vFields.setAttribute('opacity',.55*seg(t,67,71.5));
      if(t>68.2&&t<72)for(let i=0;i<4;i++)fxP.push({k:'speck',x:1300,y:80+R()*560,v:700+R()*600,born:t,vs:1});
    }
    // IX–X. the darkness comes down over everything, and something with wings is in it
    if(t>72){ const d=ease(seg(t,72,76.5)),edge=lerp(-200,820,d);
      const dg=fx.createLinearGradient(0,edge-260,0,edge);dg.addColorStop(0,'rgba(2,1,4,.97)');dg.addColorStop(1,'rgba(2,1,4,0)');
      fx.fillStyle='rgba(2,1,4,.97)';fx.fillRect(-200,-200,1700,edge-260+200);fx.fillStyle=dg;fx.fillRect(-200,edge-260,1700,260);
      if(t>75.2){const a=seg(t,75.2,76.6)*(1-seg(t,78.6,79.4)),wx=640,wy=250;
        fx.save();fx.globalAlpha=a*.55;fx.fillStyle='#0b0a16';[-1,1].forEach(s=>{fx.save();fx.translate(wx,wy);fx.scale(s,1);fx.rotate(Math.sin(t*1.6)*.15);fx.beginPath();fx.moveTo(0,0);fx.bezierCurveTo(120,-200,380,-240,600,-90);fx.lineTo(470,-40);fx.lineTo(520,20);fx.lineTo(390,0);fx.lineTo(400,70);fx.lineTo(260,30);fx.quadraticCurveTo(120,40,0,90);fx.fill();fx.restore()});
        fx.globalAlpha=a;fx.fillStyle='#dfe9ff';fx.shadowColor='#9fc0ff';fx.shadowBlur=30;fx.beginPath();fx.ellipse(wx-28,wy+10,11,5,-.2,0,6.284);fx.ellipse(wx+28,wy+10,11,5,.2,0,6.284);fx.fill();fx.restore()}
    }
    if(t>61.25&&t<61.55)bolt(980,900,330,1);if(t>66.7&&t<66.95)bolt(300,420,380,2);if(t>68.3&&t<68.5)bolt(1100,980,350,3);
  }
  if(scene==='faces'){
    // frogs leap across in front of them; flies at their faces; locust specks streaming past; it is getting dark
    if(t<66.4&&R()<.5){const L=R()<.6;fxP.push({k:'bigfrog',x:L?-80:1360,y:540+R()*140,vx:(L?1:-1)*(260+R()*240),ph:R()*6,s:22+R()*26,born:t})}
    if(R()<.4)fxP.push({k:'fly',x:R()*1280,y:150+R()*420,a:R()*6.28,v:90+R()*160,ph:R()*6,born:t});
    if(t>69.6)for(let i=0;i<5;i++)fxP.push({k:'speck',x:1300,y:R()*700,v:600+R()*500,born:t});
    P.fRed.setAttribute('opacity',(.22+.08*Math.sin(t*9)+.06*Math.sin(t*23)).toFixed(3));
    P.fDark.setAttribute('opacity',(.6*seg(t,69.8,71.8)).toFixed(3));
  }
  fxP=fxP.filter(p=>{
    if(p.k==='frog'){const age=t-p.born,hop=(age%0.8)<.4;p.x+=p.vx*dt*(hop?1:0);p.y+=p.vy*dt*(hop?1:0);frog(p.x,p.y-(hop?Math.sin((age%.8)/.4*Math.PI)*14:0),p.s*(1+(p.y-520)/300),t,p.ph,hop,p.vx>0?1:-1);return age<5&&scene==='vista'}
    if(p.k==='bigfrog'){const age=t-p.born;p.x+=p.vx*dt;const hy=p.y-Math.abs(Math.sin(age*3.2))*160;frog(p.x,hy,p.s,t,p.ph,true,p.vx>0?1:-1);return p.x<1450&&p.x>-150&&scene==='faces'}
    if(p.k==='fly'){p.a+=Math.sin(t*3+p.ph)*.3;p.x+=Math.cos(p.a)*p.v*dt;p.y+=Math.sin(p.a)*p.v*dt;const fs=4;
      fx.fillStyle='rgba(210,225,235,.45)';fx.beginPath();fx.ellipse(p.x-fs*.7,p.y-fs*.8,fs,fs*.45,-.6+Math.sin(t*70+p.ph)*.6,0,6.284);fx.ellipse(p.x+fs*.7,p.y-fs*.8,fs,fs*.45,.6-Math.sin(t*70+p.ph)*.6,0,6.284);fx.fill();
      fx.fillStyle='#120e0a';fx.beginPath();fx.ellipse(p.x,p.y,fs*.8,fs*.6,p.a,0,6.284);fx.fill();return t-p.born<4&&scene==='faces'}
    if(p.k==='speck'){p.x-=p.v*dt;fx.strokeStyle='rgba(30,20,8,.9)';fx.lineWidth=p.vs?3:2;fx.beginPath();fx.moveTo(p.x,p.y);fx.lineTo(p.x+(p.vs?16:9),p.y-(p.vs?5:3));fx.stroke();return p.x>-20&&scene===(p.vs?'vista':'faces')}
    if(p.k==='hail'){if(scene!=='vista')return false;p.u+=dt*p.v;const u=Math.min(1,p.u),hx=lerp(p.x,p.tx,u),hy=lerp(p.y,p.ty,u);
      if(u<1){const g=fx.createLinearGradient(hx,hy,hx+60,hy-120);g.addColorStop(0,'rgba(255,215,120,1)');g.addColorStop(.35,'rgba(255,90,20,.7)');g.addColorStop(1,'rgba(90,10,0,0)');
        fx.strokeStyle=g;fx.lineWidth=7;fx.lineCap='round';fx.beginPath();fx.moveTo(hx,hy);fx.lineTo(hx+60,hy-120);fx.stroke();fx.fillStyle='#eef8ff';fx.beginPath();fx.arc(hx,hy,4,0,6.284);fx.fill();return true}
      if(!p.hit){p.hit=t;fires.push({x:p.tx,y:p.ty,s:.6+R()*.8});sfxHit()}
      const k=(t-p.hit)/.5;fx.strokeStyle=`rgba(255,190,90,${Math.max(0,1-k)})`;fx.lineWidth=3;fx.beginPath();fx.ellipse(p.tx,p.ty,10+60*k,4+24*k,0,0,6.284);fx.stroke();return k<1}
    return false});
  if(scene==='vista')fires.forEach((f,i)=>{for(let j=0;j<3;j++){const h=(16+10*Math.sin(t*12+j*1.7+i))*f.s;fx.fillStyle=['rgba(255,80,10,.8)','rgba(255,160,40,.8)','rgba(255,230,140,.85)'][j];
    fx.beginPath();fx.moveTo(f.x-8*f.s+j*5*f.s,f.y);fx.quadraticCurveTo(f.x-6*f.s+j*5*f.s,f.y-h*.6,f.x-3*f.s+j*5*f.s+Math.sin(t*9+j)*3,f.y-h);fx.quadraticCurveTo(f.x+j*5*f.s,f.y-h*.4,f.x-1*f.s+j*5*f.s,f.y);fx.fill()}});
}

/* ---------- frame ---------- */
function frame(t){
  let f=0;                                            // (the title cards sit above the fade)
  if(t<6)f=1;else if(t<7.2)f=1-seg(t,6,7.2);
  else if(t>=60.8&&t<61.1)f=seg(t,60.8,61.1);else if(t>=61.1&&t<61.5)f=1-seg(t,61.1,61.5);
  else if(t>=78.8)f=.62*seg(t,78.8,80)+.38*seg(t,85,86);
  $('fade').setAttribute('opacity',f);
  $('title').setAttribute('opacity',(seg(t,1.0,2.6)*(1-seg(t,4.8,5.9))).toFixed(3));
  $('title2').setAttribute('opacity',(seg(t,79.2,80.8)*(1-seg(t,85,86))).toFixed(3));
  $('flash').setAttribute('opacity',(flashAt(t)*.7).toFixed(3));
  const [S,k]=shotAt(t),ke=ease(k);
  ['den','vista','faces'].forEach(id=>$(id).style.display=S[1]===id?'':'none');
  let jx=0,jy=0;if(t>46.2&&t<61.1){jx=Math.sin(t*41)*1.2;jy=Math.cos(t*37)*1.2}
  setCam(lerp(S[2],S[5],ke)+jx,lerp(S[3],S[6],ke)+jy,lerp(S[4],S[7],ke));
  if(S[1]==='den')denFrame(t);if(S[1]==='faces')actFaces(t);if(S[1]==='vista')vistaFrame(t);
  drawFx(t,S[1]);
  $('tagL').classList.toggle('on',t>8.2&&t<11.8);$('tagR').classList.toggle('on',t>9&&t<12.2);
  let sub='',god=false;for(const L of LINES)if(t>=L[0]-.1&&t<L[1]+.3){sub=L[2]==='n'?`<i>${L[4]}</i>`:`<b>${L[3].toUpperCase()}</b>${L[4]}`;god=L[2]==='g'}
  if(sub!==lastSub){$('sub').innerHTML=sub;$('sub').style.opacity=sub?1:0;$('sub').classList.toggle('god',god);lastSub=sub}
}
function denFrame(t){
  actDen(t);
  P.flames.forEach((c,i)=>{const gut=seg(t,46,47.5)*.5,h=(26+5*Math.sin(t*13+i*2))*(1-gut),w=7;c.p.setAttribute('d',`M${c.x-w},${c.y} Q${c.x-w},${c.y-h*.6} ${c.x+Math.sin(t*9+i)*3},${c.y-h} Q${c.x+w},${c.y-h*.6} ${c.x+w},${c.y}Z`)});
  P.winClouds.forEach((c,i)=>c.setAttribute('cx',900+((i*60+t*(8+i*3))%330)-40));
  const caught=t>=41.2,old=t>=33.0&&t<41.2;
  P.pic1.setAttribute('opacity',caught||old?0:1);P.pic2.setAttribute('opacity',old?1:0);P.pic3.setAttribute('opacity',caught?1:0);
  P.glassGlow.setAttribute('opacity',(.75+.2*Math.sin(t*3)).toFixed(3));
  P.glassGlow.setAttribute('fill',caught?'url(#fire)':'url(#glow)');
  P.faceGlow.setAttribute('opacity',(caught?.12:.35+.08*Math.sin(t*3)).toFixed(3));
  P.redGlow.setAttribute('opacity',(.28*seg(t,46.4,48)).toFixed(3));
  // the copied picture flies from Anna's glass to Lina
  const ck=seg(t,25.8,28.0);P.card.setAttribute('opacity',ck>0&&ck<1?1:(ck>=1&&t<28.8?1-seg(t,28.0,28.8):0));
  if(ck>0){const x=lerp(560,800,ease(ck)),y=lerp(450,470,ck)-Math.sin(ck*Math.PI)*90;P.card.setAttribute('transform',`translate(${x},${y}) rotate(${Math.sin(ck*6)*12})`)}
  P.antWin.setAttribute('opacity',t>39.3&&t<44.3?(.75+.25*Math.sin(t*14)).toFixed(3):.45);
  // the Eye opens in the storm
  const eo=ease(seg(t,46.6,47.9));P.eye.setAttribute('opacity',seg(t,46.3,46.7));
  P.lidT.setAttribute('transform',`translate(0 ${-eo*80})`);P.lidB.setAttribute('transform',`translate(0 ${eo*80})`);
  const lk=t<52?Math.sin(t*1.3)*14:(-26);P.iris.setAttribute('transform',`translate(${lk} ${t>52?10:0})`);
  P.winFlash.setAttribute('opacity',(flashAt(t)*.9).toFixed(3));
  P.winLight.setAttribute('opacity',(flashAt(t)*.35+(t>46.6?.1+.05*Math.sin(t*4):0)).toFixed(3));
}
function vistaFrame(t){
  P.vClouds.forEach(([c,i])=>c.setAttribute('transform',`translate(${((i*170+t*(10+i*3))%1600)-200},${90+(i%4)*55}) scale(${1+(i%3)*.3})`));
  P.riverRed.setAttribute('stroke-dashoffset',(1400*(1-ease(seg(t,61.4,64.2)))).toFixed(1));
  P.riverSheen.setAttribute('stroke-dashoffset',(-t*40).toFixed(1));
}

/* ---------- sound ---------- */
let BZ=null;
function sfxThunder(v){if(!A)return;burst(140,.7,2.4,.9*v,'lowpass');burst(2400,.6,.35,.45*v,'highpass');thump(.6*v)}
function sfxHit(){if(!A)return;thump(.4);burst(900,1,.25,.25,'lowpass')}
function sfxCroak(){if(!A)return;const n=A.c.currentTime,f=110+Math.random()*90;for(let k=0;k<3;k++){const o=A.c.createOscillator(),g=A.c.createGain();o.type='square';o.frequency.setValueAtTime(f,n+k*.07);o.frequency.exponentialRampToValueAtTime(f*.8,n+k*.07+.06);
  g.gain.setValueAtTime(0,n+k*.07);g.gain.linearRampToValueAtTime(.05,n+k*.07+.01);g.gain.linearRampToValueAtTime(0,n+k*.07+.06);o.connect(g);g.connect(A.sfx);o.start(n+k*.07);o.stop(n+k*.07+.08)}}
function sfxBell(){if(!A)return;const n=A.c.currentTime;[110,220,264,330,440].forEach((f,i)=>{const o=A.c.createOscillator(),g=A.c.createGain();o.frequency.value=f;g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime([.3,.18,.1,.08,.05][i],n+.01);g.gain.exponentialRampToValueAtTime(.0005,n+4.5-i*.5);o.connect(g);g.connect(A.music);o.start(n);o.stop(n+4.6)})}
function buzzInit(){const o=A.c.createOscillator(),lf=A.c.createOscillator(),lg=A.c.createGain(),bp=A.c.createBiquadFilter(),g=A.c.createGain();
  o.type='sawtooth';o.frequency.value=230;lf.frequency.value=23;lg.gain.value=14;lf.connect(lg);lg.connect(o.frequency);bp.type='bandpass';bp.frequency.value=520;bp.Q.value=2;g.gain.value=0;
  o.connect(bp);bp.connect(g);g.connect(A.sfx);o.start();lf.start();BZ=g}
function sounds(t){
  if(!A)return;
  const ci=Math.floor(t/7)%4;
  if(ci!==lastChord){lastChord=ci;const c=CH[ci],n=A.c.currentTime;A.pad.forEach((o,i)=>o.frequency.linearRampToValueAtTime(c[i%3]*(i>2?2:1)*(t>46?.94:1),n+1.5));A.sub.frequency.linearRampToValueAtTime(c[0]/2,n+1.5)}
  const ni=Math.floor(t/2.4);if(ni!==lastNote&&t>6&&t<84){lastNote=ni;const sc=[69,72,71,68,64,69,67,72,76,74,71,68];if(Math.random()<.7)noteTone(hz(sc[ni%12]-(t>46?12:0)),A.c.currentTime,3,.04+(t>46?.03:0))}
  A.music.gain.value=t<2?.5*t/2:t>84?.5*(1-(t-84)/2):(t>46?.62:.45);
  A.lp.frequency.value=t>46?1500:700;
  A.wind.gain.value=t<6?.04:(t>61?.14:(t>46?.08:.03));
  if(!BZ)buzzInit();
  BZ.gain.value=t>66.4&&t<69.6?.09:(t>64&&t<72&&Math.floor(t*10)%2?.03:(t>72&&t<76?.06*(1-seg(t,72,76)):0));
  const at=(key,time)=>{if(t>=time&&!done[key]){done[key]=1;return true}return false};
  const every=(key,from,to,gap,fn)=>{if(t>=from&&t<to&&t>=(nxt[key]||0)){fn();nxt[key]=t+gap()}};
  FLASHES.forEach((a,i)=>{if(at('th'+i,a))sfxThunder(i===0?.8:1)});
  every('crk',7,46,()=>.15+Math.random()*.5,()=>burst(3000+Math.random()*2000,4,.03,.05));
  every('hb',44.3,61,()=>.95,()=>{thump(.32);setTimeout(()=>{if(A)thump(.2)},230)});
  every('frog',61.6,66.4,()=>.08+Math.random()*.25,sfxCroak);
  every('hail',66.6,71.5,()=>.05+Math.random()*.12,()=>burst(5000,1,.04,.12,'highpass'));
  if(at('bell1',79.2))sfxBell();if(at('bell2',82))sfxBell();
  LINES.forEach((L,i)=>{if(at('L'+i,L[0]))say(L)});
}
const CLIPS={};
function loadClips(){LINES.forEach(L=>{const id=L[5];if(CLIPS[id]!==undefined)return;CLIPS[id]=null;
  fetch('vo/'+id+'.mp3').then(r=>r.arrayBuffer()).then(b=>A.c.decodeAudioData(b)).then(buf=>{CLIPS[id]=buf}).catch(()=>{})})}
function say(L){
  const buf=CLIPS[L[5]];
  if(buf){const s=A.c.createBufferSource();s.buffer=buf;const g=A.c.createGain();g.gain.value=L[2]==='g'?1.35:1.15;s.connect(g);g.connect(A.master);s.start();return}
  const male=L[2]==='n'||L[2]==='g'||L[2]==='t',dur=L[1]-L[0],n=Math.max(3,Math.round(dur*4));
  for(let k=0;k<n;k++)setTimeout(()=>{if(A)voice(male?110:200,.12+Math.random()*.1,.05)},k*dur*1000/n);
}

/* ---------- run ---------- */
function loop(){if(!playing)return;const t=(performance.now()-t0)/1000;frame(Math.min(t,END));sounds(t);if(t<END)requestAnimationFrame(loop);else playing=false}
function start(){
  if(!A){try{initAudio()}catch(e){A=null}}
  if(A&&A.c.state==='suspended')A.c.resume();
  if(A)loadClips();
  done={};nxt={};lastChord=-1;lastNote=-1;fxP=[];fires=[];swarm=null;lastT=0;
  t0=performance.now();playing=true;loop();
}
window.sagaSeek=function(t){playing=false;lastT=t-.016;frame(t)};   // for checking a single moment
$('start').addEventListener('click',()=>{$('start').style.display='none';start()});
$('rep').addEventListener('click',()=>{$('start').style.display='none';start()});
$('mute').addEventListener('click',()=>{muted=!muted;$('mute').textContent='Sound: '+(muted?'off':'on');if(A)A.master.gain.value=muted?0:.8});
frame(0);
