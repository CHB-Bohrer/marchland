const END=96, LEN=102;                               // END: the story clock; LEN: the film, with six more seconds of flyover
const warp=T=>T<21.5?T:(T<27.5?21.5:T-6);
let t0=0,playing=false,done={},nxt={},lastChord=-1,lastNote=-1,lastSub='';

/* ---------- script: [start, end, who, name, line, clip] ---------- */
const MAP_LINES=[   // real time, during the flyover
 [8.0,12.2,'n','','Tomorrow, the plague comes to Marchland.','m1'],
 [12.6,17.2,'n','','It will break out on ten squares at once, and no one knows whose.','m2'],
 [17.2,22.8,'n','','For a day it hides. A stricken square looks healthy, while it spreads to its neighbours.','m3'],
 [22.9,24.4,'n','','Then the sickness shows.','m4'],
 [24.6,28.2,'n','','And already it spreads, unseen, beyond it.','m5']];
const LINES=[
 [23.0,27.2,'n','','The gods are furious. And they know who brought this upon you.','n1'],
 [27.8,30.0,'g','The Gods','We. See. You.','g1'],
 [30.0,37.4,'n','','The criminals.'],
 [37.5,39.7,'n','','And Mario. Just annoying.'],
 [39.8,43.2,'n','','Their evil ways have brought the gods’ wrath on every one of you.','n3'],
 [44.0,47.4,'n','','A sick square gives only half its harvest.','n4'],
 [47.6,50.9,'n','','The soldiers on it sicken, and die.','n5'],
 [51.2,54.6,'n','','Left uncured, one sick square in ten is lost forever.','n6'],
 [55.8,58.6,'n','','And fire cures it only by taking the land.','n7'],
 [60.2,63.8,'n','','But there is one defence.','n8'],
 [64.2,69.4,'n','','A priest cures the sick, and shields every square around him.','n9'],
 [69.8,73.8,'n','','Where the church bell rings, the plague is held back.','n10'],
 [75.0,77.2,'b','','Raise your churches!','p1'],
 [77.4,79.6,'b','','Train your priests!','p2'],
 [79.8,82.6,'b','','Before tomorrow!','p3']];
const VO_EXTRA=[[30.5,'c1'],[31.7,'c2'],[32.9,'c3'],[34.1,'c5'],[35.3,'c4'],[36.5,'c6'],[37.6,'c7']];   // the barbarian names each criminal
const SHOTS=[ // [start, scene, cx0,cy0,z0, cx1,cy1,z1]
 [0,'map',640,360,1,640,360,1],
 [22,'den',640,380,1.0,640,372,1.08],
 [27.4,'den',640,250,1.4,640,230,1.6],
 [30.3,'den',260,430,1.8,262,428,1.84],
 [31.5,'den',275,430,1.8,277,428,1.84],
 [32.7,'den',458,428,1.75,460,426,1.8],
 [33.9,'den',640,430,1.8,642,428,1.84],
 [35.1,'den',823,430,1.8,825,428,1.84],
 [36.3,'den',1006,430,1.8,1008,428,1.84],
 [37.5,'den',1020,430,1.8,1024,428,1.86],
 [39.1,'den',640,380,1.02,640,372,1.1],
 [43,'sick',640,380,1.05,640,370,1.18],
 [47.5,'sick',640,450,1.5,640,450,1.6],
 [51,'sick',640,380,1.1,640,380,1.2],
 [59,'church',640,380,1.0,640,370,1.08],
 [64,'church',700,330,1.3,640,380,1.0],
 [70,'church',640,400,1.0,640,410,1.12],
 [74.2,'plea',640,360,1.0,640,360,1.06]];
const cam=$('cam'),FX=$('fx'),fx=FX.getContext('2d');
let CAM={cx:640,cy:360,z:1};
function setCam(cx,cy,z){CAM={cx,cy,z};cam.setAttribute('transform',`translate(640,360) scale(${z}) translate(${-cx},${-cy})`)}
function shotAt(t){let s=SHOTS[0],e=END;for(let i=0;i<SHOTS.length;i++)if(t>=SHOTS[i][0]){s=SHOTS[i];e=SHOTS[i+1]?SHOTS[i+1][0]:END}return [s,seg(t,s[0],e)]}
function blinkAt(t,ph){return ((t+ph*1.7)%3.7)<.13}
const FLASHES=[0.8,3.4,10.2,21.6,27.5,30.1,42.8,74.4];
function flashAt(t){let f=0;FLASHES.forEach(a=>{const d=t-a;if(d>=0&&d<.5)f=Math.max(f,d<.08?1:(d>.16&&d<.26?.6:Math.max(0,.3-(d-.26))))});return f}
const SICK_T=i=>12.4+i*.72;
const NAME_T=[30.4,31.6,32.8,34.0,35.2,36.4,37.6];

/* ---------- the villains ---------- */
function actDen(t){
  const wk=ease(seg(t,23.4,27.0));
  P.villains.forEach(([n,c,ph],vi)=>{
    c.breathe(t*(n==='charl'?.7:1),ph);c.blink(blinkAt(t,ph));c.warts(wk);
    let e='smug',lx=vi<2?5:-5,ly=2,tl=Math.sin(t*.8+ph)*1.5;
    if(t>=23.4&&t<25.8)e='wicked';
    if(t>=25.8&&t<27.5){e='cackle';tl+=-5+Math.sin(t*22+ph)*3;ly=-3}
    if(t>=27.5&&t<30.3){e='fear';ly=-8;tl+=Math.sin(t*30+ph)*1.2}
    if(t>=30.3){const named=t>=NAME_T[vi];e=named?'terror':'fear';ly=-7;tl+=Math.sin(t*31+ph)*(named?1.6:.8)}
    if(n==='mario'){e=t>=25.8&&t<27.5?'cackle':'smug';lx=-3;ly=0;tl=Math.sin(t*8)*4}            // he is not afraid of anything; he is busy being annoying
    c.set(e);c.look(lx,ly);c.tilt(tl,n==='charl'?Math.sin(t*2.2)*2:0);c.talk(0);
  });
}

