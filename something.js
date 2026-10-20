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

  // ══════════════════════════════════════════
  // Firebase loader
  // ══════════════════════════════════════════
  async function loadFirebase() {
    const appMod = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    const authMod = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    const dbMod = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    const app = appMod.initializeApp(firebaseConfig);
    return { auth: authMod.getAuth(app), db: dbMod.getFirestore(app), authMod, dbMod };
  }

  // ══════════════════════════════════════════
  // Styles
  // ══════════════════════════════════════════
  const css = `
    #af-auth-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 2147483648; display: flex; align-items: center; justify-content: center; font-family: -apple-system, sans-serif; }
    #af-auth-box { background: #1c1c1e; padding: 24px; border-radius: 12px; width: 300px; color: #fff; border: 1px solid #333; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    #af-auth-box h2 { margin: 0 0 16px 0; font-size: 18px; text-align: center; color: #e5e5e7; }
    #af-auth-box input { width: 100%; box-sizing: border-box; padding: 10px; margin-bottom: 10px; background: #2c2c2e; border: 1px solid #3a3a3c; border-radius: 6px; color: #fff; font-size: 14px; outline: none; }
    #af-auth-box input:focus { border-color: #0a84ff; }
    #af-auth-box button { width: 100%; padding: 10px; margin-top: 6px; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
    #af-auth-btn { background: #0a84ff; color: #fff; }
    #af-auth-btn:hover { background: #0070d8; }
    #af-auth-switch { background: transparent; color: #98989d; font-weight: normal; font-size: 12px; margin-top: 12px; }
    #af-auth-switch:hover { color: #fff; }
    #af-error { color: #ff453a; font-size: 12px; text-align: center; margin-bottom: 10px; min-height: 14px; }

    #af-admin-panel, #af-chat-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #1c1c1e; border: 1px solid #333; border-radius: 12px; padding: 0; z-index: 2147483649; width: 500px; max-height: 85vh; color: #fff; font-family: -apple-system, sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; }
    #af-chat-panel { width: 560px; }
    #af-admin-header, #af-chat-header { padding: 15px 20px; background: #232325; border-bottom: 1px solid #333; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none; touch-action: none; }
    #af-admin-header h2 { margin: 0; color: #ff453a; font-size: 18px; pointer-events: none; }
    #af-chat-header h2 { margin: 0; color: #0a84ff; font-size: 18px; pointer-events: none; }
    #af-admin-close, #af-chat-close { background: none; border: none; color: #98989d; cursor: pointer; font-size: 20px; line-height: 1; padding: 0; }
    #af-admin-close:hover, #af-chat-close:hover { color: #fff; }
    #af-admin-content { padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
    .af-section-title { font-size: 14px; color: #98989d; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; display: flex; justify-content: space-between; align-items: flex-end; }
    .af-user-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #2a2a2a; font-size: 14px; }
    .af-user-row .name { display: flex; align-items: center; gap: 8px; }
    .af-status-dot { width: 8px; height: 8px; border-radius: 50%; }
    .af-status-online { background: #30d158; box-shadow: 0 0 5px #30d158; }
    .af-status-offline { background: #555; }
    .af-user-row .actions { display: flex; gap: 6px; }
    .af-user-row button { color: #fff; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .af-user-row button.ban { background: #ff453a; }
    .af-user-row button.unban { background: #30d158; }
    .af-user-row button.troll { background: #bf5af2; }
    .af-user-row button.mod { background: #ff9f0a; }
    .af-user-row button.demod { background: #555; }
    .af-user-row button.disabled { background: #333; color: #888; cursor: not-allowed; }

    #af-troll-select, #af-chat-input, #af-search, #af-group-name-input, #af-group-user-search {
      width: 100%; padding: 10px; margin-bottom: 10px;
      background: #2c2c2e !important; color: #fff !important;
      border: 1px solid #3a3a3c; border-radius: 6px;
      box-sizing: border-box; font-family: inherit; font-size: 13px;
    }
    #af-troll-select:focus, #af-chat-input:focus, #af-search:focus, #af-group-name-input:focus, #af-group-user-search:focus { border-color: #0a84ff; outline: none; }
    #af-troll-select option { background: #2c2c2e; color: #fff; }

    #af-chat-box { background: #111; border: 1px solid #333; border-radius: 8px; height: 200px; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 6px; }
    #af-group-msg-box { background: #111; border: 1px solid #333; border-radius: 8px; height: 260px; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 6px; }
    .af-chat-msg { font-size: 13px; line-height: 1.4; }
    .af-chat-msg .author { font-weight: bold; color: #0a84ff; margin-right: 6px; }
    .af-chat-msg .author.admin { color: #ff453a; }
    .af-chat-msg .author.mod { color: #ff9f0a; }
    .af-chat-msg .text { color: #e5e5e7; }
    #af-chat-form, #af-group-msg-form { display: flex; gap: 8px; margin-top: 10px; }
    #af-chat-input, #af-group-msg-input { margin-bottom: 0; flex-grow: 1; }
    #af-chat-send, #af-group-msg-send { padding: 0 15px; background: #0a84ff; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }

    .af-tabs { display: flex; border-bottom: 1px solid #333; background: #232325; }
    .af-tab { padding: 10px 16px; cursor: pointer; font-size: 13px; color: #98989d; border-bottom: 2px solid transparent; }
    .af-tab:hover { color: #fff; }
    .af-tab.active { color: #0a84ff; border-bottom-color: #0a84ff; }
    .af-tab-content { padding: 15px 20px; overflow-y: auto; flex: 1; }

    #af-group-list { display: flex; flex-direction: column; gap: 6px; max-height: 150px; overflow-y: auto; }
    .af-group-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #2c2c2e; border: 1px solid #3a3a3c; border-radius: 6px; cursor: pointer; font-size: 13px; }
    .af-group-item:hover { border-color: #0a84ff; }
    .af-group-item.selected { border-color: #0a84ff; background: #1c2d44; }
    .af-group-item .gname { font-weight: bold; }
    .af-group-item .gmembers { color: #98989d; font-size: 11px; margin-top: 2px; }
    #af-group-members { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
    .af-member-chip { background: #2c2c2e; border: 1px solid #3a3a3c; border-radius: 12px; padding: 3px 8px; font-size: 11px; display: flex; align-items: center; gap: 5px; }
    .af-member-chip .rm { cursor: pointer; color: #ff453a; font-weight: bold; }
    #af-group-search-results { max-height: 120px; overflow-y: auto; border: 1px solid #333; border-radius: 6px; margin-bottom: 10px; }
    .af-search-result { padding: 8px 10px; cursor: pointer; font-size: 13px; border-bottom: 1px solid #2a2a2a; display: flex; justify-content: space-between; }
    .af-search-result:hover { background: #2c2c2e; }
    .af-search-result:last-child { border-bottom: none; }
    .af-search-result .add { color: #30d158; font-weight: bold; }

    .af-btn { padding: 8px 14px; border: none; border-radius: 6px; font-size: 13px; font-weight: bold; cursor: pointer; background: #0a84ff; color: #fff; }
    .af-btn:hover { background: #0070d8; }
    .af-btn.secondary { background: #333336; color: #e5e5e7; }
    .af-btn.secondary:hover { background: #3d3d40; }
    .af-btn.danger { background: #ff453a; }
    .af-btn.danger:hover { background: #d83a30; }

    #af-root { position: fixed; bottom: 20px; right: 20px; z-index: 2147483647; width: 224px; background: #1c1c1e; border: 1px solid #2e2e30; border-radius: 10px; font-family: -apple-system, "SF Pro Text", "Segoe UI", Roboto, sans-serif; font-size: 12px; color: #e5e5e7; box-shadow: 0 8px 28px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.03) inset; user-select: none; -webkit-user-select: none; overflow: hidden; }
    #af-root .bar { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; background: #232325; border-bottom: 1px solid #2e2e30; cursor: move; touch-action: none; }
    #af-root .bar span { font-size: 11.5px; font-weight: 600; letter-spacing: 0.2px; color: #b8b8bd; pointer-events: none; }
    #af-root .bar b { background: none; border: none; color: #6e6e73; font-size: 15px; font-weight: 400; cursor: pointer; padding: 0 2px; line-height: 1; transition: color .12s; touch-action: manipulation; }
    #af-root .bar b:hover { color: #e5e5e7; }
    #af-root .body { padding: 12px; }
    #af-root .row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    #af-root .label { font-size: 12px; color: #98989d; letter-spacing: 0.1px; }
    #af-root .toggle { position: relative; width: 36px; height: 20px; background: #333336; border-radius: 10px; cursor: pointer; transition: background .15s ease; touch-action: manipulation; flex-shrink: 0; }
    #af-root .toggle.active { background: #0a84ff; }
    #af-root .toggle .knob { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: #fff; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.3); transition: transform .15s ease; }
    #af-root .toggle.active .knob { transform: translateX(16px); }
    #af-root .sliderBlock { margin-bottom: 10px; }
    #af-root .sliderHead { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
    #af-root .sliderRow { display: flex; align-items: center; gap: 10px; }
    #af-root .sliderVal { font-size: 11.5px; color: #e5e5e7; font-family: "SF Mono", Consolas, Menlo, monospace; min-width: 44px; text-align: right; letter-spacing: -0.2px; }
    #af-root input[type="range"] { -webkit-appearance: none; appearance: none; flex: 1; height: 3px; background: #333336; border-radius: 2px; outline: none; touch-action: manipulation; }
    #af-root input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; background: #fff; border-radius: 50%; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.4); transition: transform .1s; }
    #af-root input[type="range"]::-webkit-slider-thumb:active { transform: scale(1.1); }
    #af-root input[type="range"]::-moz-range-thumb { width: 14px; height: 14px; background: #fff; border-radius: 50%; cursor: pointer; border: none; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }
    #af-root button.act { width: 100%; padding: 8px; background: #333336; color: #e5e5e7; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; font-family: inherit; transition: background .12s; margin-bottom: 6px; }
    #af-root button.act:hover { background: #3d3d40; }
    #af-root button.act:active { background: #2a2a2c; }
    #af-root .out { margin-top: 10px; padding: 9px 10px; background: #161618; border: 1px solid #2e2e30; border-radius: 6px; font-family: "SF Mono", Consolas, Menlo, monospace; font-size: 11px; color: #d1d1d6; word-break: break-all; line-height: 1.5; display: none; max-height: 150px; overflow-y: auto; }
    #af-root .out.show { display: block; }
    #af-root .out .lbl { color: #6e6e73; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 5px; font-weight: 600; }
    #af-root .out .val { color: #30d158; }
    #af-root .out .err { color: #ff453a; }
    #af-root .ans-row { padding: 3px 0; border-bottom: 1px solid #232325; }
    #af-root .ans-row:last-child { border-bottom: none; }
    #af-root .ans-q { color: #6e6e73; margin-right: 6px; font-size: 10.5px; }
    #af-root .frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 2px; line-height: 1.05; color: #30d158; font-family: Georgia, "Times New Roman", serif; font-size: 12px; }
    #af-root .frac .num { padding: 0 5px; }
    #af-root .frac .den { padding: 0 5px; border-top: 1px solid #30d158; }

    .af-profile-card { background: #1c1c1e; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px; text-align: center; }
    .af-profile-card h3 { margin: 0 0 5px 0; color: #0a84ff; }
    .af-profile-stats { font-size: 13px; color: #ccc; margin-top: 10px; }

    .af-fab { position: fixed; z-index: 99999; padding: 10px 14px; border: none; border-radius: 8px; cursor: move; font-weight: bold; touch-action: none; user-select: none; font-family: -apple-system, sans-serif; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
    .af-fab.chat { top: 10px; left: 10px; background: #0a84ff; color: #fff; }
    .af-fab.admin { top: 10px; left: 130px; background: #ff453a; color: #fff; }
  `;

  // ══════════════════════════════════════════
  // Troll effects
  // ══════════════════════════════════════════
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

  // ══════════════════════════════════════════
  // Auth + startup
  // ══════════════════════════════════════════
  async function initAuth() {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const { auth, db, authMod, dbMod } = await loadFirebase();

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
          throw new Error("Account Banned.");
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

    // Login / Register modal
    const modal = document.createElement("div");
    modal.id = "af-auth-modal";
    modal.innerHTML = `
      <div id="af-auth-box">
        <h2 id="af-auth-title">Login</h2>
        <div id="af-error"></div>
        <input type="text" id="af-username" placeholder="Username" autocomplete="off">
        <input type="password" id="af-password" placeholder="Password (max 20 chars)" maxlength="20">
        <button id="af-auth-btn">Login</button>
        <button id="af-auth-switch">Need an account? Register</button>
      </div>`;
    document.body.appendChild(modal);

    let isLogin = true;
    document.getElementById("af-auth-switch").onclick = () => {
      isLogin = !isLogin;
      document.getElementById("af-auth-title").textContent = isLogin ? "Login" : "Create Account";
      document.getElementById("af-auth-btn").textContent = isLogin ? "Login" : "Register";
      document.getElementById("af-auth-switch").textContent = isLogin ? "Need an account? Register" : "Already have an account? Login";
      document.getElementById("af-error").textContent = "";
    };

    document.getElementById("af-auth-btn").onclick = async () => {
      const u = document.getElementById("af-username").value.trim().toLowerCase();
      const p = document.getElementById("af-password").value;
      const errDiv = document.getElementById("af-error");
      const btn = document.getElementById("af-auth-btn");

      if (!u || !p) return errDiv.textContent = "Fill all fields.";
      if (p.length > 20) return errDiv.textContent = "Password max 20 chars.";
      btn.disabled = true;
      errDiv.textContent = "Processing...";

      try {
        const usernameRef = dbMod.doc(db, "usernames", u);

        if (isLogin) {
          const snap = await dbMod.getDoc(usernameRef);
          if (!snap.exists()) throw new Error("Account not found.");
          const data = snap.data();
          if (data.password !== p) throw new Error("Wrong password.");

          await authMod.signInAnonymously(auth);
          const realUid = auth.currentUser.uid;

          const userSnap = await dbMod.getDoc(dbMod.doc(db, "users", data.uid));
          if (userSnap.exists() && userSnap.data().isBanned && u !== ADMIN_USERNAME) {
            await authMod.signOut(auth);
            throw new Error("This account is BANNED.");
          }
          if (realUid !== data.uid) {
            await dbMod.updateDoc(usernameRef, { uid: realUid });
          }

          const finalUid = realUid || data.uid;
          localStorage.setItem("aplus_saved_user", JSON.stringify({ uid: finalUid, username: u }));
          modal.remove();
          startHack(finalUid, u, db, dbMod, auth, authMod);

        } else {
          // Register
          let deviceId = localStorage.getItem("aplus_device_id");
          if (!deviceId) {
            deviceId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
            localStorage.setItem("aplus_device_id", deviceId);
          }
          const deviceRef = dbMod.doc(db, "devices", deviceId);
          const dSnap = await dbMod.getDoc(deviceRef);
          if (dSnap.exists()) throw new Error("This device is already registered.");

          const uSnap = await dbMod.getDoc(usernameRef);
          if (uSnap.exists()) throw new Error("Username taken.");

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

  // ══════════════════════════════════════════
  // Migration: repair stale usernames/{u}.uid
  // ══════════════════════════════════════════
  async function runUidMigration(db, dbMod) {
    if (sessionStorage.getItem("af_migration_done") === "1") return;
    console.log("[migration] scanning users for stale uid...");
    try {
      const usersSnap = await dbMod.getDocs(dbMod.collection(db, "users"));
      let fixed = 0, checked = 0;
      const tasks = [];
      usersSnap.forEach(u => {
        const data = u.data();
        if (!data.username) return;
        checked++;
        tasks.push((async () => {
          try {
            const uRef = dbMod.doc(db, "usernames", data.username);
            const uSnap = await dbMod.getDoc(uRef);
            if (!uSnap.exists()) return;
            if (uSnap.data().uid !== u.id) {
              await dbMod.updateDoc(uRef, { uid: u.id });
              fixed++;
              console.log(`[migration] fixed ${data.username}: ${uSnap.data().uid} → ${u.id}`);
            }
          } catch (e) {
            console.warn("[migration] skip", data.username, e.message);
          }
        })());
      });
      await Promise.all(tasks);
      sessionStorage.setItem("af_migration_done", "1");
      console.log(`[migration] done. checked=${checked} fixed=${fixed}`);
    } catch (e) {
      console.warn("[migration] failed", e.message);
    }
  }

  // ══════════════════════════════════════════
  // Main startup per logged-in user
  // ══════════════════════════════════════════
  function startHack(uid, username, db, dbMod, auth, authMod) {
    console.log(`[auth] Logged in as ${username}`);

    // Self-heal: saved uid must match live auth uid
    const realUid = auth.currentUser ? auth.currentUser.uid : null;
    if (realUid && realUid !== uid) {
      console.warn("[auth] uid mismatch — saved:", uid, "real:", realUid, "→ resyncing");
      uid = realUid;
      localStorage.setItem("aplus_saved_user", JSON.stringify({ uid: realUid, username }));
      dbMod.updateDoc(dbMod.doc(db, "usernames", username), { uid: realUid }).catch(() => {});
    }

    // Watchdog: localStorage cleared mid-session → clean logout
    if (window.__afLcWatch) clearInterval(window.__afLcWatch);
    window.__afLcWatch = setInterval(() => {
      if (!localStorage.getItem("aplus_saved_user")) {
        clearInterval(window.__afLcWatch);
        authMod.signOut(auth).finally(() => location.reload());
      }
    }, 2000);

    // Admin-only: auto-migrate all stale username uids
    if (username === ADMIN_USERNAME) runUidMigration(db, dbMod);

    let isMod = false;

    // Heartbeat
    setInterval(async () => {
      try { await dbMod.updateDoc(dbMod.doc(db, "users", uid), { lastSeen: Date.now() }); } catch (e) {}
    }, 15000);

    // Ban check
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
              alert("You have been BANNED.");
              localStorage.removeItem("aplus_saved_user");
              await authMod.signOut(auth);
              location.reload();
            }
          }
        }
      } catch (e) {}
    }, 3000);

    // Troll command listener
    dbMod.onSnapshot(dbMod.doc(db, "commands", uid), docSnap => {
      if (!docSnap.exists()) return;
      const data = docSnap.data();
      const lastSeen = localStorage.getItem("af_last_troll");
      if (lastSeen == data.timestamp) return;
      localStorage.setItem("af_last_troll", data.timestamp);
      triggerTroll(data.action);
    });

    injectAplusGUI(uid, username, db, dbMod, () => {}, () => {});
    injectChatPanel(uid, username, db, dbMod);

    if (username === ADMIN_USERNAME || isMod) {
      injectAdminPanel(db, dbMod, username);
    }
  }

  // ══════════════════════════════════════════
  // Autofill GUI (core mechanic — DO NOT TOUCH)
  // ══════════════════════════════════════════
  function injectAplusGUI(uid, username, db, dbMod, onAuto, onShow) {
    if (document.getElementById("af-root")) return;

    const root = document.createElement("div");
    root.id = "af-root";
    root.innerHTML = `
      <div class="bar" id="af-bar"><span>Autofill</span><b id="af-x">&times;</b></div>
      <div class="body">
        <div class="row"><span class="label">Auto</span><div class="toggle" id="af-toggle"><div class="knob"></div></div></div>
        <div class="sliderBlock">
          <div class="sliderHead"><span class="label">Speed</span><span class="sliderVal" id="af-speed-val">900ms</span></div>
          <div class="sliderRow"><input type="range" id="af-speed" min="200" max="3000" step="50" value="900"></div>
        </div>
        <div class="sliderBlock">
          <div class="sliderHead"><span class="label">Correct</span><span class="sliderVal" id="af-val">85%</span></div>
          <div class="sliderRow"><input type="range" id="af-slider" min="50" max="100" step="1" value="85"></div>
        </div>
        <button class="act" id="af-show">Show answer</button>
        <button class="act" id="af-profile-btn">Profile Search</button>
        <button class="act" id="af-logout" style="background:#ff453a; color:#fff;">Log Out</button>
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

    // Draggable bar
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

    // Vue tree walk → live question payload
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

    // Text fill
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
        input.style.outline = "2px solid " + (forceWrong ? "#ff453a" : "#30d158");
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

    // Multi-choice fill
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
              matched.style.outline = "2px solid #30d158";
              clicked++;
            }
          }
        }

        for (const wi of wrongIdxList) {
          const li = items[wi];
          if (!li || li.dataset.autofilled === "1") continue;
          li.click();
          li.dataset.autofilled = "1";
          li.style.outline = "2px solid #ff453a";
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
                li.style.outline = "2px solid #30d158";
                clicked++;
                break;
              }
            }
          }
        }
      }
      return clicked;
    }

    // Dropdown fill
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

  // ══════════════════════════════════════════
  // Profile search panel
  // ══════════════════════════════════════════
  async function injectProfilePanel(uid, db, dbMod) {
    const existing = document.getElementById("af-profile-panel");
    if (existing) { existing.remove(); return; }

    const panel = document.createElement("div");
    panel.id = "af-profile-panel";
    panel.style = "position:fixed; top:20%; left:20%; background:#1c1c1e; border:1px solid #333; border-radius:12px; padding:20px; z-index:2147483649; width:300px; color:#fff; font-family:-apple-system,sans-serif; box-shadow:0 10px 30px rgba(0,0,0,0.5);";
    panel.innerHTML = `
      <button id="af-profile-close" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#98989d; cursor:pointer; font-size:18px;">&times;</button>
      <h2 style="margin-top:0; color:#0a84ff;">Profile Search</h2>
      <input type="text" id="af-search" placeholder="Search username...">
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
        resDiv.innerHTML = '<div style="color:#ff453a; margin-top:10px;">User not found.</div>';
        return;
      }
      const uData = uSnap.data();
      const userDoc = await dbMod.getDoc(dbMod.doc(db, "users", uData.uid));
      if (!userDoc.exists()) return;

      const data = userDoc.data();
      const isMe = uData.uid === uid;
      const status = data.isBanned ? '<span style="color:#ff453a;">Banned</span>' : '<span style="color:#30d158;">Active</span>';
      const role = data.username === ADMIN_USERNAME ? '<span style="color:#ff453a;">Admin</span>' : (data.isMod ? '<span style="color:#ff9f0a;">Mod</span>' : "");

      resDiv.innerHTML = `
        <div class="af-profile-card">
          <h3>${data.username} ${isMe ? "(You)" : ""} ${role}</h3>
          <div style="font-size:12px; color:#98989d;">Status: ${status}</div>
          <div class="af-profile-stats">
            <div>Auto-Answered: <b>${data.autoStats || 0}</b></div>
            <div>Answers Viewed: <b>${data.showStats || 0}</b></div>
          </div>
        </div>`;
    });
  }

  // ══════════════════════════════════════════
  // Chat panel (everyone: global + groups)
  // ══════════════════════════════════════════
  function injectChatPanel(uid, username, db, dbMod) {
    if (document.getElementById("af-chat-fab")) return;

    // Floating Chat button
    const fab = document.createElement("button");
    fab.className = "af-fab chat";
    fab.id = "af-chat-fab";
    fab.textContent = "Chat";
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
        <div id="af-chat-header"><h2>Chat</h2><button id="af-chat-close">&times;</button></div>
        <div class="af-tabs">
          <div class="af-tab active" data-tab="global">Global</div>
          <div class="af-tab" data-tab="groups">Groups</div>
        </div>
        <div class="af-tab-content" id="af-tab-global">
          <div id="af-chat-box"></div>
          <form id="af-chat-form">
            <input type="text" id="af-chat-input" placeholder="Type a message..." autocomplete="off" maxlength="500">
            <button id="af-chat-send" type="submit">Send</button>
          </form>
        </div>
        <div class="af-tab-content" id="af-tab-groups" style="display:none;">
          <div class="af-section-title">Your Groups
            <button class="af-btn" id="af-create-group-btn" style="padding:4px 10px; font-size:11px;">+ New Group</button>
          </div>
          <div id="af-group-list"><div style="color:#98989d; font-size:12px;">No groups yet.</div></div>
          <div id="af-group-view" style="display:none; margin-top:15px;">
            <div class="af-section-title" id="af-group-view-title">Group</div>
            <div id="af-group-members"></div>
            <div id="af-group-msg-box"></div>
            <form id="af-group-msg-form">
              <input type="text" id="af-group-msg-input" placeholder="Message the group..." autocomplete="off" maxlength="500">
              <button id="af-group-msg-send" type="submit">Send</button>
            </form>
            <div style="margin-top:10px; display:flex; gap:6px;">
              <button class="af-btn secondary" id="af-add-member-btn" style="font-size:11px;">+ Add Member</button>
              <button class="af-btn danger" id="af-leave-group-btn" style="font-size:11px;">Leave Group</button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(panel);
      document.getElementById("af-chat-close").onclick = () => panel.remove();

      // Draggable header
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

      // Tabs
      panel.querySelectorAll(".af-tab").forEach(tab => {
        tab.onclick = () => {
          panel.querySelectorAll(".af-tab").forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          const which = tab.dataset.tab;
          document.getElementById("af-tab-global").style.display = which === "global" ? "" : "none";
          document.getElementById("af-tab-groups").style.display = which === "groups" ? "" : "none";
        };
      });

      // ── Global chat ──
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
          div.innerHTML = `<span class="author ${isAdminMsg ? "admin" : isModMsg ? "mod" : ""}">${escapeHtml(data.author)}</span> <span style="color:#666; font-size:10px;">${time}</span><br><span class="text">${escapeHtml(data.text)}</span>`;
          chatBox.appendChild(div);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
      });

      // Cached isMod (no read-before-write)
      let isModCached = false;
      dbMod.onSnapshot(dbMod.doc(db, "users", uid), s => {
        if (s.exists()) isModCached = !!s.data().isMod;
      });

      chatForm.onsubmit = async e => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = "";

        // Optimistic local echo
        const localDiv = document.createElement("div");
        localDiv.className = "af-chat-msg";
        localDiv.style.opacity = "0.6";
        localDiv.innerHTML = `<span class="author">${escapeHtml(username)}</span> <span style="color:#666; font-size:10px;">sending…</span><br><span class="text">${escapeHtml(text)}</span>`;
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
          localDiv.style.color = "#ff453a";
          localDiv.querySelector("span[style]").textContent = "failed";
        }
      };

      // ── Groups ──
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
          groupListEl.innerHTML = '<div style="color:#98989d; font-size:12px;">No groups yet.</div>';
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
            div.innerHTML = `<span class="author">${escapeHtml(data.author)}</span> <span style="color:#666; font-size:10px;">${time}</span><br><span class="text">${escapeHtml(data.text)}</span>`;
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
        overlay.style = "position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:2147483650; display:flex; align-items:center; justify-content:center;";
        overlay.innerHTML = `
          <div style="background:#1c1c1e; border:1px solid #333; border-radius:12px; padding:20px; width:340px; color:#fff; font-family:-apple-system,sans-serif;">
            <h3 style="margin:0 0 12px 0; color:#0a84ff; font-size:16px;">Create Group</h3>
            <input type="text" id="af-group-name-input" placeholder="Group name" maxlength="40" autocomplete="off">
            <input type="text" id="af-group-user-search" placeholder="Search users to add..." autocomplete="off">
            <div id="af-group-search-results"></div>
            <div id="af-group-invite-list" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px; min-height:0;"></div>
            <div style="display:flex; gap:8px; justify-content:flex-end;">
              <button class="af-btn secondary" id="af-group-cancel">Cancel</button>
              <button class="af-btn" id="af-group-create">Create</button>
            </div>
            <div id="af-group-create-err" style="color:#ff453a; font-size:12px; margin-top:10px; min-height:14px;"></div>
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
            resultsEl.innerHTML = '<div style="padding:8px 10px; color:#98989d; font-size:12px;">No user found.</div>';
            return;
          }
          if (q === username) return;
          const row = document.createElement("div");
          row.className = "af-search-result";
          row.innerHTML = `<span>${escapeHtml(q)}</span><span class="add">+ Add</span>`;
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
        overlay.style = "position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:2147483650; display:flex; align-items:center; justify-content:center;";
        overlay.innerHTML = `
          <div style="background:#1c1c1e; border:1px solid #333; border-radius:12px; padding:20px; width:320px; color:#fff; font-family:-apple-system,sans-serif;">
            <h3 style="margin:0 0 12px 0; color:#0a84ff; font-size:16px;">Add Member</h3>
            <input type="text" id="af-group-user-search" placeholder="Search username..." autocomplete="off">
            <div id="af-group-search-results"></div>
            <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:8px;">
              <button class="af-btn secondary" id="af-group-cancel">Close</button>
            </div>
            <div id="af-group-create-err" style="color:#ff453a; font-size:12px; margin-top:10px; min-height:14px;"></div>
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
            resultsEl.innerHTML = '<div style="padding:8px 10px; color:#98989d; font-size:12px;">No user found.</div>';
            return;
          }
          const gRef = dbMod.doc(db, "groups", gid);
          const gSnap = await dbMod.getDoc(gRef);
          if (!gSnap.exists()) return;
          const currentMembers = gSnap.data().members || {};
          if (currentMembers[q]) {
            resultsEl.innerHTML = '<div style="padding:8px 10px; color:#98989d; font-size:12px;">Already a member.</div>';
            return;
          }
          if (q === username) return;
          const row = document.createElement("div");
          row.className = "af-search-result";
          row.innerHTML = `<span>${escapeHtml(q)}</span><span class="add">+ Add</span>`;
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

  // ══════════════════════════════════════════
  // Admin panel (troll / ban / mod)
  // ══════════════════════════════════════════
  function injectAdminPanel(db, dbMod, myUsername) {
    if (document.getElementById("af-admin-fab")) return;

    const btn = document.createElement("button");
    btn.className = "af-fab admin";
    btn.id = "af-admin-fab";
    btn.textContent = "Admin";

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
        <div id="af-admin-header"><h2>Admin & Mod Panel</h2><button id="af-admin-close">&times;</button></div>
        <div id="af-admin-content">
          <div>
            <div class="af-section-title">Troll Tool</div>
            <select id="af-troll-select">
              <option value="gugugaga">GUGUGAGA Spam</option>
              <option value="shake">Shake Screen</option>
              <option value="flip">Flip Screen</option>
              <option value="alert">Random Alert</option>
              <option value="troll_cursor">Spooky Cursor</option>
              <option value="troll_zoom">Infinite Zoom</option>
              <option value="scary_face">Scary Face</option>
              <option value="scary_blood">Blood Overlay</option>
              <option value="scary_invert">Inverted Colors</option>
              <option value="scary_static">Static Noise + Scream</option>
            </select>
          </div>
          <div>
            <div class="af-section-title">All Users</div>
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
        snap.forEach(docSnap => {
          const data = docSnap.data();
          const tuid = docSnap.id;
          const isSelf = data.username === myUsername;
          const isTargetAdmin = data.username === ADMIN_USERNAME;
          const isTargetMod = data.isMod;
          const isOnline = data.lastSeen && (Date.now() - data.lastSeen < 45000);

          const row = document.createElement("div");
          row.className = "af-user-row";

          const nameWrap = document.createElement("div");
          nameWrap.className = "name";
          nameWrap.innerHTML = `<div class="af-status-dot ${isOnline ? "af-status-online" : "af-status-offline"}"></div> <span>${escapeHtml(data.username || "?")}</span>`;

          const actions = document.createElement("div");
          actions.className = "actions";

          const trollBtn = document.createElement("button");
          trollBtn.textContent = "Troll";
          trollBtn.className = "troll";
          trollBtn.onclick = async () => {
            const effect = document.getElementById("af-troll-select").value;
            await dbMod.setDoc(dbMod.doc(db, "commands", tuid), { action: effect, timestamp: Date.now() });
            trollBtn.textContent = "Sent!";
            setTimeout(() => trollBtn.textContent = "Troll", 2000);
          };
          actions.appendChild(trollBtn);

          const banBtn = document.createElement("button");
          const canBan = !isSelf && !isTargetAdmin && (myUsername === ADMIN_USERNAME || !isTargetMod);
          if (isSelf) {
            banBtn.textContent = "Me"; banBtn.className = "disabled"; banBtn.disabled = true;
          } else if (!canBan) {
            banBtn.textContent = isTargetAdmin ? "Admin" : "Mod"; banBtn.className = "disabled"; banBtn.disabled = true;
          } else {
            banBtn.textContent = data.isBanned ? "Unban" : "Ban";
            banBtn.className = data.isBanned ? "unban" : "ban";
            banBtn.onclick = async () => {
              await dbMod.updateDoc(dbMod.doc(db, "users", tuid), { isBanned: !data.isBanned });
            };
          }
          actions.appendChild(banBtn);

          if (myUsername === ADMIN_USERNAME && !isSelf && !isTargetAdmin) {
            const modBtn = document.createElement("button");
            modBtn.textContent = isTargetMod ? "Demod" : "Make Mod";
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

  // ══════════════════════════════════════════
  // Shared helper (top-level)
  // ══════════════════════════════════════════
  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Start
  initAuth();
}();
