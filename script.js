'use strict';
/* ================= data ================= */
var EMO=[
['happy','Happy','cheerful',["I'm in a good mood.","Let's do that again.","Thank you, that was great.","I want to share this with you.","I'm enjoying this."]],
['calm','Calm','calm',["I'm doing okay.","This is relaxing.","I'm comfortable.","I'm fine, thanks for asking.","I'd like to stay here a while."]],
['sad','Sad','calm',["I miss someone.","I could use a hug.","Please stay with me.","I don't feel like talking right now.","Something upset me."]],
['angry','Angry','firm',["I need space.","Please stop.","I don't like that.","I need to calm down.","I need a quiet place."]],
['frustrated','Frustrated','firm',["This is too hard.","Can you show me again?","I need more time.","Let me try a different way.","I need help."]],
['anxious','Anxious','calm',["I'm worried.","It's too loud for me.","I need to know what happens next.","Please stay close.","Can we go slowly?"]],
['overwhelmed','Overwhelmed','calm',["I'm overwhelmed.","I need to step out.","Too much is happening at once.","I need a quiet space.","Please give me a few minutes."]],
['tired','Tired','calm',["I'm exhausted.","I need to rest.","I can't focus right now.","I'd like to go home.","I need a nap."]]
];
var HELPS=[['Quiet','I need it quiet.'],['Space','I need some space.'],['Break','I need a break.'],['Talk','Can we talk?'],['Music','I would like some calming music.'],['Fresh air','I need some fresh air.'],['Someone I trust','Please get someone I trust.']];
var BODY=['Head','Chest','Stomach','Hands','All over'];
var LEVELS=[['A little',0],['Medium',1],['A lot',2]];
var WORDS=("i you we he she it they my me your want need like love feel go going come stop wait help more again all done please thank sorry yes no not maybe now later today tomorrow what where when who why how can will do eat drink talk play sleep read watch listen see look hear hurt hurts sick tired hungry thirsty happy sad angry scared worried cold hot loud quiet restroom home class school outside library dorm water juice coffee milk snack food apple phone laptop music video game blanket headphones charger bed mom dad sister brother grandma professor roommate friend doctor hug break space time fast slow big little good bad okay fine mine").split(' ');
var BIGRAM={'i':['want','need','feel','like','am'],'want':['to','more','water','coffee','a'],'need':['help','a','to','water','my'],'feel':['sad','sick','happy','okay','tired'],'please':['help','stop','wait','more'],'can':['i','we','you'],'more':['please','water','coffee','music'],'go':['home','outside','to'],'i\'m':['hungry','thirsty','tired','happy','sad','sick'],'to':['go','talk','eat','sleep','watch'],'my':['head','stomach','phone','laptop','headphones'],'thank':['you'],'help':['me','please']};
var START=['i','can','please','help'];
var SAMPLE_FREQ=[["I need a break.",42],["I'm hungry.",37],["Thank you.",33],["Can I have some water?",29],["I need more time.",24],["Hi, how are you?",21]];
var SAMPLE_TOTAL=[18,22,20,26,24,19,28,31,27,33,30,36,34,9];
var SAMPLE_OWN=[3,4,4,6,5,4,7,9,8,11,10,13,12,3];
var GOALS=[
['Ask for a break before it gets hard','Uses "I need a break" or Help on their own',4,5,'days this week'],
['Build sentences of three or more words','Letters or AI Assistant, in one message',61,100,'% of own messages'],
['Name a feeling at check-in','Picks a face on Home or in Feelings',9,14,'of 14 check-ins']
];
var BANK=[
['People',['I','you','Mom','Dad','we','friend','professor','roommate']],
['Actions',['want','go','eat','drink','play','talk','help','like','stop','see','listen','sleep']],
['Things',['water','juice','coffee','snack','phone','laptop','music','video','blanket','headphones']],
['Describe',['more','again','not','please','now','later','hot','cold','loud','hurts','all done']],
['Places',['home','outside','class','restroom','bed','library','dorm']]
];
var DRINKS=['water','juice','coffee'];
var OBJS=['water','juice','coffee','snack','phone','laptop','music','video','blanket','headphones'];
var PLACES=['home','outside','class','restroom','bed','library','dorm'];
var PLACEPH={home:'home',outside:'outside',class:'to class',restroom:'to the restroom',bed:'to bed',library:'to the library',dorm:'to my dorm'};
var OBJPH={water:'water',juice:'juice',coffee:'coffee',snack:'a snack',phone:'my phone',laptop:'my laptop',music:'music',video:'a video',blanket:'my blanket',headphones:'my headphones'};

/* ================= prediction ================= */
function allSentences(){
var a=[];Object.keys(PHRASES).forEach(function(c){a=a.concat(PHRASES[c]);});
S.custom.forEach(function(p){a.push(p.t);});
a=a.concat(EXTRA);
return a.filter(function(x,i){return a.indexOf(x)===i;});
}
function predictions(){
var m=S.msg,ws=m.trim().split(/\s+/).filter(Boolean),endSp=!m||/\s$/.test(m);
var prefix=endSp?'':ws[ws.length-1].toLowerCase();
var prev=endSp?(ws[ws.length-1]||'').toLowerCase():(ws[ws.length-2]||'').toLowerCase();
var out=[];
function push(w){if(w.indexOf(prefix)===0&&out.indexOf(w)<0)out.push(w);}
(BIGRAM[prev]||(prev===''?START:[])).forEach(push);
WORDS.slice().sort(function(a,b){return (S.usage.words[b]||0)-(S.usage.words[a]||0);}).forEach(function(w){if(out.length<8)push(w);});
if(!out.length)['i','want','help','more'].forEach(function(w){out.push(w);});
return out.slice(0,4);
}
function completions(){
var q=norm(S.msg),all=allSentences(),label='Finish my sentence';
var list;
if(!q){
label='Often said';
list=all.slice().sort(function(a,b){return (S.usage.phr[b]||0)-(S.usage.phr[a]||0);});
if(!list.some(function(x){return S.usage.phr[x];}))list=["I'd like to go outside.","Could I get a snack?","I need a break."];
}else{
list=all.filter(function(s){var n=norm(s);return n!==q&&n.indexOf(q)===0;}).sort(function(a,b){return ((S.usage.phr[b]||0)-(S.usage.phr[a]||0))||(a.length-b.length);});
}
return {label:label,list:list.slice(0,3)};
}

