'use strict';
/* ================= data ================= */
var EMO=[
['happy','Happy','cheerful',["I like this.","Let's do it again.","Thank you, that was fun.","I want to share this with you.","I want to keep playing."]],
['sad','Sad','calm',["I miss someone.","I want a hug.","Please stay with me.","I don't want to talk right now.","Something made me sad."]],
['angry','Angry','firm',["I need space.","Please stop.","I don't like that.","I need to calm down.","I need a quiet place."]],
['frustrated','Frustrated','firm',["This is too hard.","Can you show me again?","I need more time.","Let me try a different way.","I need help."]],
['anxious','Anxious','calm',["I'm worried.","It's too loud for me.","I need to know what happens next.","Please stay close to me.","Can we go slowly?"]]
];
var HELPS=[['Hug','I would like a hug.'],['Quiet','I need it quiet.'],['Space','I need some space.'],['Break','I need a break.'],['Talk','Can we talk?'],['Music','I want calming music.']];
var BODY=['Head','Chest','Tummy','Hands','All over'];
var LEVELS=[['A little',0],['Medium',1],['A lot',2]];
var WORDS=("i you we he she it they my me your want need like love feel go going come stop wait help more again all done please thank sorry yes no not maybe now later today tomorrow what where when who why how can will do eat drink play sleep read watch listen see look hear hurt hurts sick tired hungry thirsty happy sad angry scared worried cold hot loud quiet bathroom home school outside water juice milk snack food pizza apple cookie toy book music video game blanket headphones bed mom dad sister brother grandma teacher friend doctor hug break space time fast slow big little good bad okay fine mine").split(' ');
var BIGRAM={'i':['want','need','feel','like','am'],'want':['to','more','water','juice','a'],'need':['help','a','to','water','my'],'feel':['sad','sick','happy','okay','tired'],'please':['help','stop','wait','more'],'can':['i','we','you'],'more':['please','water','juice','music'],'go':['home','outside','to'],'i\'m':['hungry','thirsty','tired','happy','sad','sick'],'to':['go','play','eat','sleep','watch'],'my':['head','tummy','blanket','headphones'],'thank':['you'],'help':['me','please']};
var START=['i','can','please','help'];
var SAMPLE_FREQ=[["I need a break.",42],["I'm hungry.",37],["More please.",33],["Thank you.",29],["I want to play.",24],["Can I have water?",21]];
var SAMPLE_TOTAL=[18,22,20,26,24,19,28,31,27,33,30,36,34,9];
var SAMPLE_OWN=[3,4,4,6,5,4,7,9,8,11,10,13,12,3];
var GOALS=[
['Ask for a break before it gets hard','Uses "I need a break" or Help on their own',4,5,'days this week'],
['Build sentences of three or more words','Letters or AI Assistant, in one message',61,100,'% of own messages'],
['Name a feeling at check-in','Picks a face on Home or in Emotion Center',9,14,'of 14 check-ins']
];
var BANK=[
['People',['I','you','Mom','Dad','we']],
['Actions',['want','go','eat','drink','play','help','like','stop','see','listen','sleep']],
['Things',['water','juice','snack','toy','music','video','book','blanket','headphones']],
['Describe',['more','again','not','please','now','later','hot','cold','loud','hurts','all done']],
['Places',['home','outside','school','bathroom','bed']]
];
var OBJS=['water','juice','snack','toy','music','video','book','blanket','headphones'];
var PLACES=['home','outside','school','bathroom','bed'];
var PLACEPH={home:'home',outside:'outside',school:'to school',bathroom:'to the bathroom',bed:'to bed'};
var OBJPH={water:'water',juice:'juice',snack:'a snack',toy:'my toy',music:'music',video:'a video',book:'a book',blanket:'my blanket',headphones:'my headphones'};

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
if(!list.some(function(x){return S.usage.phr[x];}))list=["I want to go outside.","Can I have a snack?","I need a break."];
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
else if(has('play')){add(obj?'I want to play with '+OBJPH[obj]+'.':'I want to play.',3);add('Can we play?',2);add('Play with me.',2);}
else if(has('listen')||(obj==='music'&&!has('drink')&&!has('eat'))){add('I want to listen to music.',3);add('Can you play music?',2);}
else if(has('see')||obj==='video'){add('I want to watch a video.',3);add('Can I see that?',2);}
else if(has('sleep')||place==='bed'){add("I'm tired. I want to sleep.",3);add('I want to go to bed.',2);}
else if(has('like')){add('I like '+(obj?OBJPH[obj]:'this')+'.',3);add('I really like this.',2);}
else if(has('drink')||obj==='water'||obj==='juice'){
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
if(more){add(thing?'I want more '+(obj==='water'||obj==='juice'||obj==='music'?obj:'of '+thing)+'.':'I want more.',3);add('More please.',3);}
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
return {list:out.slice(0,3),raw:cap(raw)+'.'};
}

