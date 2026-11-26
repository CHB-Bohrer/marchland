/* ================= THE DEN: a glowing glass, two schemers, a window on the storm ================= */
const ANNA_O={w:45,female:true,skin:'#f2cfae',skinSh:'#c39a7c',hair:'#e0b65a',hairSh:'#a7782e',hairHi:'#fff0b0',eye:'#2a5a9a',eyeHi:'#9cc8f0',cloth:'#2f6a72',clothSh:'#1a4249',trim:'#e8e0c8',style:'anna',shade:-1,brow:'#8a6024',
  warts:[[5,29,5.5],[-30,40,4.6],[31,33,4.2],[-12,64,4.4],[18,56,3.4],[-38,18,3.6],[24,10,3.0]]};
const LINA_O={w:46,female:true,skin:'#a8714a',skinSh:'#74482c',hair:'#1b130e',hairSh:'#0c0806',hairHi:'#5a4232',eye:'#4a2a12',eyeHi:'#c08a50',cloth:'#9a4e24',clothSh:'#5e2c12',trim:'#3a2a1e',style:'lina',shade:1,brow:'#120a06',
  wart:'#7d6a3e',wartSh:'#58472a',warts:[[2,31,5.2],[28,42,4.6],[-29,32,4.2],[11,65,4.4],[-17,56,3.5],[37,16,3.6],[-24,10,3.0]]};