/* ================= AI interpretation (prototype rules) ================= */
function firstOf(tk,arr){for(var i=0;i<tk.length;i++)if(arr.indexOf(tk[i])>=0)return tk[i];return null;}
function interpret(tk){
var has=function(w){return tk.indexOf(w)>=0;},out=[];
var obj=firstOf(tk,OBJS),place=firstOf(tk,PLACES);
function add(t,c){if(out.every(function(o){return o.t!==t;}))out.push({t:t,c:c});}
var neg=has('not'),more=has('more');
if(has('hurts')){add('It hurts.',3);add("I'm in pain.",2);add('Something hurts and I need help.',2);}
else if(has('loud')){add("It's too loud.",3);add('Please make it quieter.',3);add('I need a quiet place.',2);}
else if(has('hot')&&!obj){add("I'm too hot.",3);add('Can we turn the heat down?',1);}
else if(has('cold')&&!obj){add("I'm cold.",3);add('Can I have my blanket?',2);}
else if(has('all done')){add("I'm all done.",3);add(obj?"I'm finished with "+OBJPH[obj]+".":"I'm finished.",2);}
else if(has('stop')){add('Please stop.',3);add('I want you to stop, please.',2);add('Stop now.',1);}
else if(has('help')){add(obj?'Please help me with '+OBJPH[obj]+'.':'Please help me.',3);add('I need help.',3);add('Can you help me now?',2);}
else if(neg&&(has('want')||has('like')||obj)){add("I don't want "+(obj?OBJPH[obj]:'that')+'.',3);add('No, thank you.',2);add("I don't like "+(obj?OBJPH[obj]:'that')+'.',2);}
else if(has('go')&&place){add('I want to go '+PLACEPH[place]+'.',3);add('Can we go '+PLACEPH[place]+'?',2);add('Go '+PLACEPH[place]+' now.',1);}
else if(place&&!obj){add('I want to go '+PLACEPH[place]+'.',2);add('Can we go '+PLACEPH[place]+'?',2);}
else if(has('play')&&obj!=='music'){add('I want to play a game.',3);add('Want to hang out?',2);add('Can we do something fun?',1);}
else if(has('listen')||(obj==='music'&&!has('drink')&&!has('eat'))){add('I want to listen to music.',3);add('Can you play music?',2);}
else if(has('see')||obj==='video'){add('I want to watch a video.',3);add('Can I see that?',2);}
else if(has('sleep')||place==='bed'){add("I'm tired. I want to sleep.",3);add('I want to go to bed.',2);}
else if(has('talk')){add('Can we talk?',3);add('I want to talk to you.',2);}
else if(has('like')){add('I like '+(obj?OBJPH[obj]:'this')+'.',3);add('I really like this.',2);}
else if(has('drink')||DRINKS.indexOf(obj)>=0){
var d=obj||'water';
if(has('drink'))add('I want to drink '+(more?'more ':'')+d+'.',3);else add('I want '+(more?'more ':'')+d+'.',3);
add('Can I have '+(more?'more ':'')+d+'?',3);add("I'm thirsty.",2);
}
else if(has('eat')||obj==='snack'){
var f=obj?OBJPH[obj]:'something';
if(has('eat'))add('I want to eat '+f+'.',3);else add('I want '+f+'.',3);
add('Can I have '+(obj?f:'a snack')+'?',3);add("I'm hungry.",2);
}
else if(has('want')||more||obj){
var thing=obj?OBJPH[obj]:'';
if(more){add(thing?'I want more '+(DRINKS.indexOf(obj)>=0||obj==='music'?obj:'of '+thing)+'.':'I want more.',3);add('More please.',3);}
else if(thing){add('I want '+thing+'.',3);add('Can I have '+thing+'?',3);add(cap(thing)+' please.',2);}
else add('I want something.',1);
}
var raw=tk.map(function(w){return w;}).join(' ');
if(!out.length&&tk.length)add(cap(raw)+'.',1);
out=out.map(function(o){
var t=o.t;
if(/[.]$/.test(t)&&/^I want /.test(t)){
if(has('please'))t=t.replace(/.$/,', please.');
if(has('now')&&!/now.$/.test(t))t=t.replace(/(, please)?.$/,' now.');
if(has('later'))t=t.replace(/.$/,' later.');
if(has('again'))t=t.replace(/.$/,' again.');
}
return {t:t,c:o.c};
});
var seen={};out=out.map(function(o){return {t:styled(o.t),c:o.c};}).filter(function(o){if(seen[o.t])return false;seen[o.t]=1;return true;});
return {list:out.slice(0,3),raw:cap(raw)+'.'};
}