/* ================= letter board screen ================= */
function keysHTML(){
    var rows = S.kb === 'abc'
        ? ['ABCDEFG','HIJKLMN','OPQRSTU','VWXYZ<']
        : ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM<'];

    return '<div class="keys">' +
        rows.map(function(r){
            return '<div class="krow">' +
                r.split('').map(function(c){
                    if(c === '<'){
                        return '<button type="button" class="key fn" data-guard data-a="del">' +
                               ic('back') +
                               '</button>';
                    }
                    return '<button type="button" class="key" data-guard data-a="key" data-c="' + c + '">' +
                           c +
                           '</button>';
                }).join('') +
                '</div>';
        }).join('') +
        '<div class="krow space">' +
            '<button type="button" class="key fn wide" data-guard data-a="space">Space</button>' +
        '</div>' +
        '</div>';
}
function lettersBody(){
    var h='';

    h += '<div class="kbbar">' +
        '<span class="lbl">Letters</span>' +
        seg('kb',[
            {v:'abc',l:'A to Z'},
            {v:'qwerty',l:'QWERTY'}
        ],S.kb,'Letter order') +
        '</div>';

    return h + keysHTML();
}

/* ================= AI assistant screen ================= */
function aiBody(){
var tk=S.tokens,res=tk.length?interpret(tk):null;
var bank='<div class="bank"><div class="lbl">Tap words</div>'+BANK.map(function(g){
return '<div class="group"><div class="chips" role="group" aria-label="'+g[0]+'">'+g[1].map(function(w){
return '<button type="button" class="chip" data-guard data-a="aiw" data-w="'+esc(w.toLowerCase())+'" data-id="w-'+esc(w)+'">'+esc(w)+'</button>';
}).join('')+'</div></div>';
}).join('')+'<button type="button" class="chip ghost" data-a="nav" data-s="letters" data-id="spell">'+ic('letters')+'Spell a new word</button></div>';
var tray='<div><div class="lbl" style="margin-bottom:8px">My words</div><div class="tray">'+(tk.length?tk.map(function(w,i){
return '<button type="button" class="chip" data-a="airm" data-i="'+i+'" data-id="tk-'+i+'" aria-label="Remove '+esc(w)+'">'+esc(w)+ic('clear')+'</button>';
}).join('')+'<button type="button" class="chip ghost" data-a="aiclear" data-id="aiclear">Clear words</button>':'<span class="hint">Tap two or more words below.</span>')+'</div></div>';
var sug='<div class="lbl" style="margin-top:6px">I think you mean</div>';
if(res){
sug+=res.list.map(function(s,i){
return '<div class="sug'+(i===0?' top':'')+'"><button type="button" class="say" data-a="aiuse" data-i="'+i+'" data-id="su-'+i+'"><span>'+esc(s.t)+'</span><span class="conf" aria-label="'+['','Low','Medium','High'][s.c]+' match">'+[1,2,3].map(function(n){return '<i class="'+(n<=s.c?'on':'')+'"></i>';}).join('')+' '+['','Low','Medium','High'][s.c]+' match</span></button>'+
'<button type="button" class="spk" data-a="aispeak" data-i="'+i+'" data-id="sp-'+i+'" aria-label="Speak: '+esc(s.t)+'">'+ic('speaker')+'</button></div>';
}).join('')+
'<button type="button" class="chip ghost" data-a="airaw" data-id="airaw">Not these. Use my words: '+esc(res.raw)+'</button>';
}else sug+='<div class="tray"><span class="hint">Suggestions appear here.</span></div>';
sug+='<p class="sub" style="margin:4px 0 0;color:var(--ink-2);font-size:.9rem">Prototype rules run on this device. A full version would learn this person\'s own words and choices.</p>';
return '<div class="ai"><div style="display:flex;flex-direction:column;gap:14px">'+tray+sug+'</div>'+bank+'</div>';
}

