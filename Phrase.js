'use strict';
/* ================= phrase data (loaded from data/phrases.json) ================= */
var QUICK=[];
var CATS=[];
var PHRASES={};
var EXTRA=[];
var SUGGEST={};

function loadPhrases(){
return fetch('data/phrases.json').then(function(r){
if(!r.ok)throw new Error('HTTP '+r.status);
return r.json();
}).then(function(d){
QUICK=d.QUICK||[];CATS=d.CATS||[];PHRASES=d.PHRASES||{};EXTRA=d.EXTRA||[];SUGGEST=d.SUGGEST||{};
if(CATS.length&&!CATS.some(function(c){return c[0]===S.cat;}))S.cat=CATS[0][0];
}).catch(function(){
/* Opening index.html straight from disk blocks fetch(). Run a local server, e.g. python3 -m http.server */
setTimeout(function(){toast('Phrases could not load. Open this app from a local web server.');},300);
});
}

/* ================= phrase message helper ================= */
function addPhrase(t){change((S.msg.trim()?S.msg.replace(/\s+$/,'')+' ':'')+t,'phrase');}

/* ================= phrase board screen ================= */
function phrasesBody(){
var list=(PHRASES[S.cat]||[]).concat(S.custom.filter(function(p){return p.c===S.cat;}).map(function(p){return p.t;}));
return '<div class="chips" role="group" aria-label="Phrase groups">'+CATS.map(function(c){
return '<button type="button" class="chip" aria-pressed="'+(S.cat===c[0])+'" data-a="cat" data-c="'+esc(c[0])+'" data-id="cat-'+esc(c[0])+'">'+ic(c[1])+c[0]+'</button>';
}).join('')+'</div><div class="grid">'+list.map(function(t,i){
return '<button type="button" class="tile" data-guard data-a="phr" data-t="'+esc(t)+'" data-id="ph-'+i+'">'+esc(t)+'</button>';
}).join('')+'</div>';
}