/* ---------- the flyover: the realm from the air, painted in perspective ---------- */
const FLY=(function(){
  const H=(a,b,c)=>{const x=Math.sin(a*127.1+b*311.7+c*74.7)*43758.5453;return x-Math.floor(x)};
  const SEEDS=[];const COLS=['#c0443a','#3f6fd0','#e0b23a','#5aaa4a','#9a5ac0','#d0703a','#3ab0b0','#e070a0','#7a8a2a','#c0c0d0'];
  for(let i=0;i<16;i++)SEEDS.push({x:(H(i,1,1)-.5)*34,z:6+i*6.4+H(i,2,2)*3,c:COLS[i%COLS.length]});
  const W=Math.sqrt(3),rows=[];
  for(let row=0;row<78;row++){const r=[];for(let col=-15;col<=15;col++){
    const x=col*W+(row%2?W/2:0),z=row*1.5,h0=H(col,row,1),rx=5*Math.sin(z*.09)+2.5*Math.sin(z*.23+1);
    let t='plain';if(Math.abs(x-rx)<1.05)t='water';else if(h0<.2)t='farm';else if(h0<.44)t='forest';else if(h0<.465)t='mount';else if(h0<.53)t='stone';
    let own=null,bd=1e9;SEEDS.forEach(s=>{const d=Math.hypot(s.x-x,s.z-z);if(d<bd){bd=d;own=s}});if(bd>6.2||t==='water')own=null;
    r.push({x,z,t,h:t==='mount'?.2:t==='stone'?.15:0,own,v:t==='plain'&&H(col,row,4)<.25,ph:H(col,row,5)*6.28})}rows.push(r)}
  SEEDS.forEach(s=>{let best=null,bd=1e9;rows.forEach(r=>r.forEach(c=>{if(c.own===s&&c.t!=='mount'){const d=Math.hypot(c.x-s.x,c.z-s.z);if(d<bd){bd=d;best=c}}}));if(best){best.castle=s.c;best.t='plain';best.h=0;best.v=false}});
  return {rows,SEEDS,H};
})();
const flyZ=t=>lerp(-4,40,ease(seg(t,0,27.5)*.92+.04)),flyX=t=>Math.sin(t*.13)*3,flyH=t=>lerp(8.5,5.5,seg(t,0,27.5));
const HOR=232,FOC=640;
const HID_T=i=>13.0+i*.4, SHOW_T=22.8;
const SICK=(function(){const out=[],all=[];
  for(let i=0;i<10;i++){const s=HID_T(i),cz=flyZ(24),cx=flyX(24);let pick=null;
    for(let k=0;k<800&&!pick;k++){const r=FLY.rows[Math.floor(FLY.H(i,k,7)*FLY.rows.length)];if(!r)continue;const c=r[Math.floor(FLY.H(k,i,8)*r.length)];
      if(!c||!c.own||c.castle||c.t==='mount'||c.inf)continue;const dz=c.z-cz;if(dz<8||dz>22||Math.abs(c.x-cx)>dz*.55)continue;
      if(out.some(o=>Math.hypot(o.x-c.x,o.z-c.z)<4))continue;pick=c}
    if(pick){pick.inf=s;pick.origin=1;out.push(pick)}}
  // while nobody can see it, it creeps out to the neighbours
  FLY.rows.forEach((r,ri)=>r.forEach((c,ci)=>{if(c.inf||c.t==='mount'||c.castle||c.t==='water')return;let best=null,bd=9;
    out.forEach(o=>{const d=Math.hypot(o.x-c.x,o.z-c.z);if(d<bd){bd=d;best=o}});
    if(best&&bd<3.7&&FLY.H(ri,ci,11)<.62)c.inf=Math.min(SHOW_T-.3,best.inf+.9+bd*1.4)}));
  FLY.rows.forEach((r,ri)=>r.forEach((c,ci)=>{if(c.inf){c.sick=SHOW_T+FLY.H(ri,ci,12)*1.8;all.push(c)}}));
  // and while those show, the next ring is caught, unseen; some of it shows before the shot ends, the rest is still hiding
  FLY.rows.forEach((r,ri)=>r.forEach((c,ci)=>{if(c.inf||c.t==='mount'||c.castle||c.t==='water')return;let bd=99;
    out.forEach(o=>{const d=Math.hypot(o.x-c.x,o.z-c.z);if(d<bd)bd=d});
    if(bd>=3.7&&bd<7&&FLY.H(ri,ci,13)<.55){c.inf=23.2+(bd-3.7)*.8;c.sick=c.inf<24.6?26.2+FLY.H(ri,ci,14)*.9:99;all.push(c)}}));
  return all})();
