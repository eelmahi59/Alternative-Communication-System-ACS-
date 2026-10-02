"use strict";
(function(){
  var DEFAULTS = {
    "Needs": ["Yes","No","Help me please","I need a break","I'm hungry","I'm thirsty","I need the bathroom","I'm in pain","I'm tired","I'm cold","I'm hot","Please wait"],
    "Feelings": ["I'm happy","I'm sad","I'm worried","I'm angry","I'm excited","I feel sick","I feel okay","I love you","I'm frustrated","I'm bored"],
    "Questions": ["What time is it?","Where is the bathroom?","Can you help me?","What's happening?","Who is that?","When are we leaving?","Can I have some water?","Can you say that again?"],
    "Social": ["Hello","Goodbye","Thank you","Please","Sorry","Excuse me","Good morning","Good night","How are you?","Nice to meet you"],
    "Answers": ["Maybe","I don't know","I understand","I don't understand","Stop","Go","More","All done","Slow down","That's right"]
  };
  var MINE = "My phrases";
  var cats = Object.keys(DEFAULTS).concat([MINE]);
  var state = {cat: cats[0], msg: [], custom: [], speakOnTap: true, xl: false, edit: false};

  function load(k, fb){ try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch(e){ return fb; } }
  function save(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e){ return false; } }

  state.custom = load("pb.custom", []);
  var s = load("pb.settings", {});
  if (typeof s.speakOnTap === "boolean") state.speakOnTap = s.speakOnTap;
  if (typeof s.xl === "boolean") state.xl = s.xl;

  var dark = load("pb.dark", null);
  if (dark === null) dark = !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
  document.body.classList.toggle("dark", dark);

  var $ = function(id){ return document.getElementById(id); };
  var msgEl=$("msg"), statusEl=$("status"), grid=$("grid"), tabs=$("tabs"), timer;

  function say(t){ statusEl.textContent = t; clearTimeout(timer); timer = setTimeout(function(){ statusEl.textContent = ""; }, 4000); }
  function settings(){ save("pb.settings", {speakOnTap: state.speakOnTap, xl: state.xl}); }

  function speak(text){
    if (!text) return;
    if (!("speechSynthesis" in window)) { say("Speech is not available in this browser."); return; }
    try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(text); u.rate = 0.95; speechSynthesis.speak(u); }
    catch(e){ say("Speech could not start."); }
  }

  function renderMsg(){
    var t = state.msg.join(" ");
    msgEl.textContent = t || "Tap phrases to build a message";
    msgEl.classList.toggle("empty", !t);
  }

  function renderTabs(){
    tabs.innerHTML = "";
    cats.forEach(function(c){
      var b = document.createElement("button");
      b.className = "tab"; b.type = "button"; b.textContent = c;
      b.setAttribute("aria-pressed", String(c === state.cat));
      b.onclick = function(){ state.cat = c; state.edit = false; render(); };
      tabs.appendChild(b);
    });
  }

  function tile(text, id){
    var cell = document.createElement("div"); cell.className = "cell";
    var b = document.createElement("button"); b.className = "tile"; b.type = "button"; b.textContent = text;
    b.onclick = function(){ state.msg.push(text); renderMsg(); if (state.speakOnTap) speak(text); };
    cell.appendChild(b);
    if (id && state.edit){
      var d = document.createElement("button"); d.className = "del"; d.type = "button"; d.textContent = "✕";
      d.setAttribute("aria-label", "Delete phrase: " + text);
      d.onclick = function(){
        state.custom = state.custom.filter(function(p){ return p.id !== id; });
        save("pb.custom", state.custom); say("Deleted: " + text); render();
      };
      cell.appendChild(d);
    }
    return cell;
  }

  function render(){
    var isMine = state.cat === MINE;
    renderTabs();
    $("mine").hidden = !isMine;
    $("edit").hidden = !isMine || !state.custom.length;
    $("edit").setAttribute("aria-pressed", String(state.edit));
    $("edit").textContent = state.edit ? "Done editing" : "Edit saved phrases";
    grid.className = "grid" + (state.xl ? " xl" : "");
    grid.innerHTML = "";
    if (isMine){
      if (!state.custom.length){
        var n = document.createElement("div"); n.className = "empty-note";
        n.textContent = "No saved phrases yet. Type one above, or build a message and choose Save message.";
        grid.appendChild(n);
      }
      state.custom.forEach(function(p){ grid.appendChild(tile(p.text, p.id)); });
    } else {
      DEFAULTS[state.cat].forEach(function(t){ grid.appendChild(tile(t)); });
    }
    $("speakTap").setAttribute("aria-pressed", String(state.speakOnTap));
    $("speakTap").textContent = "Speak on tap: " + (state.speakOnTap ? "On" : "Off");
    $("size").setAttribute("aria-pressed", String(state.xl));
    $("size").textContent = "Tile size: " + (state.xl ? "Extra large" : "Large");
  }

  function savePhrase(text){
    text = (text || "").replace(/\s+/g, " ").trim();
    if (!text){ say("Type or build a phrase first."); return false; }
    if (state.custom.some(function(p){ return p.text.toLowerCase() === text.toLowerCase(); })){ say("Already saved: " + text); return false; }
    state.custom.push({id: Date.now().toString(36) + Math.random().toString(36).slice(2,6), text: text});
    var ok = save("pb.custom", state.custom);
    say(ok ? "Saved to My phrases: " + text : "Saved for now. This browser can't keep phrases after you close it.");
    render();
    return true;
  }

  $("speak").onclick = function(){ if (!state.msg.length){ say("Nothing to speak yet."); return; } speak(state.msg.join(" ")); };
  $("undo").onclick = function(){ state.msg.pop(); renderMsg(); };
  $("clear").onclick = function(){ state.msg = []; renderMsg(); try{ speechSynthesis.cancel(); }catch(e){} };
  $("saveMsg").onclick = function(){ savePhrase(state.msg.join(" ")); };
  $("addBtn").onclick = function(){ var i = $("newText"); if (savePhrase(i.value)) i.value = ""; i.focus(); };
  $("newText").addEventListener("keydown", function(e){ if (e.key === "Enter"){ e.preventDefault(); $("addBtn").click(); } });
  $("speakTap").onclick = function(){ state.speakOnTap = !state.speakOnTap; settings(); render(); };
  $("size").onclick = function(){ state.xl = !state.xl; settings(); render(); };
  $("edit").onclick = function(){ state.edit = !state.edit; render(); };
  $("theme").onclick = function(){ dark = !dark; document.body.classList.toggle("dark", dark); save("pb.dark", dark); };
  $("back").onclick = function(e){ e.preventDefault(); if (history.length > 1) history.back(); };

  renderMsg();
  render();
  if (!save("pb.test", 1)) {
    say("This browser is blocking storage, so saved phrases will be lost when you close the page.");
  }
})();