/* Anime-style, cel-shaded bust characters. Head centre (0,0); body down to y=320. */
const EX={
 neutral:{b:'M-40,-22 Q-26,-30 -9,-25',l:3,m:'M-9,52 Q0,54 9,51'},
 smug:{b:'M-40,-23 Q-26,-30 -9,-25',br:'M-40,-29 Q-26,-35 -9,-28',l:6,m:'M-11,51 Q3,56 13,47'},
 laugh:{b:'M-40,-27 Q-26,-34 -9,-28',l:9,m:'M-13,47 Q0,65 13,47 Q0,51 -13,47Z',mf:'#5b1c1c'},
 disgust:{b:'M-40,-29 Q-24,-27 -9,-16',br:'M-40,-31 Q-26,-31 -9,-22',l:8,m:'M-12,54 Q-4,47 2,50 Q8,52 13,44'},
 worry:{b:'M-40,-19 Q-26,-25 -9,-34',l:-2,m:'M-9,56 Q0,48 9,56'},
 fear:{b:'M-40,-21 Q-26,-30 -9,-37',l:-4,m:'M-7,48 Q0,61 7,48 Q0,45 -7,48Z',mf:'#3a1010'},
 sick:{b:'M-40,-19 Q-26,-23 -9,-27',l:10,m:'M-8,54 Q0,51 8,54'},
 cough:{b:'M-40,-29 Q-24,-25 -9,-15',l:16,m:'M-10,46 Q0,67 10,46 Q0,42 -10,46Z',mf:'#2a0c0c'},
 wicked:{b:'M-40,-31 Q-24,-28 -9,-15',br:'M-40,-32 Q-25,-29 -9,-17',l:8,m:'M-15,47 Q0,62 15,45 Q0,52 -15,47Z',mf:'#3b0f0f'},
 cackle:{b:'M-40,-32 Q-24,-29 -9,-17',l:12,m:'M-15,44 Q0,72 15,44 Q0,50 -15,44Z',mf:'#3b0f0f'},
 terror:{b:'M-40,-20 Q-26,-32 -9,-40',l:-6,m:'M-9,46 Q0,68 9,46 Q0,42 -9,46Z',mf:'#2a0808'}
};
function hashC(a,b){const x=Math.sin(a*91.7+b*37.3)*43758.5;return x-Math.floor(x)}
function character(parent,o){
  const id='ch'+(UID++),w=o.w||48,sd=o.shade||1,F=o.female;
  const g=el('g',{},parent),back=el('g',{},g),body=el('g',{},g),head=el('g',{},g);
  const L={stroke:LINE,'stroke-width':3,'stroke-linejoin':'round'};
  /* ---------- back hair ---------- */
  const st=o.style;
  if(st==='elisa'){
    el('path',Object.assign({d:'M-58,-40 Q-78,40 -76,170 Q-68,222 -40,234 Q-48,150 -32,110 L32,110 Q48,150 40,234 Q68,222 76,170 Q78,40 58,-40 Q46,-106 0,-106 Q-46,-106 -58,-40Z',fill:o.hairSh},L),back);
  }else if(st==='anna'){
    el('path',Object.assign({d:'M6,-98 Q78,-120 100,-40 Q112,32 86,116 Q82,62 64,22 Q50,-30 14,-80Z',fill:o.hair},L),back);
    el('path',{d:'M40,-96 Q86,-80 94,-20 M60,-60 Q80,0 76,60',stroke:o.hairSh,'stroke-width':3,fill:'none',opacity:.8},back);
    el('path',{d:'M30,-104 Q70,-104 88,-60',stroke:o.hairHi,'stroke-width':5,fill:'none','stroke-linecap':'round',opacity:.7},back);
    el('path',Object.assign({d:'M-54,-40 Q-60,30 -52,62 L52,62 Q60,30 54,-40Z',fill:o.hairSh},L),back);
  }else if(st==='lina'){
    const pts=[];for(let i=0;i<=14;i++){const a=(150+i*17.2)*Math.PI/180;pts.push([Math.cos(a)*66,Math.sin(a)*62-24])}
    [[-64,18],[-70,48],[-60,80],[64,18],[70,48],[60,80],[-40,96],[40,96]].forEach(p=>pts.push(p));
    pts.forEach(([x,y],i)=>{el('circle',Object.assign({cx:x,cy:y,r:24,fill:i%2?o.hair:o.hairSh},L,{'stroke-width':2.5}),back);el('path',{d:`M${x-10},${y-8} Q${x},${y-16} ${x+9},${y-9}`,stroke:o.hairHi,'stroke-width':2.5,fill:'none',opacity:.55},back)});
  }else if(st==='jt'){                 // a towering beehive
    el('path',Object.assign({d:'M-58,-30 Q-72,-112 -38,-160 Q0,-192 38,-160 Q72,-112 58,-30Z',fill:o.hair},L),back);
    for(let i=0;i<5;i++)el('path',{d:`M${-44+i*22},-60 Q${-50+i*24},-150 ${-8+i*6},-178`,stroke:o.hairHi,'stroke-width':2.5,fill:'none',opacity:.45},back);
  }else if(st==='jack'){
    for(let i=0;i<11;i++){const a=(150+i*22)*Math.PI/180,x=Math.cos(a)*62,y=Math.sin(a)*58-26;el('path',Object.assign({d:`M${x-18},${y+10} L${x+Math.cos(a)*30},${y+Math.sin(a)*30} L${x+18},${y+6}Z`,fill:i%2?o.hair:o.hairSh},L,{'stroke-width':2}),back)}
  }else if(st==='davide'){
    for(let i=0;i<9;i++){const a=(160+i*27)*Math.PI/180,x=Math.cos(a)*58,y=Math.sin(a)*56-30;el('circle',Object.assign({cx:x,cy:y,r:22,fill:i%2?o.hair:o.hairSh},L,{'stroke-width':2.2}),back)}
  }else if(st==='hood'){
    el('path',Object.assign({d:'M-80,70 Q-96,-70 0,-122 Q96,-70 80,70Z',fill:o.clothSh},L),back);
  }
  /* ---------- body ---------- */
  const sw=o.sw||(F?84:100);
  if(o.full){
    el('path',Object.assign({d:'M-34,590 Q-30,610 -2,610 L-4,592Z M30,590 Q34,610 62,610 L56,592Z',fill:'#1a120c'},L,{'stroke-width':2}),body);
    el('path',Object.assign({d:'M-112,300 L-134,596 L-112,586 L-96,598 L-70,588 L-46,600 L-20,588 L6,600 L30,588 L56,600 L84,588 L110,598 L134,590 L112,300Z',fill:o.cloth},L),body);
    el('path',{d:`M${sd*30},300 L${sd*50},596 L${sd*134},590 L${sd*112},300Z`,fill:o.clothSh,opacity:.9},body);
    el('path',{d:'M-60,320 L-74,580 M-10,330 L-14,590 M40,320 L50,580',stroke:LINE,'stroke-width':1.6,opacity:.4},body);
  }
  const torsoD=`M-22,96 Q${-sw*.6},100 ${-sw},128 Q${-sw-16},160 ${-sw-18},330 L${sw+18},330 Q${sw+16},160 ${sw},128 Q${sw*.6},100 22,96 Q0,120 -22,96Z`;
  el('path',Object.assign({d:'M-19,40 L-21,104 Q0,118 21,104 L19,40Z',fill:o.skin},L),body);
  el('path',{d:'M-19,50 Q0,90 19,50 L19,78 Q0,106 -19,78Z',fill:o.skinSh},body);
  el('path',Object.assign({d:torsoD,fill:o.cloth},L),body);
  const tc=clip(id+'t',torsoD);
  const sh=el('g',{'clip-path':tc},body);
  el('path',{d:`M${sd*24},96 Q${sd*46},200 ${sd*34},330 L${sd*150},330 L${sd*150},96Z`,fill:o.clothSh},sh);
  el('path',{d:`M${-sw},128 Q${-sw+10},150 ${-sw+28},146 M${sw},128 Q${sw-10},150 ${sw-28},146`,stroke:o.clothSh,'stroke-width':3,fill:'none'},sh);
  [[-50,170,-44,250],[48,180,56,260],[-14,200,-8,300]].forEach(([a,b,c,d])=>el('path',{d:`M${a},${b} Q${a-6},${(b+d)/2} ${c},${d}`,stroke:LINE,'stroke-width':1.6,fill:'none',opacity:.35},sh));
  if(st==='pietro'){
    ['-','+'].forEach(s=>{const k=s==='-'?-1:1;el('path',Object.assign({d:`M${k*58},106 Q${k*98},120 ${k*112},150 L${k*120},330 L${k*40},330 Q${k*30},200 ${k*38},118Z`,fill:'#3a2416'},L),sh)});
    el('path',{d:`M${sd*40},110 Q${sd*60},200 ${sd*44},330 L${sd*130},330 L${sd*130},110Z`,fill:'#000',opacity:.28},sh);
    el('path',Object.assign({d:'M-74,112 L84,330 L108,330 L-52,106Z',fill:'#24160d'},L,{'stroke-width':2}),sh);
    el('rect',Object.assign({x:-4,y:196,width:26,height:20,rx:3,fill:'#a88a4e'},L,{'stroke-width':2,transform:'rotate(53 9 206)'}),sh);
    el('path',{d:'M-60,112 Q-64,140 -58,170',stroke:'#7a5a3a','stroke-width':2,fill:'none',opacity:.6},sh);
  }else if(st==='elisa'){
    [-1,1].forEach(k=>el('path',Object.assign({d:`M${k*28},98 Q${k*104},104 ${k*120},170 L${k*126},330 L${k*72},330 Q${k*80},190 ${k*42},122Z`,fill:o.cloak},L),sh));
    el('path',{d:`M${sd*80},120 Q${sd*110},200 ${sd*104},330 L${sd*140},330 L${sd*140},110Z`,fill:'#000',opacity:.3},sh);
    el('circle',Object.assign({cx:0,cy:116,r:9,fill:'#c9a24e'},L,{'stroke-width':2}),body);
    el('circle',{cx:-3,cy:113,r:3,fill:'#fff3c4'},body);
    for(let i=0;i<8;i++)el('ellipse',Object.assign({cx:-58-i*2.6,cy:56+i*20,rx:13,ry:15,fill:i%2?o.hair:o.hairSh,transform:`rotate(${(i%2?20:-20)} ${-58-i*2.6} ${56+i*20})`},L,{'stroke-width':2.2}),body);
    el('rect',Object.assign({x:-86,y:212,width:16,height:10,rx:3,fill:'#c9a24e'},L,{'stroke-width':2}),body);
    el('path',{d:'M-78,222 Q-84,240 -76,252 Q-72,240 -78,222',fill:o.hairSh,stroke:LINE,'stroke-width':2},body);
  }else if(st==='anna'){
    el('path',Object.assign({d:'M-24,96 L34,196 L50,184 L-2,102Z',fill:o.trim},L,{'stroke-width':2.2}),sh);
    el('path',Object.assign({d:'M24,96 L-20,170 L-36,160 L6,102Z',fill:o.trim},L,{'stroke-width':2.2}),sh);
    el('rect',Object.assign({x:-130,y:250,width:260,height:22,fill:'#8a6a3a'},L,{'stroke-width':2}),sh);
  }else if(st==='charlton'){            // a vast belly straining at the buttons, a greasy stain, a gold chain sunk in fat
    el('ellipse',Object.assign({cx:0,cy:262,rx:sw+34,ry:118,fill:o.cloth},L),body);
    el('ellipse',{cx:sd*40,cy:270,rx:sw*.75,ry:100,fill:o.clothSh,opacity:.7},body);
    el('ellipse',{cx:-sw*.35,cy:220,rx:44,ry:26,fill:'#fff',opacity:.08},body);
    [0,1,2].forEach(i=>{const y=170+i*44;el('path',{d:`M-14,${y-6} Q0,${y+4} 14,${y-6}`,stroke:LINE,'stroke-width':2,fill:'none',opacity:.6},body);el('circle',Object.assign({cx:0,cy:y,r:7,fill:'#d8b04a'},L,{'stroke-width':2}),body)});
    el('ellipse',{cx:46,cy:232,rx:22,ry:15,fill:'#6a5a20',opacity:.55},body);el('ellipse',{cx:-60,cy:286,rx:14,ry:9,fill:'#7a3a18',opacity:.5},body);
    el('path',{d:'M-70,110 Q0,176 70,110',stroke:'#e0b84a','stroke-width':6,fill:'none'},body);el('circle',Object.assign({cx:0,cy:146,r:13,fill:'#e0b84a'},L,{'stroke-width':2}),body);
  }else if(st==='jt'){                 // pearls and a lace collar
    el('path',Object.assign({d:'M-64,100 Q0,150 64,100 L72,122 Q0,176 -72,122Z',fill:o.trim},L,{'stroke-width':2}),body);
    for(let i=0;i<15;i++){const a=Math.PI*(.15+i*.05),x=Math.cos(a)*-62,y=96+Math.sin(a)*44;el('circle',Object.assign({cx:x,cy:y,r:5.5,fill:'#f4f0e4'},L,{'stroke-width':1.4}),body)}
    el('circle',Object.assign({cx:0,cy:150,r:11,fill:'#c03050'},L,{'stroke-width':2}),body);
  }else if(st==='jack'){               // a scuffed leather jerkin
    el('path',Object.assign({d:'M-30,96 L-14,190 L14,190 L30,96Z',fill:'#6a4a2a'},L,{'stroke-width':2}),body);
    [120,150,180].forEach(y=>el('path',{d:`M-20,${y} L20,${y+6} M-20,${y+6} L20,${y}`,stroke:'#2a1a0a','stroke-width':2.5},body));
    el('path',{d:'M-90,110 L90,250',stroke:'#4a2e16','stroke-width':14},body);
  }else if(st==='mario'){              // a tunic with 67 on it
    el('text',{x:0,y:230,'text-anchor':'middle','font-family':'Cinzel,serif','font-weight':800,'font-size':84,fill:'#f4e6a0',stroke:LINE,'stroke-width':3},body).textContent='67';
  }else if(st==='davide'){
    el('path',Object.assign({d:'M-26,96 L0,170 L26,96 L14,96 L0,136 L-14,96Z',fill:o.trim},L,{'stroke-width':2}),body);
    [-1,1].forEach(k=>el('path',Object.assign({d:`M${k*30},98 Q${k*96},106 ${k*112},160 L${k*118},330 L${k*70},330 Q${k*74},190 ${k*40},124Z`,fill:o.cloak},L),body));
    el('rect',Object.assign({x:-104,y:240,width:208,height:18,fill:'#4a2e16'},L,{'stroke-width':2}),body);el('rect',Object.assign({x:-12,y:236,width:24,height:26,rx:3,fill:'#b0903a'},L,{'stroke-width':2}),body);
  }else if(st==='lina'){
    el('path',Object.assign({d:'M-60,104 Q0,150 60,104 L66,124 Q0,176 -66,124Z',fill:o.trim},L,{'stroke-width':2.2}),sh);
    for(let i=-3;i<=3;i++)el('circle',Object.assign({cx:i*11,cy:126+Math.abs(i)*-3+12,r:4,fill:'#d9b45a'},L,{'stroke-width':1.2}),body);
  }else if(st==='hood'){
    el('path',Object.assign({d:'M-46,86 Q0,130 46,86 L54,110 Q0,160 -54,110Z',fill:o.trim},L,{'stroke-width':2.2}),body);
    el('path',{d:'M-30,104 L-26,150 M10,118 L14,170 M36,104 L40,140',stroke:LINE,'stroke-width':1.5,opacity:.4},body);
    el('path',{d:'M-118,330 L-104,312 L-90,330 L-72,314 L-60,330',fill:'none',stroke:LINE,'stroke-width':2},sh);
  }
  if(st!=='elisa'&&st!=='hood'&&st!=='charlton')el('path',{d:'M-22,96 Q0,120 22,96',stroke:o.trim,'stroke-width':5,fill:'none'},body);
  /* ---------- head ---------- */
  const cy=F?70:76;
  const faceD=F?`M${-w},-38 C${-w-2},12 ${-w*.8},44 ${-w*.32},${cy-6} Q0,${cy+8} ${w*.32},${cy-6} C${w*.8},44 ${w+2},12 ${w},-38 C${w},-88 ${-w},-88 ${-w},-38Z`
               :`M${-w},-38 C${-w-2},22 ${-w*.9},50 ${-w*.42},${cy-4} Q0,${cy+6} ${w*.42},${cy-4} C${w*.9},50 ${w+2},22 ${w},-38 C${w},-88 ${-w},-88 ${-w},-38Z`;
  [-1,1].forEach(k=>{const e=el('g',{transform:`scale(${k} 1)`},head);el('path',Object.assign({d:`M${-w+5},-10 Q${-w-15},-17 ${-w-13},6 Q${-w-11},27 ${-w+5},23Z`,fill:o.skin},L,{'stroke-width':2.5}),e);el('path',{d:`M${-w-4},-4 Q${-w-9},6 ${-w-3},14`,stroke:o.skinSh,'stroke-width':3,fill:'none'},e)});
  el('path',Object.assign({d:faceD,fill:o.skin},L),head);
  const fc=clip(id+'f',faceD),fs=el('g',{'clip-path':fc},head);
  el('path',{d:`M${sd*w*.66},-110 Q${sd*w*.42},0 ${sd*w*.6},110 L${sd*(w+30)},110 L${sd*(w+30)},-110Z`,fill:o.skinSh,opacity:.8},fs);
  el('ellipse',{cx:0,cy:-46,rx:w+4,ry:17,fill:o.skinSh,opacity:.9},fs);
  if(st==='hood')el('ellipse',{cx:0,cy:-62,rx:w+20,ry:40,fill:'#0b0f08',opacity:.55,filter:'url(#b10)'},fs);
  if(F&&!o.sick)[-1,1].forEach(k=>el('ellipse',{cx:k*27,cy:30,rx:10,ry:5,fill:'#e0786a',opacity:.28},fs));
  if(st==='pietro')el('path',{d:`M${-w+4},20 Q${-w*.6},60 0,${cy+2} Q${w*.6},60 ${w-4},20 L${w-6},34 Q${w*.5},66 0,${cy-6} Q${-w*.5},66 ${-w+6},34Z`,fill:o.hairSh,opacity:.22},fs);
  if(o.sick){[-1,1].forEach(k=>el('path',{d:`M${k*12},21 Q${k*24},27 ${k*34},20`,stroke:'#3d2a3e','stroke-width':5,fill:'none',opacity:.4,'stroke-linecap':'round',filter:'url(#b4)'},fs));
    el('path',{d:`M${-w*.6},38 Q${-w*.4},46 ${-w*.3},40 M${w*.5},36 Q${w*.4},46 ${w*.25},42`,stroke:'#3d4a2a','stroke-width':3,fill:'none',opacity:.5},fs)}
  el('path',{d:'M3,16 Q9,30 -1,34',stroke:LINE,'stroke-width':1.8,fill:'none','stroke-linecap':'round'},head);
  el('path',{d:`M${-sd*3},34 Q${sd*2},37 ${sd*7},33`,stroke:o.skinSh,'stroke-width':2.5,fill:'none'},head);
  const warts=[];
  (o.warts||[]).forEach(([x,y,r],i)=>{
    const wg=el('g',{transform:`translate(${x} ${y}) scale(0)`},head);
    el('circle',{cx:0,cy:0,r:r,fill:o.wart||'#9a7f52',stroke:LINE,'stroke-width':1.4},wg);
    el('circle',{cx:r*.38,cy:r*.22,r:r*.42,fill:o.wartSh||'#6e5634'},wg);
    el('circle',{cx:-r*.42,cy:r*.3,r:r*.32,fill:o.wartSh||'#6e5634',opacity:.8},wg);
    el('circle',{cx:-r*.3,cy:-r*.35,r:r*.28,fill:'#fff',opacity:.4},wg);
    if(i%2===0)el('path',{d:`M${r*.1},${-r*.7} q${r*.2},${-r*.9} ${r*.8},${-r*1.3} M${-r*.2},${-r*.6} q${-r*.3},${-r*.8} ${-r*.1},${-r*1.4}`,stroke:'#1b100b','stroke-width':1.1,fill:'none','stroke-linecap':'round'},wg);
    warts.push({wg,x,y});
  });
  /* eyes */
  const eyes=[];
  [-1,1].forEach(k=>{
    const eg=el('g',{transform:`translate(${k*w*.47},4) scale(${-k*.92} .92)`},head);
    const almond='M-19,4 Q-12,-12 5,-11 Q15,-9 19,-2 Q11,10 -1,10 Q-12,10 -19,4Z';
    el('path',{d:almond,fill:o.sick?'#e6e0c6':'#f6f0e4'},eg);
    const ec=clip(id+'e'+k,almond),inner=el('g',{'clip-path':ec},eg);
    const ir=el('g',{},inner);
    const ig=grad(id+'i'+k,[[0,o.eyeHi||'#d9b07a'],[.55,o.eye],[1,'#140b06']],false,{cx:'.45',cy:'.6',r:'.6'});
    el('ellipse',{cx:0,cy:0,rx:9.5,ry:11,fill:ig,stroke:LINE,'stroke-width':1.2},ir);
    el('ellipse',{cx:0,cy:.5,rx:4.3,ry:5.4,fill:'#0b0604'},ir);
    el('circle',{cx:3.6,cy:-4.2,r:3.1,fill:'#fff'},ir);el('circle',{cx:-3,cy:4.2,r:1.4,fill:'#fff',opacity:.8},ir);
    el('ellipse',{cx:0,cy:-8,rx:14,ry:5,fill:'#000',opacity:.22},inner);
    if(o.sick)el('path',{d:'M-12,8 Q0,11 10,6',stroke:'#c2554a','stroke-width':1.5,fill:'none',opacity:.5},inner);
    const lf=el('path',{fill:o.skin},inner);
    const ll=el('path',{stroke:LINE,'stroke-width':3.6,fill:'none','stroke-linecap':'round'},eg);
    const lash=el('path',{stroke:LINE,'stroke-width':3,fill:'none','stroke-linecap':'round'},eg);
    el('path',{d:'M-13,9 Q-1,12 11,7',stroke:LINE,'stroke-width':1.1,fill:'none',opacity:.65},eg);
    eyes.push({ir,lf,ll,lash,k});
  });
  const brows=[-1,1].map(k=>el('path',{transform:`scale(${-k} 1)`,stroke:o.brow||o.hairSh,'stroke-width':4.5,fill:'none','stroke-linecap':'round'},head));
  brows.forEach(b=>b.setAttribute('stroke',o.brow||'#2a1a10'));
  const mouth=el('path',{stroke:LINE,'stroke-width':2.6,'stroke-linecap':'round','stroke-linejoin':'round'},head);
  el('path',{d:'M-5,61 Q0,63 5,61',stroke:o.skinSh,'stroke-width':2,fill:'none'},head);
  /* ---------- front hair ---------- */
  const H=(d,f,sw2)=>el('path',Object.assign({d,fill:f||o.hair},L,{'stroke-width':sw2||3}),head);
  const S=(d,c,wd,op)=>el('path',{d,stroke:c,'stroke-width':wd,fill:'none','stroke-linecap':'round',opacity:op},head);
  if(st==='pietro'){
    H('M-54,-30 L-56,6 L-49,6 L-47,-28Z',o.hairSh,2);H('M54,-30 L56,6 L49,6 L47,-28Z',o.hairSh,2);
    H('M-60,-18 Q-68,-80 -30,-100 Q4,-114 38,-98 Q70,-80 60,-16 L54,-34 L50,-24 Q46,-46 38,-50 L36,-68 L24,-48 L16,-74 L4,-46 L-8,-72 L-18,-46 L-30,-68 L-38,-44 L-48,-58 L-52,-30Z');
    S('M-34,-88 Q-6,-100 24,-92',o.hairHi,5,.75);S('M-10,-92 L-16,-62 M14,-94 L10,-66 M34,-86 L30,-62',o.hairSh,2.5,.8);
  }else if(st==='elisa'){
    H('M-52,-40 Q-66,20 -62,96 Q-52,60 -46,30 Q-44,-10 -40,-40Z');H('M52,-40 Q66,20 62,96 Q52,60 46,30 Q44,-10 40,-40Z');
    H('M-56,-14 Q-60,-92 0,-102 Q60,-92 56,-14 Q50,-54 26,-66 Q12,-56 2,-82 Q-8,-58 -32,-62 Q-48,-50 -56,-14Z');
    S('M-32,-88 Q0,-98 28,-88',o.hairHi,5,.7);S('M-20,-70 Q-34,-50 -44,-24 M20,-72 Q36,-50 44,-26',o.hairSh,2.5,.8);
  }else if(st==='anna'){
    H('M-52,-36 Q-62,10 -56,54 L-46,22 L-44,-30Z');H('M52,-36 Q62,10 56,54 L46,22 L44,-30Z');
    H('M-54,-14 Q-58,-88 0,-100 Q58,-88 54,-14 L46,-34 L40,-20 L33,-50 L22,-30 L14,-60 L4,-32 L-8,-62 L-18,-34 L-28,-58 L-38,-28 L-46,-46Z');
    S('M-30,-86 Q0,-96 28,-86',o.hairHi,6,.75);S('M-8,-90 L-10,-66 M16,-88 L14,-64',o.hairSh,2.2,.7);
    el('ellipse',Object.assign({cx:12,cy:-99,rx:9,ry:6,fill:o.trim},L,{'stroke-width':2}),head);
  }else if(st==='lina'){
    for(let x=-44;x<=44;x+=14){const y=-62+Math.pow(x/44,2)*16;el('circle',Object.assign({cx:x,cy:y,r:15,fill:o.hair},L,{'stroke-width':2.2}),head);el('path',{d:`M${x-6},${y-6} Q${x},${y-11} ${x+6},${y-6}`,stroke:o.hairHi,'stroke-width':2,fill:'none',opacity:.6},head)}
    H('M-58,-42 Q0,-78 58,-42 L56,-31 Q0,-66 -56,-31Z','#a3302a',2.5);S('M-40,-50 Q0,-70 40,-50','#d65a48',2,.8);
  }else if(st==='charlton'){            // bald and shining, three greasy strands, a nose like a turnip, jowls, stubble, a snaggle tooth
    el('ellipse',{cx:-14,cy:-74,rx:22,ry:9,fill:'#fff',opacity:.35},head);
    S('M-44,-70 Q-6,-92 40,-74 M-40,-62 Q0,-84 44,-64 M-34,-54 Q4,-72 40,-54',o.hair,3.2,.95);
    H(`M${-w+2},-30 Q${-w-8},-6 ${-w+4},14 L${-w+12},-8Z`,o.hair,2);H(`M${w-2},-30 Q${w+8},-6 ${w-4},14 L${w-12},-8Z`,o.hair,2);
    [-1,1].forEach(k=>el('path',Object.assign({d:`M${k*(w-6)},22 Q${k*(w+14)},58 ${k*(w*.55)},${cy+8} Q${k*(w*.75)},52 ${k*(w-10)},30Z`,fill:o.skin},L,{'stroke-width':2.2}),head));
    el('path',Object.assign({d:`M${-w*.55},${cy-2} Q0,${cy+34} ${w*.55},${cy-2} Q0,${cy+14} ${-w*.55},${cy-2}Z`,fill:o.skin},L,{'stroke-width':2.4}),head);
    el('path',{d:`M${-w*.4},${cy+12} Q0,${cy+26} ${w*.4},${cy+12}`,stroke:o.skinSh,'stroke-width':2.5,fill:'none'},head);
    for(let i=0;i<46;i++){const a=hashC(i,1)*Math.PI*.9+Math.PI*.05,r=w*.55+hashC(i,2)*14;el('circle',{cx:Math.cos(a)*r,cy:30+Math.sin(a)*r*.7,r:1.2,fill:'#3a2a22',opacity:.55},head)}
    el('ellipse',Object.assign({cx:0,cy:24,rx:16,ry:13,fill:'#d86a5a'},L,{'stroke-width':2.4}),head);el('ellipse',{cx:-5,cy:19,rx:5,ry:3.5,fill:'#fff',opacity:.5},head);
    [[-6,30],[6,30]].forEach(([x,y])=>el('ellipse',{cx:x,cy:y,rx:3,ry:2,fill:'#5a1a14'},head));[[8,22],[-9,25],[2,28]].forEach(([x,y])=>el('circle',{cx:x,cy:y,r:1,fill:'#8a2a20'},head));
    el('path',Object.assign({d:'M5,52 L8,62 L12,52Z',fill:'#f2e8a8'},L,{'stroke-width':1.5}),head);
    [[-40,-10,3],[44,-4,2.6],[-30,46,2.4]].forEach(([x,y,r])=>el('circle',{cx:x,cy:y,r:r,fill:'#e04a3a',opacity:.7},head));
  }else if(st==='jt'){
    H('M-56,-20 Q-62,-88 0,-102 Q62,-88 56,-20 Q48,-60 20,-70 Q0,-60 -20,-70 Q-48,-60 -56,-20Z');
    S('M-34,-86 Q0,-98 34,-86',o.hairHi,5,.7);
    el('path',Object.assign({d:'M-30,-108 L-18,-124 L-6,-110 L6,-126 L18,-110 L30,-124 L36,-104Z',fill:'#e0b84a'},L,{'stroke-width':2}),head);
    [[-18,-116],[6,-118],[26,-114]].forEach(([x,y])=>el('circle',{cx:x,cy:y,r:3,fill:'#c03050'},head));
    el('circle',{cx:30,cy:40,r:3.2,fill:'#2a1a10'},head);   // a beauty mark, sour as she is
  }else if(st==='jack'){               // wild ginger hair, a scraggly beard, an eyepatch
    H('M-58,-18 L-66,-60 L-44,-56 L-46,-96 L-20,-76 L-10,-110 L6,-80 L24,-108 L30,-74 L56,-92 L48,-56 L66,-50 L58,-16 Q46,-50 0,-60 Q-46,-50 -58,-18Z');
    H(`M${-w+6},20 Q${-w+4},70 -20,${cy+22} L0,${cy+34} L20,${cy+22} Q${w-4},70 ${w-6},20 Q${w*.5},48 26,58 Q0,50 -26,58 Q${-w*.5},48 ${-w+6},20Z`,o.hair,2);
    el('path',{d:`M${-w},-30 L${w*.2},-6 M${w},-26 L${w*.1},-8`,stroke:'#1a1008','stroke-width':3},head);
    el('ellipse',Object.assign({cx:-w*.47,cy:3,rx:17,ry:14,fill:'#1a1008'},L,{'stroke-width':2}),head);
  }else if(st==='mario'){              // a cap with 67 on it and a huge silly grin
    H('M-60,-30 Q-58,-100 0,-104 Q58,-100 60,-30 Q30,-44 0,-44 Q-30,-44 -60,-30Z',o.cap||'#d03a2a');
    H('M-4,-40 Q50,-46 96,-26 Q60,-18 2,-28Z',o.capSh||'#9a2418',2);
    el('circle',Object.assign({cx:0,cy:-76,r:20,fill:'#fff'},L,{'stroke-width':2}),head);
    el('text',{x:0,y:-69,'text-anchor':'middle','font-family':'Cinzel,serif','font-weight':800,'font-size':20,fill:'#d03a2a'},head).textContent='67';
    H('M-58,-30 Q-64,-10 -56,8 L-48,-24Z',o.hair,2);H('M58,-30 Q64,-10 56,8 L48,-24Z',o.hair,2);
  }else if(st==='davide'){             // a thick black mane, a moustache to twirl, a pointed beard
    H('M-56,-20 Q-60,-90 -10,-104 Q40,-110 58,-58 Q62,-36 56,-16 Q48,-50 30,-60 Q34,-40 18,-46 Q14,-70 -4,-66 Q-14,-44 -30,-56 Q-42,-40 -56,-20Z');
    S('M-30,-88 Q0,-100 30,-88',o.hairHi,4,.6);
    H('M-30,44 Q-16,36 0,42 Q16,36 30,44 Q38,50 42,40 Q40,58 24,54 Q12,50 0,50 Q-12,50 -24,54 Q-40,58 -42,40 Q-38,50 -30,44Z',o.hair,2);
    H(`M-12,${cy-6} Q0,${cy+30} 12,${cy-6} Q0,${cy+4} -12,${cy-6}Z`,o.hair,2);
  }else if(st==='hood'){
    S('M-42,-56 Q-50,-14 -46,30 M-34,-64 Q-42,-30 -40,0 M42,-56 Q50,-14 46,32',o.hair,3,.9);
    H('M-84,74 Q-100,-74 0,-126 Q100,-74 84,74 L66,74 Q76,-64 0,-100 Q-76,-64 -66,74Z',o.cloth);
    S('M-66,64 Q-74,-56 0,-96 Q74,-56 66,64',o.clothSh,6,.9);S('M-50,-70 Q-20,-110 30,-104',o.trim,3,.4);
  }
  /* hand (for covering mouth) */
  const hand=el('g',{opacity:0},head);
  el('path',Object.assign({d:'M-26,44 Q-30,0 -24,-14 Q-22,-30 -14,-28 L-12,-34 Q-8,-44 -2,-38 L0,-40 Q6,-46 11,-38 L13,-34 Q20,-36 22,-24 Q30,-4 24,44Z',fill:o.skin},L,{'stroke-width':2.5}),hand);
  el('path',{d:'M-12,-30 L-11,-6 M0,-38 L1,-8 M12,-34 L12,-8',stroke:LINE,'stroke-width':1.4,opacity:.6},hand);
  el('path',{d:'M8,-30 Q18,0 22,40 L30,40 Q28,-10 20,-30Z',fill:o.skinSh,opacity:.7},hand);
  el('path',Object.assign({d:'M-28,40 Q0,50 26,40 L44,130 Q0,142 -46,130Z',fill:o.cloth},L,{'stroke-width':2.5}),hand);
  /* ---------- api ---------- */
  const api={g,head,cur:'neutral',talkK:0,blinkOn:false,lookX:0,lookY:0,
    apply(){const E=EX[this.cur];let d=this.blinkOn?21:E.l;
      eyes.forEach(e=>{e.ll.setAttribute('d',`M-20,${5+d*.2} Q-13,${-12+d} 5,${-12+d} Q15,${-10+d*.9} 20,${-3+d*.5}`);
        e.lf.setAttribute('d',`M-24,-34 L24,-34 L24,${-3+d*.5} L20,${-3+d*.5} Q15,${-10+d*.9} 5,${-12+d} Q-13,${-12+d} -20,${5+d*.2} L-24,${5+d*.2}Z`);
        e.lash.setAttribute('d',`M-20,${5+d*.2} L-26,${d*.2}`);
        e.ir.setAttribute('transform',`translate(${-e.k*this.lookX*-1*(e.k)*e.k} ${this.lookY})`);
        e.ir.setAttribute('transform',`translate(${e.k<0?this.lookX:-this.lookX} ${this.lookY})`)});
      brows[0].setAttribute('d',E.b);brows[1].setAttribute('d',E.br||E.b);
      if(this.talkK>.12&&this.cur!=='cough'){const k=this.talkK;mouth.setAttribute('d',`M-9,50 Q0,${50+k*13} 9,50 Q0,${47-k*2} -9,50Z`);mouth.setAttribute('fill','#4a1414')}
      else{mouth.setAttribute('d',E.m);mouth.setAttribute('fill',E.mf||'none')}},
    set(e){this.cur=e;this.apply()},
    look(x,y){this.lookX=x/0.92;this.lookY=(y||0)/0.92;this.apply()},
    talk(k){this.talkK=k;this.apply()},
    blink(b){if(b!==this.blinkOn){this.blinkOn=b;this.apply()}},
    hand(k){hand.setAttribute('opacity',k>0?1:0);hand.setAttribute('transform',`translate(${4-k*2} ${62+(1-k)*170})`)},
    pose(x,y,s){g.setAttribute('transform',`translate(${x},${y}) scale(${s})`)},
    tilt(r,dy){const t=`translate(0 ${dy||0}) rotate(${r} 0 70)`;head.setAttribute('transform',t);back.setAttribute('transform',t)},
    breathe(t,ph){body.setAttribute('transform',`translate(0 ${Math.sin(t*1.5+ph)*1.6})`)},
    warts(k){const n=warts.length;warts.forEach((w,i)=>{let u=Math.max(0,Math.min(1,k*n*.55-i*.55));u=u<1?u*(1+.6*Math.sin(u*Math.PI)):1;w.wg.setAttribute('transform',`translate(${w.x} ${w.y}) scale(${u})`)})}};
  api.apply();return api;
}
