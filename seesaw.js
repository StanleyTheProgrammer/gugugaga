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

    // ---------- 2. Rewrite each question textbox ----------
    function fillCanvas() {
        const fc = window.__fabricInstance;
        if (!fc) return false;

        const objects = fc.getObjects();
        let fixed = 0;

        objects.forEach(obj => {
            if (obj.type !== 'textbox') return;
            if (obj.__answered) return;
            const text = obj.text || '';
            const m = text.match(/^(\d+)\s*[x×]\s*(\d+)\s*=\s*_+/);
            if (!m) return;

            const a = parseInt(m[1], 10);
            const b = parseInt(m[2], 10);
            const answer = a * b;

            obj.set('text', a + ' x ' + b + ' = ' + answer);
            obj.set('dirty', true);
            obj.__answered = true;
            fixed++;
        });

        if (fixed > 0) {
            fc.renderAll();
            console.log('[seesaw] filled ' + fixed + ' questions');
            return true;
        }

        // If questions aren't loaded yet, keep polling
        return false;
    }

    // ---------- 3. Kick off ----------
    if (!installHook()) {
        let tries = 0;
        const iv = setInterval(() => {
            if (installHook() || ++tries > 100) clearInterval(iv);
        }, 100);
    }

    let fillTries = 0;
    const fillIv = setInterval(() => {
        if (!window.__fabricInstance) {
            if (++fillTries > 240) {
                clearInterval(fillIv);
                console.log('[seesaw] gave up — no canvas after 2 min');
            }
            return;
        }
        const done = fillCanvas();
        if (done) {
            clearInterval(fillIv);
            console.log('[seesaw] done');
            window.__seesawRunning = false;
        }
    }, 500);
})();