function mix(a,b,k){const p=x=>[parseInt(x.slice(1,3),16),parseInt(x.slice(3,5),16),parseInt(x.slice(5,7),16)];const A=p(a),B=p(b);return '#'+[0,1,2].map(i=>Math.round(A[i]+(B[i]-A[i])*k).toString(16).padStart(2,'0')).join('')}
function drawFly(t){
  fx.setTransform(FX.width/1280,0,0,FX.width/1280,0,0);
  const cz=flyZ(t),cx=flyX(t),ch=flyH(t),green=seg(t,8,25)*(.4+.6*seg(t,22.8,25));
  // the sky: a storm at dusk, the sun going down behind green-tinged cloud
  const sky=fx.createLinearGradient(0,0,0,HOR+40);sky.addColorStop(0,'#0e0a18');sky.addColorStop(.55,mix('#5a2a34','#2a4a34',green*.6));sky.addColorStop(1,mix('#e0884a','#9ac070',green*.5));
  fx.fillStyle=sky;fx.fillRect(0,0,1280,HOR+40);
  const sun=fx.createRadialGradient(780,HOR-10,0,780,HOR-10,260);sun.addColorStop(0,'rgba(255,200,120,.85)');sun.addColorStop(.2,'rgba(255,140,70,.35)');sun.addColorStop(1,'rgba(255,120,60,0)');fx.fillStyle=sun;fx.fillRect(400,0,800,HOR+40);
  for(let i=0;i<18;i++){const x=((i*173+t*(6+i%4*3))%1700)-200,y=40+(i%5)*34,r=90+(i%4)*40;const g=fx.createRadialGradient(x,y,0,x,y,r);const d=i%3===0;g.addColorStop(0,d?'rgba(20,14,24,.85)':'rgba(40,26,40,.6)');g.addColorStop(1,'rgba(20,14,24,0)');fx.fillStyle=g;fx.beginPath();fx.ellipse(x,y,r,r*.38,0,0,6.284);fx.fill()}
  const fl=flashAt(t);if(fl){fx.fillStyle=`rgba(220,230,255,${fl*.35})`;fx.fillRect(0,0,1280,HOR+40)}
  fx.strokeStyle='#120a10';fx.lineWidth=2;for(let i=0;i<7;i++){const x=((i*190+t*40)%1500)-100,y=90+Math.sin(t*.8+i)*30+(i%3)*24,w=Math.sin(t*9+i)*5;fx.beginPath();fx.moveTo(x-9,y-w);fx.quadraticCurveTo(x-4,y-3,x,y);fx.quadraticCurveTo(x+4,y-3,x+9,y-w);fx.stroke()}
  // the land, far to near
  const fog=mix('#6a5a5a','#6a8a68',green);
  {const hz=fx.createLinearGradient(0,HOR-2,0,HOR+70);hz.addColorStop(0,mix('#e0884a','#9ac070',green*.5));hz.addColorStop(1,fog);fx.fillStyle=hz;fx.fillRect(0,HOR-2,1280,720-HOR+2)}
  const P3=(x,y,z)=>{const dz=z-cz;return [640+(x-cx)*FOC/dz,HOR+(ch-y)*FOC/dz]};
  for(let ri=FLY.rows.length-1;ri>=0;ri--){const r=FLY.rows[ri],dz=r[0].z-cz;if(dz<1.6||dz>62)continue;
    const fk=clamp((dz-6)/52,0,1),sc=FOC/dz;
    r.forEach(c=>{const sx=640+(c.x-cx)*sc;if(sx<-120||sx>1400)return;
      const top=[],bot=[];for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-30),px=c.x+.99*Math.cos(a),pz=c.z+.99*Math.sin(a);top.push(P3(px,c.h,pz));bot.push(P3(px,-.35,pz))}
      const base={plain:'#6a8a44',farm:'#b89a3a',forest:'#2f6a2a',mount:'#7a7068',stone:'#8a8478',water:'#2a5a8a'}[c.t];
      fx.fillStyle=mix(mix(base,'#000000',.45),fog,fk);fx.beginPath();
      fx.moveTo(top[5][0],top[5][1]);fx.lineTo(top[0][0],top[0][1]);fx.lineTo(top[1][0],top[1][1]);fx.lineTo(top[2][0],top[2][1]);fx.lineTo(bot[2][0],bot[2][1]);fx.lineTo(bot[1][0],bot[1][1]);fx.lineTo(bot[0][0],bot[0][1]);fx.lineTo(bot[5][0],bot[5][1]);fx.closePath();fx.fill();
      let col=base;if(c.own)col=mix(base,c.own.c,.22);if(c.t==='water')col=mix('#2a5a8a','#6aa0d0',.2+.2*Math.sin(t*2+c.ph));
      if(c.sick&&t>=c.sick)col=mix(col,'#5fe070',.65*seg(t,c.sick,c.sick+.4));
      else if(c.inf&&t>=c.inf)col=mix(col,'#3a4a34',.12+.06*Math.sin(t*3+c.ph));     // caught, unseen: only the faintest shadow
      fx.fillStyle=mix(col,fog,fk);fx.beginPath();top.forEach((p,i)=>i?fx.lineTo(p[0],p[1]):fx.moveTo(p[0],p[1]));fx.closePath();fx.fill();
      if(c.own&&dz<40){fx.strokeStyle=mix(c.own.c,fog,fk*.8);fx.lineWidth=Math.max(.6,sc*.07);fx.stroke()}else{fx.strokeStyle=`rgba(0,0,0,${.25*(1-fk)})`;fx.lineWidth=.6;fx.stroke()}
      const [gx,gy]=P3(c.x,c.h,c.z);
      if(dz<34){
        if(c.t==='farm'){fx.strokeStyle=mix('#e8d070',fog,fk);fx.lineWidth=Math.max(.5,sc*.05);fx.beginPath();for(let k=-2;k<=2;k++){const a=P3(c.x-.7,0,c.z+k*.3),b=P3(c.x+.7,0,c.z+k*.3);fx.moveTo(a[0],a[1]);fx.lineTo(b[0],b[1])}fx.stroke()}
        if(c.t==='forest')[[-.45,-.3],[.4,-.2],[0,.35],[-.3,.45],[.5,.4]].forEach(([ox,oz],k)=>{const [tx,ty]=P3(c.x+ox,0,c.z+oz),s=sc*(.42+((k*7)%3)*.08);fx.fillStyle=mix(k%2?'#1d4a1a':'#2a5a22',fog,fk);fx.beginPath();fx.moveTo(tx,ty-s*1.6);fx.lineTo(tx-s*.5,ty);fx.lineTo(tx+s*.5,ty);fx.fill()});
        if(c.t==='mount'&&dz>5){const s=sc*1.3;fx.fillStyle=mix('#8a8078',fog,fk);fx.beginPath();fx.moveTo(gx,gy-s*1.9);fx.lineTo(gx-s*.95,gy+s*.25);fx.lineTo(gx+s*.95,gy+s*.25);fx.fill();fx.fillStyle=mix('#f0f0f4',fog,fk);fx.beginPath();fx.moveTo(gx,gy-s*1.9);fx.lineTo(gx-s*.3,gy-s*1.3);fx.lineTo(gx-s*.1,gy-s*1.4);fx.lineTo(gx+s*.1,gy-s*1.25);fx.lineTo(gx+s*.32,gy-s*1.32);fx.fill();fx.fillStyle=`rgba(0,0,0,${.25*(1-fk)})`;fx.beginPath();fx.moveTo(gx,gy-s*1.9);fx.lineTo(gx+s*.95,gy+s*.25);fx.lineTo(gx+s*.2,gy+s*.25);fx.fill()}
        if(c.v){const s=sc*.35;fx.fillStyle=mix('#d8c8a8',fog,fk);fx.fillRect(gx-s,gy-s*1.1,s*2,s*1.1);fx.fillStyle=mix('#8a3a2a',fog,fk);fx.beginPath();fx.moveTo(gx-s*1.25,gy-s*1.05);fx.lineTo(gx,gy-s*2);fx.lineTo(gx+s*1.25,gy-s*1.05);fx.fill();
          if(dz<22){fx.fillStyle=`rgba(255,200,110,${.8*(1-fk)})`;fx.fillRect(gx-s*.3,gy-s*.7,s*.4,s*.35);for(let k=0;k<3;k++){const u=(t*.35+k/3+c.ph)%1;fx.fillStyle=`rgba(200,200,200,${.25*(1-u)*(1-fk)})`;fx.beginPath();fx.arc(gx+s*.6+u*s*2,gy-s*2-u*s*4,s*(.3+u*.8),0,6.284);fx.fill()}}}
        if(c.castle){const s=sc*.55;fx.fillStyle=mix('#d8ccb4',fog,fk);fx.strokeStyle=`rgba(20,12,8,${1-fk})`;fx.lineWidth=Math.max(.6,s*.06);
          fx.fillRect(gx-s,gy-s*1.4,s*2,s*1.4);fx.strokeRect(gx-s,gy-s*1.4,s*2,s*1.4);[-1,1].forEach(k=>{fx.fillRect(gx+k*s-s*.35,gy-s*2,s*.7,s*2);fx.strokeRect(gx+k*s-s*.35,gy-s*2,s*.7,s*2)});
          fx.fillStyle=mix('#7a2a24',fog,fk);[-1,1].forEach(k=>{fx.beginPath();fx.moveTo(gx+k*s-s*.45,gy-s*2);fx.lineTo(gx+k*s,gy-s*2.7);fx.lineTo(gx+k*s+s*.45,gy-s*2);fx.fill()});
          fx.strokeStyle=`rgba(30,20,10,${1-fk})`;fx.beginPath();fx.moveTo(gx,gy-s*1.4);fx.lineTo(gx,gy-s*2.6);fx.stroke();fx.fillStyle=mix(c.castle,fog,fk);fx.beginPath();fx.moveTo(gx,gy-s*2.6);fx.lineTo(gx+s*.7+Math.sin(t*6+c.ph)*s*.1,gy-s*2.4);fx.lineTo(gx,gy-s*2.2);fx.fill();
          fx.fillStyle=`rgba(255,200,110,${1-fk})`;fx.fillRect(gx-s*.15,gy-s*.6,s*.3,s*.6)}
      }
      if(c.inf&&t>=c.inf&&!(t>=c.sick)){const u=seg(t,c.inf,c.inf+1.2);if(u<1){fx.strokeStyle=`rgba(150,255,160,${.22*(1-u)})`;fx.lineWidth=1.5;fx.beginPath();fx.ellipse(gx,gy,sc*(.4+1.6*u),sc*(.2+.7*u),0,0,6.284);fx.stroke()}}
      if(c.sick&&t>=c.sick){const u=seg(t,c.sick,c.sick+.5),s=sc*(c.origin?1:.7);
        const bm=fx.createLinearGradient(gx,gy-s*9,gx,gy);bm.addColorStop(0,'rgba(120,255,140,0)');bm.addColorStop(1,`rgba(150,255,150,${.55*u*(.8+.2*Math.sin(t*7+c.ph))})`);fx.fillStyle=bm;fx.fillRect(gx-s*.45,gy-s*9,s*.9,s*9);
        if(u<1){fx.strokeStyle=`rgba(190,255,170,${1-u})`;fx.lineWidth=3;fx.beginPath();fx.ellipse(gx,gy,s*(.5+3*u),s*(.25+1.4*u),0,0,6.284);fx.stroke()}
        for(let k=0;k<4;k++){const v=(t*.4+k/4+c.ph)%1;fx.fillStyle=`rgba(120,230,130,${.22*(1-v)})`;fx.beginPath();fx.arc(gx+Math.sin(t+k)*s*.4,gy-v*s*3,s*(.5+v),0,6.284);fx.fill()}
        if(dz<26){const k=s*.28;fx.fillStyle='#eef3d8';fx.beginPath();fx.arc(gx,gy-s*1.1,k,Math.PI,0);fx.lineTo(gx+k*.6,gy-s*1.1+k*.9);fx.lineTo(gx-k*.6,gy-s*1.1+k*.9);fx.fill();fx.fillStyle='#1b100b';fx.beginPath();fx.arc(gx-k*.4,gy-s*1.12,k*.25,0,6.284);fx.arc(gx+k*.4,gy-s*1.12,k*.25,0,6.284);fx.fill()}}
    })}
  for(let i=0;i<22;i++){const x=((i*97+t*14)%1500)-110,y=HOR+6+(i%4)*10+lerp(0,140,green)*((i%5)/5);const r=120+(i%3)*50;const g=fx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(110,220,120,${.14*green})`);g.addColorStop(1,'rgba(110,220,120,0)');fx.fillStyle=g;fx.beginPath();fx.ellipse(x,y,r,r*.4,0,0,6.284);fx.fill()}
  const vg=fx.createLinearGradient(0,0,0,720);vg.addColorStop(0,'rgba(0,0,0,.35)');vg.addColorStop(.4,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.4)');fx.fillStyle=vg;fx.fillRect(0,0,1280,720);
}

/* ---------- the effects canvas (in scene coordinates, under the same camera) ---------- */
const R=Math.random;
let fxP=[],lastT=0;
function fxCam(){const k=FX.width/1280;fx.setTransform(k*CAM.z,0,0,k*CAM.z,k*(640-CAM.cx*CAM.z),k*(360-CAM.cy*CAM.z))}
function puff(x,y,r,a,c){const g=fx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${c},${a})`);g.addColorStop(1,`rgba(${c},0)`);fx.fillStyle=g;fx.beginPath();fx.arc(x,y,r,0,6.284);fx.fill()}
function fly(p,t,dt,s){p.a+=Math.sin(t*3+p.ph)*.3;p.x+=Math.cos(p.a)*p.v*dt;p.y+=Math.sin(p.a)*p.v*dt;
  fx.fillStyle='rgba(210,225,235,.5)';fx.beginPath();fx.ellipse(p.x-s*.7,p.y-s*.8,s,s*.45,-.6+Math.sin(t*70+p.ph)*.6,0,6.284);fx.ellipse(p.x+s*.7,p.y-s*.8,s,s*.45,.6-Math.sin(t*70+p.ph)*.6,0,6.284);fx.fill();
  fx.fillStyle='#120e0a';fx.beginPath();fx.ellipse(p.x,p.y,s*.8,s*.6,p.a,0,6.284);fx.fill()}