/* ================= emotion center screen ================= */
function emotionsBody(){
var e=EMO.filter(function(x){return x[0]===S.emo;})[0];
var h='<div class="lbl">Pick the face closest to how you feel</div><div class="emos">'+EMO.map(function(x){
return '<button type="button" class="emo" aria-pressed="'+(S.emo===x[0])+'" data-a="emo" data-e="'+x[0]+'" data-id="e-'+x[0]+'">'+face(x[0])+x[1]+'</button>';
}).join('')+'</div>';
if(!e)return h+'<p class="sub" style="color:var(--ink-2)">After you choose, phrases for that feeling appear here.</p>';
var adv=['a little ','','very '][S.lvl];
var lead='I feel '+adv+e[1].toLowerCase()+(S.lvl===2&&e[0]==='happy'?'!':'.');
var list=[lead];
if(S.body)list.push("I feel it in my "+S.body.toLowerCase().replace('all over','whole body')+'.');
list=list.concat(e[3]);
h+='<div class="card" style="display:flex;flex-direction:column;gap:12px"><div><div class="lbl" style="margin-bottom:8px">How big is the feeling?</div>'+seg('lvl',LEVELS.map(function(l){return {v:l[1],l:l[0]};}),S.lvl,'Feeling size')+'</div>'+
'<div><div class="lbl" style="margin-bottom:8px">Where do you feel it? (optional)</div><div class="chips" role="group" aria-label="Where in the body">'+BODY.map(function(b){
return '<button type="button" class="chip" aria-pressed="'+(S.body===b)+'" data-a="body" data-b="'+b+'" data-id="b-'+b+'">'+b+'</button>';
}).join('')+'</div></div></div>'+
'<div class="lbl">Say it</div><div class="grid">'+list.map(function(t,i){
return '<button type="button" class="tile" data-guard data-a="phr" data-t="'+esc(t)+'" data-id="ep-'+i+'">'+esc(t)+'</button>';
}).join('')+'</div>'+
'<div class="lbl">What would help me</div><div class="chips">'+HELPS.map(function(x,i){
return '<button type="button" class="chip" data-guard data-a="phr" data-t="'+esc(x[1])+'" data-id="hp-'+i+'">'+x[0]+'</button>';
}).join('')+'</div>'+
'<div class="card"><h2>Breathe with me</h2><div class="breath"><div class="orb'+(S.breathing?' on':'')+'" id="orb"><span id="breathTxt">'+(S.breathing?'Breathe in':'Ready')+'</span></div><div style="flex:1 1 220px"><p class="sub" style="margin:0 0 10px">In for 4, out for 4. The circle grows and shrinks. Stop any time.</p><button type="button" class="btn dark" data-a="breath" data-id="breath">'+(S.breathing?'Stop':'Start')+'</button></div></div></div>';
return h;
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
return '<div class="card" style="max-width:640px"><h2>Caregiver area</h2><p class="sub">This keeps adult settings and progress apart from the child\'s board. Press and hold the button for 1.5 seconds. With a keyboard, press Enter.</p>'+
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
