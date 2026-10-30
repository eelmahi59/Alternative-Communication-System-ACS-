'use strict';
/* ================= icons ================= */
var ICONS={
home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
letters:'<text x="12" y="17" text-anchor="middle" font-size="15" font-weight="700" font-family="Lexend,sans-serif" fill="currentColor" stroke="none">Aa</text>',
phrases:'<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M8 9h8M8 12h5"/>',
ai:'<path d="M10 3l1.7 4.8L16.5 9.5l-4.8 1.7L10 16l-1.7-4.8L3.5 9.5l4.8-1.7z"/><path d="M18 14l.9 2.4 2.4.9-2.4.9L18 20.6l-.9-2.4-2.4-.9 2.4-.9z"/>',
emotions:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
caregiver:'<circle cx="9" cy="8" r="3"/><path d="M3 19c0-3.4 2.7-5 6-5s6 1.6 6 5"/><circle cx="17" cy="9" r="2.4"/><path d="M16.5 14c2.8 0 4.5 1.2 4.5 4"/>',
settings:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
speaker:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/>',
undo:'<path d="M9 7 4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 6 6"/>',
clear:'<path d="M6 6l12 12M18 6 6 18"/>',
back:'<path d="M20 5H9l-6 7 6 7h11z"/><path d="M13 9.5l5 5M18 9.5l-5 5"/>',
food:'<path d="M7 3v7a2 2 0 0 0 4 0V3M9 3v18"/><path d="M17 3c-2.5 2-2.5 7 0 9v9"/>',
face:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14c1 1.6 2.3 2.3 3.5 2.3s2.5-.7 3.5-2.3"/><circle cx="9" cy="10" r=".8" fill="currentColor"/><circle cx="15" cy="10" r=".8" fill="currentColor"/>',
school:'<path d="M5 4h14v16H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h12"/>',
medical:'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
daily:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
lock:'<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
menu:'<path d="M4 7h16M4 12h16M4 17h16"/>'
};
function ic(n){return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+ICONS[n]+'</svg>';}
var FACES={
happy:'<path d="M15 28q9 9 18 0"/><circle cx="17" cy="19" r="2" fill="currentColor"/><circle cx="31" cy="19" r="2" fill="currentColor"/>',
sad:'<path d="M16 35q8-7 16 0"/><circle cx="17" cy="23" r="2" fill="currentColor"/><circle cx="31" cy="23" r="2" fill="currentColor"/><path d="M13 18l8-3M35 18l-8-3"/>',
angry:'<path d="M17 35q7-5 14 0"/><circle cx="17" cy="23" r="2" fill="currentColor"/><circle cx="31" cy="23" r="2" fill="currentColor"/><path d="M12 14l9 5M36 14l-9 5"/>',
frustrated:'<path d="M15 33l3.5-3 3.5 3 3.5-3 3.5 3 3-3"/><path d="M13 22h8M27 22h8"/>',
anxious:'<path d="M16 34q4-3.5 8 0t8 0"/><circle cx="17" cy="22" r="3.2"/><circle cx="31" cy="22" r="3.2"/><path d="M13 14q4-3 8-1M35 14q-4-3-8-1"/><path d="M41 8q3 4 0 7-3-3 0-7z"/>'
};
function face(k){return '<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="19"/>'+FACES[k]+'</svg>';}
function isIPadPro11() {
  const w = window.screen.width;
  const h = window.screen.height;

  const sizes = [
    [834, 1194],
    [1194, 834]
  ];

  return sizes.some(
    ([sw, sh]) =>
      (w === sw && h === sh) ||
      (w === sh && h === sw)
  );
}

if (isIPadPro11()) {
  document.documentElement.classList.add('ipad-pro-11');
}
/* ================= data ================= */
var NAV=[
['home','Home','Home','Home'],
['letters','Letters','Letter Board','Letters'],
['phrases','Phrases','Phrase Board','Phrases'],
['ai','Assistant','AI Assistant','AI'],
['emotions','Feelings','Emotion Center','Feelings'],
['caregiver','Caregiver','Caregiver','Care'],
['settings','Settings','Settings','Settings']
];
var TONES=[{v:'calm',l:'Calm'},{v:'cheerful',l:'Cheerful'},{v:'firm',l:'Firm'}];
var TONEP={calm:{rate:.85,pitch:.95,vol:.9},cheerful:{rate:1.02,pitch:1.2,vol:1},firm:{rate:.95,pitch:.85,vol:1}};