function flame(x,y,s,t,i){for(let j=0;j<3;j++){const h=(28+16*Math.sin(t*12+j*1.7+i))*s;fx.fillStyle=['rgba(255,80,10,.85)','rgba(255,160,40,.85)','rgba(255,230,140,.9)'][j];
  fx.beginPath();fx.moveTo(x-14*s+j*9*s,y);fx.quadraticCurveTo(x-10*s+j*9*s,y-h*.6,x-5*s+j*9*s+Math.sin(t*9+j+i)*4*s,y-h);fx.quadraticCurveTo(x+j*9*s,y-h*.4,x-2*s+j*9*s,y);fx.fill()}}
function rat(x,y,dir,t){fx.save();fx.translate(x,y);fx.scale(dir,1);fx.fillStyle='#3a3030';fx.beginPath();fx.ellipse(0,0,13,7,0,0,6.284);fx.fill();fx.beginPath();fx.moveTo(10,-3);fx.lineTo(22,0);fx.lineTo(10,4);fx.fill();
  fx.strokeStyle='#5a4848';fx.lineWidth=1.6;fx.beginPath();fx.moveTo(-12,0);fx.quadraticCurveTo(-26,-6+Math.sin(t*14)*4,-34,2);fx.stroke();fx.fillStyle='#e05a5a';fx.beginPath();fx.arc(16,-2,1.4,0,6.284);fx.fill();fx.restore()}
