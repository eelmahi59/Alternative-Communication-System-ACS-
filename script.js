/* ==========================================================
   Mind2Voice  |  script.js
   Loaded in <head> on every page. It handles what all pages share:
     - dark mode (the "dark" class on <html>, saved as "theme")
     - saved settings, and speech
     - the home screen: device switch and fullscreen button
   Other scripts reach it through window.M2V.
   Page logic: app.js (Letter Board, Settings) and Phrase.js.
   ========================================================== */
"use strict";

(function(){

    var root = document.documentElement;

    /* ---------- storage ---------- */
    function load(key, fallback){
        try {
            var v = localStorage.getItem(key);
            return v === null ? fallback : JSON.parse(v);
        } catch(e){
            return fallback;
        }
    }

    function save(key, value){
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch(e){
            return false;
        }
    }

    /* ---------- theme ---------- */
    var stored = null;
    try { stored = localStorage.getItem("theme"); } catch(e){}

    var dark = stored
        ? stored === "dark"
        : !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);

    root.classList.toggle("dark", dark);

    function syncThemeButtons(){
        var buttons = document.querySelectorAll("[data-theme-toggle]");

        for (var i = 0; i < buttons.length; i++){
            var b = buttons[i];

            if (b.getAttribute("data-theme-toggle") === "icon"){
                b.setAttribute("aria-pressed", String(dark));
            } else {
                b.textContent = dark ? "☀️ Light" : "🌙 Dark";
            }
        }
    }

    function setTheme(next){
        dark = !!next;
        root.classList.toggle("dark", dark);

        try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch(e){}

        syncThemeButtons();
        document.dispatchEvent(new CustomEvent("m2v:theme", {detail:{dark:dark}}));
    }

    /* ---------- settings ---------- */
    var DEFAULTS = {speakOnTap:true, xl:false, voice:"", rate:1};
    var settings = null;

    function getSettings(){
        if (settings) return settings;

        var legacy = load("pb.settings", {}) || {};
        var mine = load("m2v.settings", {}) || {};

        settings = {};

        for (var k in DEFAULTS){
            settings[k] =
                mine[k] !== undefined   ? mine[k] :
                legacy[k] !== undefined ? legacy[k] :
                DEFAULTS[k];
        }

        settings.speakOnTap = !!settings.speakOnTap;
        settings.xl = !!settings.xl;
        settings.voice = typeof settings.voice === "string" ? settings.voice : "";
        settings.rate = Math.min(1.4, Math.max(0.6, Number(settings.rate) || 1));

        return settings;
    }

    function setSettings(patch){
        var s = getSettings();

        for (var k in patch){
            if (k in DEFAULTS) s[k] = patch[k];
        }

        return save("m2v.settings", s);
    }

    /* ---------- speech ---------- */
    var canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

    function voices(){
        if (!canSpeak) return [];
        try { return speechSynthesis.getVoices() || []; } catch(e){ return []; }
    }

    /* cb gets one of: "start", "end", "error", "unsupported" */
    function speak(text, cb){
        cb = cb || function(){};
        text = String(text || "").trim();

        if (!text) return false;

        if (!canSpeak){
            cb("unsupported");
            return false;
        }

        try {
            speechSynthesis.cancel();

            var s = getSettings();
            var u = new SpeechSynthesisUtterance(text);

            u.rate = s.rate;

            if (s.voice){
                var v = voices().filter(function(x){ return x.voiceURI === s.voice; })[0];
                if (v){ u.voice = v; u.lang = v.lang; }
            }

            u.onstart = function(){ cb("start"); };
            u.onend = function(){ cb("end"); };
            u.onerror = function(e){
                /* cancel() ends the earlier utterance; that is not a failure */
                if (e && (e.error === "canceled" || e.error === "interrupted")) return;
                cb("error");
            };

            speechSynthesis.speak(u);
            return true;
        } catch(e){
            cb("error");
            return false;
        }
    }

    function stopSpeaking(){
        if (!canSpeak) return;
        try { speechSynthesis.cancel(); } catch(e){}
    }

    /* ---------- home screen ---------- */
    function initHome(){
        var device = document.querySelector(".ipad");
        if (!device) return;

        /* Device switch */
        var buttons = document.querySelectorAll("[data-device]");

        Array.prototype.forEach.call(buttons, function(btn){
            btn.addEventListener("click", function(){
                Array.prototype.forEach.call(buttons, function(b){
                    b.classList.remove("active");
                    b.setAttribute("aria-pressed", "false");
                });

                btn.classList.add("active");
                btn.setAttribute("aria-pressed", "true");

                device.classList.toggle("web-view", btn.getAttribute("data-device") === "web");
            });
        });

        /* Tablet detection */
        var isTablet =
            navigator.maxTouchPoints > 1 &&
            Math.max(window.innerWidth, window.innerHeight) >= 820;

        if (isTablet){
            var selector = document.querySelector(".device-selector");
            if (selector) selector.style.display = "none";
            device.classList.add("web-view");
        }

        /* Fullscreen */
        var fsBtn = document.getElementById("fullscreenBtn");
        if (!fsBtn) return;

        var el = document.documentElement;
        var request = el.requestFullscreen || el.webkitRequestFullscreen;
        var exit = document.exitFullscreen || document.webkitExitFullscreen;

        if (!request || !exit){
            fsBtn.hidden = true;
            return;
        }

        function isFull(){
            return !!(document.fullscreenElement || document.webkitFullscreenElement);
        }

        function syncFs(){
            fsBtn.textContent = isFull() ? "✕ Exit" : "⛶ Fullscreen";
        }

        fsBtn.addEventListener("click", function(){
            var p;

            try {
                p = isFull() ? exit.call(document) : request.call(el);
            } catch(e){}

            if (p && p.catch) p.catch(function(err){ console.log(err); });
        });

        document.addEventListener("fullscreenchange", syncFs);
        document.addEventListener("webkitfullscreenchange", syncFs);
    }

    /* ---------- start ---------- */
    document.addEventListener("DOMContentLoaded", function(){
        var buttons = document.querySelectorAll("[data-theme-toggle]");

        Array.prototype.forEach.call(buttons, function(b){
            b.addEventListener("click", function(){ setTheme(!dark); });
        });

        syncThemeButtons();
        initHome();
    });

    /* ---------- public ---------- */
    window.M2V = {
        load: load,
        save: save,
        settings: {get:getSettings, set:setSettings},
        theme: {isDark:function(){ return dark; }, set:setTheme},
        speech: {supported:canSpeak, voices:voices, speak:speak, stop:stopSpeaking}
    };

})();