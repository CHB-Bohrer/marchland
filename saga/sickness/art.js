const NS='http://www.w3.org/2000/svg';
function el(tag,a,p){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
const LINE='#1b100b';
const P={};
let UID=0;
function grad(id,stops,lin,attrs){const d=document.querySelector('defs');const g=el(lin?'linearGradient':'radialGradient',Object.assign({id},attrs||{}),d);stops.forEach(([o,c,a])=>el('stop',{offset:o,'stop-color':c,'stop-opacity':a==null?1:a},g));return 'url(#'+id+')'}
function clip(id,d){const c=el('clipPath',{id},document.querySelector('defs'));el('path',{d},c);return 'url(#'+id+')'}