function drawFx(t,scene,T){
  const dt=Math.min(.05,Math.max(0,t-lastT));lastT=t;
  fx.setTransform(1,0,0,1,0,0);fx.clearRect(0,0,FX.width,FX.height);
  if(scene==='map'){drawFly(T);return}
  fxCam();
  if(scene==='den'){
    for(let i=0;i<10;i++)puff(140+i*120+Math.sin(t*.6+i)*30,560+Math.cos(t*.5+i)*20,110,.14,'70,190,100');
    P.candles.forEach(([x,y],i)=>{const h=16+5*Math.sin(t*13+i*2);puff(x,y-8,60,.35,'255,170,80');fx.fillStyle='rgba(255,200,90,.95)';fx.beginPath();fx.moveTo(x-5,y);fx.quadraticCurveTo(x-5,y-h*.6,x+Math.sin(t*9+i)*2,y-h);fx.quadraticCurveTo(x+5,y-h*.6,x+5,y);fx.fill()});
    for(let k=0;k<6;k++){const u=(t*.5+k/6)%1;puff(640+Math.sin(t*2+k)*40,606-u*120,30+u*40,.35*(1-u),'110,240,140')}
    if(t>22&&t<27)rat(((t-22)*90)%1600-160,614,1,t);
    if(t>27.5){const a=seg(t,27.5,28)*.9;for(let i=0;i<14;i++){const u=(t*1.5+i*.071)%1;fx.strokeStyle=`rgba(255,140,60,${a*.5})`;fx.lineWidth=2;fx.beginPath();const x=200+i*70,y=u*720;fx.moveTo(x,y);fx.lineTo(x-4,y+14);fx.stroke()}}
  }
  if(scene==='sick'){
    const m=seg(t,43.6,46);
    for(let i=0;i<16;i++){const a=t*.4+i*.39,r=150+60*Math.sin(t*.7+i);puff(640+Math.cos(a)*r,380+Math.sin(a)*r*.8,120,.3*m*(1-seg(t,55,57)),'90,210,110')}
    if(t<54.8)for(let k=0;k<4;k++){const u=(t*.3+k/4)%1;puff(P.chimney[0]+u*30,P.chimney[1]-u*90,12+u*26,.3*(1-u),'200,200,200')}
    if(t>44&&t<55&&R()<.5)fxP.push({k:'fly',x:640+(R()-.5)*500,y:380+(R()-.5)*360,a:R()*6.28,v:90+R()*120,ph:R()*6,born:t});
    if(t>45&&t<55)rat(lerp(380,900,((t-45)*.18)%1),560+Math.sin(t)*10,1,t);
    if(t>54.8){const f=seg(t,54.8,56.4)*(1-seg(t,57.6,58.8));for(let i=0;i<22;i++){const a=i/22*6.284,rr=40+((i*53)%200);flame(640+Math.cos(a)*rr,420+Math.sin(a)*rr*.8,f*(1.5+((i*7)%5)*.25),t,i)}
      if(R()<.6)fxP.push({k:'ember',x:640+(R()-.5)*420,y:420+(R()-.5)*200,vy:-80-R()*120,vx:(R()-.5)*40,born:t})}
  }
  if(scene==='church'){
    const ar=lerp(10,700,ease(seg(t,66.5,72.5)));
    if(t>63){fx.save();fx.globalCompositeOperation='lighter';for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*.17+Math.sin(t*.3+i)*.02,L=900;fx.fillStyle=`rgba(255,220,150,${.05*seg(t,63,66)})`;fx.beginPath();fx.moveTo(640,500);fx.lineTo(640+Math.cos(a-.035)*L,500+Math.sin(a-.035)*L);fx.lineTo(640+Math.cos(a+.035)*L,500+Math.sin(a+.035)*L);fx.fill()}fx.restore()}
    for(let i=0;i<30;i++){const a=i/30*6.284+t*.05,base=520+((i*97)%260),r=Math.max(base,ar+80+((i*31)%90));puff(600+Math.cos(a)*r,520+Math.sin(a)*r*.55,140,.28*(1-seg(t,72,74)*.6),'90,200,110')}
    if(t>64.5&&R()<.4)fxP.push({k:'spark',x:600+(R()-.5)*ar*1.4,y:520+(R()-.5)*ar*.7,vy:-30-R()*40,born:t});
  }
  if(scene==='plea'){if(R()<.7)fxP.push({k:'ember',x:R()*1280,y:760,vy:-60-R()*120,vx:(R()-.5)*30,born:t})}
  fxP=fxP.filter(p=>{
    if(p.k==='fly'){fly(p,t,dt,5);return t-p.born<4&&scene==='sick'}
    if(p.k==='ember'){p.x+=p.vx*dt;p.y+=p.vy*dt;const a=Math.max(0,1-(t-p.born)/3);fx.fillStyle=`rgba(255,${150+Math.floor(80*a)},60,${a})`;fx.beginPath();fx.arc(p.x,p.y,2.4,0,6.284);fx.fill();return a>0&&(scene==='sick'||scene==='plea')}
    if(p.k==='spark'){p.y+=p.vy*dt;const a=Math.max(0,1-(t-p.born)/2.5);fx.fillStyle=`rgba(255,236,150,${a})`;fx.beginPath();fx.arc(p.x,p.y,2+Math.sin(t*20+p.x)*1,0,6.284);fx.fill();return a>0&&scene==='church'}
    return false});
}