/* ================= shared helpers ================= */
function styled(t,st){
st=st||S.aiStyle;
if(st==='polite'){
t=t.replace(/^I want to /,'I would like to ').replace(/^I want /,'I would like ').replace(/^I need (.*)\.$/,'I could use $1.').replace(/^Can I /,'May I ').replace(/^Can we /,'Could we ').replace(/^Can you /,'Could you ');
if(!/please/i.test(t)&&/^(I would like|May I|Could)/.test(t))t=t.replace(/([.?])$/,', please$1');
if(/^Stop( now)?\.$/.test(t))t='Please stop.';
}else if(st==='direct'){
t=t.replace(/, please([.?])$/,'$1').replace(/^Please /,'').replace(/^Can I have (.*)\?$/,'I want $1.').replace(/^Can we go (.*)\?$/,"Let's go $1.");
t=cap(t);
}
return t;
}
function timeAgo(ts){
var s=Math.floor((Date.now()-ts)/1000);if(s<60)return 'Just now';
var m=Math.floor(s/60);if(m<60)return m+' min ago';
var d=new Date(ts),n=new Date(),tm=d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
if(d.toDateString()===n.toDateString())return 'Today, '+tm;
var y=new Date(n);y.setDate(n.getDate()-1);
if(d.toDateString()===y.toDateString())return 'Yesterday, '+tm;
return d.toLocaleDateString('en-US',{month:'short',day:'numeric'})+', '+tm;
}

/* ================= letter board screen (swipe between layouts) ================= */
var KBS=[['abc','A to Z'],['qwerty','QWERTY'],['num','123 and symbols']];
var KROWS={abc:['ABCDEFG','HIJKLMN','OPQRSTU','VWXYZ<'],qwerty:['QWERTYUIOP','ASDFGHJKL','ZXCVBNM<'],num:['1234567890','-/:;()$&@','.,?!\'"<']};
function kbIdx(){for(var i=0;i<KBS.length;i++)if(KBS[i][0]===S.kb)return i;return 0;}
function keyBtn(c){
if(c==='<')return '<button type="button" class="key fn" data-guard data-a="del" data-id="k-del" aria-label="Delete">'+ic('back')+'</button>';
return '<button type="button" class="key" data-guard data-a="key" data-c="'+esc(c)+'" data-id="k-'+esc(c)+'">'+esc(c)+'</button>';
}
function kbPage(k){
return '<div class="kbpage" role="group" aria-label="'+k[1]+' keys">'+KROWS[k[0]].map(function(r){
return '<div class="krow">'+r.split('').map(keyBtn).join('')+'</div>';
}).join('')+'<div class="krow space"><button type="button" class="key fn wide" data-guard data-a="space" data-id="k-space">Space</button></div></div>';
}
function predsHTML(){
if(!S.settings.predict)return '';
var p=predictions(),c=completions();
return '<div class="preds"><div class="chips" role="group" aria-label="Next word">'+p.map(function(w,i){
return '<button type="button" class="chip ai" data-a="pred" data-w="'+esc(w)+'" data-id="pw-'+i+'">'+esc(w)+'</button>';
}).join('')+'</div>'+(c.list.length?'<div class="chips comps" role="group" aria-label="'+c.label+'">'+c.list.map(function(t,i){
return '<button type="button" class="chip ghost" data-a="comp" data-t="'+esc(t)+'" data-id="cp-'+i+'">'+esc(t)+'</button>';
}).join('')+'</div>':'')+'</div>';
}
function lettersBody(){
var ix=kbIdx();
return predsHTML()+
'<div class="kbbar"><div class="seg kbtabs" role="group" aria-label="Keyboard layout">'+KBS.map(function(k,i){
return '<button type="button" aria-pressed="'+(i===ix)+'" data-a="kbgo" data-i="'+i+'" data-id="kbt-'+k[0]+'">'+k[1]+'</button>';
}).join('')+'</div><span class="kbarrows"><button type="button" class="btn" data-a="kbprev" data-id="kbprev" aria-label="Previous layout"'+(ix===0?' disabled':'')+'>'+ic('chevl')+'</button><button type="button" class="btn" data-a="kbnext" data-id="kbnext" aria-label="Next layout"'+(ix===KBS.length-1?' disabled':'')+'>'+ic('chevr')+'</button></span></div>'+
'<div class="kbtrack" id="kbtrack">'+KBS.map(kbPage).join('')+'</div>'+
'<div class="kbdots" aria-hidden="true">'+KBS.map(function(k,i){return '<i class="'+(i===ix?'on':'')+'"></i>';}).join('')+'<span>Swipe the keys to change layout</span></div>';
}