/* ================= state ================= */
var KEY='m2v-proto-1';
var S={
screen:'home',mode:'tablet',msg:'',hist:[],lastKind:'',tone:'calm',cat:'Food',kb:'abc',
emo:null,lvl:1,body:null,breathing:false,tokens:[],cg:false,confirmReset:false,speaking:false,navHidden:false,
custom:[],usage:{phr:{},words:{},ai:{},days:{}},
settings:{name:'',voice:'',rate:1,touchGuard:0,speakOnTap:true,size:'lg',theme:'auto',reduce:false,calm:true,predict:true}
};
/* Each HTML page sets <body data-screen="..."> to choose the first screen. */
if(document.body&&document.body.dataset&&document.body.dataset.screen)S.screen=document.body.dataset.screen;
var themeSet=false;
try{
var raw=localStorage.getItem(KEY);
if(raw){var d=JSON.parse(raw); if(d.settings)for(var k in d.settings)S.settings[k]=d.settings[k]; if(d.custom)S.custom=d.custom; if(d.usage)S.usage=d.usage; if(d.mode)S.mode=d.mode;}
}catch(e){}
try{ if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches&&!(raw&&JSON.parse(raw).settings&&'reduce' in JSON.parse(raw).settings)) S.settings.reduce=true; }catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify({settings:S.settings,custom:S.custom,usage:S.usage,mode:S.mode}));}catch(e){}}