/* ---------- frame ---------- */
const SCENES=['map','den','sick','church','plea'];
function frame(T){
  const t=warp(T);
  let f=0;
  if(t<2.4)f=1-.62*seg(t,.2,2.4);else if(t<7.4)f=.38*(1-seg(t,5.6,7.4));
  [[21.6,22,22.4],[42.6,43,43.4],[58.6,59,59.6],[73.8,74.2,74.6]].forEach(([a,b,c])=>{if(t>=a&&t<b)f=seg(t,a,b);else if(t>=b&&t<c)f=1-seg(t,b,c)});
  if(t>=94)f=seg(t,94,96);
  $('fade').setAttribute('opacity',f.toFixed(3));
  $('title').setAttribute('opacity',(seg(t,1.2,2.8)*(1-seg(t,5.4,6.6))).toFixed(3));
  $('flash').setAttribute('opacity',(flashAt(t)*.6).toFixed(3));
  const [S,k]=shotAt(t),ke=ease(k);
  SCENES.forEach(id=>$(id).style.display=S[1]===id?'':'none');P.mapUI.style.display=S[1]==='map'?'':'none';
  let jx=0,jy=0;if((t>27.5&&t<30.3)||(t>54.8&&t<58)){jx=Math.sin(t*41)*1.6;jy=Math.cos(t*37)*1.6}
  setCam(lerp(S[2],S[5],ke)+jx,lerp(S[3],S[6],ke)+jy,lerp(S[4],S[7],ke));
  if(S[1]==='map')mapFrame(T);if(S[1]==='den')denFrame(t);if(S[1]==='sick')sickFrame(t);if(S[1]==='church')churchFrame(t);if(S[1]==='plea')pleaFrame(t);
  drawFx(t,S[1],T);
  let sub='',god=false;for(const L of (T<27.5?MAP_LINES:LINES))if((T<27.5?T:t)>=L[0]-.1&&(T<27.5?T:t)<L[1]+.3){sub=L[2]==='n'?`<i>${L[4]}</i>`:`<b>${L[3].toUpperCase()}</b>${L[4]}`;god=L[2]==='g'}
  if(t>=74.2)sub='';
  if(sub!==lastSub){$('sub').innerHTML=sub;$('sub').style.opacity=sub?1:0;$('sub').classList.toggle('god',god);lastSub=sub}
  $('sub').classList.toggle('top',S[1]==='den'&&t<39.1);
}
function mapFrame(t){
  let n=0,h=0;SICK.forEach(c=>{if(t>=c.sick)n++;else if(t>=c.inf)h++});
  const o=(seg(t,13,13.4)*(1-seg(t,26.8,27.5))).toFixed(3);
  if(t<SHOW_T){P.counter.textContent='?';P.counterSub.textContent='squares sick: none that anyone can see'}
  else{P.counter.textContent=n;P.counterSub.textContent=h?`squares sick, and ${h} more caught, unseen`:'squares fallen sick at once'}
  P.counter.setAttribute('opacity',o);P.counterSub.setAttribute('opacity',o);
}
function denFrame(t){
  actDen(t);
  P.dGlow.setAttribute('opacity',(.45+.1*Math.sin(t*3)).toFixed(3));
  P.bowl.setAttribute('opacity',(.7+.25*Math.sin(t*4)).toFixed(3));
  const eo=ease(seg(t,27.6,28.6));P.eye.setAttribute('opacity',(seg(t,27.4,27.7)*(1-seg(t,30.0,30.5))).toFixed(3));
  P.lidT.setAttribute('transform',`translate(0 ${-eo*90})`);P.lidB.setAttribute('transform',`translate(0 ${eo*90})`);
  P.iris.setAttribute('transform',`translate(${Math.sin(t*1.1)*40} 0)`);
  P.dRed.setAttribute('opacity',(.3*seg(t,27.5,29)).toFixed(3));
  P.mHands.forEach((h,i)=>{const k=i?1:-1,up=Math.sin(t*7.5+(i?Math.PI:0));h.setAttribute('transform',`translate(${1189+k*44} ${492-up*22})`);
    const n=P.mNums[i];n.setAttribute('x',1189+k*44);n.setAttribute('y',452-up*22);n.setAttribute('opacity',(up>.3&&t>=37.4?Math.min(1,(up-.3)*3):0).toFixed(2))});
  P.tags.forEach((g,i)=>g.setAttribute('opacity',(seg(t,NAME_T[i],NAME_T[i]+.5)*(1-seg(t,42.4,42.8))).toFixed(3)));
}
function sickFrame(t){
  P.sRot.setAttribute('opacity',(.75*seg(t,43.8,46.5)).toFixed(3));
  P.cotWin.setAttribute('fill',t>47?'#2a2014':'#ffcf7a');
  P.half.setAttribute('opacity',(seg(t,44.3,44.8)*(1-seg(t,47.2,47.6))).toFixed(3));
  P.soldiers.forEach((s,i)=>{const d=48.2+i*.5,u=ease(seg(t,d,d+.4));s.b.setAttribute('transform',`rotate(${u*88} 0 28) translate(0 ${u*4})`);s.b.setAttribute('opacity',(1-seg(t,d+.6,d+1.2)).toFixed(3));
    P.crosses[i].setAttribute('opacity',seg(t,d+.7,d+1.2).toFixed(3))});
  const tk=seg(t,51.2,51.6)*(1-seg(t,54.5,54.8));P.tenth.setAttribute('opacity',tk.toFixed(3));P.tenth.setAttribute('transform',`translate(640 380) scale(${1+.08*Math.sin(t*6)*tk}) translate(-640 -380)`);
  P.ash.setAttribute('opacity',(seg(t,56.4,58.2)).toFixed(3));
  P.sHex.setAttribute('opacity',(1-seg(t,57.4,58.6)).toFixed(3));
}
function churchFrame(t){
  const b=ease(seg(t,59.4,63.4)),top=lerp(620,-100,b);P.buildRect.setAttribute('d',`M380,${top} L900,${top} L900,620 L380,620Z`);
  P.scaf.setAttribute('opacity',(1-seg(t,63.2,64.2)).toFixed(3));
  P.sun.setAttribute('cy',lerp(560,420,seg(t,59,74)).toFixed(1));
  const ring=t>64?Math.sin((t-64)*4.2)*22*Math.exp(-((t-64)%2.4)*.4):0;P.bell.setAttribute('transform',`translate(775,282) rotate(${ring.toFixed(1)})`);
  P.rose.setAttribute('fill',t>63.6?`rgb(255,${200+Math.floor(30*Math.sin(t*3))},110)`:'#8a6a3a');
  P.doorLight.setAttribute('opacity',(.85*seg(t,65.2,66.2)).toFixed(3));
  const dest=[[430,600],[600,620],[860,600],[330,580],[1000,585]];
  P.priests.forEach((p,i)=>{const s=66+i*.55,u=ease(seg(t,s,s+2.6)),x=lerp(600,dest[i][0],u),y=lerp(570,dest[i][1],u)-Math.abs(Math.sin(t*6+i))*3*(u<1&&u>0?1:0);
    p.setAttribute('opacity',seg(t,s,s+.4).toFixed(3));p.setAttribute('transform',`translate(${x} ${y}) scale(${lerp(.7,1,u)})`)});
  P.folk.forEach((g,i)=>{const bow=t>66+i*.3?Math.min(1,(t-66-i*.3)/.6):0;g.firstChild.setAttribute('transform',`rotate(${bow*14} 0 10)`)});
  P.birds.forEach((b,i)=>{const x=((t-59)*(60+i*12)+i*180)%1500-100,y=180+i*26+Math.sin(t*2+i)*10;b.setAttribute('transform',`translate(${x} ${y}) scale(1 ${Math.sin(t*10+i).toFixed(2)})`)});
  const ar=lerp(10,700,ease(seg(t,66.5,72.5)));P.aura.setAttribute('r',ar.toFixed(1));P.aura.setAttribute('opacity',(.7*seg(t,66.5,67.5)).toFixed(3));
}
function pleaFrame(t){
  P.plea.forEach((x,i)=>{const s=[75,77.4,79.8][i],u=seg(t,s,s+.5);x.setAttribute('opacity',(u*(1-seg(t,82.8,83.4))).toFixed(3));x.setAttribute('transform',`translate(640 ${250+i*110}) scale(${lerp(1.25,1,ease(u))}) translate(-640 ${-(250+i*110)})`)});
  P.card.setAttribute('opacity',seg(t,83.6,84.4).toFixed(3));
  P.pleaGlow.setAttribute('opacity',(.35+.12*Math.sin(t*5)).toFixed(3));
}