/* ================= AI assistant screen ================= */
function aiBody(){
var tk=S.tokens,res=tk.length?interpret(tk):null,last=tk.length?tk[tk.length-1]:'';
var next=S.settings.predict?(BIGRAM[last]||(tk.length?[]:START)).slice(0,6):[];
var cat=BANK.filter(function(g){return g[0]===S.aiCat;})[0]||BANK[0];
var left='<div class="card"><div class="stepl"><b>1</b>Pick your words</div><div class="tray">'+(tk.length?tk.map(function(w,i){
return '<button type="button" class="chip" data-a="airm" data-i="'+i+'" data-id="tk-'+i+'" aria-label="Remove '+esc(w)+'">'+esc(w)+ic('clear')+'</button>';
}).join('')+'<button type="button" class="chip ghost" data-a="aiclear" data-id="aiclear">Clear</button>':'<span class="hint">Tap two or more words from the bank.</span>')+'</div>'+
(next.length?'<div class="lbl">Try next</div><div class="chips">'+next.map(function(w,i){
return '<button type="button" class="chip ai" data-guard data-a="aiw" data-w="'+esc(w)+'" data-id="nx-'+i+'">'+esc(w)+'</button>';
}).join('')+'</div>':'')+
'<div class="lbl">Sentence style</div>'+seg('aiStyle',[{v:'natural',l:'Natural'},{v:'polite',l:'Polite'},{v:'direct',l:'Direct'}],S.aiStyle,'Sentence style')+'</div>'+
'<div class="card"><div class="stepl"><b>2</b>Choose the sentence</div>';
if(res){
left+=res.list.map(function(s,i){
return '<div class="sug'+(i===0?' top':'')+'"><button type="button" class="say" data-a="aiuse" data-i="'+i+'" data-id="su-'+i+'">'+(i===0?'<span class="badge">Best match</span>':'')+'<span>'+esc(s.t)+'</span><span class="conf" aria-label="'+['','Low','Medium','High'][s.c]+' match">'+[1,2,3].map(function(n){return '<i class="'+(n<=s.c?'on':'')+'"></i>';}).join('')+' '+['','Low','Medium','High'][s.c]+' match</span></button>'+
'<button type="button" class="spk" data-a="aispeak" data-i="'+i+'" data-id="sp-'+i+'" aria-label="Speak: '+esc(s.t)+'">'+ic('speaker')+'</button></div>';
}).join('')+'<button type="button" class="chip ghost" data-a="airaw" data-id="airaw">None of these. Use my words: '+esc(res.raw)+'</button>';
}else left+='<div class="tray"><span class="hint">Sentences appear here as you pick words.</span></div>';
left+='<p class="fine">Suggestions are made on this device. Nothing is sent anywhere.</p></div>';
var right='<div class="card bank"><div class="stepl"><b>3</b>Word bank</div><div class="chips" role="group" aria-label="Word groups">'+BANK.map(function(g){
return '<button type="button" class="chip" aria-pressed="'+(g[0]===cat[0])+'" data-a="set" data-k="aiCat" data-v="'+g[0]+'" data-id="ac-'+g[0]+'">'+g[0]+'</button>';
}).join('')+'</div><div class="chips wordgrid">'+cat[1].map(function(w){
return '<button type="button" class="chip" data-guard data-a="aiw" data-w="'+esc(w.toLowerCase())+'" data-id="w-'+esc(w)+'">'+esc(w)+'</button>';
}).join('')+'</div><button type="button" class="chip ghost" data-a="nav" data-s="letters" data-id="spell">'+ic('letters')+'Spell a new word</button></div>';
return '<div class="ai"><div class="col">'+left+'</div>'+right+'</div>';
}

/* ================= feelings screen ================= */
function emotionsBody(){
var e=EMO.filter(function(x){return x[0]===S.emo;})[0];
var h='<div class="lbl">How are you feeling right now?</div><div class="emos">'+EMO.map(function(x){
return '<button type="button" class="emo" aria-pressed="'+(S.emo===x[0])+'" data-a="emo" data-e="'+x[0]+'" data-id="e-'+x[0]+'">'+face(x[0])+x[1]+'</button>';
}).join('')+'</div>';
if(!e){
h+='<div class="card feelempty"><b>Pick a face to begin.</b><span>Then choose how strong it is and say it out loud.</span></div>';
}else{
var adv=['a little ','','very '][S.lvl];
var lead='I feel '+adv+e[1].toLowerCase()+(S.lvl===2&&e[0]==='happy'?'!':'.');
var list=[lead];
if(S.body)list.push("I feel it in my "+S.body.toLowerCase().replace('all over','whole body')+'.');
list=list.concat(e[3]);
h+='<div class="card feelcard" data-e="'+e[0]+'"><div class="feelhead"><span class="fb">'+face(e[0])+'</span><div><b>'+esc(lead)+'</b><span>Choose how strong it is. Tap a sentence to say it.</span></div></div>'+
'<div class="lbl">How strong is it?</div><div class="meter" role="group" aria-label="Feeling size">'+LEVELS.map(function(l){
return '<button type="button" aria-pressed="'+(S.lvl===l[1])+'" data-a="set" data-k="lvl" data-v="'+l[1]+'" data-id="lvl-'+l[1]+'"><span class="bars">'+[0,1,2].map(function(n){return '<i class="'+(n<=l[1]?'on':'')+'"></i>';}).join('')+'</span>'+l[0]+'</button>';
}).join('')+'</div>'+
'<div class="lbl">Where do you feel it? (optional)</div><div class="chips" role="group" aria-label="Where in the body">'+BODY.map(function(b){
return '<button type="button" class="chip" aria-pressed="'+(S.body===b)+'" data-a="body" data-b="'+b+'" data-id="b-'+b+'">'+b+'</button>';
}).join('')+'</div></div>'+
'<div class="lbl">Say it</div><div class="grid">'+list.map(function(t,i){
return '<button type="button" class="tile" data-guard data-a="phr" data-t="'+esc(t)+'" data-id="ep-'+i+'">'+esc(t)+'</button>';
}).join('')+'</div>';
}
h+='<div class="lbl">What would help</div><div class="chips">'+HELPS.map(function(x,i){
return '<button type="button" class="chip" data-guard data-a="phr" data-t="'+esc(x[1])+'" data-id="hp-'+i+'">'+x[0]+'</button>';
}).join('')+'</div>'+
'<div class="card"><h2>Breathe with me</h2><div class="breath"><div class="orb'+(S.breathing?' on':'')+'" id="orb"><span id="breathTxt">'+(S.breathing?'Breathe in':'Ready')+'</span></div><div style="flex:1 1 220px"><p class="sub" style="margin:0 0 10px">In for 4, out for 4. The circle grows and shrinks. Stop any time.</p><button type="button" class="btn dark" data-a="breath" data-id="breath">'+(S.breathing?'Stop':'Start')+'</button></div></div></div>';
if(S.moods.length){
h+='<div class="card"><h2>Recent check-ins</h2><div class="chips" style="margin-top:10px">'+S.moods.slice(0,6).map(function(m){
var x=EMO.filter(function(q){return q[0]===m.e;})[0];
return x?'<span class="chip mood" data-e="'+m.e+'">'+face(m.e)+x[1]+' <small>'+timeAgo(m.ts)+'</small></span>':'';
}).join('')+'</div></div>';
}
return h;
}