(function(){
  const D=document.getElementById('den');
  el('rect',{width:1280,height:720,fill:grad('denWall',[[0,'#0d0b10'],[.55,'#1d1519'],[1,'#120d0f']],true,{x1:0,y1:0,x2:0,y2:1})},D);
  for(let r=0;r<12;r++)for(let c=0;c<15;c++){const x=c*92+(r%2?-46:0),y=r*58;el('rect',{x:x+2,y:y+2,width:88,height:54,rx:9,fill:['#1c161a','#211a1e','#19141a'][(r+c)%3],stroke:'#0a0709','stroke-width':3,opacity:.9},D)}
  el('ellipse',{cx:640,cy:420,rx:520,ry:300,fill:'url(#glow)',opacity:.55},D);
  // shelves of bottles on the left, a cobweb in the corner
  [[60,190],[60,300]].forEach(([x,y],j)=>{el('rect',{x,y,width:210,height:12,fill:'#2a1a10',stroke:LINE,'stroke-width':2},D);
    for(let k=0;k<6;k++){const bx=x+14+k*32,bh=22+((k+j)%3)*12,c=['#2e5a3a','#5a2a4a','#2a3a5a','#6a5a1a'][(k+j)%4];
      el('path',{d:`M${bx},${y} v${-bh+8} q0,-8 7,-8 v-7 h6 v7 q7,0 7,8 v${bh-8}Z`,fill:c,stroke:LINE,'stroke-width':1.5},D);
      el('path',{d:`M${bx+4},${y-4} v${-bh+14}`,stroke:'#cfe8c0','stroke-width':1.6,opacity:.35},D)}});
  const web=el('g',{opacity:.35},D);for(let a=0;a<6;a++)el('path',{d:`M0,0 L${Math.cos(a*.3)*170},${Math.sin(a*.3)*170}`,stroke:'#cfc9c0','stroke-width':1},web);
  for(let r=1;r<5;r++)el('path',{d:`M${r*38},0 Q${r*30},${r*22} ${Math.cos(1.5)*r*38},${Math.sin(1.5)*r*38}`,stroke:'#cfc9c0','stroke-width':1,fill:'none'},web);
  // the window: night sky, storm, the town where Ant lives, and later the Eye
  const wx=900,wy=80,ww=230,wh=260,arch=`M${wx},${wy+wh} V${wy+90} Q${wx},${wy} ${wx+ww/2},${wy} Q${wx+ww},${wy} ${wx+ww},${wy+90} V${wy+wh}Z`;
  const W=el('g',{'clip-path':clip('winC',arch)},D);
  el('rect',{x:wx,y:wy,width:ww,height:wh,fill:grad('winSky',[[0,'#05060f'],[.6,'#1b1834'],[1,'#3a2238']],true,{x1:0,y1:0,x2:0,y2:1})},W);
  P.winClouds=[];for(let i=0;i<6;i++){const c=el('ellipse',{cx:wx+i*50,cy:wy+50+(i%3)*28,rx:80,ry:24,fill:'#0c0c18',opacity:.9,filter:'url(#b10)'},W);P.winClouds.push(c)}
  P.eye=el('g',{opacity:0},W);
  el('ellipse',{cx:wx+ww/2,cy:wy+110,rx:150,ry:90,fill:'url(#fire)',opacity:.75,filter:'url(#b24)'},P.eye);
  const eyeD=`M${wx+20},${wy+110} Q${wx+ww/2},${wy+40} ${wx+ww-20},${wy+110} Q${wx+ww/2},${wy+180} ${wx+20},${wy+110}Z`;
  el('path',{d:eyeD,fill:'#f4e2b0',stroke:'#2a0a04','stroke-width':4},P.eye);
  const EI=el('g',{'clip-path':clip('eyeC',eyeD)},P.eye);
  P.iris=el('g',{},EI);
  el('circle',{cx:wx+ww/2,cy:wy+110,r:42,fill:grad('irisG',[[0,'#ffe07a'],[.45,'#ff7a1a'],[1,'#6a1000']],false)},P.iris);
  el('ellipse',{cx:wx+ww/2,cy:wy+110,rx:7,ry:36,fill:'#0a0302'},P.iris);
  el('circle',{cx:wx+ww/2+14,cy:wy+96,r:7,fill:'#fff',opacity:.8},P.iris);
  P.lidT=el('rect',{x:wx,y:wy,width:ww,height:110,fill:'#120a08'},EI);P.lidB=el('rect',{x:wx,y:wy+110,width:ww,height:100,fill:'#120a08'},EI);
  // town rooftops along the bottom of the window, one window lit: someone is shouting from it
  el('path',{d:`M${wx},${wy+wh} V${wy+212} l18,-14 18,14 v-22 l22,-18 22,18 v14 l16,-12 16,12 v-30 l20,-16 20,16 v24 l24,-18 24,18 v8 l18,-12 14,10 V${wy+wh}Z`,fill:'#07060a'},W);
  P.antWin=el('rect',{x:wx+102,y:wy+206,width:10,height:12,fill:'#ffcc66',opacity:.5},W);
  el('rect',{x:wx+48,y:wy+214,width:7,height:9,fill:'#ffcc66',opacity:.35},W);
  P.winFlash=el('rect',{x:wx,y:wy,width:ww,height:wh,fill:'#e8eeff',opacity:0},W);
  el('path',{d:arch,fill:'none',stroke:'#2a1a10','stroke-width':14},D);
  el('path',{d:`M${wx+ww/2},${wy} V${wy+wh} M${wx},${wy+150} H${wx+ww}`,stroke:'#2a1a10','stroke-width':8},D);
  el('path',{d:`M${wx-14},${wy+wh} H${wx+ww+14}`,stroke:'#3a2414','stroke-width':16},D);
  P.winLight=el('path',{d:`M${wx},${wy+wh} L${wx+ww},${wy+wh} L${wx+ww-80},700 L${wx-260},700Z`,fill:'#ffb07a',opacity:0,filter:'url(#b24)'},D);
  // the two of them
  P.anna=character(D,ANNA_O);P.lina=character(D,LINA_O);
  P.anna.pose(420,300,.95);P.lina.pose(860,300,.95);
  // green light from the glass, over their faces
  P.faceGlow=el('ellipse',{cx:640,cy:420,rx:420,ry:230,fill:'url(#glow)',opacity:.35,style:'mix-blend-mode:screen'},D);
  P.redGlow=el('rect',{width:1280,height:720,fill:'#ff2a10',opacity:0,style:'mix-blend-mode:multiply'},D);
  // the table
  el('path',{d:'M0,560 Q640,540 1280,560 L1280,720 L0,720Z',fill:'#2a180c',stroke:LINE,'stroke-width':4},D);
  for(let k=0;k<9;k++)el('path',{d:`M${k*150-30},${570+(k%3)*30} Q${k*150+60},${560+(k%2)*40} ${k*150+160},${575+(k%3)*25}`,stroke:'#1a0e06','stroke-width':2,fill:'none',opacity:.7},D);
  el('path',{d:'M0,560 Q640,540 1280,560',stroke:'#5a3a1c','stroke-width':3,fill:'none',opacity:.7},D);
  // candles
  P.flames=[];[[250,560],[1040,560],[1120,566]].forEach(([x,y],i)=>{const h=[70,90,50][i];
    el('ellipse',{cx:x,cy:y-h-14,rx:70,ry:70,fill:'url(#warm)',opacity:.55},D);
    el('rect',{x:x-10,y:y-h,width:20,height:h,rx:4,fill:'#d8cfae',stroke:LINE,'stroke-width':2},D);
    el('path',{d:`M${x-10},${y-h+4} q4,14 2,24 M${x+6},${y-h+2} q-2,10 2,18`,stroke:'#b8ad8a','stroke-width':3,fill:'none'},D);
    P.flames.push({p:el('path',{fill:'#ffc94a',stroke:'#ff8a1a','stroke-width':1.5},D),x,y:y-h})});
  // the scrying glass on its claw stand
  el('path',{d:'M590,560 Q600,530 620,520 L660,520 Q680,530 690,560Z',fill:'#3a2a1a',stroke:LINE,'stroke-width':3},D);
  [-1,1].forEach(k=>el('path',{d:`M${640+k*30},560 q${k*20},-8 ${k*34},4 q${-k*14},-2 ${-k*20},6Z`,fill:'#2a1c10',stroke:LINE,'stroke-width':2},D));
  P.glassGlow=el('circle',{cx:640,cy:445,r:140,fill:'url(#glow)',opacity:.9},D);
  el('circle',{cx:640,cy:445,r:84,fill:'#2a2016',stroke:LINE,'stroke-width':4},D);
  el('circle',{cx:640,cy:445,r:76,fill:grad('glassG',[[0,'#1d3a2a'],[1,'#07100b']],false)},D);
  const G=el('g',{'clip-path':(()=>{const c=el('clipPath',{id:'glassC'},document.querySelector('defs'));el('circle',{cx:640,cy:445,r:74},c);return 'url(#glassC)'})()},D);
  // picture 1: Anna's step counter, 8,763
  P.pic1=el('g',{},G);
  el('rect',{x:588,y:408,width:104,height:74,rx:16,fill:'#050505',stroke:'#3a3a3a','stroke-width':3},P.pic1);
  el('text',{x:640,y:447,'text-anchor':'middle','font-size':27,'font-weight':700,fill:'#f4f4f4','font-family':'Arial,Helvetica,sans-serif'},P.pic1).textContent='8,763';
  el('text',{x:640,y:472,'text-anchor':'middle','font-size':12,fill:'#cfd6d0','font-family':'Arial,Helvetica,sans-serif'},P.pic1).textContent='steps';
  el('path',{d:'M630,454 q6,-5 12,-1 l6,4 q2,2 -1,3 l-16,0 q-3,-2 -1,-6Z',fill:'#5ad0c8'},P.pic1);
  el('rect',{x:622,y:414,width:12,height:6,rx:1,fill:'#bbb'},P.pic1);el('path',{d:'M650,413 l4,4 -4,4 M654,417 h-6',stroke:'#bbb','stroke-width':1.5,fill:'none'},P.pic1);
  // picture 2: the old phone screenshot, 7,092
  P.pic2=el('g',{opacity:0},G);
  el('rect',{x:596,y:388,width:88,height:118,rx:10,fill:'#f2f5f1',stroke:'#999','stroke-width':2},P.pic2);
  el('text',{x:640,y:404,'text-anchor':'middle','font-size':9,fill:'#333','font-family':'Arial,sans-serif'},P.pic2).textContent='fitbit';
  el('circle',{cx:640,cy:436,r:18,fill:'none',stroke:'#1d6a5a','stroke-width':5},P.pic2);
  el('text',{x:640,y:476,'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#222','font-family':'Arial,sans-serif'},P.pic2).textContent='7,092';
  el('text',{x:640,y:489,'text-anchor':'middle','font-size':8,fill:'#555','font-family':'Arial,sans-serif'},P.pic2).textContent='Steps';
  // picture 3: caught. The same picture twice, and a red SAME across them
  P.pic3=el('g',{opacity:0},G);
  [-1,1].forEach(k=>{const x=640+k*34;el('rect',{x:x-30,y:425,width:60,height:42,rx:9,fill:'#050505',stroke:'#444','stroke-width':2},P.pic3);
    el('text',{x,y:450,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#f4f4f4','font-family':'Arial,sans-serif'},P.pic3).textContent='8,763';
    el('text',{x,y:478,'text-anchor':'middle','font-size':8,fill:'#e88','font-family':'Arial,sans-serif'},P.pic3).textContent=k<0?'ANNA':'LINA'});
  el('text',{x:640,y:452,'text-anchor':'middle','font-size':18,'font-weight':800,fill:'#ff3a2a','font-family':'Arial,sans-serif'},P.pic3).textContent='=';
  el('text',{x:640,y:418,'text-anchor':'middle','font-size':19,'font-weight':800,fill:'#ff2a1a','letter-spacing':3,'font-family':'Arial,sans-serif',transform:'rotate(-10 640 418)'},P.pic3).textContent='SAME';
  el('circle',{cx:640,cy:445,r:74,fill:'url(#sheen)'},D);
  // the copied picture, flying from Anna to Lina
  P.card=el('g',{opacity:0},D);
  el('rect',{x:-26,y:-19,width:52,height:38,rx:8,fill:'#050505',stroke:'#7affb0','stroke-width':2.5,filter:'url(#b4)'},P.card);
  el('rect',{x:-26,y:-19,width:52,height:38,rx:8,fill:'#050505',stroke:'#c8ffd8','stroke-width':1.5},P.card);
  el('text',{x:0,y:5,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff','font-family':'Arial,sans-serif'},P.card).textContent='8,763';
})();

/* ================= THE VISTA: the realm below, and what is coming over it ================= */
(function(){
  const V=document.getElementById('vista');
  el('rect',{width:1280,height:720,fill:grad('vSky',[[0,'#07060f'],[.4,'#221632'],[.66,'#6a2a2a'],[.8,'#b0522a'],[1,'#3a1a12']],true,{x1:0,y1:0,x2:0,y2:1})},V);
  P.vClouds=[];for(let i=0;i<9;i++){const c=el('g',{},V);P.vClouds.push([c,i]);for(let k=0;k<4;k++)el('ellipse',{cx:k*70,cy:Math.sin(k*1.9)*10,rx:90,ry:26,fill:'#120c18',opacity:.85,filter:'url(#b10)'},c)}
  el('path',{d:'M0,400 L80,350 L170,378 L260,320 L360,360 L470,300 L560,352 L660,318 L760,362 L860,306 L960,350 L1060,312 L1170,356 L1280,330 L1280,720 L0,720Z',fill:'#2a1c2c'},V);
  el('path',{d:'M0,420 L120,384 L240,410 L380,370 L520,414 L640,388 L780,418 L920,380 L1060,414 L1180,390 L1280,410 L1280,720 L0,720Z',fill:'#20161e'},V);
  // the valley floor: a patchwork of fields
  el('path',{d:'M0,430 Q640,400 1280,430 L1280,720 L0,720Z',fill:'#2c3a1e'},V);
  const fc=['#3e5226','#556a2c','#6a5a2a','#4a6230','#5e4e26','#3a4a22'];
  for(let r=0;r<6;r++)for(let c=0;c<12;c++){const y0=432+r*r*9+r*12,h=10+r*9,x0=c*108-40+(r%2)*50,w=100+r*14;
    el('path',{d:`M${x0},${y0} L${x0+w},${y0-3} L${x0+w+r*6},${y0+h} L${x0-r*5},${y0+h+3}Z`,fill:fc[(r*5+c*3)%6],stroke:'#1e2814','stroke-width':1.2,opacity:.9},V)}
  P.vFields=el('path',{d:'M0,430 Q640,400 1280,430 L1280,720 L0,720Z',fill:'#4a3418',opacity:0},V);   // eaten brown by the locusts
  // the river: from the far hills down through the valley, blue, then red
  const riv='M700,408 Q660,430 700,452 Q760,480 640,510 Q500,546 560,590 Q640,640 420,690 Q300,716 220,740';
  el('path',{d:riv,stroke:'#14202e','stroke-width':40,fill:'none','stroke-linecap':'round'},V);
  el('path',{d:riv,stroke:'#3a6a9a','stroke-width':30,fill:'none','stroke-linecap':'round'},V);
  P.riverRed=el('path',{d:riv,stroke:'#8e0d12','stroke-width':31,fill:'none','stroke-linecap':'round','stroke-dasharray':'1400','stroke-dashoffset':'1400'},V);
  P.riverSheen=el('path',{d:riv,stroke:'#ff9a8a','stroke-width':3,fill:'none','stroke-dasharray':'14 60',opacity:.4},V);
  // the village by the river: their land
  const vg=el('g',{},V);
  [[760,470],[800,462],[836,474],[790,492],[860,456],[820,500],[880,486]].forEach(([x,y],i)=>{const s=.8+(i%3)*.15;
    el('path',{d:`M${x-14*s},${y} v${-14*s} l${14*s},${-12*s} l${14*s},${12*s} v${14*s}Z`,fill:'#2a1c14',stroke:'#0a0604','stroke-width':1.5},vg);
    el('rect',{x:x-3*s,y:y-10*s,width:5*s,height:6*s,fill:'#ffc35a',opacity:.8},vg)});
  el('path',{d:'M890,470 l10,-60 l10,60Z',fill:'#2a1c14',stroke:'#0a0604','stroke-width':1.5},vg);   // a keep's tower
  el('path',{d:'M900,410 v-18 l16,6 -16,6',fill:'#2f6a72'},vg);
  // the hill they stand on, in the foreground
  el('path',{d:'M0,640 Q240,600 520,632 Q760,660 980,616 Q1140,590 1280,610 L1280,720 L0,720Z',fill:'#0c0a0a'},V);
  for(let i=0;i<40;i++){const x=i*33+(i%3)*7,y=630+Math.sin(i*1.3)*14;el('path',{d:`M${x},${y+20} l4,-22 l3,18 l4,-26 l3,30`,stroke:'#0c0a0a','stroke-width':3,fill:'none'},V)}
})();

/* ================= THE FACES: the two of them, staring at what is coming ================= */
(function(){
  const F=document.getElementById('faces');
  el('rect',{width:1280,height:720,fill:grad('fSky',[[0,'#0a0610'],[.5,'#3a1218'],[1,'#8a2a12']],true,{x1:0,y1:0,x2:0,y2:1})},F);
  P.fClouds=[];for(let i=0;i<7;i++){const c=el('ellipse',{cx:i*200,cy:120+(i%3)*60,rx:180,ry:46,fill:'#14080e',opacity:.85,filter:'url(#b24)'},F);P.fClouds.push(c)}
  el('path',{d:'M0,560 Q320,520 640,548 Q960,574 1280,530 L1280,720 L0,720Z',fill:'#0a0607'},F);
  P.anna2=character(F,ANNA_O);P.lina2=character(F,LINA_O);
  P.anna2.pose(450,330,1.22);P.lina2.pose(840,330,1.22);P.anna2.warts(1);P.lina2.warts(1);
  P.fRed=el('rect',{width:1280,height:720,fill:'#ff3a10',opacity:.25,style:'mix-blend-mode:multiply'},F);
  P.fDark=el('rect',{width:1280,height:720,fill:'#020104',opacity:0},F);
})();
