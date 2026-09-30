/* Marchland background music: a soft, looping string bed shared by the game
   and the tutorial. Starts on the first tap, ducks under the narrator, and a
   small Music button switches it off (your choice is remembered). */
(function(){
  var KEY='marchland.music', script=document.currentScript;
  var base=script&&script.src?script.src.replace(/[^\/]*$/,''):'';
  var URL=base+'adventure.mp3';
  var LEVEL=0.34, DUCKED=0.11;
  var ac=null, gain=null, src=null, buf=null, loading=false, started=false;
  var on=true, talking=0;
  try{ if(localStorage.getItem(KEY)==='off') on=false; }catch(e){}

  var btn=document.createElement('button');
  btn.type='button'; btn.id='music-btn';
  btn.setAttribute('aria-pressed', on?'true':'false');
  btn.style.cssText='position:fixed;left:10px;bottom:10px;z-index:99999;font:600 12px/1 system-ui,sans-serif;'+
    'letter-spacing:.04em;padding:8px 11px;border-radius:999px;border:1px solid rgba(120,130,140,.55);'+
    'background:rgba(20,26,32,.72);color:#e8efe8;cursor:pointer;opacity:.82;backdrop-filter:blur(4px)';
  function label(){ btn.textContent=(on?'♪ Music on':'♪ Music off'); btn.setAttribute('aria-pressed', on?'true':'false'); }
  label();
  function mount(){ if(!document.getElementById('music-btn')) document.body.appendChild(btn); }
  if(document.body) mount(); else document.addEventListener('DOMContentLoaded',mount);

  function target(){ return !on ? 0 : (talking>0 ? DUCKED : LEVEL); }
  function fade(to,secs){
    if(!gain||!ac) return;
    var t=ac.currentTime; try{ gain.gain.cancelScheduledValues(t); gain.gain.setValueAtTime(gain.gain.value,t); gain.gain.linearRampToValueAtTime(to,t+secs); }catch(e){}
  }
  function begin(){
    if(started||!on) return;
    var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    try{ ac=ac||new AC(); }catch(e){ return; }
    if(ac.state==='suspended') ac.resume();
    if(!gain){ gain=ac.createGain(); gain.gain.value=0; gain.connect(ac.destination); }
    if(buf){ play(); return; }
    if(loading) return; loading=true;
    fetch(URL).then(function(r){ if(!r.ok) throw 0; return r.arrayBuffer(); })
      .then(function(a){ return new Promise(function(res,rej){ ac.decodeAudioData(a,res,rej); }); })
      .then(function(b){ buf=b; loading=false; if(on) play(); })
      .catch(function(){ loading=false; });
  }
  function play(){
    if(started||!buf) return;
    src=ac.createBufferSource(); src.buffer=buf; src.loop=true;
    src.loopStart=0.05; src.loopEnd=Math.max(0.2,buf.duration-0.05);
    src.connect(gain); src.start(0,0.02); started=true;
    fade(target(),3.5);
  }
  function stop(){
    fade(0,0.6);
    setTimeout(function(){ if(!on&&src){ try{ src.stop(); }catch(e){} src=null; started=false; } },700);
  }
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    on=!on; label();
    try{ localStorage.setItem(KEY,on?'on':'off'); }catch(_){}
    if(on){ if(src){ fade(target(),1.2); } else { started=false; begin(); } } else stop();
  });
  ['pointerdown','touchend','keydown'].forEach(function(ev){
    document.addEventListener(ev,function(){ begin(); if(ac&&ac.state==='suspended'&&on) ac.resume(); },true);
  });
  /* narrator or any recorded clip playing: lower the music underneath.
     Clips are detached Audio objects, so hook each one the first time it plays. */
  var relT=null;
  function duck(t){ if(t.__musicDuck) return; t.__musicDuck=true; talking++; clearTimeout(relT); fade(target(),0.5); }
  function release(t){
    if(!t.__musicDuck) return;
    t.__musicDuck=false; talking=Math.max(0,talking-1);
    if(!talking){ clearTimeout(relT); relT=setTimeout(function(){ if(!talking) fade(target(),1.6); },1400); }
  }
  var origPlay=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){
    var t=this;
    if(!t.__musicHooked){
      t.__musicHooked=true;
      t.addEventListener('playing',function(){ if(t.src&&t.src.indexOf('data:')===0) return; duck(t); });
      ['pause','ended','emptied','abort','error'].forEach(function(ev){ t.addEventListener(ev,function(){ release(t); }); });
    }
    return origPlay.apply(t,arguments);
  };
  document.addEventListener('visibilitychange',function(){
    if(!ac) return; if(document.hidden) ac.suspend(); else if(on) ac.resume();
  });
})();