/* ================= history screen ================= */
function histList(){return S.histTab==='saved'?S.saved.map(function(t){return {t:t};}):S.recent;}
function historyBody(){
var tab=S.histTab,list=histList();
var bar='<div class="kbbar">'+seg('histTab',[{v:'recent',l:'Recent ('+S.recent.length+')'},{v:'saved',l:'Saved ('+S.saved.length+')'}],tab,'History view');
if(tab==='recent'&&S.recent.length){
bar+=S.confirmHist?'<span class="vrow"><button type="button" class="btn dark" data-a="hcleargo" data-id="hcleargo">Yes, clear all</button><button type="button" class="btn" data-a="hclearno" data-id="hclearno">Keep</button></span>':'<button type="button" class="btn" data-a="hclear" data-id="hclear">'+ic('trash')+'Clear recent</button>';
}
bar+='</div>';
if(!list.length)return bar+'<div class="card feelempty"><b>'+(tab==='saved'?'Nothing saved yet.':'Nothing here yet.')+'</b><span>'+(tab==='saved'?'Tap the star on a message to keep it here.':'Messages you speak or clear show up here, so you can reuse them.')+'</span></div>';
return bar+'<div class="hlist">'+list.map(function(m,i){
var saved=S.saved.indexOf(m.t)>=0;
return '<div class="hrow"><div class="ht">'+esc(m.t)+'<small>'+(m.ts?timeAgo(m.ts):'Saved')+'</small></div>'+
'<button type="button" class="ib-btn say" data-a="hspeak" data-i="'+i+'" data-id="hs-'+i+'" aria-label="Speak: '+esc(m.t)+'">'+ic('speaker')+'</button>'+
'<button type="button" class="ib-btn" data-a="huse" data-i="'+i+'" data-id="hu-'+i+'" aria-label="Add to message">'+ic('plus')+'</button>'+
'<button type="button" class="ib-btn" aria-pressed="'+saved+'" data-a="hsave" data-i="'+i+'" data-id="hv-'+i+'" aria-label="'+(saved?'Remove from saved':'Save')+'">'+ic('star')+'</button>'+
'<button type="button" class="ib-btn" data-a="hdel" data-i="'+i+'" data-id="hd-'+i+'" aria-label="Delete">'+ic('trash')+'</button></div>';
}).join('')+'</div>';
}

