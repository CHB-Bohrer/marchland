let A=null,muted=false;
/* ---------- audio ---------- */
function initAudio(){
  A={c:new (window.AudioContext||window.webkitAudioContext)()};
  A.master=A.c.createGain();A.master.gain.value=muted?0:.8;A.master.connect(A.c.destination);
  A.music=A.c.createGain();A.music.gain.value=.5;A.music.connect(A.master);
  A.sfx=A.c.createGain();A.sfx.gain.value=.9;A.sfx.connect(A.master);
  const n=A.c.createBuffer(1,A.c.sampleRate*2,A.c.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;A.noise=n;
  // wind bed
  const ws=A.c.createBufferSource();ws.buffer=n;ws.loop=true;const wf=A.c.createBiquadFilter();wf.type='bandpass';wf.frequency.value=380;wf.Q.value=.6;A.wind=A.c.createGain();A.wind.gain.value=.05;ws.connect(wf);wf.connect(A.wind);A.wind.connect(A.sfx);ws.start();
  // drone
  A.pad=[];
  const lp=A.c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=700;lp.Q.value=.7;lp.connect(A.music);A.lp=lp;
  for(let i=0;i<5;i++){const o=A.c.createOscillator();o.type='sawtooth';o.detune.value=(i-2)*9;const g=A.c.createGain();g.gain.value=.045;o.connect(g);g.connect(lp);o.frequency.value=110;o.start();A.pad.push(o)}
  const sub=A.c.createOscillator();sub.type='sine';sub.frequency.value=55;const sg=A.c.createGain();sg.gain.value=.22;sub.connect(sg);sg.connect(A.music);sub.start();A.sub=sub;
  const lfo=A.c.createOscillator();lfo.frequency.value=.12;const lg=A.c.createGain();lg.gain.value=220;lfo.connect(lg);lg.connect(lp.frequency);lfo.start();
}
const CH=[[110,130.8,164.8],[87.3,110,130.8],[73.4,87.3,110],[82.4,103.8,123.5]];
function hz(n){return 440*Math.pow(2,(n-69)/12)}
function noteTone(f,t,dur,vol){
  const o=A.c.createOscillator();o.type='triangle';o.frequency.value=f;
  const v=A.c.createOscillator();v.frequency.value=5.2;const vg=A.c.createGain();vg.gain.value=f*.006;v.connect(vg);vg.connect(o.frequency);
  const g=A.c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.5);g.gain.linearRampToValueAtTime(0,t+dur);
  o.connect(g);g.connect(A.music);o.start(t);v.start(t);o.stop(t+dur+.1);v.stop(t+dur+.1)}
function burst(freq,q,dur,vol,type,dest){
  const s=A.c.createBufferSource();s.buffer=A.noise;const f=A.c.createBiquadFilter();f.type=type||'bandpass';f.frequency.value=freq;f.Q.value=q;
  const g=A.c.createGain(),n=A.c.currentTime;g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(vol,n+dur*.25);g.gain.linearRampToValueAtTime(0,n+dur);
  s.connect(f);f.connect(g);g.connect(dest||A.sfx);s.start(n,Math.random());s.stop(n+dur+.05)}
function voice(base,dur,vol){
  const n=A.c.currentTime,o=A.c.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(base,n);o.frequency.linearRampToValueAtTime(base*(.85+Math.random()*.35),n+dur);
  const f1=A.c.createBiquadFilter(),f2=A.c.createBiquadFilter();f1.type=f2.type='bandpass';f1.frequency.value=350+Math.random()*450;f2.frequency.value=900+Math.random()*1100;f1.Q.value=f2.Q.value=4;
  const g=A.c.createGain();g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(vol,n+dur*.3);g.gain.linearRampToValueAtTime(0,n+dur);
  const lp=A.c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1800;
  o.connect(f1);o.connect(f2);f1.connect(g);f2.connect(g);g.connect(lp);lp.connect(A.sfx);o.start(n);o.stop(n+dur+.05)}
function cough(){burst(900,1.2,.18,.45);setTimeout(()=>{if(A)burst(700,1,.2,.4)},230);if(A)voice(120,.3,.05)}
function thump(v){const n=A.c.currentTime,o=A.c.createOscillator();o.frequency.setValueAtTime(70,n);o.frequency.exponentialRampToValueAtTime(34,n+.25);const g=A.c.createGain();g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+.35);o.connect(g);g.connect(A.sfx);o.start(n);o.stop(n+.4)}
