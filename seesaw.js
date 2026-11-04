// v2.0.0 — Seesaw math auto-filler (extended)
(function () {
    'use strict';

    if (window.__seesawRunning) {
        console.log('[seesaw] already running');
        return;
    }
    window.__seesawRunning = true;

    // ---------- 1. Hook fabric before the canvas exists ----------
    function installHook() {
        if (typeof window.fabric === 'undefined' || !window.fabric.Canvas) return false;
        if (window.fabric.Canvas.__wrapped) return true;

        const Real = window.fabric.Canvas;
        const proto = Real.prototype;

        function WrappedCanvas(...args) {
            const inst = new Real(...args);
            window.__fabricInstance = inst;
            return inst;
        }
        WrappedCanvas.prototype = proto;
        WrappedCanvas.__wrapped = true;

        const realAdd = proto.add;
        proto.add = function (...a) { window.__fabricInstance = this; return realAdd.apply(this, a); };
        const realRender = proto.renderAll;
        proto.renderAll = function () { window.__fabricInstance = this; return realRender.apply(this); };

        try { window.fabric.Canvas = WrappedCanvas; } catch (e) {}
        console.log('[seesaw] fabric hooked');
        return true;
    }

    // ---------- 2. Math helpers ----------
    function gcd(a, b) {
        a = Math.abs(a); b = Math.abs(b);
        while (b) { const t = b; b = a % b; a = t; }
        return a;
    }
    function lcm(a, b) {
        if (a === 0 || b === 0) return 0;
        return Math.abs(a * b) / gcd(a, b);
    }

    // ---------- 3. Detect HCF/LCM mode from page text ----------
    // Cache result so we don't re-scan every tick
    let __modeCache = null;
    function detectMode() {
        if (__modeCache) return __modeCache;
        // Look at all textboxes' text + the DOM body text
        const fc = window.__fabricInstance;
        let allText = document.body ? document.body.innerText : '';
        if (fc) {
            fc.getObjects().forEach(o => {
                if (o.text) allText += ' ' + o.text;
            });
        }
        const hasHCF = /\bH\.?\s*C\.?\s*F\.?\b|\bHCF\b|\bG\.?\s*C\.?\s*D\.?\b|\bGCD\b/i.test(allText);
        const hasLCM = /\bL\.?\s*C\.?\s*M\.?\b|\bLCM\b/i.test(allText);
        if (hasHCF) __modeCache = 'hcf';
        else if (hasLCM) __modeCache = 'lcm';
        else __modeCache = null;
        return __modeCache;
    }

    // ---------- 4. Solve one textbox ----------
    function solveTextbox(obj) {
        const text = obj.text || '';

        // Mode 1: HCF/LCM pattern "15, 60 :" or "15, 60:" or "15, 60 : ___"
        const mode = detectMode();
        if (mode) {
            const m = text.match(/^\s*(\d+)\s*,\s*(\d+)\s*:?\s*_*\s*$/);
            if (m) {
                const a = parseInt(m[1], 10);
                const b = parseInt(m[2], 10);
                const result = mode === 'hcf' ? gcd(a, b) : lcm(a, b);
                return a + ', ' + b + ' : ' + result;
            }
        }

        // Mode 2: original "a × b = ___" + extended operators
        const m2 = text.match(/^\s*(\d+)\s*([+\-×x*÷\/])\s*(\d+)\s*=\s*_+/);
        if (m2) {
            const a = parseInt(m2[1], 10);
            const op = m2[2];
            const b = parseInt(m2[3], 10);
            let result;
            if (op === '+') result = a + b;
            else if (op === '-') result = a - b;
            else if (op === '×' || op === 'x' || op === '*') result = a * b;
            else if (op === '÷' || op === '/') result = b === 0 ? 'undefined' : (a / b);
            return a + ' ' + op + ' ' + b + ' = ' + result;
        }

        // Mode 3: reversed "___ = a × b"
        const m3 = text.match(/^\s*_+\s*=\s*(\d+)\s*([+\-×x*÷\/])\s*(\d+)\s*$/);
        if (m3) {
            const a = parseInt(m3[1], 10);
            const op = m3[2];
            const b = parseInt(m3[3], 10);
            let result;
            if (op === '+') result = a + b;
            else if (op === '-') result = a - b;
            else if (op === '×' || op === 'x' || op === '*') result = a * b;
            else if (op === '÷' || op === '/') result = b === 0 ? 'undefined' : (a / b);
            return result + ' = ' + a + ' ' + op + ' ' + b;
        }

        return null;
    }

    // ---------- 5. Fill and sync ----------
    function fillCanvas() {
        const fc = window.__fabricInstance;
        if (!fc) return false;

        let fixed = 0;
        fc.getObjects().forEach(obj => {
            if (obj.type !== 'textbox') return;
            if (obj.__answered) return;
            const solved = solveTextbox(obj);
            if (solved === null) return;
            obj.set('text', solved);
            obj.set('dirty', true);
            obj.__answered = true;
            fixed++;
            console.log('[seesaw] filled:', JSON.stringify(obj.text));
        });

        if (fixed) {
            fc.renderAll();
            try { fc.getObjects().forEach(o => fc.fire('object:modified', { target: o })); } catch (e) {}
            const upper = document.querySelector('.upper-canvas');
            if (upper) {
                ['mousedown', 'mouseup', 'mousemove'].forEach(type => {
                    upper.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }));
                });
            }
            console.log('[seesaw] filled ' + fixed + ' + synced');
            return true;
        }
        return false;
    }

    // ---------- 6. Kick off ----------
    if (!installHook()) {
        let t = 0;
        const iv = setInterval(() => {
            if (installHook() || ++t > 100) clearInterval(iv);
        }, 100);
    }

    let ft = 0;
    const fiv = setInterval(() => {
        if (!window.__fabricInstance) {
            if (++ft > 240) {
                clearInterval(fiv);
                console.log('[seesaw] gave up — no canvas after 2 min');
            }
            return;
        }
        if (fillCanvas()) {
            // Don't stop — keep watching for new questions (Seesaw sometimes lazy-loads)
            // Only stop after 30 seconds of no new fills
            if (!window.__seesawIdle) {
                window.__seesawIdle = setTimeout(() => {
                    clearInterval(fiv);
                    window.__seesawRunning = false;
                    console.log('[seesaw] idle — done');
                }, 30000);
            }
        } else if (window.__seesawIdle) {
            // reset idle timer if still nothing to fill
        }
    }, 500);
})();
