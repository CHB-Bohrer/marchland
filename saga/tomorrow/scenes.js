/* ================= The Plague Comes Tomorrow: scenes ================= */
const ANNA_O={w:45,female:true,skin:'#f2cfae',skinSh:'#c39a7c',hair:'#e0b65a',hairSh:'#a7782e',hairHi:'#fff0b0',eye:'#2a5a9a',eyeHi:'#9cc8f0',cloth:'#2f6a72',clothSh:'#1a4249',trim:'#e8e0c8',style:'anna',shade:-1,brow:'#8a6024',
  warts:[[5,29,5.5],[-30,40,4.6],[31,33,4.2],[-12,64,4.4],[18,56,3.4],[-38,18,3.6],[24,10,3.0]]};
const LINA_O={w:46,female:true,skin:'#a8714a',skinSh:'#74482c',hair:'#1b130e',hairSh:'#0c0806',hairHi:'#5a4232',eye:'#4a2a12',eyeHi:'#c08a50',cloth:'#9a4e24',clothSh:'#5e2c12',trim:'#3a2a1e',style:'lina',shade:1,brow:'#120a06',
  wart:'#7d6a3e',wartSh:'#58472a',warts:[[2,31,5.2],[28,42,4.6],[-29,32,4.2],[11,65,4.4],[-17,56,3.5],[37,16,3.6],[-24,10,3.0]]};
const CHARLTON_O={w:66,sw:150,skin:'#eab08e',skinSh:'#b9775a',hair:'#5a4a3a',hairSh:'#3a2e24',hairHi:'#8a7a6a',eye:'#5a3a1a',eyeHi:'#b08a4a',cloth:'#6a2a5a',clothSh:'#40183a',trim:'#e0b84a',style:'charlton',shade:1,brow:'#2a1a10',
  wart:'#8a6a4a',wartSh:'#5a4430',warts:[[-36,20,6],[40,30,5.4],[22,-14,4.6],[-24,60,4.8],[30,64,4],[-50,4,4.2],[52,8,3.6],[-8,-30,3.8]]};
const DAVIDE_O={w:47,skin:'#d8a47c',skinSh:'#a8744e',hair:'#1a1410',hairSh:'#0a0806',hairHi:'#5a4a3a',eye:'#3a2a12',eyeHi:'#a88a50',cloth:'#2f5a3a',clothSh:'#1a3a22',cloak:'#3a2a1e',trim:'#c8b890',style:'davide',shade:-1,brow:'#0a0604',
  wart:'#8a744a',wartSh:'#5e4c2e',warts:[[-30,28,5],[30,22,4.6],[-14,-20,4],[22,-30,3.6],[-40,6,3.8],[38,46,4]]};
const JT_O={w:45,female:true,skin:'#f0c8b0',skinSh:'#c0907a',hair:'#7a4428',hairSh:'#552c16',hairHi:'#b8805a',eye:'#3a5a2a',eyeHi:'#9ac080',cloth:'#5a2a6a',clothSh:'#3a1848',trim:'#f0e8d8',style:'jt',shade:-1,brow:'#24140c',
  warts:[[-28,26,5],[30,36,4.6],[10,-16,3.8],[-14,62,4.2],[38,8,3.4],[-38,48,3.4]]};
const JACK_O={w:48,skin:'#e8b898',skinSh:'#b88060',hair:'#c0541a',hairSh:'#8a3410',hairHi:'#f08a40',eye:'#3a5a7a',eyeHi:'#9ac0e0',cloth:'#3a3a2a',clothSh:'#22221a',trim:'#8a6a3a',style:'jack',shade:1,brow:'#8a3410',
  warts:[[26,26,5],[-10,-24,4],[34,-6,3.6],[18,64,4],[-36,40,3.8]]};
