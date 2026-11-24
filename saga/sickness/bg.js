/* ================= EXTERIOR ================= */
(function(){
  const X=document.getElementById('ext');
  el('rect',{width:1280,height:720,fill:grad('skyX',[[0,'#070c18'],[.45,'#1a2240'],[.75,'#3a3150'],[1,'#5e3c3f']],true,{x1:0,y1:0,x2:0,y2:1})},X);
  for(let i=0;i<70;i++)el('circle',{cx:(i*137)%1280,cy:(i*71)%300,r:(i%4)*.35+.5,fill:'#e8e4d0',opacity:.25+(i%5)*.1},X);
  el('circle',{cx:1000,cy:150,r:150,fill:'#c8d4c8',opacity:.12,filter:'url(#b24)'},X);
  el('circle',{cx:1000,cy:150,r:52,fill:grad('moonG',[[0,'#f6f3dc'],[.7,'#dcdcc0'],[1,'#b6b89a']],false)},X);
  el('path',{d:'M982,132 q10,-6 18,2 M1012,170 q8,4 14,-4',stroke:'#a9aa8e','stroke-width':4,fill:'none',opacity:.6},X);
  P.clouds=[];
  [[200,110,1.2],[640,70,1],[1150,210,1.3],[420,230,.9],[900,90,.8]].forEach(([x,y,s],i)=>{
    const c=el('g',{},X);P.clouds.push([c,x,y,s,i]);
    for(let k=0;k<6;k++){const ox=(k-2.5)*60,oy=Math.sin(k*1.7)*12;
      el('ellipse',{cx:ox,cy:oy+14,rx:80,ry:32,fill:'#141827',opacity:.9,filter:'url(#b10)'},c);
      el('ellipse',{cx:ox+8,cy:oy-4,rx:60,ry:16,fill:'#5c6684',opacity:.35,filter:'url(#b10)'},c)}});
  const mtn=(d,f,o)=>el('path',{d,fill:f,opacity:o},X);
  mtn('M0,400 L90,330 L160,360 L260,290 L340,330 L430,270 L540,340 L620,300 L720,350 L820,280 L920,330 L1020,290 L1120,340 L1200,300 L1280,330 L1280,720 L0,720Z','#2b2c47',.9);
  mtn('M0,440 L120,380 L220,420 L330,360 L460,430 L560,390 L700,440 L820,380 L960,430 L1080,390 L1280,430 L1280,720 L0,720Z','#1d1d33',1);
  el('rect',{y:380,width:1280,height:120,fill:'#4a4a66',opacity:.25,filter:'url(#b24)'},X);
  const pine=(x,y,h,c,rim)=>{const g=el('g',{},X);for(let k=0;k<4;k++){const yy=y-k*h*.22,ww=h*(.34-k*.06);el('path',{d:`M${x-ww},${yy} L${x},${yy-h*.38} L${x+ww},${yy}Z`,fill:c},g);if(rim)el('path',{d:`M${x},${yy-h*.38} L${x+ww},${yy}`,stroke:'#7d89ad','stroke-width':1.5,opacity:.55},g)}el('rect',{x:x-3,y,width:6,height:h*.12,fill:c},g)};
  for(let i=0;i<26;i++)pine(i*30+(i%3)*9,520-(i%4)*8,90+(i%5)*22,'#11121e',i%2);
  pine(60,640,260,'#07070c',1);pine(150,660,200,'#07070c',1);
  el('path',{d:'M0,500 Q300,470 640,500 T1280,490 L1280,720 L0,720Z',fill:'#16130f'},X);
  el('path',{d:'M0,690 Q260,640 520,620 Q760,600 960,598 L1010,598 Q800,640 640,690 L620,720 L0,720Z',fill:'#2c241a'},X);
  el('path',{d:'M0,670 Q300,620 600,610 Q800,602 970,600 M40,700 Q330,650 640,632',stroke:'#1a140e','stroke-width':5,fill:'none',opacity:.8},X);
  el('path',{d:'M0,660 Q300,612 600,604 Q800,598 970,598',stroke:'#4a3e2c','stroke-width':2,fill:'none',opacity:.6},X);
  /* ---- tavern ---- */
  const T=el('g',{},X);
  el('ellipse',{cx:1020,cy:615,rx:260,ry:40,fill:'url(#warm)',opacity:.55},T);
  el('rect',{x:840,y:550,width:380,height:56,fill:'#2c2a2e',stroke:LINE,'stroke-width':3},T);
  for(let r=0;r<3;r++)for(let c=0;c<10;c++)el('rect',{x:842+c*38+(r%2)*19,y:552+r*18,width:36,height:17,rx:4,fill:r%2?'#3a3840':'#33313a',stroke:'#15141a','stroke-width':1.5},T);
  el('rect',{x:848,y:380,width:364,height:172,fill:'#4a3f36',stroke:LINE,'stroke-width':3},T);
  el('rect',{x:848,y:380,width:364,height:172,fill:'#000',opacity:.25},T);
  ['M848,380 V552','M1212,380 V552','M940,380 V552','M1120,380 V552','M848,466 H1212','M848,380 L940,466','M1212,380 L1120,466'].forEach(d=>el('path',{d,stroke:'#22160e','stroke-width':12},T));
  el('path',{d:'M820,392 L1030,262 L1240,392Z',fill:'#1b1716',stroke:LINE,'stroke-width':4},T);
  for(let r=0;r<6;r++){const y=280+r*20,hw=(y-262)/130*210;for(let x=1030-hw;x<1030+hw;x+=22)el('path',{d:`M${x},${y} q11,10 22,0`,stroke:'#0e0c0c','stroke-width':2,fill:'none',opacity:.7},T)}
  el('path',{d:'M1030,262 L1240,392',stroke:'#6f7aa0','stroke-width':2.5,opacity:.6},T);
  el('rect',{x:1140,y:268,width:42,height:90,fill:'#2e2c33',stroke:LINE,'stroke-width':3},T);
  P.smoke=[];for(let i=0;i<7;i++)P.smoke.push(el('circle',{r:16,fill:'#6a6a78',opacity:0,filter:'url(#b10)'},T));
  P.wins=[];
  [[870,404],[1146,404],[870,486],[1146,486]].forEach(([x,y])=>{
    P.wins.push(el('circle',{cx:x+22,cy:y+20,r:70,fill:'url(#warm)',opacity:.6},T));
    el('rect',{x,y,width:44,height:40,fill:'#ffbc5a',stroke:LINE,'stroke-width':3},T);
    el('rect',{x:x+3,y:y+22,width:38,height:15,fill:'#e98a2c',opacity:.6},T);
    el('path',{d:`M${x+22},${y} v40 M${x},${y+20} h44`,stroke:LINE,'stroke-width':3},T)});
  el('rect',{x:985,y:470,width:90,height:136,fill:'#1d130c',stroke:LINE,'stroke-width':3},T);
  P.doorCrack=el('rect',{x:1027,y:474,width:7,height:130,fill:'#ffb54a',opacity:.8},T);
  el('path',{d:'M985,470 Q1030,440 1075,470',stroke:'#22160e','stroke-width':10,fill:'none'},T);
  el('path',{d:'M920,440 H860',stroke:LINE,'stroke-width':5},T);
  P.sign=el('g',{transform:'translate(876,442)'},T);
  el('path',{d:'M-14,0 V12 M14,0 V12',stroke:LINE,'stroke-width':2},P.sign);
  el('rect',{x:-40,y:12,width:80,height:36,rx:4,fill:'#5a3e26',stroke:LINE,'stroke-width':3},P.sign);
  el('text',{x:0,y:35,'font-size':12,'text-anchor':'middle',fill:'#e7d39e','font-family':'Cinzel,serif','font-weight':800},P.sign).textContent='TAVERN';
  /* ---- wagon ---- */
  const W=P.wagon=el('g',{},X);
  el('ellipse',{cx:-80,cy:4,rx:260,ry:14,fill:'#000',opacity:.5,filter:'url(#b4)'},W);
  const horse=el('g',{transform:'translate(150,0)'},W);
  P.legs=[[62,-88],[44,-88],[-40,-82],[-56,-84]].map(([x,y],i)=>el('path',{d:`M${x},${y} L${x+2},-2`,stroke:i%2?'#08070a':'#121016','stroke-width':12,'stroke-linecap':'round'},horse));
  el('path',{d:'M-92,-118 Q-60,-138 20,-132 Q60,-130 78,-150 L104,-196 Q112,-212 126,-206 L152,-182 Q160,-170 148,-166 L128,-170 Q110,-150 102,-118 Q94,-92 66,-84 Q10,-74 -50,-80 Q-86,-86 -94,-108 Q-112,-96 -118,-66 Q-114,-104 -92,-118Z',fill:'#100e13',stroke:LINE,'stroke-width':2},horse);
  el('path',{d:'M-60,-134 Q20,-134 76,-150 L104,-198 Q114,-210 126,-205',stroke:'#8a95ba','stroke-width':2.2,fill:'none',opacity:.75},horse);
  el('path',{d:'M84,-156 Q92,-180 104,-196 M76,-150 Q84,-172 96,-190',stroke:'#2a2632','stroke-width':4,fill:'none'},horse);
  el('circle',{cx:134,cy:-194,r:2.5,fill:'#c9d2a0'},horse);
  el('path',{d:'M-20,-180 Q60,-170 120,-178',stroke:'#2a1d12','stroke-width':2,fill:'none'},W);
  el('rect',{x:-270,y:-112,width:252,height:54,fill:'#3d2b1c',stroke:LINE,'stroke-width':3},W);
  for(let i=0;i<3;i++)el('path',{d:`M-270,${-96+i*16} H-18`,stroke:'#22170e','stroke-width':2},W);
  const cv='M-280,-112 Q-286,-206 -232,-238 Q-146,-268 -58,-238 Q-12,-206 -12,-112Z';
  el('path',{d:cv,fill:'#8c7f62',stroke:LINE,'stroke-width':3},W);
  const cg=el('g',{'clip-path':clip('cvc',cv)},W);
  el('path',{d:'M-300,-130 Q-200,-190 -160,-270 L-320,-270Z',fill:'#5e5541'},cg);
  el('path',{d:'M-120,-250 Q-60,-200 -20,-110 L20,-110 L20,-260Z',fill:'#b3a684',opacity:.45},cg);
  for(let i=0;i<4;i++)el('path',{d:`M${-250+i*62},-112 Q${-246+i*62},-200 ${-224+i*62},-250`,stroke:'#4f4634','stroke-width':4,fill:'none'},cg);
  el('rect',{x:-200,y:-180,width:34,height:26,fill:'#6d6248',stroke:LINE,'stroke-width':1.5,transform:'rotate(-8 -183 -167)'},cg);
  el('path',{d:'M-260,-160 L-120,-150',stroke:'#3a5a2a','stroke-width':0},cg);
  P.wheels=[-210,-64].map(x=>{const wg=el('g',{transform:`translate(${x},-44)`},W),r=el('g',{},wg);
    el('circle',{r:44,fill:'none',stroke:'#2b1d11','stroke-width':10},r);el('circle',{r:44,fill:'none',stroke:LINE,'stroke-width':2.5},r);
    for(let k=0;k<6;k++)el('path',{d:'M0,-40 V40',stroke:'#3a2a1a','stroke-width':5,transform:`rotate(${k*30})`},r);
    el('circle',{r:8,fill:'#1a120a',stroke:LINE,'stroke-width':2},r);el('path',{d:'M8,-42 A44,44 0 0 1 42,-10',stroke:'#7d89ad','stroke-width':2,fill:'none',opacity:.6},wg);return r});
  const dr=P.driver=el('g',{transform:'translate(-30,-150)'},W);
  el('path',{d:'M-30,40 Q-40,-20 -6,-44 Q10,-60 26,-40 Q40,-10 34,40Z',fill:'#12130f',stroke:LINE,'stroke-width':2},dr);
  el('path',{d:'M-6,-44 Q10,-60 26,-40',stroke:'#7d89ad','stroke-width':2,fill:'none',opacity:.6},dr);
  el('ellipse',{cx:14,cy:-30,rx:9,ry:7,fill:'#3b4a2e',opacity:.9},dr);
  const lan=P.lantern=el('g',{transform:'translate(6,-210)'},W);
  el('path',{d:'M0,-20 V2',stroke:LINE,'stroke-width':3},lan);
  el('circle',{cy:18,r:60,fill:'url(#warm)'},lan);
  el('path',{d:'M-10,2 L10,2 L12,30 L-12,30Z',fill:'#ffd27a',stroke:LINE,'stroke-width':2.5},lan);
  el('path',{d:'M6,-210 L6,-112',stroke:'#2a1d12','stroke-width':5},W);
  P.wGlow=el('ellipse',{cx:-120,cy:-120,rx:300,ry:170,fill:'url(#sick)',opacity:0},W);
  /* walker beside wagon */
  const wk=P.walker=el('g',{},X);
  el('path',{d:'M-24,0 L-30,-80 Q-36,-130 -10,-150 Q-4,-176 14,-176 Q34,-170 34,-146 Q44,-120 36,-80 L30,0Z',fill:'#0d0e0b',stroke:LINE,'stroke-width':2},wk);
  el('path',{d:'M14,-176 Q34,-170 34,-146 Q44,-120 36,-80',stroke:'#7d89ad','stroke-width':2,fill:'none',opacity:.6},wk);
  el('path',{d:'M44,-120 L60,0',stroke:'#2a1d12','stroke-width':5},wk);
  el('ellipse',{cx:22,cy:-150,rx:7,ry:6,fill:'#5a7a3e',opacity:.8},wk);
  P.wPuffs=[];for(let i=0;i<5;i++)P.wPuffs.push(el('circle',{r:6,fill:'#a9d48a',opacity:0,filter:'url(#b4)'},X));
  /* foreground */
  for(let i=0;i<40;i++){const x=i*33+(i%3)*7;el('path',{d:`M${x},720 Q${x+4},${690-(i%4)*10} ${x+10},${680-(i%5)*8} M${x+6},720 Q${x+12},${700-(i%3)*8} ${x+20},${694}`,stroke:'#0a0908','stroke-width':3,fill:'none'},X)}
  P.fogs=[0,1,2,3].map(i=>el('ellipse',{cx:200+i*360,cy:600+(i%2)*30,rx:340,ry:44,fill:'#a6b2a8',opacity:.14,filter:'url(#b24)'},X));
  P.rain=el('g',{opacity:.25},X);for(let i=0;i<90;i++)el('path',{d:`M${(i*53)%1300},${(i*97)%720} l-6,22`,stroke:'#9fb0c8','stroke-width':1.2},P.rain);
  P.extSick=el('rect',{width:1280,height:720,fill:'url(#sick)',opacity:0},X);
})();
