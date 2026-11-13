// v2.6.0
!function () {
  "use strict";

  // ─────────────────────────────────────────────────────────────
  // Exam data interceptor
  // ─────────────────────────────────────────────────────────────
  let __afExamCache = null;
  let __afAnswerCache = { key: null, data: null };
  let __afIsPremium = false;

  (function installExamInterceptor() {
    if (window.__afExamInterceptor) return;
    window.__afExamInterceptor = true;

    const isExamPayload = j =>
      j && j.resultData && j.resultData.paperDetail && Array.isArray(j.resultData.modules);

    const origFetch = window.fetch;
    if (origFetch) {
      window.fetch = async function (...args) {
        const res = await origFetch.apply(this, args);
        try {
          const ct = (res.headers.get("content-type") || "").toLowerCase();
          if (ct.includes("json")) {
            const clone = res.clone();
            const j = await clone.json().catch(() => null);
            if (isExamPayload(j)) __afExamCache = j;
          }
        } catch (e) {}
        return res;
      };
    }

    const XHR = window.XMLHttpRequest;
    if (XHR && XHR.prototype) {
      const origOpen = XHR.prototype.open;
      const origSend = XHR.prototype.send;
      XHR.prototype.open = function () { return origOpen.apply(this, arguments); };
      XHR.prototype.send = function () {
        this.addEventListener("load", function () {
          try {
            if (this.responseType === "" || this.responseType === "text") {
              const j = JSON.parse(this.responseText);
              if (isExamPayload(j)) __afExamCache = j;
            }
          } catch (e) {}
        });
        return origSend.apply(this, arguments);
      };
    }
  })();

  function findExamInVue() {
    try {
      const app = document.getElementById("app");
      if (!app || !app.__vue__) return null;
      const seen = new WeakSet();

      function tryNode(n) {
        if (!n) return null;
        if (n.resultData && n.resultData.paperDetail) return n;
        if (n.paperDetail && Array.isArray(n.modules)) return { resultData: n };
        const wrappers = ["examData", "paperData", "paperDetail", "response", "res",
                          "data", "exam", "paper", "detail", "payload", "result"];
        for (const k of wrappers) {
          const v = n[k];
          if (!v || typeof v !== "object") continue;
          if (v.resultData && v.resultData.paperDetail) return v;
          if (v.paperDetail && Array.isArray(v.modules)) return { resultData: v };
        }
        return null;
      }

      function walk(node, depth) {
        if (!node || typeof node !== "object" || depth > 30 || seen.has(node)) return null;
        if (node.nodeType) return null;
        if (typeof node === "function") return null;
        seen.add(node);

        const direct = tryNode(node);
        if (direct) return direct;

        if (node.$data && typeof node.$data === "object") {
          for (const k in node.$data) {
            const r = walk(node.$data[k], depth + 1);
            if (r) return r;
          }
        }
        if (node._value && typeof node._value === "object") {
          const r = walk(node._value, depth + 1);
          if (r) return r;
        }
        for (const k in node) {
          if (k === "__ob__" || k === "$data" || k === "$children" || k === "$props" ||
              k === "$el" || k === "$parent" || k === "$root" || k[0] === "_") continue;
          let v;
          try { v = node[k]; } catch (e) { continue; }
          if (v && typeof v === "object") {
            const r = walk(v, depth + 1);
            if (r) return r;
          }
        }
        if (Array.isArray(node.$children)) {
          for (const c of node.$children) {
            const r = walk(c, depth + 1);
            if (r) return r;
          }
        }
        return null;
      }
      return walk(app.__vue__, 0);
    } catch (e) { return null; }
  }

  function getStudentName() {
    try {
      const raw = localStorage.getItem("aelStudentLocalStorage");
      if (!raw) return "";
      const obj = JSON.parse(raw);
      return obj && obj.studentName ? String(obj.studentName) : "";
    } catch (e) { return ""; }
  }

  // ─────────────────────────────────────────────────────────────
  // Daily auto-answer quota
  // ─────────────────────────────────────────────────────────────
  const DAILY_LIMIT = 10;
  const DAILY_KEY = "af_daily_auto";

  function todayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function getDailyAuto() {
    const today = todayStr();
    try {
      const raw = localStorage.getItem(DAILY_KEY);
      if (!raw) return { date: today, count: 0 };
      const obj = JSON.parse(raw);
      if (!obj || obj.date !== today) return { date: today, count: 0 };
      return { date: today, count: Number(obj.count) || 0 };
    } catch (e) {
      return { date: today, count: 0 };
    }
  }

  function incrementDailyAuto() {
    const d = getDailyAuto();
    d.count += 1;
    localStorage.setItem(DAILY_KEY, JSON.stringify(d));
    return d.count;
  }

  function canAutoAnswer() {
    if (__afIsPremium) return true;
    return getDailyAuto().count < DAILY_LIMIT;
  }

  // ─────────────────────────────────────────────────────────────
  // Config
  // ─────────────────────────────────────────────────────────────
  const firebaseConfig = {
    apiKey: "AIzaSyDd15smQKX5BWWlQ3PjzZ6cEi18P7zKeWg",
    authDomain: "aplus-5383f.firebaseapp.com",
    projectId: "aplus-5383f",
    storageBucket: "aplus-5383f.firebasestorage.app",
    messagingSenderId: "654012013474",
    appId: "1:654012013474:web:3f2e023a2597af46c8b0fb"
  };

  const ADMIN_USERNAME = "cat_here";
  const SCRIPT_VERSION = 30;
  const LANG_KEY = "af_lang";
  const DEEPSEEK_KEY = "sk-9adbe38c20a94cd38a28165b1bd1c785";
  const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
  let lang = localStorage.getItem(LANG_KEY) || "en";

  const i18n = {
    en: {
      authTitleLogin: "Welcome back", authTitleRegister: "Create account",
      authSubLogin: "Sign in to continue", authSubRegister: "Join the fun",
      authUsername: "Username", authPassword: "Password",
      authLogin: "Log in", authRegister: "Register",
      authSwitchToRegister: "Need an account? Register",
      authSwitchToLogin: "Already have an account? Log in",
      authFillFields: "Fill all fields.", authPasswordMax: "Password max 20 chars.",
      authProcessing: "Processing...", authAccountNotFound: "Account not found.",
      authWrongPassword: "Wrong password.", authBanned: "This account is BANNED.",
      authDeviceRegistered: "This device is already registered.", authUsernameTaken: "Username taken.",
      panelTitle: "Autofill", panelAuto: "Auto", panelAutoVideo: "Auto Video",
      panelSpeed: "Speed", panelCorrect: "Correct",
      panelShowAnswer: "Show answer", panelShowAnswerExam: "Show Answers (Exam)",
      panelProfile: "Profile Search", panelLogout: "Log Out",
      panelPremiumFeature: "Premium feature only.",
      panelDailyLimitHit: "Daily limit reached (10). Premium = unlimited.",
      panelAutoToday: "Auto today",
      examPremiumOnly: "Premium only — ask cat_here for access.",
      examLoading: "Asking DeepSeek…",
      examError: "Failed: ",
      examNoData: "No exam data found. Open the exam first.",
      examImageNote: "⚠ Has image — solve manually.",
      examResultTitle: "Exam Answers",
      examStudent: "Student",
      chatFab: "Chat", chatTitle: "Chat", chatTabGlobal: "Global", chatTabGroups: "Groups",
      chatPlaceholder: "Type a message...", chatSend: "Send", chatSending: "sending…", chatFailed: "failed",
      chatNoMessages: "No messages yet.", chatYourGroups: "Your Groups", chatNewGroup: "+ New Group",
      chatNoGroups: "No groups yet.", chatGroup: "Group",
      chatAddMember: "+ Add Member", chatLeaveGroup: "Leave Group",
      chatCreateGroup: "Create Group", chatGroupName: "Group name",
      chatSearchUsers: "Search users to add...", chatSearchUser: "Search username...",
      chatCancel: "Cancel", chatCreate: "Create", chatClose: "Close", chatAdd: "+ Add",
      chatNoUser: "No user found.", chatAlreadyMember: "Already a member.",
      adminFab: "Admin", adminTitle: "Admin & Mod Panel",
      adminTrollTool: "Troll Tool", adminAllUsers: "All Users",
      adminTroll: "Troll", adminTrollSent: "Sent!",
      adminBan: "Ban", adminUnban: "Unban",
      adminMakeMod: "Make Mod", adminDemod: "Demod",
      adminMe: "Me", adminAdmin: "Admin", adminMod: "Mod",
      adminPremium: "Premium",
      adminGrantPremium: "Grant Premium", adminRevokePremium: "Revoke Premium",
      adminStudentName: "Student",
      trollGugugaga: "GUGUGAGA Spam", trollShake: "Shake Screen", trollFlip: "Flip Screen",
      trollAlert: "Random Alert", trollCursor: "Spooky Cursor", trollZoom: "Infinite Zoom",
      trollGoodImage: "Good Image", trollNiceOverlay: "Nice Overlay",
      trollInvert: "Inverted Colors", trollStatic: "Static Noise + Scream",
      trollDisco: "Disco Party", trollMeltdown: "RGB Meltdown",
      trollCursorRain: "Cursor Rain", trollBlur: "Blur Storm",
      trollMirror: "Horizontal Mirror", trollCrack: "Screen Crack",
      sessionExpired: "Session expired: You logged in from another device.",
      youBanned: "You have been BANNED.", accountBanned: "Account Banned.",
      profileTitle: "Profile Search", profileSearchPlaceholder: "Search username...",
      profileNotFound: "User not found.", profileStatus: "Status",
      profileActive: "Active", profileBanned: "Banned",
      profileAutoStats: "Auto-Answered", profileShowStats: "Answers Viewed", profileYou: "(You)",
      profilePremium: "Premium",
      langLabel: "中", langTitle: "Switch to Cantonese"
    },
    yue: {
      authTitleLogin: "歡迎返嚟", authTitleRegister: "建立帳戶",
      authSubLogin: "登入繼續", authSubRegister: "加入一齊玩",
      authUsername: "用戶名", authPassword: "密碼",
      authLogin: "登入", authRegister: "註冊",
      authSwitchToRegister: "未有帳戶？註冊",
      authSwitchToLogin: "已經有帳戶？登入",
      authFillFields: "請填寫所有欄位。", authPasswordMax: "密碼最多 20 個字。",
      authProcessing: "處理中...", authAccountNotFound: "搵唔到帳戶。",
      authWrongPassword: "密碼錯誤。", authBanned: "呢個帳戶已被封鎖。",
      authDeviceRegistered: "呢部裝置已經註冊咗。", authUsernameTaken: "用戶名已被使用。",
      panelTitle: "自動填寫", panelAuto: "自動", panelAutoVideo: "自動跳過影片",
      panelSpeed: "速度", panelCorrect: "正確率",
      panelShowAnswer: "顯示答案", panelShowAnswerExam: "顯示答案（考試）",
      panelProfile: "查詢個人資料", panelLogout: "登出",
      panelPremiumFeature: "只限高級會員。",
      panelDailyLimitHit: "已達每日上限（10題）。高級會員無限制。",
      panelAutoToday: "今日自動",
      examPremiumOnly: "只限高級會員 —— 問 cat_here 攞權限。",
      examLoading: "問緊 DeepSeek…",
      examError: "失敗：",
      examNoData: "搵唔到考試數據。先開考試。",
      examImageNote: "⚠ 有圖片 —— 自己睇。",
      examResultTitle: "考試答案",
      examStudent: "學生",
      chatFab: "聊天", chatTitle: "聊天", chatTabGlobal: "全體", chatTabGroups: "群組",
      chatPlaceholder: "輸入訊息...", chatSend: "發送", chatSending: "發送緊…", chatFailed: "失敗",
      chatNoMessages: "仲未有訊息。", chatYourGroups: "你嘅群組", chatNewGroup: "+ 新群組",
      chatNoGroups: "仲未有群組。", chatGroup: "群組",
      chatAddMember: "+ 加入成員", chatLeaveGroup: "離開群組",
      chatCreateGroup: "建立群組", chatGroupName: "群組名稱",
      chatSearchUsers: "搜尋要加入嘅用戶...", chatSearchUser: "搜尋用戶名...",
      chatCancel: "取消", chatCreate: "建立", chatClose: "關閉", chatAdd: "+ 加入",
      chatNoUser: "搵唔到用戶。", chatAlreadyMember: "已經係成員。",
      adminFab: "管理員", adminTitle: "管理員及版主面板",
      adminTrollTool: "惡作劇工具", adminAllUsers: "所有用戶",
      adminTroll: "惡作劇", adminTrollSent: "已發送！",
      adminBan: "封鎖", adminUnban: "解封",
      adminMakeMod: "設為版主", adminDemod: "取消版主",
      adminMe: "我", adminAdmin: "管理員", adminMod: "版主",
      adminPremium: "高級",
      adminGrantPremium: "授予高級", adminRevokePremium: "取消高級",
      adminStudentName: "學生",
      trollGugugaga: "GUGUGAGA 洗版", trollShake: "震動畫面", trollFlip: "翻轉畫面",
      trollAlert: "隨機彈窗", trollCursor: "詭異滑鼠", trollZoom: "無限放大",
      trollGoodImage: "優良圖片", trollNiceOverlay: "優良畫面",
      trollInvert: "反轉顏色", trollStatic: "雪花聲效",
      trollDisco: "的士高派對", trollMeltdown: "RGB 溶解",
      trollCursorRain: "滑鼠雨", trollBlur: "模糊風暴",
      trollMirror: "水平鏡像", trollCrack: "螢幕裂痕",
      sessionExpired: "會話已過期：你喺另一部裝置登入咗。",
      youBanned: "你已被封鎖。", accountBanned: "帳戶被封鎖。",
      profileTitle: "查詢個人資料", profileSearchPlaceholder: "搜尋用戶名...",
      profileNotFound: "搵唔到用戶。", profileStatus: "狀態",
      profileActive: "使用中", profileBanned: "被封鎖",
      profileAutoStats: "自動答題", profileShowStats: "睇過答案", profileYou: "(你)",
      profilePremium: "高級",
      langLabel: "EN", langTitle: "切換至英文"
    }
  };

  function t(key) {
    return (i18n[lang] && i18n[lang][key]) || (i18n.en[key] || key);
  }

  function buildTranslationMap(fromLang, toLang) {
    const map = {};
    const from = i18n[fromLang] || {};
    const to = i18n[toLang] || {};
    for (const k in from) {
      if (to[k] && from[k] !== to[k]) map[from[k]] = to[k];
    }
    return map;
  }

  function translateDom(map) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentElement && node.parentElement.closest('#af-root, #af-admin-panel, #af-chat-panel, #af-auth-modal, #af-profile-panel, .af-modal, .af-fab')) {
        const txt = node.nodeValue.trim();
        if (!txt) return;
        if (map[txt]) node.nodeValue = node.nodeValue.replace(txt, map[txt]);
      }
    });
    document.querySelectorAll("#af-root [placeholder], #af-auth-modal [placeholder], #af-chat-panel [placeholder], #af-profile-panel [placeholder], .af-modal [placeholder]").forEach(el => {
      const p = el.getAttribute("placeholder");
      if (map[p]) el.setAttribute("placeholder", map[p]);
    });
  }

  function setLang(newLang) {
    if (newLang === lang) return;
    const oldLang = lang;
    lang = newLang;
    localStorage.setItem(LANG_KEY, newLang);
    translateDom(buildTranslationMap(oldLang, newLang));
    const btn = document.getElementById("af-lang-toggle");
    if (btn) {
      btn.textContent = t("langLabel");
      btn.title = t("langTitle");
    }
  }

  function injectLangToggle() {
    if (document.getElementById("af-lang-toggle")) return;
    const btn = document.createElement("button");
    btn.id = "af-lang-toggle";
    btn.textContent = t("langLabel");
    btn.title = t("langTitle");

    const savedPos = localStorage.getItem("af_lang_pos");
    if (savedPos) {
      try {
        const pos = JSON.parse(savedPos);
        btn.style.left = pos.left + "px";
        btn.style.top = pos.top + "px";
      } catch(e) {}
    }

    let isDragging = false, moved = false, startX = 0, startY = 0, offsetX = 0, offsetY = 0;
    btn.addEventListener("pointerdown", e => {
      isDragging = true; moved = false;
      const r = btn.getBoundingClientRect();
      offsetX = e.clientX - r.left; offsetY = e.clientY - r.top;
      startX = e.clientX; startY = e.clientY;
      btn.style.right = "auto"; btn.style.left = r.left + "px"; btn.style.top = r.top + "px";
      try { btn.setPointerCapture(e.pointerId); } catch(err) {}
    });
    btn.addEventListener("pointermove", e => {
      if (!isDragging) return;
      if (Math.abs(e.clientX - startX) > 4 || Math.abs(e.clientY - startY) > 4) moved = true;
      let nx = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, e.clientX - offsetX));
      let ny = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, e.clientY - offsetY));
      btn.style.left = nx + "px"; btn.style.top = ny + "px";
    });
    btn.addEventListener("pointerup", () => {
      isDragging = false;
      if (moved) {
        const r = btn.getBoundingClientRect();
        localStorage.setItem("af_lang_pos", JSON.stringify({ left: r.left, top: r.top }));
      }
    });
    btn.addEventListener("pointercancel", () => { isDragging = false; });
    btn.onclick = () => { if (!moved) setLang(lang === "en" ? "yue" : "en"); };
    document.body.appendChild(btn);
  }

  async function repairUserData(db, dbMod, myUid, myUsername) {
    const REPAIR_KEY = "af_last_repair";
    const lastRepair = parseInt(localStorage.getItem(REPAIR_KEY)) || 0;
    if (Date.now() - lastRepair < 86400000) return;

    try {
      const [usersSnap, namesSnap] = await Promise.all([
        dbMod.getDocs(dbMod.collection(db, "users")),
        dbMod.getDocs(dbMod.collection(db, "usernames"))
      ]);
      const users = {};
      const names = {};
      usersSnap.forEach(d => {
        const data = d.data() || {};
        if (!data.username) return;
        users[d.id] = { uid: d.id, username: data.username.toLowerCase(), ref: d.ref, data };
      });
      namesSnap.forEach(d => {
        const data = d.data() || {};
        names[d.id] = { docId: d.id, name: d.id, uid: data.uid || null, ref: d.ref, data };
      });

      for (const uid in users) {
        const u = users[uid];
        const n = names[u.username];
        if (n && n.uid !== uid) {
          try { await dbMod.updateDoc(n.ref, { uid: uid }); } catch (e) {}
        }
      }

      if (myUid && myUsername) {
        try {
          const nameRef = dbMod.doc(db, "usernames", myUsername.toLowerCase());
          const nameSnap = await dbMod.getDoc(nameRef);
          if (!nameSnap.exists()) {
            await dbMod.setDoc(nameRef, { uid: myUid });
          } else if (nameSnap.data().uid !== myUid) {
            await dbMod.updateDoc(nameRef, { uid: myUid });
          }
        } catch(e) {}
      }
      localStorage.setItem(REPAIR_KEY, Date.now().toString());
    } catch (e) {}
  }

  async function loadFirebase() {
    const appMod = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    const authMod = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    const dbMod = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    const app = appMod.initializeApp(firebaseConfig);
    return { auth: authMod.getAuth(app), db: dbMod.getFirestore(app), authMod, dbMod };
  }

  const css = `
    :root { --bg:#121214;--surface:#1a1a1e;--surface-hover:#222228;--border:#2c2c33;--border-light:#3a3a44;--text:#e8e8ec;--text-dim:#8b8b96;--text-muted:#5a5a66;--accent:#4a9eff;--accent-hover:#3a8eef;--danger:#e85d5d;--success:#4ac97a;--warning:#f0a850;--radius-sm:6px;--radius:10px;--radius-lg:14px;--shadow:0 4px 20px rgba(0,0,0,0.4); }
    #af-lang-toggle { position:fixed;top:10px;right:10px;z-index:2147483651;background:var(--surface);border:1px solid var(--border);color:var(--text);font-family:"Inter",-apple-system,sans-serif;font-size:12px;font-weight:600;padding:8px 14px;border-radius:var(--radius-sm);cursor:move;box-shadow:var(--shadow);transition:background .15s,border-color .15s;touch-action:none;user-select:none;-webkit-user-select:none; }
    #af-lang-toggle:hover { background:var(--surface-hover);border-color:var(--border-light); }
    #af-auth-modal { position:fixed;inset:0;background:rgba(8,8,10,0.92);backdrop-filter:blur(8px);z-index:2147483648;display:flex;align-items:center;justify-content:center;font-family:"Inter",-apple-system,"Segoe UI",sans-serif; }
    #af-auth-box { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:32px 28px;width:320px;color:var(--text);box-shadow:var(--shadow); }
    #af-auth-box h2 { margin:0 0 4px;font-size:20px;font-weight:600;letter-spacing:-0.3px; }
    #af-auth-box .sub { color:var(--text-dim);font-size:13px;margin-bottom:24px; }
    #af-auth-box input { width:100%;box-sizing:border-box;padding:11px 14px;margin-bottom:10px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:14px;font-family:inherit;outline:none;transition:border-color .15s; }
    #af-auth-box input:focus { border-color:var(--accent); }
    #af-auth-box input::placeholder { color:var(--text-muted); }
    #af-auth-box button { width:100%;padding:11px;margin-top:8px;border:none;border-radius:var(--radius-sm);font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:background .15s,transform .1s; }
    #af-auth-box button:active { transform:scale(0.98); }
    #af-auth-btn { background:var(--accent);color:#fff; }
    #af-auth-btn:hover { background:var(--accent-hover); }
    #af-auth-switch { background:transparent;color:var(--text-dim);font-weight:500;font-size:13px;margin-top:16px; }
    #af-auth-switch:hover { color:var(--text); }
    #af-error { color:var(--danger);font-size:12.5px;text-align:center;margin-bottom:12px;min-height:16px; }
    #af-admin-panel,#af-chat-panel { position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:0;z-index:2147483649;width:520px;max-height:85vh;color:var(--text);font-family:"Inter",-apple-system,sans-serif;box-shadow:var(--shadow);display:flex;flex-direction:column;overflow:hidden; }
    #af-admin-panel { width:760px;max-width:92vw; }
    #af-chat-panel { width:580px; }
    #af-admin-header,#af-chat-header { padding:16px 20px;background:var(--surface);border-bottom:1px solid var(--border);cursor:move;display:flex;justify-content:space-between;align-items:center;user-select:none;touch-action:none; }
    #af-admin-header h2,#af-chat-header h2 { margin:0;font-size:16px;font-weight:600;letter-spacing:-0.2px; }
    #af-admin-header h2 { color:var(--danger); }
    #af-chat-header h2 { color:var(--accent); }
    #af-admin-close,#af-chat-close { background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:22px;line-height:1;padding:0;transition:color .15s; }
    #af-admin-close:hover,#af-chat-close:hover { color:var(--text); }
    #af-admin-content { padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:24px; }
    .af-section-title { font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.2px;font-weight:600;margin-bottom:10px; }
    .af-user-row { display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:14px; }
    .af-user-row:last-child { border-bottom:none; }
    .af-user-row .name { display:flex;align-items:center;gap:10px;font-weight:500; }
    .af-status-dot { width:7px;height:7px;border-radius:50%;flex-shrink:0; }
    .af-status-online { background:var(--success);box-shadow:0 0 6px rgba(74,201,122,0.5); }
    .af-status-offline { background:var(--text-muted); }
    .af-user-row .actions { display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end; }
    .af-user-row button { color:#fff;border:none;padding:5px 10px;border-radius:var(--radius-sm);cursor:pointer;font-size:12px;font-weight:500;font-family:inherit;transition:opacity .15s; }
    .af-user-row button:hover { opacity:0.85; }
    .af-user-row button.ban { background:var(--danger); }
    .af-user-row button.unban { background:var(--success); }
    .af-user-row button.troll { background:#9b6dff; }
    .af-user-row button.mod { background:var(--warning); }
    .af-user-row button.demod { background:var(--text-muted); }
    .af-user-row button.disabled { background:var(--border);color:var(--text-muted);cursor:not-allowed; }
    #af-troll-select,#af-chat-input,#af-search,#af-group-name-input,#af-group-user-search { width:100%;padding:10px 12px;margin-bottom:10px;background:var(--bg);color:var(--text) !important;border:1px solid var(--border);border-radius:var(--radius-sm);box-sizing:border-box;font-family:inherit;font-size:13px;outline:none;transition:border-color .15s; }
    #af-troll-select:focus,#af-chat-input:focus,#af-search:focus,#af-group-name-input:focus,#af-group-user-search:focus { border-color:var(--accent); }
    #af-troll-select option { background:var(--surface);color:var(--text); }
    #af-chat-box { background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);height:220px;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px; }
    #af-group-msg-box { background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);height:260px;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px; }
    .af-chat-msg { font-size:13.5px;line-height:1.5; }
    .af-chat-msg .author { font-weight:600;color:var(--accent);margin-right:6px; }
    .af-chat-msg .author.admin { color:var(--danger); }
    .af-chat-msg .author.mod { color:var(--warning); }
    .af-chat-msg .text { color:var(--text); }
    #af-chat-form,#af-group-msg-form { display:flex;gap:8px;margin-top:12px; }
    #af-chat-input,#af-group-msg-input { margin-bottom:0;flex-grow:1; }
    #af-chat-send,#af-group-msg-send { padding:0 18px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-sm);font-weight:600;font-family:inherit;cursor:pointer;font-size:13px;transition:background .15s; }
    #af-chat-send:hover,#af-group-msg-send:hover { background:var(--accent-hover); }
    .af-tabs { display:flex;border-bottom:1px solid var(--border);background:var(--surface);padding:0 20px; }
    .af-tab { padding:12px 16px;cursor:pointer;font-size:13px;color:var(--text-dim);border-bottom:2px solid transparent;margin-bottom:-1px;font-weight:500;transition:color .15s; }
    .af-tab:hover { color:var(--text); }
    .af-tab.active { color:var(--accent);border-bottom-color:var(--accent); }
    .af-tab-content { padding:16px 20px;overflow-y:auto;flex:1; }
    #af-group-list { display:flex;flex-direction:column;gap:6px;max-height:160px;overflow-y:auto; }
    .af-group-item { display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);cursor:pointer;font-size:13px;transition:border-color .15s; }
    .af-group-item:hover { border-color:var(--border-light); }
    .af-group-item.selected { border-color:var(--accent); }
    .af-group-item .gname { font-weight:600; }
    .af-group-item .gmembers { color:var(--text-dim);font-size:11.5px;margin-top:2px; }
    #af-group-members { display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px; }
    .af-member-chip { background:var(--bg);border:1px solid var(--border);border-radius:20px;padding:4px 10px;font-size:12px;display:flex;align-items:center;gap:6px; }
    .af-member-chip .rm { cursor:pointer;color:var(--danger);font-weight:bold;margin-left:2px; }
    #af-group-search-results { max-height:140px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:10px; }
    .af-search-result { padding:10px 12px;cursor:pointer;font-size:13px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;transition:background .15s; }
    .af-search-result:hover { background:var(--surface-hover); }
    .af-search-result:last-child { border-bottom:none; }
    .af-search-result .add { color:var(--success);font-weight:600; }
    .af-btn { padding:9px 16px;border:none;border-radius:var(--radius-sm);font-size:13px;font-weight:600;cursor:pointer;background:var(--accent);color:#fff;font-family:inherit;transition:background .15s; }
    .af-btn:hover { background:var(--accent-hover); }
    .af-btn.secondary { background:var(--border);color:var(--text); }
    .af-btn.secondary:hover { background:var(--border-light); }
    .af-btn.danger { background:var(--danger); }
    .af-btn.danger:hover { background:#d44; }
    #af-root { position:fixed;bottom:20px;right:20px;z-index:2147483647;width:240px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);font-family:"Inter",-apple-system,sans-serif;font-size:12px;color:var(--text);box-shadow:var(--shadow);user-select:none;-webkit-user-select:none;overflow:hidden; }
    #af-root .bar { display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surface);border-bottom:1px solid var(--border);cursor:move;touch-action:none; }
    #af-root .bar span { font-size:12px;font-weight:600;letter-spacing:0.1px;color:var(--text);pointer-events:none; }
    #af-root .bar b { background:none;border:none;color:var(--text-muted);font-size:16px;font-weight:400;cursor:pointer;padding:0 2px;line-height:1;transition:color .12s;touch-action:manipulation; }
    #af-root .bar b:hover { color:var(--text); }
    #af-root .body { padding:14px; }
    #af-root .row { display:flex;align-items:center;justify-content:space-between;margin-bottom:12px; }
    #af-root .label { font-size:12.5px;color:var(--text-dim);letter-spacing:0.1px; }
    #af-root .toggle { position:relative;width:38px;height:22px;background:var(--border);border-radius:11px;cursor:pointer;transition:background .15s ease;touch-action:manipulation;flex-shrink:0; }
    #af-root .toggle.active { background:var(--accent); }
    #af-root .toggle .knob { position:absolute;top:2px;left:2px;width:18px;height:18px;background:#fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.3);transition:transform .15s ease; }
    #af-root .toggle.active .knob { transform:translateX(16px); }
    #af-root .sliderBlock { margin-bottom:12px; }
    #af-root .sliderHead { display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px; }
    #af-root .sliderRow { display:flex;align-items:center;gap:10px; }
    #af-root .sliderVal { font-size:12px;color:var(--text);font-family:"SF Mono",Consolas,monospace;min-width:46px;text-align:right;letter-spacing:-0.2px; }
    #af-root input[type="range"] { -webkit-appearance:none;appearance:none;flex:1;height:3px;background:var(--border);border-radius:2px;outline:none;touch-action:manipulation; }
    #af-root input[type="range"]::-webkit-slider-thumb { -webkit-appearance:none;appearance:none;width:15px;height:15px;background:#fff;border-radius:50%;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.4);transition:transform .1s; }
    #af-root input[type="range"]::-webkit-slider-thumb:active { transform:scale(1.15); }
    #af-root input[type="range"]::-moz-range-thumb { width:15px;height:15px;background:#fff;border-radius:50%;cursor:pointer;border:none;box-shadow:0 1px 3px rgba(0,0,0,0.4); }
    #af-root button.act { width:100%;padding:9px;background:var(--border);color:var(--text);border:none;border-radius:var(--radius-sm);cursor:pointer;font-size:12.5px;font-weight:500;font-family:inherit;letter-spacing:0.1px;transition:background .12s;touch-action:manipulation;margin-bottom:6px; }
    #af-root button.act:hover { background:var(--border-light); }
    #af-root button.act:active { background:var(--border); }
    #af-root button.act:disabled { opacity:0.6; cursor:wait; }
    #af-root .out { margin-top:10px;padding:10px 11px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);font-family:"SF Mono",Consolas,monospace;font-size:11px;color:var(--text);word-break:break-all;line-height:1.5;display:none;max-height:220px;overflow-y:auto; }
    #af-root .out.show { display:block; }
    #af-root .out .lbl { color:var(--text-muted);font-size:9.5px;text-transform:uppercase;letter-spacing:0.7px;margin-bottom:5px;font-weight:600; }
    #af-root .out .val { color:var(--success); }
    #af-root .out .err { color:var(--danger); }
    #af-root .ans-row { padding:3px 0;border-bottom:1px solid var(--border); }
    #af-root .ans-row:last-child { border-bottom:none; }
    #af-root .ans-q { color:var(--text-muted);margin-right:6px;font-size:10.5px; }
    #af-root .frac { display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 2px;line-height:1.05;color:var(--success);font-family:Georgia,"Times New Roman",serif;font-size:12px; }
    #af-root .frac .num { padding:0 5px; }
    #af-root .frac .den { padding:0 5px;border-top:1px solid var(--success); }
    .af-profile-card { background:var(--bg);border:1px solid var(--border);padding:16px;border-radius:var(--radius);margin-top:10px;text-align:center; }
    .af-profile-card h3 { margin:0 0 6px;color:var(--accent);font-weight:600; }
    .af-profile-stats { font-size:13px;color:var(--text-dim);margin-top:10px; }
    .af-fab { position:fixed;z-index:99999;padding:11px 16px;border:none;border-radius:var(--radius);cursor:move;font-weight:600;touch-action:none;user-select:none;font-family:"Inter",-apple-system,sans-serif;font-size:13px;box-shadow:var(--shadow); }
    .af-fab.chat { top:10px;left:10px;background:var(--accent);color:#fff; }
    .af-fab.admin { top:10px;left:136px;background:var(--danger);color:#fff; }
    .af-fab.open-panel { top:10px;left:262px;background:var(--surface);color:var(--text);border:1px solid var(--border);display:none; }
    ::-webkit-scrollbar { width:6px;height:6px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:var(--border-light);border-radius:3px; }
    ::-webkit-scrollbar-thumb:hover { background:var(--text-muted); }
  `;

  // ─────────────────────────────────────────────────────────────
  // Troll engine
  // ─────────────────────────────────────────────────────────────
  function triggerTroll(action) {
    const old = document.getElementById("af-troll-overlay");
    if (old) old.remove();
    document.querySelectorAll(".af-af-cursor-rain, .af-af-crack, .af-af-disco").forEach(e => e.remove());

    if (window.__afTrollTimeout) clearTimeout(window.__afTrollTimeout);
    if (window.__trollInt) clearInterval(window.__trollInt);
    if (window.__trollInt2) clearInterval(window.__trollInt2);

    if (window.__afTrollActive) {
      document.body.style.animation = window.__afOriginalStyles.animation;
      document.body.style.transform = window.__afOriginalStyles.transform;
      document.body.style.filter = window.__afOriginalStyles.filter;
      document.body.style.transition = window.__afOriginalStyles.transition;
      document.body.style.webkitFilter = window.__afOriginalStyles.webkitFilter;
      document.body.style.textShadow = window.__afOriginalStyles.textShadow;
    } else {
      window.__afOriginalStyles = {
        animation: document.body.style.animation,
        transform: document.body.style.transform,
        filter: document.body.style.filter,
        transition: document.body.style.transition,
        webkitFilter: document.body.style.webkitFilter,
        textShadow: document.body.style.textShadow
      };
      window.__afTrollActive = true;
    }

    const cleanup = () => {
      document.body.style.animation = window.__afOriginalStyles.animation;
      document.body.style.transform = window.__afOriginalStyles.transform;
      document.body.style.filter = window.__afOriginalStyles.filter;
      document.body.style.transition = window.__afOriginalStyles.transition;
      document.body.style.webkitFilter = window.__afOriginalStyles.webkitFilter;
      document.body.style.textShadow = window.__afOriginalStyles.textShadow;

      if (window.__trollInt) { clearInterval(window.__trollInt); window.__trollInt = null; }
      if (window.__trollInt2) { clearInterval(window.__trollInt2); window.__trollInt2 = null; }

      const overlay = document.getElementById("af-troll-overlay");
      if (overlay) overlay.remove();
      document.querySelectorAll(".af-af-cursor-rain, .af-af-crack, .af-af-disco").forEach(e => e.remove());

      document.querySelectorAll('style[id^="af-troll-cursor-"], style[id^="af-shake-style-"], style[id^="af-troll-extra-"]').forEach(el => el.remove());

      window.__afTrollActive = false;
      window.__afTrollTimeout = null;
    };

    const cleanupDelay = 5000;
    window.__afTrollTimeout = setTimeout(cleanup, cleanupDelay);

    // ── existing trolls ──
    if (action === "shake" || action === "gugugaga") {
      const s = document.createElement("style");
      s.id = "af-shake-style-" + Date.now();
      s.textContent = "@keyframes af-shake{0%{transform:translate(1px,1px) rotate(0deg)}10%{transform:translate(-1px,-2px) rotate(-1deg)}20%{transform:translate(-3px,0) rotate(1deg)}30%{transform:translate(3px,2px) rotate(0deg)}40%{transform:translate(1px,-1px) rotate(1deg)}50%{transform:translate(-1px,2px) rotate(-1deg)}60%{transform:translate(-3px,1px) rotate(0deg)}70%{transform:translate(3px,1px) rotate(-1deg)}80%{transform:translate(-1px,-1px) rotate(1deg)}90%{transform:translate(1px,2px) rotate(0deg)}100%{transform:translate(1px,-2px) rotate(-1deg)}}";
      document.head.appendChild(s);
      document.body.style.animation = "af-shake 0.5s infinite";
    }

    if (action === "gugugaga") {
      const overlay = document.createElement("div");
      overlay.id = "af-troll-overlay";
      overlay.style = "position:fixed; inset:0; z-index:2147483645; pointer-events:none; overflow:hidden; background:rgba(0,0,0,0.5);";
      document.body.appendChild(overlay);
      window.__trollInt = setInterval(() => {
        const txt = document.createElement("div");
        txt.textContent = "GUGUGAGA";
        txt.style = `position:absolute; color:red; font-weight:bold; font-family:Comic Sans MS,sans-serif; font-size:${Math.random() * 40 + 20}px; left:${Math.random() * 100}vw; top:${Math.random() * 100}vh; transform:rotate(${Math.random() * 360}deg); opacity:${Math.random() * 0.5 + 0.5};`;
        overlay.appendChild(txt);
        setTimeout(() => txt.remove(), 1500);
      }, 30);
    }

    if (action === "flip") {
      document.body.style.transform = "rotate(180deg)";
    }

    if (action === "alert") alert("You have been trolled!");

    if (action === "good_image") {
      const overlay = document.createElement("div");
      overlay.id = "af-troll-overlay";
      overlay.style = "position:fixed; inset:0; z-index:2147483645; pointer-events:none; display:flex; justify-content:center; align-items:center; background:black;";
      overlay.innerHTML = '<img src="https://raw.githubusercontent.com/StanleyTheProgrammer/gugugaga/main/good_image.jpeg" style="width:100vh; object-fit:cover;">';
      document.body.appendChild(overlay);
    }

    if (action === "nice_overlay") {
      const overlay = document.createElement("div");
      overlay.id = "af-troll-overlay";
      overlay.style = "position:fixed; inset:0; z-index:2147483645; pointer-events:none; background:rgba(255,0,0,0.8); display:flex; justify-content:center; align-items:center; color:white; font-size:10vw; font-family:serif; font-weight:bold; text-shadow:0 0 20px black;";
      overlay.textContent = "NICE TO MEET YOU";
      document.body.appendChild(overlay);
    }

    if (action === "invert") {
      document.body.style.filter = "invert(1) hue-rotate(180deg) contrast(2)";
    }

    if (action === "static") {
      document.body.style.filter = "contrast(200%) grayscale(100%) brightness(50%)";
      const overlay = document.createElement("div");
      overlay.id = "af-troll-overlay";
      overlay.style = "position:fixed; inset:0; z-index:2147483645; pointer-events:none; background:url('https://i.gifer.com/7E2x.gif') center/cover; opacity:0.8;";
      document.body.appendChild(overlay);
      new Audio("https://www.soundjay.com/misc/sounds/static-1.mp3").play().catch(() => {});
    }

    if (action === "troll_cursor") {
      const s = document.createElement("style");
      s.id = "af-troll-cursor-" + Date.now();
      s.textContent = "* { cursor: url('https://cur.cursors-4u.net/cursors/cur-9/cur817.cur'), auto !important; }";
      document.head.appendChild(s);
    }

    if (action === "troll_zoom") {
      document.body.style.transition = "transform 0.1s";
      let scale = 1;
      window.__trollInt = setInterval(() => {
        scale += 0.1;
        document.body.style.transform = `scale(${scale})`;
        if (scale > 3) {
          clearInterval(window.__trollInt);
          window.__trollInt = null;
          cleanup();
        }
      }, 100);
    }

    // ── NEW trolls ──

    if (action === "disco") {
      const s = document.createElement("style");
      s.id = "af-troll-extra-" + Date.now();
      s.textContent = "@keyframes af-disco{0%{filter:hue-rotate(0deg) saturate(2)}25%{filter:hue-rotate(90deg) saturate(3)}50%{filter:hue-rotate(180deg) saturate(2)}75%{filter:hue-rotate(270deg) saturate(3)}100%{filter:hue-rotate(360deg) saturate(2)}}";
      document.head.appendChild(s);
      document.body.style.animation = "af-disco 0.6s infinite";
      const overlay = document.createElement("div");
      overlay.id = "af-troll-overlay";
      overlay.className = "af-af-disco";
      overlay.style = "position:fixed; inset:0; z-index:2147483645; pointer-events:none; mix-blend-mode:overlay; background:radial-gradient(circle at 50% 50%, rgba(255,0,255,0.4), transparent 60%);";
      document.body.appendChild(overlay);
    }

    if (action === "meltdown") {
      document.body.style.transition = "none";
      document.body.style.animation = "none";
      document.body.style.textShadow = "3px 0 red, -3px 0 cyan";
      document.body.style.filter = "contrast(1.6) saturate(1.4)";
      let shift = 0;
      window.__trollInt = setInterval(() => {
        shift = (shift + 1) % 4;
        document.body.style.transform = `translate(${shift}px, ${-shift}px) skewX(${shift * 0.2}deg)`;
      }, 80);
    }

    if (action === "cursorrain") {
      const overlay = document.createElement("div");
      overlay.id = "af-troll-overlay";
      overlay.className = "af-af-cursor-rain";
      overlay.style = "position:fixed; inset:0; z-index:2147483645; pointer-events:none; overflow:hidden;";
      document.body.appendChild(overlay);
      window.__trollInt = setInterval(() => {
        for (let i = 0; i < 3; i++) {
          const c = document.createElement("div");
          c.textContent = "🖱️";
          c.style = `position:absolute; top:-40px; left:${Math.random() * 100}vw; font-size:${Math.random() * 30 + 16}px; animation: af-cursorfall linear forwards; animation-duration:${Math.random() * 1.5 + 1.2}s;`;
          overlay.appendChild(c);
          setTimeout(() => c.remove(), 3000);
        }
      }, 80);
      if (!document.getElementById("af-cursorfall-keyframes")) {
        const s = document.createElement("style");
        s.id = "af-cursorfall-keyframes";
        s.textContent = "@keyframes af-cursorfall{from{transform:translateY(0) rotate(0deg)}to{transform:translateY(110vh) rotate(360deg)}}";
        document.head.appendChild(s);
      }
    }

    if (action === "blur") {
      document.body.style.transition = "filter 0.4s";
      let amt = 0, dir = 1;
      window.__trollInt = setInterval(() => {
        amt += dir * 1.5;
        if (amt >= 8) dir = -1;
        if (amt <= 0) dir = 1;
        document.body.style.filter = `blur(${amt.toFixed(1)}px)`;
      }, 120);
    }

    if (action === "mirror") {
      document.body.style.transform = "scaleX(-1)";
    }

    if (action === "crack") {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "af-af-crack");
      svg.setAttribute("style", "position:fixed;inset:0;width:100vw;height:100vh;z-index:2147483646;pointer-events:none;");
      let paths = "";
      const cx = 50 + Math.random() * 20 - 10;
      const cy = 50 + Math.random() * 20 - 10;
      for (let i = 0; i < 22; i++) {
        const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.4;
        const x2 = cx + Math.cos(angle) * (30 + Math.random() * 40);
        const y2 = cy + Math.sin(angle) * (30 + Math.random() * 40);
        const mx = cx + Math.cos(angle) * (10 + Math.random() * 20);
        const my = cy + Math.sin(angle) * (10 + Math.random() * 20);
        paths += `<polyline points="${cx},${cy} ${mx},${my} ${x2},${y2}" fill="none" stroke="white" stroke-width="${(Math.random() * 1.5 + 0.6).toFixed(2)}" opacity="${(Math.random() * 0.5 + 0.5).toFixed(2)}"/>`;
      }
      for (let ring = 0; ring < 3; ring++) {
        const r = 8 + ring * 14;
        let pts = "";
        for (let i = 0; i <= 24; i++) {
          const a = (i / 24) * Math.PI * 2;
          const rr = r + (Math.random() * 6 - 3);
          pts += `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr} `;
        }
        paths += `<polyline points="${pts}" fill="none" stroke="white" stroke-width="0.6" opacity="0.6"/>`;
      }
      svg.innerHTML = paths;
      document.body.appendChild(svg);
      setTimeout(() => {
        try { new Audio("https://www.soundjay.com/button/sounds/glass-break-1.mp3").play().catch(() => {}); } catch (e) {}
      }, 50);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // DeepSeek exam solver
  // ─────────────────────────────────────────────────────────────
  function examCacheKey(exam) {
    const p = exam.resultData.paperDetail || {};
    const ids = [];
    for (const m of exam.resultData.modules || [])
      for (const q of m.questions || [])
        ids.push(q.questionId + ":" + (q.childQuestions || []).length);
    return (p.paperNo || "?") + "|" + ids.join(",");
  }

  async function askDeepSeekForExam(exam) {
    const key = examCacheKey(exam);
    if (__afAnswerCache.key === key) return __afAnswerCache.data;

    const blocks = [];
    for (const mod of exam.resultData.modules || []) {
      for (const q of mod.questions || []) {
        const body = (q.question || []).map(c => {
          if (c.contentType === "PICTURE") return `[IMAGE_URL: ${c.content}]`;
          return c.content || "";
        }).join("\n");
        const blanks = (q.childQuestions || []).map(cq => {
          const opts = (cq.options || []).map(o => `${o.optionNo}. ${o.optionContent}`).join(" | ");
          const stu = cq.studentAnswer ? ` (student chose: ${cq.studentAnswer})` : "";
          return `  Blank ${cq.questionNo}: ${opts || "(fill-in)"}${stu}`;
        }).join("\n");
        blocks.push(`Q${q.serialNo} [${q.questionType}]:\n${body}\n${blanks}`);
      }
    }

    const sys = "You solve Hong Kong primary-school math exams written in Traditional Chinese. " +
      "Return STRICT JSON only: outer keys = question serialNo as string; inner object maps blank number to the correct answer " +
      "(option letter(s) for choice, numeric/text for fill-in). " +
      "If a question depends on an image you cannot see, set that blank to \"IMAGE_REQUIRED\". " +
      "Do not include explanations, markdown, or code fences.";

    const usr = `Exam: ${(exam.resultData.paperDetail && exam.resultData.paperDetail.homeworkName) || ""}\n\n` +
      blocks.join("\n\n---\n\n") +
      "\n\nReturn the JSON object now.";

    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + DEEPSEEK_KEY
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "system", content: sys }, { role: "user", content: usr }],
        temperature: 0.0,
        response_format: { type: "json_object" }
      })
    });

    if (!res.ok) {
      const txt = (await res.text()).slice(0, 300);
      throw new Error(`DeepSeek ${res.status}: ${txt}`);
    }
    const j = await res.json();
    let raw = ((j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || "").trim();
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();

    let parsed = null;
    try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }

    __afAnswerCache = { key, data: { parsed, raw } };
    return __afAnswerCache.data;
  }

  function renderExamAnswers(exam, api) {
    let html = '<div class="lbl">' + t("examResultTitle") + '</div>';
    if (!api.parsed) {
      html += '<div style="white-space:pre-wrap;font-size:11px;color:var(--text);">' +
        escapeHtml(api.raw || "(empty)") + '</div>';
      return html;
    }
    for (const mod of exam.resultData.modules || []) {
      for (const q of mod.questions || []) {
        const a = api.parsed[q.serialNo] !== undefined ? api.parsed[q.serialNo] : api.parsed[String(q.serialNo)];
        const hasImage = (q.question || []).some(c => c.contentType === "PICTURE");
        html += '<div class="ans-row">';
        html += '<span class="ans-q">Q' + q.serialNo + '</span> ';
        if (a && typeof a === "object") {
          const parts = Object.keys(a).sort().map(b => String(a[b]));
          if (parts.every(p => p === "IMAGE_REQUIRED")) {
            html += '<span style="color:var(--warning);font-size:11px;">' + t("examImageNote") + '</span>';
          } else {
            html += '<span class="val">' + parts.map(escapeHtml).join(" | ") + '</span>';
            const stu = (q.childQuestions || []).map(cq => cq.studentAnswer).filter(Boolean);
            if (stu.length) {
              html += ' <span style="color:var(--text-muted);font-size:10px;">(' +
                t("examStudent") + ': ' + stu.map(escapeHtml).join(" | ") + ')</span>';
            }
          }
        } else if (typeof a === "string") {
          html += '<span class="val">' + escapeHtml(a) + '</span>';
        } else {
          html += '<span style="color:var(--warning);font-size:11px;">' +
            (hasImage ? t("examImageNote") : "?") + '</span>';
        }
        html += '</div>';
      }
    }
    return html;
  }

  // ─────────────────────────────────────────────────────────────
  // Auth
  // ─────────────────────────────────────────────────────────────
  async function initAuth() {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    injectLangToggle();

    const { auth, db, authMod, dbMod } = await loadFirebase();

    dbMod.setDoc(dbMod.doc(db, "config", "version"), { current: SCRIPT_VERSION }, { merge: true }).catch(() => {});

    const savedUserRaw = localStorage.getItem("aplus_saved_user");
    if (savedUserRaw) {
      try {
        const saved = JSON.parse(savedUserRaw);
        await authMod.signInAnonymously(auth);
        const resolvedUid = saved.uid || auth.currentUser.uid;
        const userSnap = await dbMod.getDoc(dbMod.doc(db, "users", resolvedUid));

        if (userSnap.exists() && userSnap.data().isBanned && saved.username !== ADMIN_USERNAME) {
          localStorage.removeItem("aplus_saved_user");
          throw new Error(t("accountBanned"));
        }
        if (saved.username === ADMIN_USERNAME && userSnap.exists() && userSnap.data().isBanned) {
          await dbMod.updateDoc(dbMod.doc(db, "users", resolvedUid), { isBanned: false });
        }

        startHack(resolvedUid, saved.username, db, dbMod, auth, authMod);
        return;
      } catch (e) {
        console.log("Auto-login failed", e);
      }
    }

    const modal = document.createElement("div");
    modal.id = "af-auth-modal";
    modal.innerHTML = `
      <div id="af-auth-box">
        <h2 id="af-auth-title">${t("authTitleLogin")}</h2>
        <div class="sub" id="af-auth-sub">${t("authSubLogin")}</div>
        <div id="af-error"></div>
        <input type="text" id="af-username" placeholder="${t("authUsername")}" autocomplete="off">
        <input type="password" id="af-password" placeholder="${t("authPassword")}" maxlength="20">
        <button id="af-auth-btn">${t("authLogin")}</button>
        <button id="af-auth-switch">${t("authSwitchToRegister")}</button>
      </div>`;
    document.body.appendChild(modal);

    let isLogin = true;
    document.getElementById("af-auth-switch").onclick = () => {
      isLogin = !isLogin;
      document.getElementById("af-auth-title").textContent = isLogin ? t("authTitleLogin") : t("authTitleRegister");
      document.getElementById("af-auth-sub").textContent = isLogin ? t("authSubLogin") : t("authSubRegister");
      document.getElementById("af-auth-btn").textContent = isLogin ? t("authLogin") : t("authRegister");
      document.getElementById("af-auth-switch").textContent = isLogin ? t("authSwitchToRegister") : t("authSwitchToLogin");
      document.getElementById("af-error").textContent = "";
    };

    document.getElementById("af-auth-btn").onclick = async () => {
      const u = document.getElementById("af-username").value.trim().toLowerCase();
      const p = document.getElementById("af-password").value;
      const errDiv = document.getElementById("af-error");
      const btn = document.getElementById("af-auth-btn");

      if (!u || !p) return errDiv.textContent = t("authFillFields");
      if (p.length > 20) return errDiv.textContent = t("authPasswordMax");
      btn.disabled = true;
      errDiv.textContent = t("authProcessing");

      try {
        const usernameRef = dbMod.doc(db, "usernames", u);

        if (isLogin) {
          const snap = await dbMod.getDoc(usernameRef);
          if (!snap.exists()) throw new Error(t("authAccountNotFound"));
          const data = snap.data();
          if (data.password !== p) throw new Error(t("authWrongPassword"));

          await authMod.signInAnonymously(auth);
          const realUid = auth.currentUser.uid;

          const userSnap = await dbMod.getDoc(dbMod.doc(db, "users", data.uid));
          if (userSnap.exists() && userSnap.data().isBanned && u !== ADMIN_USERNAME) {
            await authMod.signOut(auth);
            throw new Error(t("authBanned"));
          }

          const finalUid = data.uid || realUid;
          localStorage.setItem("aplus_saved_user", JSON.stringify({ uid: finalUid, username: u }));
          modal.remove();
          startHack(finalUid, u, db, dbMod, auth, authMod);
        } else {
          let deviceId = localStorage.getItem("aplus_device_id");
          if (!deviceId) {
            deviceId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
            localStorage.setItem("aplus_device_id", deviceId);
          }
          const deviceRef = dbMod.doc(db, "devices", deviceId);
          const dSnap = await dbMod.getDoc(deviceRef);
          if (dSnap.exists()) throw new Error(t("authDeviceRegistered"));

          const uSnap = await dbMod.getDoc(usernameRef);
          if (uSnap.exists()) throw new Error(t("authUsernameTaken"));

          const cred = await authMod.signInAnonymously(auth);
          const uid = cred.user.uid;

          await dbMod.setDoc(usernameRef, { uid, password: p });
          await dbMod.setDoc(deviceRef, { uid });
          await dbMod.setDoc(dbMod.doc(db, "users", uid), {
            username: u, isBanned: false, isMod: false, isPremium: false,
            createdAt: Date.now(), lastSeen: Date.now(),
            autoStats: 0, showStats: 0
          });

          localStorage.setItem("aplus_saved_user", JSON.stringify({ uid, username: u }));
          modal.remove();
          startHack(uid, u, db, dbMod, auth, authMod);
        }
      } catch (e) {
        errDiv.textContent = e.message;
      } finally {
        btn.disabled = false;
      }
    };
  }

  function startHack(uid, username, db, dbMod, auth, authMod) {
    repairUserData(db, dbMod, uid, username);

    dbMod.updateDoc(dbMod.doc(db, "users", uid), { lastSeen: Date.now() }).catch(() => {});
    const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
    dbMod.updateDoc(dbMod.doc(db, "users", uid), { activeSessionId: sessionId }).catch(() => {});

    dbMod.getDoc(dbMod.doc(db, "users", uid)).then(s => {
      if (s.exists()) __afIsPremium = !!s.data().isPremium;
    }).catch(() => {});

    const sessionListener = dbMod.onSnapshot(dbMod.doc(db, "users", uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.activeSessionId && data.activeSessionId !== sessionId) {
          sessionListener();
          localStorage.removeItem("aplus_saved_user");
          alert(t("sessionExpired"));
          authMod.signOut(auth).finally(() => location.reload());
        }
      }
    });

    dbMod.onSnapshot(dbMod.doc(db, "config", "version"), (snap) => {
      if (snap.exists() && snap.data().current > SCRIPT_VERSION) {
        location.reload();
      }
    });

    if (window.__afLcWatch) clearInterval(window.__afLcWatch);
    window.__afLcWatch = setInterval(() => {
      if (!localStorage.getItem("aplus_saved_user")) {
        clearInterval(window.__afLcWatch);
        authMod.signOut(auth).finally(() => location.reload());
      }
    }, 2000);

    let isMod = false;

    async function ensureAdmin() {
      if (document.getElementById("af-admin-fab")) return;
      try {
        const s = await dbMod.getDoc(dbMod.doc(db, "users", uid));
        isMod = s.exists() && s.data().isMod;
        if (username === ADMIN_USERNAME || isMod) injectAdminPanel(db, dbMod, username);
      } catch (e) {
        if (username === ADMIN_USERNAME) injectAdminPanel(db, dbMod, username);
      }
    }
    ensureAdmin();
    setInterval(ensureAdmin, 5000);

    setInterval(async () => {
      try { await dbMod.updateDoc(dbMod.doc(db, "users", uid), { lastSeen: Date.now() }); } catch (e) {}
    }, 15000);

    setInterval(async () => {
      try {
        const snap = await dbMod.getDoc(dbMod.doc(db, "users", uid));
        if (snap.exists()) {
          const data = snap.data();
          isMod = data.isMod;
          __afIsPremium = !!data.isPremium;
          if (data.isBanned) {
            if (username === ADMIN_USERNAME) {
              await dbMod.updateDoc(dbMod.doc(db, "users", uid), { isBanned: false });
            } else {
              alert(t("youBanned"));
              localStorage.removeItem("aplus_saved_user");
              await authMod.signOut(auth);
              location.reload();
            }
          }
        }
      } catch (e) {}
    }, 3000);

    let lastTimestamp = parseInt(localStorage.getItem('af_last_troll_ts')) || 0;
    let bc;
    try { bc = new BroadcastChannel('af_troll_sync'); } catch(e) {}

    dbMod.getDoc(dbMod.doc(db, "commands", uid)).then(snap => {
      if (!snap.exists()) return;
      const data = snap.data();
      if (data.timestamp && data.timestamp > lastTimestamp) {
        lastTimestamp = data.timestamp;
        localStorage.setItem('af_last_troll_ts', lastTimestamp);
        if (bc) bc.postMessage({ ts: lastTimestamp });
        triggerTroll(data.action);
      }
    }).catch(() => {});

    setInterval(async () => {
      try {
        const s = await dbMod.getDoc(dbMod.doc(db, "commands", uid));
        if (s.exists()) {
          const data = s.data();
          if (data.timestamp && data.timestamp > lastTimestamp) {
            lastTimestamp = data.timestamp;
            localStorage.setItem('af_last_troll_ts', lastTimestamp);
            if (bc) bc.postMessage({ ts: lastTimestamp });
            triggerTroll(data.action);
          }
        }
      } catch(e) {}
    }, 2000);

    if (bc) {
      bc.onmessage = (e) => {
        if (e.data.ts > lastTimestamp) {
          lastTimestamp = e.data.ts;
          localStorage.setItem('af_last_troll_ts', lastTimestamp);
        }
      };
    }

    function autoSkipVideo() {
      if (!__afIsPremium) return;
      if (localStorage.getItem("af_autoskip_video") === "0") return;
      const video = document.querySelector("div.video_box > video") ||
                    document.querySelector("div.ael_video video") ||
                    document.querySelector("div.current_video_box video") ||
                    document.querySelector("video");
      if (!video || video.dataset.autoskipped === "true") return;
      if (video.readyState >= 1 && isFinite(video.duration) && video.duration > 0) {
        video.dataset.autoskipped = "true";
        const target = Math.max(0, video.duration - 0.5);
        video.currentTime = target;
        let attempts = 0;
        const retry = setInterval(() => {
          if (attempts++ > 15) { clearInterval(retry); return; }
          if (Math.abs(video.currentTime - target) > 0.5) {
            try { video.currentTime = target; } catch(e) {}
          }
        }, 200);
        setTimeout(() => {
          if (video.paused) video.play().catch(()=>{});
          autoClickContinue();
        }, 300);
      }
    }

    function autoClickContinue() {
      if (localStorage.getItem("af_autoclick_continue") === "0") return;
      const btns = document.querySelectorAll('.btn_box .ael_btn_green');
      for (const btn of btns) {
        const txt = btn.textContent.trim();
        if (txt === '前往練習' || txt === 'Go to Practice' || txt === 'Start' || txt === 'Continue' || txt === 'Next') {
          btn.click(); break;
        }
      }
    }

    document.addEventListener("ended", (e) => {
      if (e.target.tagName === "VIDEO") autoClickContinue();
    }, true);

    const observer = new MutationObserver(() => autoSkipVideo());
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(autoSkipVideo, 1000);

    injectAplusGUI(uid, username, db, dbMod, () => {}, () => {});
    injectChatPanel(uid, username, db, dbMod);
  }

  // ─────────────────────────────────────────────────────────────
  // Main panel
  // ─────────────────────────────────────────────────────────────
  function injectAplusGUI(uid, username, db, dbMod, onAuto, onShow) {
    const existing = document.getElementById("af-root");
    if (existing) {
      existing.style.display = "block";
      const reOpen = document.getElementById("af-reopen-btn");
      if (reOpen) reOpen.style.display = "none";
      if (localStorage.getItem('af_auto_ans') === '1' && typeof existing._restartLoop === 'function') {
        if (existing._resetLastKey) existing._resetLastKey();
        existing._restartLoop();
      }
      return;
    }

    const reOpenBtn = document.getElementById("af-reopen-btn");
    if (reOpenBtn) reOpenBtn.remove();

    const root = document.createElement("div");
    root.id = "af-root";
    root.innerHTML = `
      <div class="bar" id="af-bar"><span>${t("panelTitle")}</span><b id="af-x">&times;</b></div>
      <div class="body">
        <div class="row"><span class="label">${t("panelAuto")}</span><div class="toggle ${localStorage.getItem('af_auto_ans') === '1' ? 'active' : ''}" id="af-toggle"><div class="knob"></div></div></div>
        <div id="af-daily-indicator" style="display:none;font-size:10.5px;color:var(--text-muted);margin:-6px 0 10px 0;"></div>
        <div class="row"><span class="label">${t("panelAutoVideo")}</span><div class="toggle ${__afIsPremium && localStorage.getItem('af_autoskip_video') !== '0' ? 'active' : ''}" id="af-autoskip-toggle"><div class="knob"></div></div></div>
        <div class="sliderBlock">
          <div class="sliderHead"><span class="label">${t("panelSpeed")}</span><span class="sliderVal" id="af-speed-val">${localStorage.getItem('af_speed') || 900}ms</span></div>
          <div class="sliderRow"><input type="range" id="af-speed" min="${__afIsPremium ? 10 : 400}" max="3000" step="10" value="${localStorage.getItem('af_speed') || 900}"></div>
        </div>
        <div class="sliderBlock">
          <div class="sliderHead"><span class="label">${t("panelCorrect")}</span><span class="sliderVal" id="af-val">${localStorage.getItem('af_correct') || 85}%</span></div>
          <div class="sliderRow"><input type="range" id="af-slider" min="50" max="100" step="1" value="${localStorage.getItem('af_correct') || 85}"></div>
        </div>
        <button class="act" id="af-show">${t("panelShowAnswer")}</button>
        <button class="act" id="af-show-exam">${t("panelShowAnswerExam")}</button>
        <button class="act" id="af-profile-btn">${t("panelProfile")}</button>
        <button class="act" id="af-logout" style="background:var(--danger); color:#fff;">${t("panelLogout")}</button>
        <div class="out" id="af-out"></div>
      </div>`;
    document.body.appendChild(root);

    const bar = document.getElementById("af-bar");
    const toggle = document.getElementById("af-toggle");
    const autoskipToggle = document.getElementById("af-autoskip-toggle");
    const slider = document.getElementById("af-slider");
    const sliderVal = document.getElementById("af-val");
    const speedSlider = document.getElementById("af-speed");
    const speedVal = document.getElementById("af-speed-val");
    const closeBtn = document.getElementById("af-x");
    const showBtn = document.getElementById("af-show");
    const examBtn = document.getElementById("af-show-exam");
    const profileBtn = document.getElementById("af-profile-btn");
    const logoutBtn = document.getElementById("af-logout");
    const outEl = document.getElementById("af-out");
    const dailyIndicator = document.getElementById("af-daily-indicator");

    let drag = false, ox = 0, oy = 0;
    let autoEnabled = localStorage.getItem('af_auto_ans') === '1';
    let correctChance = parseInt(localStorage.getItem('af_correct')) || 85;
    let advanceDelay = parseInt(localStorage.getItem('af_speed')) || 900;
    let lastKey = null;
    let busy = false;
    let tickTimer = null;

    function updateDailyIndicator() {
      if (!dailyIndicator) return;
      if (__afIsPremium) {
        dailyIndicator.style.display = "none";
        return;
      }
      const d = getDailyAuto();
      dailyIndicator.style.display = "block";
      dailyIndicator.textContent = t("panelAutoToday") + ": " + d.count + "/" + DAILY_LIMIT;
    }

    function applyPremiumUI() {
      speedSlider.min = __afIsPremium ? "10" : "400";
      if (!__afIsPremium && parseInt(speedSlider.value, 10) < 400) {
        speedSlider.value = "400";
        speedVal.textContent = "400ms";
        advanceDelay = 400;
        localStorage.setItem("af_speed", 400);
      }
      if (!__afIsPremium) {
        autoskipToggle.classList.remove("active");
        localStorage.setItem("af_autoskip_video", "0");
        autoskipToggle.style.opacity = "0.4";
        autoskipToggle.style.cursor = "not-allowed";
      } else {
        autoskipToggle.style.opacity = "";
        autoskipToggle.style.cursor = "";
      }
      updateDailyIndicator();
    }

    applyPremiumUI();

    (async () => {
      try {
        const s = await dbMod.getDoc(dbMod.doc(db, "users", uid));
        if (s.exists()) __afIsPremium = !!s.data().isPremium;
      } catch (e) {}
      applyPremiumUI();
    })();

    let lastPremState = __afIsPremium;
    setInterval(() => {
      if (__afIsPremium !== lastPremState) {
        lastPremState = __afIsPremium;
        applyPremiumUI();
      }
    }, 1000);

    bar.addEventListener("pointerdown", e => {
      if (e.target.id === "af-x") return;
      e.preventDefault();
      drag = true; ox = e.clientX; oy = e.clientY;
      const r = root.getBoundingClientRect();
      root.style.right = "auto"; root.style.bottom = "auto";
      root.style.left = r.left + "px"; root.style.top = r.top + "px";
      try { bar.setPointerCapture(e.pointerId); } catch (err) {}
    });
    bar.addEventListener("pointermove", e => {
      if (!drag) return;
      e.preventDefault();
      const dx = e.clientX - ox, dy = e.clientY - oy;
      const r = root.getBoundingClientRect();
      let nx = r.left + dx, ny = r.top + dy;
      nx = Math.max(0, Math.min(window.innerWidth - root.offsetWidth, nx));
      ny = Math.max(0, Math.min(window.innerHeight - root.offsetHeight, ny));
      root.style.left = nx + "px"; root.style.top = ny + "px";
      ox = e.clientX; oy = e.clientY;
    });
    bar.addEventListener("pointerup", () => drag = false);
    bar.addEventListener("pointercancel", () => drag = false);

    logoutBtn.onclick = () => {
      localStorage.removeItem("aplus_saved_user");
      location.reload();
    };
    profileBtn.onclick = () => injectProfilePanel(uid, db, dbMod);

    autoskipToggle.addEventListener("click", () => {
      if (!__afIsPremium) {
        outEl.innerHTML = '<div class="lbl">Premium</div><div class="err">' + t("panelPremiumFeature") + '</div>';
        outEl.classList.add("show");
        return;
      }
      autoskipToggle.classList.toggle("active");
      localStorage.setItem("af_autoskip_video", autoskipToggle.classList.contains("active") ? "1" : "0");
    });

    function waitFor(fn, timeout, interval) {
      timeout = timeout || 1000; interval = interval || 50;
      return new Promise(resolve => {
        const start = Date.now();
        (function check() {
          let v; try { v = fn(); } catch (e) { v = null; }
          if (v) return resolve(v);
          if (Date.now() - start >= timeout) return resolve(null);
          setTimeout(check, interval);
        })();
      });
    }

    function getQuestion() {
      try {
        const app = document.getElementById("app");
        if (!app || !app.__vue__) return null;
        function walk(node, depth) {
          if (!node || typeof node !== "object" || depth > 15) return null;
          if (node.__ob__) return null;
          if (node.currentQuestion && node.currentQuestion.childQuestions) return node.currentQuestion;
          if (node.currentQuestion && node.currentQuestion.questionId) return node.currentQuestion;
          if (node.childQuestions && Array.isArray(node.childQuestions)) return node;
          if (node.$data) {
            for (const k in node.$data) {
              const v = node.$data[k];
              if (v && typeof v === "object") {
                const r = walk(v, depth + 1);
                if (r) return r;
              }
            }
          }
          if (node.$children) {
            for (const c of node.$children) {
              const r = walk(c, depth + 1);
              if (r) return r;
            }
          }
          return null;
        }
        return walk(app.__vue__, 0);
      } catch (e) { return null; }
    }

    function getQuestionKey(q) {
      if (!q) return null;
      if (q.questionId) return q.questionId;
      if (q.childQuestions) return JSON.stringify(q.childQuestions.map(x => x.questionAnswer));
      return null;
    }

    function rollCorrect() { return Math.random() * 100 < correctChance; }
    function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    function renderValue(raw) {
      if (Array.isArray(raw)) raw = raw.join(" ; ");
      raw = String(raw);
      const re = /\$\$\s*\\+frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}\s*\$\$/g;
      const parts = [];
      let last = 0, m, found = false;
      while ((m = re.exec(raw)) !== null) {
        found = true;
        parts.push(esc(raw.slice(last, m.index)));
        parts.push('<span class="frac"><span class="num">' + esc(m[1]) + '</span><span class="den">' + esc(m[2]) + "</span></span>");
        last = re.lastIndex;
      }
      if (!found) return esc(raw);
      parts.push(esc(raw.slice(last)));
      return parts.join("");
    }

    showBtn.addEventListener("click", async () => {
      const q = getQuestion();
      if (!q || !q.childQuestions || !q.childQuestions.length) {
        outEl.innerHTML = '<div class="lbl">Result</div><div class="err">No question found.</div>';
        outEl.classList.add("show");
        return;
      }
      const list = q.childQuestions.filter(c => c.questionAnswer);
      if (!list.length) {
        outEl.innerHTML = '<div class="lbl">Result</div><div class="err">No answer found.</div>';
        outEl.classList.add("show");
        return;
      }
      let html = '<div class="lbl">Answer</div>';
      list.forEach(c => {
        html += '<div class="ans-row">';
        if (list.length > 1) html += '<span class="ans-q">Q' + c.questionNo + "</span>";
        html += '<span class="val">' + renderValue(c.questionAnswer) + "</span></div>";
      });
      outEl.innerHTML = html;
      outEl.classList.add("show");
      if (onShow) onShow();
      dbMod.updateDoc(dbMod.doc(db, "users", uid), { showStats: dbMod.increment(1) }).catch(() => {});
    });

    examBtn.addEventListener("click", async () => {
      const premium = username === ADMIN_USERNAME || __afIsPremium ||
        (await dbMod.getDoc(dbMod.doc(db, "users", uid)).then(s => s.exists() && !!s.data().isPremium).catch(() => false));

      if (!premium) {
        outEl.innerHTML = '<div class="lbl">Error</div><div class="err">' + t("examPremiumOnly") + '</div>';
        outEl.classList.add("show");
        return;
      }

      const exam = __afExamCache || findExamInVue();
      if (!exam) {
        outEl.innerHTML =
          '<div class="lbl">Error</div><div class="err">' + t("examNoData") + '</div>' +
          '<div style="margin-top:6px;color:var(--text-dim);font-size:11px;">Paste the exam JSON response below:</div>' +
          '<textarea id="af-exam-paste" placeholder="{ ... }" ' +
          'style="width:100%;box-sizing:border-box;height:80px;margin-top:4px;background:var(--bg);' +
          'border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);' +
          'font-family:monospace;font-size:11px;padding:6px;resize:vertical;"></textarea>' +
          '<button class="act" id="af-exam-paste-go" style="margin-top:6px;">Use pasted JSON</button>';
        outEl.classList.add("show");
        setTimeout(() => {
          const go = document.getElementById("af-exam-paste-go");
          if (!go) return;
          go.onclick = async () => {
            try {
              const parsed = JSON.parse(document.getElementById("af-exam-paste").value);
              if (!parsed.resultData || !parsed.resultData.paperDetail) throw new Error("missing resultData.paperDetail");
              __afExamCache = parsed;
              outEl.innerHTML = '<div class="lbl">' + t("examResultTitle") + '</div>' +
                '<div style="color:var(--text-dim);font-size:11px;">' + t("examLoading") + '</div>';
              const api = await askDeepSeekForExam(parsed);
              outEl.innerHTML = renderExamAnswers(parsed, api);
              dbMod.updateDoc(dbMod.doc(db, "users", uid), { showStats: dbMod.increment(1) }).catch(() => {});
            } catch (e) {
              outEl.innerHTML = '<div class="lbl">Error</div><div class="err">' +
                t("examError") + escapeHtml(e.message) + '</div>';
            }
          };
        }, 0);
        return;
      }

      examBtn.disabled = true;
      outEl.innerHTML = '<div class="lbl">' + t("examResultTitle") + '</div>' +
        '<div style="color:var(--text-dim);font-size:11px;">' + t("examLoading") + '</div>';
      outEl.classList.add("show");

      try {
        const api = await askDeepSeekForExam(exam);
        outEl.innerHTML = renderExamAnswers(exam, api);
        dbMod.updateDoc(dbMod.doc(db, "users", uid), { showStats: dbMod.increment(1) }).catch(() => {});
      } catch (e) {
        outEl.innerHTML = '<div class="lbl">Error</div><div class="err">' +
          t("examError") + escapeHtml(e.message) + '</div>';
      } finally {
        examBtn.disabled = false;
      }
    });

    function fillInputs(q, forceWrong) {
      const card = document.querySelector(".practice_base_topic_card") || document;
      const inputs = card.querySelectorAll("textarea.ant-input");
      if (!inputs.length) return 0;
      const answers = (q.childQuestions || []).filter(c => c.questionAnswer);
      if (inputs.length !== answers.length) console.warn("[Autofill] Index mismatch: inputs=", inputs.length, "answers=", answers.length);
      let filled = 0;
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const a = answers[i];
        if (!a) break;
        let val = a.questionAnswer;
        if (Array.isArray(val)) val = val[0];
        if (typeof val !== "string") val = String(val);
        if (forceWrong) val = randomWrongText(val);
        if (input.value === val) continue;
        input.focus();
        input.value = val;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        input.blur();
        input.style.outline = "2px solid " + (forceWrong ? "var(--danger)" : "var(--success)");
        filled++;
      }
      return filled;
    }

    function randomWrongText(original) {
      if (/^-?\d+(\.\d+)?$/.test(original)) {
        const n = parseFloat(original);
        const delta = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 5));
        return String(n + delta);
      }
      if (!original) return "x";
      const c = original.charCodeAt(original.length - 1);
      const next = String.fromCharCode(c === 90 ? 65 : c + 1);
      return original.slice(0, -1) + next;
    }

    function clickChoices(q, forceWrong) {
      const card = document.querySelector(".practice_base_topic_card") || document;
      const groups = card.querySelectorAll("ul.TEXT, ul.MATH, ul.CHINESE, ul.ENGLISH");
      if (!groups.length) return 0;
      const answers = (q.childQuestions || []).filter(c => c.questionAnswer).map(c => {
        let raw = c.questionAnswer;
        if (Array.isArray(raw)) raw = raw.join(";");
        return { raw: String(raw), child: c };
      });
      let clicked = 0;

      for (let gi = 0; gi < groups.length; gi++) {
        const ul = groups[gi];
        if (ul.classList.contains("options_box") || ul.closest(".select_component")) continue;
        const items = ul.querySelectorAll('li[class*="optionNumOneRaw"]');
        if (!items.length) continue;
        const a = answers[gi] || answers[answers.length - 1];
        if (!a) continue;

        const targetLetters = [];
        const targetTexts = [];
        const raw = a.raw;
        if (raw) {
          if (/[;|,]/.test(raw)) {
            raw.split(/[;|,]/).forEach(part => {
              const txt = part.trim().toUpperCase();
              if (txt) targetLetters.push(txt);
            });
          } else if (/^\s*[A-Z]\s*$/.test(raw)) {
            targetLetters.push(raw.trim().toUpperCase());
          } else if (/^[A-Z]{2,}$/.test(raw.trim())) {
            raw.trim().toUpperCase().split("").forEach(l => targetLetters.push(l));
          } else {
            targetTexts.push(raw);
          }
        }
        if (!targetLetters.length && !targetTexts.length && a.child && a.child.options) {
          a.child.options.forEach(o => {
            if (o.correct || o.isCorrect) {
              if (o.optionNo) targetLetters.push(String(o.optionNo).toUpperCase());
              else if (o.optionContent) targetTexts.push(String(o.optionContent).trim());
            }
          });
        }

        const allLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
        const correctIdxs = [];
        targetLetters.forEach(l => {
          const idx = allLetters.indexOf(l.toUpperCase());
          if (idx >= 0) correctIdxs.push(idx);
        });

        const wrongIdxList = [];
        if (forceWrong) {
          const pool = [];
          for (let i = 0; i < items.length; i++) {
            if (!correctIdxs.includes(i)) pool.push(i);
          }
          const need = Math.max(1, correctIdxs.length);
          for (let i = 0; i < need && pool.length; i++) {
            const pick = Math.floor(Math.random() * pool.length);
            wrongIdxList.push(pool[pick]);
            pool.splice(pick, 1);
          }
        }

        if (!forceWrong) {
          for (const letter of targetLetters) {
            const upper = letter.toUpperCase();
            let matched = null;
            for (const li of items) {
              const label = li.querySelector(".label span");
              if (label && label.textContent.replace(/\s|&nbsp;/g, "") === upper + ".") {
                matched = li;
                break;
              }
            }
            if (!matched) {
              const idx = upper.charCodeAt(0) - 65;
              if (idx >= 0 && idx < items.length) matched = items[idx];
            }
            if (matched && matched.dataset.autofilled !== "1") {
              matched.click();
              matched.dataset.autofilled = "1";
              matched.style.outline = "2px solid var(--success)";
              clicked++;
            }
          }
        }

        for (const wi of wrongIdxList) {
          const li = items[wi];
          if (!li || li.dataset.autofilled === "1") continue;
          li.click();
          li.dataset.autofilled = "1";
          li.style.outline = "2px solid var(--danger)";
          clicked++;
        }

        if (!forceWrong) {
          for (const text of targetTexts) {
            for (const li of items) {
              const con = li.querySelector(".con span") || li.querySelector(".con");
              if (con && (con.textContent.trim() === text || con.textContent.trim().includes(text) || text.includes(con.textContent.trim()))) {
                if (li.dataset.autofilled === "1") break;
                li.click();
                li.dataset.autofilled = "1";
                li.style.outline = "2px solid var(--success)";
                clicked++;
                break;
              }
            }
          }
        }
      }
      return clicked;
    }

    async function clickMatching(q, forceWrong) {
      const container = document.querySelector('.ael_matching_answer_component');
      if (!container) return 0;

      const leftItems = container.querySelectorAll('.pair_left_box ul li');
      const rightItems = container.querySelectorAll('.pair_right_box ul li.answer_con');
      if (!leftItems.length || !rightItems.length) return 0;

      let pairs = [];
      if (q.matches && Array.isArray(q.matches) && q.matches.length > 0) {
        q.matches.forEach(m => {
          const left = m.questionContent || m.leftText || m.optionContent || m.text || m.left;
          const right = m.answerContent || m.rightText || m.answer || m.right;
          if (left && right) pairs.push({ left, right });
        });
      } else if (q.childQuestions && Array.isArray(q.childQuestions)) {
        q.childQuestions.forEach(c => {
          if (c.questionAnswer && c.questionAnswer.length > 0) {
            pairs.push({ left: c.questionContent || c.question, right: c.questionAnswer[0] });
          }
        });
      }

      if (!pairs.length) return 0;

      let clicked = 0;
      for (let i = 0; i < pairs.length; i++) {
        let leftEl = null, rightEl = null;
        const p = pairs[i];
        let targetRight = p.right;
        if (forceWrong) {
          const wrongPool = Array.from(rightItems).filter(li => li.innerText.trim() !== p.right);
          if (wrongPool.length) targetRight = wrongPool[Math.floor(Math.random() * wrongPool.length)].innerText.trim();
        }

        for (const li of leftItems) {
          const txt = li.innerText.trim();
          if (txt === p.left || txt.includes(p.left) || p.left.includes(txt)) {
            leftEl = li; break;
          }
        }
        for (const li of rightItems) {
          const txt = li.innerText.trim();
          if (txt === targetRight || txt.includes(targetRight) || targetRight.includes(txt)) {
            rightEl = li; break;
          }
        }

        if (leftEl && rightEl) {
          leftEl.click();
          await new Promise(r => setTimeout(r, 200));
          rightEl.click();
          clicked++;
          await new Promise(r => setTimeout(r, 100));
        }
      }
      return clicked;
    }

    async function fillDropdowns(q, forceWrong) {
      const card = document.querySelector(".practice_base_topic_card") || document;
      const comps = card.querySelectorAll(".select_component");
      if (!comps.length) return 0;
      const answers = (q.childQuestions || []).filter(c => c.questionAnswer);
      let filled = 0;

      for (let i = 0; i < comps.length; i++) {
        const comp = comps[i];
        const a = answers[i];
        if (!a) continue;

        let raw = Array.isArray(a.questionAnswer) ? a.questionAnswer[0] : a.questionAnswer;
        let letter = String(raw).trim().toUpperCase();
        if (forceWrong && a.options && a.options.length > 1) {
          const alternatives = a.options.map(o => o.optionNo).filter(n => n !== letter);
          if (alternatives.length) letter = alternatives[Math.floor(Math.random() * alternatives.length)];
        }

        let targetContent = null;
        if (a.options && Array.isArray(a.options)) {
          const opt = a.options.find(o => o.optionNo === letter);
          if (opt) targetContent = String(opt.optionContent).trim();
        }
        if (!targetContent) continue;

        let lis = comp.querySelectorAll(".options_box li");
        if (lis.length === 0) {
          const vue = comp.__vue__;
          if (vue && vue.$data && "flag" in vue.$data) {
            vue.$data.flag = true;
            if (vue.$forceUpdate) vue.$forceUpdate();
          } else {
            const trigger = comp.querySelector(".select_box");
            if (trigger) trigger.click();
          }
          lis = await waitFor(() => {
            const o = comp.querySelectorAll(".options_box li");
            return o.length ? o : null;
          }, 1500, 60);
        }
        if (!lis || !lis.length) continue;

        let target = null;
        for (const li of lis) {
          if (li.textContent.trim() === targetContent) { target = li; break; }
        }
        if (!target) {
          const norm = targetContent.replace(/\s+/g, "");
          for (const li of lis) {
            if (li.textContent.replace(/\s+/g, "") === norm) { target = li; break; }
          }
        }
        if (!target) continue;
        target.click();
        filled++;
        await new Promise(r => setTimeout(r, 100));
      }
      return filled;
    }

    function findNextButton() {
      const card = document.querySelector(".practice_base_topic_card") || document;
      const btns = card.querySelectorAll(".ael_btn, button");
      for (const b of btns) {
        const txt = b.textContent.trim();
        if (txt === "下一題" || txt === "下一题" || txt === "Next") return b;
      }
      const all = document.querySelectorAll('.ael_btn, button');
      for (const b of all) {
        const txt = b.textContent.trim();
        if (txt === "下一題" || txt === "下一题" || txt === "Next") return b;
      }
      return null;
    }

    async function tick() {
      if (!autoEnabled || busy) return;

      if (!canAutoAnswer()) {
        autoEnabled = false;
        toggle.classList.remove("active");
        localStorage.setItem("af_auto_ans", "0");
        outEl.innerHTML = '<div class="lbl">Limit</div><div class="err">' + t("panelDailyLimitHit") + '</div>';
        outEl.classList.add("show");
        updateDailyIndicator();
        return;
      }

      busy = true;
      try {
        const q = getQuestion();
        if (!q) return;
        const key = getQuestionKey(q);
        if (!key || key === lastKey) return;

        document.querySelectorAll('[data-autofilled="1"]').forEach(el => {
          el.removeAttribute("data-autofilled");
          el.style.outline = "";
        });

        const forceWrong = !rollCorrect();
        let filled = 0;
        filled += fillInputs(q, forceWrong);
        filled += clickChoices(q, forceWrong);
        filled += await clickMatching(q, forceWrong);
        filled += await fillDropdowns(q, forceWrong);

        if (filled > 0) {
          lastKey = key;
          if (!__afIsPremium) {
            incrementDailyAuto();
            updateDailyIndicator();
          }
          if (onAuto) onAuto();
          dbMod.updateDoc(dbMod.doc(db, "users", uid), { autoStats: dbMod.increment(1) }).catch(() => {});

          await new Promise(r => setTimeout(r, advanceDelay));
          if (!autoEnabled) return;

          const next = findNextButton();
          if (next) next.click();
        }
      } finally { busy = false; }
    }

    function restartLoop() {
      if (tickTimer) clearInterval(tickTimer);
      tickTimer = setInterval(tick, 100);
    }

    root._restartLoop = restartLoop;
    root._resetLastKey = () => { lastKey = null; };

    toggle.addEventListener("click", () => {
      if (!autoEnabled) {
        if (!canAutoAnswer()) {
          outEl.innerHTML = '<div class="lbl">Limit</div><div class="err">' + t("panelDailyLimitHit") + '</div>';
          outEl.classList.add("show");
          updateDailyIndicator();
          return;
        }
      }
      autoEnabled = !autoEnabled;
      toggle.classList.toggle("active", autoEnabled);
      localStorage.setItem("af_auto_ans", autoEnabled ? "1" : "0");
      if (autoEnabled) restartLoop();
      updateDailyIndicator();
    });

    slider.addEventListener("input", () => {
      correctChance = parseInt(slider.value, 10);
      sliderVal.textContent = correctChance + "%";
      localStorage.setItem("af_correct", correctChance);
    });

    speedSlider.addEventListener("input", () => {
      let v = parseInt(speedSlider.value, 10);
      if (!__afIsPremium && v < 400) {
        v = 400;
        speedSlider.value = "400";
      }
      advanceDelay = v;
      speedVal.textContent = v + "ms";
      localStorage.setItem("af_speed", v);
    });

    closeBtn.addEventListener("click", () => {
      root.style.display = "none";
      if (tickTimer) clearInterval(tickTimer);
      let reOpen = document.getElementById("af-reopen-btn");
      if (!reOpen) {
        reOpen = document.createElement("button");
        reOpen.id = "af-reopen-btn";
        reOpen.className = "af-fab open-panel";
        reOpen.textContent = "AF";
        reOpen.style.display = "block";
        reOpen.onclick = () => injectAplusGUI(uid, username, db, dbMod, () => {}, () => {});
        document.body.appendChild(reOpen);
      } else {
        reOpen.style.display = "block";
      }
    });

    if (autoEnabled) restartLoop();
  }

  // ─────────────────────────────────────────────────────────────
  // Profile panel
  // ─────────────────────────────────────────────────────────────
  async function injectProfilePanel(uid, db, dbMod) {
    const existing = document.getElementById("af-profile-panel");
    if (existing) { existing.remove(); return; }

    const panel = document.createElement("div");
    panel.id = "af-profile-panel";
    panel.style = "position:fixed; top:20%; left:20%; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:22px; z-index:2147483649; width:320px; color:var(--text); font-family:'Inter',-apple-system,sans-serif; box-shadow:var(--shadow);";
    panel.innerHTML = `
      <button id="af-profile-close" style="position:absolute; top:12px; right:12px; background:none; border:none; color:var(--text-dim); cursor:pointer; font-size:18px;">&times;</button>
      <h2 style="margin-top:0; color:var(--accent); font-size:16px; font-weight:600;">${t("profileTitle")}</h2>
      <input type="text" id="af-search" placeholder="${t("profileSearchPlaceholder")}" style="width:100%; padding:10px 12px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text); font-size:13px; outline:none; box-sizing:border-box;">
      <div id="af-profile-result"></div>`;
    document.body.appendChild(panel);
    document.getElementById("af-profile-close").onclick = () => panel.remove();

    const searchIn = document.getElementById("af-search");
    const resDiv = document.getElementById("af-profile-result");

    searchIn.addEventListener("input", async () => {
      const q = searchIn.value.trim().toLowerCase();
      if (!q) return resDiv.innerHTML = "";

      const uSnap = await dbMod.getDoc(dbMod.doc(db, "usernames", q));
      if (!uSnap.exists()) {
        resDiv.innerHTML = '<div style="color:var(--danger); margin-top:12px; font-size:13px;">' + t("profileNotFound") + '</div>';
        return;
      }
      const uData = uSnap.data();
      const userDoc = await dbMod.getDoc(dbMod.doc(db, "users", uData.uid));
      if (!userDoc.exists()) return;

      const data = userDoc.data();
      const isMe = uData.uid === uid;
      const status = data.isBanned ? '<span style="color:var(--danger);">' + t("profileBanned") + '</span>' : '<span style="color:var(--success);">' + t("profileActive") + '</span>';
      const role = data.username === ADMIN_USERNAME
        ? '<span style="color:var(--danger);">' + t("adminAdmin") + '</span>'
        : (data.isMod ? '<span style="color:var(--warning);">' + t("adminMod") + '</span>' : "");
      const premTag = data.isPremium
        ? ' <span style="color:#d4af37;">[' + t("profilePremium") + ']</span>'
        : "";

      resDiv.innerHTML = `
        <div class="af-profile-card">
          <h3>${escapeHtml(data.username)} ${isMe ? t("profileYou") : ""} ${role}${premTag}</h3>
          <div style="font-size:12px; color:var(--text-dim);">${t("profileStatus")}: ${status}</div>
          <div class="af-profile-stats">
            <div>${t("profileAutoStats")}: <b>${data.autoStats || 0}</b></div>
            <div>${t("profileShowStats")}: <b>${data.showStats || 0}</b></div>
          </div>
        </div>`;
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Chat
  // ─────────────────────────────────────────────────────────────
  let activeChatUnsub = null;
  let activeGroupsUnsub = null;
  let activeGroupMsgUnsub = null;

  function injectChatPanel(uid, username, db, dbMod) {
    if (document.getElementById("af-chat-fab")) return;
    const fab = document.createElement("button");
    fab.className = "af-fab chat";
    fab.id = "af-chat-fab";
    fab.textContent = t("chatFab");

    let isFabDragging = false, fabX = 0, fabY = 0, fabMoved = false;
    fab.addEventListener("pointerdown", e => {
      isFabDragging = true; fabMoved = false;
      fabX = e.clientX - fab.getBoundingClientRect().left;
      fabY = e.clientY - fab.getBoundingClientRect().top;
      try { fab.setPointerCapture(e.pointerId); } catch (err) {}
    });
    fab.addEventListener("pointermove", e => {
      if (!isFabDragging) return;
      fabMoved = true;
      fab.style.left = (e.clientX - fabX) + "px";
      fab.style.top = (e.clientY - fabY) + "px";
    });
    fab.addEventListener("pointerup", () => isFabDragging = false);
    fab.addEventListener("pointercancel", () => isFabDragging = false);
    document.body.appendChild(fab);

    fab.onclick = async () => {
      if (fabMoved) return;
      const existing = document.getElementById("af-chat-panel");
      if (existing) {
        document.getElementById("af-chat-close").click();
        return;
      }

      const panel = document.createElement("div");
      panel.id = "af-chat-panel";
      panel.innerHTML = `
        <div id="af-chat-header"><h2>${t("chatTitle")}</h2><button id="af-chat-close">&times;</button></div>
        <div class="af-tabs">
          <div class="af-tab active" data-tab="global">${t("chatTabGlobal")}</div>
          <div class="af-tab" data-tab="groups">${t("chatTabGroups")}</div>
        </div>
        <div class="af-tab-content" id="af-tab-global">
          <div id="af-chat-box"></div>
          <form id="af-chat-form">
            <input type="text" id="af-chat-input" placeholder="${t("chatPlaceholder")}" autocomplete="off" maxlength="500">
            <button id="af-chat-send" type="submit">${t("chatSend")}</button>
          </form>
        </div>
        <div class="af-tab-content" id="af-tab-groups" style="display:none;">
          <div class="af-section-title" style="display:flex; justify-content:space-between; align-items:center;">${t("chatYourGroups")}
            <button class="af-btn" id="af-create-group-btn" style="padding:5px 12px; font-size:11.5px;">${t("chatNewGroup")}</button>
          </div>
          <div id="af-group-list"><div style="color:var(--text-dim); font-size:12px;">${t("chatNoGroups")}</div></div>
          <div id="af-group-view" style="display:none; margin-top:15px;">
            <div class="af-section-title" id="af-group-view-title">${t("chatGroup")}</div>
            <div id="af-group-members"></div>
            <div id="af-group-msg-box"></div>
            <form id="af-group-msg-form">
              <input type="text" id="af-group-msg-input" placeholder="${t("chatPlaceholder")}" autocomplete="off" maxlength="500">
              <button id="af-group-msg-send" type="submit">${t("chatSend")}</button>
            </form>
            <div style="margin-top:10px; display:flex; gap:6px;">
              <button class="af-btn secondary" id="af-add-member-btn" style="font-size:11.5px;">${t("chatAddMember")}</button>
              <button class="af-btn danger" id="af-leave-group-btn" style="font-size:11.5px;">${t("chatLeaveGroup")}</button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(panel);

      const closePanel = () => {
        panel.remove();
        if (activeChatUnsub) { activeChatUnsub(); activeChatUnsub = null; }
        if (activeGroupsUnsub) { activeGroupsUnsub(); activeGroupsUnsub = null; }
        if (activeGroupMsgUnsub) { activeGroupMsgUnsub(); activeGroupMsgUnsub = null; }
      };
      document.getElementById("af-chat-close").onclick = closePanel;

      let isPanelDragging = false, panelX = 0, panelY = 0;
      const header = document.getElementById("af-chat-header");
      header.addEventListener("pointerdown", e => {
        if (e.target.id === "af-chat-close") return;
        isPanelDragging = true;
        panelX = e.clientX - panel.getBoundingClientRect().left;
        panelY = e.clientY - panel.getBoundingClientRect().top;
        try { header.setPointerCapture(e.pointerId); } catch (err) {}
      });
      header.addEventListener("pointermove", e => {
        if (!isPanelDragging) return;
        panel.style.transform = "none";
        panel.style.left = (e.clientX - panelX) + "px";
        panel.style.top = (e.clientY - panelY) + "px";
      });
      header.addEventListener("pointerup", () => isPanelDragging = false);
      header.addEventListener("pointercancel", () => isPanelDragging = false);

      panel.querySelectorAll(".af-tab").forEach(tab => {
        tab.onclick = () => {
          panel.querySelectorAll(".af-tab").forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          const which = tab.dataset.tab;
          document.getElementById("af-tab-global").style.display = which === "global" ? "" : "none";
          document.getElementById("af-tab-groups").style.display = which === "groups" ? "" : "none";
        };
      });

      const chatBox = document.getElementById("af-chat-box");
      const chatForm = document.getElementById("af-chat-form");
      const chatInput = document.getElementById("af-chat-input");

      const globalQ = dbMod.query(
        dbMod.collection(db, "globalChat"),
        dbMod.orderBy("timestamp", "desc"),
        dbMod.limit(100)
      );

      activeChatUnsub = dbMod.onSnapshot(globalQ, snapshot => {
        chatBox.innerHTML = "";
        const docs = [];
        snapshot.forEach(d => docs.push(d.data()));
        docs.reverse().forEach(data => {
          if (!data.timestamp) return;
          const time = new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const isAdminMsg = data.author === ADMIN_USERNAME;
          const isModMsg = data.isMod;
          const div = document.createElement("div");
          div.className = "af-chat-msg";
          div.innerHTML = `<span class="author ${isAdminMsg ? "admin" : isModMsg ? "mod" : ""}">${escapeHtml(data.author)}</span> <span style="color:var(--text-muted); font-size:10px;">${time}</span><br><span class="text">${escapeHtml(data.text)}</span>`;
          chatBox.appendChild(div);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
      });

      chatForm.onsubmit = async e => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = "";

        const localDiv = document.createElement("div");
        localDiv.className = "af-chat-msg";
        localDiv.style.opacity = "0.6";
        localDiv.innerHTML = `<span class="author">${escapeHtml(username)}</span> <span style="color:var(--text-muted); font-size:10px;">${t("chatSending")}</span><br><span class="text">${escapeHtml(text)}</span>`;
        chatBox.appendChild(localDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
          await dbMod.addDoc(dbMod.collection(db, "globalChat"), {
            author: username,
            text: text,
            timestamp: Date.now()
          });
          localDiv.style.opacity = "0";
          setTimeout(() => localDiv.remove(), 200);
        } catch (err) {
          localDiv.style.opacity = "1";
          localDiv.style.color = "var(--danger)";
          localDiv.querySelector("span[style]").textContent = t("chatFailed");
        }
      };

      const groupListEl = document.getElementById("af-group-list");
      const groupView = document.getElementById("af-group-view");
      const groupViewTitle = document.getElementById("af-group-view-title");
      const groupMembersEl = document.getElementById("af-group-members");
      const groupMsgBox = document.getElementById("af-group-msg-box");
      const groupMsgForm = document.getElementById("af-group-msg-form");
      const groupMsgInput = document.getElementById("af-group-msg-input");
      const createGroupBtn = document.getElementById("af-create-group-btn");
      const addMemberBtn = document.getElementById("af-add-member-btn");
      const leaveGroupBtn = document.getElementById("af-leave-group-btn");

      let selectedGroupId = null;
      let groupsCache = {};

      function escapeHtml(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      }

      activeGroupsUnsub = dbMod.onSnapshot(dbMod.collection(db, "groups"), snap => {
        const mine = [];
        groupsCache = {};
        snap.forEach(d => {
          const data = d.data();
          groupsCache[d.id] = data;
          if (data.members && data.members[username]) {
            mine.push({ id: d.id, ...data });
          }
        });
        groupListEl.innerHTML = "";
        if (!mine.length) {
          groupListEl.innerHTML = '<div style="color:var(--text-dim); font-size:12px;">' + t("chatNoGroups") + '</div>';
          return;
        }
        mine.forEach(g => {
          const item = document.createElement("div");
          item.className = "af-group-item" + (g.id === selectedGroupId ? " selected" : "");
          const mc = Object.keys(g.members || {}).length;
          item.innerHTML = `<div><div class="gname">${escapeHtml(g.name)}</div><div class="gmembers">${mc} member${mc === 1 ? "" : "s"}</div></div>`;
          item.onclick = () => openGroup(g.id);
          groupListEl.appendChild(item);
        });
      });

      function openGroup(gid) {
        selectedGroupId = gid;
        groupView.style.display = "block";
        const g = groupsCache[gid];
        if (!g) return;
        groupViewTitle.textContent = g.name;
        renderMembers(g);

        if (activeGroupMsgUnsub) activeGroupMsgUnsub();
        const msgQ = dbMod.query(
          dbMod.collection(db, "groups", gid, "messages"),
          dbMod.orderBy("timestamp", "desc"),
          dbMod.limit(200)
        );
        activeGroupMsgUnsub = dbMod.onSnapshot(msgQ, snap => {
          groupMsgBox.innerHTML = "";
          const docs = [];
          snap.forEach(d => docs.push(d.data()));
          docs.reverse().forEach(data => {
            if (!data.timestamp) return;
            const time = new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const div = document.createElement("div");
            div.className = "af-chat-msg";
            div.innerHTML = `<span class="author">${escapeHtml(data.author)}</span> <span style="color:var(--text-muted); font-size:10px;">${time}</span><br><span class="text">${escapeHtml(data.text)}</span>`;
            groupMsgBox.appendChild(div);
          });
          groupMsgBox.scrollTop = groupMsgBox.scrollHeight;
        });

        groupMsgForm.onsubmit = async e => {
          e.preventDefault();
          const text = groupMsgInput.value.trim();
          if (!text || !selectedGroupId) return;
          groupMsgInput.value = "";
          await dbMod.addDoc(dbMod.collection(db, "groups", selectedGroupId, "messages"), {
            author: username,
            text: text,
            timestamp: Date.now()
          });
        };

        leaveGroupBtn.onclick = async () => {
          if (!confirm("Leave this group?")) return;
          const gRef = dbMod.doc(db, "groups", gid);
          const snap = await dbMod.getDoc(gRef);
          if (!snap.exists()) return;
          const members = { ...(snap.data().members || {}) };
          delete members[username];
          if (Object.keys(members).length === 0) {
            await dbMod.deleteDoc(gRef);
          } else {
            await dbMod.updateDoc(gRef, { members });
          }
          if (activeGroupMsgUnsub) { activeGroupMsgUnsub(); activeGroupMsgUnsub = null; }
          selectedGroupId = null;
          groupView.style.display = "none";
        };

        addMemberBtn.onclick = () => openAddMemberDialog(gid);
      }

      function renderMembers(g) {
        groupMembersEl.innerHTML = "";
        Object.keys(g.members || {}).forEach(m => {
          const chip = document.createElement("div");
          chip.className = "af-member-chip";
          chip.innerHTML = `<span>${escapeHtml(m)}</span>` + (m === username ? "" : `<span class="rm" data-user="${escapeHtml(m)}">×</span>`);
          groupMembersEl.appendChild(chip);
        });
        groupMembersEl.querySelectorAll(".rm").forEach(rm => {
          rm.onclick = async () => {
            if (!selectedGroupId) return;
            const gRef = dbMod.doc(db, "groups", selectedGroupId);
            const snap = await dbMod.getDoc(gRef);
            if (!snap.exists()) return;
            const members = { ...(snap.data().members || {}) };
            delete members[rm.dataset.user];
            await dbMod.updateDoc(gRef, { members });
          };
        });
      }

      createGroupBtn.onclick = () => {
        const overlay = document.createElement("div");
        overlay.className = "af-modal";
        overlay.style = "position:fixed; inset:0; background:rgba(8,8,10,0.85); backdrop-filter:blur(6px); z-index:2147483650; display:flex; align-items:center; justify-content:center;";
        overlay.innerHTML = `
          <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; width:360px; color:var(--text); font-family:'Inter',-apple-system,sans-serif; box-shadow:var(--shadow);">
            <h3 style="margin:0 0 16px 0; color:var(--accent); font-size:16px; font-weight:600;">${t("chatCreateGroup")}</h3>
            <input type="text" id="af-group-name-input" placeholder="${t("chatGroupName")}" maxlength="40" autocomplete="off">
            <input type="text" id="af-group-user-search" placeholder="${t("chatSearchUsers")}" autocomplete="off">
            <div id="af-group-search-results"></div>
            <div id="af-group-invite-list" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px; min-height:0;"></div>
            <div style="display:flex; gap:8px; justify-content:flex-end;">
              <button class="af-btn secondary" id="af-group-cancel">${t("chatCancel")}</button>
              <button class="af-btn" id="af-group-create">${t("chatCreate")}</button>
            </div>
            <div id="af-group-create-err" style="color:var(--danger); font-size:12px; margin-top:10px; min-height:14px;"></div>
          </div>`;
        document.body.appendChild(overlay);

        const nameIn = document.getElementById("af-group-name-input");
        const searchIn = document.getElementById("af-group-user-search");
        const resultsEl = document.getElementById("af-group-search-results");
        const inviteList = document.getElementById("af-group-invite-list");
        const errEl = document.getElementById("af-group-create-err");
        const invites = new Set();

        document.getElementById("af-group-cancel").onclick = () => overlay.remove();

        searchIn.addEventListener("input", async () => {
          const q = searchIn.value.trim().toLowerCase();
          resultsEl.innerHTML = "";
          if (!q) return;
          const snap = await dbMod.getDoc(dbMod.doc(db, "usernames", q));
          if (!snap.exists()) {
            resultsEl.innerHTML = '<div style="padding:10px 12px; color:var(--text-dim); font-size:12px;">' + t("chatNoUser") + '</div>';
            return;
          }
          if (q === username) return;
          const row = document.createElement("div");
          row.className = "af-search-result";
          row.innerHTML = `<span>${escapeHtml(q)}</span><span class="add">${t("chatAdd")}</span>`;
          row.onclick = () => {
            if (!invites.has(q)) {
              invites.add(q);
              renderInvites();
            }
            searchIn.value = "";
            resultsEl.innerHTML = "";
          };
          resultsEl.appendChild(row);
        });

        function renderInvites() {
          inviteList.innerHTML = "";
          invites.forEach(u => {
            const chip = document.createElement("div");
            chip.className = "af-member-chip";
            chip.innerHTML = `<span>${escapeHtml(u)}</span><span class="rm">×</span>`;
            chip.querySelector(".rm").onclick = () => {
              invites.delete(u);
              renderInvites();
            };
            inviteList.appendChild(chip);
          });
        }

        document.getElementById("af-group-create").onclick = async () => {
          const name = nameIn.value.trim();
          if (!name) { errEl.textContent = "Enter a group name."; return; }
          if (invites.size === 0) { errEl.textContent = "Add at least one member."; return; }
          const members = { [username]: true };
          invites.forEach(u => { members[u] = true; });
          try {
            await dbMod.addDoc(dbMod.collection(db, "groups"), {
              name: name,
              members: members,
              createdBy: username,
              createdAt: Date.now()
            });
            overlay.remove();
          } catch (e) {
            errEl.textContent = e.message;
          }
        };
      };

      function openAddMemberDialog(gid) {
        const overlay = document.createElement("div");
        overlay.className = "af-modal";
        overlay.style = "position:fixed; inset:0; background:rgba(8,8,10,0.85); backdrop-filter:blur(6px); z-index:2147483650; display:flex; align-items:center; justify-content:center;";
        overlay.innerHTML = `
          <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; width:340px; color:var(--text); font-family:'Inter',-apple-system,sans-serif; box-shadow:var(--shadow);">
            <h3 style="margin:0 0 16px 0; color:var(--accent); font-size:16px; font-weight:600;">${t("chatAddMember")}</h3>
            <input type="text" id="af-group-user-search" placeholder="${t("chatSearchUser")}" autocomplete="off">
            <div id="af-group-search-results"></div>
            <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:8px;">
              <button class="af-btn secondary" id="af-group-cancel">${t("chatClose")}</button>
            </div>
            <div id="af-group-create-err" style="color:var(--danger); font-size:12px; margin-top:10px; min-height:14px;"></div>
          </div>`;
        document.body.appendChild(overlay);

        const searchIn = document.getElementById("af-group-user-search");
        const resultsEl = document.getElementById("af-group-search-results");
        const errEl = document.getElementById("af-group-create-err");
        document.getElementById("af-group-cancel").onclick = () => overlay.remove();

        searchIn.addEventListener("input", async () => {
          const q = searchIn.value.trim().toLowerCase();
          resultsEl.innerHTML = "";
          if (!q) return;
          const snap = await dbMod.getDoc(dbMod.doc(db, "usernames", q));
          if (!snap.exists()) {
            resultsEl.innerHTML = '<div style="padding:10px 12px; color:var(--text-dim); font-size:12px;">' + t("chatNoUser") + '</div>';
            return;
          }
          const gRef = dbMod.doc(db, "groups", gid);
          const gSnap = await dbMod.getDoc(gRef);
          if (!gSnap.exists()) return;
          const currentMembers = gSnap.data().members || {};
          if (currentMembers[q]) {
            resultsEl.innerHTML = '<div style="padding:10px 12px; color:var(--text-dim); font-size:12px;">' + t("chatAlreadyMember") + '</div>';
            return;
          }
          if (q === username) return;
          const row = document.createElement("div");
          row.className = "af-search-result";
          row.innerHTML = `<span>${escapeHtml(q)}</span><span class="add">${t("chatAdd")}</span>`;
          row.onclick = async () => {
            try {
              const updated = { ...currentMembers, [q]: true };
              await dbMod.updateDoc(gRef, { members: updated });
              overlay.remove();
            } catch (e) {
              errEl.textContent = e.message;
            }
          };
          resultsEl.appendChild(row);
        });
      }
    };
  }

  // ─────────────────────────────────────────────────────────────
  // Admin panel
  // ─────────────────────────────────────────────────────────────
  function injectAdminPanel(db, dbMod, myUsername) {
    if (document.getElementById("af-admin-fab")) return;

    const btn = document.createElement("button");
    btn.className = "af-fab admin";
    btn.id = "af-admin-fab";
    btn.textContent = t("adminFab");

    let isBtnDragging = false, btnX = 0, btnY = 0, btnMoved = false;
    btn.addEventListener("pointerdown", e => {
      isBtnDragging = true; btnMoved = false;
      btnX = e.clientX - btn.getBoundingClientRect().left;
      btnY = e.clientY - btn.getBoundingClientRect().top;
      try { btn.setPointerCapture(e.pointerId); } catch (err) {}
    });
    btn.addEventListener("pointermove", e => {
      if (!isBtnDragging) return;
      btnMoved = true;
      btn.style.left = (e.clientX - btnX) + "px";
      btn.style.top = (e.clientY - btnY) + "px";
    });
    btn.addEventListener("pointerup", () => isBtnDragging = false);
    btn.addEventListener("pointercancel", () => isBtnDragging = false);
    document.body.appendChild(btn);

    btn.onclick = async () => {
      if (btnMoved) return;
      const existing = document.getElementById("af-admin-panel");
      if (existing) { existing.remove(); return; }

      const panel = document.createElement("div");
      panel.id = "af-admin-panel";
      panel.innerHTML = `
        <div id="af-admin-header"><h2>${t("adminTitle")}</h2><button id="af-admin-close">&times;</button></div>
        <div id="af-admin-content">
          <div>
            <div class="af-section-title">${t("adminTrollTool")}</div>
            <select id="af-troll-select">
              <option value="gugugaga">${t("trollGugugaga")}</option>
              <option value="shake">${t("trollShake")}</option>
              <option value="flip">${t("trollFlip")}</option>
              <option value="alert">${t("trollAlert")}</option>
              <option value="troll_cursor">${t("trollCursor")}</option>
              <option value="troll_zoom">${t("trollZoom")}</option>
              <option value="good_image">${t("trollGoodImage")}</option>
              <option value="nice_overlay">${t("trollNiceOverlay")}</option>
              <option value="invert">${t("trollInvert")}</option>
              <option value="static">${t("trollStatic")}</option>
              <option value="disco">${t("trollDisco")}</option>
              <option value="meltdown">${t("trollMeltdown")}</option>
              <option value="cursorrain">${t("trollCursorRain")}</option>
              <option value="blur">${t("trollBlur")}</option>
              <option value="mirror">${t("trollMirror")}</option>
              <option value="crack">${t("trollCrack")}</option>
            </select>
          </div>
          <div>
            <div class="af-section-title">${t("adminAllUsers")}</div>
            <div id="af-admin-student" style="font-size:12.5px;color:var(--text-dim);margin:-4px 0 10px;padding:8px 10px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);"></div>
            <div id="af-admin-list">Loading...</div>
          </div>
        </div>`;
      document.body.appendChild(panel);

      const stuName = getStudentName();
      const stuEl = document.getElementById("af-admin-student");
      if (stuEl) {
        stuEl.innerHTML = stuName
          ? `<span style="color:var(--accent);font-weight:600;">${t("adminStudentName")}:</span> ${escapeHtml(stuName)}`
          : `<span style="color:var(--text-muted);">${t("adminStudentName")}: —</span>`;
      }

      const unsub = dbMod.onSnapshot(dbMod.collection(db, "users"), snap => {
        const listDiv = document.getElementById("af-admin-list");
        if (!listDiv) return;

        listDiv.innerHTML = "";

        let activeUid = null;
        try {
          const parsed = JSON.parse(localStorage.getItem('aplus_saved_user'));
          if (parsed) activeUid = parsed.uid;
        } catch (e) {}

        snap.forEach(docSnap => {
          const data = docSnap.data();
          const tuid = docSnap.id;
          const isSelf = data.username === myUsername;
          const isTargetAdmin = data.username === ADMIN_USERNAME;
          const isTargetMod = data.isMod;
          const isOnline = isSelf || (data.lastSeen && (Date.now() - data.lastSeen < 45000));

          const row = document.createElement("div");
          row.className = "af-user-row";

          const nameWrap = document.createElement("div");
          nameWrap.className = "name";
          const premBadge = data.isPremium ? ` <span style="color:#d4af37;font-size:10px;">[${t("adminPremium")}]</span>` : "";
          nameWrap.innerHTML = `<div class="af-status-dot ${isOnline ? "af-status-online" : "af-status-offline"}"></div> <span>${escapeHtml(data.username || "?")} <span style="font-size:10px; color:var(--text-muted);">(${tuid.slice(0,5)})</span>${premBadge}</span>`;

          const actions = document.createElement("div");
          actions.className = "actions";

          const trollBtn = document.createElement("button");
          trollBtn.textContent = t("adminTroll");
          trollBtn.className = "troll";
          trollBtn.onclick = async () => {
            const effect = document.getElementById("af-troll-select").value;
            const targetUid = (data.username === myUsername && activeUid) ? activeUid : tuid;
            await dbMod.setDoc(dbMod.doc(db, "commands", targetUid), { action: effect, timestamp: Date.now() });
            trollBtn.textContent = t("adminTrollSent");
            setTimeout(() => trollBtn.textContent = t("adminTroll"), 2000);
          };
          actions.appendChild(trollBtn);

          const banBtn = document.createElement("button");
          const canBan = !isSelf && !isTargetAdmin && (myUsername === ADMIN_USERNAME || !isTargetMod);
          if (isSelf) {
            banBtn.textContent = t("adminMe"); banBtn.className = "disabled"; banBtn.disabled = true;
          } else if (!canBan) {
            banBtn.textContent = isTargetAdmin ? t("adminAdmin") : t("adminMod"); banBtn.className = "disabled"; banBtn.disabled = true;
          } else {
            banBtn.textContent = data.isBanned ? t("adminUnban") : t("adminBan");
            banBtn.className = data.isBanned ? "unban" : "ban";
            banBtn.onclick = async () => {
              await dbMod.updateDoc(dbMod.doc(db, "users", tuid), { isBanned: !data.isBanned });
            };
          }
          actions.appendChild(banBtn);

          if (myUsername === ADMIN_USERNAME && !isTargetAdmin) {
            const modBtn = document.createElement("button");
            modBtn.textContent = isTargetMod ? t("adminDemod") : t("adminMakeMod");
            modBtn.className = isTargetMod ? "demod" : "mod";
            modBtn.onclick = async () => {
              await dbMod.updateDoc(dbMod.doc(db, "users", tuid), { isMod: !isTargetMod });
            };
            actions.appendChild(modBtn);

            const premBtn = document.createElement("button");
            premBtn.textContent = data.isPremium ? t("adminRevokePremium") : t("adminGrantPremium");
            premBtn.className = data.isPremium ? "demod" : "mod";
            premBtn.onclick = async () => {
              await dbMod.updateDoc(dbMod.doc(db, "users", tuid), { isPremium: !data.isPremium });
            };
            actions.appendChild(premBtn);
          }

          row.appendChild(nameWrap);
          row.appendChild(actions);
          listDiv.appendChild(row);
        });
      });

      document.getElementById("af-admin-close").onclick = () => { unsub(); panel.remove(); };
    };
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  initAuth();
}();