const MARIO_O={w:46,skin:'#f0c8a0',skinSh:'#c0946a',hair:'#3a2a1a',hairSh:'#22180e',hairHi:'#6a5040',eye:'#4a2a12',eyeHi:'#c08a50',cloth:'#2a5aa0',clothSh:'#1a3a70',trim:'#f0e0a0',style:'mario',shade:-1,brow:'#22180e',warts:[]};
function hexPts(cx,cy,r){let s='';for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-30);s+=(cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1)+' '}return s}
function hash(a,b,c){const x=Math.sin(a*127.1+b*311.7+c*74.7)*43758.5453;return x-Math.floor(x)}

/* ================= THE MAP: the realm from the air is painted on the canvas (see flyover in main.js) ================= */
(function(){
  const M=el('g',{},$('over'));$('over').insertBefore(M,$('fade'));P.mapUI=M;
  P.counter=el('text',{x:1190,y:150,'text-anchor':'end','font-family':'Cinzel,serif','font-weight':800,'font-size':58,'letter-spacing':4,fill:'#c6ffa8',opacity:0,style:'filter:drop-shadow(0 0 14px #1a8a3a) drop-shadow(0 2px 4px #000)'},M);
  P.counterSub=el('text',{x:1190,y:182,'text-anchor':'end','font-family':'Cormorant Garamond,serif','font-style':'italic','font-weight':600,'font-size':24,fill:'#d8ecc8',opacity:0,style:'filter:drop-shadow(0 2px 4px #000)'},M);P.counterSub.textContent='squares fallen sick';
})();

