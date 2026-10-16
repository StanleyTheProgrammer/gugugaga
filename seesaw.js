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

    // ---------- 2. Fill and sync ----------
    function fillCanvas() {
        const fc = window.__fabricInstance;
        if (!fc) return false;

        let fixed = 0;
        fc.getObjects().forEach(obj => {
            if (obj.type !== 'textbox') return;
            if (obj.__answered) return;
            const text = obj.text || '';
            const m = text.match(/^(\d+)\s*[x×]\s*(\d+)\s*=\s*_+/);
            if (!m) return;
            const a = parseInt(m[1], 10);
            const b = parseInt(m[2], 10);
            obj.set('text', a + ' x ' + b + ' = ' + (a * b));
            obj.set('dirty', true);
            obj.__answered = true;
            fixed++;
        });

        if (fixed) {
            fc.renderAll();
            // Fire events so Seesaw's internal state syncs before save
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

    // ---------- 3. Kick off ----------
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
            clearInterval(fiv);
            window.__seesawRunning = false;
            console.log('[seesaw] done + synced');
        }
    }, 500);
})();
