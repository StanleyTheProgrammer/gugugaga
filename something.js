!function(){"use strict";let e={apiKey:"AIzaSyDd15smQKX5BWWlQ3PjzZ6cEi18P7zKeWg",authDomain:"aplus-5383f.firebaseapp.com",projectId:"aplus-5383f",storageBucket:"aplus-5383f.firebasestorage.app",messagingSenderId:"654012013474",appId:"1:654012013474:web:3f2e023a2597af46c8b0fb"},t="cat_here";async function o(){let t=await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"),o=await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"),n=await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"),a=t.initializeApp(e);return{auth:o.getAuth(a),db:n.getFirestore(a),authMod:o,dbMod:n}}let n=`
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
        #af-admin-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #1c1c1e; border: 1px solid #333; border-radius: 12px; padding: 0; z-index: 2147483649; width: 500px; max-height: 85vh; color: #fff; font-family: -apple-system, sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; }
        #af-admin-header { padding: 15px 20px; background: #232325; border-bottom: 1px solid #333; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none; touch-action: none; }
        #af-admin-header h2 { margin: 0; color: #ff453a; font-size: 18px; pointer-events: none; }
        #af-admin-close { background: none; border: none; color: #98989d; cursor: pointer; font-size: 20px; line-height: 1; padding: 0; }
        #af-admin-close:hover { color: #fff; }
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
        #af-troll-select, #af-chat-input, #af-search, #af-group-add { 
            width: 100%; padding: 10px; margin-bottom: 10px; 
            background: #2c2c2e !important; color: #fff !important; 
            border: 1px solid #3a3a3c; border-radius: 6px; 
            box-sizing: border-box; font-family: inherit; font-size: 13px;
        }
        #af-troll-select:focus, #af-chat-input:focus, #af-search:focus, #af-group-add:focus { border-color: #0a84ff; outline: none; }
        
        /* Chat */
        #af-chat-box { background: #111; border: 1px solid #333; border-radius: 8px; height: 200px; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 6px; }
        .af-chat-msg { font-size: 13px; line-height: 1.4; }
        .af-chat-msg .author { font-weight: bold; color: #0a84ff; margin-right: 6px; }
        .af-chat-msg .author.admin { color: #ff453a; }
        .af-chat-msg .author.mod { color: #ff9f0a; }
        .af-chat-msg .text { color: #e5e5e7; }
        #af-chat-form { display: flex; gap: 8px; margin-top: 10px; }
        #af-chat-input { margin-bottom: 0; flex-grow: 1; }
        #af-chat-send { padding: 0 15px; background: #0a84ff; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }

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
    `;async function a(){let e=document.createElement("style");e.textContent=n,document.head.appendChild(e);let a=await o(),{auth:r,db:s,authMod:l,dbMod:d}=a,c=localStorage.getItem("aplus_saved_user");if(c)try{let f=JSON.parse(c),p=await d.getDoc(d.doc(s,"users",f.uid));if(p.exists()&&p.data().isBanned){if(f.username===t)await d.updateDoc(d.doc(s,"users",f.uid),{isBanned:!1});else throw localStorage.removeItem("aplus_saved_user"),Error("Account Banned.")}await l.signInAnonymously(r),i(f.uid,f.username,s,d,r,l);return}catch(u){console.log("Auto-login failed",u)}let m=document.createElement("div");m.id="af-auth-modal",m.innerHTML=`
            <div id="af-auth-box">
                <h2 id="af-auth-title">Login</h2>
                <div id="af-error"></div>
                <input type="text" id="af-username" placeholder="Username" autocomplete="off">
                <input type="password" id="af-password" placeholder="Password (max 20 chars)" maxlength="20">
                <button id="af-auth-btn">Login</button>
                <button id="af-auth-switch">Need an account? Register</button>
            </div>
        `,document.body.appendChild(m);let g=!0;document.getElementById("af-auth-switch").onclick=()=>{g=!g,document.getElementById("af-auth-title").textContent=g?"Login":"Create Account",document.getElementById("af-auth-btn").textContent=g?"Login":"Register",document.getElementById("af-auth-switch").textContent=g?"Need an account? Register":"Already have an account? Login",document.getElementById("af-error").textContent=""},document.getElementById("af-auth-btn").onclick=async()=>{let e=document.getElementById("af-username").value.trim().toLowerCase(),o=document.getElementById("af-password").value,n=document.getElementById("af-error"),a=document.getElementById("af-auth-btn");if(!e||!o)return n.textContent="Fill all fields.";if(o.length>20)return n.textContent="Password max 20 chars.";a.disabled=!0,n.textContent="Processing...";try{let c=d.doc(s,"usernames",e);if(g){let f=await d.getDoc(c);if(!f.exists())throw Error("Account not found.");let p=f.data();if(p.password!==o)throw Error("Wrong password.");await l.signInAnonymously(r);let u=d.doc(s,"users",p.uid),$=await d.getDoc(u);if($.exists()&&$.data().isBanned){if(e===t)await d.updateDoc(u,{isBanned:!1});else throw await l.signOut(r),Error("This account is BANNED.")}localStorage.setItem("aplus_saved_user",JSON.stringify({uid:p.uid,username:e})),m.remove(),i(p.uid,e,s,d,r,l)}else{let x,h=((x=localStorage.getItem("aplus_device_id"))||(x=crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2),localStorage.setItem("aplus_device_id",x)),x),b=d.doc(s,"devices",h),y=await d.getDoc(b);if(y.exists())throw Error("This device is already registered.");let _=await d.getDoc(c);if(_.exists())throw Error("Username taken.");let v=await l.signInAnonymously(r),w=v.user.uid;await d.setDoc(c,{uid:w,password:o}),await d.setDoc(b,{uid:w}),await d.setDoc(d.doc(s,"users",w),{username:e,isBanned:!1,isMod:!1,createdAt:Date.now(),lastSeen:Date.now(),autoStats:0,showStats:0}),localStorage.setItem("aplus_saved_user",JSON.stringify({uid:w,username:e})),m.remove(),i(w,e,s,d,r,l)}}catch(k){n.textContent=k.message}finally{a.disabled=!1}}}function i(e,o,n,a,i,s){console.log(`[auth] Logged in as ${o}`);let l=0,d=0,c=!1;setInterval(async()=>{try{await a.updateDoc(a.doc(n,"users",e),{lastSeen:Date.now()})}catch(t){}},15e3),setInterval(async()=>{try{let r=await a.getDoc(a.doc(n,"users",e));if(r.exists()){let l=r.data();c=l.isMod,l.isBanned&&(o===t?await a.updateDoc(a.doc(n,"users",e),{isBanned:!1}):(alert("You have been BANNED."),localStorage.removeItem("aplus_saved_user"),await s.signOut(i),location.reload()))}}catch(d){}},3e3),a.onSnapshot(a.doc(n,"commands",e),e=>{if(e.exists()){let t=e.data(),o=localStorage.getItem("af_last_troll");o!=t.timestamp&&(localStorage.setItem("af_last_troll",t.timestamp),function e(t){document.body.style.animation="",document.body.style.transform="",document.body.style.filter="";let o=document.getElementById("af-troll-overlay");if(o&&o.remove(),window.__trollInt&&clearInterval(window.__trollInt),"shake"===t||"gugugaga"===t){let n=document.createElement("style");n.textContent="@keyframes af-shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }",document.head.appendChild(n),document.body.style.animation="af-shake 0.5s infinite",setTimeout(()=>document.body.style.animation="",5e3)}if("gugugaga"===t){let a=document.createElement("div");a.id="af-troll-overlay",a.style="position:fixed; inset:0; z-index:2147483645; pointer-events:none; overflow:hidden; background:rgba(0,0,0,0.5);",document.body.appendChild(a),window.__trollInt=setInterval(()=>{let e=document.createElement("div");e.textContent="GUGUGAGA",e.style=`position:absolute; color:red; font-weight:bold; font-family:Comic Sans MS, sans-serif; font-size:${40*Math.random()+20}px; left:${100*Math.random()}vw; top:${100*Math.random()}vh; transform:rotate(${360*Math.random()}deg); opacity:${.5*Math.random()+.5};`,a.appendChild(e),setTimeout(()=>e.remove(),1500)},30),setTimeout(()=>{clearInterval(window.__trollInt),a.remove()},5e3)}if("flip"===t&&(document.body.style.transform="rotate(180deg)",setTimeout(()=>document.body.style.transform="",5e3)),"alert"===t&&alert("You have been trolled!"),"scary_face"===t){let i=document.createElement("div");i.id="af-troll-overlay",i.style="position:fixed; inset:0; z-index:2147483645; pointer-events:none; display:flex; justify-content:center; align-items:center; background:black;",i.innerHTML='<img src="https://raw.githubusercontent.com/StanleyTheProgrammer/gugugaga/main/scary.jpeg" style="width:100vh; object-fit:cover;">',document.body.appendChild(i),setTimeout(()=>i.remove(),3e3)}if("scary_blood"===t){let r=document.createElement("div");r.id="af-troll-overlay",r.style="position:fixed; inset:0; z-index:2147483645; pointer-events:none; background:rgba(255,0,0,0.8); display:flex; justify-content:center; align-items:center; color:white; font-size:10vw; font-family:serif; font-weight:bold; text-shadow: 0 0 20px black;",r.textContent="DON'T LOOK BEHIND YOU",document.body.appendChild(r),setTimeout(()=>r.remove(),3e3)}if("scary_invert"===t&&(document.body.style.filter="invert(1) hue-rotate(180deg) contrast(2)",setTimeout(()=>document.body.style.filter="",3e3)),"scary_static"===t){document.body.style.filter="contrast(200%) grayscale(100%) brightness(50%)";let s=document.createElement("div");s.id="af-troll-overlay",s.style="position:fixed; inset:0; z-index:2147483645; pointer-events:none; background:url('https://i.gifer.com/7E2x.gif') center/cover; opacity:0.8;",document.body.appendChild(s);let l=new Audio("https://www.soundjay.com/misc/sounds/static-1.mp3");l.play().catch(()=>{}),setTimeout(()=>{s.remove(),document.body.style.filter=""},3e3)}if("troll_cursor"===t){let d=document.createElement("style");d.id="af-troll-cursor",d.textContent="* { cursor: url('https://cur.cursors-4u.net/cursors/cur-9/cur817.cur'), auto !important; }",document.head.appendChild(d),setTimeout(()=>d.remove(),5e3)}if("troll_zoom"===t){document.body.style.transition="transform 0.1s";let c=1;window.__trollInt=setInterval(()=>{c+=.1,document.body.style.transform=`scale(${c})`,c>3&&(clearInterval(window.__trollInt),document.body.style.transform="",document.body.style.transition="")},100)}}(t.action))}}),function e(t,o,n,a,i,s){if(document.getElementById("af-root"))return;let l=document.createElement("div");l.id="af-root",l.innerHTML=`
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
        `,document.body.appendChild(l);let d=document.getElementById("af-bar"),c=document.getElementById("af-toggle"),f=document.getElementById("af-slider"),p=document.getElementById("af-val"),u=document.getElementById("af-speed"),m=document.getElementById("af-speed-val"),g=document.getElementById("af-x"),$=document.getElementById("af-show"),x=document.getElementById("af-profile-btn"),h=document.getElementById("af-logout"),b=document.getElementById("af-out"),y=!1,_=0,v=0,w=!1,k=85,E=900,C=null,I=!1;function B(e,t,o){return t=t||1e3,o=o||50,new Promise(function(n){let a=Date.now();!function i(){let r;try{r=e()}catch(s){r=null}return r?n(r):Date.now()-a>=t?n(null):void setTimeout(i,o)}()})}function A(){try{let e=document.getElementById("app");if(!e||!e.__vue__)return null;return function e(t,o){if(!t||"object"!=typeof t||o>15||t.__ob__)return null;if(t.currentQuestion&&t.currentQuestion.childQuestions||t.currentQuestion&&t.currentQuestion.questionId)return t.currentQuestion;if(t.childQuestions&&Array.isArray(t.childQuestions))return t;if(t.$data)for(let n in t.$data){let a=t.$data[n];if(a&&"object"==typeof a){let i=e(a,o+1);if(i)return i}}if(t.$children)for(let r of t.$children){let s=e(r,o+1);if(s)return s}return null}(e.__vue__,0)}catch(t){return null}}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function L(e){if(/^-?\d+(\.\d+)?$/.test(e)){let t=parseFloat(e);return String(t+(.5>Math.random()?-1:1)*(1+Math.floor(5*Math.random())))}return e}async function z(e,t){let o=document.querySelector(".practice_base_topic_card")||document,n=o.querySelectorAll(".select_component");if(!n.length)return 0;let a=(e.childQuestions||[]).filter(e=>e.questionAnswer),i=0;for(let r=0;r<n.length;r++){let s=n[r],l=a[r];if(!l)continue;let d=String(Array.isArray(l.questionAnswer)?l.questionAnswer[0]:l.questionAnswer).trim().toUpperCase();if(t&&l.options&&l.options.length>1){let c=l.options.map(e=>e.optionNo).filter(e=>e!==d);c.length&&(d=c[Math.floor(Math.random()*c.length)])}let f=null;if(l.options&&Array.isArray(l.options)){let p=l.options.find(e=>e.optionNo===d);p&&(f=String(p.optionContent).trim())}if(!f)continue;let u=s.querySelectorAll(".options_box li");if(0===u.length){let m=s.__vue__;if(m&&m.$data&&"flag"in m.$data)m.$data.flag=!0,m.$forceUpdate&&m.$forceUpdate();else{let g=s.querySelector(".select_box");g&&g.click()}u=await B(function(){let e=s.querySelectorAll(".options_box li");return e.length?e:null},1500,60)}if(!u||!u.length)continue;let $=null;for(let x of u)if(x.textContent.trim()===f){$=x;break}if(!$){let h=f.replace(/\s+/g,"");for(let b of u)if(b.textContent.replace(/\s+/g,"")===h){$=b;break}}$&&($.click(),i++,await new Promise(e=>setTimeout(e,100)))}return i}async function M(){if(w&&!I){I=!0;try{var e;let o=A();if(!o)return;let r=(e=o)?e.questionId?e.questionId:e.childQuestions?JSON.stringify(e.childQuestions.map(e=>e.questionAnswer)):null:null;if(!r||r===C)return;C=r,document.querySelectorAll('[data-autofilled="1"]').forEach(e=>{e.removeAttribute("data-autofilled"),e.style.outline=""});let s=!(100*Math.random()<k);if(function e(t,o){let n=document.querySelector(".practice_base_topic_card")||document,a=n.querySelectorAll("textarea.ant-input");if(!a.length)return 0;let i=(t.childQuestions||[]).filter(e=>e.questionAnswer),r=0;for(let s=0;s<a.length;s++){let l=a[s],d=i[s];if(!d)break;let c=d.questionAnswer;Array.isArray(c)&&(c=c[0]),"string"!=typeof c&&(c=String(c)),o&&(c=L(c)),l.value!==c&&(l.focus(),l.value=c,l.dispatchEvent(new Event("input",{bubbles:!0})),l.dispatchEvent(new Event("change",{bubbles:!0})),l.blur(),l.style.outline="2px solid "+(o?"#ff453a":"#30d158"),r++)}return r}(o,s),function e(t,o){let n=document.querySelector(".practice_base_topic_card")||document,a=n.querySelectorAll("ul.TEXT, ul.MATH, ul.CHINESE, ul.ENGLISH");if(!a.length)return 0;let i=(t.childQuestions||[]).filter(e=>e.questionAnswer).map(e=>{let t=e.questionAnswer;return Array.isArray(t)&&(t=t.join(";")),{raw:String(t),child:e}}),r=0;for(let s=0;s<a.length;s++){let l=a[s];if(l.classList.contains("options_box")||l.closest(".select_component"))continue;let d=l.querySelectorAll('li[class*="optionNumOneRaw"]');if(!d.length)continue;let c=i[s]||i[i.length-1];if(!c)continue;let f=[],p=[],u=c.raw;u&&(/[;|,]/.test(u)?u.split(/[;|,]/).forEach(e=>{let t=e.trim().toUpperCase();t&&f.push(t)}):/^\s*[A-Z]\s*$/.test(u)?f.push(u.trim().toUpperCase()):/^[A-Z]{2,}$/.test(u.trim())?u.trim().toUpperCase().split("").forEach(e=>f.push(e)):p.push(u)),!f.length&&!p.length&&c.child&&c.child.options&&c.child.options.forEach(e=>{(e.correct||e.isCorrect)&&(e.optionNo?f.push(String(e.optionNo).toUpperCase()):e.optionContent&&p.push(String(e.optionContent).trim()))});let m=["A","B","C","D","E","F","G","H"],g=[];f.forEach(e=>{let t=m.indexOf(e.toUpperCase());t>=0&&g.push(t)});let $=[];if(o){let x=[];for(let h=0;h<d.length;h++)g.includes(h)||x.push(h);let b=Math.max(1,g.length);for(let y=0;y<b&&x.length;y++){let _=Math.floor(Math.random()*x.length);$.push(x[_]),x.splice(_,1)}}if(!o)for(let v of f){let w=v.toUpperCase(),k=null;for(let E of d){let C=E.querySelector(".label span");if(C&&C.textContent.replace(/\s|&nbsp;/g,"")===w+"."){k=E;break}}if(!k){let I=w.charCodeAt(0)-65;I>=0&&I<d.length&&(k=d[I])}k&&"1"!==k.dataset.autofilled&&(k.click(),k.dataset.autofilled="1",k.style.outline="2px solid #30d158",r++)}for(let B of $){let A=d[B];A&&"1"!==A.dataset.autofilled&&(A.click(),A.dataset.autofilled="1",A.style.outline="2px solid #ff453a",r++)}if(!o)for(let S of p)for(let L of d){let z=L.querySelector(".con span")||L.querySelector(".con");if(z&&(z.textContent.trim()===S||z.textContent.trim().includes(S)||S.includes(z.textContent.trim()))){if("1"===L.dataset.autofilled)break;L.click(),L.dataset.autofilled="1",L.style.outline="2px solid #30d158",r++;break}}}return r}(o,s),await z(o,s),i(),a.updateDoc(a.doc(n,"users",t),{autoStats:a.increment(1)}).catch(()=>{}),await new Promise(e=>setTimeout(e,E)),!w)return;let l=function e(){let t=document.querySelector(".practice_base_topic_card")||document,o=t.querySelectorAll(".ael_btn");for(let n of o)if(n.textContent.includes("下一題")||n.textContent.includes("下一题"))return n;let a=document.querySelectorAll('.ael_btn, button, [role="button"]');for(let i of a)if(i.textContent&&i.textContent.includes("下一題"))return i;return null}();l&&l.click()}finally{I=!1}}}d.addEventListener("pointerdown",function(e){if("af-x"===e.target.id)return;e.preventDefault(),y=!0,_=e.clientX,v=e.clientY;let t=l.getBoundingClientRect();l.style.right="auto",l.style.bottom="auto",l.style.left=t.left+"px",l.style.top=t.top+"px";try{d.setPointerCapture(e.pointerId)}catch(o){}}),d.addEventListener("pointermove",function(e){if(!y)return;e.preventDefault();let t=e.clientX-_,o=e.clientY-v,n=l.getBoundingClientRect(),a=n.left+t,i=n.top+o;a=Math.max(0,Math.min(window.innerWidth-l.offsetWidth,a)),i=Math.max(0,Math.min(window.innerHeight-l.offsetHeight,i)),l.style.left=a+"px",l.style.top=i+"px",_=e.clientX,v=e.clientY}),d.addEventListener("pointerup",function(){y=!1}),d.addEventListener("pointercancel",function(){y=!1}),h.onclick=async()=>{localStorage.removeItem("aplus_saved_user"),location.reload()},x.onclick=()=>{r(t,n,a)},$.addEventListener("click",async()=>{let e=A();if(!e||!e.childQuestions||!e.childQuestions.length){b.innerHTML='<div class="lbl">Result</div><div class="err">No question found.</div>',b.classList.add("show");return}let o=e.childQuestions.filter(e=>e.questionAnswer);if(!o.length){b.innerHTML='<div class="lbl">Result</div><div class="err">No answer found.</div>',b.classList.add("show");return}let i='<div class="lbl">Answer</div>';o.forEach(function(e){i+='<div class="ans-row">',o.length>1&&(i+='<span class="ans-q">Q'+e.questionNo+"</span>"),i+='<span class="val">'+function e(t){Array.isArray(t)&&(t=t.join(" ; ")),t=String(t);let o=/\$\$\s*\\+frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}\s*\$\$/g,n=[],a=0,i,r=!1;for(;null!==(i=o.exec(t));)r=!0,n.push(S(t.slice(a,i.index))),n.push('<span class="frac"><span class="num">'+S(i[1])+'</span><span class="den">'+S(i[2])+"</span></span>"),a=o.lastIndex;return r?(n.push(S(t.slice(a))),n.join("")):S(t)}(e.questionAnswer)+"</span></div>"}),b.innerHTML=i,b.classList.add("show"),s(),a.updateDoc(a.doc(n,"users",t),{showStats:a.increment(1)}).catch(()=>{})}),c.addEventListener("click",function(){w=!w,c.classList.toggle("active",w)}),f.addEventListener("input",function(){k=parseInt(f.value,10),p.textContent=k+"%"}),u.addEventListener("input",function(){E=parseInt(u.value,10),m.textContent=E+"ms"}),g.addEventListener("click",function(){l.remove()}),setInterval(M,800)}(e,o,n,a,()=>{l++},()=>{d++}),(o===t||c)&&function e(o,n,a){let i=document.createElement("button");i.textContent="Admin Panel",i.style="position:fixed; top:10px; left:10px; z-index:99999; padding:10px; background:red; color:white; border:none; border-radius:5px; cursor:move; font-weight:bold; touch-action:none; user-select:none;";let r=!1,s=0,l=0,d=!1;i.addEventListener("pointerdown",e=>{r=!0,d=!1,s=e.clientX-i.getBoundingClientRect().left,l=e.clientY-i.getBoundingClientRect().top;try{i.setPointerCapture(e.pointerId)}catch(t){}}),i.addEventListener("pointermove",e=>{r&&(d=!0,i.style.left=e.clientX-s+"px",i.style.top=e.clientY-l+"px")}),i.addEventListener("pointerup",()=>{r=!1}),i.addEventListener("pointercancel",()=>{r=!1}),document.body.appendChild(i),i.onclick=async()=>{if(d)return;let e=document.getElementById("af-admin-panel");if(e){e.remove();return}let i=document.createElement("div");i.id="af-admin-panel",i.innerHTML=`
                <div id="af-admin-header">
                    <h2>Admin & Mod Panel</h2>
                    <button id="af-admin-close">&times;</button>
                </div>
                <div id="af-admin-content">
                    
                    <div>
                        <div class="af-section-title">Global Chat</div>
                        <div id="af-chat-box"></div>
                        <form id="af-chat-form">
                            <input type="text" id="af-chat-input" placeholder="Type a message..." autocomplete="off">
                            <button id="af-chat-send" type="submit">Send</button>
                        </form>
                    </div>

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
            `,document.body.appendChild(i),document.getElementById("af-admin-close").onclick=()=>i.remove();let r=!1,s=0,l=0,c=document.getElementById("af-admin-header");c.addEventListener("pointerdown",e=>{if("af-admin-close"!==e.target.id){r=!0,s=e.clientX-i.getBoundingClientRect().left,l=e.clientY-i.getBoundingClientRect().top;try{c.setPointerCapture(e.pointerId)}catch(t){}}}),c.addEventListener("pointermove",e=>{r&&(i.style.transform="none",i.style.left=e.clientX-s+"px",i.style.top=e.clientY-l+"px")}),c.addEventListener("pointerup",()=>{r=!1}),c.addEventListener("pointercancel",()=>{r=!1});let f=document.getElementById("af-chat-box"),p=document.getElementById("af-chat-form"),u=document.getElementById("af-chat-input");n.onSnapshot(n.collection(o,"globalChat"),e=>{f.innerHTML="",e.forEach(e=>{let o=e.data(),n=new Date(o.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),a=o.author===t,i=o.isMod,r=document.createElement("div");r.className="af-chat-msg",r.innerHTML=`<span class="author ${a?"admin":i?"mod":""}">${o.author}</span> <span style="color:#666; font-size:10px;">${n}</span><br><span class="text">${o.text}</span>`,f.appendChild(r)}),f.scrollTop=f.scrollHeight}),p.onsubmit=async e=>{e.preventDefault();let t=u.value.trim();if(!t)return;u.value="";let i=await n.getDocs(n.collection(o,"users")),r=!1;i.forEach(e=>{e.data().username===a&&(r=e.data().isMod)}),await n.addDoc(n.collection(o,"globalChat"),{author:a,isMod:r,text:t,timestamp:Date.now()})};let m=document.getElementById("af-admin-list");n.onSnapshot(n.collection(o,"users"),e=>{m.innerHTML="",e.forEach(e=>{let i=e.data(),r=e.id,s=i.username===a,l=i.username===t,d=i.isMod,c=i.lastSeen&&Date.now()-i.lastSeen<45e3,f=document.createElement("div");f.className="af-user-row";let p=document.createElement("div");p.className="name",p.innerHTML=`<div class="af-status-dot ${c?"af-status-online":"af-status-offline"}"></div> <span>${i.username}</span>`;let u=document.createElement("div");u.className="actions";let g=document.createElement("button");g.textContent="Troll",g.className="troll",g.onclick=async()=>{let e=document.getElementById("af-troll-select").value;await n.setDoc(n.doc(o,"commands",r),{action:e,timestamp:Date.now()}),g.textContent="Sent!",setTimeout(()=>g.textContent="Troll",2e3)},u.appendChild(g);let $=document.createElement("button");if(s?($.textContent="Me",$.className="disabled",$.disabled=!0):s||l||a!==t&&d?($.textContent=l?"Admin":"Mod",$.className="disabled",$.disabled=!0):($.textContent=i.isBanned?"Unban":"Ban",$.className=i.isBanned?"unban":"ban",$.onclick=async()=>{await n.updateDoc(n.doc(o,"users",r),{isBanned:!i.isBanned})}),u.appendChild($),a===t&&!s&&!l){let x=document.createElement("button");x.textContent=d?"Demod":"Make Mod",x.className=d?"demod":"mod",x.onclick=async()=>{await n.updateDoc(n.doc(o,"users",r),{isMod:!d})},u.appendChild(x)}f.appendChild(p),f.appendChild(u),m.appendChild(f)})})}}(n,a,o)}async function r(e,o,n){let a=document.getElementById("af-profile-panel");if(a){a.remove();return}let i=document.createElement("div");i.id="af-profile-panel",i.style="position:fixed; top:20%; left:20%; background:#1c1c1e; border:1px solid #333; border-radius:12px; padding:20px; z-index:2147483649; width:300px; color:#fff; font-family:-apple-system,sans-serif; box-shadow:0 10px 30px rgba(0,0,0,0.5);",i.innerHTML=`
            <button id="af-profile-close" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#98989d; cursor:pointer; font-size:18px;">&times;</button>
            <h2 style="margin-top:0; color:#0a84ff;">Profile Search</h2>
            <input type="text" id="af-search" placeholder="Search username...">
            <div id="af-profile-result"></div>
        `,document.body.appendChild(i),document.getElementById("af-profile-close").onclick=()=>i.remove();let r=document.getElementById("af-search"),s=document.getElementById("af-profile-result");r.addEventListener("input",async()=>{let a=r.value.trim().toLowerCase();if(!a)return s.innerHTML="";let i=await n.getDoc(n.doc(o,"usernames",a));if(!i.exists())return s.innerHTML='<div style="color:#ff453a; margin-top:10px;">User not found.</div>';let l=i.data(),d=await n.getDoc(n.doc(o,"users",l.uid));if(!d.exists())return;let c=d.data(),f=l.uid===e,p=c.isBanned?'<span style="color:#ff453a;">Banned</span>':'<span style="color:#30d158;">Active</span>',u=c.username===t?'<span style="color:#ff453a;">Admin</span>':c.isMod?'<span style="color:#ff9f0a;">Mod</span>':"";s.innerHTML=`
                <div class="af-profile-card">
                    <h3>${c.username} ${f?"(You)":""} ${u}</h3>
                    <div style="font-size:12px; color:#98989d;">Status: ${p}</div>
                    <div class="af-profile-stats">
                        <div>Auto-Answered: <b>${c.autoStats||0}</b></div>
                        <div>Answers Viewed: <b>${c.showStats||0}</b></div>
                    </div>
                </div>
            `})}a()}();