/* ================= THE DEN: Anna and Lina, warts and all ================= */
(function(){
  const D=$('den');
  el('rect',{x:-500,width:2280,height:720,fill:grad('dWall',[[0,'#120c10'],[.6,'#1e1410'],[1,'#0a0604']],true,{x1:0,y1:0,x2:0,y2:1})},D);
  for(let i=-1;i<5;i++){const x=110+i*360;el('path',{d:`M${x},720 L${x},250 Q${x+90},150 ${x+180},250 L${x+180},720`,fill:'none',stroke:'#2a1e16','stroke-width':26},D);
    for(let j=0;j<6;j++)el('rect',{x:x-13,y:280+j*72,width:26,height:3,fill:'#140c08'},D)}
  P.dGlow=el('ellipse',{cx:640,cy:470,rx:520,ry:280,fill:'url(#glow)',opacity:.5,style:'mix-blend-mode:screen'},D);
  // shelves of bottles and skulls in the arches, chains, cobwebs
  [-250,110,470,830,1190,1550].forEach((x,i)=>{for(let j=0;j<2;j++){const y=300+j*90;el('rect',{x:x+10,y:y,width:160,height:8,fill:'#3a2414',stroke:LINE,'stroke-width':1.5},D);
    for(let k=0;k<5;k++){const bx=x+24+k*30,h=22+((i+j+k)*7)%20,c=['#3a7a4a','#7a2a3a','#3a4a8a','#8a7a2a','#5a3a7a'][(i+k+j)%5];
      if((i+j+k)%4===0){el('circle',{cx:bx,cy:y-10,r:10,fill:'#d8d0b8',stroke:LINE,'stroke-width':1.5},D);el('circle',{cx:bx-3.5,cy:y-11,r:2.6,fill:LINE},D);el('circle',{cx:bx+3.5,cy:y-11,r:2.6,fill:LINE},D)}
      else{el('path',{d:`M${bx-7},${y} L${bx-7},${y-h+8} Q${bx-7},${y-h} ${bx-3},${y-h} L${bx-3},${y-h-8} L${bx+3},${y-h-8} L${bx+3},${y-h} Q${bx+7},${y-h} ${bx+7},${y-h+8} L${bx+7},${y}Z`,fill:c,stroke:LINE,'stroke-width':1.5,opacity:.95},D);el('rect',{x:bx-5,y:y-h*.55,width:3,height:h*.4,fill:'#fff',opacity:.25},D)}}}});
  for(let i=0;i<3;i++){const x=290+i*360;let d=`M${x},60`;for(let k=0;k<9;k++)d+=` m0,0 a5,9 0 1 0 0,18`;el('path',{d,stroke:'#3a3a40','stroke-width':3,fill:'none',opacity:.8},D)}
  [[0,0,1],[1280,0,-1]].forEach(([x,y,k])=>{const g=el('g',{transform:`translate(${x},${y}) scale(${k},1)`,opacity:.35},D);for(let r=40;r<=160;r+=40)el('path',{d:`M0,${r} Q${r*.5},${r*.5} ${r},0`,stroke:'#cfc8c0','stroke-width':1,fill:'none'},g);[0,30,60].forEach(a=>{const rad=a*Math.PI/180;el('path',{d:`M0,0 L${Math.cos(rad)*170},${Math.sin(rad)*170}`,stroke:'#cfc8c0','stroke-width':1},g)})});
  // the four of them
  const XS=[92,275,458,640,823,1006,1189];
  P.anna=character(D,ANNA_O);P.lina=character(D,LINA_O);P.charl=character(D,CHARLTON_O);P.jt=character(D,JT_O);P.dav=character(D,DAVIDE_O);P.jack=character(D,JACK_O);P.mario=character(D,MARIO_O);
  P.villains=[['anna',P.anna,0],['lina',P.lina,1.9],['charl',P.charl,3.1],['jt',P.jt,2.4],['dav',P.dav,4.4],['jack',P.jack,5.3],['mario',P.mario,.8]].map((v,i)=>{v.push(XS[i]);return v});
  P.villains.forEach(v=>v[1].pose(v[3],v[0]==='charl'?336:342,v[0]==='charl'?.64:.58));
  // Mario's hands, doing the six-seven
  P.mHands=[-1,1].map(k=>{const g=el('g',{},D);el('path',{d:'M-22,6 Q-24,-8 -10,-12 L14,-12 Q24,-10 22,4 Q10,14 -8,12Z',fill:MARIO_O.skin,stroke:LINE,'stroke-width':2.5},g);
    [-12,-4,4,12].forEach(x=>el('path',{d:`M${x},-12 L${x},-22`,stroke:LINE,'stroke-width':6,'stroke-linecap':'round'},g));[-12,-4,4,12].forEach(x=>el('path',{d:`M${x},-12 L${x},-22`,stroke:MARIO_O.skin,'stroke-width':3.4,'stroke-linecap':'round'},g));return g});
  P.mNums=['6','7'].map(n=>{const t=el('text',{'text-anchor':'middle','font-family':'Cinzel,serif','font-weight':800,'font-size':34,fill:'#ffe27a',stroke:LINE,'stroke-width':2,opacity:0},D);t.textContent=n;return t});
  // the table before them: a scrying bowl of green fire, candles, a scattered map, a rat
  el('path',{d:'M-500,600 L1780,600 L1780,720 L-500,720Z',fill:'#2a1a0e',stroke:LINE,'stroke-width':3},D);
  el('path',{d:'M-500,600 L1780,600',stroke:'#4a3018','stroke-width':6},D);
  el('path',{d:'M420,640 L560,616 L700,632 L640,680 L470,690Z',fill:'#c8b088',stroke:LINE,'stroke-width':2,opacity:.85},D);
  for(let i=0;i<6;i++){const hx=470+i*34,hy=650-(i%2)*10;el('polygon',{points:hexPts(hx,hy,12),fill:'none',stroke:'#7a5a3a','stroke-width':1.2},D)}
  el('ellipse',{cx:640,cy:622,rx:120,ry:26,fill:'#1a1a1a',stroke:LINE,'stroke-width':3},D);
  P.bowl=el('ellipse',{cx:640,cy:614,rx:104,ry:18,fill:'#5fe08a',opacity:.85},D);
  P.candles=[[183,604],[549,604],[731,604],[1097,604]].map(([x,y])=>{el('rect',{x:x-9,y:y-46,width:18,height:46,fill:'#e8dcc0',stroke:LINE,'stroke-width':2},D);el('path',{d:`M${x-9},${y-46} q4,10 0,18`,stroke:'#d8c8a0','stroke-width':4,fill:'none'},D);return [x,y-46]});
  // their names, under them
  P.tags=P.villains.map(([k,,,x])=>{const n={anna:'ANNA',lina:'LINA',charl:'SIR CHARLTON',jt:'JT',dav:'DAVIDE',jack:'JACK',mario:'MARIO 67'}[k],crim=k!=='mario';
    const g=el('g',{opacity:0,'text-anchor':'middle'},D);
    el('rect',{x:x-88,y:528,width:176,height:70,fill:'#000',opacity:.62,filter:'url(#b10)'},g);
    el('text',{x:x,y:556,'font-family':'Cinzel,serif','font-weight':800,'font-size':n.length>8?17:n.length>4?22:26,'letter-spacing':n.length>8?2:5,fill:'#f3e6bf',style:'filter:drop-shadow(0 2px 6px #000)'},g).textContent=n;
    el('path',{d:`M${x-64},564 L${x+64},564`,stroke:'#c9a14e','stroke-width':1.6},g);
    const st=el('g',{transform:`translate(${x} 584) rotate(${crim?-4:4})`},g);
    el('rect',{x:crim?-56:-58,y:-13,width:crim?112:116,height:22,rx:3,fill:'none',stroke:crim?'#e0322a':'#e0b020','stroke-width':2.5},st);
    el('text',{x:0,y:4,'font-family':'Cinzel,serif','font-weight':800,'font-size':15,'letter-spacing':crim?4:3,fill:crim?'#ff3a2a':'#ffd23a',style:'filter:drop-shadow(0 0 5px #600)'},st).textContent=crim?'CRIMINAL':'ANNOYING';
    return g});
  P.dRed=el('rect',{width:1280,height:720,fill:'#ff2a10',opacity:0,style:'mix-blend-mode:multiply'},D);
  el('rect',{y:600,width:1280,height:120,fill:grad('dFloor',[[0,'#000',0],[1,'#000',.9]],true,{x1:0,y1:0,x2:0,y2:1})},D);
  // the gods' eye, opening above them
  const E=el('g',{transform:'translate(640,118)',opacity:0},D);P.eye=E;
  el('ellipse',{cx:0,cy:0,rx:200,ry:70,fill:'url(#fire)',filter:'url(#b10)'},E);
  const lens='M-150,0 Q0,-80 150,0 Q0,80 -150,0Z';el('path',{d:lens,fill:'#fff3d0',stroke:'#2a0a04','stroke-width':4},E);
  const ic=clip('eyeC',lens),EI=el('g',{'clip-path':ic},E);
  P.iris=el('g',{},EI);el('circle',{r:46,fill:grad('eIris',[[0,'#ffe07a'],[.6,'#d0500a'],[1,'#3a0a00']])},P.iris);el('ellipse',{rx:9,ry:36,fill:'#0a0200'},P.iris);el('circle',{cx:14,cy:-16,r:8,fill:'#fff',opacity:.8},P.iris);
  P.lidT=el('rect',{x:-160,y:-90,width:320,height:90,fill:'#120a08'},EI);P.lidB=el('rect',{x:-160,y:0,width:320,height:90,fill:'#120a08'},EI);
})();

