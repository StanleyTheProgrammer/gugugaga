!function(){"use strict";let e={apiKey:"AIzaSyDd15smQKX5BWWlQ3PjzZ6cEi18P7zKeWg",authDomain:"aplus-5383f.firebaseapp.com",projectId:"aplus-5383f",storageBucket:"aplus-5383f.firebasestorage.app",messagingSenderId:"654012013474",appId:"1:654012013474:web:3f2e023a2597af46c8b0fb"},t="cat_here";async function a(){let t=await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"),a=await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"),o=await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"),n=t.initializeApp(e);return{auth:a.getAuth(n),db:o.getFirestore(n),authMod:a,dbMod:o}}let o=`
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

        /* Admin & Chat Panel */
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

        /* Inputs (Fixed White-on-White Bug) */
        #af-troll-select, #af-chat-input, #af-search, #af-group-name-input, #af-group-user-search {
            width: 100%; padding: 10px; margin-bottom: 10px;
            background: #2c2c2e !important; color: #fff !important;
            border: 1px solid #3a3a3c; border-radius: 6px;
            box-sizing: border-box; font-family: inherit; font-size: 13px;
        }
        #af-troll-select:focus, #af-chat-input:focus, #af-search:focus, #af-group-name-input:focus, #af-group-user-search:focus { border-color: #0a84ff; outline: none; }
        #af-troll-select option { background: #2c2c2e; color: #fff; }

        /* Chat */
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

        /* Tabs */
        .af-tabs { display: flex; border-bottom: 1px solid #333; background: #232325; }
        .af-tab { padding: 10px 16px; cursor: pointer; font-size: 13px; color: #98989d; border-bottom: 2px solid transparent; }
        .af-tab:hover { color: #fff; }
        .af-tab.active { color: #0a84ff; border-bottom-color: #0a84ff; }
        .af-tab-content { padding: 15px 20px; overflow-y: auto; flex: 1; }

        /* Group UI */
        #af-group-list { display: flex; flex-direction: column; gap: 6px; max-height: 150px; overflow-y: auto; }
        .af-group-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #2c2c2e; border: 1px solid #3a3a3c; border-radius: 6px; cursor: pointer; font-size: 13px; }
        .af-group-item:hover { border-color: #0a84ff; }
        .af-group-item.selected { border-color: #0a84ff; background: #1c2d44; }
        .af-group-item .gname { font-weight: bold; }
        .af-group-item .gmembers { color: #98989d; font-size: 11px; margin-top: 2px; }
        .af-group-item .leave { background: #ff453a; color: #fff; border: none; border-radius: 4px; padding: 3px 8px; font-size: 11px; cursor: pointer; }

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

        /* Main GUI */
        #af-root{position:fixed;bottom:20px;right:20px;z-index:2147483647;width:224px;background:#1c1c1e;border:1px solid #2e2e30;border-radius:10px;font-family:-apple-system,"SF Pro Text","Segoe UI",Roboto,sans-serif;font-size:12px;color:#e5e5e7;box-shadow:0 8px 28px rgba(0,0,0,0.45),0 1px 0 rgba(255,255,255,0.03) inset;user-select:none;-webkit-user-select:none;overflow:hidden}
        #af-root .bar{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:#232325;border-bottom:1px solid #2e2e30;cursor:move;touch-action:none}
        #af-root .bar span{font-size:11.5px;font-weight:600;letter-spacing:0.2px;color:#b8b8bd;pointer-events:none}
        #af-root .bar b{background:none;border:none;color:#6e6e73;font-size:15px;font-weight:400;cursor:pointer;padding:0 2px;line-height:1;transition:color .12s;touch-action:manipulation}
        #af-root .bar b:hover{color:#e5e5e7}
        #af-root .body{padding:12px}
        #af-root .row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        #af-root .label{font-size:12px;color:#98989d;letter-spacing:0.1px}
        #af-root .toggle{position:relative;width:36px;height:20px;background:#333336;border-radius:10px;cursor:pointer;transition:background .15s ease;touch-action:manipulation;flex-shrink:0}
        #af-root .toggle.active{background:#0a84ff}
        #af-root .toggle .knob{position:absolute;top:2px;left:2px;width:16px;height:16px;background:#fff;border-radius:50%;box-shadow:0 1px 2px rgba(0,0,0,0.3);transition:transform .15s ease}
        #af-root .toggle.active .knob{transform:translateX(16px)}
        #af-root .sliderBlock{margin-bottom:10px}
        #af-root .sliderHead{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px}
        #af-root .sliderRow{display:flex;align-items:center;gap:10px}
        #af-root .sliderVal{font-size:11.5px;color:#e5e5e7;font-family:"SF Mono",Consolas,Menlo,monospace;font-feature-settings:"tnum";min-width:44px;text-align:right;letter-spacing:-0.2px}
        #af-root input[type="range"]{-webkit-appearance:none;appearance:none;flex:1;height:3px;background:#333336;border-radius:2px;outline:none;touch-action:manipulation}
        #af-root input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;background:#fff;border-radius:50%;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.4);transition:transform .1s}
        #af-root input[type="range"]::-webkit-slider-thumb:active{transform:scale(1.1)}
        #af-root input[type="range"]::-moz-range-thumb{width:14px;height:14px;background:#fff;border-radius:50%;cursor:pointer;border:none;box-shadow:0 1px 3px rgba(0,0,0,0.4)}
        #af-root button.act{width:100%;padding:8px;background:#333336;color:#e5e5e7;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:500;font-family:inherit;letter-spacing:0.1px;transition:background .12s;touch-action:manipulation;margin-bottom:6px}
        #af-root button.act:hover{background:#3d3d40}
        #af-root button.act:active{background:#2a2a2c}
        #af-root .out{margin-top:10px;padding:9px 10px;background:#161618;border:1px solid #2e2e30;border-radius:6px;font-family:"SF Mono",Consolas,Menlo,monospace;font-size:11px;color:#d1d1d6;word-break:break-all;line-height:1.5;display:none;max-height:150px;overflow-y:auto}
        #af-root .out.show{display:block}
        #af-root .out .lbl{color:#6e6e73;font-size:9.5px;text-transform:uppercase;letter-spacing:0.7px;margin-bottom:5px;font-weight:600}
        #af-root .out .val{color:#30d158}
        #af-root .out .err{color:#ff453a}
        #af-root .ans-row{padding:3px 0;border-bottom:1px solid #232325}
        #af-root .ans-row:last-child{border-bottom:none}
        #af-root .ans-q{color:#6e6e73;margin-right:6px;font-size:10.5px}
        #af-root .frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 2px;line-height:1.05;color:#30d158;font-family:Georgia,"Times New Roman",serif;font-size:12px}
        #af-root .frac .num{padding:0 5px}
        #af-root .frac .den{padding:0 5px;border-top:1px solid #30d158}

        .af-profile-card { background: #1c1c1e; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px; text-align: center; }
        .af-profile-card h3 { margin: 0 0 5px 0; color: #0a84ff; }
        .af-profile-stats { font-size: 13px; color: #ccc; margin-top: 10px; }

        /* Small floating buttons */
        .af-fab { position:fixed; z-index:99999; padding:10px 14px; border:none; border-radius:8px; cursor:move; font-weight:bold; touch-action:none; user-select:none; font-family:-apple-system,sans-serif; font-size:13px; box-shadow:0 4px 12px rgba(0,0,0,0.4); }
        .af-fab.chat { top:10px; left:10px; background:#0a84ff; color:#fff; }
        .af-fab.admin { top:10px; left:130px; background:#ff453a; color:#fff; }
    `;async function n(){let e=document.createElement("style");e.textContent=o,document.head.appendChild(e);let n=await a(),{auth:i,db:s,authMod:l,dbMod:d}=n,c=localStorage.getItem("aplus_saved_user");if(c)try{let p=JSON.parse(c),f=await d.getDoc(d.doc(s,"users",p.uid));if(f.exists()&&f.data().isBanned){if(p.username===t)await d.updateDoc(d.doc(s,"users",p.uid),{isBanned:!1});else throw localStorage.removeItem("aplus_saved_user"),Error("Account Banned.")}await l.signInAnonymously(i),r(p.uid,p.username,s,d,i,l);return}catch(u){console.log("Auto-login failed",u)}let g=document.createElement("div");g.id="af-auth-modal",g.innerHTML=`
            <div id="af-auth-box">
                <h2 id="af-auth-title">Login</h2>
                <div id="af-error"></div>
                <input type="text" id="af-username" placeholder="Username" autocomplete="off">
                <input type="password" id="af-password" placeholder="Password (max 20 chars)" maxlength="20">
                <button id="af-auth-btn">Login</button>
                <button id="af-auth-switch">Need an account? Register</button>
            </div>
        `,document.body.appendChild(g);let m=!0;document.getElementById("af-auth-switch").onclick=()=>{m=!m,document.getElementById("af-auth-title").textContent=m?"Login":"Create Account",document.getElementById("af-auth-btn").textContent=m?"Login":"Register",document.getElementById("af-auth-switch").textContent=m?"Need an account? Register":"Already have an account? Login",document.getElementById("af-error").textContent=""},document.getElementById("af-auth-btn").onclick=async()=>{let e=document.getElementById("af-username").value.trim().toLowerCase(),a=document.getElementById("af-password").value,o=document.getElementById("af-error"),n=document.getElementById("af-auth-btn");if(!e||!a)return o.textContent="Fill all fields.";if(a.length>20)return o.textContent="Password max 20 chars.";n.disabled=!0,o.textContent="Processing...";try{let c=d.doc(s,"usernames",e);if(m){let p=await d.getDoc(c);if(!p.exists())throw Error("Account not found.");let f=p.data();if(f.password!==a)throw Error("Wrong password.");await l.signInAnonymously(i);let u=d.doc(s,"users",f.uid),b=await d.getDoc(u);if(b.exists()&&b.data().isBanned){if(e===t)await d.updateDoc(u,{isBanned:!1});else throw await l.signOut(i),Error("This account is BANNED.")}localStorage.setItem("aplus_saved_user",JSON.stringify({uid:f.uid,username:e})),g.remove(),r(f.uid,e,s,d,i,l)}else{let x,h=((x=localStorage.getItem("aplus_device_id"))||(x=crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2),localStorage.setItem("aplus_device_id",x)),x),$=d.doc(s,"devices",h),y=await d.getDoc($);if(y.exists())throw Error("This device is already registered.");let v=await d.getDoc(c);if(v.exists())throw Error("Username taken.");let _=await l.signInAnonymously(i),w=_.user.uid;await d.setDoc(c,{uid:w,password:a}),await d.setDoc($,{uid:w}),await d.setDoc(d.doc(s,"users",w),{username:e,isBanned:!1,isMod:!1,createdAt:Date.now(),lastSeen:Date.now(),autoStats:0,showStats:0}),localStorage.setItem("aplus_saved_user",JSON.stringify({uid:w,username:e})),g.remove(),r(w,e,s,d,i,l)}}catch(E){o.textContent=E.message}finally{n.disabled=!1}}}function r(e,a,o,n,r,s){console.log(`[auth] Logged in as ${a}`);let l=0,d=0,c=!1;setInterval(async()=>{try{await n.updateDoc(n.doc(o,"users",e),{lastSeen:Date.now()})}catch(t){}},15e3),setInterval(async()=>{try{let i=await n.getDoc(n.doc(o,"users",e));if(i.exists()){let l=i.data();c=l.isMod,l.isBanned&&(a===t?await n.updateDoc(n.doc(o,"users",e),{isBanned:!1}):(alert("You have been BANNED."),localStorage.removeItem("aplus_saved_user"),await s.signOut(r),location.reload()))}}catch(d){}},3e3),n.onSnapshot(n.doc(o,"commands",e),e=>{if(e.exists()){let t=e.data(),a=localStorage.getItem("af_last_troll");a!=t.timestamp&&(localStorage.setItem("af_last_troll",t.timestamp),function e(t){document.body.style.animation="",document.body.style.transform="",document.body.style.filter="";let a=document.getElementById("af-troll-overlay");if(a&&a.remove(),window.__trollInt&&clearInterval(window.__trollInt),"shake"===t||"gugugaga"===t){let o=document.createElement("style");o.textContent="@keyframes af-shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }",document.head.appendChild(o),document.body.style.animation="af-shake 0.5s infinite",setTimeout(()=>document.body.style.animation="",5e3)}if("gugugaga"===t){let n=document.createElement("div");n.id="af-troll-overlay",n.style="position:fixed; inset:0; z-index:2147483645; pointer-events:none; overflow:hidden; background:rgba(0,0,0,0.5);",document.body.appendChild(n),window.__trollInt=setInterval(()=>{let e=document.createElement("div");e.textContent="GUGUGAGA",e.style=`position:absolute; color:red; font-weight:bold; font-family:Comic Sans MS, sans-serif; font-size:${40*Math.random()+20}px; left:${100*Math.random()}vw; top:${100*Math.random()}vh; transform:rotate(${360*Math.random()}deg); opacity:${.5*Math.random()+.5};`,n.appendChild(e),setTimeout(()=>e.remove(),1500)},30),setTimeout(()=>{clearInterval(window.__trollInt),n.remove()},5e3)}if("flip"===t&&(document.body.style.transform="rotate(180deg)",setTimeout(()=>document.body.style.transform="",5e3)),"alert"===t&&alert("You have been trolled!"),"scary_face"===t){let r=document.createElement("div");r.id="af-troll-overlay",r.style="position:fixed; inset:0; z-index:2147483645; pointer-events:none; display:flex; justify-content:center; align-items:center; background:black;",r.innerHTML='<img src="https://raw.githubusercontent.com/StanleyTheProgrammer/gugugaga/main/scary.jpeg" style="width:100vh; object-fit:cover;">',document.body.appendChild(r),setTimeout(()=>r.remove(),3e3)}if("scary_blood"===t){let i=document.createElement("div");i.id="af-troll-overlay",i.style="position:fixed; inset:0; z-index:2147483645; pointer-events:none; background:rgba(255,0,0,0.8); display:flex; justify-content:center; align-items:center; color:white; font-size:10vw; font-family:serif; font-weight:bold; text-shadow: 0 0 20px black;",i.textContent="DON'T LOOK BEHIND YOU",document.body.appendChild(i),setTimeout(()=>i.remove(),3e3)}if("scary_invert"===t&&(document.body.style.filter="invert(1) hue-rotate(180deg) contrast(2)",setTimeout(()=>document.body.style.filter="",3e3)),"scary_static"===t){document.body.style.filter="contrast(200%) grayscale(100%) brightness(50%)";let s=document.createElement("div");s.id="af-troll-overlay",s.style="position:fixed; inset:0; z-index:2147483645; pointer-events:none; background:url('https://i.gifer.com/7E2x.gif') center/cover; opacity:0.8;",document.body.appendChild(s);let l=new Audio("https://www.soundjay.com/misc/sounds/static-1.mp3");l.play().catch(()=>{}),setTimeout(()=>{s.remove(),document.body.style.filter=""},3e3)}if("troll_cursor"===t){let d=document.createElement("style");d.id="af-troll-cursor",d.textContent="* { cursor: url('https://cur.cursors-4u.net/cursors/cur-9/cur817.cur'), auto !important; }",document.head.appendChild(d),setTimeout(()=>d.remove(),5e3)}if("troll_zoom"===t){document.body.style.transition="transform 0.1s";let c=1;window.__trollInt=setInterval(()=>{c+=.1,document.body.style.transform=`scale(${c})`,c>3&&(clearInterval(window.__trollInt),document.body.style.transform="",document.body.style.transition="")},100)}}(t.action))}}),function e(t,a,o,n,r,s){if(document.getElementById("af-root"))return;let l=document.createElement("div");l.id="af-root",l.innerHTML=`
            <div class="bar" id="af-bar">
                <span>Autofill</span>
                <b id="af-x">&times;</b>
            </div>
            <div class="body">
                <div class="row">
                    <span class="label">Auto</span>
                    <div class="toggle" id="af-toggle"><div class="knob"></div></div>
                </div>
                <div class="sliderBlock">
                    <div class="sliderHead">
                        <span class="label">Speed</span>
                        <span class="sliderVal" id="af-speed-val">900ms</span>
                    </div>
                    <div class="sliderRow">
                        <input type="range" id="af-speed" min="200" max="3000" step="50" value="900">
                    </div>
                </div>
                <div class="sliderBlock">
                    <div class="sliderHead">
                        <span class="label">Correct</span>
                        <span class="sliderVal" id="af-val">85%</span>
                    </div>
                    <div class="sliderRow">
                        <input type="range" id="af-slider" min="50" max="100" step="1" value="85">
                    </div>
                </div>
                <button class="act" id="af-show">Show answer</button>
                <button class="act" id="af-profile-btn">Profile Search</button>
                <button class="act" id="af-logout" style="background:#ff453a; color:#fff;">Log Out</button>
                <div class="out" id="af-out"></div>
            </div>
        `,document.body.appendChild(l);let d=document.getElementById("af-bar"),c=document.getElementById("af-toggle"),p=document.getElementById("af-slider"),f=document.getElementById("af-val"),u=document.getElementById("af-speed"),g=document.getElementById("af-speed-val"),m=document.getElementById("af-x"),b=document.getElementById("af-show"),x=document.getElementById("af-profile-btn"),h=document.getElementById("af-logout"),$=document.getElementById("af-out"),y=!1,v=0,_=0,w=!1,E=85,k=900,C=null,I=!1;function B(e,t,a){return t=t||1e3,a=a||50,new Promise(function(o){let n=Date.now();!function r(){let i;try{i=e()}catch(s){i=null}return i?o(i):Date.now()-n>=t?o(null):void setTimeout(r,a)}()})}function L(){try{let e=document.getElementById("app");if(!e||!e.__vue__)return null;return function e(t,a){if(!t||"object"!=typeof t||a>15||t.__ob__)return null;if(t.currentQuestion&&t.currentQuestion.childQuestions||t.currentQuestion&&t.currentQuestion.questionId)return t.currentQuestion;if(t.childQuestions&&Array.isArray(t.childQuestions))return t;if(t.$data)for(let o in t.$data){let n=t.$data[o];if(n&&"object"==typeof n){let r=e(n,a+1);if(r)return r}}if(t.$children)for(let i of t.$children){let s=e(i,a+1);if(s)return s}return null}(e.__vue__,0)}catch(t){return null}}function A(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function z(e){if(/^-?\d+(\.\d+)?$/.test(e)){let t=parseFloat(e);return String(t+(.5>Math.random()?-1:1)*(1+Math.floor(5*Math.random())))}return e}async function S(e,t){let a=document.querySelector(".practice_base_topic_card")||document,o=a.querySelectorAll(".select_component");if(!o.length)return 0;let n=(e.childQuestions||[]).filter(e=>e.questionAnswer),r=0;for(let i=0;i<o.length;i++){let s=o[i],l=n[i];if(!l)continue;let d=String(Array.isArray(l.questionAnswer)?l.questionAnswer[0]:l.questionAnswer).trim().toUpperCase();if(t&&l.options&&l.options.length>1){let c=l.options.map(e=>e.optionNo).filter(e=>e!==d);c.length&&(d=c[Math.floor(Math.random()*c.length)])}let p=null;if(l.options&&Array.isArray(l.options)){let f=l.options.find(e=>e.optionNo===d);f&&(p=String(f.optionContent).trim())}if(!p)continue;let u=s.querySelectorAll(".options_box li");if(0===u.length){let g=s.__vue__;if(g&&g.$data&&"flag"in g.$data)g.$data.flag=!0,g.$forceUpdate&&g.$forceUpdate();else{let m=s.querySelector(".select_box");m&&m.click()}u=await B(function(){let e=s.querySelectorAll(".options_box li");return e.length?e:null},1500,60)}if(!u||!u.length)continue;let b=null;for(let x of u)if(x.textContent.trim()===p){b=x;break}if(!b){let h=p.replace(/\s+/g,"");for(let $ of u)if($.textContent.replace(/\s+/g,"")===h){b=$;break}}b&&(b.click(),r++,await new Promise(e=>setTimeout(e,100)))}return r}async function M(){if(w&&!I){I=!0;try{var e;let a=L();if(!a)return;let i=(e=a)?e.questionId?e.questionId:e.childQuestions?JSON.stringify(e.childQuestions.map(e=>e.questionAnswer)):null:null;if(!i||i===C)return;C=i,document.querySelectorAll('[data-autofilled="1"]').forEach(e=>{e.removeAttribute("data-autofilled"),e.style.outline=""});let s=!(100*Math.random()<E);if(function e(t,a){let o=document.querySelector(".practice_base_topic_card")||document,n=o.querySelectorAll("textarea.ant-input");if(!n.length)return 0;let r=(t.childQuestions||[]).filter(e=>e.questionAnswer),i=0;for(let s=0;s<n.length;s++){let l=n[s],d=r[s];if(!d)break;let c=d.questionAnswer;Array.isArray(c)&&(c=c[0]),"string"!=typeof c&&(c=String(c)),a&&(c=z(c)),l.value!==c&&(l.focus(),l.value=c,l.dispatchEvent(new Event("input",{bubbles:!0})),l.dispatchEvent(new Event("change",{bubbles:!0})),l.blur(),l.style.outline="2px solid "+(a?"#ff453a":"#30d158"),i++)}return i}(a,s),function e(t,a){let o=document.querySelector(".practice_base_topic_card")||document,n=o.querySelectorAll("ul.TEXT, ul.MATH, ul.CHINESE, ul.ENGLISH");if(!n.length)return 0;let r=(t.childQuestions||[]).filter(e=>e.questionAnswer).map(e=>{let t=e.questionAnswer;return Array.isArray(t)&&(t=t.join(";")),{raw:String(t),child:e}}),i=0;for(let s=0;s<n.length;s++){let l=n[s];if(l.classList.contains("options_box")||l.closest(".select_component"))continue;let d=l.querySelectorAll('li[class*="optionNumOneRaw"]');if(!d.length)continue;let c=r[s]||r[r.length-1];if(!c)continue;let p=[],f=[],u=c.raw;u&&(/[;|,]/.test(u)?u.split(/[;|,]/).forEach(e=>{let t=e.trim().toUpperCase();t&&p.push(t)}):/^\s*[A-Z]\s*$/.test(u)?p.push(u.trim().toUpperCase()):/^[A-Z]{2,}$/.test(u.trim())?u.trim().toUpperCase().split("").forEach(e=>p.push(e)):f.push(u)),!p.length&&!f.length&&c.child&&c.child.options&&c.child.options.forEach(e=>{(e.correct||e.isCorrect)&&(e.optionNo?p.push(String(e.optionNo).toUpperCase()):e.optionContent&&f.push(String(e.optionContent).trim()))});let g=["A","B","C","D","E","F","G","H"],m=[];p.forEach(e=>{let t=g.indexOf(e.toUpperCase());t>=0&&m.push(t)});let b=[];if(a){let x=[];for(let h=0;h<d.length;h++)m.includes(h)||x.push(h);let $=Math.max(1,m.length);for(let y=0;y<$&&x.length;y++){let v=Math.floor(Math.random()*x.length);b.push(x[v]),x.splice(v,1)}}if(!a)for(let _ of p){let w=_.toUpperCase(),E=null;for(let k of d){let C=k.querySelector(".label span");if(C&&C.textContent.replace(/\s|&nbsp;/g,"")===w+"."){E=k;break}}if(!E){let I=w.charCodeAt(0)-65;I>=0&&I<d.length&&(E=d[I])}E&&"1"!==E.dataset.autofilled&&(E.click(),E.dataset.autofilled="1",E.style.outline="2px solid #30d158",i++)}for(let B of b){let L=d[B];L&&"1"!==L.dataset.autofilled&&(L.click(),L.dataset.autofilled="1",L.style.outline="2px solid #ff453a",i++)}if(!a)for(let A of f)for(let z of d){let S=z.querySelector(".con span")||z.querySelector(".con");if(S&&(S.textContent.trim()===A||S.textContent.trim().includes(A)||A.includes(S.textContent.trim()))){if("1"===z.dataset.autofilled)break;z.click(),z.dataset.autofilled="1",z.style.outline="2px solid #30d158",i++;break}}}return i}(a,s),await S(a,s),r(),n.updateDoc(n.doc(o,"users",t),{autoStats:n.increment(1)}).catch(()=>{}),await new Promise(e=>setTimeout(e,k)),!w)return;let l=function e(){let t=document.querySelector(".practice_base_topic_card")||document,a=t.querySelectorAll(".ael_btn");for(let o of a)if(o.textContent.includes("下一題")||o.textContent.includes("下一题"))return o;let n=document.querySelectorAll('.ael_btn, button, [role="button"]');for(let r of n)if(r.textContent&&r.textContent.includes("下一題"))return r;return null}();l&&l.click()}finally{I=!1}}}d.addEventListener("pointerdown",function(e){if("af-x"===e.target.id)return;e.preventDefault(),y=!0,v=e.clientX,_=e.clientY;let t=l.getBoundingClientRect();l.style.right="auto",l.style.bottom="auto",l.style.left=t.left+"px",l.style.top=t.top+"px";try{d.setPointerCapture(e.pointerId)}catch(a){}}),d.addEventListener("pointermove",function(e){if(!y)return;e.preventDefault();let t=e.clientX-v,a=e.clientY-_,o=l.getBoundingClientRect(),n=o.left+t,r=o.top+a;n=Math.max(0,Math.min(window.innerWidth-l.offsetWidth,n)),r=Math.max(0,Math.min(window.innerHeight-l.offsetHeight,r)),l.style.left=n+"px",l.style.top=r+"px",v=e.clientX,_=e.clientY}),d.addEventListener("pointerup",function(){y=!1}),d.addEventListener("pointercancel",function(){y=!1}),h.onclick=async()=>{localStorage.removeItem("aplus_saved_user"),location.reload()},x.onclick=()=>{i(t,o,n)},b.addEventListener("click",async()=>{let e=L();if(!e||!e.childQuestions||!e.childQuestions.length){$.innerHTML='<div class="lbl">Result</div><div class="err">No question found.</div>',$.classList.add("show");return}let a=e.childQuestions.filter(e=>e.questionAnswer);if(!a.length){$.innerHTML='<div class="lbl">Result</div><div class="err">No answer found.</div>',$.classList.add("show");return}let r='<div class="lbl">Answer</div>';a.forEach(function(e){r+='<div class="ans-row">',a.length>1&&(r+='<span class="ans-q">Q'+e.questionNo+"</span>"),r+='<span class="val">'+function e(t){Array.isArray(t)&&(t=t.join(" ; ")),t=String(t);let a=/\$\$\s*\\+frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}\s*\$\$/g,o=[],n=0,r,i=!1;for(;null!==(r=a.exec(t));)i=!0,o.push(A(t.slice(n,r.index))),o.push('<span class="frac"><span class="num">'+A(r[1])+'</span><span class="den">'+A(r[2])+"</span></span>"),n=a.lastIndex;return i?(o.push(A(t.slice(n))),o.join("")):A(t)}(e.questionAnswer)+"</span></div>"}),$.innerHTML=r,$.classList.add("show"),s(),n.updateDoc(n.doc(o,"users",t),{showStats:n.increment(1)}).catch(()=>{})}),c.addEventListener("click",function(){w=!w,c.classList.toggle("active",w)}),p.addEventListener("input",function(){E=parseInt(p.value,10),f.textContent=E+"%"}),u.addEventListener("input",function(){k=parseInt(u.value,10),g.textContent=k+"ms"}),m.addEventListener("click",function(){l.remove()}),setInterval(M,800)}(e,a,o,n,()=>{l++},()=>{d++}),function e(a,o,n,r){if(document.getElementById("af-chat-fab"))return;let i=document.createElement("button");i.className="af-fab chat",i.id="af-chat-fab",i.textContent="Chat";let s=!1,l=0,d=0,c=!1;i.addEventListener("pointerdown",e=>{s=!0,c=!1,l=e.clientX-i.getBoundingClientRect().left,d=e.clientY-i.getBoundingClientRect().top;try{i.setPointerCapture(e.pointerId)}catch(t){}}),i.addEventListener("pointermove",e=>{s&&(c=!0,i.style.left=e.clientX-l+"px",i.style.top=e.clientY-d+"px")}),i.addEventListener("pointerup",()=>{s=!1}),i.addEventListener("pointercancel",()=>{s=!1}),document.body.appendChild(i),i.onclick=async()=>{if(c)return;let e=document.getElementById("af-chat-panel");if(e){e.remove();return}let i=document.createElement("div");i.id="af-chat-panel",i.innerHTML=`
                <div id="af-chat-header">
                    <h2>Chat</h2>
                    <button id="af-chat-close">&times;</button>
                </div>
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
                </div>
            `,document.body.appendChild(i),document.getElementById("af-chat-close").onclick=()=>i.remove();let s=!1,l=0,d=0,p=document.getElementById("af-chat-header");p.addEventListener("pointerdown",e=>{if("af-chat-close"!==e.target.id){s=!0,l=e.clientX-i.getBoundingClientRect().left,d=e.clientY-i.getBoundingClientRect().top;try{p.setPointerCapture(e.pointerId)}catch(t){}}}),p.addEventListener("pointermove",e=>{s&&(i.style.transform="none",i.style.left=e.clientX-l+"px",i.style.top=e.clientY-d+"px")}),p.addEventListener("pointerup",()=>{s=!1}),p.addEventListener("pointercancel",()=>{s=!1}),i.querySelectorAll(".af-tab").forEach(e=>{e.onclick=()=>{i.querySelectorAll(".af-tab").forEach(e=>e.classList.remove("active")),e.classList.add("active");let t=e.dataset.tab;document.getElementById("af-tab-global").style.display="global"===t?"":"none",document.getElementById("af-tab-groups").style.display="groups"===t?"":"none"}});let f=document.getElementById("af-chat-box"),u=document.getElementById("af-chat-form"),g=document.getElementById("af-chat-input");r.onSnapshot(r.collection(n,"globalChat"),e=>{let a=[];e.forEach(e=>a.push({id:e.id,...e.data()})),a.sort((e,t)=>(e.timestamp||0)-(t.timestamp||0)),f.innerHTML="",a.forEach(e=>{let a=new Date(e.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),o=e.author===t,n=e.isMod,r=document.createElement("div");r.className="af-chat-msg",r.innerHTML=`<span class="author ${o?"admin":n?"mod":""}">${e.author}</span> <span style="color:#666; font-size:10px;">${a}</span><br><span class="text">${B(e.text)}</span>`,f.appendChild(r)}),f.scrollTop=f.scrollHeight}),u.onsubmit=async e=>{e.preventDefault();let t=g.value.trim();if(!t)return;g.value="";let i=await r.getDoc(r.doc(n,"users",a)),s=!!i.exists()&&!!i.data().isMod;await r.addDoc(r.collection(n,"globalChat"),{author:o,isMod:s,text:t,timestamp:Date.now()})};let m=document.getElementById("af-group-list"),b=document.getElementById("af-group-view"),x=document.getElementById("af-group-view-title"),h=document.getElementById("af-group-members"),$=document.getElementById("af-group-msg-box"),y=document.getElementById("af-group-msg-form"),v=document.getElementById("af-group-msg-input"),_=document.getElementById("af-create-group-btn"),w=document.getElementById("af-add-member-btn"),E=document.getElementById("af-leave-group-btn"),k=null,C=null,I={};function B(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}r.onSnapshot(r.collection(n,"groups"),e=>{let t=[];if(I={},e.forEach(e=>{let a=e.data();I[e.id]=a,a.members&&a.members[o]&&t.push({id:e.id,...a})}),m.innerHTML="",!t.length){m.innerHTML='<div style="color:#98989d; font-size:12px;">No groups yet.</div>';return}t.forEach(e=>{let t=document.createElement("div");t.className="af-group-item"+(e.id===k?" selected":"");let a=Object.keys(e.members||{}).length;t.innerHTML=`<div><div class="gname">${B(e.name)}</div><div class="gmembers">${a} member${1===a?"":"s"}</div></div>`,t.onclick=()=>(function e(t){var a;k=t,b.style.display="block";let i=I[t];i&&(x.textContent=i.name,a=i,h.innerHTML="",Object.keys(a.members||{}).forEach(e=>{let t=document.createElement("div");t.className="af-member-chip",t.innerHTML=`<span>${B(e)}</span>`+(e===o?"":`<span class="rm" data-user="${B(e)}">\xd7</span>`),h.appendChild(t)}),h.querySelectorAll(".rm").forEach(e=>{e.onclick=async()=>{if(!k)return;let t=r.doc(n,"groups",k),a=await r.getDoc(t);if(!a.exists())return;let o={...a.data().members||{}};delete o[e.dataset.user],await r.updateDoc(t,{members:o})}}),C&&C(),C=r.onSnapshot(r.collection(n,"groups",t,"messages"),e=>{let t=[];e.forEach(e=>t.push({id:e.id,...e.data()})),t.sort((e,t)=>(e.timestamp||0)-(t.timestamp||0)),$.innerHTML="",t.forEach(e=>{let t=new Date(e.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),a=document.createElement("div");a.className="af-chat-msg",a.innerHTML=`<span class="author">${B(e.author)}</span> <span style="color:#666; font-size:10px;">${t}</span><br><span class="text">${B(e.text)}</span>`,$.appendChild(a)}),$.scrollTop=$.scrollHeight}),y.onsubmit=async e=>{e.preventDefault();let t=v.value.trim();t&&k&&(v.value="",await r.addDoc(r.collection(n,"groups",k,"messages"),{author:o,text:t,timestamp:Date.now()}))},E.onclick=async()=>{if(!confirm("Leave this group?"))return;let e=r.doc(n,"groups",t),a=await r.getDoc(e);if(!a.exists())return;let i=a.data(),s={...i.members||{}};delete s[o],0===Object.keys(s).length?await r.deleteDoc(e):await r.updateDoc(e,{members:s}),C&&(C(),C=null),k=null,b.style.display="none"},w.onclick=()=>(function e(t){let a=document.createElement("div");a.style="position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:2147483650; display:flex; align-items:center; justify-content:center;",a.innerHTML=`
                    <div style="background:#1c1c1e; border:1px solid #333; border-radius:12px; padding:20px; width:320px; color:#fff; font-family:-apple-system,sans-serif;">
                        <h3 style="margin:0 0 12px 0; color:#0a84ff; font-size:16px;">Add Member</h3>
                        <input type="text" id="af-group-user-search" placeholder="Search username..." autocomplete="off">
                        <div id="af-group-search-results"></div>
                        <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:8px;">
                            <button class="af-btn secondary" id="af-group-cancel">Close</button>
                        </div>
                        <div id="af-group-create-err" style="color:#ff453a; font-size:12px; margin-top:10px; min-height:14px;"></div>
                    </div>
                `,document.body.appendChild(a);let i=document.getElementById("af-group-user-search"),s=document.getElementById("af-group-search-results"),l=document.getElementById("af-group-create-err");document.getElementById("af-group-cancel").onclick=()=>a.remove(),i.addEventListener("input",async()=>{let e=i.value.trim().toLowerCase();if(s.innerHTML="",!e)return;let d=await r.getDoc(r.doc(n,"usernames",e));if(!d.exists()){s.innerHTML='<div style="padding:8px 10px; color:#98989d; font-size:12px;">No user found.</div>';return}let c=r.doc(n,"groups",t),p=await r.getDoc(c);if(!p.exists())return;let f=p.data().members||{};if(f[e]){s.innerHTML='<div style="padding:8px 10px; color:#98989d; font-size:12px;">Already a member.</div>';return}if(e===o)return;let u=document.createElement("div");u.className="af-search-result",u.innerHTML=`<span>${B(e)}</span><span class="add">+ Add</span>`,u.onclick=async()=>{try{let t={...f,[e]:!0};await r.updateDoc(c,{members:t}),a.remove()}catch(o){l.textContent=o.message}},s.appendChild(u)})})(t))})(e.id),m.appendChild(t)})}),_.onclick=()=>{let e=document.createElement("div");e.style="position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:2147483650; display:flex; align-items:center; justify-content:center;",e.innerHTML=`
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
                    </div>
                `,document.body.appendChild(e);let t=document.getElementById("af-group-name-input"),a=document.getElementById("af-group-user-search"),i=document.getElementById("af-group-search-results"),s=document.getElementById("af-group-invite-list"),l=document.getElementById("af-group-create-err"),d=new Set;document.getElementById("af-group-cancel").onclick=()=>e.remove(),a.addEventListener("input",async()=>{let e=a.value.trim().toLowerCase();if(i.innerHTML="",!e)return;let t=await r.getDoc(r.doc(n,"usernames",e));if(!t.exists()){i.innerHTML='<div style="padding:8px 10px; color:#98989d; font-size:12px;">No user found.</div>';return}let l=e;if(l===o)return;let c=document.createElement("div");c.className="af-search-result",c.innerHTML=`<span>${B(l)}</span><span class="add">+ Add</span>`,c.onclick=()=>{d.has(l)||(d.add(l),function e(){s.innerHTML="",d.forEach(t=>{let a=document.createElement("div");a.className="af-member-chip",a.innerHTML=`<span>${B(t)}</span><span class="rm">\xd7</span>`,a.querySelector(".rm").onclick=()=>{d.delete(t),e()},s.appendChild(a)})}()),a.value="",i.innerHTML=""},i.appendChild(c)}),document.getElementById("af-group-create").onclick=async()=>{let a=t.value.trim();if(!a){l.textContent="Enter a group name.";return}if(0===d.size){l.textContent="Add at least one member.";return}let i={[o]:!0};d.forEach(e=>{i[e]=!0});try{await r.addDoc(r.collection(n,"groups"),{name:a,members:i,createdBy:o,createdAt:Date.now()}),e.remove()}catch(s){l.textContent=s.message}}}}}(e,a,o,n),(a===t||c)&&function e(a,o,n){if(document.getElementById("af-admin-fab"))return;let r=document.createElement("button");r.className="af-fab admin",r.id="af-admin-fab",r.textContent="Admin";let i=!1,s=0,l=0,d=!1;r.addEventListener("pointerdown",e=>{i=!0,d=!1,s=e.clientX-r.getBoundingClientRect().left,l=e.clientY-r.getBoundingClientRect().top;try{r.setPointerCapture(e.pointerId)}catch(t){}}),r.addEventListener("pointermove",e=>{i&&(d=!0,r.style.left=e.clientX-s+"px",r.style.top=e.clientY-l+"px")}),r.addEventListener("pointerup",()=>{i=!1}),r.addEventListener("pointercancel",()=>{i=!1}),document.body.appendChild(r),r.onclick=async()=>{if(d)return;let e=document.getElementById("af-admin-panel");if(e){e.remove();return}let r=document.createElement("div");r.id="af-admin-panel",r.innerHTML=`
                <div id="af-admin-header">
                    <h2>Admin & Mod Panel</h2>
                    <button id="af-admin-close">&times;</button>
                </div>
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
                </div>
            `,document.body.appendChild(r),document.getElementById("af-admin-close").onclick=()=>r.remove();let i=!1,s=0,l=0,c=document.getElementById("af-admin-header");c.addEventListener("pointerdown",e=>{if("af-admin-close"!==e.target.id){i=!0,s=e.clientX-r.getBoundingClientRect().left,l=e.clientY-r.getBoundingClientRect().top;try{c.setPointerCapture(e.pointerId)}catch(t){}}}),c.addEventListener("pointermove",e=>{i&&(r.style.transform="none",r.style.left=e.clientX-s+"px",r.style.top=e.clientY-l+"px")}),c.addEventListener("pointerup",()=>{i=!1}),c.addEventListener("pointercancel",()=>{i=!1});let p=document.getElementById("af-admin-list");o.onSnapshot(o.collection(a,"users"),e=>{p.innerHTML="",e.forEach(e=>{let r=e.data(),i=e.id,s=r.username===n,l=r.username===t,d=r.isMod,c=r.lastSeen&&Date.now()-r.lastSeen<45e3,f=document.createElement("div");f.className="af-user-row";let u=document.createElement("div");u.className="name",u.innerHTML=`<div class="af-status-dot ${c?"af-status-online":"af-status-offline"}"></div> <span>${r.username}</span>`;let g=document.createElement("div");g.className="actions";let m=document.createElement("button");m.textContent="Troll",m.className="troll",m.onclick=async()=>{let e=document.getElementById("af-troll-select").value;await o.setDoc(o.doc(a,"commands",i),{action:e,timestamp:Date.now()}),m.textContent="Sent!",setTimeout(()=>m.textContent="Troll",2e3)},g.appendChild(m);let b=document.createElement("button");if(s?(b.textContent="Me",b.className="disabled",b.disabled=!0):s||l||n!==t&&d?(b.textContent=l?"Admin":"Mod",b.className="disabled",b.disabled=!0):(b.textContent=r.isBanned?"Unban":"Ban",b.className=r.isBanned?"unban":"ban",b.onclick=async()=>{await o.updateDoc(o.doc(a,"users",i),{isBanned:!r.isBanned})}),g.appendChild(b),n===t&&!s&&!l){let x=document.createElement("button");x.textContent=d?"Demod":"Make Mod",x.className=d?"demod":"mod",x.onclick=async()=>{await o.updateDoc(o.doc(a,"users",i),{isMod:!d})},g.appendChild(x)}f.appendChild(u),f.appendChild(g),p.appendChild(f)})})}}(o,n,a)}async function i(e,a,o){let n=document.getElementById("af-profile-panel");if(n){n.remove();return}let r=document.createElement("div");r.id="af-profile-panel",r.style="position:fixed; top:20%; left:20%; background:#1c1c1e; border:1px solid #333; border-radius:12px; padding:20px; z-index:2147483649; width:300px; color:#fff; font-family:-apple-system,sans-serif; box-shadow:0 10px 30px rgba(0,0,0,0.5);",r.innerHTML=`
            <button id="af-profile-close" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#98989d; cursor:pointer; font-size:18px;">&times;</button>
            <h2 style="margin-top:0; color:#0a84ff;">Profile Search</h2>
            <input type="text" id="af-search" placeholder="Search username...">
            <div id="af-profile-result"></div>
        `,document.body.appendChild(r),document.getElementById("af-profile-close").onclick=()=>r.remove();let i=document.getElementById("af-search"),s=document.getElementById("af-profile-result");i.addEventListener("input",async()=>{let n=i.value.trim().toLowerCase();if(!n)return s.innerHTML="";let r=await o.getDoc(o.doc(a,"usernames",n));if(!r.exists())return s.innerHTML='<div style="color:#ff453a; margin-top:10px;">User not found.</div>';let l=r.data(),d=await o.getDoc(o.doc(a,"users",l.uid));if(!d.exists())return;let c=d.data(),p=l.uid===e,f=c.isBanned?'<span style="color:#ff453a;">Banned</span>':'<span style="color:#30d158;">Active</span>',u=c.username===t?'<span style="color:#ff453a;">Admin</span>':c.isMod?'<span style="color:#ff9f0a;">Mod</span>':"";s.innerHTML=`
                <div class="af-profile-card">
                    <h3>${c.username} ${p?"(You)":""} ${u}</h3>
                    <div style="font-size:12px; color:#98989d;">Status: ${f}</div>
                    <div class="af-profile-stats">
                        <div>Auto-Answered: <b>${c.autoStats||0}</b></div>
                        <div>Answers Viewed: <b>${c.showStats||0}</b></div>
                    </div>
                </div>
            `})}n()}();
