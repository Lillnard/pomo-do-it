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
        dark: "Dark",
        light: "Light",
        soundOn: "On",
        soundOff: "Off",
        notifyEnable: "Ativar",
        notifyEnabled: "Ativo",
        full: "Full",
        exitFull: "Exit",
        drawerTitle: "Menu",
        drawerLang: "Idioma",
        drawerTheme: "Tema",
        drawerSound: "Som",
        drawerNotify: "Notificações",
        drawerFull: "Tela cheia",
        drawerTip: "Dica: ESC fecha o menu. Toque fora também.",
        timerTitle: "Sessão",
        timerSubtitle: "Planeje, foque e registre. Sem drama.",
        miniCyclesK: "Ciclos",
        miniFocusK: "Meta",
        miniDistrK: "Distrações",
        btnStart: "▶ Iniciar",
        btnPause: "⏸ Pausar",
        btnSkip: "⏭ Pular",
        btnReset: "↺ Reset",
        presetLabel: "Preset",
        taskLinkLabel: "Tarefa ativa",
        focusLabel: "Foco (min)",
        breakLabel: "Pausa (min)",
        longLabel: "Longa (min)",
        cyclesLabel: "Ciclos",
        goalLabel: "Meta 🍅",
        autoLabel: "Auto",
        sessionIntentLabel: "Plano da sessão (1 frase)",
        sessionIntentPh: "Ex: Revisar funções e resolver 10 exercícios",
        noTask: "(Sem tarefa)",
        presetClassic: "Clássico (25/5, longa 15)",
        presetDeep: "Deep Work (50/10, longa 20)",
        presetSprint: "Sprint (15/3, longa 10)",
        presetCustom: "Personalizado",
        hubTitle: "Central",
        hubSubtitle: "Tudo organizado em abas pra caber bonito.",
        hubSelectAria: "Selecionar aba",
        hubOptTasks: "Tarefas",
        hubOptStats: "Metas",
        hubOptNotes: "Notas",
        hubOptHistory: "Histórico",
        taskNamePh: "Nova tarefa (ex: Matemática, capítulo 3)",
        taskEstTitle: "Pomodoros estimados",
        addTaskBtn: "+ Adicionar",
        clearDoneBtn: "🧹 Limpar concluídas",
        seedBtn: "✨ Exemplo",
        taskBtnSetTitle: "Definir ativa",
        taskBtnPlusTitle: "+1 pomodoro",
        taskBtnDelTitle: "Remover",
        stFocusTodayK: "Foco hoje",
        stPomosTodayK: "🍅 hoje",
        stStreakK: "Streak",
        stBestHourK: "Melhor hora",
        minUnit: "min",
        chartTitle: "Últimos 7 dias (🍅)",
        chartLegend: "barra = pomodoros concluídos",
        exportCsvBtn: "⬇ Exportar CSV",
        printReportBtn: "🖨 Relatório (PDF)",
        resetAllBtn: "🗑 Reset geral",
        noteTitle: "Nota rápida",
        noteHint: "No fim de cada foco, registre 1 insight. Aqui você pode anotar também.",
        noteTextPh: "Ex: Entendi como aplicar a fórmula...",
        saveNoteBtn: "💾 Salvar nota",
        clearNoteBtn: "🧽 Limpar",
        notesAria: "Lista de notas",
        historyHint: "Registros dos ciclos (foco/pausa) com tarefa, plano e tempo.",
        clearHistoryBtn: "🧹 Limpar histórico",
        historyAria: "Histórico",
        musicTitle: "Som e música",
        musicSubtitle: "Ouça e concentre-se.",
        ambientALabel: "Camada A",
        ambientBLabel: "Camada B",
        ambientVolLabel: "Volume",
        uploadLabel: "Enviar sua música (MP3)",
        clearUserMusicBtn: "🧽 Limpar",
        focusOnlyLabel: "Auto-play só no FOCO",
        fadeLabel: "Fade in/out automático",
        dynamicPingLabel: "Som dinâmico (a cada 8 min)",
        ambientNote: 'Dica: Você pode fazer um "blend" com seus sons preferidos, basta ativar a camada A e B simultanemante.',
        ambientStopBtn: "⏹ Stop",
        audioBlockHint: 'Se o navegador bloquear áudio automático, clique em “Play” uma vez.',
        none: "(Nenhum)",
        nebulizer: "Inalador",
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
        toastNotifOff: "Notificações desativadas",
        toastFocusEnd: "Foco finalizado! Hora de pausar.",
        toastBreakEnd: "Pausa finalizada! Volta pro foco.",
        toastLongEnd: "Pausa longa finalizada! Bora.",
        toastDistraction: "Distração registrada 👀",
        toastCsv: "CSV gerado ✅",
        toastResetAll: "Tudo resetado 🧼",
        toastHistoryCleared: "Histórico limpo 🧹",
        phaseFocus: "FOCO",
        phaseBreak: "PAUSA",
        phaseLong: "PAUSA LONGA",
      },
  
      en: {
        brandSub: "Smart Pomodoro for studying",
        dark: "Dark",
        light: "Light",
        soundOn: "On",
        soundOff: "Off",
        notifyEnable: "Enable",
        notifyEnabled: "Enabled",
        full: "Full",
        exitFull: "Exit",
        drawerTitle: "Menu",
        drawerLang: "Language",
        drawerTheme: "Theme",
        drawerSound: "Sound",
        drawerNotify: "Notifications",
        drawerFull: "Fullscreen",
        drawerTip: "Tip: ESC closes the menu. Tap outside too.",
        timerTitle: "Session",
        timerSubtitle: "Plan, focus, and log. No drama.",
        miniCyclesK: "Cycles",
        miniFocusK: "Goal",
        miniDistrK: "Distractions",
        btnStart: "▶ Start",
        btnPause: "⏸ Pause",
        btnSkip: "⏭ Skip",
        btnReset: "↺ Reset",
        presetLabel: "Preset",
        taskLinkLabel: "Active task",
        focusLabel: "Focus (min)",
        breakLabel: "Break (min)",
        longLabel: "Long (min)",
        cyclesLabel: "Cycles",
        goalLabel: "Goal 🍅",
        autoLabel: "Auto",
        sessionIntentLabel: "Session plan (1 sentence)",
        sessionIntentPh: "e.g., Review functions and solve 10 exercises",
        noTask: "(No task)",
        presetClassic: "Classic (25/5, long 15)",
        presetDeep: "Deep Work (50/10, long 20)",
        presetSprint: "Sprint (15/3, long 10)",
        presetCustom: "Custom",
        hubTitle: "Hub",
        hubSubtitle: "Everything organized into tabs that fit nicely.",
        hubSelectAria: "Select tab",
        hubOptTasks: "Tasks",
        hubOptStats: "Goals",
        hubOptNotes: "Notes",
        hubOptHistory: "History",
        taskNamePh: "New task (e.g., Math, chapter 3)",
        taskEstTitle: "Estimated pomodoros",
        addTaskBtn: "+ Add",
        clearDoneBtn: "🧹 Clear completed",
        seedBtn: "✨ Example",
        taskBtnSetTitle: "Set active",
        taskBtnPlusTitle: "+1 pomodoro",
        taskBtnDelTitle: "Remove",
        stFocusTodayK: "Focus today",
        stPomosTodayK: "🍅 today",
        stStreakK: "Streak",
        stBestHourK: "Best hour",
        minUnit: "min",
        chartTitle: "Last 7 days (🍅)",
        chartLegend: "bar = completed pomodoros",
        exportCsvBtn: "⬇ Export CSV",
        printReportBtn: "🖨 Report (PDF)",
        resetAllBtn: "🗑 Reset all",
        noteTitle: "Quick note",
        noteHint: "At the end of each focus, record 1 insight. You can write here too.",
        noteTextPh: "e.g., I understood how to apply the formula...",
        saveNoteBtn: "💾 Save note",
        clearNoteBtn: "🧽 Clear",
        notesAria: "Notes list",
        historyHint: "Cycle logs (focus/break) with task, plan, and time.",
        clearHistoryBtn: "🧹 Clear history",
        historyAria: "History",
        musicTitle: "Sound & music",
        musicSubtitle: "Listen and focus.",
        ambientALabel: "Layer A",
        ambientBLabel: "Layer B",
        ambientVolLabel: "Volume",
        uploadLabel: "Upload your music (MP3)",
        clearUserMusicBtn: "🧽 Clear",
        focusOnlyLabel: "Auto-play only in FOCUS",
        fadeLabel: "Auto fade in/out",
        dynamicPingLabel: "Dynamic ping (every 8 min)",
        ambientNote: 'Tip: You can create a "blend" by enabling layer A and B at the same time.',
        ambientStopBtn: "⏹ Stop",
        audioBlockHint: 'If the browser blocks autoplay, click “Play” once.',
        none: "(None)",
        nebulizer: "Nebulizer",
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
        toastNotifOff: "Notifications disabled",
        toastFocusEnd: "Focus finished! Break time.",
        toastBreakEnd: "Break finished! Back to focus.",
        toastLongEnd: "Long break finished! Let’s go.",
        toastDistraction: "Distraction logged 👀",
        toastCsv: "CSV created ✅",
        toastResetAll: "Everything reset 🧼",
        toastHistoryCleared: "History cleared 🧹",
        phaseFocus: "FOCUS",
        phaseBreak: "BREAK",
        phaseLong: "LONG BREAK",
      }
    };
  
    const LS_KEY = "focusflow_layout_audio_v2";
  
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
  
      drawerTitle: $("#drawerTitle"),
      mLangTxt: $("#mLangTxt"),
      mThemeTxt: $("#mThemeTxt"),
      mSoundTxt: $("#mSoundTxt"),
      mNotifyTxt: $("#mNotifyTxt"),
      mFullTxt: $("#mFullTxt"),
      drawerTip: $("#drawerTip"),
  
      phaseBadge: $("#phaseBadge"),
      timeText: $("#timeText"),
      progressBar: $("#progressBar"),
      cycleNow: $("#cycleNow"),
      cycleTotal: $("#cycleTotal"),
      goalPomos: $("#goalPomos"),
      distractions: $("#distractions"),
  
      timerTitle: $("#timerTitle"),
      timerSubtitle: $("#timerSubtitle"),
      miniCyclesK: $("#miniCyclesK"),
      miniFocusK: $("#miniFocusK"),
      miniDistrK: $("#miniDistrK"),
  
      startBtn: $("#startBtn"),
      pauseBtn: $("#pauseBtn"),
      skipBtn: $("#skipBtn"),
      resetBtn: $("#resetBtn"),
  
      presetLabel: $("#presetLabel"),
      taskLinkLabel: $("#taskLinkLabel"),
      presetSelect: $("#presetSelect"),
      activeTaskSelect: $("#activeTaskSelect"),
      focusLabel: $("#focusLabel"),
      breakLabel: $("#breakLabel"),
      longLabel: $("#longLabel"),
      cyclesLabel: $("#cyclesLabel"),
      goalLabel: $("#goalLabel"),
      autoLabel: $("#autoLabel"),
      focusMin: $("#focusMin"),
      breakMin: $("#breakMin"),
      longMin: $("#longMin"),
      cyclesCount: $("#cyclesCount"),
      goalCount: $("#goalCount"),
      autoToggle: $("#autoToggle"),
      autoState: $("#autoState"),
      sessionIntentLabel: $("#sessionIntentLabel"),
      sessionIntent: $("#sessionIntent"),
      saveSessionBtn: $("#saveSessionBtn"),
  
      hubTitle: $("#hubTitle"),
      hubSubtitle: $("#hubSubtitle"),
      hubSelect: $("#hubSelect"),
      hubSelectLabel: $("#hubSelectLabel"),
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
  
      stFocusTodayK: $("#stFocusTodayK"),
      stPomosTodayK: $("#stPomosTodayK"),
      stStreakK: $("#stStreakK"),
      stBestHourK: $("#stBestHourK"),
      minUnit: $("#minUnit"),
      chartTitle: $("#chartTitle"),
      chartLegend: $("#chartLegend"),
      focusToday: $("#focusToday"),
      pomosToday: $("#pomosToday"),
      streak: $("#streak"),
      bestHour: $("#bestHour"),
      bars7: $("#bars7"),
      exportCsvBtn: $("#exportCsvBtn"),
      printReportBtn: $("#printReportBtn"),
      resetAllBtn: $("#resetAllBtn"),
  
      noteTitle: $("#noteTitle"),
      noteHint: $("#noteHint"),
      noteText: $("#noteText"),
      saveNoteBtn: $("#saveNoteBtn"),
      clearNoteBtn: $("#clearNoteBtn"),
      notesList: $("#notesList"),
  
      historyHint: $("#historyHint"),
      historyList: $("#historyList"),
      clearHistoryBtn: $("#clearHistoryBtn"),
  
      musicTitle: $("#musicTitle"),
      musicSubtitle: $("#musicSubtitle"),
  
      ambientToggle: $("#ambientToggle"),
      ambientState: $("#ambientState"),
      ambientALabel: $("#ambientALabel"),
      ambientBLabel: $("#ambientBLabel"),
      ambientVolLabel: $("#ambientVolLabel"),
      ambientASelect: $("#ambientASelect"),
      ambientBSelect: $("#ambientBSelect"),
      ambientVolume: $("#ambientVolume"),
      ambientStopBtn: $("#ambientStopBtn"),
      uploadLabel: $("#uploadLabel"),
      userMusicFile: $("#userMusicFile"),
      clearUserMusicBtn: $("#clearUserMusicBtn"),
  
      focusOnlyToggle: $("#focusOnlyToggle"),
      fadeToggle: $("#fadeToggle"),
      dynamicPingToggle: $("#dynamicPingToggle"),
      focusOnlyLabel: $("#focusOnlyLabel"),
      fadeLabel: $("#fadeLabel"),
      dynamicPingLabel: $("#dynamicPingLabel"),
      ambientNote: $("#ambientNote"),
      audioBlockHint: $("#audioBlockHint"),
  
      toast: $("#toast"),
    };
  
    const drawer = {
      hambBtn: $("#hambBtn"),
      menu: $("#mobileMenu"),
      backdrop: $("#drawerBackdrop"),
      close: $("#drawerClose"),
  
      mLang: $("#mLang"),
      mTheme: $("#mTheme"),
      mSound: $("#mSound"),
      mNotify: $("#mNotify"),
      mFull: $("#mFull"),
  
      mLangVal: $("#mLangVal"),
      mThemeVal: $("#mThemeVal"),
      mThemeIco: $("#mThemeIco"),
      mSoundVal: $("#mSoundVal"),
      mSoundIco: $("#mSoundIco"),
      mNotifyVal: $("#mNotifyVal"),
      mFullVal: $("#mFullVal"),
    };
  
    let toastTimer = null;
    function toast(msg) {
      el.toast.textContent = msg;
      el.toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => el.toast.classList.remove("show"), 1800);
    }
  
    function applyTheme() {
      document.documentElement.dataset.theme = state.settings.theme === "light" ? "light" : "dark";
      const t = t9();
      el.themeIcon.textContent = state.settings.theme === "light" ? "☀️" : "🌙";
      el.themeLabel.textContent = state.settings.theme === "light" ? t.light : t.dark;
    }
  
    function setSelectOptionText(selectEl, value, text) {
      if (!selectEl) return;
      const opt = Array.from(selectEl.options).find(o => o.value === value);
      if (opt) opt.textContent = text;
    }
  
    function applyLang() {
      const t = t9();
  
      el.langLabel.textContent = state.settings.lang.toUpperCase();
      el.brandSub.textContent = t.brandSub;
  
      if (el.drawerTitle) el.drawerTitle.textContent = t.drawerTitle;
      if (el.mLangTxt) el.mLangTxt.textContent = t.drawerLang;
      if (el.mThemeTxt) el.mThemeTxt.textContent = t.drawerTheme;
      if (el.mSoundTxt) el.mSoundTxt.textContent = t.drawerSound;
      if (el.mNotifyTxt) el.mNotifyTxt.textContent = t.drawerNotify;
      if (el.mFullTxt) el.mFullTxt.textContent = t.drawerFull;
      if (el.drawerTip) el.drawerTip.textContent = t.drawerTip;
  
      el.timerTitle.textContent = t.timerTitle;
      el.timerSubtitle.textContent = t.timerSubtitle;
      el.miniCyclesK.textContent = t.miniCyclesK;
      el.miniFocusK.textContent = t.miniFocusK;
      el.miniDistrK.textContent = t.miniDistrK;
  
      el.startBtn.textContent = t.btnStart;
      el.pauseBtn.textContent = t.btnPause;
      el.skipBtn.textContent = t.btnSkip;
      el.resetBtn.textContent = t.btnReset;
  
      el.presetLabel.textContent = t.presetLabel;
      el.taskLinkLabel.textContent = t.taskLinkLabel;
      el.focusLabel.textContent = t.focusLabel;
      el.breakLabel.textContent = t.breakLabel;
      el.longLabel.textContent = t.longLabel;
      el.cyclesLabel.textContent = t.cyclesLabel;
      el.goalLabel.textContent = t.goalLabel;
      el.autoLabel.textContent = t.autoLabel;
      el.sessionIntentLabel.textContent = t.sessionIntentLabel;
      el.sessionIntent.placeholder = t.sessionIntentPh;
  
      setSelectOptionText(el.presetSelect, "classic", t.presetClassic);
      setSelectOptionText(el.presetSelect, "deep", t.presetDeep);
      setSelectOptionText(el.presetSelect, "sprint", t.presetSprint);
      setSelectOptionText(el.presetSelect, "custom", t.presetCustom);
  
      el.hubTitle.textContent = t.hubTitle;
      el.hubSubtitle.textContent = t.hubSubtitle;
      if (el.hubSelectLabel) el.hubSelectLabel.textContent = t.hubSelectAria;
      if (el.hubSelect) el.hubSelect.setAttribute("aria-label", t.hubSelectAria);
  
      setSelectOptionText(el.hubSelect, "tasks", t.hubOptTasks);
      setSelectOptionText(el.hubSelect, "stats", t.hubOptStats);
      setSelectOptionText(el.hubSelect, "notes", t.hubOptNotes);
      setSelectOptionText(el.hubSelect, "history", t.hubOptHistory);
  
      el.taskName.placeholder = t.taskNamePh;
      el.taskEst.title = t.taskEstTitle;
      el.addTaskBtn.textContent = t.addTaskBtn;
      el.clearDoneBtn.textContent = t.clearDoneBtn;
      el.seedBtn.textContent = t.seedBtn;
  
      el.stFocusTodayK.textContent = t.stFocusTodayK;
      el.stPomosTodayK.textContent = t.stPomosTodayK;
      el.stStreakK.textContent = t.stStreakK;
      el.stBestHourK.textContent = t.stBestHourK;
      if (el.minUnit) el.minUnit.textContent = t.minUnit;
      el.chartTitle.textContent = t.chartTitle;
      el.chartLegend.textContent = t.chartLegend;
      el.exportCsvBtn.textContent = t.exportCsvBtn;
      el.printReportBtn.textContent = t.printReportBtn;
      el.resetAllBtn.textContent = t.resetAllBtn;
  
      el.noteTitle.textContent = t.noteTitle;
      el.noteHint.textContent = t.noteHint;
      el.noteText.placeholder = t.noteTextPh;
      el.saveNoteBtn.textContent = t.saveNoteBtn;
      el.clearNoteBtn.textContent = t.clearNoteBtn;
      if (el.notesList) el.notesList.setAttribute("aria-label", t.notesAria);
  
      el.historyHint.textContent = t.historyHint;
      el.clearHistoryBtn.textContent = t.clearHistoryBtn;
      if (el.historyList) el.historyList.setAttribute("aria-label", t.historyAria);
  
      if (el.musicTitle) el.musicTitle.textContent = t.musicTitle;
      if (el.musicSubtitle) el.musicSubtitle.textContent = t.musicSubtitle;
      if (el.ambientALabel) el.ambientALabel.textContent = t.ambientALabel;
      if (el.ambientBLabel) el.ambientBLabel.textContent = t.ambientBLabel;
      if (el.ambientVolLabel) el.ambientVolLabel.textContent = t.ambientVolLabel;
      if (el.uploadLabel) el.uploadLabel.textContent = t.uploadLabel;
      if (el.clearUserMusicBtn) el.clearUserMusicBtn.textContent = t.clearUserMusicBtn;
      if (el.focusOnlyLabel) el.focusOnlyLabel.textContent = t.focusOnlyLabel;
      if (el.fadeLabel) el.fadeLabel.textContent = t.fadeLabel;
      if (el.dynamicPingLabel) el.dynamicPingLabel.textContent = t.dynamicPingLabel;
      if (el.ambientNote) el.ambientNote.textContent = t.ambientNote;
      if (el.ambientStopBtn) el.ambientStopBtn.textContent = t.ambientStopBtn;
      if (el.audioBlockHint) el.audioBlockHint.textContent = t.audioBlockHint;
  
      renderAmbientOptions();
      renderAmbient();
      renderTimer();
      syncDrawerLabels();
    }
  
    function notify(title, body) {
      if (!state.settings.notifications) return;
      if (!("Notification" in window)) return;
      if (Notification.permission !== "granted") return;
      try { new Notification(title, { body }); } catch {}
    }
  
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
  
    function setHubPane(key) {
      Object.entries(el.panes).forEach(([k, pane]) => pane.classList.toggle("active", k === key));
      if (el.hubSelect) el.hubSelect.value = key;
    }
  
    if (el.hubSelect) {
      el.hubSelect.addEventListener("change", () => {
        const key = el.hubSelect.value;
        setHubPane(key);
      });
    }
  
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
      syncDrawerLabels();
    });
  
    el.soundToggle.addEventListener("click", () => {
      const t = t9();
      state.settings.sound = !state.settings.sound;
      saveState();
      el.soundIcon.textContent = state.settings.sound ? "🔊" : "🔇";
      el.soundLabel.textContent = state.settings.sound ? t.soundOn : t.soundOff;
      syncDrawerLabels();
    });
  
    el.notifyBtn.addEventListener("click", async () => {
      const t = t9();
      if (!("Notification" in window)) { toast(t.toastNotifDenied); syncDrawerLabels(); return; }
  
      if (Notification.permission === "granted") {
        state.settings.notifications = !state.settings.notifications;
        saveState();
        el.notifyLabel.textContent = state.settings.notifications ? t.notifyEnabled : t.notifyEnable;
        toast(state.settings.notifications ? t.toastNotifOn : t.toastNotifOff);
        syncDrawerLabels();
        return;
      }
  
      const res = await Notification.requestPermission();
      if (res === "granted") {
        state.settings.notifications = true;
        saveState();
        el.notifyLabel.textContent = t.notifyEnabled;
        toast(t.toastNotifOn);
      } else toast(t.toastNotifDenied);
      syncDrawerLabels();
    });
  
    el.fullscreenBtn.addEventListener("click", async () => {
      const t = t9();
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
        el.fsLabel.textContent = document.fullscreenElement ? t.exitFull : t.full;
      } catch {}
      syncDrawerLabels();
    });
  
    document.addEventListener("fullscreenchange", () => {
      const t = t9();
      el.fsLabel.textContent = document.fullscreenElement ? t.exitFull : t.full;
      syncDrawerLabels();
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
      syncAmbientWithFocusState();
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
      const t = t9();
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
            <button class="iconbtn" data-act="set" title="${escapeHTML(t.taskBtnSetTitle)}">🎯</button>
            <button class="iconbtn" data-act="plus" title="${escapeHTML(t.taskBtnPlusTitle)}">+1</button>
            <button class="iconbtn" data-act="del" title="${escapeHTML(t.taskBtnDelTitle)}">✕</button>
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
      const t = t9();
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
          <div class="box"><div class="k">${t.stFocusTodayK}</div><div class="v">${today.minutes} ${t.minUnit}</div></div>
          <div class="box"><div class="k">${t.stPomosTodayK}</div><div class="v">${today.pomos}</div></div>
          <div class="box"><div class="k">${t.stStreakK}</div><div class="v">${streak}</div></div>
          <div class="box"><div class="k">${t.stBestHourK}</div><div class="v">${bestHour}</div></div>
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
      state.ambient.playing = false;
      saveState();
      renderAmbient();
      syncDrawerLabels();
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
  
    // ✅ NOVO: inalador (nebulizer) procedural
    let nebNode = null;
    let nebGain = null;
    let nebFilter = null;
    let nebLfo = null;
    let nebLfoGain = null;
  
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
      if (nebGain)  nebGain.gain.value  = v * 0.65; // ✅ NOVO
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
  
    // ✅ NOVO: start/stop nebulizer
    function stopNebulizer() {
      if (nebNode) {
        try { nebNode.stop(); } catch {}
        nebNode = null;
      }
      if (nebLfo) {
        try { nebLfo.stop(); } catch {}
        nebLfo = null;
      }
      if (nebGain) { try { nebGain.disconnect(); } catch {} nebGain = null; }
      if (nebFilter) { try { nebFilter.disconnect(); } catch {} nebFilter = null; }
      if (nebLfoGain) { try { nebLfoGain.disconnect(); } catch {} nebLfoGain = null; }
    }
  
    function startNebulizer() {
      const ctx = ensureAudioContext();
  
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.35; // mais suave que white
      }
  
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
  
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 950;
      bp.Q.value = 0.85;
  
      const g = ctx.createGain();
      g.gain.value = (baseVol01() * fadeMul) * 0.65;
  
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.32;
  
      const lfoG = ctx.createGain();
      lfoG.gain.value = 0.08;
  
      lfo.connect(lfoG).connect(g.gain);
  
      src.connect(bp).connect(g).connect(ctx.destination);
  
      src.start();
      lfo.start();
  
      nebNode = src;
      nebFilter = bp;
      nebGain = g;
      nebLfo = lfo;
      nebLfoGain = lfoG;
    }
  
    function stopAllAmbientSources() {
      aPlayer.pause(); bPlayer.pause(); userPlayer.pause();
      aPlayer.currentTime = 0; bPlayer.currentTime = 0; userPlayer.currentTime = 0;
      stopWhiteNoise();
      stopNebulizer(); // ✅ NOVO
    }
  
    function setPlayerSourceByKey(player, key) {
      if (key === "none" || key === "white" || key === "user" || key === "nebulizer") { // ✅ inclui nebulizer
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
  
      // ✅ NOVO: inalador procedural
      if (key === "nebulizer") {
        if (!nebNode) startNebulizer();
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
        { v: "nebulizer", label: t.nebulizer }, // ✅ Inalador agora funciona
        { v: "rain",  label: t.rain },
        { v: "ocean", label: t.ocean },
        { v: "stream",label: t.stream },
        { v: "forest",label: t.forest },
        { v: "fire",  label: t.fire },
        { v: "cafe",  label: t.cafe },
        { v: "user",  label: t.user + (state.ambient.userName ? ` (${state.ambient.userName})` : "") },
      ];
  
      const build = (sel, current) => {
        if (!sel) return;
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
      if (el.ambientVolume) el.ambientVolume.value = String(state.ambient.volume ?? 35);
  
      if (el.focusOnlyToggle) el.focusOnlyToggle.checked = !!state.ambient.focusOnly;
      if (el.fadeToggle) el.fadeToggle.checked = !!state.ambient.fade;
      if (el.dynamicPingToggle) el.dynamicPingToggle.checked = !!state.ambient.dynamicPing;
    }
  
    function renderAmbient() {
      const t = t9();
      if (el.ambientState) el.ambientState.textContent = state.ambient.playing ? t.pauseAmbient : t.play;
    }
  
    if (el.ambientToggle) el.ambientToggle.addEventListener("click", async () => { await toggleAmbientManual(); });
    if (el.ambientStopBtn) el.ambientStopBtn.addEventListener("click", async () => { await stopAmbientInternal(); });
  
    if (el.ambientASelect) el.ambientASelect.addEventListener("change", async () => {
      state.ambient.a = el.ambientASelect.value;
      saveState();
      renderAmbientOptions();
      if (state.ambient.playing) await startAmbientInternal();
      await syncAmbientWithFocusState();
    });
  
    if (el.ambientBSelect) el.ambientBSelect.addEventListener("change", async () => {
      state.ambient.b = el.ambientBSelect.value;
      saveState();
      renderAmbientOptions();
      if (state.ambient.playing) await startAmbientInternal();
      await syncAmbientWithFocusState();
    });
  
    if (el.ambientVolume) el.ambientVolume.addEventListener("input", () => {
      state.ambient.volume = parseInt(el.ambientVolume.value || "35", 10);
      saveState();
      setEffectiveVolume(fadeMul);
    });
  
    if (el.focusOnlyToggle) el.focusOnlyToggle.addEventListener("change", async () => {
      state.ambient.focusOnly = !!el.focusOnlyToggle.checked;
      saveState();
      await syncAmbientWithFocusState();
    });
  
    if (el.fadeToggle) el.fadeToggle.addEventListener("change", () => {
      state.ambient.fade = !!el.fadeToggle.checked;
      saveState();
    });
  
    if (el.dynamicPingToggle) el.dynamicPingToggle.addEventListener("change", () => {
      state.ambient.dynamicPing = !!el.dynamicPingToggle.checked;
      saveState();
    });
  
    // Upload do usuário
    let userMusicObjectURL = null;
    if (el.userMusicFile) el.userMusicFile.addEventListener("change", async () => {
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
  
    if (el.clearUserMusicBtn) el.clearUserMusicBtn.addEventListener("click", async () => {
      userPlayer.pause();
      userPlayer.src = "";
      if (userMusicObjectURL) {
        URL.revokeObjectURL(userMusicObjectURL);
        userMusicObjectURL = null;
      }
  
      if (state.ambient.a === "user") state.ambient.a = "none";
      if (state.ambient.b === "user") state.ambient.b = "none";
  
      state.ambient.userName = "";
      if (el.userMusicFile) el.userMusicFile.value = "";
      saveState();
  
      renderAmbientOptions();
      toast(t9().toastSaved);
  
      if (state.ambient.playing) {
        await startAmbientInternal();
        await syncAmbientWithFocusState();
      }
    });
  
    // ---------- Drawer (mobile) ----------
    function openDrawer() {
      if (!drawer.menu) return;
      drawer.backdrop.hidden = false;
      drawer.menu.classList.add("open");
      drawer.menu.setAttribute("aria-hidden", "false");
      syncDrawerLabels();
    }
    function closeDrawer() {
      if (!drawer.menu) return;
      drawer.menu.classList.remove("open");
      drawer.menu.setAttribute("aria-hidden", "true");
      drawer.backdrop.hidden = true;
    }
  
    function syncDrawerLabels() {
      if (!drawer.mLangVal) return;
      const t = t9();
      drawer.mLangVal.textContent = state.settings.lang.toUpperCase();
      drawer.mThemeVal.textContent = state.settings.theme === "light" ? t.light : t.dark;
      drawer.mThemeIco.textContent = state.settings.theme === "light" ? "☀️" : "🌙";
      drawer.mSoundVal.textContent = state.settings.sound ? t.soundOn : t.soundOff;
      drawer.mSoundIco.textContent = state.settings.sound ? "🔊" : "🔇";
      drawer.mNotifyVal.textContent = state.settings.notifications ? "On" : "Off";
      drawer.mFullVal.textContent = document.fullscreenElement ? "On" : "Off";
    }
  
    if (drawer.hambBtn) drawer.hambBtn.addEventListener("click", openDrawer);
    if (drawer.close) drawer.close.addEventListener("click", closeDrawer);
    if (drawer.backdrop) drawer.backdrop.addEventListener("click", closeDrawer);
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  
    if (drawer.mLang) drawer.mLang.addEventListener("click", () => { el.langToggle.click(); syncDrawerLabels(); closeDrawer(); });
    if (drawer.mTheme) drawer.mTheme.addEventListener("click", () => { el.themeToggle.click(); syncDrawerLabels(); });
    if (drawer.mSound) drawer.mSound.addEventListener("click", () => { el.soundToggle.click(); syncDrawerLabels(); });
    if (drawer.mNotify) drawer.mNotify.addEventListener("click", () => { el.notifyBtn.click(); syncDrawerLabels(); });
    if (drawer.mFull) drawer.mFull.addEventListener("click", () => { el.fullscreenBtn.click(); syncDrawerLabels(); });
  
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
      syncDrawerLabels();
    }
  
    function initTopUI() {
      const t = t9();
      el.soundIcon.textContent = state.settings.sound ? "🔊" : "🔇";
      el.soundLabel.textContent = state.settings.sound ? t.soundOn : t.soundOff;
      el.notifyLabel.textContent = state.settings.notifications ? t.notifyEnabled : t.notifyEnable;
      el.fsLabel.textContent = document.fullscreenElement ? t.exitFull : t.full;
      syncDrawerLabels();
    }
  
    function initDailyCounters() {
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
  
      setHubPane(el.hubSelect?.value || "tasks");
  
      const expected = phaseSeconds(state.timer.phase);
      if (!state.timer.totalSec || state.timer.totalSec < 10) state.timer.totalSec = expected;
      if (!state.timer.remainingSec || state.timer.remainingSec > state.timer.totalSec) state.timer.remainingSec = state.timer.totalSec;
  
      state.ambient.playing = false;
      saveState();
  
      renderAll();
      if (state.timer.running) startTick();
    }
  
    init();
  })();