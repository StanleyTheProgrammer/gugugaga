// v1.5.0
!function () {
  "use strict";

  const firebaseConfig = {
    apiKey: "AIzaSyDd15smQKX5BWWlQ3PjzZ6cEi18P7zKeWg",
    authDomain: "aplus-5383f.firebaseapp.com",
    projectId: "aplus-5383f",
    storageBucket: "aplus-5383f.firebasestorage.app",
    messagingSenderId: "654012013474",
    appId: "1:654012013474:web:3f2e023a2597af46c8b0fb"
  };
  const ADMIN_USERNAME = "cat_here";
  const SCRIPT_VERSION = 7;

  // ============================================================
  // i18n (Cantonese / English)
  // ============================================================
  const LANG_KEY = "af_lang";
  let lang = localStorage.getItem(LANG_KEY) || "en";

  const i18n = {
    en: {
      // Auth
      authTitleLogin: "Welcome back",
      authTitleRegister: "Create account",
      authSubLogin: "Sign in to continue",
      authSubRegister: "Join the fun",
      authUsername: "Username",
      authPassword: "Password",
      authLogin: "Log in",
      authRegister: "Register",
      authSwitchToRegister: "Need an account? Register",
      authSwitchToLogin: "Already have an account? Log in",
      authFillFields: "Fill all fields.",
      authPasswordMax: "Password max 20 chars.",
      authProcessing: "Processing...",
      authAccountNotFound: "Account not found.",
      authWrongPassword: "Wrong password.",
      authBanned: "This account is BANNED.",
      authDeviceRegistered: "This device is already registered.",
      authUsernameTaken: "Username taken.",

      // Main panel
      panelTitle: "Autofill",
      panelAuto: "Auto",
      panelAutoSkip: "Auto-skip",
      panelSpeed: "Speed",
      panelCorrect: "Correct",
      panelShowAnswer: "Show answer",
      panelProfile: "Profile Search",
      panelLogout: "Log Out",

      // Video
      videoTitle: "Video Scrubber",
      videoNoVideo: "No video detected",

      // Chat
      chatFab: "Chat",
      chatTitle: "Chat",
      chatTabGlobal: "Global",
      chatTabGroups: "Groups",
      chatPlaceholder: "Type a message...",
      chatSend: "Send",
      chatSending: "sending…",
      chatFailed: "failed",
      chatNoMessages: "No messages yet.",
      chatYourGroups: "Your Groups",
      chatNewGroup: "+ New Group",
      chatNoGroups: "No groups yet.",
      chatGroup: "Group",
      chatAddMember: "+ Add Member",
      chatLeaveGroup: "Leave Group",
      chatCreateGroup: "Create Group",
      chatGroupName: "Group name",
      chatSearchUsers: "Search users to add...",
      chatSearchUser: "Search username...",
      chatCancel: "Cancel",
      chatCreate: "Create",
      chatClose: "Close",
      chatAdd: "+ Add",
      chatNoUser: "No user found.",
      chatAlreadyMember: "Already a member.",

      // Admin
      adminFab: "Admin",
      adminTitle: "Admin & Mod Panel",
      adminTrollTool: "Troll Tool",
      adminAllUsers: "All Users",
      adminTroll: "Troll",
      adminTrollSent: "Sent!",
      adminBan: "Ban",
      adminUnban: "Unban",
      adminMakeMod: "Make Mod",
      adminDemod: "Demod",
      adminMe: "Me",
      adminAdmin: "Admin",
      adminMod: "Mod",

      // Troll options
      trollGugugaga: "GUGUGAGA Spam",
      trollShake: "Shake Screen",
      trollFlip: "Flip Screen",
      trollAlert: "Random Alert",
      trollCursor: "Spooky Cursor",
      trollZoom: "Infinite Zoom",
      trollScaryFace: "Scary Face",
      trollScaryBlood: "Blood Overlay",
      trollScaryInvert: "Inverted Colors",
      trollScaryStatic: "Static Noise + Scream",

      // Session / errors
      sessionExpired: "Session expired: You logged in from another device.",
      youBanned: "You have been BANNED.",
      accountBanned: "Account Banned.",

      // Profile
      profileTitle: "Profile Search",
      profileSearchPlaceholder: "Search username...",
      profileNotFound: "User not found.",
      profileStatus: "Status",
      profileActive: "Active",
      profileBanned: "Banned",
      profileAutoStats: "Auto-Answered",
      profileShowStats: "Answers Viewed",
      profileYou: "(You)",

      // Language
      langLabel: "中",
      langTitle: "Switch to Cantonese"
    },
    yue: {
      // Auth
      authTitleLogin: "歡迎返嚟",
      authTitleRegister: "建立帳戶",
      authSubLogin: "登入繼續",
      authSubRegister: "加入一齊玩",
      authUsername: "用戶名",
      authPassword: "密碼",
      authLogin: "登入",
      authRegister: "註冊",
      authSwitchToRegister: "未有帳戶？註冊",
      authSwitchToLogin: "已經有帳戶？登入",
      authFillFields: "請填寫所有欄位。",
      authPasswordMax: "密碼最多 20 個字。",
      authProcessing: "處理中...",
      authAccountNotFound: "搵唔到帳戶。",
      authWrongPassword: "密碼錯誤。",
      authBanned: "呢個帳戶已被封鎖。",
      authDeviceRegistered: "呢部裝置已經註冊咗。",
      authUsernameTaken: "用戶名已被使用。",

      // Main panel
      panelTitle: "自動填寫",
      panelAuto: "自動",
      panelAutoSkip: "自動跳過",
      panelSpeed: "速度",
      panelCorrect: "正確率",
      panelShowAnswer: "顯示答案",
      panelProfile: "查詢個人資料",
      panelLogout: "登出",

      // Video
      videoTitle: "影片控制",
      videoNoVideo: "未偵測到影片",

      // Chat
      chatFab: "聊天",
      chatTitle: "聊天",
      chatTabGlobal: "全體",
      chatTabGroups: "群組",
      chatPlaceholder: "輸入訊息...",
      chatSend: "發送",
      chatSending: "發送緊…",
      chatFailed: "失敗",
      chatNoMessages: "仲未有訊息。",
      chatYourGroups: "你嘅群組",
      chatNewGroup: "+ 新群組",
      chatNoGroups: "仲未有群組。",
      chatGroup: "群組",
      chatAddMember: "+ 加入成員",
      chatLeaveGroup: "離開群組",
      chatCreateGroup: "建立群組",
      chatGroupName: "群組名稱",
      chatSearchUsers: "搜尋要加入嘅用戶...",
      chatSearchUser: "搜尋用戶名...",
      chatCancel: "取消",
      chatCreate: "建立",
      chatClose: "關閉",
      chatAdd: "+ 加入",
      chatNoUser: "搵唔到用戶。",
      chatAlreadyMember: "已經係成員。",

      // Admin
      adminFab: "管理員",
      adminTitle: "管理員及版主面板",
      adminTrollTool: "惡作劇工具",
      adminAllUsers: "所有用戶",
      adminTroll: "惡作劇",
      adminTrollSent: "已發送！",
      adminBan: "封鎖",
      adminUnban: "解封",
      adminMakeMod: "設為版主",
      adminDemod: "取消版主",
      adminMe: "我",
      adminAdmin: "管理員",
      adminMod: "版主",

      // Troll options
      trollGugugaga: "GUGUGAGA 洗版",
      trollShake: "震動畫面",
      trollFlip: "翻轉畫面",
      trollAlert: "隨機彈窗",
      trollCursor: "詭異滑鼠",
      trollZoom: "無限放大",
      trollScaryFace: "恐怖圖片",
      trollScaryBlood: "血紅色畫面",
      trollScaryInvert: "反轉顏色",
      trollScaryStatic: "雪花聲效",

      // Session / errors
      sessionExpired: "會話已過期：你喺另一部裝置登入咗。",
      youBanned: "你已被封鎖。",
      accountBanned: "帳戶被封鎖。",

      // Profile
      profileTitle: "查詢個人資料",
      profileSearchPlaceholder: "搜尋用戶名...",
      profileNotFound: "搵唔到用戶。",
      profileStatus: "狀態",
      profileActive: "使用中",
      profileBanned: "被封鎖",
      profileAutoStats: "自動答題",
      profileShowStats: "睇過答案",
      profileYou: "(你)",

      // Language
      langLabel: "EN",
      langTitle: "切換至英文"
    }
  };

  function t(key) {
    return (i18n[lang] && i18n[lang][key]) || (i18n.en[key] || key);
  }

  function setLang(newLang) {
    lang = newLang;
    localStorage.setItem(LANG_KEY, newLang);
    // Re-render everything: easiest path is a reload
    location.reload();
  }

  function injectLangToggle() {
    if (document.getElementById("af-lang-toggle")) return;
    const btn = document.createElement("button");
    btn.id = "af-lang-toggle";
    btn.textContent = t("langLabel");
    btn.title = t("langTitle");
    btn.onclick = () => setLang(lang === "en" ? "yue" : "en");
    document.body.appendChild(btn);
  }

  // ============================================================
  // Firebase
  // ============================================================
  async function loadFirebase() {
    const appMod = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    const authMod = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    const dbMod = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    const app = appMod.initializeApp(firebaseConfig);
    return { auth: authMod.getAuth(app), db: dbMod.getFirestore(app), authMod, dbMod };
  }

  const css = `
    :root {
      --bg: #121214;
      --surface: #1a1a1e;
      --surface-hover: #222228;
      --border: #2c2c33;
      --border-light: #3a3a44;
      --text: #e8e8ec;
      --text-dim: #8b8b96;
      --text-muted: #5a5a66;
      --accent: #4a9eff;
      --accent-hover: #3a8eef;
      --danger: #e85d5d;
      --success: #4ac97a;
      --warning: #f0a850;
      --radius-sm: 6px;
      --radius: 10px;
      --radius-lg: 14px;
      --shadow: 0 4px 20px rgba(0,0,0,0.4);
    }

    #af-lang-toggle {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 2147483651;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text);
      font-family: "Inter", -apple-system, sans-serif;
      font-size: 12px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      box-shadow: var(--shadow);
      transition: background .15s, border-color .15s;
    }
    #af-lang-toggle:hover {
      background: var(--surface-hover);
      border-color: var(--border-light);
    }

    #af-auth-modal {
      position: fixed; inset: 0;
      background: rgba(8,8,10,0.92);
      backdrop-filter: blur(8px);
      z-index: 2147483648;
      display: flex; align-items: center; justify-content: center;
      font-family: "Inter", -apple-system, "Segoe UI", sans-serif;
    }

    #af-auth-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 32px 28px;
      width: 320px;
      color: var(--text);
      box-shadow: var(--shadow);
    }

    #af-auth-box h2 {
      margin: 0 0 4px;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: -0.3px;
    }

    #af-auth-box .sub {
      color: var(--text-dim);
      font-size: 13px;
      margin-bottom: 24px;
    }

    #af-auth-box input {
      width: 100%;
      box-sizing: border-box;
      padding: 11px 14px;
      margin-bottom: 10px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text);
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color .15s;
    }

    #af-auth-box input:focus { border-color: var(--accent); }
    #af-auth-box input::placeholder { color: var(--text-muted); }

    #af-auth-box button {
      width: 100%;
      padding: 11px;
      margin-top: 8px;
      border: none;
      border-radius: var(--radius-sm);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background .15s, transform .1s;
    }

    #af-auth-box button:active { transform: scale(0.98); }
    #af-auth-btn { background: var(--accent); color: #fff; }
    #af-auth-btn:hover { background: var(--accent-hover); }

    #af-auth-switch {
      background: transparent;
      color: var(--text-dim);
      font-weight: 500;
      font-size: 13px;
      margin-top: 16px;
    }

    #af-auth-switch:hover { color: var(--text); }

    #af-error {
      color: var(--danger);
      font-size: 12.5px;
      text-align: center;
      margin-bottom: 12px;
      min-height: 16px;
    }

    #af-admin-panel, #af-chat-panel {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 0;
      z-index: 2147483649;
      width: 520px;
      max-height: 85vh;
      color: var(--text);
      font-family: "Inter", -apple-system, sans-serif;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    #af-chat-panel { width: 580px; }

    #af-admin-header, #af-chat-header {
      padding: 16px 20px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      cursor: move;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
      touch-action: none;
    }

    #af-admin-header h2, #af-chat-header h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: -0.2px;
    }

    #af-admin-header h2 { color: var(--danger); }
    #af-chat-header h2 { color: var(--accent); }

    #af-admin-close, #af-chat-close {
      background: none;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      font-size: 22px;
      line-height: 1;
      padding: 0;
      transition: color .15s;
    }

    #af-admin-close:hover, #af-chat-close:hover { color: var(--text); }

    #af-admin-content {
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .af-section-title {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .af-user-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
    }

    .af-user-row:last-child { border-bottom: none; }

    .af-user-row .name {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
    }

    .af-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .af-status-online {
      background: var(--success);
      box-shadow: 0 0 6px rgba(74,201,122,0.5);
    }

    .af-status-offline { background: var(--text-muted); }
    .af-user-row .actions { display: flex; gap: 6px; }

    .af-user-row button {
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      font-family: inherit;
      transition: opacity .15s;
    }

    .af-user-row button:hover { opacity: 0.85; }
    .af-user-row button.ban { background: var(--danger); }
    .af-user-row button.unban { background: var(--success); }
    .af-user-row button.troll { background: #9b6dff; }
    .af-user-row button.mod { background: var(--warning); }
    .af-user-row button.demod { background: var(--text-muted); }
    .af-user-row button.disabled { background: var(--border); color: var(--text-muted); cursor: not-allowed; }

    #af-troll-select, #af-chat-input, #af-search, #af-group-name-input, #af-group-user-search {
      width: 100%;
      padding: 10px 12px;
      margin-bottom: 10px;
      background: var(--bg);
      color: var(--text) !important;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      box-sizing: border-box;
      font-family: inherit;
      font-size: 13px;
      outline: none;
      transition: border-color .15s;
    }

    #af-troll-select:focus, #af-chat-input:focus, #af-search:focus, #af-group-name-input:focus, #af-group-user-search:focus {
      border-color: var(--accent);
    }

    #af-troll-select option { background: var(--surface); color: var(--text); }

    #af-chat-box {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      height: 220px;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    #af-group-msg-box {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      height: 260px;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .af-chat-msg { font-size: 13.5px; line-height: 1.5; }
    .af-chat-msg .author { font-weight: 600; color: var(--accent); margin-right: 6px; }
    .af-chat-msg .author.admin { color: var(--danger); }
    .af-chat-msg .author.mod { color: var(--warning); }
    .af-chat-msg .text { color: var(--text); }

    #af-chat-form, #af-group-msg-form { display: flex; gap: 8px; margin-top: 12px; }
    #af-chat-input, #af-group-msg-input { margin-bottom: 0; flex-grow: 1; }

    #af-chat-send, #af-group-msg-send {
      padding: 0 18px;
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      font-size: 13px;
      transition: background .15s;
    }

    #af-chat-send:hover, #af-group-msg-send:hover { background: var(--accent-hover); }

    .af-tabs {
      display: flex;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
      padding: 0 20px;
    }

    .af-tab {
      padding: 12px 16px;
      cursor: pointer;
      font-size: 13px;
      color: var(--text-dim);
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      font-weight: 500;
      transition: color .15s;
    }

    .af-tab:hover { color: var(--text); }
    .af-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
    .af-tab-content { padding: 16px 20px; overflow-y: auto; flex: 1; }

    #af-group-list { display: flex; flex-direction: column; gap: 6px; max-height: 160px; overflow-y: auto; }

    .af-group-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 13px;
      transition: border-color .15s;
    }

    .af-group-item:hover { border-color: var(--border-light); }
    .af-group-item.selected { border-color: var(--accent); }
    .af-group-item .gname { font-weight: 600; }
    .af-group-item .gmembers { color: var(--text-dim); font-size: 11.5px; margin-top: 2px; }

    #af-group-members { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }

    .af-member-chip {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 4px 10px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .af-member-chip .rm { cursor: pointer; color: var(--danger); font-weight: bold; margin-left: 2px; }

    #af-group-search-results {
      max-height: 140px;
      overflow-y: auto;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      margin-bottom: 10px;
    }

    .af-search-result {
      padding: 10px 12px;
      cursor: pointer;
      font-size: 13px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      transition: background .15s;
    }

    .af-search-result:hover { background: var(--surface-hover); }
    .af-search-result:last-child { border-bottom: none; }
    .af-search-result .add { color: var(--success); font-weight: 600; }

    .af-btn {
      padding: 9px 16px;
      border: none;
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      background: var(--accent);
      color: #fff;
      font-family: inherit;
      transition: background .15s;
    }

    .af-btn:hover { background: var(--accent-hover); }
    .af-btn.secondary { background: var(--border); color: var(--text); }
    .af-btn.secondary:hover { background: var(--border-light); }
    .af-btn.danger { background: var(--danger); }
    .af-btn.danger:hover { background: #d44; }

    #af-root {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483647;
      width: 240px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      font-family: "Inter", -apple-system, sans-serif;
      font-size: 12px;
      color: var(--text);
      box-shadow: var(--shadow);
      user-select: none;
      -webkit-user-select: none;
      overflow: hidden;
    }

    #af-root .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      cursor: move;
      touch-action: none;
    }

    #af-root .bar span { font-size: 12px; font-weight: 600; letter-spacing: 0.1px; color: var(--text); pointer-events: none; }

    #af-root .bar b {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 16px;
      font-weight: 400;
      cursor: pointer;
      padding: 0 2px;
      line-height: 1;
      transition: color .12s;
      touch-action: manipulation;
    }

    #af-root .bar b:hover { color: var(--text); }
    #af-root .body { padding: 14px; }

    #af-root .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    #af-root .label { font-size: 12.5px; color: var(--text-dim); letter-spacing: 0.1px; }

    #af-root .toggle {
      position: relative;
      width: 38px;
      height: 22px;
      background: var(--border);
      border-radius: 11px;
      cursor: pointer;
      transition: background .15s ease;
      touch-action: manipulation;
      flex-shrink: 0;
    }

    #af-root .toggle.active { background: var(--accent); }

    #af-root .toggle .knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 18px;
      height: 18px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      transition: transform .15s ease;
    }

    #af-root .toggle.active .knob { transform: translateX(16px); }

    #af-root .sliderBlock { margin-bottom: 12px; }

    #af-root .sliderHead { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
    #af-root .sliderRow { display: flex; align-items: center; gap: 10px; }

    #af-root .sliderVal {
      font-size: 12px;
      color: var(--text);
      font-family: "SF Mono", Consolas, monospace;
      min-width: 46px;
      text-align: right;
      letter-spacing: -0.2px;
    }

    #af-root input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      flex: 1;
      height: 3px;
      background: var(--border);
      border-radius: 2px;
      outline: none;
      touch-action: manipulation;
    }

    #af-root input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 15px;
      height: 15px;
      background: #fff;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
      transition: transform .1s;
    }

    #af-root input[type="range"]::-webkit-slider-thumb:active { transform: scale(1.15); }
    #af-root input[type="range"]::-moz-range-thumb {
      width: 15px; height: 15px; background: #fff;
      border-radius: 50%; cursor: pointer;
      border: none; box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    }

    #af-root button.act {
      width: 100%;
      padding: 9px;
      background: var(--border);
      color: var(--text);
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 12.5px;
      font-weight: 500;
      font-family: inherit;
      letter-spacing: 0.1px;
      transition: background .12s;
      touch-action: manipulation;
      margin-bottom: 6px;
    }

    #af-root button.act:hover { background: var(--border-light); }
    #af-root button.act:active { background: var(--border); }

    #af-root .out {
      margin-top: 10px;
      padding: 10px 11px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-family: "SF Mono", Consolas, monospace;
      font-size: 11px;
      color: var(--text);
      word-break: break-all;
      line-height: 1.5;
      display: none;
      max-height: 160px;
      overflow-y: auto;
    }

    #af-root .out.show { display: block; }

    #af-root .out .lbl {
      color: var(--text-muted);
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      margin-bottom: 5px;
      font-weight: 600;
    }

    #af-root .out .val { color: var(--success); }
    #af-root .out .err { color: var(--danger); }
    #af-root .ans-row { padding: 3px 0; border-bottom: 1px solid var(--border); }
    #af-root .ans-row:last-child { border-bottom: none; }
    #af-root .ans-q { color: var(--text-muted); margin-right: 6px; font-size: 10.5px; }

    #af-root .frac {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      vertical-align: middle;
      margin: 0 2px;
      line-height: 1.05;
      color: var(--success);
      font-family: Georgia, "Times New Roman", serif;
      font-size: 12px;
    }

    #af-root .frac .num { padding: 0 5px; }
    #af-root .frac .den { padding: 0 5px; border-top: 1px solid var(--success); }

    .af-profile-card {
      background: var(--bg);
      border: 1px solid var(--border);
      padding: 16px;
      border-radius: var(--radius);
      margin-top: 10px;
      text-align: center;
    }

    .af-profile-card h3 { margin: 0 0 6px; color: var(--accent); font-weight: 600; }
    .af-profile-stats { font-size: 13px; color: var(--text-dim); margin-top: 10px; }

    .af-fab {
      position: fixed;
      z-index: 99999;
      padding: 11px 16px;
      border: none;
      border-radius: var(--radius);
      cursor: move;
      font-weight: 600;
      touch-action: none;
      user-select: none;
      font-family: "Inter", -apple-system, sans-serif;
      font-size: 13px;
      box-shadow: var(--shadow);
    }

    .af-fab.chat { top: 10px; left: 10px; background: var(--accent); color: #fff; }
    .af-fab.admin { top: 10px; left: 136px; background: var(--danger); color: #fff; }

    #af-video-scrubber {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483646;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 12px 16px;
      width: 360px;
      max-width: calc(100vw - 40px);
      color: var(--text);
      font-family: "Inter", -apple-system, sans-serif;
      font-size: 12px;
      box-shadow: var(--shadow);
      display: none;
    }

    #af-video-scrubber.visible { display: block; }

    #af-video-scrubber .title {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px;
      color: var(--text-muted); font-weight: 600; margin-bottom: 8px;
    }

    #af-video-scrubber .time {
      font-family: "SF Mono", Consolas, monospace;
      color: var(--text); font-size: 12px; letter-spacing: 0;
      text-transform: none;
    }

    #af-video-scrubber input[type="range"] {
      -webkit-appearance: none; appearance: none;
      width: 100%; height: 4px; background: var(--border);
      border-radius: 2px; outline: none; margin-top: 4px;
    }

    #af-video-scrubber input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 14px; height: 14px; background: var(--accent);
      border-radius: 50%; cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    }

    #af-video-scrubber input[type="range"]::-moz-range-thumb {
      width: 14px; height: 14px; background: var(--accent);
      border-radius: 50%; cursor: pointer; border: none;
    }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
  `;

  function triggerTroll(action) {
    document.body.style.animation = "";
    document.body.style.transform = "";
    document.body.style.filter = "";
    const old = document.getElementById("af-troll-overlay");
    if (old) old.remove();
    if (window.__trollInt) clearInterval(window.__trollInt);

    if (action === "shake" || action === "gugugaga") {
      const s = document.createElement("style");
      s.textContent = "@keyframes af-shake{0%{transform:translate(1px,1px) rotate(0deg)}10%{transform:translate(-1px,-2px) rotate(-1deg)}20%{transform:translate(-3px,0) rotate(1deg)}30%{transform:translate(3px,2px) rotate(0deg)}40%{transform:translate(1px,-1px) rotate(1deg)}50%{transform:translate(-1px,2px) rotate(-1deg)}60%{transform:translate(-3px,1px) rotate(0deg)}70%{transform:translate(3px,1px) rotate(-1deg)}80%{transform:translate(-1px,-1px) rotate(1deg)}90%{transform:translate(1px,2px) rotate(0deg)}100%{transform:translate(1px,-2px) rotate(-1deg)}}";
      document.head.appendChild(s);
      document.body.style.animation = "af-shake 0.5s infinite";
      setTimeout(() => document.body.style.animation = "", 5000);
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
      setTimeout(() => { clearInterval(window.__trollInt); overlay.remove(); }, 5000);
    }

    if (action === "flip") {
      document.body.style.transform = "rotate(180deg)";
      setTimeout(() => document.body.style.transform = "", 5000);
    }

    if (action === "alert") alert(t("youBanned"));
    if (action === "alert") alert("You have been trolled!");

    if (action === "scary_face") {
      const overlay = document.createElement("div");
      overlay.id = "af-troll-overlay";
      overlay.style = "position:fixed; inset:0; z-index:2147483645; pointer-events:none; display:flex; justify-content:center; align-items:center; background:black;";
      overlay.innerHTML = '<img src="https://raw.githubusercontent.com/StanleyTheProgrammer/gugugaga/main/scary.jpeg" style="width:100vh; object-fit:cover;">';
      document.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), 3000);
    }

    if (action === "scary_blood") {
      const overlay = document.createElement("div");
      overlay.id = "af-troll-overlay";
      overlay.style = "position:fixed; inset:0; z-index:2147483645; pointer-events:none; background:rgba(255,0,0,0.8); display:flex; justify-content:center; align-items:center; color:white; font-size:10vw; font-family:serif; font-weight:bold; text-shadow:0 0 20px black;";
      overlay.textContent = "DON'T LOOK BEHIND YOU";
      document.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), 3000);
    }

    if (action === "scary_invert") {
      document.body.style.filter = "invert(1) hue-rotate(180deg) contrast(2)";
      setTimeout(() => document.body.style.filter = "", 3000);
    }

    if (action === "scary_static") {
      document.body.style.filter = "contrast(200%) grayscale(100%) brightness(50%)";
      const overlay = document.createElement("div");
      overlay.id = "af-troll-overlay";
      overlay.style = "position:fixed; inset:0; z-index:2147483645; pointer-events:none; background:url('https://i.gifer.com/7E2x.gif') center/cover; opacity:0.8;";
      document.body.appendChild(overlay);
      new Audio("https://www.soundjay.com/misc/sounds/static-1.mp3").play().catch(() => {});
      setTimeout(() => { overlay.remove(); document.body.style.filter = ""; }, 3000);
    }

    if (action === "troll_cursor") {
      const s = document.createElement("style");
      s.id = "af-troll-cursor";
      s.textContent = "* { cursor: url('https://cur.cursors-4u.net/cursors/cur-9/cur817.cur'), auto !important; }";
      document.head.appendChild(s);
      setTimeout(() => s.remove(), 5000);
    }

    if (action === "troll_zoom") {
      document.body.style.transition = "transform 0.1s";
      let scale = 1;
      window.__trollInt = setInterval(() => {
        scale += 0.1;
        document.body.style.transform = `scale(${scale})`;
        if (scale > 3) {
          clearInterval(window.__trollInt);
          document.body.style.transform = "";
          document.body.style.transition = "";
        }
      }, 100);
    }
  }

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
        const realUid = auth.currentUser.uid;
        const resolvedUid = realUid || saved.uid;

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
          if (realUid !== data.uid) {
            await dbMod.updateDoc(usernameRef, { uid: realUid });
          }

          const finalUid = realUid || data.uid;
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
            username: u, isBanned: false, isMod: false,
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
    console.log(`[auth] Logged in as ${username}`);

    const realUid = auth.currentUser ? auth.currentUser.uid : null;
    if (realUid && realUid !== uid) {
      console.warn("[auth] uid mismatch — saved:", uid, "real:", realUid, "→ resyncing");
      uid = realUid;
      localStorage.setItem("aplus_saved_user", JSON.stringify({ uid: realUid, username }));
      dbMod.updateDoc(dbMod.doc(db, "usernames", username), { uid: realUid })
        .then(() => console.log("[auth] usernames/" + username + " uid resynced to " + realUid))
        .catch(e => console.warn("[auth] usernames uid resync failed:", e.code, e.message));
    }

    dbMod.updateDoc(dbMod.doc(db, "users", uid), { lastSeen: Date.now() }).catch(() => {});

    const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
    dbMod.updateDoc(dbMod.doc(db, "users", uid), { activeSessionId: sessionId }).catch(() => {});

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
        console.log("[version] Script is outdated. Refreshing...");
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

    setInterval(async () => {
      try { await dbMod.updateDoc(dbMod.doc(db, "users", uid), { lastSeen: Date.now() }); } catch (e) {}
    }, 15000);

    setInterval(async () => {
      try {
        const snap = await dbMod.getDoc(dbMod.doc(db, "users", uid));
        if (snap.exists()) {
          const data = snap.data();
          isMod = data.isMod;
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

    injectAplusGUI(uid, username, db, dbMod, () => {}, () => {});
    injectVideoScrubber();
    injectChatPanel(uid, username, db, dbMod);

    if (username === ADMIN_USERNAME || isMod) {
      injectAdminPanel(db, dbMod, username);
    }
  }

  function injectVideoScrubber() {
    if (document.getElementById("af-video-scrubber")) return;

    const panel = document.createElement("div");
    panel.id = "af-video-scrubber";
    panel.innerHTML = `
      <div class="title">
        <span>${t("videoTitle")}</span>
        <span class="time" id="af-vs-time">0:00 / 0:00</span>
      </div>
      <input type="range" id="af-vs-slider" min="0" max="1" step="0.1" value="0">
    `;
    document.body.appendChild(panel);

    const slider = panel.querySelector("#af-vs-slider");
    const timeEl = panel.querySelector("#af-vs-time");

    let currentVideo = null;
    let lastSeekRetry = 0;
    let autoSkipDone = false;

    function fmt(sec) {
      if (!isFinite(sec)) return "0:00";
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return m + ":" + (s < 10 ? "0" + s : s);
    }

    function unblockSeek(video) {
      video.controls = true;
      video.removeAttribute("disablepictureinpicture");
      video.removeAttribute("controlslist");

      if (!isFinite(video.duration) || video.duration === 0) {
        try {
          Object.defineProperty(video, "duration", {
            configurable: true,
            get() { return this.buffered.length ? this.buffered.end(this.buffered.length - 1) : 0; }
          });
        } catch(e) {}
      }

      video.addEventListener("seeking", () => {
        if (currentVideo && currentVideo.__afTargetTime != null) {
          const target = currentVideo.__afTargetTime;
          if (Math.abs(video.currentTime - target) > 0.5) {
            video.currentTime = target;
          }
        }
      }, true);
    }

    function seekTo(video, time) {
      if (!video) return;
      const target = Math.max(0, Math.min(time, video.duration || 0));
      video.__afTargetTime = target;
      lastSeekRetry = Date.now();
      try { video.currentTime = target; } catch(e) {}

      const retry = setInterval(() => {
        if (Date.now() - lastSeekRetry > 3000) { clearInterval(retry); return; }
        if (Math.abs(video.currentTime - target) > 0.5) {
          try { video.currentTime = target; } catch(e) {}
        } else {
          clearInterval(retry);
        }
      }, 200);
    }

    function autoSkipIfNeeded(video) {
      if (localStorage.getItem("af_autoskip_video") === "0") return;
      if (autoSkipDone) return;
      if (!isFinite(video.duration) || video.duration <= 0) return;
      autoSkipDone = true;
      const target = Math.max(0, video.duration - 0.5);
      seekTo(video, target);
      setTimeout(() => {
        if (video.paused) video.play().catch(()=>{});
        autoClickContinue();
      }, 300);
    }

    function autoClickContinue() {
      if (localStorage.getItem("af_autoclick_continue") === "0") return;
      const btn = document.querySelector('.btn_box .ael_btn_green');
      if (btn && btn.textContent.includes('前往練習')) {
        console.log('[autofill] auto-clicking 前往練習');
        btn.click();
      }
    }

    function bindVideo(video) {
      if (!video || video === currentVideo) return;
      currentVideo = video;
      autoSkipDone = false;
      unblockSeek(video);
      panel.classList.add("visible");

      const updateUI = () => {
        const d = video.duration || 0;
        slider.max = d || 1;
        slider.value = video.currentTime || 0;
        timeEl.textContent = fmt(video.currentTime) + " / " + fmt(d);
      };

      video.addEventListener("timeupdate", updateUI);
      video.addEventListener("loadedmetadata", updateUI);
      video.addEventListener("durationchange", updateUI);

      video.addEventListener("ended", autoClickContinue);

      const tryAutoSkip = () => {
        if (isFinite(video.duration) && video.duration > 0) {
          autoSkipIfNeeded(video);
        }
      };

      video.addEventListener("loadedmetadata", tryAutoSkip);
      video.addEventListener("canplay", tryAutoSkip);
      video.addEventListener("durationchange", tryAutoSkip);

      updateUI();
      tryAutoSkip();
    }

    slider.addEventListener("input", () => {
      if (currentVideo) seekTo(currentVideo, parseFloat(slider.value));
    });

    function findVideo() {
      return (
        document.querySelector("div.video_box > video") ||
        document.querySelector("div.ael_video video") ||
        document.querySelector("div.current_video_box video") ||
        document.querySelector("video")
      );
    }

    const checkVideo = () => {
      const v = findVideo();
      if (v && v !== currentVideo) bindVideo(v);
      else if (!v && currentVideo) {
        panel.classList.remove("visible");
        currentVideo = null;
        autoSkipDone = false;
      }
    };

    const observer = new MutationObserver(checkVideo);
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(checkVideo, 1000);
    checkVideo();
  }

  function injectAplusGUI(uid, username, db, dbMod, onAuto, onShow) {
    if (document.getElementById("af-root")) return;

    const root = document.createElement("div");
    root.id = "af-root";
    root.innerHTML = `
      <div class="bar" id="af-bar"><span>${t("panelTitle")}</span><b id="af-x">&times;</b></div>
      <div class="body">
        <div class="row"><span class="label">${t("panelAuto")}</span><div class="toggle" id="af-toggle"><div class="knob"></div></div></div>
        <div class="sliderBlock">
          <div class="sliderHead"><span class="label">${t("panelSpeed")}</span><span class="sliderVal" id="af-speed-val">900ms</span></div>
          <div class="sliderRow"><input type="range" id="af-speed" min="200" max="3000" step="50" value="900"></div>
        </div>
        <div class="sliderBlock">
          <div class="sliderHead"><span class="label">${t("panelCorrect")}</span><span class="sliderVal" id="af-val">85%</span></div>
          <div class="sliderRow"><input type="range" id="af-slider" min="50" max="100" step="1" value="85"></div>
        </div>
        <button class="act" id="af-show">${t("panelShowAnswer")}</button>
        <button class="act" id="af-profile-btn">${t("panelProfile")}</button>
        <button class="act" id="af-logout" style="background:var(--danger); color:#fff;">${t("panelLogout")}</button>
        <div class="out" id="af-out"></div>
      </div>`;
    document.body.appendChild(root);

    const bar = document.getElementById("af-bar");
    const toggle = document.getElementById("af-toggle");
    const slider = document.getElementById("af-slider");
    const sliderVal = document.getElementById("af-val");
    const speedSlider = document.getElementById("af-speed");
    const speedVal = document.getElementById("af-speed-val");
    const closeBtn = document.getElementById("af-x");
    const showBtn = document.getElementById("af-show");
    const profileBtn = document.getElementById("af-profile-btn");
    const logoutBtn = document.getElementById("af-logout");
    const outEl = document.getElementById("af-out");

    let drag = false, ox = 0, oy = 0;
    let autoEnabled = false;
    let correctChance = 85;
    let advanceDelay = 900;
    let lastKey = null;
    let busy = false;

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

    function fillInputs(q, forceWrong) {
      const card = document.querySelector(".practice_base_topic_card") || document;
      const inputs = card.querySelectorAll("textarea.ant-input");
      if (!inputs.length) return 0;
      const answers = (q.childQuestions || []).filter(c => c.questionAnswer);
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
      return original;
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
              const t = part.trim().toUpperCase();
              if (t) targetLetters.push(t);
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
      const btns = card.querySelectorAll(".ael_btn");
      for (const b of btns) {
        if (b.textContent.includes("下一題") || b.textContent.includes("下一题")) return b;
      }
      const all = document.querySelectorAll('.ael_btn, button, [role="button"]');
      for (const b of all) {
        if (b.textContent && b.textContent.includes("下一題")) return b;
      }
      return null;
    }

    async function tick() {
      if (!autoEnabled || busy) return;
      busy = true;
      try {
        const q = getQuestion();
        if (!q) return;
        const key = getQuestionKey(q);
        if (!key || key === lastKey) return;
        lastKey = key;

        document.querySelectorAll('[data-autofilled="1"]').forEach(el => {
          el.removeAttribute("data-autofilled");
          el.style.outline = "";
        });

        const forceWrong = !rollCorrect();
        fillInputs(q, forceWrong);
        clickChoices(q, forceWrong);
        await fillDropdowns(q, forceWrong);

        if (onAuto) onAuto();
        dbMod.updateDoc(dbMod.doc(db, "users", uid), { autoStats: dbMod.increment(1) }).catch(() => {});

        await new Promise(r => setTimeout(r, advanceDelay));
        if (!autoEnabled) return;

        const next = findNextButton();
        if (next) next.click();
      } finally { busy = false; }
    }

    toggle.addEventListener("click", () => {
      autoEnabled = !autoEnabled;
      toggle.classList.toggle("active", autoEnabled);
    });
    slider.addEventListener("input", () => {
      correctChance = parseInt(slider.value, 10);
      sliderVal.textContent = correctChance + "%";
    });
    speedSlider.addEventListener("input", () => {
      advanceDelay = parseInt(speedSlider.value, 10);
      speedVal.textContent = advanceDelay + "ms";
    });
    closeBtn.addEventListener("click", () => root.remove());

    setInterval(tick, 800);
  }

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
      const role = data.username === ADMIN_USERNAME ? '<span style="color:var(--danger);">' + t("adminAdmin") + '</span>' : (data.isMod ? '<span style="color:var(--warning);">' + t("adminMod") + '</span>' : "");

      resDiv.innerHTML = `
        <div class="af-profile-card">
          <h3>${data.username} ${isMe ? t("profileYou") : ""} ${role}</h3>
          <div style="font-size:12px; color:var(--text-dim);">${t("profileStatus")}: ${status}</div>
          <div class="af-profile-stats">
            <div>${t("profileAutoStats")}: <b>${data.autoStats || 0}</b></div>
            <div>${t("profileShowStats")}: <b>${data.showStats || 0}</b></div>
          </div>
        </div>`;
    });
  }

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
      if (existing) { existing.remove(); return; }

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
      document.getElementById("af-chat-close").onclick = () => panel.remove();

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
        dbMod.orderBy("timestamp"),
        dbMod.limit(100)
      );
      dbMod.onSnapshot(globalQ, snapshot => {
        chatBox.innerHTML = "";
        snapshot.forEach(d => {
          const data = d.data();
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

      let isModCached = false;
      dbMod.onSnapshot(dbMod.doc(db, "users", uid), s => {
        if (s.exists()) isModCached = !!s.data().isMod;
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
            isMod: isModCached,
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
      let groupUnsub = null;
      let groupsCache = {};

      function escapeHtml(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      }

      dbMod.onSnapshot(dbMod.collection(db, "groups"), snap => {
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

        if (groupUnsub) groupUnsub();
        const msgQ = dbMod.query(
          dbMod.collection(db, "groups", gid, "messages"),
          dbMod.orderBy("timestamp"),
          dbMod.limit(200)
        );
        groupUnsub = dbMod.onSnapshot(msgQ, snap => {
          groupMsgBox.innerHTML = "";
          snap.forEach(d => {
            const data = d.data();
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
          if (groupUnsub) { groupUnsub(); groupUnsub = null; }
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
              <option value="scary_face">${t("trollScaryFace")}</option>
              <option value="scary_blood">${t("trollScaryBlood")}</option>
              <option value="scary_invert">${t("trollScaryInvert")}</option>
              <option value="scary_static">${t("trollScaryStatic")}</option>
            </select>
          </div>
          <div>
            <div class="af-section-title">${t("adminAllUsers")}</div>
            <div id="af-admin-list">Loading...</div>
          </div>
        </div>`;
      document.body.appendChild(panel);
      document.getElementById("af-admin-close").onclick = () => panel.remove();

      let isPanelDragging = false, panelX = 0, panelY = 0;
      const header = document.getElementById("af-admin-header");
      header.addEventListener("pointerdown", e => {
        if (e.target.id === "af-admin-close") return;
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

      const listDiv = document.getElementById("af-admin-list");
      dbMod.onSnapshot(dbMod.collection(db, "users"), snap => {
        listDiv.innerHTML = "";
        const activeUid = JSON.parse(localStorage.getItem('aplus_saved_user')).uid;

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
          nameWrap.innerHTML = `<div class="af-status-dot ${isOnline ? "af-status-online" : "af-status-offline"}"></div> <span>${escapeHtml(data.username || "?")} <span style="font-size:10px; color:var(--text-muted);">(${tuid.slice(0,5)})</span></span>`;

          const actions = document.createElement("div");
          actions.className = "actions";

          const trollBtn = document.createElement("button");
          trollBtn.textContent = t("adminTroll");
          trollBtn.className = "troll";
          trollBtn.onclick = async () => {
            const effect = document.getElementById("af-troll-select").value;
            const targetUid = (data.username === myUsername) ? activeUid : tuid;
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

          if (myUsername === ADMIN_USERNAME && !isSelf && !isTargetAdmin) {
            const modBtn = document.createElement("button");
            modBtn.textContent = isTargetMod ? t("adminDemod") : t("adminMakeMod");
            modBtn.className = isTargetMod ? "demod" : "mod";
            modBtn.onclick = async () => {
              await dbMod.updateDoc(dbMod.doc(db, "users", tuid), { isMod: !isTargetMod });
            };
            actions.appendChild(modBtn);
          }

          row.appendChild(nameWrap);
          row.appendChild(actions);
          listDiv.appendChild(row);
        });
      });
    };
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  initAuth();
}();