/* ================= THE SICKNESS: one square, close up ================= */
(function(){
  const S=$('sick');
  el('rect',{x:-200,y:-200,width:1680,height:1120,fill:grad('sBg',[[0,'#0c1410'],[1,'#050806']],false,{cx:'.5',cy:'.5',r:'.7'})},S);
  P.sHex=el('g',{},S);
  el('polygon',{points:hexPts(640,380,250),fill:'#8a7432',stroke:'#3a2a12','stroke-width':6},P.sHex);
  for(let k=-6;k<=6;k++){const y=380+k*30;el('path',{d:`M${470},${y} Q640,${y-14} ${810},${y}`,stroke:'#d8bc62','stroke-width':5,fill:'none',opacity:.75},P.sHex);
    for(let j=0;j<9;j++){const x=480+j*36+(k%2)*18;if(Math.abs(x-640)/250+Math.abs(y-380)/250>1.05)continue;el('path',{d:`M${x},${y} l-4,-16 M${x},${y} l4,-15 M${x},${y} l0,-18`,stroke:'#e8d07a','stroke-width':2},P.sHex)}}
  // a cottage and a well on the square
  const H=el('g',{transform:'translate(560,250)'},P.sHex);
  el('path',{d:'M-46,40 L-46,0 L46,0 L46,40Z',fill:'#d8c8a8',stroke:LINE,'stroke-width':3},H);el('path',{d:'M-58,4 L0,-40 L58,4Z',fill:'#8a5a2a',stroke:LINE,'stroke-width':3},H);
  for(let i=0;i<5;i++)el('path',{d:`M${-50+i*22},${2-i%2*2} L${-30+i*22},${-14-i%2*2}`,stroke:'#6a4018','stroke-width':2},H);
  el('rect',{x:-10,y:14,width:16,height:26,fill:'#3a2414',stroke:LINE,'stroke-width':2},H);P.cotWin=el('rect',{x:18,y:12,width:16,height:14,fill:'#ffcf7a',stroke:LINE,'stroke-width':2},H);
  el('rect',{x:24,y:-40,width:12,height:24,fill:'#8a7a6a',stroke:LINE,'stroke-width':2},H);P.chimney=[584,210];
  const Wl=el('g',{transform:'translate(740,300)'},P.sHex);
  el('ellipse',{cx:0,cy:18,rx:24,ry:8,fill:'#3a3a3a',stroke:LINE,'stroke-width':2},Wl);el('path',{d:'M-24,18 L-24,0 L24,0 L24,18',fill:'#8a8070',stroke:LINE,'stroke-width':2.5},Wl);
  el('path',{d:'M-20,0 L-20,-30 M20,0 L20,-30 M-28,-30 L28,-30',stroke:'#5a3a1a','stroke-width':4},Wl);el('path',{d:'M-30,-28 L0,-46 L30,-28Z',fill:'#7a4a22',stroke:LINE,'stroke-width':2},Wl);
  P.sRot=el('polygon',{points:hexPts(640,380,250),fill:'#3a4a1a',opacity:0,style:'mix-blend-mode:multiply'},S);
  // a band of soldiers on the square
  P.soldiers=[];for(let i=0;i<5;i++){const x=540+i*50,y=440+(i%2)*20,s=el('g',{transform:`translate(${x},${y})`},S);
    el('ellipse',{cx:0,cy:30,rx:14,ry:4,fill:'#000',opacity:.4},s);
    const b=el('g',{},s);el('path',{d:'M-9,28 L-7,0 Q0,-6 7,0 L9,28Z',fill:'#8a2a24',stroke:LINE,'stroke-width':2},b);el('circle',{cx:0,cy:-10,r:8,fill:'#e2bb94',stroke:LINE,'stroke-width':2},b);
    el('path',{d:'M-9,-12 Q0,-24 9,-12Z',fill:'#7a7a80',stroke:LINE,'stroke-width':1.5},b);el('path',{d:'M12,-30 L12,30',stroke:'#5a3a1a','stroke-width':3},b);el('path',{d:'M12,-30 L8,-22 L16,-22Z',fill:'#cfcfcf',stroke:LINE,'stroke-width':1},b);
    P.soldiers.push({b,x,y})}
  P.crosses=[];for(let i=0;i<5;i++){const c=el('g',{transform:`translate(${540+i*50},${470+(i%2)*20})`,opacity:0},S);el('path',{d:'M0,-26 L0,10 M-10,-14 L10,-14',stroke:'#d8d0c0','stroke-width':5,'stroke-linecap':'round'},c);P.crosses.push(c)}
  P.half=el('g',{opacity:0},S);
  el('text',{x:640,y:250,'text-anchor':'middle','font-family':'Cinzel,serif','font-weight':800,'font-size':120,fill:'#f0e0a0',stroke:'#2a1a08','stroke-width':4,style:'filter:drop-shadow(0 4px 10px #000)'},P.half).textContent='½';
  P.tenth=el('g',{opacity:0},S);
  el('text',{x:640,y:350,'text-anchor':'middle','font-family':'Cinzel,serif','font-weight':800,'font-size':104,fill:'#ff6a5a',stroke:'#1a0404','stroke-width':4,style:'filter:drop-shadow(0 0 16px #a00)'},P.tenth).textContent='1 in 10';
  el('text',{x:640,y:405,'text-anchor':'middle','font-family':'Cormorant Garamond,serif','font-style':'italic','font-weight':600,'font-size':40,fill:'#f0d8c8',style:'filter:drop-shadow(0 2px 4px #000)'},P.tenth).textContent='lost forever';
  P.ash=el('polygon',{points:hexPts(640,380,250),fill:'#141010',opacity:0},S);
})();

