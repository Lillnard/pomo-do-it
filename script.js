/* FocusFlow • Pomodoro (HTML/CSS/JS puro)
   Recursos:
   - Timer com presets + custom
   - Auto-run (foco -> pausa -> foco)
   - Tarefas com estimativa + progresso por pomodoros
   - Plano de sessão
   - Notas rápidas + notas automáticas ao fim do foco (opcional via prompt no toast)
   - Histórico + stats + streak + melhor hora
   - Contador de distrações (troca de aba durante foco)
   - Notificações + som
   - Tela cheia
   - Tema + PT/EN
   - Export CSV + relatório para imprimir/salvar PDF
   - Persistência via LocalStorage
*/

(() => {
    // ---------- Helpers ----------
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  
    const nowISO = () => new Date().toISOString();
    const todayKey = () => new Date().toISOString().slice(0, 10);
  
    const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
    const pad2 = (n) => String(n).padStart(2, "0");
    const fmtMMSS = (sec) => `${pad2(Math.floor(sec / 60))}:${pad2(sec % 60)}`;
  
    function safeParse(json, fallback) {
      try { return JSON.parse(json); } catch { return fallback; }
    }
  
    // ---------- i18n ----------
    const I18N = {
      pt: {
        brandSub: "Pomodoro inteligente para estudos",
        timerTitle: "Sessão",
        timerSubtitle: "Planeje, foque e registre. Sem drama.",
        tasksTitle: "Tarefas",
        tasksSubtitle: "Cada tarefa pede um certo número de 🍅.",
        insightsTitle: "Painel",
        insightsSubtitle: "Seu foco, virando dados e memória.",
        presetLabel: "Preset",
        taskLinkLabel: "Tarefa ativa",
        focusLabel: "Foco (min)",
        breakLabel: "Pausa (min)",
        longLabel: "Longa (min)",
        cyclesLabel: "Ciclos",
        goalLabel: "Meta 🍅",
        autoLabel: "Auto",
        sessionIntentLabel: "Plano da sessão (1 frase)",
        miniCyclesK: "Ciclos",
        miniFocusK: "Meta",
        miniDistrK: "Distrações",
        tabStats: "Stats",
        tabNotes: "Notas",
        tabHistory: "Histórico",
        stFocusTodayK: "Foco hoje",
        stPomosTodayK: "🍅 hoje",
        stStreakK: "Streak",
        stBestHourK: "Melhor hora",
        chartTitle: "Últimos 7 dias (🍅)",
        chartLegend: "barra = pomodoros concluídos",
        noteTitle: "Nota rápida",
        noteHint: "No fim de cada foco, registre 1 insight. Aqui você pode anotar também.",
        historyHint: "Registros dos ciclos (foco/pausa) com tarefa, plano e tempo.",
        start: "▶ Iniciar",
        pause: "⏸ Pausar",
        resume: "▶ Retomar",
        skip: "⏭ Pular",
        reset: "↺ Reset",
        add: "+ Adicionar",
        clearDone: "🧹 Limpar concluídas",
        example: "✨ Exemplo",
        exportCsv: "⬇ Exportar CSV",
        reportPdf: "🖨 Relatório (PDF)",
        resetAll: "🗑 Reset geral",
        clearHistory: "🧹 Limpar histórico",
        saveNote: "💾 Salvar nota",
        clear: "🧽 Limpar",
        notifyOn: "Ativar",
        notifyOff: "Ativo",
        soundOn: "On",
        soundOff: "Off",
        full: "Full",
        exitFull: "Exit",
        dark: "Dark",
        light: "Light",
        phaseFocus: "FOCO",
        phaseBreak: "PAUSA",
        phaseLong: "PAUSA LONGA",
        toastSaved: "Salvo ✨",
        toastAdded: "Tarefa adicionada 🍅",
        toastDone: "Concluída ✅",
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
        printTitle: "Relatório FocusFlow",
        printSub: "Resumo de foco, pomodoros e tarefas",
        noTask: "(Sem tarefa)",
      },
      en: {
        brandSub: "Smart Pomodoro for studying",
        timerTitle: "Session",
        timerSubtitle: "Plan, focus, log. Clean and simple.",
        tasksTitle: "Tasks",
        tasksSubtitle: "Each task has an estimated 🍅 count.",
        insightsTitle: "Dashboard",
        insightsSubtitle: "Turning focus into data and memory.",
        presetLabel: "Preset",
        taskLinkLabel: "Active task",
        focusLabel: "Focus (min)",
        breakLabel: "Break (min)",
        longLabel: "Long (min)",
        cyclesLabel: "Cycles",
        goalLabel: "Goal 🍅",
        autoLabel: "Auto",
        sessionIntentLabel: "Session plan (1 sentence)",
        miniCyclesK: "Cycles",
        miniFocusK: "Goal",
        miniDistrK: "Distractions",
        tabStats: "Stats",
        tabNotes: "Notes",
        tabHistory: "History",
        stFocusTodayK: "Focus today",
        stPomosTodayK: "🍅 today",
        stStreakK: "Streak",
        stBestHourK: "Best hour",
        chartTitle: "Last 7 days (🍅)",
        chartLegend: "bar = completed pomodoros",
        noteTitle: "Quick note",
        noteHint: "After each focus, capture 1 insight. You can write here too.",
        historyHint: "Cycle logs (focus/break) with task, plan and time.",
        start: "▶ Start",
        pause: "⏸ Pause",
        resume: "▶ Resume",
        skip: "⏭ Skip",
        reset: "↺ Reset",
        add: "+ Add",
        clearDone: "🧹 Clear done",
        example: "✨ Sample",
        exportCsv: "⬇ Export CSV",
        reportPdf: "🖨 Report (PDF)",
        resetAll: "🗑 Reset all",
        clearHistory: "🧹 Clear history",
        saveNote: "💾 Save note",
        clear: "🧽 Clear",
        notifyOn: "Enable",
        notifyOff: "Enabled",
        soundOn: "On",
        soundOff: "Off",
        full: "Full",
        exitFull: "Exit",
        dark: "Dark",
        light: "Light",
        phaseFocus: "FOCUS",
        phaseBreak: "BREAK",
        phaseLong: "LONG BREAK",
        toastSaved: "Saved ✨",
        toastAdded: "Task added 🍅",
        toastDone: "Completed ✅",
        toastNeedName: "Give your task a name 🙂",
        toastNotifDenied: "Notifications blocked by browser",
        toastNotifOn: "Notifications enabled 🔔",
        toastFocusEnd: "Focus finished! Break time.",
        toastBreakEnd: "Break finished! Back to focus.",
        toastLongEnd: "Long break finished! Let's go.",
        toastDistraction: "Distraction logged 👀",
        toastCsv: "CSV created ✅",
        toastResetAll: "Everything reset 🧼",
        toastHistoryCleared: "History cleared 🧹",
        printTitle: "FocusFlow Report",
        printSub: "Summary of focus, pomodoros and tasks",
        noTask: "(No task)",
      }
    };
  
    // ---------- Storage ----------
    const LS_KEY = "focusflow_v1";
  
    const defaultState = () => ({
      settings: {
        lang: (navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en",
        theme: "dark",
        sound: true,
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
      timer: {
        phase: "focus", // focus | break | long
        running: false,
        remainingSec: 25 * 60,
        totalSec: 25 * 60,
        cycleIndex: 1,
        pomosCompletedToday: 0,
        distractionsToday: 0,
        startedAtISO: null
      },
      tasks: [],
      notes: [],
      history: [] // {id, tsISO, phase, minutes, taskId, taskName, intent, cycleIndex, preset, completedFocus:boolean}
    });
  
    function loadState() {
      const raw = localStorage.getItem(LS_KEY);
      const st = raw ? safeParse(raw, defaultState()) : defaultState();
      return mergeDefaults(defaultState(), st);
    }
  
    function mergeDefaults(base, incoming) {
      // shallow-ish safe merge
      const out = structuredClone(base);
      function merge(obj, inc) {
        for (const k of Object.keys(inc || {})) {
          if (inc[k] && typeof inc[k] === "object" && !Array.isArray(inc[k])) {
            obj[k] = obj[k] || {};
            merge(obj[k], inc[k]);
          } else {
            obj[k] = inc[k];
          }
        }
      }
      merge(out, incoming);
      return out;
    }
  
    function saveState() {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    }
  
    // ---------- Audio (simple chime) ----------
    let audioCtx = null;
    function beep(kind = "soft") {
      if (!state.settings.sound) return;
      try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = "sine";
        const t0 = audioCtx.currentTime;
  
        const pattern = kind === "endFocus"
          ? [660, 880, 660]
          : kind === "endBreak"
          ? [880, 660]
          : [660];
  
        let time = t0;
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.12, time + 0.02);
  
        o.connect(g);
        g.connect(audioCtx.destination);
  
        // schedule frequency changes
        o.frequency.setValueAtTime(pattern[0], time);
        for (let i = 1; i < pattern.length; i++) {
          time += 0.14;
          o.frequency.setValueAtTime(pattern[i], time);
        }
  
        // release
        g.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);
        o.start(t0);
        o.stop(time + 0.25);
      } catch {
        // no-op
      }
    }
  
    // ---------- Notifications ----------
    function notify(title, body) {
      if (!state.settings.notifications) return;
      if (!("Notification" in window)) return;
      if (Notification.permission !== "granted") return;
  
      try {
        new Notification(title, { body });
      } catch {
        // no-op
      }
    }
  
    // ---------- UI refs ----------
    const el = {
      appRoot: $("#appRoot"),
  
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
  
      taskName: $("#taskName"),
      taskEst: $("#taskEst"),
      addTaskBtn: $("#addTaskBtn"),
      taskList: $("#taskList"),
      tasksCountPill: $("#tasksCountPill"),
      clearDoneBtn: $("#clearDoneBtn"),
      seedBtn: $("#seedBtn"),
  
      // tabs
      tabs: $$(".tab"),
      panes: {
        stats: $("#pane-stats"),
        notes: $("#pane-notes"),
        history: $("#pane-history"),
      },
  
      // stats
      focusToday: $("#focusToday"),
      pomosToday: $("#pomosToday"),
      streak: $("#streak"),
      bestHour: $("#bestHour"),
      bars7: $("#bars7"),
  
      exportCsvBtn: $("#exportCsvBtn"),
      printReportBtn: $("#printReportBtn"),
      resetAllBtn: $("#resetAllBtn"),
  
      // notes
      noteText: $("#noteText"),
      saveNoteBtn: $("#saveNoteBtn"),
      clearNoteBtn: $("#clearNoteBtn"),
      notesList: $("#notesList"),
  
      // history
      historyList: $("#historyList"),
      clearHistoryBtn: $("#clearHistoryBtn"),
  
      toast: $("#toast"),
      printArea: $("#printArea"),
    };
  
    // text nodes for i18n
    const textMap = [
      ["brandSub", "brandSub"],
      ["timerTitle", "timerTitle", "#timerTitle"],
      ["timerSubtitle", "timerSubtitle", "#timerSubtitle"],
      ["tasksTitle", "tasksTitle", "#tasksTitle"],
      ["tasksSubtitle", "tasksSubtitle", "#tasksSubtitle"],
      ["insightsTitle", "insightsTitle", "#insightsTitle"],
      ["insightsSubtitle", "insightsSubtitle", "#insightsSubtitle"],
  
      ["presetLabel", "presetLabel", "#presetLabel"],
      ["taskLinkLabel", "taskLinkLabel", "#taskLinkLabel"],
      ["focusLabel", "focusLabel", "#focusLabel"],
      ["breakLabel", "breakLabel", "#breakLabel"],
      ["longLabel", "longLabel", "#longLabel"],
      ["cyclesLabel", "cyclesLabel", "#cyclesLabel"],
      ["goalLabel", "goalLabel", "#goalLabel"],
      ["autoLabel", "autoLabel", "#autoLabel"],
      ["sessionIntentLabel", "sessionIntentLabel", "#sessionIntentLabel"],
  
      ["miniCyclesK", "miniCyclesK", "#miniCyclesK"],
      ["miniFocusK", "miniFocusK", "#miniFocusK"],
      ["miniDistrK", "miniDistrK", "#miniDistrK"],
  
      ["tabStats", "tabStats", "#tabStats"],
      ["tabNotes", "tabNotes", "#tabNotes"],
      ["tabHistory", "tabHistory", "#tabHistory"],
  
      ["stFocusTodayK", "stFocusTodayK", "#stFocusTodayK"],
      ["stPomosTodayK", "stPomosTodayK", "#stPomosTodayK"],
      ["stStreakK", "stStreakK", "#stStreakK"],
      ["stBestHourK", "stBestHourK", "#stBestHourK"],
  
      ["chartTitle", "chartTitle", "#chartTitle"],
      ["chartLegend", "chartLegend", "#chartLegend"],
  
      ["noteTitle", "noteTitle", "#noteTitle"],
      ["noteHint", "noteHint", "#noteHint"],
      ["historyHint", "historyHint", "#historyHint"],
  
      ["exportCsv", "exportCsv", "#exportCsvBtn"],
      ["reportPdf", "reportPdf", "#printReportBtn"],
      ["resetAll", "resetAll", "#resetAllBtn"],
      ["clearHistory", "clearHistory", "#clearHistoryBtn"],
      ["saveNote", "saveNote", "#saveNoteBtn"],
      ["clear", "clear", "#clearNoteBtn"],
      ["clearDone", "clearDone", "#clearDoneBtn"],
      ["example", "example", "#seedBtn"],
    ];
  
    // ---------- State ----------
    let state = loadState();
  
    // timer runtime
    let tickHandle = null;
    let lastTick = null;
  
    // ---------- Toast ----------
    let toastTimer = null;
    function toast(msg) {
      el.toast.textContent = msg;
      el.toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => el.toast.classList.remove("show"), 1800);
    }
  
    // ---------- Theme & Language ----------
    function applyTheme() {
      document.documentElement.dataset.theme = state.settings.theme === "light" ? "light" : "dark";
      const t = t9();
      el.themeIcon.textContent = state.settings.theme === "light" ? "☀️" : "🌙";
      el.themeLabel.textContent = state.settings.theme === "light" ? t.light : t.dark;
    }
  
    function t9() { return I18N[state.settings.lang] || I18N.pt; }
  
    function applyLang() {
      const t = t9();
      el.langLabel.textContent = state.settings.lang.toUpperCase();
      el.brandSub.textContent = t.brandSub;
  
      for (const [_, key, selector] of textMap) {
        if (!selector) continue;
        const node = $(selector);
        if (node) node.textContent = t[key];
      }
  
      // buttons
      el.startBtn.textContent = state.timer.running ? t.pause : t.start;
      el.pauseBtn.textContent = t.pause;
  
      // labels & toggles
      el.soundLabel.textContent = state.settings.sound ? t.soundOn : t.soundOff;
      el.notifyLabel.textContent = state.settings.notifications ? t.notifyOff : t.notifyOn;
      el.fsLabel.textContent = document.fullscreenElement ? t.exitFull : t.full;
  
      // placeholder of task select default
      // We'll re-render selects
      renderAll();
    }
  
    // ---------- Presets ----------
    const presets = {
      classic: { focus: 25, brk: 5, lng: 15, cycles: 4, goal: 4 },
      deep:    { focus: 50, brk: 10, lng: 20, cycles: 4, goal: 4 },
      sprint:  { focus: 15, brk: 3, lng: 10, cycles: 6, goal: 6 },
    };
  
    function applyPreset(name) {
      const p = presets[name];
      if (!p) return;
      state.planner.focusMin = p.focus;
      state.planner.breakMin = p.brk;
      state.planner.longMin = p.lng;
      state.planner.cycles = p.cycles;
      state.planner.goal = p.goal;
      state.planner.preset = name;
  
      syncPlannerInputs();
      resetTimerTo("focus");
      saveState();
      renderAll();
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
  
    // ---------- Timer core ----------
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
  
    function resetTimerTo(phase) {
      state.timer.phase = phase;
      state.timer.remainingSec = phaseSeconds(phase);
      state.timer.totalSec = phaseSeconds(phase);
      state.timer.running = false;
      state.timer.startedAtISO = null;
      lastTick = null;
  
      stopTick();
      saveState();
    }
  
    function startTick() {
      if (tickHandle) return;
      lastTick = Date.now();
      tickHandle = setInterval(() => {
        if (!state.timer.running) return;
  
        const now = Date.now();
        const dt = Math.floor((now - lastTick) / 1000);
        if (dt <= 0) return;
        lastTick = now;
  
        state.timer.remainingSec = Math.max(0, state.timer.remainingSec - dt);
  
        if (state.timer.remainingSec <= 0) {
          onPhaseEnd();
        }
  
        saveState();
        renderTimer();
      }, 250);
    }
  
    function stopTick() {
      if (!tickHandle) return;
      clearInterval(tickHandle);
      tickHandle = null;
    }
  
    function toggleRun(run) {
      state.timer.running = run;
      if (run) {
        state.timer.startedAtISO = state.timer.startedAtISO || nowISO();
        startTick();
      }
      saveState();
      renderTimer();
    }
  
    function onPhaseEnd() {
      const t = t9();
      const endedPhase = state.timer.phase;
  
      // log the phase
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
  
      // focus completion effects
      if (completedFocus) {
        state.timer.pomosCompletedToday += 1;
  
        // increment task progress
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
  
      // advance phase
      if (endedPhase === "focus") {
        const isEndOfCycle = state.timer.cycleIndex >= state.planner.cycles;
        if (isEndOfCycle) {
          state.timer.phase = "long";
        } else {
          state.timer.phase = "break";
        }
      } else {
        // leaving a break
        if (endedPhase === "long") {
          state.timer.cycleIndex = 1;
        } else {
          state.timer.cycleIndex = clamp(state.timer.cycleIndex + 1, 1, 99);
        }
        state.timer.phase = "focus";
      }
  
      // reset time for new phase
      state.timer.totalSec = phaseSeconds(state.timer.phase);
      state.timer.remainingSec = state.timer.totalSec;
      state.timer.startedAtISO = nowISO();
  
      // auto-run
      if (state.settings.auto) {
        state.timer.running = true;
        lastTick = Date.now();
      } else {
        state.timer.running = false;
      }
  
      saveState();
      renderAll();
    }
  
    // ---------- Distractions ----------
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && state.timer.running && state.timer.phase === "focus") {
        state.timer.distractionsToday += 1;
        saveState();
        renderTimer();
        toast(t9().toastDistraction);
      }
    });
  
    // ---------- Tasks ----------
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
  
      if (!state.planner.activeTaskId) {
        state.planner.activeTaskId = task.id;
      }
  
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
      const t = t9();
      const sample = state.settings.lang === "pt"
        ? [
            ["Matemática: funções", 4],
            ["Português: interpretação", 3],
            ["Programação: JS DOM", 5],
          ]
        : [
            ["Math: functions", 4],
            ["Reading: comprehension", 3],
            ["Programming: JS DOM", 5],
          ];
  
      for (const [name, est] of sample) addTask(name, est);
    }
  
    function getActiveTask() {
      const id = state.planner.activeTaskId;
      if (!id) return null;
      return state.tasks.find(t => t.id === id) || null;
    }
  
    // ---------- Notes ----------
    function saveNote(text, meta = {}) {
      const clean = (text || "").trim();
      if (!clean) return;
  
      state.notes.unshift({
        id: crypto.randomUUID(),
        tsISO: nowISO(),
        text: clean,
        taskId: meta.taskId || state.planner.activeTaskId || "",
        taskName: meta.taskName || (getActiveTask()?.name || ""),
        intent: meta.intent || state.planner.sessionIntent || ""
      });
  
      saveState();
      toast(t9().toastSaved);
      renderNotes();
    }
  
    function deleteNote(id) {
      state.notes = state.notes.filter(n => n.id !== id);
      saveState();
      renderNotes();
    }
  
    // ---------- Stats ----------
    function dayOf(iso) { return iso.slice(0, 10); }
    function hourOf(iso) { return new Date(iso).getHours(); }
  
    function computeToday() {
      const d = todayKey();
      const focusLogs = state.history.filter(h => h.completedFocus && dayOf(h.tsISO) === d);
      const pomos = focusLogs.length;
      const minutes = focusLogs.reduce((a, b) => a + (b.minutes || 0), 0);
  
      return { pomos, minutes };
    }
  
    function computeStreak() {
      // streak counts consecutive days with at least 1 completed focus pomodoro
      const daysWithPomos = new Set(
        state.history.filter(h => h.completedFocus).map(h => dayOf(h.tsISO))
      );
  
      let streak = 0;
      let d = new Date();
      for (;;) {
        const k = d.toISOString().slice(0, 10);
        if (!daysWithPomos.has(k)) break;
        streak += 1;
        d.setDate(d.getDate() - 1);
      }
      return streak;
    }
  
    function computeBestHour() {
      // based on completed focus logs
      const counts = Array.from({ length: 24 }, () => 0);
      for (const h of state.history) {
        if (!h.completedFocus) continue;
        counts[hourOf(h.tsISO)] += 1;
      }
      const max = Math.max(...counts);
      if (max <= 0) return "--";
      const idx = counts.indexOf(max);
      return `${pad2(idx)}:00`;
    }
  
    function last7DaysBars() {
      const days = [];
      const d = new Date();
      for (let i = 6; i >= 0; i--) {
        const dd = new Date(d);
        dd.setDate(d.getDate() - i);
        const key = dd.toISOString().slice(0, 10);
        days.push(key);
      }
  
      const pomosByDay = new Map(days.map(k => [k, 0]));
      for (const h of state.history) {
        if (!h.completedFocus) continue;
        const k = dayOf(h.tsISO);
        if (pomosByDay.has(k)) pomosByDay.set(k, pomosByDay.get(k) + 1);
      }
  
      return days.map(k => ({ day: k.slice(5).replace("-", "/"), val: pomosByDay.get(k) || 0 }));
    }
  
    // ---------- CSV export ----------
    function exportCSV() {
      const headers = [
        "timestamp",
        "phase",
        "minutes",
        "task",
        "intent",
        "cycleIndex",
        "preset"
      ];
  
      const rows = state.history.map(h => ([
        h.tsISO,
        h.phase,
        h.minutes,
        (h.taskName || "").replaceAll('"', '""'),
        (h.intent || "").replaceAll('"', '""'),
        h.cycleIndex,
        h.preset
      ]));
  
      const csv = [
        headers.join(","),
        ...rows.map(r => r.map(v => `"${String(v ?? "")}"`).join(","))
      ].join("\n");
  
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
  
    // ---------- Print report (PDF via browser print) ----------
    function buildReportHTML() {
      const t = t9();
      const today = computeToday();
      const streak = computeStreak();
      const bestHour = computeBestHour();
      const activeTask = getActiveTask();
  
      const topTasks = state.tasks
        .slice()
        .sort((a, b) => (b.done / b.est) - (a.done / a.est))
        .slice(0, 8);
  
      const latest = state.history.slice(0, 12);
  
      const styles = `
        <style>
          body{ font-family: ui-sans-serif, system-ui; margin: 26px; color:#111; }
          h1{ margin: 0; font-size: 20px; }
          .sub{ margin-top: 4px; color:#555; font-size: 12px; }
          .grid{ margin-top: 16px; display:grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
          .box{ border:1px solid #ddd; border-radius: 12px; padding: 12px; }
          .k{ color:#666; font-size: 11px; font-weight: 800; }
          .v{ font-size: 18px; font-weight: 900; margin-top: 6px; }
          table{ width:100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th,td{ border-bottom:1px solid #eee; padding: 8px 6px; text-align:left; vertical-align: top; }
          th{ color:#666; font-size: 11px; }
          .tag{ display:inline-block; border:1px solid #ddd; border-radius: 999px; padding: 2px 8px; font-size: 10px; margin-left: 6px; }
          .muted{ color:#666; }
          .footer{ margin-top: 18px; color:#777; font-size: 11px; }
        </style>
      `;
  
      const rowsTasks = topTasks.map(tsk => {
        const pct = Math.round((tsk.done / tsk.est) * 100);
        return `<tr>
          <td><b>${escapeHTML(tsk.name)}</b></td>
          <td>${tsk.done}/${tsk.est} (${pct}%)</td>
          <td>${tsk.completed ? "✅" : "⏳"}</td>
        </tr>`;
      }).join("");
  
      const rowsHist = latest.map(h => {
        const when = new Date(h.tsISO).toLocaleString();
        return `<tr>
          <td>${escapeHTML(when)}</td>
          <td>${escapeHTML(h.phase)}</td>
          <td>${escapeHTML(h.taskName || "")}</td>
          <td class="muted">${escapeHTML(h.intent || "")}</td>
        </tr>`;
      }).join("");
  
      return `
        ${styles}
        <h1>${escapeHTML(t.printTitle)} <span class="tag">${escapeHTML(todayKey())}</span></h1>
        <div class="sub">${escapeHTML(t.printSub)}</div>
  
        <div class="grid">
          <div class="box">
            <div class="k">${escapeHTML(t.stFocusTodayK)}</div>
            <div class="v">${today.minutes} min</div>
          </div>
          <div class="box">
            <div class="k">${escapeHTML(t.stPomosTodayK)}</div>
            <div class="v">${today.pomos}</div>
          </div>
          <div class="box">
            <div class="k">${escapeHTML(t.stStreakK)}</div>
            <div class="v">${streak} 🔥</div>
          </div>
          <div class="box">
            <div class="k">${escapeHTML(t.stBestHourK)}</div>
            <div class="v">${escapeHTML(bestHour)}</div>
          </div>
        </div>
  
        <div class="box" style="margin-top:12px;">
          <div class="k">${escapeHTML(t.taskLinkLabel)}</div>
          <div class="v" style="font-size:14px;">
            ${escapeHTML(activeTask?.name || t.noTask)}
          </div>
          <div class="muted" style="margin-top:6px;">
            ${escapeHTML(t.sessionIntentLabel)}: ${escapeHTML(state.planner.sessionIntent || "-")}
          </div>
        </div>
  
        <div class="box" style="margin-top:12px;">
          <div class="k">${escapeHTML(t.tasksTitle)}</div>
          <table>
            <thead><tr><th>Task</th><th>Progress</th><th>Status</th></tr></thead>
            <tbody>${rowsTasks || `<tr><td colspan="3" class="muted">-</td></tr>`}</tbody>
          </table>
        </div>
  
        <div class="box" style="margin-top:12px;">
          <div class="k">${escapeHTML(t.tabHistory)}</div>
          <table>
            <thead><tr><th>When</th><th>Phase</th><th>Task</th><th>Plan</th></tr></thead>
            <tbody>${rowsHist || `<tr><td colspan="4" class="muted">-</td></tr>`}</tbody>
          </table>
        </div>
  
        <div class="footer">FocusFlow • Local-only data (LocalStorage)</div>
      `;
    }
  
    function escapeHTML(s) {
      return String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
  
    function printReport() {
      const html = buildReportHTML();
      const w = window.open("", "_blank");
      if (!w) return;
      w.document.open();
      w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>FocusFlow Report</title></head><body>${html}</body></html>`);
      w.document.close();
      w.focus();
      w.print();
    }
  
    // ---------- Rendering ----------
    function renderTimer() {
      const t = t9();
      el.phaseBadge.textContent = phaseLabel(state.timer.phase);
      el.timeText.textContent = fmtMMSS(state.timer.remainingSec);
  
      const pct = state.timer.totalSec > 0
        ? (1 - (state.timer.remainingSec / state.timer.totalSec)) * 100
        : 0;
      el.progressBar.style.width = `${clamp(pct, 0, 100)}%`;
  
      el.cycleNow.textContent = state.timer.cycleIndex;
      el.cycleTotal.textContent = state.planner.cycles;
      el.goalPomos.textContent = state.planner.goal;
      el.distractions.textContent = state.timer.distractionsToday;
  
      // buttons
      el.startBtn.disabled = state.timer.running;
      el.pauseBtn.disabled = !state.timer.running;
  
      el.startBtn.textContent = t.start;
      el.pauseBtn.textContent = t.pause;
  
      // badge style hint
      if (state.timer.phase === "focus") {
        el.phaseBadge.style.borderColor = "rgba(140,246,255,0.35)";
      } else if (state.timer.phase === "break") {
        el.phaseBadge.style.borderColor = "rgba(251,191,36,0.35)";
      } else {
        el.phaseBadge.style.borderColor = "rgba(74,222,128,0.35)";
      }
    }
  
    function renderTasks() {
      el.tasksCountPill.textContent = state.tasks.length;
  
      el.taskList.innerHTML = "";
      const wrap = document.createDocumentFragment();
  
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
  
        // highlight active
        if (state.planner.activeTaskId === tsk.id) {
          div.style.borderColor = "rgba(140,246,255,0.40)";
          div.style.background = "rgba(140,246,255,0.08)";
        }
  
        wrap.appendChild(div);
      }
  
      el.taskList.appendChild(wrap);
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
  
    function renderNotes() {
      el.notesList.innerHTML = "";
      const frag = document.createDocumentFragment();
  
      const show = state.notes.slice(0, 30);
      for (const n of show) {
        const div = document.createElement("div");
        div.className = "item";
        const when = new Date(n.tsISO).toLocaleString();
  
        div.innerHTML = `
          <div class="item-top">
            <div class="item-title">${escapeHTML(n.taskName || "Nota")}</div>
            <div>
              <span class="tag good">${escapeHTML(when)}</span>
              <button class="iconbtn" title="Remover">✕</button>
            </div>
          </div>
          <div class="item-meta">
            <span>🧠 ${escapeHTML(n.intent || "")}</span>
          </div>
          <div style="margin-top:8px; font-weight:800; font-size:12px; line-height:1.35;">
            ${escapeHTML(n.text)}
          </div>
        `;
  
        div.querySelector("button").addEventListener("click", () => deleteNote(n.id));
        frag.appendChild(div);
      }
  
      el.notesList.appendChild(frag);
    }
  
    function renderHistory() {
      el.historyList.innerHTML = "";
      const frag = document.createDocumentFragment();
  
      const show = state.history.slice(0, 40);
      for (const h of show) {
        const div = document.createElement("div");
        div.className = "item";
        const when = new Date(h.tsISO).toLocaleString();
  
        const tagClass =
          h.phase === "focus" ? "good" :
          h.phase === "break" ? "warn" : "good";
  
        div.innerHTML = `
          <div class="item-top">
            <div class="item-title">${escapeHTML(h.taskName || "")}</div>
            <div>
              <span class="tag ${tagClass}">${escapeHTML(h.phase)} • ${h.minutes}m</span>
            </div>
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
  
        frag.appendChild(div);
      }
  
      el.historyList.appendChild(frag);
    }
  
    function renderStats() {
      const today = computeToday();
      el.focusToday.textContent = today.minutes;
      el.pomosToday.textContent = today.pomos;
  
      el.streak.textContent = computeStreak();
      el.bestHour.textContent = computeBestHour();
  
      // 7-day bars
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
  
    function renderSoundNotifyFS() {
      const t = t9();
      el.soundIcon.textContent = state.settings.sound ? "🔊" : "🔇";
      el.soundLabel.textContent = state.settings.sound ? t.soundOn : t.soundOff;
  
      el.notifyLabel.textContent = state.settings.notifications ? t.notifyOff : t.notifyOn;
  
      el.fsLabel.textContent = document.fullscreenElement ? t.exitFull : t.full;
    }
  
    function renderAll() {
      syncPlannerInputs();
      renderActiveTaskSelect();
      renderTimer();
      renderTasks();
      renderStats();
      renderNotes();
      renderHistory();
      renderSoundNotifyFS();
    }
  
    // ---------- Daily reset (pomos/distractions) ----------
    function ensureDailyCounters() {
      // if last history day differs from today and timer counters seem stale, recompute
      const today = computeToday();
      state.timer.pomosCompletedToday = today.pomos;
      state.timer.distractionsToday = state.timer.distractionsToday || 0;
      saveState();
    }
  
    // ---------- Events ----------
    // tabs
    el.tabs.forEach(btn => {
      btn.addEventListener("click", () => {
        el.tabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const key = btn.dataset.tab;
        Object.entries(el.panes).forEach(([k, pane]) => {
          pane.classList.toggle("active", k === key);
        });
      });
    });
  
    // language
    el.langToggle.addEventListener("click", () => {
      state.settings.lang = state.settings.lang === "pt" ? "en" : "pt";
      saveState();
      applyLang();
    });
  
    // theme
    el.themeToggle.addEventListener("click", () => {
      state.settings.theme = state.settings.theme === "light" ? "dark" : "light";
      saveState();
      applyTheme();
    });
  
    // sound
    el.soundToggle.addEventListener("click", () => {
      state.settings.sound = !state.settings.sound;
      saveState();
      renderSoundNotifyFS();
    });
  
    // notifications
    el.notifyBtn.addEventListener("click", async () => {
      const t = t9();
      if (!("Notification" in window)) {
        toast(t.toastNotifDenied);
        return;
      }
  
      if (Notification.permission === "granted") {
        state.settings.notifications = !state.settings.notifications;
        saveState();
        renderSoundNotifyFS();
        toast(state.settings.notifications ? t.toastNotifOn : t.toastSaved);
        return;
      }
  
      const res = await Notification.requestPermission();
      if (res === "granted") {
        state.settings.notifications = true;
        saveState();
        renderSoundNotifyFS();
        toast(t.toastNotifOn);
      } else {
        toast(t.toastNotifDenied);
      }
    });
  
    // fullscreen
    el.fullscreenBtn.addEventListener("click", async () => {
      const t = t9();
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
        renderSoundNotifyFS();
        toast(document.fullscreenElement ? "⛶ Fullscreen" : "⛶ Exit");
      } catch {
        // ignore
        el.fsLabel.textContent = t.full;
      }
    });
    document.addEventListener("fullscreenchange", renderSoundNotifyFS);
  
    // presets and planner inputs
    el.presetSelect.addEventListener("change", () => {
      const v = el.presetSelect.value;
      state.planner.preset = v;
      if (v !== "custom") applyPreset(v);
      saveState();
      renderAll();
    });
  
    function onPlannerChange() {
      state.planner.focusMin = clamp(parseInt(el.focusMin.value || 25, 10), 5, 120);
      state.planner.breakMin = clamp(parseInt(el.breakMin.value || 5, 10), 1, 60);
      state.planner.longMin = clamp(parseInt(el.longMin.value || 15, 10), 5, 60);
      state.planner.cycles = clamp(parseInt(el.cyclesCount.value || 4, 10), 1, 12);
      state.planner.goal = clamp(parseInt(el.goalCount.value || 4, 10), 1, 24);
  
      // if editing values manually, switch preset to custom
      state.planner.preset = "custom";
      el.presetSelect.value = "custom";
  
      // if not running, reset the timer phase duration to match
      if (!state.timer.running) resetTimerTo(state.timer.phase);
  
      saveState();
      renderAll();
    }
  
    [el.focusMin, el.breakMin, el.longMin, el.cyclesCount, el.goalCount].forEach(inp => {
      inp.addEventListener("change", onPlannerChange);
    });
  
    el.autoToggle.addEventListener("click", () => {
      state.settings.auto = !state.settings.auto;
      saveState();
      syncPlannerInputs();
      renderAll();
    });
  
    el.saveSessionBtn.addEventListener("click", () => {
      state.planner.sessionIntent = (el.sessionIntent.value || "").trim();
      saveState();
      toast(t9().toastSaved);
      renderAll();
    });
  
    el.activeTaskSelect.addEventListener("change", () => {
      state.planner.activeTaskId = el.activeTaskSelect.value || "";
      saveState();
      renderAll();
    });
  
    // timer controls
    el.startBtn.addEventListener("click", () => {
      if (state.timer.running) return;
      toggleRun(true);
    });
  
    el.pauseBtn.addEventListener("click", () => {
      if (!state.timer.running) return;
      toggleRun(false);
      stopTick();
    });
  
    el.skipBtn.addEventListener("click", () => {
      // finish phase immediately
      state.timer.remainingSec = 0;
      onPhaseEnd();
    });
  
    el.resetBtn.addEventListener("click", () => {
      resetTimerTo(state.timer.phase);
      renderAll();
    });
  
    // tasks
    el.addTaskBtn.addEventListener("click", () => {
      addTask(el.taskName.value, el.taskEst.value);
      el.taskName.value = "";
    });
  
    el.taskName.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        addTask(el.taskName.value, el.taskEst.value);
        el.taskName.value = "";
      }
    });
  
    el.clearDoneBtn.addEventListener("click", clearDoneTasks);
    el.seedBtn.addEventListener("click", seedTasks);
  
    // notes
    el.saveNoteBtn.addEventListener("click", () => {
      const task = getActiveTask();
      saveNote(el.noteText.value, {
        taskId: task?.id || "",
        taskName: task?.name || "",
        intent: state.planner.sessionIntent || ""
      });
      el.noteText.value = "";
    });
  
    el.clearNoteBtn.addEventListener("click", () => {
      el.noteText.value = "";
    });
  
    // history
    el.clearHistoryBtn.addEventListener("click", () => {
      state.history = [];
      saveState();
      toast(t9().toastHistoryCleared);
      renderAll();
    });
  
    // export / report / reset all
    el.exportCsvBtn.addEventListener("click", exportCSV);
    el.printReportBtn.addEventListener("click", printReport);
  
    el.resetAllBtn.addEventListener("click", () => {
      state = defaultState();
      saveState();
      applyTheme();
      applyLang();
      toast(t9().toastResetAll);
      renderAll();
    });
  
    // ---------- Init ----------
    function initThemeLang() {
      applyTheme();
      applyLang();
    }
  
    function initPhaseFromPlannerIfNeeded() {
      // align timer seconds with planner if corrupted/zero
      const expected = phaseSeconds(state.timer.phase);
      if (!state.timer.totalSec || state.timer.totalSec < 10) {
        state.timer.totalSec = expected;
      }
      if (!state.timer.remainingSec || state.timer.remainingSec > state.timer.totalSec) {
        state.timer.remainingSec = state.timer.totalSec;
      }
      saveState();
    }
  
    function init() {
      initThemeLang();
      ensureDailyCounters();
      initPhaseFromPlannerIfNeeded();
      syncPlannerInputs();
      renderAll();
  
      // if it was running before refresh, keep ticking
      if (state.timer.running) startTick();
    }
  
    init();
  })();