/* ==========================================================
   Mind2Voice  |  app.js
   Page logic for the Letter Board and Settings.
   The Phrase Board has its own file, Phrase.js.
   Shared helpers (speech, saved settings, theme) come from
   script.js through window.M2V.
   ========================================================== */
"use strict";

(function(){

    var M = window.M2V;
    if (!M) return;

    var page = document.body.getAttribute("data-page");

    function $(id){ return document.getElementById(id); }

    if (page === "letters") letters();
    if (page === "settings") settings();


    /* ---------- Letter Board ---------- */
    function letters(){
        var message = $("message");
        var status = $("status");
        var keyboard = $("keyboard");

        function say(text){ status.textContent = text; }

        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function(letter){
            var button = document.createElement("button");
            button.type = "button";
            button.className = "key";
            button.textContent = letter;

            button.addEventListener("click", function(){
                message.textContent += letter;
                say("");
            });

            keyboard.appendChild(button);
        });

        $("space").addEventListener("click", function(){
            var t = message.textContent;
            if (t && !t.endsWith(" ")) message.textContent += " ";
        });

        $("backspace").addEventListener("click", function(){
            message.textContent = message.textContent.slice(0, -1);
        });

        $("clear").addEventListener("click", function(){
            message.textContent = "";
            M.speech.stop();
            say("Message cleared.");
        });

        $("speak").addEventListener("click", function(){
            var text = message.textContent.trim();

            if (!text){
                say("Add a message before speaking.");
                return;
            }

            M.speech.speak(text, function(state){
                if (state === "start") say("Speaking...");
                else if (state === "end") say("");
                else if (state === "unsupported") say("Speech is not available.");
                else if (state === "error") say("Speech could not be played.");
            });
        });
    }


    /* ---------- Settings ---------- */
    function settings(){
        var status = $("status");
        var timer;

        function say(text){
            status.textContent = text;
            clearTimeout(timer);
            timer = setTimeout(function(){ status.textContent = ""; }, 4000);
        }

        function persist(patch){
            var ok = M.settings.set(patch);
            say(ok
                ? "Saved."
                : "This browser is blocking storage, so this will be lost when you close the page.");
        }

        function pressed(btn, on){ btn.setAttribute("aria-pressed", String(on)); }

        /* Theme */
        var themeLight = $("themeLight");
        var themeDark = $("themeDark");

        function syncTheme(){
            var d = M.theme.isDark();
            pressed(themeLight, !d);
            pressed(themeDark, d);
        }

        themeLight.addEventListener("click", function(){ M.theme.set(false); });
        themeDark.addEventListener("click", function(){ M.theme.set(true); });
        document.addEventListener("m2v:theme", syncTheme);
        syncTheme();

        /* Tile size */
        var tileLg = $("tileLg");
        var tileXl = $("tileXl");

        function syncTiles(){
            var xl = M.settings.get().xl;
            pressed(tileLg, !xl);
            pressed(tileXl, xl);
        }

        tileLg.addEventListener("click", function(){ persist({xl:false}); syncTiles(); });
        tileXl.addEventListener("click", function(){ persist({xl:true}); syncTiles(); });
        syncTiles();

        /* Voice */
        var voiceSel = $("voice");
        var voiceNote = $("voiceNote");
        var hear = $("hear");

        function fillVoices(){
            var list = M.speech.voices();
            var current = M.settings.get().voice;

            voiceSel.innerHTML = "";

            var def = document.createElement("option");
            def.value = "";
            def.textContent = "Device default";
            voiceSel.appendChild(def);

            list.forEach(function(v){
                var o = document.createElement("option");
                o.value = v.voiceURI;
                o.textContent = v.name + " (" + v.lang + ")";
                voiceSel.appendChild(o);
            });

            voiceSel.value = current;
        }

        if (!M.speech.supported){
            voiceSel.disabled = true;
            hear.disabled = true;
            $("rate").disabled = true;
            voiceNote.textContent = "Speech is not available in this browser.";
        } else {
            fillVoices();

            try {
                speechSynthesis.addEventListener("voiceschanged", fillVoices);
            } catch(e){}
        }

        voiceSel.addEventListener("change", function(){
            persist({voice:voiceSel.value});
        });

        /* Speed */
        var rate = $("rate");
        var rateOut = $("rateOut");

        function showRate(){ rateOut.textContent = Number(rate.value).toFixed(2) + "×"; }

        rate.value = M.settings.get().rate;
        showRate();

        rate.addEventListener("input", function(){
            M.settings.set({rate:Number(rate.value)});
            showRate();
        });

        rate.addEventListener("change", function(){
            persist({rate:Number(rate.value)});
        });

        hear.addEventListener("click", function(){
            M.speech.speak("Hello. This is how I sound.", function(state){
                if (state === "error") say("Speech could not be played.");
            });
        });

        /* Speak on tap */
        var speakTap = $("speakTap");

        function syncSpeakTap(){
            var on = M.settings.get().speakOnTap;
            speakTap.setAttribute("aria-checked", String(on));
            speakTap.textContent = on ? "On" : "Off";
        }

        speakTap.addEventListener("click", function(){
            persist({speakOnTap:!M.settings.get().speakOnTap});
            syncSpeakTap();
        });

        syncSpeakTap();

        /* Saved phrases */
        var count = $("phraseCount");
        var ask = $("clearAsk");
        var confirmRow = $("clearConfirm");

        function saved(){
            var list = M.load("pb.custom", []);
            return Array.isArray(list) ? list : [];
        }

        function showCount(){
            var n = saved().length;
            count.textContent = n === 1
                ? "You have 1 saved phrase."
                : "You have " + n + " saved phrases.";
            ask.disabled = n === 0;
        }

        ask.addEventListener("click", function(){
            ask.hidden = true;
            confirmRow.hidden = false;
            $("clearYes").focus();
        });

        $("clearNo").addEventListener("click", function(){
            confirmRow.hidden = true;
            ask.hidden = false;
            ask.focus();
        });

        $("clearYes").addEventListener("click", function(){
            var ok = M.save("pb.custom", []);
            confirmRow.hidden = true;
            ask.hidden = false;
            showCount();
            say(ok ? "Saved phrases deleted." : "This browser is blocking storage.");
            ask.focus();
        });

        showCount();
    }

})();