/* ================= THE CHURCH: dawn, a bell, priests in gold ================= */
(function(){
  const C=$('church');
  P.cSky=el('rect',{x:-200,y:-200,width:1680,height:1120,fill:grad('cSky',[[0,'#2a2a4a'],[.45,'#b06a4a'],[.7,'#f0b070'],[1,'#f8d8a0']],true,{x1:0,y1:0,x2:0,y2:1})},C);
  P.sun=el('circle',{cx:640,cy:520,r:120,fill:'url(#warm)'},C);
  el('path',{d:'M-200,540 Q200,470 640,500 Q1080,530 1480,470 L1480,920 L-200,920Z',fill:'#3a4a2a'},C);
  el('path',{d:'M-200,600 Q300,560 640,580 Q1000,600 1480,570 L1480,920 L-200,920Z',fill:'#2a3a1e'},C);
  // the church, built in the game's own style: stone gable, bell tower, rose window
  const B=el('g',{},C);P.churchG=B;
  const cc=clip('cBuild','M380,-100 L900,-100 L900,620 L380,620Z');P.buildRect=document.querySelector('#cBuild path');
  B.setAttribute('clip-path',cc);
  const stone='#d8ccb4',stoneSh='#a8987e';
  el('path',{d:'M470,580 L470,380 L600,280 L730,380 L730,580Z',fill:stone,stroke:LINE,'stroke-width':4},B);
  el('path',{d:'M600,280 L730,380 L730,580 L640,580 L640,330Z',fill:stoneSh,opacity:.55},B);
  for(let y=400;y<580;y+=24)el('path',{d:`M474,${y} L726,${y}`,stroke:'#9a8a70','stroke-width':1.5,opacity:.6},B);
  el('path',{d:'M455,388 L600,272 L745,388',fill:'none',stroke:'#7a2a24','stroke-width':16,'stroke-linejoin':'round'},B);
  P.rose=el('circle',{cx:600,cy:395,r:34,fill:'#ffd27a',stroke:LINE,'stroke-width':4},B);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;el('path',{d:`M600,395 L${600+34*Math.cos(a)},${395+34*Math.sin(a)}`,stroke:LINE,'stroke-width':2.5},B)}
  el('circle',{cx:600,cy:395,r:10,fill:'#e04a3a',stroke:LINE,'stroke-width':2},B);
  P.door=el('path',{d:'M570,580 L570,500 Q600,468 630,500 L630,580Z',fill:'#3a2010',stroke:LINE,'stroke-width':4},B);
  P.doorLight=el('path',{d:'M570,580 L570,500 Q600,468 630,500 L630,580Z',fill:'#ffd890',opacity:0},B);
  // the bell tower
  el('path',{d:'M730,580 L730,250 L820,250 L820,580Z',fill:stone,stroke:LINE,'stroke-width':4},B);
  el('path',{d:'M780,250 L820,250 L820,580 L780,580Z',fill:stoneSh,opacity:.55},B);
  el('path',{d:'M745,330 L745,280 Q775,258 805,280 L805,330Z',fill:'#1a1008',stroke:LINE,'stroke-width':3},B);
  P.bell=el('g',{transform:'translate(775,282)'},B);
  el('path',{d:'M-15,34 Q-14,6 0,4 Q14,6 15,34Z',fill:'#d8a83a',stroke:LINE,'stroke-width':2.5},P.bell);el('circle',{cx:0,cy:36,r:4,fill:'#8a6a2a',stroke:LINE,'stroke-width':1.5},P.bell);
  el('path',{d:'M722,252 L775,170 L828,252Z',fill:'#7a2a24',stroke:LINE,'stroke-width':4},B);
  el('path',{d:'M775,170 L775,128 M762,142 L788,142',stroke:'#e8c060','stroke-width':6,'stroke-linecap':'round'},B);
  for(let y=360;y<580;y+=26)el('path',{d:`M734,${y} L816,${y}`,stroke:'#9a8a70','stroke-width':1.5,opacity:.6},B);
  // scaffolding while it goes up
  P.scaf=el('g',{},C);
  [[460,250],[600,170],[740,170],[830,250]].forEach(([x,y])=>el('path',{d:`M${x},590 L${x},${y}`,stroke:'#8a6a3a','stroke-width':5},P.scaf));
  for(let y=560;y>170;y-=70)el('path',{d:`M455,${y} L835,${y}`,stroke:'#8a6a3a','stroke-width':4},P.scaf);
  // the village kneels in the dawn: folk at prayer, a cart, flowers, birds
  P.folk=[[300,640,1],[360,648,-1],[930,640,1],[990,650,-1],[1050,644,1]].map(([x,y,k],i)=>{const g=el('g',{transform:`translate(${x},${y}) scale(${k},1)`},C);
    el('path',{d:'M-14,10 Q-18,-12 -6,-24 Q8,-28 14,-14 Q18,0 16,10Z',fill:['#5a3a2a','#3a4a6a','#6a3a3a','#4a5a3a','#5a4a6a'][i],stroke:LINE,'stroke-width':2},g);
    el('circle',{cx:4,cy:-30,r:8,fill:'#d8a880',stroke:LINE,'stroke-width':2},g);el('path',{d:'M8,-22 L16,-30',stroke:'#d8a880','stroke-width':4,'stroke-linecap':'round'},g);return g});
  const cart=el('g',{transform:'translate(180,600)'},C);el('rect',{x:-40,y:-24,width:80,height:24,fill:'#7a5a32',stroke:LINE,'stroke-width':2.5},cart);[-24,24].forEach(x=>{el('circle',{cx:x,cy:4,r:13,fill:'none',stroke:LINE,'stroke-width':3},cart);el('path',{d:`M${x-13},4 L${x+13},4 M${x},-9 L${x},17`,stroke:LINE,'stroke-width':1.5},cart)});
  for(let i=0;i<40;i++){const x=40+i*31+(i*13)%17,y=665+(i*7)%40;el('circle',{cx:x,cy:y,r:3.2,fill:['#f0d050','#e86a6a','#f0f0f0','#c080e0'][i%4]},C);el('path',{d:`M${x},${y+3} l0,8`,stroke:'#2a4a1a','stroke-width':1.5},C)}
  P.birds=[];for(let i=0;i<6;i++)P.birds.push(el('path',{d:'M-8,0 Q-4,-5 0,0 Q4,-5 8,0',stroke:'#2a1a1a','stroke-width':2.2,fill:'none'},C));
  // the golden aura of the priests, and the priests themselves
  P.aura=el('circle',{cx:600,cy:540,r:10,fill:'url(#warm)',opacity:0,style:'mix-blend-mode:screen'},C);
  P.priests=[];for(let i=0;i<5;i++){const g=el('g',{opacity:0},C);
    el('ellipse',{cx:0,cy:-74,rx:20,ry:6,fill:'none',stroke:'#ffe27a','stroke-width':4,style:'filter:drop-shadow(0 0 8px #ffd040)'},g);
    el('path',{d:'M-20,40 Q-24,0 -16,-30 Q0,-44 16,-30 Q24,0 20,40Z',fill:'#efe4c8',stroke:LINE,'stroke-width':3},g);
    el('path',{d:'M-16,-30 Q0,-64 16,-30 Q0,-38 -16,-30Z',fill:'#7a2a24',stroke:LINE,'stroke-width':2.5},g);
    el('circle',{cx:0,cy:-38,r:11,fill:'#e2bb94',stroke:LINE,'stroke-width':2.5},g);
    el('path',{d:'M-18,0 L18,0',stroke:'#7a2a24','stroke-width':5},g);
    el('path',{d:'M26,44 L26,-50 M18,-38 L34,-38',stroke:'#e8c060','stroke-width':4,'stroke-linecap':'round'},g);
    P.priests.push(g)}
})();

