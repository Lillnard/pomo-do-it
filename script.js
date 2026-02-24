(() => {
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));
    const nowISO = () => new Date().toISOString();
    const todayKey = () => new Date().toISOString().slice(0, 10);
    const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
    const pad2 = (n) => String(n).padStart(2, "0");
    const fmtMMSS = (sec) => `${pad2(Math.floor(sec / 60))}:${pad2(sec % 60)}`;
    const safeParse = (json, fallback) => { try { return JSON.parse(json); } catch { return fallback; } };
  
    const I18N = {
      pt: {
        brandSub: "Pomodoro inteligente para estudos",
        hubTitle: "Central",
        hubSubtitle: "Tudo organizado em abas pra caber bonito.",
        musicTitle: "Som e música",
        musicSubtitle: "Toca no foco, silencia na pausa. Com fade suave.",
        none: "(Nenhum)",
        user: "Minha música",
        white: "White noise",
        rain: "Chuva",
        ocean: "Oceano",
        forest: "Floresta",
        fire: "Lareira",
        cafe: "Café",
        stream: "Água corrente",
        play: "Play",
        pauseAmbient: "Pause",
        toastSaved: "Salvo ✨",
        toastAdded: "Tarefa adicionada 🍅",
        toastNeedName: "Dê um nome pra tarefa 🙂",
        toastNotifDenied: "Notificações bloqueadas no navegador",
        toastNotifOn: "Notificações ativadas 🔔",
        toastFocusEnd: "Foco finalizado! Hora de pausar.",
        toastBreakEnd: "Pausa finalizada! Volta pro foco.",
        toastLongEnd: "Pausa longa finalizada! Bora.",
        toastDistraction: "Distração registrada 👀",
        toastCsv: "CSV gerado ✅",
        toastResetAll: "Tudo resetado 🧼",
        toastHistoryCleared: "Histórico limpo 🧹",
        noTask: "(Sem tarefa)",
        dark: "Dark",
        light: "Light",
        soundOn: "On",
        soundOff: "Off",
        notifyOn: "Ativar",
        notifyOff: "Ativo",
        full: "Full",
        exitFull: "Exit",
        phaseFocus: "FOCO",
        phaseBreak: "PAUSA",
        phaseLong: "PAUSA LONGA",
      },
      en: {
        brandSub: "Smart Pomodoro for studying",
        hubTitle: "Hub",
        hubSubtitle: "Tabbed layout to keep everything neat.",
        musicTitle: "Sound & music",
        musicSubtitle: "Plays on focus, silent on breaks. Smooth fade.",
        none: "(None)",
        user: "My music",
        white: "White noise",
        rain: "Rain",
        ocean: "Ocean",
        forest: "Forest",
        fire: "Fireplace",
        cafe: "Cafe",
        stream: "Stream",
        play: "Play",
        pauseAmbient: "Pause",
        toastSaved: "Saved ✨",
        toastAdded: "Task added 🍅",
        toastNeedName: "Give your task a name 🙂",
        toastNotifDenied: "Notifications blocked by browser",
        toastNotifOn: "Notifications enabled 🔔",
        toastFocusEnd: "Focus finished! Break time.",
        toastBreakEnd: "Break finished! Back to focus.",
        toastLongEnd: "Long break finished! Let’s go.",
        toastDistraction: "Distraction logged 👀",
        toastCsv: "CSV created ✅",
        toastResetAll: "Everything reset 🧼",
        toastHistoryCleared: "History cleared 🧹",
        noTask: "(No task)",
        dark: "Dark",
        light: "Light",
        soundOn: "On",
        soundOff: "Off",
        notifyOn: "Enable",
        notifyOff: "Enabled",
        full: "Full",
        exitFull: "Exit",
        phaseFocus: "FOCUS",
        phaseBreak: "BREAK",
        phaseLong: "LONG BREAK",
      }
    };
  
    const LS_KEY = "focusflow_layout_audio_v1";
  
    const defaultState = () => ({
      settings: {
        lang: (navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en",
        theme: "dark",
        sound: true,            // beep timer + ping dinâmico
        notifications: false,
        auto: true
      },
      planner: {
        preset: "classic",
        focusMin: 25,
        breakMin: 5,
        longMin: 15,
        cycles: 4,
        goal: 4,
        sessionIntent: "",
        activeTaskId: ""
      },
      ambient: {
        playing: false,
        a: "white",
        b: "none",
        volume: 35,
        userName: "",
        focusOnly: true,
        fade: true,
        dynamicPing: true
      },
      timer: {
        phase: "focus",
        running: false,
        remainingSec: 25 * 60,
        totalSec: 25 * 60,
        cycleIndex: 1,
        pomosCompletedToday: 0,
        distractionsToday: 0,
        nextPingAtSec: 8 * 60
      },
      tasks: [],
      notes: [],
      history: []
    });
  
    function mergeDefaults(base, incoming) {
      const out = structuredClone(base);
      function merge(obj, inc) {
        for (const k of Object.keys(inc || {})) {
          if (inc[k] && typeof inc[k] === "object" && !Array.isArray(inc[k])) {
            obj[k] = obj[k] || {};
            merge(obj[k], inc[k]);
          } else obj[k] = inc[k];
        }
      }
      merge(out, incoming);
      return out;
    }
  
    let state = (() => {
      const raw = localStorage.getItem(LS_KEY);
      const st = raw ? safeParse(raw, defaultState()) : defaultState();
      return mergeDefaults(defaultState(), st);
    })();
  
    const saveState = () => localStorage.setItem(LS_KEY, JSON.stringify(state));
    const t9 = () => I18N[state.settings.lang] || I18N.pt;
  
    const el = {
      brandSub: $("#brandSub"),
  
      langToggle: $("#langToggle"),
      langLabel: $("#langLabel"),
  
      themeToggle: $("#themeToggle"),
      themeIcon: $("#themeIcon"),
      themeLabel: $("#themeLabel"),
  
      soundToggle: $("#soundToggle"),
      soundIcon: $("#soundIcon"),
      soundLabel: $("#soundLabel"),
  
      notifyBtn: $("#notifyBtn"),
      notifyLabel: $("#notifyLabel"),
  
      fullscreenBtn: $("#fullscreenBtn"),
      fsLabel: $("#fsLabel"),
  
      phaseBadge: $("#phaseBadge"),
      timeText: $("#timeText"),
      progressBar: $("#progressBar"),
      cycleNow: $("#cycleNow"),
      cycleTotal: $("#cycleTotal"),
      goalPomos: $("#goalPomos"),
      distractions: $("#distractions"),
  
      startBtn: $("#startBtn"),
      pauseBtn: $("#pauseBtn"),
      skipBtn: $("#skipBtn"),
      resetBtn: $("#resetBtn"),
  
      presetSelect: $("#presetSelect"),
      activeTaskSelect: $("#activeTaskSelect"),
      focusMin: $("#focusMin"),
      breakMin: $("#breakMin"),
      longMin: $("#longMin"),
      cyclesCount: $("#cyclesCount"),
      goalCount: $("#goalCount"),
      autoToggle: $("#autoToggle"),
      autoState: $("#autoState"),
      sessionIntent: $("#sessionIntent"),
      saveSessionBtn: $("#saveSessionBtn"),
  
      hubTitle: $("#hubTitle"),
      hubSubtitle: $("#hubSubtitle"),
      musicTitle: $("#musicTitle"),
      musicSubtitle: $("#musicSubtitle"),
  
      tabs: $$(".tab"),
      panes: {
        tasks: $("#pane-tasks"),
        stats: $("#pane-stats"),
        notes: $("#pane-notes"),
        history: $("#pane-history"),
      },
  
      taskName: $("#taskName"),
      taskEst: $("#taskEst"),
      addTaskBtn: $("#addTaskBtn"),
      taskList: $("#taskList"),
      tasksCountPill: $("#tasksCountPill"),
      clearDoneBtn: $("#clearDoneBtn"),
      seedBtn: $("#seedBtn"),
  
      focusToday: $("#focusToday"),
      pomosToday: $("#pomosToday"),
      streak: $("#streak"),
      bestHour: $("#bestHour"),
      bars7: $("#bars7"),
      exportCsvBtn: $("#exportCsvBtn"),
      printReportBtn: $("#printReportBtn"),
      resetAllBtn: $("#resetAllBtn"),
  
      noteText: $("#noteText"),
      saveNoteBtn: $("#saveNoteBtn"),
      clearNoteBtn: $("#clearNoteBtn"),
      notesList: $("#notesList"),
  
      historyList: $("#historyList"),
      clearHistoryBtn: $("#clearHistoryBtn"),
  
      ambientToggle: $("#ambientToggle"),
      ambientState: $("#ambientState"),
      ambientASelect: $("#ambientASelect"),
      ambientBSelect: $("#ambientBSelect"),
      ambientVolume: $("#ambientVolume"),
      ambientStopBtn: $("#ambientStopBtn"),
      userMusicFile: $("#userMusicFile"),
      clearUserMusicBtn: $("#clearUserMusicBtn"),
  
      focusOnlyToggle: $("#focusOnlyToggle"),
      fadeToggle: $("#fadeToggle"),
      dynamicPingToggle: $("#dynamicPingToggle"),
  
      toast: $("#toast"),
    };
  
    let toastTimer = null;
    function toast(msg) {
      el.toast.textContent = msg;
      el.toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => el.toast.classList.remove("show"), 1800);
    }
  
    // Theme + lang
    function applyTheme() {
      document.documentElement.dataset.theme = state.settings.theme === "light" ? "light" : "dark";
      const t = t9();
      el.themeIcon.textContent = state.settings.theme === "light" ? "☀️" : "🌙";
      el.themeLabel.textContent = state.settings.theme === "light" ? t.light : t.dark;
    }
  
    function applyLang() {
      const t = t9();
      el.langLabel.textContent = state.settings.lang.toUpperCase();
      el.brandSub.textContent = t.brandSub;
      el.hubTitle.textContent = t.hubTitle;
      el.hubSubtitle.textContent = t.hubSubtitle;
      el.musicTitle.textContent = t.musicTitle;
      el.musicSubtitle.textContent = t.musicSubtitle;
  
      renderAmbientOptions();
      renderAmbient();
      renderTimer();
    }
  
    // Notifications
    function notify(title, body) {
      if (!state.settings.notifications) return;
      if (!("Notification" in window)) return;
      if (Notification.permission !== "granted") return;
      try { new Notification(title, { body }); } catch {}
    }
  
    // AudioContext for beeps and ping
    let audioCtx = null;
    function ensureAudioContext() {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      return audioCtx;
    }
  
    function beep(kind = "soft") {
      if (!state.settings.sound) return;
      try {
        const ctx = ensureAudioContext();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        const t0 = ctx.currentTime;
  
        const pattern = kind === "endFocus"
          ? [660, 880, 660]
          : kind === "endBreak"
          ? [880, 660]
          : [660];
  
        let time = t0;
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.12, time + 0.02);
  
        o.connect(g);
        g.connect(ctx.destination);
  
        o.frequency.setValueAtTime(pattern[0], time);
        for (let i = 1; i < pattern.length; i++) {
          time += 0.14;
          o.frequency.setValueAtTime(pattern[i], time);
        }
        g.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);
        o.start(t0);
        o.stop(time + 0.25);
      } catch {}
    }
  
    // Ping suave a cada 8 min (FOCO)
    function focusPing() {
      if (!state.ambient.dynamicPing) return;
      if (!state.settings.sound) return;
      try {
        const ctx = ensureAudioContext();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const t0 = ctx.currentTime;
  
        o.type = "sine";
        o.frequency.setValueAtTime(880, t0);
        o.frequency.exponentialRampToValueAtTime(330, t0 + 0.18);
  
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.06, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
  
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t0);
        o.stop(t0 + 0.25);
      } catch {}
    }
  
    // Tabs hub
    el.tabs.forEach(btn => {
      btn.addEventListener("click", () => {
        el.tabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const key = btn.dataset.tab;
        Object.entries(el.panes).forEach(([k, pane]) => pane.classList.toggle("active", k === key));
      });
    });
  
    // Toggles top
    el.langToggle.addEventListener("click", () => {
      state.settings.lang = state.settings.lang === "pt" ? "en" : "pt";
      saveState();
      applyLang();
      renderAll();
    });
  
    el.themeToggle.addEventListener("click", () => {
      state.settings.theme = state.settings.theme === "light" ? "dark" : "light";
      saveState();
      applyTheme();
    });
  
    el.soundToggle.addEventListener("click", () => {
      const t = t9();
      state.settings.sound = !state.settings.sound;
      saveState();
      el.soundIcon.textContent = state.settings.sound ? "🔊" : "🔇";
      el.soundLabel.textContent = state.settings.sound ? t.soundOn : t.soundOff;
    });
  
    el.notifyBtn.addEventListener("click", async () => {
      const t = t9();
      if (!("Notification" in window)) { toast(t.toastNotifDenied); return; }
  
      if (Notification.permission === "granted") {
        state.settings.notifications = !state.settings.notifications;
        saveState();
        el.notifyLabel.textContent = state.settings.notifications ? t.notifyOff : t.notifyOn;
        toast(state.settings.notifications ? t.toastNotifOn : t.toastSaved);
        return;
      }
  
      const res = await Notification.requestPermission();
      if (res === "granted") {
        state.settings.notifications = true;
        saveState();
        el.notifyLabel.textContent = t.notifyOff;
        toast(t.toastNotifOn);
      } else toast(t.toastNotifDenied);
    });
  
    el.fullscreenBtn.addEventListener("click", async () => {
      const t = t9();
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
        el.fsLabel.textContent = document.fullscreenElement ? t.exitFull : t.full;
      } catch {}
    });
    document.addEventListener("fullscreenchange", () => {
      const t = t9();
      el.fsLabel.textContent = document.fullscreenElement ? t.exitFull : t.full;
    });
  
    // -------- TIMER ----------
    const presets = {
      classic: { focus: 25, brk: 5, lng: 15, cycles: 4, goal: 4 },
      deep:    { focus: 50, brk: 10, lng: 20, cycles: 4, goal: 4 },
      sprint:  { focus: 15, brk: 3, lng: 10, cycles: 6, goal: 6 },
    };
  
    function phaseLabel(phase) {
      const t = t9();
      if (phase === "focus") return t.phaseFocus;
      if (phase === "break") return t.phaseBreak;
      return t.phaseLong;
    }
  
    function phaseSeconds(phase) {
      if (phase === "focus") return state.planner.focusMin * 60;
      if (phase === "break") return state.planner.breakMin * 60;
      return state.planner.longMin * 60;
    }
  
    let tickHandle = null;
    let lastTick = null;
  
    function resetTimerTo(phase) {
      state.timer.phase = phase;
      state.timer.remainingSec = phaseSeconds(phase);
      state.timer.totalSec = phaseSeconds(phase);
      state.timer.running = false;
      state.timer.nextPingAtSec = 8 * 60;
      lastTick = null;
      if (tickHandle) { clearInterval(tickHandle); tickHandle = null; }
      saveState();
      renderAll();
      syncAmbientWithFocusState(); // garante silêncio/padrão
    }
  
    function startTick() {
      if (tickHandle) return;
      lastTick = Date.now();
      tickHandle = setInterval(async () => {
        if (!state.timer.running) return;
  
        const now = Date.now();
        const dt = Math.floor((now - lastTick) / 1000);
        if (dt <= 0) return;
        lastTick = now;
  
        state.timer.remainingSec = Math.max(0, state.timer.remainingSec - dt);
  
        // ping dinâmico no foco
        if (state.timer.phase === "focus" && state.timer.running && state.ambient.dynamicPing) {
          const elapsed = state.timer.totalSec - state.timer.remainingSec;
          if (elapsed >= state.timer.nextPingAtSec) {
            focusPing();
            state.timer.nextPingAtSec += 8 * 60;
          }
        }
  
        if (state.timer.remainingSec <= 0) await onPhaseEnd();
  
        saveState();
        renderTimer();
      }, 250);
    }
  
    async function toggleRun(run) {
      state.timer.running = run;
      if (run) startTick();
      saveState();
      renderTimer();
      await syncAmbientWithFocusState();
    }
  
    function getActiveTask() {
      const id = state.planner.activeTaskId;
      if (!id) return null;
      return state.tasks.find(t => t.id === id) || null;
    }
  
    async function onPhaseEnd() {
      const t = t9();
      const endedPhase = state.timer.phase;
  
      const minutes = Math.round(state.timer.totalSec / 60);
      const task = getActiveTask();
      const taskName = task ? task.name : t.noTask;
  
      const completedFocus = endedPhase === "focus";
      state.history.unshift({
        id: crypto.randomUUID(),
        tsISO: nowISO(),
        phase: endedPhase,
        minutes,
        taskId: task ? task.id : "",
        taskName,
        intent: state.planner.sessionIntent || "",
        cycleIndex: state.timer.cycleIndex,
        preset: state.planner.preset,
        completedFocus
      });
  
      if (completedFocus) {
        state.timer.pomosCompletedToday += 1;
        if (task) {
          task.done = clamp((task.done || 0) + 1, 0, task.est);
          if (task.done >= task.est) task.completed = true;
        }
        beep("endFocus");
        toast(t.toastFocusEnd);
        notify("🍅 FocusFlow", t.toastFocusEnd);
      } else {
        beep("endBreak");
        if (endedPhase === "long") {
          toast(t.toastLongEnd);
          notify("🍅 FocusFlow", t.toastLongEnd);
        } else {
          toast(t.toastBreakEnd);
          notify("🍅 FocusFlow", t.toastBreakEnd);
        }
      }
  
      if (endedPhase === "focus") {
        const isEndOfCycle = state.timer.cycleIndex >= state.planner.cycles;
        state.timer.phase = isEndOfCycle ? "long" : "break";
      } else {
        if (endedPhase === "long") state.timer.cycleIndex = 1;
        else state.timer.cycleIndex = clamp(state.timer.cycleIndex + 1, 1, 99);
        state.timer.phase = "focus";
        state.timer.nextPingAtSec = 8 * 60;
      }
  
      state.timer.totalSec = phaseSeconds(state.timer.phase);
      state.timer.remainingSec = state.timer.totalSec;
  
      if (!state.settings.auto) state.timer.running = false;
  
      saveState();
      renderAll();
      await syncAmbientWithFocusState();
    }
  
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && state.timer.running && state.timer.phase === "focus") {
        state.timer.distractionsToday += 1;
        saveState();
        renderTimer();
        toast(t9().toastDistraction);
      }
    });
  
    function renderTimer() {
      el.timeText.textContent = fmtMMSS(state.timer.remainingSec);
      const pct = state.timer.totalSec > 0 ? (1 - (state.timer.remainingSec / state.timer.totalSec)) * 100 : 0;
      el.progressBar.style.width = `${clamp(pct, 0, 100)}%`;
  
      el.phaseBadge.textContent = phaseLabel(state.timer.phase);
      el.cycleNow.textContent = state.timer.cycleIndex;
      el.cycleTotal.textContent = state.planner.cycles;
      el.goalPomos.textContent = state.planner.goal;
      el.distractions.textContent = state.timer.distractionsToday;
  
      el.startBtn.disabled = state.timer.running;
      el.pauseBtn.disabled = !state.timer.running;
    }
  
    function syncPlannerInputs() {
      el.presetSelect.value = state.planner.preset;
      el.focusMin.value = state.planner.focusMin;
      el.breakMin.value = state.planner.breakMin;
      el.longMin.value = state.planner.longMin;
      el.cyclesCount.value = state.planner.cycles;
      el.goalCount.value = state.planner.goal;
      el.sessionIntent.value = state.planner.sessionIntent || "";
      el.autoState.textContent = state.settings.auto ? "On" : "Off";
    }
  
    // Planner events
    el.presetSelect.addEventListener("change", () => {
      const v = el.presetSelect.value;
      state.planner.preset = v;
  
      if (presets[v]) {
        state.planner.focusMin = presets[v].focus;
        state.planner.breakMin = presets[v].brk;
        state.planner.longMin = presets[v].lng;
        state.planner.cycles = presets[v].cycles;
        state.planner.goal = presets[v].goal;
        resetTimerTo("focus");
      }
      saveState();
      renderAll();
    });
  
    function onPlannerChange() {
      state.planner.focusMin = clamp(parseInt(el.focusMin.value || 25, 10), 5, 120);
      state.planner.breakMin = clamp(parseInt(el.breakMin.value || 5, 10), 1, 60);
      state.planner.longMin = clamp(parseInt(el.longMin.value || 15, 10), 5, 60);
      state.planner.cycles = clamp(parseInt(el.cyclesCount.value || 4, 10), 1, 12);
      state.planner.goal = clamp(parseInt(el.goalCount.value || 4, 10), 1, 24);
      state.planner.preset = "custom";
      el.presetSelect.value = "custom";
      if (!state.timer.running) resetTimerTo(state.timer.phase);
      saveState();
      renderAll();
    }
    [el.focusMin, el.breakMin, el.longMin, el.cyclesCount, el.goalCount].forEach(inp => inp.addEventListener("change", onPlannerChange));
  
    el.autoToggle.addEventListener("click", () => {
      state.settings.auto = !state.settings.auto;
      saveState();
      renderAll();
    });
  
    el.saveSessionBtn.addEventListener("click", () => {
      state.planner.sessionIntent = (el.sessionIntent.value || "").trim();
      saveState();
      toast(t9().toastSaved);
    });
  
    el.activeTaskSelect.addEventListener("change", () => {
      state.planner.activeTaskId = el.activeTaskSelect.value || "";
      saveState();
      renderAll();
    });
  
    el.startBtn.addEventListener("click", () => toggleRun(true));
    el.pauseBtn.addEventListener("click", () => toggleRun(false));
    el.skipBtn.addEventListener("click", async () => { state.timer.remainingSec = 0; await onPhaseEnd(); });
    el.resetBtn.addEventListener("click", () => resetTimerTo(state.timer.phase));
  
    // -------- TASKS / NOTES / HISTORY ----------
    function escapeHTML(s) {
      return String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
  
    function addTask(name, est) {
      const t = t9();
      const clean = (name || "").trim();
      if (!clean) { toast(t.toastNeedName); return; }
  
      const task = {
        id: crypto.randomUUID(),
        name: clean,
        est: clamp(parseInt(est || 1, 10), 1, 24),
        done: 0,
        completed: false,
        createdAtISO: nowISO()
      };
      state.tasks.unshift(task);
      if (!state.planner.activeTaskId) state.planner.activeTaskId = task.id;
  
      saveState();
      toast(t.toastAdded);
      renderAll();
    }
  
    function clearDoneTasks() {
      state.tasks = state.tasks.filter(t => !t.completed);
      if (state.planner.activeTaskId && !state.tasks.some(t => t.id === state.planner.activeTaskId)) {
        state.planner.activeTaskId = "";
      }
      saveState();
      renderAll();
    }
  
    function seedTasks() {
      const sample = state.settings.lang === "pt"
        ? [["Matemática: funções", 4], ["Português: interpretação", 3], ["Programação: JS DOM", 5]]
        : [["Math: functions", 4], ["Reading: comprehension", 3], ["Programming: JS DOM", 5]];
      for (const [n, e] of sample) addTask(n, e);
    }
  
    function renderTasks() {
      el.tasksCountPill.textContent = state.tasks.length;
      el.taskList.innerHTML = "";
  
      for (const tsk of state.tasks) {
        const pct = Math.round(((tsk.done || 0) / tsk.est) * 100);
        const div = document.createElement("div");
        div.className = "task";
  
        div.innerHTML = `
          <div class="task-left">
            <div class="task-name">${escapeHTML(tsk.name)}</div>
            <div class="task-meta">
              <span>🍅 ${tsk.done || 0}/${tsk.est}</span>
              <span>${tsk.completed ? "✅" : "⏳"}</span>
            </div>
            <div class="pbar"><div style="width:${clamp(pct,0,100)}%"></div></div>
          </div>
          <div class="task-right">
            <button class="iconbtn" data-act="set" title="Definir ativa">🎯</button>
            <button class="iconbtn" data-act="plus" title="+1 pomodoro">+1</button>
            <button class="iconbtn" data-act="del" title="Remover">✕</button>
          </div>
        `;
  
        div.querySelector('[data-act="set"]').addEventListener("click", () => {
          state.planner.activeTaskId = tsk.id;
          saveState();
          renderAll();
        });
        div.querySelector('[data-act="plus"]').addEventListener("click", () => {
          tsk.done = clamp((tsk.done || 0) + 1, 0, tsk.est);
          tsk.completed = tsk.done >= tsk.est;
          saveState();
          toast(t9().toastSaved);
          renderAll();
        });
        div.querySelector('[data-act="del"]').addEventListener("click", () => {
          state.tasks = state.tasks.filter(x => x.id !== tsk.id);
          if (state.planner.activeTaskId === tsk.id) state.planner.activeTaskId = "";
          saveState();
          renderAll();
        });
  
        if (state.planner.activeTaskId === tsk.id) {
          div.style.borderColor = "rgba(140,246,255,0.40)";
          div.style.background = "rgba(140,246,255,0.08)";
        }
  
        el.taskList.appendChild(div);
      }
    }
  
    function renderActiveTaskSelect() {
      const t = t9();
      el.activeTaskSelect.innerHTML = "";
      const opt0 = document.createElement("option");
      opt0.value = "";
      opt0.textContent = t.noTask;
      el.activeTaskSelect.appendChild(opt0);
  
      for (const tsk of state.tasks) {
        const opt = document.createElement("option");
        opt.value = tsk.id;
        opt.textContent = `${tsk.name} (${tsk.done || 0}/${tsk.est})`;
        el.activeTaskSelect.appendChild(opt);
      }
      el.activeTaskSelect.value = state.planner.activeTaskId || "";
    }
  
    function saveNote(text) {
      const clean = (text || "").trim();
      if (!clean) return;
      const task = getActiveTask();
      state.notes.unshift({
        id: crypto.randomUUID(),
        tsISO: nowISO(),
        text: clean,
        taskId: task?.id || "",
        taskName: task?.name || "",
        intent: state.planner.sessionIntent || ""
      });
      saveState();
      toast(t9().toastSaved);
      renderNotes();
    }
  
    function renderNotes() {
      el.notesList.innerHTML = "";
      const show = state.notes.slice(0, 30);
      for (const n of show) {
        const div = document.createElement("div");
        div.className = "item";
        const when = new Date(n.tsISO).toLocaleString();
        div.innerHTML = `
          <div class="item-top">
            <div class="item-title">${escapeHTML(n.taskName || "Note")}</div>
            <div><span class="tag good">${escapeHTML(when)}</span></div>
          </div>
          <div class="item-meta"><span>${escapeHTML(n.intent || "")}</span></div>
          <div style="margin-top:8px; font-weight:800; font-size:12px; line-height:1.35;">
            ${escapeHTML(n.text)}
          </div>
        `;
        el.notesList.appendChild(div);
      }
    }
  
    function renderHistory() {
      el.historyList.innerHTML = "";
      const show = state.history.slice(0, 40);
      for (const h of show) {
        const div = document.createElement("div");
        div.className = "item";
        const when = new Date(h.tsISO).toLocaleString();
        div.innerHTML = `
          <div class="item-top">
            <div class="item-title">${escapeHTML(h.taskName || "")}</div>
            <div><span class="tag warn">${escapeHTML(h.phase)} • ${h.minutes}m</span></div>
          </div>
          <div class="item-meta">
            <span>${escapeHTML(when)}</span>
            <span>🔁 ${h.cycleIndex}</span>
            <span>🎛 ${escapeHTML(h.preset)}</span>
          </div>
          <div style="margin-top:8px; font-size:12px; color: var(--muted); font-weight:800;">
            ${escapeHTML(h.intent || "")}
          </div>
        `;
        el.historyList.appendChild(div);
      }
    }
  
    // Stats
    const dayOf = (iso) => iso.slice(0, 10);
    const hourOf = (iso) => new Date(iso).getHours();
  
    function computeToday() {
      const d = todayKey();
      const focusLogs = state.history.filter(h => h.completedFocus && dayOf(h.tsISO) === d);
      const pomos = focusLogs.length;
      const minutes = focusLogs.reduce((a, b) => a + (b.minutes || 0), 0);
      return { pomos, minutes };
    }
  
    function computeStreak() {
      const daysWithPomos = new Set(state.history.filter(h => h.completedFocus).map(h => dayOf(h.tsISO)));
      let streak = 0;
      let d = new Date();
      while (true) {
        const k = d.toISOString().slice(0, 10);
        if (!daysWithPomos.has(k)) break;
        streak += 1;
        d.setDate(d.getDate() - 1);
      }
      return streak;
    }
  
    function computeBestHour() {
      const counts = Array.from({ length: 24 }, () => 0);
      for (const h of state.history) if (h.completedFocus) counts[hourOf(h.tsISO)] += 1;
      const max = Math.max(...counts);
      if (max <= 0) return "--";
      return `${pad2(counts.indexOf(max))}:00`;
    }
  
    function last7DaysBars() {
      const days = [];
      const d = new Date();
      for (let i = 6; i >= 0; i--) {
        const dd = new Date(d);
        dd.setDate(d.getDate() - i);
        days.push(dd.toISOString().slice(0, 10));
      }
      const pomosByDay = new Map(days.map(k => [k, 0]));
      for (const h of state.history) {
        if (!h.completedFocus) continue;
        const k = dayOf(h.tsISO);
        if (pomosByDay.has(k)) pomosByDay.set(k, pomosByDay.get(k) + 1);
      }
      return days.map(k => ({ day: k.slice(5).replace("-", "/"), val: pomosByDay.get(k) || 0 }));
    }
  
    function renderStats() {
      const today = computeToday();
      el.focusToday.textContent = today.minutes;
      el.pomosToday.textContent = today.pomos;
      el.streak.textContent = computeStreak();
      el.bestHour.textContent = computeBestHour();
  
      const bars = last7DaysBars();
      const max = Math.max(1, ...bars.map(b => b.val));
      el.bars7.innerHTML = bars.map(b => {
        const h = Math.round((b.val / max) * 100);
        return `
          <div class="bar" title="${b.day}: ${b.val}">
            <div style="height:${clamp(h, 8, 100)}%"></div>
            <label>${b.day}</label>
          </div>
        `;
      }).join("");
    }
  
    function exportCSV() {
      const headers = ["timestamp","phase","minutes","task","intent","cycleIndex","preset"];
      const rows = state.history.map(h => ([
        h.tsISO, h.phase, h.minutes, (h.taskName || "").replaceAll('"','""'),
        (h.intent || "").replaceAll('"','""'), h.cycleIndex, h.preset
      ]));
      const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${String(v ?? "")}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `focusflow_history_${todayKey()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast(t9().toastCsv);
    }
  
    function printReport() {
      const today = computeToday();
      const streak = computeStreak();
      const bestHour = computeBestHour();
      const html = `
        <style>
          body{ font-family: ui-sans-serif, system-ui; margin: 26px; color:#111; }
          h1{ margin:0; font-size:20px; }
          .sub{ margin-top:4px; color:#555; font-size:12px; }
          .grid{ margin-top:16px; display:grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
          .box{ border:1px solid #ddd; border-radius: 12px; padding: 12px; }
          .k{ color:#666; font-size: 11px; font-weight: 800; }
          .v{ font-size: 18px; font-weight: 900; margin-top: 6px; }
        </style>
        <h1>FocusFlow Report</h1>
        <div class="sub">${todayKey()}</div>
        <div class="grid">
          <div class="box"><div class="k">Focus today</div><div class="v">${today.minutes} min</div></div>
          <div class="box"><div class="k">Pomodoros today</div><div class="v">${today.pomos}</div></div>
          <div class="box"><div class="k">Streak</div><div class="v">${streak}</div></div>
          <div class="box"><div class="k">Best hour</div><div class="v">${bestHour}</div></div>
        </div>
        <div class="sub" style="margin-top:14px;">Generated locally (LocalStorage)</div>
      `;
      const w = window.open("", "_blank");
      if (!w) return;
      w.document.open();
      w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Report</title></head><body>${html}</body></html>`);
      w.document.close();
      w.focus();
      w.print();
    }
  
    // Buttons hub
    el.addTaskBtn.addEventListener("click", () => { addTask(el.taskName.value, el.taskEst.value); el.taskName.value = ""; });
    el.taskName.addEventListener("keydown", (e) => { if (e.key === "Enter") { addTask(el.taskName.value, el.taskEst.value); el.taskName.value = ""; } });
    el.clearDoneBtn.addEventListener("click", clearDoneTasks);
    el.seedBtn.addEventListener("click", seedTasks);
  
    el.saveNoteBtn.addEventListener("click", () => { saveNote(el.noteText.value); el.noteText.value = ""; });
    el.clearNoteBtn.addEventListener("click", () => { el.noteText.value = ""; });
  
    el.clearHistoryBtn.addEventListener("click", () => {
      state.history = [];
      saveState();
      toast(t9().toastHistoryCleared);
      renderHistory();
      renderStats();
    });
  
    el.exportCsvBtn.addEventListener("click", exportCSV);
    el.printReportBtn.addEventListener("click", printReport);
  
    el.resetAllBtn.addEventListener("click", () => {
      state = defaultState();
      saveState();
      applyTheme();
      applyLang();
      toast(t9().toastResetAll);
      renderAll();
      // por padrão, não tenta autoplay
      state.ambient.playing = false;
      saveState();
      renderAmbient();
    });
  
    // -------- AUDIO AMBIENT (fade + focusOnly + mix) ----------
    const AMBIENT_FILES = {
      rain:   "audio/rain.mp3",
      ocean:  "audio/ocean.mp3",
      forest: "audio/forest.mp3",
      fire:   "audio/fireplace.mp3",
      cafe:   "audio/cafe.mp3",
      stream: "audio/stream.mp3"
    };
  
    const aPlayer = new Audio();
    const bPlayer = new Audio();
    const userPlayer = new Audio();
    aPlayer.loop = true;
    bPlayer.loop = true;
    userPlayer.loop = true;
  
    let noiseNode = null;
    let noiseGain = null;
  
    let fadeMul = 0;
    let fadeRAF = null;
  
    const baseVol01 = () => clamp((state.ambient.volume || 35) / 100, 0, 1);
  
    function setEffectiveVolume(mult) {
      fadeMul = clamp(mult, 0, 1);
      const v = baseVol01() * fadeMul;
      aPlayer.volume = v;
      bPlayer.volume = v;
      userPlayer.volume = v;
      if (noiseGain) noiseGain.gain.value = v * 0.65;
    }
  
    function stopWhiteNoise() {
      if (noiseNode) {
        try { noiseNode.stop(); } catch {}
        noiseNode = null;
      }
      if (noiseGain) {
        try { noiseGain.disconnect(); } catch {}
        noiseGain = null;
      }
    }
  
    function startWhiteNoise() {
      const ctx = ensureAudioContext();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.9;
  
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
  
      const g = ctx.createGain();
      g.gain.value = (baseVol01() * fadeMul) * 0.65;
  
      src.connect(g);
      g.connect(ctx.destination);
  
      src.start();
      noiseNode = src;
      noiseGain = g;
    }
  
    function stopAllAmbientSources() {
      aPlayer.pause(); bPlayer.pause(); userPlayer.pause();
      aPlayer.currentTime = 0; bPlayer.currentTime = 0; userPlayer.currentTime = 0;
      stopWhiteNoise();
    }
  
    function setPlayerSourceByKey(player, key) {
      if (key === "none" || key === "white" || key === "user") {
        player.pause();
        player.src = "";
        return;
      }
      player.src = AMBIENT_FILES[key] || "";
    }
  
    async function playKey(key, which) {
      if (key === "none") return;
  
      if (key === "white") {
        if (!noiseNode) startWhiteNoise();
        return;
      }
  
      if (key === "user") {
        if (!userPlayer.src) return;
        try { await userPlayer.play(); } catch {}
        return;
      }
  
      const player = which === "A" ? aPlayer : bPlayer;
      setPlayerSourceByKey(player, key);
      if (player.src) {
        try { await player.play(); } catch {}
      }
    }
  
    function fadeTo(target, ms = 480) {
      if (!state.ambient.fade) {
        setEffectiveVolume(target);
        return Promise.resolve();
      }
      if (fadeRAF) cancelAnimationFrame(fadeRAF);
  
      return new Promise((resolve) => {
        const start = performance.now();
        const from = fadeMul;
        const to = clamp(target, 0, 1);
  
        const step = (t) => {
          const k = clamp((t - start) / ms, 0, 1);
          const eased = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          setEffectiveVolume(from + (to - from) * eased);
          if (k < 1) fadeRAF = requestAnimationFrame(step);
          else resolve();
        };
        fadeRAF = requestAnimationFrame(step);
      });
    }
  
    async function startAmbientInternal() {
      stopAllAmbientSources();
      setEffectiveVolume(0);
  
      await playKey(state.ambient.a, "A");
      await playKey(state.ambient.b, "B");
  
      state.ambient.playing = true;
      saveState();
      renderAmbient();
  
      await fadeTo(1, 520);
    }
  
    async function stopAmbientInternal() {
      await fadeTo(0, 420);
      stopAllAmbientSources();
      state.ambient.playing = false;
      saveState();
      renderAmbient();
    }
  
    async function toggleAmbientManual() {
      // garante desbloqueio de áudio pelo gesto
      try { ensureAudioContext(); } catch {}
      if (state.ambient.playing) await stopAmbientInternal();
      else await startAmbientInternal();
    }
  
    async function syncAmbientWithFocusState() {
      if (!state.ambient.focusOnly) return;
  
      const shouldPlay = (state.timer.phase === "focus") && state.timer.running;
      if (shouldPlay && !state.ambient.playing) {
        await startAmbientInternal();
        return;
      }
      if (!shouldPlay && state.ambient.playing) {
        await stopAmbientInternal();
        return;
      }
    }
  
    function renderAmbientOptions() {
      const t = t9();
      const options = [
        { v: "none",  label: t.none },
        { v: "white", label: t.white },
        { v: "rain",  label: t.rain },
        { v: "ocean", label: t.ocean },
        { v: "stream",label: t.stream },
        { v: "forest",label: t.forest },
        { v: "fire",  label: t.fire },
        { v: "cafe",  label: t.cafe },
        { v: "user",  label: t.user + (state.ambient.userName ? ` (${state.ambient.userName})` : "") },
      ];
  
      const build = (sel, current) => {
        sel.innerHTML = "";
        for (const o of options) {
          const opt = document.createElement("option");
          opt.value = o.v;
          opt.textContent = o.label;
          sel.appendChild(opt);
        }
        sel.value = current || "none";
      };
  
      build(el.ambientASelect, state.ambient.a);
      build(el.ambientBSelect, state.ambient.b);
      el.ambientVolume.value = String(state.ambient.volume ?? 35);
  
      el.focusOnlyToggle.checked = !!state.ambient.focusOnly;
      el.fadeToggle.checked = !!state.ambient.fade;
      el.dynamicPingToggle.checked = !!state.ambient.dynamicPing;
    }
  
    function renderAmbient() {
      const t = t9();
      el.ambientState.textContent = state.ambient.playing ? t.pauseAmbient : t.play;
    }
  
    // Ambient events
    el.ambientToggle.addEventListener("click", async () => {
      await toggleAmbientManual();
    });
  
    el.ambientStopBtn.addEventListener("click", async () => {
      await stopAmbientInternal();
    });
  
    el.ambientASelect.addEventListener("change", async () => {
      state.ambient.a = el.ambientASelect.value;
      saveState();
      renderAmbientOptions();
      if (state.ambient.playing) await startAmbientInternal();
      await syncAmbientWithFocusState();
    });
  
    el.ambientBSelect.addEventListener("change", async () => {
      state.ambient.b = el.ambientBSelect.value;
      saveState();
      renderAmbientOptions();
      if (state.ambient.playing) await startAmbientInternal();
      await syncAmbientWithFocusState();
    });
  
    el.ambientVolume.addEventListener("input", () => {
      state.ambient.volume = parseInt(el.ambientVolume.value || "35", 10);
      saveState();
      setEffectiveVolume(fadeMul);
    });
  
    el.focusOnlyToggle.addEventListener("change", async () => {
      state.ambient.focusOnly = !!el.focusOnlyToggle.checked;
      saveState();
      await syncAmbientWithFocusState();
    });
  
    el.fadeToggle.addEventListener("change", () => {
      state.ambient.fade = !!el.fadeToggle.checked;
      saveState();
    });
  
    el.dynamicPingToggle.addEventListener("change", () => {
      state.ambient.dynamicPing = !!el.dynamicPingToggle.checked;
      saveState();
    });
  
    // Upload do usuário
    let userMusicObjectURL = null;
    el.userMusicFile.addEventListener("change", async () => {
      const file = el.userMusicFile.files?.[0];
      if (!file) return;
  
      if (userMusicObjectURL) URL.revokeObjectURL(userMusicObjectURL);
      userMusicObjectURL = URL.createObjectURL(file);
      userPlayer.src = userMusicObjectURL;
  
      state.ambient.userName = file.name;
      saveState();
      renderAmbientOptions();
      toast(t9().toastSaved);
  
      if (state.ambient.playing && (state.ambient.a === "user" || state.ambient.b === "user")) {
        await startAmbientInternal();
        await syncAmbientWithFocusState();
      }
    });
  
    el.clearUserMusicBtn.addEventListener("click", async () => {
      userPlayer.pause();
      userPlayer.src = "";
      if (userMusicObjectURL) {
        URL.revokeObjectURL(userMusicObjectURL);
        userMusicObjectURL = null;
      }
  
      if (state.ambient.a === "user") state.ambient.a = "none";
      if (state.ambient.b === "user") state.ambient.b = "none";
  
      state.ambient.userName = "";
      el.userMusicFile.value = "";
      saveState();
  
      renderAmbientOptions();
      toast(t9().toastSaved);
  
      if (state.ambient.playing) {
        await startAmbientInternal();
        await syncAmbientWithFocusState();
      }
    });
  
    // -------- Render all ----------
    function renderAll() {
      syncPlannerInputs();
      renderActiveTaskSelect();
      renderTimer();
      renderTasks();
      renderStats();
      renderNotes();
      renderHistory();
      renderAmbientOptions();
      renderAmbient();
    }
  
    // Init top UI (labels)
    function initTopUI() {
      const t = t9();
      el.soundIcon.textContent = state.settings.sound ? "🔊" : "🔇";
      el.soundLabel.textContent = state.settings.sound ? t.soundOn : t.soundOff;
      el.notifyLabel.textContent = state.settings.notifications ? t.notifyOff : t.notifyOn;
      el.fsLabel.textContent = document.fullscreenElement ? t.exitFull : t.full;
    }
  
    function initDailyCounters() {
      // recalcula pomos do dia baseado no histórico
      const today = computeToday();
      state.timer.pomosCompletedToday = today.pomos;
      state.timer.distractionsToday = state.timer.distractionsToday || 0;
      saveState();
    }
  
    function init() {
      applyTheme();
      applyLang();
      initTopUI();
      initDailyCounters();
  
      const expected = phaseSeconds(state.timer.phase);
      if (!state.timer.totalSec || state.timer.totalSec < 10) state.timer.totalSec = expected;
      if (!state.timer.remainingSec || state.timer.remainingSec > state.timer.totalSec) state.timer.remainingSec = state.timer.totalSec;
  
      // não tentar autoplay após refresh (browser bloqueia)
      state.ambient.playing = false;
      saveState();
  
      renderAll();
      if (state.timer.running) startTick();
    }
  
    init();
  })();