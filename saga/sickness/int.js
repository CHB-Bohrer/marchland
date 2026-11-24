/* ================= INTERIOR ================= */
(function(){
  const I=document.getElementById('int');
  el('rect',{width:1280,height:460,fill:grad('wallG',[[0,'#1d120b'],[.6,'#3a2516'],[1,'#2a1a10']],true,{x1:0,y1:0,x2:0,y2:1})},I);
  for(let i=0;i<34;i++){const x=i*38;el('path',{d:`M${x},90 V460`,stroke:'#170d07','stroke-width':2.5,opacity:.8},I);if(i%3==0)el('path',{d:`M${x+12},${140+(i*37)%200} q6,20 0,40`,stroke:'#4a3020','stroke-width':1.5,fill:'none',opacity:.6},I)}
  [0,300,720,1000,1250].forEach(x=>{el('rect',{x,y:0,width:34,height:460,fill:'#25170e',stroke:LINE,'stroke-width':2},I);el('path',{d:`M${x+30},0 V460`,stroke:'#5a3d26','stroke-width':2,opacity:.6},I)});
  el('rect',{y:62,width:1280,height:32,fill:'#24160d',stroke:LINE,'stroke-width':3},I);
  el('path',{d:'M0,64 H1280',stroke:'#6a4a2e','stroke-width':2,opacity:.6},I);
  /* herbs from beam */
  for(let i=0;i<9;i++){const x=360+i*44+(i>4?260:0);if(x>560&&x<720)continue;const h=40+(i%3)*14;
    el('path',{d:`M${x},94 V${94+h*.4}`,stroke:'#1a100a','stroke-width':1.5},I);
    el('path',{d:`M${x-9},${94+h*.4} Q${x},${94+h*1.3} ${x+9},${94+h*.4}Z`,fill:i%2?'#3c4a26':'#4a3a22',stroke:LINE,'stroke-width':1.5},I)}
  /* window + moon rays */
  el('rect',{x:780,y:150,width:110,height:130,fill:'#16233a',stroke:LINE,'stroke-width':4},I);
  el('rect',{x:784,y:154,width:102,height:122,fill:'url(#cold)'},I);
  el('path',{d:'M835,150 V280 M780,215 H890',stroke:'#1a100a','stroke-width':6},I);
  P.ray=el('path',{d:'M784,154 L886,154 L1010,460 L840,460Z',fill:'url(#ray)'},I);
  /* shelves */
  [[1060,170],[1060,250]].forEach(([x,y])=>{el('rect',{x,y,width:180,height:10,fill:'#3a2414',stroke:LINE,'stroke-width':2},I);
    for(let k=0;k<6;k++){const bx=x+12+k*28,bh=26+(k%3)*10,c=['#2e4a3a','#5a2a2a','#3a3a5a'][k%3];el('path',{d:`M${bx},${y} v${-bh+8} q0,-8 6,-8 v-6 h6 v6 q6,0 6,8 v${bh-8}Z`,fill:c,stroke:LINE,'stroke-width':1.5},I);el('path',{d:`M${bx+3},${y-4} v${-bh+14}`,stroke:'#e9d7a8','stroke-width':1.5,opacity:.5},I)}});
  /* fireplace */
  const F=el('g',{},I);
  el('rect',{x:20,y:170,width:270,height:290,fill:'#3a3633',stroke:LINE,'stroke-width':4},F);
  for(let r=0;r<10;r++)for(let c=0;c<6;c++){const w=44;el('rect',{x:22+c*w+(r%2?-22:0),y:172+r*29,width:w-2,height:27,rx:5,fill:['#4a4540','#423d38','#504a44'][(r+c)%3],stroke:'#1c1a18','stroke-width':1.5},F)}
  el('rect',{x:0,y:150,width:310,height:24,fill:'#2a1a10',stroke:LINE,'stroke-width':3},F);
  el('path',{d:'M62,460 L62,300 Q155,250 248,300 L248,460Z',fill:'#0a0605',stroke:LINE,'stroke-width':4},F);
  P.fireGlow=el('ellipse',{cx:155,cy:420,rx:380,ry:300,fill:'url(#warm)',opacity:.6},I);
  el('path',{d:'M90,452 L220,440 L226,456 L96,462Z',fill:'#2a170c',stroke:LINE,'stroke-width':2},F);
  P.flames=[['#ff6a1a',1.0],['#ffa23a',.8],['#ffe08a',.55]].map(([c,s],i)=>el('path',{fill:c,opacity:.95},F));
  [[60,150],[240,150]].forEach(([x,y])=>{el('rect',{x:x-6,y:y-30,width:12,height:30,fill:'#d9cfae',stroke:LINE,'stroke-width':1.5},I);el('ellipse',{cx:x,cy:y-38,rx:4,ry:8,fill:'#ffd36b'},I);el('circle',{cx:x,cy:y-36,r:30,fill:'url(#warm)',opacity:.6},I)});
  /* door */
  el('rect',{x:570,y:170,width:140,height:290,fill:'#06080a',stroke:LINE,'stroke-width':5},I);
  P.outside=el('g',{},I);
  el('rect',{x:574,y:174,width:132,height:282,fill:grad('doorOut',[[0,'#1b2a2a'],[1,'#3a5a32']],true,{x1:0,y1:0,x2:0,y2:1})},P.outside);
  el('ellipse',{cx:640,cy:420,rx:90,ry:40,fill:'#b8ff8a',opacity:.25,filter:'url(#b10)'},P.outside);
  P.doorRays=el('path',{d:'M574,174 L706,174 L820,720 L460,720Z',fill:'url(#grayRay)',opacity:0},I);
  P.door=el('g',{},I);
  el('rect',{x:574,y:174,width:132,height:282,fill:'#3a2414',stroke:LINE,'stroke-width':3},P.door);
  for(let k=1;k<5;k++)el('path',{d:`M${574+k*26.4},174 V456`,stroke:'#22150b','stroke-width':2.5},P.door);
  [214,400].forEach(y=>el('rect',{x:574,y,width:132,height:12,fill:'#2b2b2e',stroke:LINE,'stroke-width':2},P.door));
  el('circle',{cx:690,cy:320,r:6,fill:'#8a7a52',stroke:LINE,'stroke-width':2},P.door);
  /* floor */
  el('rect',{y:458,width:1280,height:262,fill:grad('floorG',[[0,'#2d1d11'],[1,'#120a05']],true,{x1:0,y1:0,x2:0,y2:1})},I);
  for(let i=-12;i<=12;i++)el('path',{d:`M${640+i*60},458 L${640+i*170},720`,stroke:'#0d0704','stroke-width':2,opacity:.7},I);
  [490,530,590,660].forEach(y=>el('path',{d:`M0,${y} H1280`,stroke:'#0d0704','stroke-width':1.5,opacity:.5},I));
  el('ellipse',{cx:925,cy:520,rx:120,ry:26,fill:'#a9c4ff',opacity:.08},I);
  /* background patrons (silhouettes) */
  [[470,372,.42],[520,380,.4],[880,376,.4]].forEach(([x,y,s],i)=>{const g=el('g',{transform:`translate(${x},${y}) scale(${s})`,opacity:.85},I);
    el('path',{d:'M-90,200 Q-90,80 -30,60 L30,60 Q90,80 90,200Z',fill:'#140c07'},g);el('circle',{cy:10,r:44,fill:'#1a110a'},g);(P.bgPat=P.bgPat||[]).push(g)});
  el('rect',{x:430,y:440,width:140,height:20,fill:'#1d120a'},I);el('rect',{x:840,y:444,width:100,height:16,fill:'#1d120a'},I);
  /* travelers (behind tables) */
  const sickO={skin:'#9cae86',skinSh:'#6f8262',hair:'#2a2a24',hairSh:'#151512',hairHi:'#4a4a40',eye:'#5a4a2a',eyeHi:'#a89a6a',cloth:'#3a3a2e',clothSh:'#23241c',trim:'#5a4a3a',style:'hood',sick:true,full:true,w:44,brow:'#22201a'};
  P.trav=[2,1,0].map(i=>{const c=character(I,Object.assign({},sickO,{shade:i==1?-1:1,cloth:['#3a3a2e','#423a2e','#33392e'][i],skin:['#9cae86','#a3a88a','#93a682'][i]}));c.set('sick');c.g.setAttribute('opacity',0);return c}).reverse();
  /* main cast */
  P.pietro=character(I,{w:52,skin:'#d39a6c',skinSh:'#9e6a48',hair:'#2e1d12',hairSh:'#170e08',hairHi:'#6a4a30',eye:'#6a3e1a',eyeHi:'#d9a66a',cloth:'#6a4433',clothSh:'#3e261b',trim:'#2a1a10',style:'pietro',shade:-1,brow:'#1e120a'});
  P.elisa=character(I,{w:46,female:true,skin:'#e8b892',skinSh:'#b07e5e',hair:'#5a2a1a',hairSh:'#30150c',hairHi:'#9a5a3a',eye:'#2e6a3a',eyeHi:'#9ad09a',cloth:'#7a3a46',clothSh:'#4a2029',cloak:'#2e2433',trim:'#c9a24e',style:'elisa',shade:1,brow:'#3a1a0e'});
  P.anna=character(I,{w:45,female:true,skin:'#f2cfae',skinSh:'#c39a7c',hair:'#e0b65a',hairSh:'#a7782e',hairHi:'#fff0b0',eye:'#2a5a9a',eyeHi:'#9cc8f0',cloth:'#2f6a72',clothSh:'#1a4249',trim:'#e8e0c8',style:'anna',shade:-1,brow:'#8a6024'});
  P.lina=character(I,{w:46,female:true,skin:'#a8714a',skinSh:'#74482c',hair:'#1b130e',hairSh:'#0c0806',hairHi:'#5a4232',eye:'#4a2a12',eyeHi:'#c08a50',cloth:'#9a4e24',clothSh:'#5e2c12',trim:'#3a2a1e',style:'lina',shade:1,brow:'#120a06'});
  P.pietro.pose(190,300,.82);P.elisa.pose(382,308,.8);P.anna.pose(902,308,.8);P.lina.pose(1088,302,.82);
  /* tables */
  P.cand=[];
  [[290,610],[995,610]].forEach(([x,y],i)=>{
    const g=el('g',{},I);
    el('path',{d:`M${x-200},${y+30} L${x-210},720 M${x+200},${y+30} L${x+210},720`,stroke:'#1a0f07','stroke-width':22},g);
    el('ellipse',{cx:x,cy:y+12,rx:262,ry:66,fill:'#24150a',stroke:LINE,'stroke-width':4},g);
    el('ellipse',{cx:x,cy:y,rx:262,ry:62,fill:'#4a2e16',stroke:LINE,'stroke-width':4},g);
    for(let k=-3;k<=3;k++)el('path',{d:`M${x+k*70},${y-58+Math.abs(k)*6} Q${x+k*72},${y} ${x+k*70},${y+58-Math.abs(k)*6}`,stroke:'#2e1b0c','stroke-width':2,fill:'none',opacity:.7},g);
    el('ellipse',{cx:x,cy:y-6,rx:200,ry:40,fill:'url(#warm)',opacity:.35},g);
    [-150,-90,110,165].forEach((d,j)=>{const mx=x+d,my=y-10+(j%2)*8;
      el('path',{d:`M${mx+16},${my-30} q18,2 16,16 q-2,12 -16,10`,stroke:LINE,'stroke-width':5,fill:'none'},g);
      el('path',{d:`M${mx-16},${my-36} L${mx+16},${my-36} L${mx+14},${my} Q${mx},${my+5} ${mx-14},${my}Z`,fill:'#7a5a30',stroke:LINE,'stroke-width':2.5},g);
      el('path',{d:`M${mx-16},${my-36} q8,-8 16,-2 q8,-6 16,2 v6 h-32Z`,fill:'#efe3bc',stroke:LINE,'stroke-width':1.5},g);
      el('path',{d:`M${mx-8},${my-26} v22`,stroke:'#c9a868','stroke-width':3,opacity:.6},g)});
    const cg=el('g',{},g);
    el('circle',{cx:x+10,cy:y-80,r:90,fill:'url(#warm)',opacity:.55},cg);
    el('rect',{x:x+2,y:y-62,width:16,height:46,fill:'#e6dcc0',stroke:LINE,'stroke-width':2},cg);
    el('ellipse',{cx:x+10,cy:y-16,rx:20,ry:6,fill:'#6a5a3a',stroke:LINE,'stroke-width':2},cg);
    const fl=el('path',{d:`M${x+10},${y-90} q-8,16 0,26 q8,-10 0,-26`,fill:'#ffd36b'},cg);
    P.cand.push({cg,fl,x:x+10,y:y-64});
  });
  P.puffs=[];for(let i=0;i<14;i++)P.puffs.push(el('circle',{r:6,fill:'#b6e08f',opacity:0,filter:'url(#b4)'},I));
  P.dark=el('rect',{width:1280,height:720,fill:'#000',opacity:0},I);
})();