/* ================= calculator ================= */
function fmtNum(v){
if(!isFinite(v))throw new Error('Cannot divide by zero');
if(Math.abs(v)<1e-12)v=0;
var s=parseFloat(v.toPrecision(12)),a=Math.abs(s);
if(a>=1e15||(a>0&&a<1e-7))return s.toExponential(6).replace(/\.?0+e/,'e');
return String(s);
}
function calcEval(src,deg){
var s=src.replace(/\s+/g,''),open=(s.match(/\(/g)||[]).length-(s.match(/\)/g)||[]).length;
while(open-->0)s+=')';
var t=[],m,re=/^(?:(\d+\.?\d*|\.\d+)|(asin|acos|atan|sin|cos|tan|ln|log)|(π|e)|(√)|([+\-−×÷^!%()]))/;
while(s.length){
m=re.exec(s);if(!m)throw new Error('Check the expression');
if(m[1]!==undefined)t.push({n:parseFloat(m[1])});
else if(m[2])t.push({f:m[2]});
else if(m[3])t.push({c:m[3]});
else if(m[4])t.push({f:'sqrt'});
else t.push({o:m[5]==='−'?'-':m[5]});
s=s.slice(m[0].length);
}
var p=0;
function isO(x){return t[p]&&t[p].o===x;}
function starts(){var k=t[p];return !!k&&(k.n!==undefined||!!k.f||!!k.c||k.o==='(');}
function need(x){if(!isO(x))throw new Error('Check the brackets');p++;}
function expr(){var v=term();while(isO('+')||isO('-')){var o=t[p++].o,r=term();v=o==='+'?v+r:v-r;}return v;}
function term(){var v=unary();for(;;){
if(isO('×')||isO('÷')){var o=t[p++].o,r=unary();if(o==='÷'){if(r===0)throw new Error('Cannot divide by zero');v=v/r;}else v*=r;}
else if(starts())v*=unary();
else break;}
return v;}
function unary(){if(isO('-')){p++;return -unary();}if(isO('+')){p++;return unary();}return power();}
function power(){var b=postfix();if(isO('^')){p++;return Math.pow(b,unary());}return b;}
function postfix(){var v=primary();for(;;){if(isO('!')){p++;v=fact(v);}else if(isO('%')){p++;v=v/100;}else break;}return v;}
function fact(n){if(n<0||n!==Math.floor(n)||n>170)throw new Error('Factorial needs a whole number 0 to 170');var r=1;for(var i=2;i<=n;i++)r*=i;return r;}
function primary(){
var k=t[p];if(!k)throw new Error('Finish the expression');
if(k.n!==undefined){p++;return k.n;}
if(k.c){p++;return k.c==='π'?Math.PI:Math.E;}
if(k.f){p++;need('(');var a=expr();need(')');return fn(k.f,a);}
if(isO('(')){p++;var v=expr();need(')');return v;}
throw new Error('Check the expression');}
function fn(f,a){
var rad=deg?a*Math.PI/180:a;
function back(x){return deg?x*180/Math.PI:x;}
switch(f){
case 'sin':return Math.sin(rad);case 'cos':return Math.cos(rad);
case 'tan':if(deg&&Math.abs(((a%180)+180)%180-90)<1e-9)throw new Error('Tangent is undefined here');return Math.tan(rad);
case 'asin':if(Math.abs(a)>1)throw new Error('Needs a value from -1 to 1');return back(Math.asin(a));
case 'acos':if(Math.abs(a)>1)throw new Error('Needs a value from -1 to 1');return back(Math.acos(a));
case 'atan':return back(Math.atan(a));
case 'ln':if(a<=0)throw new Error('Needs a positive number');return Math.log(a);
case 'log':if(a<=0)throw new Error('Needs a positive number');return Math.log10(a);
case 'sqrt':if(a<0)throw new Error('Not a real number');return Math.sqrt(a);
}}
var v=expr();
if(p<t.length)throw new Error('Check the expression');
return v;
}
function calcWords(s){
return String(s).replace(/asin\(/g,' inverse sine of (').replace(/acos\(/g,' inverse cosine of (').replace(/atan\(/g,' inverse tangent of (')
.replace(/sin\(/g,' sine of (').replace(/cos\(/g,' cosine of (').replace(/tan\(/g,' tangent of (').replace(/ln\(/g,' natural log of (').replace(/log\(/g,' log of (')
.replace(/√\(/g,' square root of (').replace(/\^2(?!\d)/g,' squared ').replace(/\^/g,' to the power of ')
.replace(/×/g,' times ').replace(/÷/g,' divided by ').replace(/[−-]/g,' minus ').replace(/\+/g,' plus ')
.replace(/π/g,' pi ').replace(/!/g,' factorial ').replace(/%/g,' percent ').replace(/\(/g,' open bracket ').replace(/\)/g,' close bracket ').replace(/\s+/g,' ').trim();
}
function calcSay(e,r){
var rs=String(r).replace(/^-/,'negative ').replace('e+',' times ten to the power of ').replace('e-',' times ten to the power of negative ');
return calcWords(e)+' equals '+rs;
}
var CK_SCI=[['inv','2nd'],['sin','sin'],['cos','cos'],['tan','tan'],['π','π'],['ln','ln'],['log','log'],['√','√'],['x²','x²'],['^','xʸ'],['(','('],[')',')'],['!','n!'],['1/x','1/x'],['e','e'],['mc','MC'],['mr','MR'],['m+','M+'],['m−','M−'],['%','%']];
var CK_BASIC=[['AC','AC','fn'],['DEL','','fn'],['neg','±','fn'],['÷','÷','op'],['7'],['8'],['9'],['×','×','op'],['4'],['5'],['6'],['−','−','op'],['1'],['2'],['3'],['+','+','op'],['0','0','zero'],['.'],['=','=','eq']];
var CK_INV={sin:'sin⁻¹',cos:'cos⁻¹',tan:'tan⁻¹',ln:'eˣ',log:'10ˣ'};
function ckey(k,l,cls,sci){
var C=S.calc;
if(l===undefined)l=k;
if(k==='DEL')l=ic('back');
else if(sci&&C.inv&&CK_INV[k])l=CK_INV[k];
var pressed=(k==='inv'&&C.inv)?' aria-pressed="true"':(k==='inv'?' aria-pressed="false"':'');
var aria={DEL:'Delete',neg:'Plus or minus',inv:'Second function',mc:'Memory clear',mr:'Memory recall','m+':'Memory add','m−':'Memory subtract','^':'Power','1/x':'Reciprocal','x²':'Square','√':'Square root','!':'Factorial','AC':'All clear','=':'Equals'}[k];
return '<button type="button" class="ckey'+(cls?' '+cls:'')+(sci?' sci':'')+'" data-guard data-a="calc" data-k="'+esc(k)+'" data-id="c-'+esc(k)+'"'+pressed+(aria?' aria-label="'+aria+'"':'')+'>'+l+'</button>';
}
function calcBody(){
var C=S.calc,pv='';
if(!C.just&&C.e&&!C.err){try{var f=fmtNum(calcEval(C.e,C.deg));if(f!==C.e.replace('−','-'))pv=f;}catch(x){}}
var res=C.err?'<span class="cerr">'+esc(C.err)+'</span>':(C.just?'= '+esc(C.ans):(pv?'= '+esc(pv):'&nbsp;'));
var has=!!C.e&&!C.err;
return '<div class="calc"><div class="card cdisp"><div class="ctop"><div class="seg" role="group" aria-label="Angle unit"><button type="button" aria-pressed="'+C.deg+'" data-a="calc" data-k="deg1" data-id="deg">Degrees</button><button type="button" aria-pressed="'+(!C.deg)+'" data-a="calc" data-k="rad1" data-id="rad">Radians</button></div>'+
'<span class="swline"><span>Say answers</span>'+sw('calcAuto','Say answers')+'</span><span class="swline"><span>Say each key</span>'+sw('calcKeys','Say each key')+'</span></div>'+
'<div class="cexp" aria-label="Expression">'+(C.e?esc(C.e):'<span class="cph">0</span>')+'<span class="caret" aria-hidden="true"></span></div>'+
'<div class="cres'+(C.just?' final':'')+'" role="status" aria-live="polite">'+res+(C.mem?' <span class="memb">M</span>':'')+'</div>'+
'<button type="button" class="btn speak primary" data-a="calcspeak" data-id="calcspeak"'+(has?'':' disabled')+'>'+ic('speaker')+'Speak the answer</button></div>'+
'<div class="ckeys"><div class="cgrid sci">'+CK_SCI.map(function(k){return ckey(k[0],k[1],k[0]==='inv'?'fn':'',true);}).join('')+'</div>'+
'<div class="cgrid basic">'+CK_BASIC.map(function(k){return ckey(k[0],k[1],k[2],false);}).join('')+'</div></div>'+
(C.hist.length?'<div class="card"><h2>Recent calculations</h2><p class="sub">Tap one to hear it again.</p>'+C.hist.slice(0,5).map(function(h,i){
return '<button type="button" class="mine chrow" data-a="chspeak" data-i="'+i+'" data-id="ch-'+i+'"><span>'+esc(h.e)+' = <b>'+esc(h.r)+'</b></span>'+ic('speaker')+'</button>';
}).join('')+'</div>':'')+'</div>';
}

/* ================= caregiver screen ================= */
function liveFreq(){
var m={};SAMPLE_FREQ.forEach(function(x){m[x[0]]=x[1];});
Object.keys(S.usage.phr).forEach(function(k){m[k]=(m[k]||0)+S.usage.phr[k];});
return Object.keys(m).map(function(k){return [k,m[k]];}).sort(function(a,b){return b[1]-a[1];}).slice(0,6);
}
function series(){
var d=dayRec(),t=SAMPLE_TOTAL.slice(),o=SAMPLE_OWN.slice();
t[t.length-1]+=d.all;o[o.length-1]+=d.own;return {t:t,o:o};
}
function dateLabel(back){var d=new Date();d.setDate(d.getDate()-back);return d.toLocaleDateString('en-US',{month:'short',day:'numeric'});}
function chartHTML(sr){
var W=680,H=270,L=44,R=132,T=16,B=36,iw=W-L-R,ih=H-T-B,n=sr.t.length;
var max=Math.max(40,Math.ceil(Math.max.apply(null,sr.t)/10)*10);
function X(i){return L+iw*i/(n-1);}function Y(v){return T+ih*(1-v/max);}
var g='';for(var v=0;v<=max;v+=10){g+='<line class="gl" x1="'+L+'" x2="'+(L+iw)+'" y1="'+Y(v)+'" y2="'+Y(v)+'"/><text x="'+(L-8)+'" y="'+(Y(v)+4)+'" text-anchor="end">'+v+'</text>';}
function path(a){return a.map(function(v,i){return (i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1);}).join(' ');}
var area=path(sr.t)+' L'+X(n-1)+' '+Y(0)+' L'+X(0)+' '+Y(0)+' Z';
var lt=sr.t[n-1],lo=sr.o[n-1];
var tbl='<table class="sr"><caption>Messages per day, last 14 days</caption><tr><th>Day</th><th>All messages</th><th>Own sentences</th></tr>'+sr.t.map(function(v,i){return '<tr><td>'+dateLabel(n-1-i)+'</td><td>'+v+'</td><td>'+sr.o[i]+'</td></tr>';}).join('')+'</table>';
return '<svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Line chart of messages per day over 14 days. All messages rose from '+sr.t[0]+' to '+lt+'. Own sentences rose from '+sr.o[0]+' to '+lo+'. A table follows.">'+g+
'<path class="ar" d="'+area+'" opacity=".75"/><path class="l1" d="'+path(sr.t)+'"/><path class="l2" d="'+path(sr.o)+'"/>'+
'<circle class="d1" cx="'+X(n-1)+'" cy="'+Y(lt)+'" r="6"/><circle class="d2" cx="'+X(n-1)+'" cy="'+Y(lo)+'" r="6"/>'+
'<text class="lab" x="'+(X(n-1)+12)+'" y="'+(Y(lt)+4)+'">All messages '+lt+'</text><text class="lab" x="'+(X(n-1)+12)+'" y="'+(Y(lo)+4)+'">Own sentences '+lo+'</text>'+
'<text x="'+L+'" y="'+(H-10)+'" text-anchor="start">'+dateLabel(n-1)+'</text><text x="'+X((n-1)/2)+'" y="'+(H-10)+'" text-anchor="middle">'+dateLabel(Math.round((n-1)/2))+'</text><text x="'+(L+iw)+'" y="'+(H-10)+'" text-anchor="end">Today</text></svg>'+tbl;
}
function summaryText(){
var sr=series(),avg=Math.round(sr.t.slice(-7).reduce(function(a,b){return a+b;},0)/7);
var f=liveFreq().slice(0,3).map(function(x){return '"'+x[0]+'"';}).join(', ');
return 'Mind2Voice weekly summary (sample data)\nAverage messages per day: '+avg+'\nOwn sentences today: '+sr.o[sr.o.length-1]+'\nMost used: '+f+'\nGoals: '+GOALS.map(function(g){return g[0]+' - '+g[2]+' '+g[4];}).join('; ');
}
function caregiverBody(){
if(!S.cg){
return '<div class="card" style="max-width:640px"><h2>Caregiver area</h2><p class="sub">This keeps adult settings and progress apart from the user\'s board. Press and hold the button for 1.5 seconds. With a keyboard, press Enter.</p>'+
'<button type="button" class="holdbtn" data-hold data-a="cgopen" data-id="hold">'+ic('lock')+'Hold to open</button></div>';
}
var sr=series(),d=dayRec(),avg=Math.round(sr.t.slice(-7).reduce(function(a,b){return a+b;},0)/7);
var f=liveFreq(),mx=f[0][1];
return '<div class="cg">'+
'<div class="wide stats"><div class="stat"><b>'+sr.t[sr.t.length-1]+'</b><span>Messages today</span></div><div class="stat"><b>'+sr.o[sr.o.length-1]+'</b><span>Own sentences today</span></div><div class="stat"><b>'+avg+'</b><span>7-day daily average</span></div></div>'+
'<div class="card wide"><h2>Communication trends</h2><p class="sub">Last 14 days. Own sentences are messages built with letters or the AI Assistant. Earlier days are sample data; today adds what you do here.</p>'+chartHTML(sr)+'</div>'+
'<div class="card"><h2>Frequently used phrases</h2><p class="sub">Sample history plus this session.</p><div class="bars">'+f.map(function(x){
return '<div class="brow"><span class="n">'+esc(x[0])+'</span><span class="track" aria-hidden="true"><i style="width:'+Math.round(x[1]/mx*100)+'%"></i></span><span class="v">'+x[1]+'</span></div>';
}).join('')+'</div></div>'+
'<div class="card"><h2>Progress</h2><p class="sub">Goals you set with the care team (sample).</p>'+GOALS.map(function(g){
var pct=Math.round(g[2]/g[3]*100);
return '<div class="goal"><div class="top"><b>'+esc(g[0])+'</b><span>'+(g[4].charAt(0)==='%'?g[2]+esc(g[4]):g[2]+' of '+g[3]+' '+esc(g[4]))+'</span></div><span style="color:var(--ink-2);font-size:.95rem">'+esc(g[1])+'</span><div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'" aria-label="'+esc(g[0])+'"><i style="width:'+pct+'%"></i></div></div>';
}).join('')+'</div>'+
'<div class="card"><h2>Create a custom phrase</h2><p class="sub">It appears on the Phrase Board in the group you pick.</p><form class="form" id="cgform" onsubmit="return false"><div class="field"><label for="cgtext">Phrase</label><input type="text" id="cgtext" maxlength="120" autocomplete="off" placeholder="Please call my sister."></div>'+
'<div class="field" style="flex:0 1 200px"><label for="cgcat">Group</label><select id="cgcat">'+CATS.map(function(c){return '<option>'+c[0]+'</option>';}).join('')+'</select></div>'+
'<button type="button" class="btn dark" data-a="cgadd" data-id="cgadd">'+ic('plus')+'Add phrase</button></form>'+
'<div style="margin-top:12px">'+(S.custom.length?S.custom.map(function(p,i){
return '<div class="mine"><span>'+esc(p.t)+' <small>'+esc(p.c)+'</small></span><button type="button" class="btn" style="min-height:48px" data-a="cgdel" data-i="'+i+'" data-id="cgdel-'+i+'" aria-label="Delete phrase: '+esc(p.t)+'">'+ic('clear')+'</button></div>';
}).join(''):'<small style="color:var(--ink-2)">No custom phrases yet.</small>')+'</div></div>'+
'<div class="card"><h2>Share with the care team</h2><p class="sub">A plain-text summary you can paste into a message.</p><div class="field"><label for="sumtxt">Summary</label><textarea id="sumtxt" readonly>'+esc(summaryText())+'</textarea></div><div class="vrow" style="margin-top:10px"><button type="button" class="btn" data-a="cgcopy" data-id="cgcopy">'+ic('copy')+'Copy summary</button><button type="button" class="btn" data-a="cglock" data-id="cglock">'+ic('lock')+'Lock caregiver area</button></div></div></div>';
}

/* ================= settings screen ================= */
function settingsBody(){
var S0=S.settings,vs=voices();
var voiceSel='<select id="voiceSel" aria-label="Voice"><option value="">Device default</option>'+vs.map(function(v){return '<option value="'+esc(v.voiceURI)+'"'+(v.voiceURI===S0.voice?' selected':'')+'>'+esc(v.name)+'</option>';}).join('')+'</select>';
return '<div class="card set">'+
'<div class="srow"><div><div class="t"><label for="nameIn">Name on Home</label></div><div class="d">Used in the greeting. Leave empty for a plain greeting.</div></div><input type="text" id="nameIn" maxlength="24" value="'+esc(S0.name)+'" autocomplete="off"></div>'+
'<div class="srow"><div><div class="t">Voice</div><div class="d">Voices come from this device.</div></div>'+voiceSel+'</div>'+
'<div class="srow"><div><div class="t"><label for="rate">Speaking speed</label></div><div class="d">Slower is often easier to follow.</div></div><span class="swwrap"><input type="range" id="rate" min="0.6" max="1.4" step="0.05" value="'+S0.rate+'"><button type="button" class="btn" data-a="hear" data-id="hear">'+ic('speaker')+'Hear it</button></span></div>'+
'<div class="srow"><div><div class="t">Touch guard</div><div class="d">Ignore quick accidental touches. Tiles fill while you hold.</div></div>'+seg('touchGuard',[{v:0,l:'Off'},{v:200,l:'Short'},{v:400,l:'Medium'},{v:700,l:'Long'}],S0.touchGuard,'Touch guard')+'</div>'+
'<div class="srow"><div><div class="t">Speak when a phrase is tapped</div><div class="d">Off lets you build a message first.</div></div>'+sw('speakOnTap','Speak when a phrase is tapped')+'</div>'+
'<div class="srow"><div><div class="t">Tile size</div></div>'+seg('size',[{v:'lg',l:'Large'},{v:'xl',l:'Extra large'}],S0.size,'Tile size')+'</div>'+
'<div class="srow"><div><div class="t">Theme</div></div>'+seg('theme',[{v:'auto',l:'Match device'},{v:'light',l:'Light'},{v:'dark',l:'Dark'}],S0.theme,'Theme')+'</div>'+
'<div class="srow"><div><div class="t">Reduce motion</div><div class="d">Turns off animation, including the breathing circle.</div></div>'+sw('reduce','Reduce motion')+'</div>'+
'<div class="srow"><div><div class="t">Calm Sense</div><div class="d">If one button is pressed again and again, offer a gentle choice: break, help, or I\'m okay. It uses taps only. No camera, no microphone, nothing leaves this device.</div></div>'+sw('calm','Calm Sense')+'</div>'+
'<div class="srow"><div><div class="t">Word and sentence suggestions</div></div>'+sw('predict','Word and sentence suggestions')+'</div>'+
'<div class="srow"><div><div class="t">Reset my data</div><div class="d">Clears settings, custom phrases and usage on this device.</div></div>'+(S.confirmReset?'<span class="vrow"><button type="button" class="btn dark" data-a="resetgo" data-id="resetgo">Yes, reset</button><button type="button" class="btn" data-a="resetno" data-id="resetno">Keep my data</button></span>':'<button type="button" class="btn" data-a="reset" data-id="reset">Reset</button>')+'</div></div>';
}
