!function(){"use strict";let e={apiKey:"AIzaSyDd15smQKX5BWWlQ3PjzZ6cEi18P7zKeWg",authDomain:"aplus-5383f.firebaseapp.com",projectId:"aplus-5383f",storageBucket:"aplus-5383f.firebasestorage.app",messagingSenderId:"654012013474",appId:"1:654012013474:web:3f2e023a2597af46c8b0fb"},t="cat_here";async function a(){let t=await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"),a=await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"),r=await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"),o=t.initializeApp(e);return{auth:a.getAuth(o),db:r.getFirestore(o),authMod:a,dbMod:r}}let r=`
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

    #af-auth-box input:focus {
      border-color: var(--accent);
    }

    #af-auth-box input::placeholder {
      color: var(--text-muted);
    }

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

    #af-auth-btn {
      background: var(--accent);
      color: #fff;
    }

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

    /* ---- Panels ---- */
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

    .af-chat-msg {
      font-size: 13.5px;
      line-height: 1.5;
    }

    .af-chat-msg .author {
      font-weight: 600;
      color: var(--accent);
      margin-right: 6px;
    }

    .af-chat-msg .author.admin { color: var(--danger); }
    .af-chat-msg .author.mod { color: var(--warning); }
    .af-chat-msg .text { color: var(--text); }

    #af-chat-form, #af-group-msg-form {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    #af-chat-input, #af-group-msg-input {
      margin-bottom: 0;
      flex-grow: 1;
    }

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

    .af-tab-content {
      padding: 16px 20px;
      overflow-y: auto;
      flex: 1;
    }

    #af-group-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 160px;
      overflow-y: auto;
    }

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

    #af-group-members {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }

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

    .af-member-chip .rm {
      cursor: pointer;
      color: var(--danger);
      font-weight: bold;
      margin-left: 2px;
    }

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

    /* ---- Autofill GUI ---- */
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

    #af-root .bar span {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.1px;
      color: var(--text);
      pointer-events: none;
    }

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

    #af-root .label {
      font-size: 12.5px;
      color: var(--text-dim);
      letter-spacing: 0.1px;
    }

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

    #af-root .sliderHead {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 6px;
    }

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

    /* Custom scrollbars */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
  `;function o(e){document.body.style.animation="",document.body.style.transform="",document.body.style.filter="";let t=document.getElementById("af-troll-overlay");if(t&&t.remove(),window.__trollInt&&clearInterval(window.__trollInt),"shake"===e||"gugugaga"===e){let a=document.createElement("style");a.textContent="@keyframes af-shake{0%{transform:translate(1px,1px) rotate(0deg)}10%{transform:translate(-1px,-2px) rotate(-1deg)}20%{transform:translate(-3px,0) rotate(1deg)}30%{transform:translate(3px,2px) rotate(0deg)}40%{transform:translate(1px,-1px) rotate(1deg)}50%{transform:translate(-1px,2px) rotate(-1deg)}60%{transform:translate(-3px,1px) rotate(0deg)}70%{transform:translate(3px,1px) rotate(-1deg)}80%{transform:translate(-1px,-1px) rotate(1deg)}90%{transform:translate(1px,2px) rotate(0deg)}100%{transform:translate(1px,-2px) rotate(-1deg)}}",document.head.appendChild(a),document.body.style.animation="af-shake 0.5s infinite",setTimeout(()=>document.body.style.animation="",5e3)}if("gugugaga"===e){let r=document.createElement("div");r.id="af-troll-overlay",r.style="position:fixed; inset:0; z-index:2147483645; pointer-events:none; overflow:hidden; background:rgba(0,0,0,0.5);",document.body.appendChild(r),window.__trollInt=setInterval(()=>{let e=document.createElement("div");e.textContent="GUGUGAGA",e.style=`position:absolute; color:red; font-weight:bold; font-family:Comic Sans MS,sans-serif; font-size:${40*Math.random()+20}px; left:${100*Math.random()}vw; top:${100*Math.random()}vh; transform:rotate(${360*Math.random()}deg); opacity:${.5*Math.random()+.5};`,r.appendChild(e),setTimeout(()=>e.remove(),1500)},30),setTimeout(()=>{clearInterval(window.__trollInt),r.remove()},5e3)}if("flip"===e&&(document.body.style.transform="rotate(180deg)",setTimeout(()=>document.body.style.transform="",5e3)),"alert"===e&&alert("You have been trolled!"),"scary_face"===e){let o=document.createElement("div");o.id="af-troll-overlay",o.style="position:fixed; inset:0; z-index:2147483645; pointer-events:none; display:flex; justify-content:center; align-items:center; background:black;",o.innerHTML='<img src="https://raw.githubusercontent.com/StanleyTheProgrammer/gugugaga/main/scary.jpeg" style="width:100vh; object-fit:cover;">',document.body.appendChild(o),setTimeout(()=>o.remove(),3e3)}if("scary_blood"===e){let n=document.createElement("div");n.id="af-troll-overlay",n.style="position:fixed; inset:0; z-index:2147483645; pointer-events:none; background:rgba(255,0,0,0.8); display:flex; justify-content:center; align-items:center; color:white; font-size:10vw; font-family:serif; font-weight:bold; text-shadow:0 0 20px black;",n.textContent="DON'T LOOK BEHIND YOU",document.body.appendChild(n),setTimeout(()=>n.remove(),3e3)}if("scary_invert"===e&&(document.body.style.filter="invert(1) hue-rotate(180deg) contrast(2)",setTimeout(()=>document.body.style.filter="",3e3)),"scary_static"===e){document.body.style.filter="contrast(200%) grayscale(100%) brightness(50%)";let i=document.createElement("div");i.id="af-troll-overlay",i.style="position:fixed; inset:0; z-index:2147483645; pointer-events:none; background:url('https://i.gifer.com/7E2x.gif') center/cover; opacity:0.8;",document.body.appendChild(i),new Audio("https://www.soundjay.com/misc/sounds/static-1.mp3").play().catch(()=>{}),setTimeout(()=>{i.remove(),document.body.style.filter=""},3e3)}if("troll_cursor"===e){let s=document.createElement("style");s.id="af-troll-cursor",s.textContent="* { cursor: url('https://cur.cursors-4u.net/cursors/cur-9/cur817.cur'), auto !important; }",document.head.appendChild(s),setTimeout(()=>s.remove(),5e3)}if("troll_zoom"===e){document.body.style.transition="transform 0.1s";let l=1;window.__trollInt=setInterval(()=>{l+=.1,document.body.style.transform=`scale(${l})`,l>3&&(clearInterval(window.__trollInt),document.body.style.transform="",document.body.style.transition="")},100)}}async function n(){let e=document.createElement("style");e.textContent=r,document.head.appendChild(e);let{auth:o,db:n,authMod:s,dbMod:l}=await a();l.setDoc(l.doc(n,"config","version"),{current:3},{merge:!0}).catch(()=>{});let d=localStorage.getItem("aplus_saved_user");if(d)try{let c=JSON.parse(d);await s.signInAnonymously(o);let p=o.currentUser.uid,u=p||c.uid,f=await l.getDoc(l.doc(n,"users",u));if(f.exists()&&f.data().isBanned&&c.username!==t)throw localStorage.removeItem("aplus_saved_user"),Error("Account Banned.");c.username===t&&f.exists()&&f.data().isBanned&&await l.updateDoc(l.doc(n,"users",u),{isBanned:!1}),i(u,c.username,n,l,o,s);return}catch(g){console.log("Auto-login failed",g)}let m=document.createElement("div");m.id="af-auth-modal",m.innerHTML=`
      <div id="af-auth-box">
        <h2 id="af-auth-title">Welcome back</h2>
        <div class="sub" id="af-auth-sub">Sign in to continue</div>
        <div id="af-error"></div>
        <input type="text" id="af-username" placeholder="Username" autocomplete="off">
        <input type="password" id="af-password" placeholder="Password" maxlength="20">
        <button id="af-auth-btn">Log in</button>
        <button id="af-auth-switch">Need an account? Register</button>
      </div>`,document.body.appendChild(m);let b=!0;document.getElementById("af-auth-switch").onclick=()=>{b=!b,document.getElementById("af-auth-title").textContent=b?"Welcome back":"Create account",document.getElementById("af-auth-sub").textContent=b?"Sign in to continue":"Join the fun",document.getElementById("af-auth-btn").textContent=b?"Log in":"Register",document.getElementById("af-auth-switch").textContent=b?"Need an account? Register":"Already have an account? Log in",document.getElementById("af-error").textContent=""},document.getElementById("af-auth-btn").onclick=async()=>{let e=document.getElementById("af-username").value.trim().toLowerCase(),a=document.getElementById("af-password").value,r=document.getElementById("af-error"),d=document.getElementById("af-auth-btn");if(!e||!a)return r.textContent="Fill all fields.";if(a.length>20)return r.textContent="Password max 20 chars.";d.disabled=!0,r.textContent="Processing...";try{let c=l.doc(n,"usernames",e);if(b){let p=await l.getDoc(c);if(!p.exists())throw Error("Account not found.");let u=p.data();if(u.password!==a)throw Error("Wrong password.");await s.signInAnonymously(o);let f=o.currentUser.uid,g=await l.getDoc(l.doc(n,"users",u.uid));if(g.exists()&&g.data().isBanned&&e!==t)throw await s.signOut(o),Error("This account is BANNED.");f!==u.uid&&await l.updateDoc(c,{uid:f});let h=f||u.uid;localStorage.setItem("aplus_saved_user",JSON.stringify({uid:h,username:e})),m.remove(),i(h,e,n,l,o,s)}else{let v=localStorage.getItem("aplus_device_id");v||(v=crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2),localStorage.setItem("aplus_device_id",v));let x=l.doc(n,"devices",v),y=await l.getDoc(x);if(y.exists())throw Error("This device is already registered.");let $=await l.getDoc(c);if($.exists())throw Error("Username taken.");let _=await s.signInAnonymously(o),w=_.user.uid;await l.setDoc(c,{uid:w,password:a}),await l.setDoc(x,{uid:w}),await l.setDoc(l.doc(n,"users",w),{username:e,isBanned:!1,isMod:!1,createdAt:Date.now(),lastSeen:Date.now(),autoStats:0,showStats:0}),localStorage.setItem("aplus_saved_user",JSON.stringify({uid:w,username:e})),m.remove(),i(w,e,n,l,o,s)}}catch(E){r.textContent=E.message}finally{d.disabled=!1}}}function i(e,a,r,n,i,l){console.log(`[auth] Logged in as ${a}`);let d=i.currentUser?i.currentUser.uid:null;d&&d!==e&&(console.warn("[auth] uid mismatch — saved:",e,"real:",d,"→ resyncing"),e=d,localStorage.setItem("aplus_saved_user",JSON.stringify({uid:d,username:a})),n.updateDoc(n.doc(r,"usernames",a),{uid:d}).then(()=>console.log("[auth] usernames/"+a+" uid resynced to "+d)).catch(e=>console.warn("[auth] usernames uid resync failed:",e.code,e.message))),n.updateDoc(n.doc(r,"users",e),{lastSeen:Date.now()}).catch(()=>{});let c=Math.random().toString(36).slice(2)+Date.now().toString(36);n.updateDoc(n.doc(r,"users",e),{activeSessionId:c}).catch(()=>{});let p=n.onSnapshot(n.doc(r,"users",e),e=>{if(e.exists()){let t=e.data();t.activeSessionId&&t.activeSessionId!==c&&(p(),localStorage.removeItem("aplus_saved_user"),alert("Session expired: You logged in from another device."),l.signOut(i).finally(()=>location.reload()))}});n.onSnapshot(n.doc(r,"config","version"),e=>{e.exists()&&e.data().current>3&&(console.log("[version] Script is outdated. Refreshing..."),location.reload())}),window.__afLcWatch&&clearInterval(window.__afLcWatch),window.__afLcWatch=setInterval(()=>{localStorage.getItem("aplus_saved_user")||(clearInterval(window.__afLcWatch),l.signOut(i).finally(()=>location.reload()))},2e3);let u=!1;setInterval(async()=>{try{await n.updateDoc(n.doc(r,"users",e),{lastSeen:Date.now()})}catch(t){}},15e3),setInterval(async()=>{try{let o=await n.getDoc(n.doc(r,"users",e));if(o.exists()){let s=o.data();u=s.isMod,s.isBanned&&(a===t?await n.updateDoc(n.doc(r,"users",e),{isBanned:!1}):(alert("You have been BANNED."),localStorage.removeItem("aplus_saved_user"),await l.signOut(i),location.reload()))}}catch(d){}},3e3);let f=parseInt(localStorage.getItem("af_last_troll_ts"))||0,g;try{g=new BroadcastChannel("af_troll_sync")}catch(m){}n.getDoc(n.doc(r,"commands",e)).then(e=>{if(!e.exists())return;let t=e.data();t.timestamp&&t.timestamp>f&&(f=t.timestamp,localStorage.setItem("af_last_troll_ts",f),g&&g.postMessage({ts:f}),o(t.action))}).catch(()=>{}),setInterval(async()=>{try{let t=await n.getDoc(n.doc(r,"commands",e));if(t.exists()){let a=t.data();a.timestamp&&a.timestamp>f&&(f=a.timestamp,localStorage.setItem("af_last_troll_ts",f),g&&g.postMessage({ts:f}),o(a.action))}}catch(i){}},2e3),g&&(g.onmessage=e=>{e.data.ts>f&&(f=e.data.ts,localStorage.setItem("af_last_troll_ts",f))}),function e(t,a,r,o,n,i){if(document.getElementById("af-root"))return;let l=document.createElement("div");l.id="af-root",l.innerHTML=`
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
        <button class="act" id="af-logout" style="background:var(--danger); color:#fff;">Log Out</button>
        <div class="out" id="af-out"></div>
      </div>`,document.body.appendChild(l);let d=document.getElementById("af-bar"),c=document.getElementById("af-toggle"),p=document.getElementById("af-slider"),u=document.getElementById("af-val"),f=document.getElementById("af-speed"),g=document.getElementById("af-speed-val"),m=document.getElementById("af-x"),b=document.getElementById("af-show"),h=document.getElementById("af-profile-btn"),v=document.getElementById("af-logout"),x=document.getElementById("af-out"),y=!1,$=0,_=0,w=!1,E=85,k=900,I=null,C=!1;function B(e,t,a){return t=t||1e3,a=a||50,new Promise(r=>{let o=Date.now();!function n(){let i;try{i=e()}catch(s){i=null}return i?r(i):Date.now()-o>=t?r(null):void setTimeout(n,a)}()})}function L(){try{let e=document.getElementById("app");if(!e||!e.__vue__)return null;return function e(t,a){if(!t||"object"!=typeof t||a>15||t.__ob__)return null;if(t.currentQuestion&&t.currentQuestion.childQuestions||t.currentQuestion&&t.currentQuestion.questionId)return t.currentQuestion;if(t.childQuestions&&Array.isArray(t.childQuestions))return t;if(t.$data)for(let r in t.$data){let o=t.$data[r];if(o&&"object"==typeof o){let n=e(o,a+1);if(n)return n}}if(t.$children)for(let i of t.$children){let s=e(i,a+1);if(s)return s}return null}(e.__vue__,0)}catch(t){return null}}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function z(e){if(/^-?\d+(\.\d+)?$/.test(e)){let t=parseFloat(e);return String(t+(.5>Math.random()?-1:1)*(1+Math.floor(5*Math.random())))}return e}async function A(e,t){let a=document.querySelector(".practice_base_topic_card")||document,r=a.querySelectorAll(".select_component");if(!r.length)return 0;let o=(e.childQuestions||[]).filter(e=>e.questionAnswer),n=0;for(let i=0;i<r.length;i++){let s=r[i],l=o[i];if(!l)continue;let d=String(Array.isArray(l.questionAnswer)?l.questionAnswer[0]:l.questionAnswer).trim().toUpperCase();if(t&&l.options&&l.options.length>1){let c=l.options.map(e=>e.optionNo).filter(e=>e!==d);c.length&&(d=c[Math.floor(Math.random()*c.length)])}let p=null;if(l.options&&Array.isArray(l.options)){let u=l.options.find(e=>e.optionNo===d);u&&(p=String(u.optionContent).trim())}if(!p)continue;let f=s.querySelectorAll(".options_box li");if(0===f.length){let g=s.__vue__;if(g&&g.$data&&"flag"in g.$data)g.$data.flag=!0,g.$forceUpdate&&g.$forceUpdate();else{let m=s.querySelector(".select_box");m&&m.click()}f=await B(()=>{let e=s.querySelectorAll(".options_box li");return e.length?e:null},1500,60)}if(!f||!f.length)continue;let b=null;for(let h of f)if(h.textContent.trim()===p){b=h;break}if(!b){let v=p.replace(/\s+/g,"");for(let x of f)if(x.textContent.replace(/\s+/g,"")===v){b=x;break}}b&&(b.click(),n++,await new Promise(e=>setTimeout(e,100)))}return n}async function M(){if(w&&!C){C=!0;try{var e;let a=L();if(!a)return;let i=(e=a)?e.questionId?e.questionId:e.childQuestions?JSON.stringify(e.childQuestions.map(e=>e.questionAnswer)):null:null;if(!i||i===I)return;I=i,document.querySelectorAll('[data-autofilled="1"]').forEach(e=>{e.removeAttribute("data-autofilled"),e.style.outline=""});let s=!(100*Math.random()<E);if(function e(t,a){let r=document.querySelector(".practice_base_topic_card")||document,o=r.querySelectorAll("textarea.ant-input");if(!o.length)return 0;let n=(t.childQuestions||[]).filter(e=>e.questionAnswer),i=0;for(let s=0;s<o.length;s++){let l=o[s],d=n[s];if(!d)break;let c=d.questionAnswer;Array.isArray(c)&&(c=c[0]),"string"!=typeof c&&(c=String(c)),a&&(c=z(c)),l.value!==c&&(l.focus(),l.value=c,l.dispatchEvent(new Event("input",{bubbles:!0})),l.dispatchEvent(new Event("change",{bubbles:!0})),l.blur(),l.style.outline="2px solid "+(a?"var(--danger)":"var(--success)"),i++)}return i}(a,s),function e(t,a){let r=document.querySelector(".practice_base_topic_card")||document,o=r.querySelectorAll("ul.TEXT, ul.MATH, ul.CHINESE, ul.ENGLISH");if(!o.length)return 0;let n=(t.childQuestions||[]).filter(e=>e.questionAnswer).map(e=>{let t=e.questionAnswer;return Array.isArray(t)&&(t=t.join(";")),{raw:String(t),child:e}}),i=0;for(let s=0;s<o.length;s++){let l=o[s];if(l.classList.contains("options_box")||l.closest(".select_component"))continue;let d=l.querySelectorAll('li[class*="optionNumOneRaw"]');if(!d.length)continue;let c=n[s]||n[n.length-1];if(!c)continue;let p=[],u=[],f=c.raw;f&&(/[;|,]/.test(f)?f.split(/[;|,]/).forEach(e=>{let t=e.trim().toUpperCase();t&&p.push(t)}):/^\s*[A-Z]\s*$/.test(f)?p.push(f.trim().toUpperCase()):/^[A-Z]{2,}$/.test(f.trim())?f.trim().toUpperCase().split("").forEach(e=>p.push(e)):u.push(f)),!p.length&&!u.length&&c.child&&c.child.options&&c.child.options.forEach(e=>{(e.correct||e.isCorrect)&&(e.optionNo?p.push(String(e.optionNo).toUpperCase()):e.optionContent&&u.push(String(e.optionContent).trim()))});let g=["A","B","C","D","E","F","G","H"],m=[];p.forEach(e=>{let t=g.indexOf(e.toUpperCase());t>=0&&m.push(t)});let b=[];if(a){let h=[];for(let v=0;v<d.length;v++)m.includes(v)||h.push(v);let x=Math.max(1,m.length);for(let y=0;y<x&&h.length;y++){let $=Math.floor(Math.random()*h.length);b.push(h[$]),h.splice($,1)}}if(!a)for(let _ of p){let w=_.toUpperCase(),E=null;for(let k of d){let I=k.querySelector(".label span");if(I&&I.textContent.replace(/\s|&nbsp;/g,"")===w+"."){E=k;break}}if(!E){let C=w.charCodeAt(0)-65;C>=0&&C<d.length&&(E=d[C])}E&&"1"!==E.dataset.autofilled&&(E.click(),E.dataset.autofilled="1",E.style.outline="2px solid var(--success)",i++)}for(let B of b){let L=d[B];L&&"1"!==L.dataset.autofilled&&(L.click(),L.dataset.autofilled="1",L.style.outline="2px solid var(--danger)",i++)}if(!a)for(let S of u)for(let z of d){let A=z.querySelector(".con span")||z.querySelector(".con");if(A&&(A.textContent.trim()===S||A.textContent.trim().includes(S)||S.includes(A.textContent.trim()))){if("1"===z.dataset.autofilled)break;z.click(),z.dataset.autofilled="1",z.style.outline="2px solid var(--success)",i++;break}}}return i}(a,s),await A(a,s),n&&n(),o.updateDoc(o.doc(r,"users",t),{autoStats:o.increment(1)}).catch(()=>{}),await new Promise(e=>setTimeout(e,k)),!w)return;let l=function e(){let t=document.querySelector(".practice_base_topic_card")||document,a=t.querySelectorAll(".ael_btn");for(let r of a)if(r.textContent.includes("下一題")||r.textContent.includes("下一题"))return r;let o=document.querySelectorAll('.ael_btn, button, [role="button"]');for(let n of o)if(n.textContent&&n.textContent.includes("下一題"))return n;return null}();l&&l.click()}finally{C=!1}}}d.addEventListener("pointerdown",e=>{if("af-x"===e.target.id)return;e.preventDefault(),y=!0,$=e.clientX,_=e.clientY;let t=l.getBoundingClientRect();l.style.right="auto",l.style.bottom="auto",l.style.left=t.left+"px",l.style.top=t.top+"px";try{d.setPointerCapture(e.pointerId)}catch(a){}}),d.addEventListener("pointermove",e=>{if(!y)return;e.preventDefault();let t=e.clientX-$,a=e.clientY-_,r=l.getBoundingClientRect(),o=r.left+t,n=r.top+a;o=Math.max(0,Math.min(window.innerWidth-l.offsetWidth,o)),n=Math.max(0,Math.min(window.innerHeight-l.offsetHeight,n)),l.style.left=o+"px",l.style.top=n+"px",$=e.clientX,_=e.clientY}),d.addEventListener("pointerup",()=>y=!1),d.addEventListener("pointercancel",()=>y=!1),v.onclick=()=>{localStorage.removeItem("aplus_saved_user"),location.reload()},h.onclick=()=>s(t,r,o),b.addEventListener("click",async()=>{let e=L();if(!e||!e.childQuestions||!e.childQuestions.length){x.innerHTML='<div class="lbl">Result</div><div class="err">No question found.</div>',x.classList.add("show");return}let a=e.childQuestions.filter(e=>e.questionAnswer);if(!a.length){x.innerHTML='<div class="lbl">Result</div><div class="err">No answer found.</div>',x.classList.add("show");return}let n='<div class="lbl">Answer</div>';a.forEach(e=>{n+='<div class="ans-row">',a.length>1&&(n+='<span class="ans-q">Q'+e.questionNo+"</span>"),n+='<span class="val">'+function e(t){Array.isArray(t)&&(t=t.join(" ; ")),t=String(t);let a=/\$\$\s*\\+frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}\s*\$\$/g,r=[],o=0,n,i=!1;for(;null!==(n=a.exec(t));)i=!0,r.push(S(t.slice(o,n.index))),r.push('<span class="frac"><span class="num">'+S(n[1])+'</span><span class="den">'+S(n[2])+"</span></span>"),o=a.lastIndex;return i?(r.push(S(t.slice(o))),r.join("")):S(t)}(e.questionAnswer)+"</span></div>"}),x.innerHTML=n,x.classList.add("show"),i&&i(),o.updateDoc(o.doc(r,"users",t),{showStats:o.increment(1)}).catch(()=>{})}),c.addEventListener("click",()=>{w=!w,c.classList.toggle("active",w)}),p.addEventListener("input",()=>{E=parseInt(p.value,10),u.textContent=E+"%"}),f.addEventListener("input",()=>{k=parseInt(f.value,10),g.textContent=k+"ms"}),m.addEventListener("click",()=>l.remove()),setInterval(M,800)}(e,a,r,n,()=>{},()=>{}),function e(a,r,o,n){if(document.getElementById("af-chat-fab"))return;let i=document.createElement("button");i.className="af-fab chat",i.id="af-chat-fab",i.textContent="Chat";let s=!1,l=0,d=0,c=!1;i.addEventListener("pointerdown",e=>{s=!0,c=!1,l=e.clientX-i.getBoundingClientRect().left,d=e.clientY-i.getBoundingClientRect().top;try{i.setPointerCapture(e.pointerId)}catch(t){}}),i.addEventListener("pointermove",e=>{s&&(c=!0,i.style.left=e.clientX-l+"px",i.style.top=e.clientY-d+"px")}),i.addEventListener("pointerup",()=>s=!1),i.addEventListener("pointercancel",()=>s=!1),document.body.appendChild(i),i.onclick=async()=>{if(c)return;let e=document.getElementById("af-chat-panel");if(e){e.remove();return}let i=document.createElement("div");i.id="af-chat-panel",i.innerHTML=`
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
          <div class="af-section-title" style="display:flex; justify-content:space-between; align-items:center;">Your Groups
            <button class="af-btn" id="af-create-group-btn" style="padding:5px 12px; font-size:11.5px;">+ New Group</button>
          </div>
          <div id="af-group-list"><div style="color:var(--text-dim); font-size:12px;">No groups yet.</div></div>
          <div id="af-group-view" style="display:none; margin-top:15px;">
            <div class="af-section-title" id="af-group-view-title">Group</div>
            <div id="af-group-members"></div>
            <div id="af-group-msg-box"></div>
            <form id="af-group-msg-form">
              <input type="text" id="af-group-msg-input" placeholder="Message the group..." autocomplete="off" maxlength="500">
              <button id="af-group-msg-send" type="submit">Send</button>
            </form>
            <div style="margin-top:10px; display:flex; gap:6px;">
              <button class="af-btn secondary" id="af-add-member-btn" style="font-size:11.5px;">+ Add Member</button>
              <button class="af-btn danger" id="af-leave-group-btn" style="font-size:11.5px;">Leave Group</button>
            </div>
          </div>
        </div>`,document.body.appendChild(i),document.getElementById("af-chat-close").onclick=()=>i.remove();let s=!1,l=0,d=0,p=document.getElementById("af-chat-header");p.addEventListener("pointerdown",e=>{if("af-chat-close"!==e.target.id){s=!0,l=e.clientX-i.getBoundingClientRect().left,d=e.clientY-i.getBoundingClientRect().top;try{p.setPointerCapture(e.pointerId)}catch(t){}}}),p.addEventListener("pointermove",e=>{s&&(i.style.transform="none",i.style.left=e.clientX-l+"px",i.style.top=e.clientY-d+"px")}),p.addEventListener("pointerup",()=>s=!1),p.addEventListener("pointercancel",()=>s=!1),i.querySelectorAll(".af-tab").forEach(e=>{e.onclick=()=>{i.querySelectorAll(".af-tab").forEach(e=>e.classList.remove("active")),e.classList.add("active");let t=e.dataset.tab;document.getElementById("af-tab-global").style.display="global"===t?"":"none",document.getElementById("af-tab-groups").style.display="groups"===t?"":"none"}});let u=document.getElementById("af-chat-box"),f=document.getElementById("af-chat-form"),g=document.getElementById("af-chat-input"),m=n.query(n.collection(o,"globalChat"),n.orderBy("timestamp"),n.limit(100));n.onSnapshot(m,e=>{u.innerHTML="",e.forEach(e=>{let a=e.data();if(!a.timestamp)return;let r=new Date(a.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),o=a.author===t,n=a.isMod,i=document.createElement("div");i.className="af-chat-msg",i.innerHTML=`<span class="author ${o?"admin":n?"mod":""}">${S(a.author)}</span> <span style="color:var(--text-muted); font-size:10px;">${r}</span><br><span class="text">${S(a.text)}</span>`,u.appendChild(i)}),u.scrollTop=u.scrollHeight});let b=!1;n.onSnapshot(n.doc(o,"users",a),e=>{e.exists()&&(b=!!e.data().isMod)}),f.onsubmit=async e=>{e.preventDefault();let t=g.value.trim();if(!t)return;g.value="";let a=document.createElement("div");a.className="af-chat-msg",a.style.opacity="0.6",a.innerHTML=`<span class="author">${S(r)}</span> <span style="color:var(--text-muted); font-size:10px;">sending…</span><br><span class="text">${S(t)}</span>`,u.appendChild(a),u.scrollTop=u.scrollHeight;try{await n.addDoc(n.collection(o,"globalChat"),{author:r,isMod:b,text:t,timestamp:Date.now()}),a.style.opacity="0",setTimeout(()=>a.remove(),200)}catch(i){a.style.opacity="1",a.style.color="var(--danger)",a.querySelector("span[style]").textContent="failed"}};let h=document.getElementById("af-group-list"),v=document.getElementById("af-group-view"),x=document.getElementById("af-group-view-title"),y=document.getElementById("af-group-members"),$=document.getElementById("af-group-msg-box"),_=document.getElementById("af-group-msg-form"),w=document.getElementById("af-group-msg-input"),E=document.getElementById("af-create-group-btn"),k=document.getElementById("af-add-member-btn"),I=document.getElementById("af-leave-group-btn"),C=null,B=null,L={};function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}n.onSnapshot(n.collection(o,"groups"),e=>{let t=[];if(L={},e.forEach(e=>{let a=e.data();L[e.id]=a,a.members&&a.members[r]&&t.push({id:e.id,...a})}),h.innerHTML="",!t.length){h.innerHTML='<div style="color:var(--text-dim); font-size:12px;">No groups yet.</div>';return}t.forEach(e=>{let t=document.createElement("div");t.className="af-group-item"+(e.id===C?" selected":"");let a=Object.keys(e.members||{}).length;t.innerHTML=`<div><div class="gname">${S(e.name)}</div><div class="gmembers">${a} member${1===a?"":"s"}</div></div>`,t.onclick=()=>(function e(t){var a;C=t,v.style.display="block";let i=L[t];if(!i)return;x.textContent=i.name,a=i,y.innerHTML="",Object.keys(a.members||{}).forEach(e=>{let t=document.createElement("div");t.className="af-member-chip",t.innerHTML=`<span>${S(e)}</span>`+(e===r?"":`<span class="rm" data-user="${S(e)}">\xd7</span>`),y.appendChild(t)}),y.querySelectorAll(".rm").forEach(e=>{e.onclick=async()=>{if(!C)return;let t=n.doc(o,"groups",C),a=await n.getDoc(t);if(!a.exists())return;let r={...a.data().members||{}};delete r[e.dataset.user],await n.updateDoc(t,{members:r})}}),B&&B();let s=n.query(n.collection(o,"groups",t,"messages"),n.orderBy("timestamp"),n.limit(200));B=n.onSnapshot(s,e=>{$.innerHTML="",e.forEach(e=>{let t=e.data();if(!t.timestamp)return;let a=new Date(t.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),r=document.createElement("div");r.className="af-chat-msg",r.innerHTML=`<span class="author">${S(t.author)}</span> <span style="color:var(--text-muted); font-size:10px;">${a}</span><br><span class="text">${S(t.text)}</span>`,$.appendChild(r)}),$.scrollTop=$.scrollHeight}),_.onsubmit=async e=>{e.preventDefault();let t=w.value.trim();t&&C&&(w.value="",await n.addDoc(n.collection(o,"groups",C,"messages"),{author:r,text:t,timestamp:Date.now()}))},I.onclick=async()=>{if(!confirm("Leave this group?"))return;let e=n.doc(o,"groups",t),a=await n.getDoc(e);if(!a.exists())return;let i={...a.data().members||{}};delete i[r],0===Object.keys(i).length?await n.deleteDoc(e):await n.updateDoc(e,{members:i}),B&&(B(),B=null),C=null,v.style.display="none"},k.onclick=()=>(function e(t){let a=document.createElement("div");a.style="position:fixed; inset:0; background:rgba(8,8,10,0.85); backdrop-filter:blur(6px); z-index:2147483650; display:flex; align-items:center; justify-content:center;",a.innerHTML=`
          <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; width:340px; color:var(--text); font-family:'Inter',-apple-system,sans-serif; box-shadow:var(--shadow);">
            <h3 style="margin:0 0 16px 0; color:var(--accent); font-size:16px; font-weight:600;">Add Member</h3>
            <input type="text" id="af-group-user-search" placeholder="Search username..." autocomplete="off">
            <div id="af-group-search-results"></div>
            <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:8px;">
              <button class="af-btn secondary" id="af-group-cancel">Close</button>
            </div>
            <div id="af-group-create-err" style="color:var(--danger); font-size:12px; margin-top:10px; min-height:14px;"></div>
          </div>`,document.body.appendChild(a);let i=document.getElementById("af-group-user-search"),s=document.getElementById("af-group-search-results"),l=document.getElementById("af-group-create-err");document.getElementById("af-group-cancel").onclick=()=>a.remove(),i.addEventListener("input",async()=>{let e=i.value.trim().toLowerCase();if(s.innerHTML="",!e)return;let d=await n.getDoc(n.doc(o,"usernames",e));if(!d.exists()){s.innerHTML='<div style="padding:10px 12px; color:var(--text-dim); font-size:12px;">No user found.</div>';return}let c=n.doc(o,"groups",t),p=await n.getDoc(c);if(!p.exists())return;let u=p.data().members||{};if(u[e]){s.innerHTML='<div style="padding:10px 12px; color:var(--text-dim); font-size:12px;">Already a member.</div>';return}if(e===r)return;let f=document.createElement("div");f.className="af-search-result",f.innerHTML=`<span>${S(e)}</span><span class="add">+ Add</span>`,f.onclick=async()=>{try{let t={...u,[e]:!0};await n.updateDoc(c,{members:t}),a.remove()}catch(r){l.textContent=r.message}},s.appendChild(f)})})(t)})(e.id),h.appendChild(t)})}),E.onclick=()=>{let e=document.createElement("div");e.style="position:fixed; inset:0; background:rgba(8,8,10,0.85); backdrop-filter:blur(6px); z-index:2147483650; display:flex; align-items:center; justify-content:center;",e.innerHTML=`
          <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; width:360px; color:var(--text); font-family:'Inter',-apple-system,sans-serif; box-shadow:var(--shadow);">
            <h3 style="margin:0 0 16px 0; color:var(--accent); font-size:16px; font-weight:600;">Create Group</h3>
            <input type="text" id="af-group-name-input" placeholder="Group name" maxlength="40" autocomplete="off">
            <input type="text" id="af-group-user-search" placeholder="Search users to add..." autocomplete="off">
            <div id="af-group-search-results"></div>
            <div id="af-group-invite-list" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px; min-height:0;"></div>
            <div style="display:flex; gap:8px; justify-content:flex-end;">
              <button class="af-btn secondary" id="af-group-cancel">Cancel</button>
              <button class="af-btn" id="af-group-create">Create</button>
            </div>
            <div id="af-group-create-err" style="color:var(--danger); font-size:12px; margin-top:10px; min-height:14px;"></div>
          </div>`,document.body.appendChild(e);let t=document.getElementById("af-group-name-input"),a=document.getElementById("af-group-user-search"),i=document.getElementById("af-group-search-results"),s=document.getElementById("af-group-invite-list"),l=document.getElementById("af-group-create-err"),d=new Set;document.getElementById("af-group-cancel").onclick=()=>e.remove(),a.addEventListener("input",async()=>{let e=a.value.trim().toLowerCase();if(i.innerHTML="",!e)return;let t=await n.getDoc(n.doc(o,"usernames",e));if(!t.exists()){i.innerHTML='<div style="padding:10px 12px; color:var(--text-dim); font-size:12px;">No user found.</div>';return}if(e===r)return;let l=document.createElement("div");l.className="af-search-result",l.innerHTML=`<span>${S(e)}</span><span class="add">+ Add</span>`,l.onclick=()=>{d.has(e)||(d.add(e),function e(){s.innerHTML="",d.forEach(t=>{let a=document.createElement("div");a.className="af-member-chip",a.innerHTML=`<span>${S(t)}</span><span class="rm">\xd7</span>`,a.querySelector(".rm").onclick=()=>{d.delete(t),e()},s.appendChild(a)})}()),a.value="",i.innerHTML=""},i.appendChild(l)}),document.getElementById("af-group-create").onclick=async()=>{let a=t.value.trim();if(!a){l.textContent="Enter a group name.";return}if(0===d.size){l.textContent="Add at least one member.";return}let i={[r]:!0};d.forEach(e=>{i[e]=!0});try{await n.addDoc(n.collection(o,"groups"),{name:a,members:i,createdBy:r,createdAt:Date.now()}),e.remove()}catch(s){l.textContent=s.message}}}}}(e,a,r,n),(a===t||u)&&function e(a,r,o){if(document.getElementById("af-admin-fab"))return;let n=document.createElement("button");n.className="af-fab admin",n.id="af-admin-fab",n.textContent="Admin";let i=!1,s=0,l=0,d=!1;n.addEventListener("pointerdown",e=>{i=!0,d=!1,s=e.clientX-n.getBoundingClientRect().left,l=e.clientY-n.getBoundingClientRect().top;try{n.setPointerCapture(e.pointerId)}catch(t){}}),n.addEventListener("pointermove",e=>{i&&(d=!0,n.style.left=e.clientX-s+"px",n.style.top=e.clientY-l+"px")}),n.addEventListener("pointerup",()=>i=!1),n.addEventListener("pointercancel",()=>i=!1),document.body.appendChild(n),n.onclick=async()=>{if(d)return;let e=document.getElementById("af-admin-panel");if(e){e.remove();return}let n=document.createElement("div");n.id="af-admin-panel",n.innerHTML=`
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
        </div>`,document.body.appendChild(n),document.getElementById("af-admin-close").onclick=()=>n.remove();let i=!1,s=0,l=0,c=document.getElementById("af-admin-header");c.addEventListener("pointerdown",e=>{if("af-admin-close"!==e.target.id){i=!0,s=e.clientX-n.getBoundingClientRect().left,l=e.clientY-n.getBoundingClientRect().top;try{c.setPointerCapture(e.pointerId)}catch(t){}}}),c.addEventListener("pointermove",e=>{i&&(n.style.transform="none",n.style.left=e.clientX-s+"px",n.style.top=e.clientY-l+"px")}),c.addEventListener("pointerup",()=>i=!1),c.addEventListener("pointercancel",()=>i=!1);let p=document.getElementById("af-admin-list");r.onSnapshot(r.collection(a,"users"),e=>{p.innerHTML="";let n=JSON.parse(localStorage.getItem("aplus_saved_user")).uid;e.forEach(e=>{var i;let s=e.data(),l=e.id,d=s.username===o,c=s.username===t,u=s.isMod,f=d||s.lastSeen&&Date.now()-s.lastSeen<45e3,g=document.createElement("div");g.className="af-user-row";let m=document.createElement("div");m.className="name",m.innerHTML=`<div class="af-status-dot ${f?"af-status-online":"af-status-offline"}"></div> <span>${i=s.username||"?",String(i).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")} <span style="font-size:10px; color:var(--text-muted);">(${l.slice(0,5)})</span></span>`;let b=document.createElement("div");b.className="actions";let h=document.createElement("button");h.textContent="Troll",h.className="troll",h.onclick=async()=>{let e=document.getElementById("af-troll-select").value,t=s.username===o?n:l;await r.setDoc(r.doc(a,"commands",t),{action:e,timestamp:Date.now()}),h.textContent="Sent!",setTimeout(()=>h.textContent="Troll",2e3)},b.appendChild(h);let v=document.createElement("button");if(d?(v.textContent="Me",v.className="disabled",v.disabled=!0):d||c||o!==t&&u?(v.textContent=c?"Admin":"Mod",v.className="disabled",v.disabled=!0):(v.textContent=s.isBanned?"Unban":"Ban",v.className=s.isBanned?"unban":"ban",v.onclick=async()=>{await r.updateDoc(r.doc(a,"users",l),{isBanned:!s.isBanned})}),b.appendChild(v),o===t&&!d&&!c){let x=document.createElement("button");x.textContent=u?"Demod":"Make Mod",x.className=u?"demod":"mod",x.onclick=async()=>{await r.updateDoc(r.doc(a,"users",l),{isMod:!u})},b.appendChild(x)}g.appendChild(m),g.appendChild(b),p.appendChild(g)})})}}(r,n,a)}async function s(e,a,r){let o=document.getElementById("af-profile-panel");if(o){o.remove();return}let n=document.createElement("div");n.id="af-profile-panel",n.style="position:fixed; top:20%; left:20%; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:22px; z-index:2147483649; width:320px; color:var(--text); font-family:'Inter',-apple-system,sans-serif; box-shadow:var(--shadow);",n.innerHTML=`
      <button id="af-profile-close" style="position:absolute; top:12px; right:12px; background:none; border:none; color:var(--text-dim); cursor:pointer; font-size:18px;">&times;</button>
      <h2 style="margin-top:0; color:var(--accent); font-size:16px; font-weight:600;">Profile Search</h2>
      <input type="text" id="af-search" placeholder="Search username..." style="width:100%; padding:10px 12px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text); font-size:13px; outline:none; box-sizing:border-box;">
      <div id="af-profile-result"></div>`,document.body.appendChild(n),document.getElementById("af-profile-close").onclick=()=>n.remove();let i=document.getElementById("af-search"),s=document.getElementById("af-profile-result");i.addEventListener("input",async()=>{let o=i.value.trim().toLowerCase();if(!o)return s.innerHTML="";let n=await r.getDoc(r.doc(a,"usernames",o));if(!n.exists()){s.innerHTML='<div style="color:var(--danger); margin-top:12px; font-size:13px;">User not found.</div>';return}let l=n.data(),d=await r.getDoc(r.doc(a,"users",l.uid));if(!d.exists())return;let c=d.data(),p=l.uid===e,u=c.isBanned?'<span style="color:var(--danger);">Banned</span>':'<span style="color:var(--success);">Active</span>',f=c.username===t?'<span style="color:var(--danger);">Admin</span>':c.isMod?'<span style="color:var(--warning);">Mod</span>':"";s.innerHTML=`
        <div class="af-profile-card">
          <h3>${c.username} ${p?"(You)":""} ${f}</h3>
          <div style="font-size:12px; color:var(--text-dim);">Status: ${u}</div>
          <div class="af-profile-stats">
            <div>Auto-Answered: <b>${c.autoStats||0}</b></div>
            <div>Answers Viewed: <b>${c.showStats||0}</b></div>
          </div>
        </div>`})}n()}();