/* ---------- the score: a fixed progression, bar by bar, scheduled ahead on the audio clock ---------- */
const BAR=3.0;                                       // a slow 80 beats a minute
const SECTIONS=[ // [from, chords (MIDI roots + quality), loudness, melody density, octave]
 [0,   [[50,'m'],[48,'M'],[46,'M'],[45,'M']],.55,.3,0],    // Dm, C, Bb, A: the old descending lament
 [27,  [[50,'m'],[51,'M'],[50,'m'],[45,'M']],.6,.45,0],    // Dm, Eb, Dm, A: the criminals (a dark half-step)
 [48,  [[50,'m'],[46,'M'],[43,'m'],[45,'M']],.5,.2,-12],   // Dm, Bb, Gm, A: the sickness
 [66,  [[50,'m'],[53,'M'],[46,'M'],[45,'M']],.55,.35,0],   // Dm, F, Bb, A: the church, solemn hope, still in minor
 [81,  [[50,'m'],[51,'M'],[46,'M'],[45,'M']],.8,.55,0],    // Dm, Eb, Bb, A: the gods' command
 [99,  [[50,'m']],.65,0,0]];                               // ends on D minor
let MUS=null;
function musInit(){
  try{A.lp.disconnect()}catch(e){} try{A.sub.disconnect()}catch(e){}   // the old drifting drone is silenced
  const bus=A.c.createGain();bus.gain.value=.9;const lp=A.c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1500;lp.Q.value=.5;
  const rev=A.c.createConvolver(),len=A.c.sampleRate*2.6,ir=A.c.createBuffer(2,len,A.c.sampleRate);
  for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.4)}
  rev.buffer=ir;const wet=A.c.createGain();wet.gain.value=.32;
  bus.connect(lp);lp.connect(A.music);lp.connect(rev);rev.connect(wet);wet.connect(A.music);
  A.music.gain.value=.6;MUS={bus,next:0,t0:A.c.currentTime};
}
function tone(f,at,dur,vol,type,att,rel){const o=A.c.createOscillator(),g=A.c.createGain();o.type=type||'triangle';o.frequency.value=f;
  g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(vol,at+(att||.02));g.gain.setValueAtTime(vol,at+Math.max(att||.02,dur-(rel||.3)));g.gain.linearRampToValueAtTime(0,at+dur);
  o.connect(g);g.connect(MUS.bus);o.start(at);o.stop(at+dur+.05)}
function chordNotes(root,q){return [root,root+(q==='m'?3:4),root+7]}
function score(t){
  if(!MUS)musInit();
  while(MUS.next*BAR<t+1.2&&MUS.next*BAR<LEN-1){
    const b=MUS.next++,bt=b*BAR,at=MUS.t0+bt;let S=SECTIONS[0];SECTIONS.forEach(s=>{if(bt>=s[0]-.01)S=s});
    const ci=Math.floor((bt-S[0]+.01)/BAR)%S[1].length,[root,q]=S[1][ci],cn=chordNotes(root,q),L=S[2]*(bt<4?bt/4:1)*(bt>LEN-6?Math.max(0,(LEN-1-bt)/5):1);
    const last=S===SECTIONS[SECTIONS.length-1];
    // strings: the chord held through the bar, overlapping into the next so nothing drops out
    cn.forEach((n,i)=>{tone(hz(n),at,BAR*(last?2.5:1.15),.035*L,'sawtooth',.6,.8);tone(hz(n)*1.003,at,BAR*(last?2.5:1.15),.03*L,'triangle',.5,.7)});
    // bass: the root on beats one and three
    tone(hz(root-12),at,BAR*.48,.13*L,'sine',.02,.25);if(!last)tone(hz(root-12),at+BAR*.5,BAR*.45,.1*L,'sine',.02,.25);
    // melody: an arpeggio from the chord's own notes, so it can never clash
    if(S[3]>0){const pat=[2,1,0,1];for(let k=0;k<4;k++){if(((b*7+k*3)%10)/10>=S[3])continue;tone(hz(cn[pat[k]]+12+S[4]),at+k*BAR/4,BAR/4*1.4,.05*L,'triangle',.08,.35)}}
    // drums for the gods: a low drum on the downbeat in the darker sections
    if(!last){const o=A.c.createOscillator(),g=A.c.createGain();o.frequency.setValueAtTime(90,at);o.frequency.exponentialRampToValueAtTime(42,at+.3);g.gain.setValueAtTime(.32*L,at);g.gain.exponentialRampToValueAtTime(.001,at+.5);o.connect(g);g.connect(MUS.bus);o.start(at);o.stop(at+.55)}
  }
}

/* ---------- sound ---------- */
let BZ=null;
function sfxThunder(v){if(!A)return;burst(140,.7,2.4,.9*v,'lowpass');burst(2400,.6,.35,.45*v,'highpass');thump(.6*v)}
function sfxBell(){if(!A)return;const n=A.c.currentTime;[146.8,293.7,349.2,440,587.3].forEach((f,i)=>{const o=A.c.createOscillator(),g=A.c.createGain();o.frequency.value=f;g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime([.3,.18,.1,.08,.05][i],n+.01);g.gain.exponentialRampToValueAtTime(.0005,n+4.5-i*.5);o.connect(g);g.connect(A.music);o.start(n);o.stop(n+4.6)})}
function sfxChime(){if(!A)return;const n=A.c.currentTime;[880,1174.7].forEach((f,i)=>{const o=A.c.createOscillator(),g=A.c.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(.06-i*.02,n+.01);g.gain.exponentialRampToValueAtTime(.0005,n+.9);o.connect(g);g.connect(A.sfx);o.start(n);o.stop(n+1)})}
function sfxBoom(){if(!A)return;thump(.8);burst(90,.5,1.6,.6,'lowpass')}
function buzzInit(){const o=A.c.createOscillator(),lf=A.c.createOscillator(),lg=A.c.createGain(),bp=A.c.createBiquadFilter(),g=A.c.createGain();
  o.type='sawtooth';o.frequency.value=230;lf.frequency.value=23;lg.gain.value=14;lf.connect(lg);lg.connect(o.frequency);bp.type='bandpass';bp.frequency.value=520;bp.Q.value=2;g.gain.value=0;
  o.connect(bp);bp.connect(g);g.connect(A.sfx);o.start();lf.start();BZ=g}
