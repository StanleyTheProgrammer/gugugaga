(function () {
    'use strict';

    // ==========================================
    // 1. CONFIGURATION
    // ==========================================
    const firebaseConfig = {
        apiKey: "AIzaSyDd15smQKX5BWWlQ3PjzZ6cEi18P7zKeWg",
        authDomain: "aplus-5383f.firebaseapp.com",
        projectId: "aplus-5383f",
        storageBucket: "aplus-5383f.firebasestorage.app",
        messagingSenderId: "654012013474",
        appId: "1:654012013474:web:3f2e023a2597af46c8b0fb"
    };

    const ADMIN_USERNAME = "cat_here"; 

    // ==========================================
    // 2. FIREBASE SETUP
    // ==========================================
    async function loadFirebase() {
        const appMod = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
        const authMod = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
        const dbMod = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
        const app = appMod.initializeApp(firebaseConfig);
        return { auth: authMod.getAuth(app), db: dbMod.getFirestore(app), authMod, dbMod };
    }

    function getDeviceId() {
        let id = localStorage.getItem('aplus_device_id');
        if (!id) {
            id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
            localStorage.setItem('aplus_device_id', id);
        }
        return id;
    }

    // ==========================================
    // 3. STYLES
    // ==========================================
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

        #af-admin-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #1c1c1e; border: 1px solid #333; border-radius: 12px; padding: 0; z-index: 2147483649; width: 450px; max-height: 80vh; color: #fff; font-family: -apple-system, sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; }
        #af-admin-header { padding: 15px 20px; background: #232325; border-bottom: 1px solid #333; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none; touch-action: none; }
        #af-admin-header h2 { margin: 0; color: #ff453a; font-size: 18px; pointer-events: none; }
        #af-admin-close { background: none; border: none; color: #98989d; cursor: pointer; font-size: 20px; line-height: 1; padding: 0; }
        #af-admin-close:hover { color: #fff; }
        #af-admin-content { padding: 20px; overflow-y: auto; }
        
        .af-user-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #333; font-size: 14px; }
        .af-user-row .actions { display: flex; gap: 6px; }
        .af-user-row button { color: #fff; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; }
        .af-user-row button.ban { background: #ff453a; }
        .af-user-row button.unban { background: #30d158; }
        .af-user-row button.troll { background: #bf5af2; }
        .af-user-row button.profile { background: #0a84ff; }
        .af-user-row button.disabled { background: #333; color: #888; cursor: not-allowed; }
        
        #af-troll-select, #af-search { width: 100%; padding: 8px; margin-bottom: 10px; background: #2c2c2e; color: #fff; border: 1px solid #3a3a3c; border-radius: 6px; box-sizing: border-box; }

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
    `;

    // ==========================================
    // 4. TROLL EFFECTS LOGIC (Fixed Assets)
    // ==========================================
    function triggerTroll(action) {
        document.body.style.animation = '';
        document.body.style.transform = '';
        document.body.style.filter = '';
        const old = document.getElementById('af-troll-overlay');
        if (old) old.remove();
        if (window.__trollInt) clearInterval(window.__trollInt);

        if (action === 'shake' || action === 'gugugaga') {
            const shakeStyle = document.createElement('style');
            shakeStyle.textContent = `@keyframes af-shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }`;
            document.head.appendChild(shakeStyle);
            document.body.style.animation = 'af-shake 0.5s infinite';
            setTimeout(() => document.body.style.animation = '', 5000);
        }

        if (action === 'gugugaga') {
            const overlay = document.createElement('div');
            overlay.id = 'af-troll-overlay';
            overlay.style = "position:fixed; inset:0; z-index:2147483645; pointer-events:none; overflow:hidden; background:rgba(0,0,0,0.5);";
            document.body.appendChild(overlay);
            
            window.__trollInt = setInterval(() => {
                const txt = document.createElement('div');
                txt.textContent = "GUGUGAGA";
                txt.style = `position:absolute; color:red; font-weight:bold; font-family:Comic Sans MS, sans-serif; font-size:${Math.random()*40+20}px; left:${Math.random()*100}vw; top:${Math.random()*100}vh; transform:rotate(${Math.random()*360}deg); opacity:${Math.random()*0.5+0.5};`;
                overlay.appendChild(txt);
                setTimeout(() => txt.remove(), 1500);
            }, 30);
            setTimeout(() => { clearInterval(window.__trollInt); overlay.remove(); }, 5000);
        }

        if (action === 'flip') {
            document.body.style.transform = 'rotate(180deg)';
            setTimeout(() => document.body.style.transform = '', 5000);
        }

        if (action === 'alert') {
            alert("You have been trolled!");
        }

        if (action === 'scary_face') {
            const overlay = document.createElement('div');
            overlay.id = 'af-troll-overlay';
            overlay.style = "position:fixed; inset:0; z-index:2147483645; pointer-events:none; display:flex; justify-content:center; align-items:center; background:black;";
            // Using a reliable image CDN
            overlay.innerHTML = '<img src="https://i.imgur.com/L8wJt7k.jpeg" style="width:100vh; object-fit:cover;">';
            document.body.appendChild(overlay);
            // Reliable scream sound
            const scream = new Audio('https://www.soundjay.com/human/sounds/scream-01.mp3');
            scream.play().catch(()=>{});
            setTimeout(() => overlay.remove(), 3000);
        }

        if (action === 'scary_blood') {
            const overlay = document.createElement('div');
            overlay.id = 'af-troll-overlay';
            overlay.style = "position:fixed; inset:0; z-index:2147483645; pointer-events:none; background:rgba(255,0,0,0.8); display:flex; justify-content:center; align-items:center; color:white; font-size:10vw; font-family:serif; font-weight:bold; text-shadow: 0 0 20px black;";
            overlay.textContent = "DON'T LOOK BEHIND YOU";
            document.body.appendChild(overlay);
            setTimeout(() => overlay.remove(), 3000);
        }

        if (action === 'scary_invert') {
            document.body.style.filter = 'invert(1) hue-rotate(180deg) contrast(2)';
            setTimeout(() => document.body.style.filter = '', 3000);
        }

        if (action === 'scary_static') {
            document.body.style.filter = 'contrast(200%) grayscale(100%) brightness(50%)';
            const overlay = document.createElement('div');
            overlay.id = 'af-troll-overlay';
            overlay.style = "position:fixed; inset:0; z-index:2147483645; pointer-events:none; background:url('https://i.gifer.com/7E2x.gif') center/cover; opacity:0.8;";
            document.body.appendChild(overlay);
            const scream = new Audio('https://www.soundjay.com/misc/sounds/static-1.mp3');
            scream.play().catch(()=>{});
            setTimeout(() => { overlay.remove(); document.body.style.filter = ''; }, 3000);
        }

        if (action === 'troll_cursor') {
            const css = document.createElement('style');
            css.id = 'af-troll-cursor';
            css.textContent = `* { cursor: url('https://cur.cursors-4u.net/cursors/cur-9/cur817.cur'), auto !important; }`;
            document.head.appendChild(css);
            setTimeout(() => css.remove(), 5000);
        }

        if (action === 'troll_zoom') {
            document.body.style.transition = 'transform 0.1s';
            let scale = 1;
            window.__trollInt = setInterval(() => {
                scale += 0.1;
                document.body.style.transform = `scale(${scale})`;
                if (scale > 3) { clearInterval(window.__trollInt); document.body.style.transform = ''; document.body.style.transition = ''; }
            }, 100);
        }
    }

    // ==========================================
    // 5. AUTH & LOCAL STORAGE
    // ==========================================
    async function initAuth() {
        const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
        const fb = await loadFirebase();
        const { auth, db, authMod, dbMod } = fb;

        const savedUser = localStorage.getItem('aplus_saved_user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                const uSnap = await dbMod.getDoc(dbMod.doc(db, 'users', parsed.uid));
                if (uSnap.exists() && uSnap.data().isBanned) {
                    if (parsed.username === ADMIN_USERNAME) {
                        await dbMod.updateDoc(dbMod.doc(db, 'users', parsed.uid), { isBanned: false });
                    } else {
                        localStorage.removeItem('aplus_saved_user');
                        throw new Error("Account Banned.");
                    }
                }
                await authMod.signInAnonymously(auth);
                startHack(parsed.uid, parsed.username, db, dbMod, auth, authMod);
                return;
            } catch (e) {
                console.log("Auto-login failed", e);
            }
        }

        const modal = document.createElement('div');
        modal.id = 'af-auth-modal';
        modal.innerHTML = `
            <div id="af-auth-box">
                <h2 id="af-auth-title">Login</h2>
                <div id="af-error"></div>
                <input type="text" id="af-username" placeholder="Username" autocomplete="off">
                <input type="password" id="af-password" placeholder="Password (max 20 chars)" maxlength="20">
                <button id="af-auth-btn">Login</button>
                <button id="af-auth-switch">Need an account? Register</button>
            </div>
        `;
        document.body.appendChild(modal);

        let isLogin = true;
        document.getElementById('af-auth-switch').onclick = () => {
            isLogin = !isLogin;
            document.getElementById('af-auth-title').textContent = isLogin ? 'Login' : 'Create Account';
            document.getElementById('af-auth-btn').textContent = isLogin ? 'Login' : 'Register';
            document.getElementById('af-auth-switch').textContent = isLogin ? 'Need an account? Register' : 'Already have an account? Login';
            document.getElementById('af-error').textContent = '';
        };

        document.getElementById('af-auth-btn').onclick = async () => {
            const u = document.getElementById('af-username').value.trim().toLowerCase();
            const p = document.getElementById('af-password').value;
            const errDiv = document.getElementById('af-error');
            const btn = document.getElementById('af-auth-btn');

            if (!u || !p) return errDiv.textContent = "Fill all fields.";
            if (p.length > 20) return errDiv.textContent = "Password max 20 chars.";

            btn.disabled = true; errDiv.textContent = "Processing...";

            try {
                const usernameRef = dbMod.doc(db, 'usernames', u);

                if (isLogin) {
                    const snap = await dbMod.getDoc(usernameRef);
                    if (!snap.exists()) throw new Error("Account not found.");
                    const data = snap.data();
                    if (data.password !== p) throw new Error("Wrong password.");

                    await authMod.signInAnonymously(auth);

                    const userRef = dbMod.doc(db, 'users', data.uid);
                    const uSnap = await dbMod.getDoc(userRef);
                    if (uSnap.exists() && uSnap.data().isBanned) {
                        if (u === ADMIN_USERNAME) {
                            await dbMod.updateDoc(userRef, { isBanned: false });
                        } else {
                            await authMod.signOut(auth);
                            throw new Error("This account is BANNED.");
                        }
                    }

                    localStorage.setItem('aplus_saved_user', JSON.stringify({ uid: data.uid, username: u }));
                    modal.remove();
                    startHack(data.uid, u, db, dbMod, auth, authMod);

                } else {
                    const devId = getDeviceId();
                    const devRef = dbMod.doc(db, 'devices', devId);
                    const dSnap = await dbMod.getDoc(devRef);
                    if (dSnap.exists()) throw new Error("This device is already registered.");
                    const uSnap = await dbMod.getDoc(usernameRef);
                    if (uSnap.exists()) throw new Error("Username taken.");

                    const cred = await authMod.signInAnonymously(auth);
                    const uid = cred.user.uid;

                    await dbMod.setDoc(usernameRef, { uid, password: p });
                    await dbMod.setDoc(devRef, { uid });
                    await dbMod.setDoc(dbMod.doc(db, 'users', uid), { 
                        username: u, 
                        isBanned: false, 
                        createdAt: Date.now(),
                        autoStats: 0,
                        showStats: 0
                    });

                    localStorage.setItem('aplus_saved_user', JSON.stringify({ uid, username: u }));
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

    // ==========================================
    // 6. MAIN HACK LOGIC & TROLL LISTENER
    // ==========================================
    function startHack(uid, username, db, dbMod, auth, authMod) {
        console.log(`[auth] Logged in as ${username}`);
        
        let sessionAutoCount = 0;
        let sessionShowCount = 0;

        setInterval(async () => {
            try {
                const uSnap = await dbMod.getDoc(dbMod.doc(db, 'users', uid));
                if (uSnap.exists() && uSnap.data().isBanned) {
                    if (username === ADMIN_USERNAME) {
                        await dbMod.updateDoc(dbMod.doc(db, 'users', uid), { isBanned: false });
                    } else {
                        alert("You have been BANNED by the admin.");
                        localStorage.removeItem('aplus_saved_user');
                        await authMod.signOut(auth);
                        location.reload();
                    }
                }
            } catch(e) {}
        }, 3000);

        dbMod.onSnapshot(dbMod.doc(db, 'commands', uid), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                
                const lastSeen = localStorage.getItem('af_last_troll');
                if (lastSeen == data.timestamp) return; 
                localStorage.setItem('af_last_troll', data.timestamp);

                triggerTroll(data.action);
            }
        });

        injectAplusGUI(uid, username, db, dbMod, () => { sessionAutoCount++; }, () => { sessionShowCount++; });

        if (username === ADMIN_USERNAME) {
            injectAdminPanel(db, dbMod, auth, authMod);
        }
    }

    // ==========================================
    // 7. APLUS CHEAT GUI
    // ==========================================
    function injectAplusGUI(uid, username, db, dbMod, onAuto, onShow) {
        if (document.getElementById('af-root')) return;

        const root = document.createElement('div');
        root.id = 'af-root';
        root.innerHTML = `
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
                <button class="act" id="af-profile-btn">My Profile</button>
                <button class="act" id="af-logout" style="background:#ff453a; color:#fff;">Log Out</button>
                <div class="out" id="af-out"></div>
            </div>
        `;
        document.body.appendChild(root);

        const bar = document.getElementById('af-bar');
        const toggle = document.getElementById('af-toggle');
        const slider = document.getElementById('af-slider');
        const sliderVal = document.getElementById('af-val');
        const speedSlider = document.getElementById('af-speed');
        const speedVal = document.getElementById('af-speed-val');
        const closeBtn = document.getElementById('af-x');
        const showBtn = document.getElementById('af-show');
        const profileBtn = document.getElementById('af-profile-btn');
        const logoutBtn = document.getElementById('af-logout');
        const outEl = document.getElementById('af-out');

        let drag = false, ox = 0, oy = 0;
        let autoEnabled = false;
        let correctChance = 85;
        let advanceDelay = 900;
        let lastKey = null;
        let busy = false;

        bar.addEventListener('pointerdown', function (e) {
            if (e.target.id === 'af-x') return;
            e.preventDefault();
            drag = true; ox = e.clientX; oy = e.clientY;
            const r = root.getBoundingClientRect();
            root.style.right = 'auto'; root.style.bottom = 'auto';
            root.style.left = r.left + 'px'; root.style.top = r.top + 'px';
            try { bar.setPointerCapture(e.pointerId); } catch (err) {}
        });
        bar.addEventListener('pointermove', function (e) {
            if (!drag) return;
            e.preventDefault();
            const dx = e.clientX - ox, dy = e.clientY - oy;
            const r = root.getBoundingClientRect();
            let nx = r.left + dx, ny = r.top + dy;
            nx = Math.max(0, Math.min(window.innerWidth - root.offsetWidth, nx));
            ny = Math.max(0, Math.min(window.innerHeight - root.offsetHeight, ny));
            root.style.left = nx + 'px'; root.style.top = ny + 'px';
            ox = e.clientX; oy = e.clientY;
        });
        bar.addEventListener('pointerup', function () { drag = false; });
        bar.addEventListener('pointercancel', function () { drag = false; });

        logoutBtn.onclick = async () => {
            localStorage.removeItem('aplus_saved_user');
            location.reload();
        };

        profileBtn.onclick = () => {
            injectProfilePanel(uid, db, dbMod);
        };

        function waitFor(fn, timeout, interval) {
            timeout = timeout || 1000; interval = interval || 50;
            return new Promise(function (resolve) {
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
                const app = document.getElementById('app');
                if (!app || !app.__vue__) return null;
                function walk(o, d) {
                    if (!o || typeof o !== 'object' || d > 15) return null;
                    if (o.__ob__) return null;
                    if (o.currentQuestion && o.currentQuestion.childQuestions) return o.currentQuestion;
                    if (o.currentQuestion && o.currentQuestion.questionId) return o.currentQuestion;
                    if (o.childQuestions && Array.isArray(o.childQuestions)) return o;
                    if (o.$data) {
                        for (const k in o.$data) {
                            const v = o.$data[k];
                            if (v && typeof v === 'object') {
                                const r = walk(v, d + 1);
                                if (r) return r;
                            }
                        }
                    }
                    if (o.$children) {
                        for (const c of o.$children) {
                            const r = walk(c, d + 1);
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
        function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

        function renderValue(raw) {
            if (Array.isArray(raw)) raw = raw.join(' ; ');
            raw = String(raw);
            const re = /\$\$\s*\\+frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}\s*\$\$/g;
            const parts = [];
            let last = 0, m, found = false;
            while ((m = re.exec(raw)) !== null) {
                found = true;
                parts.push(esc(raw.slice(last, m.index)));
                parts.push('<span class="frac"><span class="num">' + esc(m[1]) + '</span><span class="den">' + esc(m[2]) + '</span></span>');
                last = re.lastIndex;
            }
            if (!found) return esc(raw);
            parts.push(esc(raw.slice(last)));
            return parts.join('');
        }

        showBtn.addEventListener('click', async () => {
            const q = getQuestion();
            if (!q || !q.childQuestions || !q.childQuestions.length) {
                outEl.innerHTML = '<div class="lbl">Result</div><div class="err">No question found.</div>';
                outEl.classList.add('show'); return;
            }
            const list = q.childQuestions.filter(c => c.questionAnswer);
            if (!list.length) {
                outEl.innerHTML = '<div class="lbl">Result</div><div class="err">No answer found.</div>';
                outEl.classList.add('show'); return;
            }
            let html = '<div class="lbl">Answer</div>';
            list.forEach(function (c) {
                html += '<div class="ans-row">';
                if (list.length > 1) html += '<span class="ans-q">Q' + c.questionNo + '</span>';
                html += '<span class="val">' + renderValue(c.questionAnswer) + '</span></div>';
            });
            outEl.innerHTML = html;
            outEl.classList.add('show');

            onShow();
            dbMod.updateDoc(dbMod.doc(db, 'users', uid), { showStats: dbMod.increment(1) }).catch(()=>{});
        });

        function fillInputs(q, forceWrong) {
            const card = document.querySelector('.practice_base_topic_card') || document;
            const inputs = card.querySelectorAll('textarea.ant-input');
            if (!inputs.length) return 0;
            const answers = (q.childQuestions || []).filter(c => c.questionAnswer);
            let filled = 0;
            for (let i = 0; i < inputs.length; i++) {
                const input = inputs[i]; const a = answers[i]; if (!a) break;
                let val = a.questionAnswer;
                if (Array.isArray(val)) val = val[0];
                if (typeof val !== 'string') val = String(val);
                if (forceWrong) val = randomWrongText(val);
                if (input.value === val) continue;
                input.focus(); input.value = val;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.blur();
                input.style.outline = '2px solid ' + (forceWrong ? '#ff453a' : '#30d158');
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
            const card = document.querySelector('.practice_base_topic_card') || document;
            const groups = card.querySelectorAll('ul.TEXT, ul.MATH, ul.CHINESE, ul.ENGLISH');
            if (!groups.length) return 0;
            const answers = (q.childQuestions || []).filter(c => c.questionAnswer).map(c => {
                let raw = c.questionAnswer;
                if (Array.isArray(raw)) raw = raw.join(';');
                return { raw: String(raw), child: c };
            });
            let clicked = 0;
            for (let gi = 0; gi < groups.length; gi++) {
                const ul = groups[gi];
                if (ul.classList.contains('options_box') || ul.closest('.select_component')) continue;
                const items = ul.querySelectorAll('li[class*="optionNumOneRaw"]');
                if (!items.length) continue;
                const a = answers[gi] || answers[answers.length - 1];
                if (!a) continue;
                const targetLetters = []; const targetTexts = [];
                const raw = a.raw;
                if (raw) {
                    if (/[;|,]/.test(raw)) {
                        raw.split(/[;|,]/).forEach(part => { const t = part.trim().toUpperCase(); if (t) targetLetters.push(t); });
                    } else if (/^\s*[A-Z]\s*$/.test(raw)) targetLetters.push(raw.trim().toUpperCase());
                    else if (/^[A-Z]{2,}$/.test(raw.trim())) raw.trim().toUpperCase().split('').forEach(l => targetLetters.push(l));
                    else targetTexts.push(raw);
                }
                if (!targetLetters.length && !targetTexts.length && a.child && a.child.options) {
                    a.child.options.forEach(o => {
                        if (o.correct || o.isCorrect) {
                            if (o.optionNo) targetLetters.push(String(o.optionNo).toUpperCase());
                            else if (o.optionContent) targetTexts.push(String(o.optionContent).trim());
                        }
                    });
                }
                const allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
                const correctIdxs = []; targetLetters.forEach(l => { const idx = allLetters.indexOf(l.toUpperCase()); if (idx >= 0) correctIdxs.push(idx); });
                let wrongIdxList = [];
                if (forceWrong) {
                    const pool = []; for (let i = 0; i < items.length; i++) { if (!correctIdxs.includes(i)) pool.push(i); }
                    const need = Math.max(1, correctIdxs.length);
                    for (let i = 0; i < need && pool.length; i++) {
                        const pick = Math.floor(Math.random() * pool.length); wrongIdxList.push(pool[pick]); pool.splice(pick, 1);
                    }
                }
                if (!forceWrong) {
                    for (const letter of targetLetters) {
                        const letterUpper = letter.toUpperCase();
                        let matched = null;
                        for (const li of items) {
                            const label = li.querySelector('.label span');
                            if (label && label.textContent.replace(/\s|&nbsp;/g, '') === letterUpper + '.') { matched = li; break; }
                        }
                        if (!matched) { const idx = letterUpper.charCodeAt(0) - 65; if (idx >= 0 && idx < items.length) matched = items[idx]; }
                        if (matched && matched.dataset.autofilled !== '1') {
                            matched.click(); matched.dataset.autofilled = '1';
                            matched.style.outline = '2px solid #30d158'; clicked++;
                        }
                    }
                }
                for (const wi of wrongIdxList) {
                    const li = items[wi]; if (!li || li.dataset.autofilled === '1') continue;
                    li.click(); li.dataset.autofilled = '1'; li.style.outline = '2px solid #ff453a'; clicked++;
                }
                if (!forceWrong) {
                    for (const text of targetTexts) {
                        for (const li of items) {
                            const con = li.querySelector('.con span') || li.querySelector('.con');
                            if (con && (con.textContent.trim() === text || con.textContent.trim().includes(text) || text.includes(con.textContent.trim()))) {
                                if (li.dataset.autofilled === '1') break;
                                li.click(); li.dataset.autofilled = '1'; li.style.outline = '2px solid #30d158'; clicked++; break;
                            }
                        }
                    }
                }
            }
            return clicked;
        }

        async function fillDropdowns(q, forceWrong) {
            const card = document.querySelector('.practice_base_topic_card') || document;
            const comps = card.querySelectorAll('.select_component');
            if (!comps.length) return 0;
            const answers = (q.childQuestions || []).filter(c => c.questionAnswer);
            let filled = 0;
            for (let i = 0; i < comps.length; i++) {
                const comp = comps[i]; const a = answers[i]; if (!a) continue;
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
                let lis = comp.querySelectorAll('.options_box li');
                if (lis.length === 0) {
                    const vue = comp.__vue__;
                    if (vue && vue.$data && 'flag' in vue.$data) { vue.$data.flag = true; if (vue.$forceUpdate) vue.$forceUpdate(); }
                    else { const trigger = comp.querySelector('.select_box'); if (trigger) trigger.click(); }
                    lis = await waitFor(function () { const o = comp.querySelectorAll('.options_box li'); return o.length ? o : null; }, 1500, 60);
                }
                if (!lis || !lis.length) continue;
                let target = null;
                for (const li of lis) { if (li.textContent.trim() === targetContent) { target = li; break; } }
                if (!target) {
                    const norm = targetContent.replace(/\s+/g, '');
                    for (const li of lis) { if (li.textContent.replace(/\s+/g, '') === norm) { target = li; break; } }
                }
                if (!target) continue;
                target.click(); filled++; await new Promise(r => setTimeout(r, 100));
            }
            return filled;
        }

        function findNextButton() {
            const card = document.querySelector('.practice_base_topic_card') || document;
            const btns = card.querySelectorAll('.ael_btn');
            for (const b of btns) { if (b.textContent.includes('下一題') || b.textContent.includes('下一题')) return b; }
            const all = document.querySelectorAll('.ael_btn, button, [role="button"]');
            for (const b of all) { if (b.textContent && b.textContent.includes('下一題')) return b; }
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
                document.querySelectorAll('[data-autofilled="1"]').forEach(el => { el.removeAttribute('data-autofilled'); el.style.outline = ''; });
                const forceWrong = !rollCorrect();
                fillInputs(q, forceWrong);
                clickChoices(q, forceWrong);
                await fillDropdowns(q, forceWrong);

                onAuto();
                dbMod.updateDoc(dbMod.doc(db, 'users', uid), { autoStats: dbMod.increment(1) }).catch(()=>{});

                await new Promise(r => setTimeout(r, advanceDelay));
                if (!autoEnabled) return;
                const next = findNextButton();
                if (next) next.click();
            } finally { busy = false; }
        }

        toggle.addEventListener('click', function () { autoEnabled = !autoEnabled; toggle.classList.toggle('active', autoEnabled); });
        slider.addEventListener('input', function () { correctChance = parseInt(slider.value, 10); sliderVal.textContent = correctChance + '%'; });
        speedSlider.addEventListener('input', function () { advanceDelay = parseInt(speedSlider.value, 10); speedVal.textContent = advanceDelay + 'ms'; });
        closeBtn.addEventListener('click', function () { root.remove(); });

        setInterval(tick, 800);
    }

    // ==========================================
    // 8. PROFILE & SEARCH PANEL
    // ==========================================
    async function injectProfilePanel(uid, db, dbMod) {
        const existing = document.getElementById('af-profile-panel');
        if (existing) { existing.remove(); return; }

        const panel = document.createElement('div');
        panel.id = 'af-profile-panel';
        panel.style = "position:fixed; top:20%; left:20%; background:#1c1c1e; border:1px solid #333; border-radius:12px; padding:20px; z-index:2147483649; width:300px; color:#fff; font-family:-apple-system,sans-serif; box-shadow:0 10px 30px rgba(0,0,0,0.5);";
        panel.innerHTML = `
            <button id="af-profile-close" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#98989d; cursor:pointer; font-size:18px;">&times;</button>
            <h2 style="margin-top:0; color:#0a84ff;">Profile Search</h2>
            <input type="text" id="af-search" placeholder="Search username...">
            <div id="af-profile-result"></div>
        `;
        document.body.appendChild(panel);
        document.getElementById('af-profile-close').onclick = () => panel.remove();

        const searchIn = document.getElementById('af-search');
        const resDiv = document.getElementById('af-profile-result');

        searchIn.addEventListener('input', async () => {
            const q = searchIn.value.trim().toLowerCase();
            if (!q) return resDiv.innerHTML = '';
            
            const uSnap = await dbMod.getDoc(dbMod.doc(db, 'usernames', q));
            if (!uSnap.exists()) return resDiv.innerHTML = '<div style="color:#ff453a; margin-top:10px;">User not found.</div>';
            
            const uData = uSnap.data();
            const userDoc = await dbMod.getDoc(dbMod.doc(db, 'users', uData.uid));
            if (!userDoc.exists()) return;

            const data = userDoc.data();
            const isMe = uData.uid === uid;
            const status = data.isBanned ? '<span style="color:#ff453a;">Banned</span>' : '<span style="color:#30d158;">Active</span>';

            resDiv.innerHTML = `
                <div class="af-profile-card">
                    <h3>${data.username} ${isMe ? '(You)' : ''}</h3>
                    <div style="font-size:12px; color:#98989d;">Status: ${status}</div>
                    <div class="af-profile-stats">
                        <div>Auto-Answered: <b>${data.autoStats || 0}</b></div>
                        <div>Answers Viewed: <b>${data.showStats || 0}</b></div>
                    </div>
                </div>
            `;
        });
    }

    // ==========================================
    // 9. ADMIN PANEL (Draggable & Toggleable)
    // ==========================================
    function injectAdminPanel(db, dbMod) {
        const btn = document.createElement('button');
        btn.textContent = "Admin Panel";
        btn.style = "position:fixed; top:10px; left:10px; z-index:99999; padding:10px; background:red; color:white; border:none; border-radius:5px; cursor:move; font-weight:bold; touch-action:none; user-select:none;";
        
        let isBtnDragging = false, btnX = 0, btnY = 0, btnMoved = false;
        btn.addEventListener('pointerdown', (e) => {
            isBtnDragging = true;
            btnMoved = false;
            btnX = e.clientX - btn.getBoundingClientRect().left;
            btnY = e.clientY - btn.getBoundingClientRect().top;
            try { btn.setPointerCapture(e.pointerId); } catch(err) {}
        });
        btn.addEventListener('pointermove', (e) => {
            if (!isBtnDragging) return;
            btnMoved = true;
            btn.style.left = (e.clientX - btnX) + 'px';
            btn.style.top = (e.clientY - btnY) + 'px';
        });
        btn.addEventListener('pointerup', () => { isBtnDragging = false; });
        btn.addEventListener('pointercancel', () => { isBtnDragging = false; });
        
        document.body.appendChild(btn);

        btn.onclick = async () => {
            if (btnMoved) return; // If they dragged it, don't open/close the panel

            const existing = document.getElementById('af-admin-panel');
            if (existing) { 
                existing.remove(); 
                return; 
            }

            const panel = document.createElement('div');
            panel.id = 'af-admin-panel';
            panel.innerHTML = `
                <div id="af-admin-header">
                    <h2>Admin Panel</h2>
                    <button id="af-admin-close">&times;</button>
                </div>
                <div id="af-admin-content">
                    <div style="margin-bottom: 15px;">
                        <label style="font-size:12px; color:#aaa;">Troll Tool:</label>
                        <select id="af-troll-select">
                            <option value="gugugaga">GUGUGAGA Spam</option>
                            <option value="shake">Shake Screen</option>
                            <option value="flip">Flip Screen</option>
                            <option value="alert">Random Alert</option>
                            <option value="troll_cursor">Spooky Cursor</option>
                            <option value="troll_zoom">Infinite Zoom</option>
                            <option value="scary_face">Scary Face + Scream</option>
                            <option value="scary_blood">Blood Overlay</option>
                            <option value="scary_invert">Inverted Colors</option>
                            <option value="scary_static">Static Noise + Scream</option>
                        </select>
                    </div>
                    <div id="af-admin-list">Loading users...</div>
                </div>
            `;
            document.body.appendChild(panel);
            document.getElementById('af-admin-close').onclick = () => panel.remove();

            let isPanelDragging = false, panelX = 0, panelY = 0;
            const header = document.getElementById('af-admin-header');
            
            header.addEventListener('pointerdown', (e) => {
                if (e.target.id === 'af-admin-close') return;
                isPanelDragging = true;
                panelX = e.clientX - panel.getBoundingClientRect().left;
                panelY = e.clientY - panel.getBoundingClientRect().top;
                try { header.setPointerCapture(e.pointerId); } catch(err) {}
            });
            header.addEventListener('pointermove', (e) => {
                if (!isPanelDragging) return;
                panel.style.transform = 'none';
                panel.style.left = (e.clientX - panelX) + 'px';
                panel.style.top = (e.clientY - panelY) + 'px';
            });
            header.addEventListener('pointerup', () => { isPanelDragging = false; });
            header.addEventListener('pointercancel', () => { isPanelDragging = false; });

            const listDiv = document.getElementById('af-admin-list');
            const snap = await dbMod.getDocs(dbMod.collection(db, 'users'));
            
            listDiv.innerHTML = '';
            snap.forEach(docSnap => {
                const data = docSnap.data();
                const uid = docSnap.id;
                const isSelf = data.username === ADMIN_USERNAME;

                const row = document.createElement('div');
                row.className = 'af-user-row';
                
                const name = document.createElement('span');
                name.textContent = data.username + (data.isBanned ? " (Banned)" : "");
                
                const actions = document.createElement('div');
                actions.className = 'actions';

                const profileBtn = document.createElement('button');
                profileBtn.textContent = "Profile";
                profileBtn.className = 'profile';
                profileBtn.onclick = async () => {
                    alert(`User: ${data.username}\nAuto-Answered: ${data.autoStats || 0}\nAnswers Viewed: ${data.showStats || 0}\nStatus: ${data.isBanned ? 'Banned' : 'Active'}`);
                };

                const banBtn = document.createElement('button');
                if (isSelf) {
                    banBtn.textContent = "Me";
                    banBtn.className = 'disabled';
                    banBtn.disabled = true;
                } else {
                    banBtn.textContent = data.isBanned ? "Unban" : "Ban";
                    banBtn.className = data.isBanned ? 'unban' : 'ban';
                    banBtn.onclick = async () => {
                        await dbMod.updateDoc(dbMod.doc(db, 'users', uid), { isBanned: !data.isBanned });
                        data.isBanned = !data.isBanned;
                        name.textContent = data.username + (data.isBanned ? " (Banned)" : "");
                        banBtn.textContent = data.isBanned ? "Unban" : "Ban";
                        banBtn.className = data.isBanned ? 'unban' : 'ban';
                    };
                }

                const trollBtn = document.createElement('button');
                trollBtn.textContent = "Troll";
                trollBtn.className = 'troll';
                trollBtn.onclick = async () => {
                    const effect = document.getElementById('af-troll-select').value;
                    await dbMod.setDoc(dbMod.doc(db, 'commands', uid), { action: effect, timestamp: Date.now() });
                    trollBtn.textContent = "Sent!";
                    setTimeout(() => trollBtn.textContent = "Troll", 2000);
                };

                actions.appendChild(profileBtn);
                actions.appendChild(banBtn);
                actions.appendChild(trollBtn);
                row.appendChild(name);
                row.appendChild(actions);
                listDiv.appendChild(row);
            });
        };
    }

    // ==========================================
    // 10. START
    // ==========================================
    initAuth();

})();