/* ================= THE PLEA: the gods' words, and what a church costs ================= */
(function(){
  const Q=$('plea');
  el('rect',{x:-200,y:-200,width:1680,height:1120,fill:grad('pBg',[[0,'#2a0a04'],[.6,'#120402'],[1,'#000']],false,{cx:'.5',cy:'.45',r:'.75'})},Q);
  P.pleaGlow=el('ellipse',{cx:640,cy:360,rx:560,ry:300,fill:'url(#fire)',opacity:.4,filter:'url(#b24)'},Q);
  P.plea=['RAISE YOUR CHURCHES','TRAIN YOUR PRIESTS','BEFORE TOMORROW'].map((s,i)=>{const t=el('text',{x:640,y:250+i*110,'text-anchor':'middle','font-family':'Cinzel,serif','font-weight':800,'font-size':i===2?84:64,'letter-spacing':i===2?12:8,fill:i===2?'#ffcf8a':'#f0e0c0',opacity:0,style:'filter:drop-shadow(0 0 18px #ff3a10)'},Q);t.textContent=s;return t});
  P.card=el('g',{opacity:0,'text-anchor':'middle'},Q);
  el('rect',{x:250,y:200,width:780,height:330,rx:10,fill:'#f2e4c2',stroke:'#6a4a20','stroke-width':4},P.card);
  el('rect',{x:266,y:216,width:748,height:298,rx:6,fill:'none',stroke:'#b0904a','stroke-width':2},P.card);
  el('text',{x:640,y:280,'font-family':'Cinzel,serif','font-weight':800,'font-size':44,'letter-spacing':4,fill:'#3a2410'},P.card).textContent='RAISE A CHURCH';
  el('text',{x:640,y:340,'font-family':'Cormorant Garamond,serif','font-weight':600,'font-size':34,fill:'#5a3a18'},P.card).textContent='60 stone  ·  40 timber  ·  ready in 12 hours';
  el('text',{x:640,y:392,'font-family':'Cormorant Garamond,serif','font-weight':600,'font-size':28,fill:'#5a3a18'},P.card).textContent='Its first priest is free. Train more: 30 grain, 5 marches.';
  el('text',{x:640,y:470,'font-family':'Cinzel,serif','font-weight':800,'font-size':40,'letter-spacing':6,fill:'#8a1a10'},P.card).textContent='BUILD IT TONIGHT';
})();
