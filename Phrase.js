/* ==========================================================
   Mind2Voice  |  Phrase.js
   Phrase Board. The built-in phrases are loaded from
   data/Phrases.json, so they can be edited without touching code.
   "My phrases" are saved in this browser.
   Shared helpers (speech, saved settings, theme) come from
   script.js through window.M2V.
   ========================================================== */
"use strict";

(function(){

    var M = window.M2V;
    var MINE = "My phrases";

    /* Used only if data/Phrases.json cannot be loaded, for example when the
       page is opened straight from a folder. Core needs stay available. */
    var FALLBACK = [{
        name: "Needs",
        phrases: ["Yes","No","Help me please","I need a break","I'm hungry","I'm thirsty","I need the bathroom","I'm in pain","I'm tired","Please wait"]
    }];

    var cats = [];
    var phrases = {};

    var state = {
        cat: "",
        msg: [],
        custom: [],
        speakOnTap: true,
        xl: false,
        edit: false,
        loading: true
    };

    var s = M.settings.get();
    state.speakOnTap = s.speakOnTap;
    state.xl = s.xl;

    var stored = M.load("pb.custom", []);
    state.custom = Array.isArray(stored)
        ? stored.filter(function(p){ return p && typeof p.text === "string" && p.id; })
        : [];

    var $ = function(id){ return document.getElementById(id); };
    var msgEl = $("msg"), statusEl = $("status"), grid = $("grid"), tabs = $("tabs"), timer;

    function say(t){
        statusEl.textContent = t;
        clearTimeout(timer);
        timer = setTimeout(function(){ statusEl.textContent = ""; }, 4000);
    }

    function keepSettings(){
        M.settings.set({speakOnTap: state.speakOnTap, xl: state.xl});
    }

    function speak(text){
        if (!text) return;

        M.speech.speak(text, function(st){
            if (st === "unsupported") say("Speech is not available in this browser.");
            else if (st === "error") say("Speech could not start.");
        });
    }

    function setCategories(list){
        cats = [];
        phrases = {};

        (Array.isArray(list) ? list : []).forEach(function(c){
            if (!c || typeof c.name !== "string" || c.name === MINE || phrases[c.name]) return;
            if (!Array.isArray(c.phrases)) return;

            var items = c.phrases.filter(function(p){
                return typeof p === "string" && p.trim();
            });

            if (!items.length) return;

            phrases[c.name] = items;
            cats.push(c.name);
        });

        cats.push(MINE);

        if (cats.indexOf(state.cat) < 0) state.cat = cats[0];
    }

    function renderMsg(){
        var t = state.msg.join(" ");
        msgEl.textContent = t || "Tap phrases to build a message";
        msgEl.classList.toggle("empty", !t);
    }

    function renderTabs(){
        tabs.innerHTML = "";

        if (state.loading) return;

        cats.forEach(function(c){
            var b = document.createElement("button");
            b.className = "tab";
            b.type = "button";
            b.textContent = c;
            b.setAttribute("aria-pressed", String(c === state.cat));
            b.onclick = function(){ state.cat = c; state.edit = false; render(); };
            tabs.appendChild(b);
        });
    }

    function tile(text, id){
        var cell = document.createElement("div");
        cell.className = "cell";

        var b = document.createElement("button");
        b.className = "tile";
        b.type = "button";
        b.textContent = text;
        b.onclick = function(){
            state.msg.push(text);
            renderMsg();
            if (state.speakOnTap) speak(text);
        };
        cell.appendChild(b);

        if (id && state.edit){
            var d = document.createElement("button");
            d.className = "del";
            d.type = "button";
            d.textContent = "✕";
            d.setAttribute("aria-label", "Delete phrase: " + text);
            d.onclick = function(){
                state.custom = state.custom.filter(function(p){ return p.id !== id; });
                M.save("pb.custom", state.custom);
                say("Deleted: " + text);
                render();
            };
            cell.appendChild(d);
        }

        return cell;
    }

    function note(text){
        var n = document.createElement("div");
        n.className = "empty-note";
        n.textContent = text;
        grid.appendChild(n);
    }

    function render(){
        var isMine = state.cat === MINE && !state.loading;

        renderTabs();

        $("mine").hidden = !isMine;
        $("edit").hidden = !isMine || !state.custom.length;
        $("edit").setAttribute("aria-pressed", String(state.edit));
        $("edit").textContent = state.edit ? "Done editing" : "Edit saved phrases";

        grid.className = "grid" + (state.xl ? " xl" : "");
        grid.innerHTML = "";

        if (state.loading){
            note("Loading phrases…");
        } else if (isMine){
            if (!state.custom.length){
                note("No saved phrases yet. Type one above, or build a message and choose Save message.");
            }
            state.custom.forEach(function(p){ grid.appendChild(tile(p.text, p.id)); });
        } else {
            (phrases[state.cat] || []).forEach(function(t){ grid.appendChild(tile(t)); });
        }

        $("speakTap").setAttribute("aria-pressed", String(state.speakOnTap));
        $("speakTap").textContent = "Speak on tap: " + (state.speakOnTap ? "On" : "Off");
        $("size").setAttribute("aria-pressed", String(state.xl));
        $("size").textContent = "Tile size: " + (state.xl ? "Extra large" : "Large");
    }

    function savePhrase(text){
        text = (text || "").replace(/\s+/g, " ").trim();

        if (!text){ say("Type or build a phrase first."); return false; }

        if (state.custom.some(function(p){ return p.text.toLowerCase() === text.toLowerCase(); })){
            say("Already saved: " + text);
            return false;
        }

        state.custom.push({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            text: text
        });

        var ok = M.save("pb.custom", state.custom);
        say(ok
            ? "Saved to My phrases: " + text
            : "Saved for now. This browser can't keep phrases after you close it.");
        render();
        return true;
    }

    $("speak").onclick = function(){
        if (!state.msg.length){ say("Nothing to speak yet."); return; }
        speak(state.msg.join(" "));
    };

    $("undo").onclick = function(){ state.msg.pop(); renderMsg(); };

    $("clear").onclick = function(){ state.msg = []; renderMsg(); M.speech.stop(); };

    $("saveMsg").onclick = function(){ savePhrase(state.msg.join(" ")); };

    $("addBtn").onclick = function(){
        var i = $("newText");
        if (savePhrase(i.value)) i.value = "";
        i.focus();
    };

    $("newText").addEventListener("keydown", function(e){
        if (e.key === "Enter"){ e.preventDefault(); $("addBtn").click(); }
    });

    $("speakTap").onclick = function(){ state.speakOnTap = !state.speakOnTap; keepSettings(); render(); };
    $("size").onclick = function(){ state.xl = !state.xl; keepSettings(); render(); };
    $("edit").onclick = function(){ state.edit = !state.edit; render(); };

    /* start */
    renderMsg();
    render();

    if (!M.save("m2v.test", 1)){
        say("This browser is blocking storage, so saved phrases will be lost when you close the page.");
    }

    function fetchPhrases(){
        if (typeof fetch !== "function") return Promise.reject(new Error("fetch is not available"));

        return fetch("data/Phrases.json").then(function(r){
            if (!r.ok) throw new Error("HTTP " + r.status);
            return r.json();
        });
    }

    fetchPhrases()
        .then(function(data){
            setCategories(data && data.categories);
            if (cats.length < 2) throw new Error("no phrases in file");
        })
        .catch(function(){
            setCategories(FALLBACK);
            $("notice").hidden = false;
        })
        .then(function(){
            state.loading = false;
            render();
        });

})();