/* ================= helpers ================= */
function $(s){return document.querySelector(s);}
function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s));}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function fmt(s){s=s.replace(/\s+/g,' ');s=s.replace(/\bi\b/g,'I');return cap(s);}
function norm(s){return s.toLowerCase().replace(/[^a-z' ]/g,'').replace(/\s+/g,' ').trim();}
function today(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function dayRec(){var t=today();if(!S.usage.days[t])S.usage.days[t]={all:0,own:0};return S.usage.days[t];}
var tt;
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('on');},2600);}

/* ================= speech ================= */
function voices(){try{return window.speechSynthesis?speechSynthesis.getVoices():[];}catch(e){return [];}}
function speak(text,src){
text=(text||'').trim();
if(!text){toast('Add some words first.');return false;}
if(!('speechSynthesis' in window)){toast('Speech is not available here. Your words stay on screen.');return false;}
try{
speechSynthesis.cancel();
var u=new SpeechSynthesisUtterance(fmt(text)),T=TONEP[S.tone]||TONEP.calm;
u.rate=Math.min(2,Math.max(.5,T.rate*S.settings.rate));u.pitch=T.pitch;u.volume=T.vol;
var vs=voices().filter(function(v){return v.voiceURI===S.settings.voice;});
if(vs[0])u.voice=vs[0];
function wv(on){S.speaking=on;var w=$('.wave');if(w)w.classList.toggle('on',on);}
u.onstart=function(){wv(true);};u.onend=function(){wv(false);};u.onerror=function(){wv(false);};
speechSynthesis.speak(u);
}catch(e){toast('Speech could not start.');return false;}
log(text,src||'phrase');
return true;
}
function log(text,src){
var k=text.trim();S.usage.phr[k]=(S.usage.phr[k]||0)+1;
norm(k).split(' ').forEach(function(w){if(w)S.usage.words[w]=(S.usage.words[w]||0)+1;});
var d=dayRec();d.all++;if(src==='own')d.own++;
save();
}

/* ================= message ================= */
function change(m,kind){
if(!(kind==='key'&&S.lastKind==='key')){S.hist.push(S.msg);if(S.hist.length>40)S.hist.shift();}
S.msg=m;S.lastKind=kind;
}

/* ================= rendering ================= */
var app=$('#app'),stage=$('#stage'),screenEl=$('#screen'),sheetRoot=$('#sheet');
var mq=window.matchMedia?matchMedia('(max-width:700px)'):{matches:false};
function seg(key,opts,val,label){
return '<div class="seg" role="group" aria-label="'+esc(label)+'">'+opts.map(function(o){
return '<button type="button" aria-pressed="'+(String(o.v)===String(val))+'" data-a="set" data-k="'+key+'" data-v="'+esc(o.v)+'" data-id="'+key+'-'+esc(o.v)+'">'+esc(o.l)+'</button>';
}).join('')+'</div>';
}
function sw(key,label){
var on=!!S.settings[key];
return '<span class="swwrap"><button type="button" class="sw" role="switch" aria-checked="'+on+'" aria-label="'+esc(label)+'" data-a="toggle" data-k="'+key+'" data-id="sw-'+key+'"></button><span aria-hidden="true">'+(on?'On':'Off')+'</span></span>';
}
function railHTML(){
return '<nav class="rail" aria-label="Main">'+NAV.map(function(n,i){
return '<button type="button" class="nav'+(n[0]==='settings'?' last':'')+'" data-a="nav" data-s="'+n[0]+'" data-id="nav-'+n[0]+'"'+(S.screen===n[0]?' aria-current="page"':'')+'>'+ic(n[0])+
'<span class="l-short">'+n[1]+'</span><span class="l-full">'+n[2]+'</span><span class="l-tiny">'+n[3]+'</span></button>';
}).join('')+'</nav>';
}
function voiceHTML(){
var empty=!S.msg.trim();
return '<section class="voice" aria-label="Your message">'+
'<div class="vmsg'+(empty?' empty':'')+'" id="vmsg" aria-live="polite">'+(empty?'Tap to build your message':esc(fmt(S.msg)))+'</div>'+
'<div class="vrow"><button type="button" class="btn speak primary" data-a="speak" data-id="speak">'+ic('speaker')+'Speak</button>'+
'<button type="button" class="btn" data-a="undo" data-id="undo"'+(S.hist.length?'':' disabled')+'>'+ic('undo')+'Undo</button>'+
'<button type="button" class="btn" data-a="clear" data-id="clear"'+(empty?' disabled':'')+'>'+ic('clear')+'Clear</button></div>'+
'<div class="vtone"><span class="lbl">Voice tone</span>'+seg('tone',TONES,S.tone,'Voice tone')+
'<span class="wave'+(S.speaking?' on':'')+'" aria-hidden="true"><i></i><i></i><i></i></span></div></section>';
}

/* ---- home screen ---- */
function homeBody(){
var h=new Date().getHours(),part=h<12?'morning':h<17?'afternoon':'evening';
var sg=SUGGEST[h>=5&&h<11?'morning':h>=11&&h<14?'midday':h>=14&&h<18?'afternoon':'evening']||[];
var dests=[
['letters','Letter Board','Spell words. Next-word and sentence suggestions help.'],
['phrases','Phrase Board','Tap ready-made phrases in six groups.'],
['ai','AI Assistant','Tap a few words. It offers full sentences.'],
['emotions','Emotion Center','Show how you feel, and how big the feeling is.'],
['caregiver','Caregiver','Progress, trends, and your own phrases. Hold to open.']
];
return '<div class="home"><div style="display:flex;flex-direction:column;gap:22px">'+
'<section><div class="lbl">Quick communication</div><div class="quick">'+QUICK.map(function(q,i){
return '<button type="button" class="tile'+(q==='Help'?' black':'')+'" data-guard data-a="say" data-t="'+esc(q)+'" data-id="q'+i+'">'+esc(q)+'</button>';
}).join('')+'</div></section>'+
'<section><div class="lbl">Ideas for this time of day</div><div class="chips">'+sg.map(function(t,i){
return '<button type="button" class="chip" data-guard data-a="say" data-t="'+esc(t)+'" data-id="sg'+i+'">'+esc(t)+'</button>';
}).join('')+'</div></section></div>'+
'<div style="display:flex;flex-direction:column;gap:22px"><section><div class="lbl">Where to?</div>'+dests.map(function(d){
return '<button type="button" class="dest" data-a="nav" data-s="'+d[0]+'" data-id="d-'+d[0]+'"><span class="ib">'+ic(d[0])+'</span><span><b>'+d[1]+'</b><span>'+d[2]+'</span></span><span class="go">'+ic('arrow')+'</span></button>';
}).join('')+'</section>'+
'<section><div class="lbl">How are you feeling?</div><div class="faces">'+EMO.map(function(e){
return '<button type="button" class="face" data-a="emo" data-e="'+e[0]+'" data-id="f-'+e[0]+'">'+face(e[0])+e[1]+'</button>';
}).join('')+'</div></section></div></div>';
}

/* ---- screen router ---- */
function screenDef(){
var nm=S.settings.name?', '+esc(S.settings.name):'';
var h=new Date().getHours(),part=h<12?'morning':h<17?'afternoon':'evening';
switch(S.screen){
case 'letters':return {t:'Letter Board',s:'Tap letters, then Speak.',b:lettersBody(),v:true};
case 'phrases':return {t:'Phrase Board',s:'Tap a phrase to add it. Build a message, then Speak.',b:phrasesBody(),v:true};
case 'ai':return {t:'AI Assistant',s:'Tap words. Pick the sentence you mean.',b:aiBody(),v:true};
case 'emotions':return {t:'Emotion Center',s:'Say how you feel. Phrases match the feeling.',b:emotionsBody(),v:true};
case 'caregiver':return {t:'Caregiver',s:S.cg?'Progress and phrases for the care team.':'Adults only.',b:caregiverBody(),v:false};
case 'settings':return {t:'Settings',s:'Changes save on this device.',b:settingsBody(),v:false};
default:return {t:'Good '+part+nm,s:'Tap a word to say it out loud.',b:homeBody(),v:false};
}
}
var breathTimer=null;
function render(resetScroll){
var a=document.activeElement,id=a&&a.dataset?a.dataset.id:null,vals={};
$$('#app input,#app select,#app textarea').forEach(function(i){if(i.id)vals[i.id]=i.value;});
var b0=$('#board'),top=b0?b0.scrollTop:0;
var d=screenDef();
var page=d.v?'<div class="page has-voice">'+voiceHTML()+'<div class="board" id="board">'+d.b+'</div></div>':'<div class="page solo" id="board">'+d.b+'</div>';
app.innerHTML=railHTML()+'<main class="main" id="main"><button type="button" class="navtoggle" data-a="navtoggle" data-id="navtoggle" aria-label="'+(S.navHidden?'Show menu':'Hide menu')+'" aria-expanded="'+(!S.navHidden)+'">'+ic('menu')+'</button><div class="head"><h1>'+d.t+'</h1><p>'+d.s+'</p></div>'+page+'</main>';
Object.keys(vals).forEach(function(k){var e=document.getElementById(k);if(e&&k!=='sumtxt'&&k!=='voiceSel')e.value=vals[k];});
var b1=$('#board');if(b1&&!resetScroll)b1.scrollTop=top;
if(id){var el=document.querySelector('[data-id="'+id.replace(/"/g,'\\"')+'"]');if(el&&!el.disabled){try{el.focus({preventScroll:true});}catch(e){}}}
stage.dataset.size=S.settings.size;
app.dataset.size=S.settings.size;
if(!S.breathing)stopBreath();else startBreath();
}
function startBreath(){
if(breathTimer)return;var ph=0;
breathTimer=setInterval(function(){var t=document.getElementById('breathTxt');if(!t||!S.breathing){stopBreath();return;}ph=1-ph;t.textContent=ph?'Breathe out':'Breathe in';},4000);
}
function stopBreath(){if(breathTimer){clearInterval(breathTimer);breathTimer=null;}}

/* ================= environment ================= */
function applyEnv(){
stage.dataset.mode=mq.matches?'phone':S.mode;
stage.classList.toggle('reduce',!!S.settings.reduce);
app.classList.toggle('nav-hidden',!!S.navHidden);
$$('[data-mode-btn]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.modeBtn===S.mode));});
var root=document.documentElement;
if(S.settings.theme!=='auto'){root.setAttribute('data-theme',S.settings.theme);themeSet=true;}
else if(themeSet){root.removeAttribute('data-theme');themeSet=false;}
document.querySelector('.screen').setAttribute('data-size',S.settings.size);
}

/* ================= calm sense + touch guard ================= */
var hits={},lastCalm=0,down=null,holdT=null;
function trackHits(el){
if(!S.settings.calm)return;
var k=el.dataset.id,now=Date.now();
hits[k]=(hits[k]||[]).filter(function(t){return now-t<2000;});hits[k].push(now);
if(hits[k].length>=6&&now-lastCalm>30000){lastCalm=now;hits={};showSheet();}
}
function showSheet(){
sheetRoot.innerHTML='<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="shT"><div class="sheet-card"><h2 id="shT">That was a lot of taps.</h2><p>Do you want to tell someone something?</p>'+
'<button type="button" class="btn dark" data-a="sheetsay" data-t="I need a break." id="sh1">I need a break</button>'+
'<button type="button" class="btn dark" data-a="sheetsay" data-t="I need help." id="sh2">I need help</button>'+
'<button type="button" class="btn" data-a="sheetok" id="sh3">I\'m okay</button></div></div>';
var f=$('#sh1');if(f)f.focus();
}
function closeSheet(){sheetRoot.innerHTML='';}
document.addEventListener('keydown',function(e){
if(!sheetRoot.firstChild)return;
if(e.key==='Escape'){closeSheet();return;}
if(e.key==='Tab'){var b=$$('#sheet button'),i=b.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();b[b.length-1].focus();}else if(!e.shiftKey&&i===b.length-1){e.preventDefault();b[0].focus();}}
});
screenEl.addEventListener('pointerdown',function(e){
var g=e.target.closest('[data-guard]');
if(g&&S.settings.touchGuard>0){down={el:g,t:performance.now()};g.style.setProperty('--guard',S.settings.touchGuard+'ms');g.classList.add('hold');}
var h=e.target.closest('[data-hold]');
if(h){h.classList.add('holding');clearTimeout(holdT);holdT=setTimeout(function(){S.cg=true;render(true);},1500);}
});
function endPress(){
$$('.hold').forEach(function(x){x.classList.remove('hold');});
$$('.holding').forEach(function(x){x.classList.remove('holding');});
clearTimeout(holdT);
}
screenEl.addEventListener('pointerup',endPress);
screenEl.addEventListener('pointercancel',endPress);
screenEl.addEventListener('pointerleave',endPress,true);

/* ================= actions ================= */
screenEl.addEventListener('click',function(e){
var el=e.target.closest('[data-a]');
if(!el||el.disabled)return;
if(el.hasAttribute('data-guard')&&S.settings.touchGuard>0&&e.detail>0){
var held=down&&down.el===el?performance.now()-down.t:0;
el.classList.remove('hold');
if(held<S.settings.touchGuard){toast('Hold a little longer.');return;}
}
if(el.hasAttribute('data-guard'))trackHits(el);
act(el,e);
});
function go(s,reset){S.screen=s;S.confirmReset=false;render(reset!==false);}
function act(el,e){
var a=el.dataset.a;
switch(a){
case 'nav':go(el.dataset.s);break;
case 'navtoggle':S.navHidden=!S.navHidden;applyEnv();render();break;
case 'say':speak(el.dataset.t,'quick');toast('Said: '+el.dataset.t);break;
case 'speak':speak(S.msg,(S.screen==='letters'||S.screen==='ai')?'own':'phrase');break;
case 'undo':S.msg=S.hist.pop()||'';S.lastKind='';render();break;
case 'clear':change('','clear');try{speechSynthesis.cancel();}catch(x){}render();break;
case 'key':change(S.msg+el.dataset.c.toLowerCase(),'key');render();break;
case 'space':if(S.msg&&!/\s$/.test(S.msg))change(S.msg+' ','key');render();break;
case 'del':change(S.msg.slice(0,-1),'key');render();break;
case 'pred':{var w=el.dataset.w,ws=S.msg.split(/(\s+)/),endSp=!S.msg||/\s$/.test(S.msg);
var base=endSp?S.msg:S.msg.replace(/\S+$/,'');change(base+w+' ','pred');render();break;}
case 'comp':change(el.dataset.t,'comp');render();break;
case 'cat':S.cat=el.dataset.c;render(true);break;
case 'phr':addPhrase(el.dataset.t);
if(S.screen==='phrases'?S.settings.speakOnTap:true)speak(el.dataset.t,'phrase');
render();break;
case 'emo':{var em=EMO.filter(function(x){return x[0]===el.dataset.e;})[0];S.emo=em[0];S.tone=em[2];S.body=null;S.lvl=1;
if(S.screen!=='emotions')go('emotions');else render(true);break;}
case 'body':S.body=S.body===el.dataset.b?null:el.dataset.b;render();break;
case 'breath':S.breathing=!S.breathing;render();break;
case 'aiw':S.tokens.push(el.dataset.w);render();break;
case 'airm':S.tokens.splice(Number(el.dataset.i),1);render();break;
case 'aiclear':S.tokens=[];render();break;
case 'aiuse':{var r=interpret(S.tokens).list[Number(el.dataset.i)];if(r){change(r.t,'ai');S.usage.ai[r.t]=(S.usage.ai[r.t]||0)+1;S.tokens=[];save();toast('Added to your message.');render();}break;}
case 'aispeak':{var r2=interpret(S.tokens).list[Number(el.dataset.i)];if(r2){change(r2.t,'ai');S.usage.ai[r2.t]=(S.usage.ai[r2.t]||0)+1;speak(r2.t,'own');S.tokens=[];render();}break;}
case 'airaw':{var rw=interpret(S.tokens).raw;change(rw,'ai');S.tokens=[];toast('Using your own words.');render();break;}
case 'set':{var k=el.dataset.k,v=el.dataset.v;
if(k==='tone'||k==='kb'||k==='lvl'){S[k]=(k==='lvl')?Number(v):v;}
else{S.settings[k]=(k==='touchGuard')?Number(v):v;}
save();applyEnv();render();break;}
case 'toggle':{var tk=el.dataset.k;S.settings[tk]=!S.settings[tk];save();applyEnv();render();break;}
case 'hear':speak('Hello. This is how I sound.','test');break;
case 'cgopen':if(e&&e.detail===0){S.cg=true;render(true);}else if(!S.cg){toast('Keep holding for 1.5 seconds.');}break;
case 'cglock':S.cg=false;render(true);break;
case 'cgadd':{var inp=document.getElementById('cgtext'),cat=document.getElementById('cgcat');var t=(inp.value||'').replace(/\s+/g,' ').trim();
if(!t){toast('Type a phrase first.');inp.focus();break;}
if(S.custom.some(function(p){return p.t.toLowerCase()===t.toLowerCase();})){toast('That phrase is already saved.');break;}
S.custom.push({t:t,c:cat.value});save();inp.value='';toast('Added to '+cat.value+'.');render();break;}
case 'cgdel':S.custom.splice(Number(el.dataset.i),1);save();render();break;
case 'cgcopy':{var txt=summaryText();
var ok=function(){toast('Summary copied.');},bad=function(){var ta=document.getElementById('sumtxt');if(ta){ta.focus();ta.select();}toast('Select the text and copy it.');};
try{navigator.clipboard.writeText(txt).then(ok,bad);}catch(x){bad();}break;}
case 'reset':S.confirmReset=true;render();break;
case 'resetno':S.confirmReset=false;render();break;
case 'resetgo':S.custom=[];S.usage={phr:{},words:{},ai:{},days:{}};S.settings={name:'',voice:'',rate:1,touchGuard:0,speakOnTap:true,size:'lg',theme:'auto',reduce:false,calm:true,predict:true};S.confirmReset=false;S.msg='';S.hist=[];save();applyEnv();toast('Data reset.');render();break;
case 'sheetsay':speak(el.dataset.t,'quick');toast('Said: '+el.dataset.t);closeSheet();break;
case 'sheetok':closeSheet();break;
}
}
screenEl.addEventListener('input',function(e){
var t=e.target;
if(t.id==='nameIn'){S.settings.name=t.value;save();}
if(t.id==='rate'){S.settings.rate=Number(t.value);save();}
});
screenEl.addEventListener('change',function(e){
if(e.target.id==='voiceSel'){S.settings.voice=e.target.value;save();}
});
screenEl.addEventListener('keydown',function(e){
if(e.key==='Enter'&&e.target.id==='cgtext'){e.preventDefault();var b=document.getElementById('cgadd');if(b)b.click();}
});
$('#modeseg').addEventListener('click',function(e){
var b=e.target.closest('[data-mode-btn]');if(!b)return;
S.mode=b.dataset.modeBtn;save();applyEnv();
});
if(mq.addEventListener)mq.addEventListener('change',applyEnv);
try{if(window.speechSynthesis)speechSynthesis.addEventListener('voiceschanged',function(){if(S.screen==='settings')render();});}catch(e){}

/* ================= boot ================= */
applyEnv();
render(true);
loadPhrases().then(function(){render(true);});