function sounds(T){
  if(!A)return;
  score(T);
  const t=warp(T);
  if(T<27.5){const atR=(key,time)=>{if(T>=time&&!done[key]){done[key]=1;return true}return false};
    for(let i=0;i<10;i++)if(atR('hid'+i,HID_T(i)))burst(300,3,.4,.04,'lowpass');        // a whisper as each one is caught, and nothing to see
    for(let k=0;k<8;k++)if(atR('show'+k,SHOW_T+k*.22)){thump(.45);burst(500+k*60,2,.3,.14)}
    if(atR('showboom',SHOW_T))sfxBoom();
    MAP_LINES.forEach((L,i)=>{if(L[5]&&atR('M'+i,L[0]))say(L)})}
  const hope=t>=59&&t<74.2;
  A.wind.gain.value=t<22?.09:(hope?.02:.06);
  if(!BZ)buzzInit();BZ.gain.value=t>44&&t<54.8?.07:0;
  const at=(key,time)=>{if(t>=time&&!done[key]){done[key]=1;return true}return false};
  const every=(key,from,to,gap,fn)=>{if(t>=from&&t<to&&t>=(nxt[key]||0)){fn();nxt[key]=t+gap()}};
  FLASHES.forEach((a,i)=>{if(at('th'+i,a))sfxThunder(i===0?.8:1)});
  if(at('titleboom',1.4))sfxBoom();
  NAME_T.forEach((n,i)=>{if(at('nm'+i,n)){sfxBoom();burst(3000,1,.3,.12,'highpass')}});
  every('hb',43.6,54.8,()=>.9,()=>{thump(.32);setTimeout(()=>{if(A)thump(.2)},230)});
  every('fire',54.8,58.4,()=>.03+Math.random()*.06,()=>burst(1800+Math.random()*2500,1.5,.06,.18));
  if(at('roar',54.8))burst(300,.5,3.2,.5,'lowpass');
  every('build',59.4,63.4,()=>.35,()=>{thump(.25);burst(2500,3,.05,.12)});
  if(at('bell1',64))sfxBell();if(at('bell2',66.4))sfxBell();if(at('bell3',68.8))sfxBell();if(at('bell4',71.2))sfxBell();
  every('chime',66.5,73,()=>.5+Math.random()*.4,sfxChime);
  ['p1','p2','p3'].forEach((k,i)=>{if(at(k,[75,77.4,79.8][i])){thump(.7);burst(120,.6,1.2,.5,'lowpass')}});
  if(at('bellEnd',83.6))sfxBell();if(at('bellEnd2',87))sfxBell();
  LINES.forEach((L,i)=>{if(L[5]&&at('L'+i,L[0]))say(L)});
  VO_EXTRA.forEach(([s,id])=>{if(at('V'+id,s))say([s,s,'n','','',id])});
}
const CLIPS={};
function loadClips(){VO_EXTRA.map(v=>[0,0,'n','','',v[1]]).concat(MAP_LINES,LINES).forEach(L=>{const id=L[5];if(!id||CLIPS[id]!==undefined)return;CLIPS[id]=null;
  fetch('vo/'+id+'.mp3').then(r=>r.arrayBuffer()).then(b=>A.c.decodeAudioData(b)).then(buf=>{CLIPS[id]=buf}).catch(()=>{})})}
/* A line with no recording is read aloud by the device's own voice: the deepest male English voice it has, slowed and pitched down */
let VOICE=null;
function pickVoice(){const vs=(window.speechSynthesis&&speechSynthesis.getVoices())||[];if(!vs.length)return null;
  const pref=['Daniel','Arthur','Google UK English Male','Microsoft Ryan','Microsoft George','Fred','Alex','Aaron','Rishi','Microsoft Guy','Microsoft David'];
  for(const p of pref){const v=vs.find(v=>v.name.indexOf(p)>=0&&/^en/i.test(v.lang));if(v)return v}
  return vs.find(v=>/^en-GB/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang))||vs[0]}
function speak(txt,dur){if(!window.speechSynthesis||muted)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(txt.replace(/<[^>]+>/g,'').replace(/…/g,'... '));
  VOICE=VOICE||pickVoice();if(VOICE){u.voice=VOICE;u.lang=VOICE.lang}u.pitch=.45;u.rate=Math.min(1,Math.max(.72,txt.length/14/dur));u.volume=1;speechSynthesis.speak(u)}catch(e){}}
function say(L){const buf=CLIPS[L[5]];if(!buf)return;const s=A.c.createBufferSource();s.buffer=buf;const g=A.c.createGain();g.gain.value=L[2]==='g'?1.35:1.5;s.connect(g);g.connect(A.master);s.start()}

/* ---------- run ---------- */
function loop(){if(!playing)return;const t=(performance.now()-t0)/1000;frame(Math.min(t,LEN));sounds(t);if(t<LEN)requestAnimationFrame(loop);else playing=false}
function unlockAudio(){                              // iPhones keep Web Audio silent on the ring/silent switch unless the page asks for media playback
  try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
  try{const a=new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');a.play().catch(()=>{})}catch(e){}
  if(A){try{const b=A.c.createBuffer(1,1,22050),s=A.c.createBufferSource();s.buffer=b;s.connect(A.c.destination);s.start(0)}catch(e){}}
}
function start(){
  if(!A){try{initAudio()}catch(e){A=null}}
  unlockAudio();
  if(A&&A.c.state==='suspended')A.c.resume();
  if(A)loadClips();
  done={};nxt={};lastChord=-1;lastNote=-1;fxP=[];lastT=0;if(A){if(!MUS)musInit();MUS.next=0;MUS.t0=A.c.currentTime+.05}
  t0=performance.now();playing=true;loop();
}
if(window.speechSynthesis)speechSynthesis.onvoiceschanged=()=>{VOICE=pickVoice()};
window.sagaSeek=function(t){playing=false;lastT=t-.016;frame(t)};
$('start').addEventListener('click',()=>{$('start').style.display='none';start()});
$('rep').addEventListener('click',()=>{$('start').style.display='none';start()});
$('mute').addEventListener('click',()=>{muted=!muted;if(muted&&window.speechSynthesis)speechSynthesis.cancel();$('mute').textContent='Sound: '+(muted?'off':'on');if(A)A.master.gain.value=muted?0:.8});
frame(0);
