// aplus-helper.js
(function () {
    'use strict';
    const resp = prompt("Do you want to test the auto answer feature? (Only mc and input) (yes or no)")
    if (resp === "yes") {
        //ok
    } else {

    }
    function init() {
        if (document.getElementById('aqp')) {
            document.getElementById('aqp').remove();
            return;
        }

        const css = `
            #aqp{position:fixed;bottom:24px;right:24px;z-index:2147483647;width:260px;background:#252526;border:1px solid #3c3c3c;border-radius:6px;font-family:-apple-system,"Segoe UI",Roboto,sans-serif;font-size:12px;color:#cccccc;box-shadow:0 4px 16px rgba(0,0,0,0.4);user-select:none}
            #aqp .bar{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#2d2d30;border-bottom:1px solid #3c3c3c;border-radius:6px 6px 0 0;cursor:move;touch-action:none}
            #aqp .bar span{font-size:12px;color:#cccccc;font-weight:500;pointer-events:none}
            #aqp .bar b{background:none;border:none;color:#858585;font-size:16px;cursor:pointer;padding:0 4px;line-height:1}
            #aqp .bar b:hover{color:#ffffff}
            #aqp .body{padding:10px}
            #aqp button.go{width:100%;padding:7px;background:#0e639c;color:#ffffff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-family:inherit;transition:background .1s}
            #aqp button.go:hover{background:#1177bb}
            #aqp button.go:active{background:#0a4d7a}
            #aqp .out{margin-top:8px;padding:8px;background:#1e1e1e;border:1px solid #3c3c3c;border-radius:4px;font-family:Consolas,Menlo,monospace;font-size:11px;color:#d4d4d4;word-break:break-all;line-height:1.4;display:none;max-height:180px;overflow-y:auto}
            #aqp .out.show{display:block}
            #aqp .out .lbl{color:#858585;font-size:10px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
            #aqp .out .val{color:#4ec9b0}
            #aqp .out .err{color:#f48771}
            #aqp .ans-row{padding:4px 0;border-bottom:1px solid #2a2a2a}
            #aqp .ans-row:last-child{border-bottom:none}
            #aqp .ans-q{color:#858585;margin-right:6px}
            #aqp .frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 2px;line-height:1.1;color:#4ec9b0;font-family:Georgia,"Times New Roman",serif}
            #aqp .frac .num{padding:0 4px}
            #aqp .frac .den{padding:0 4px;border-top:1px solid #4ec9b0}
        `;
        const s = document.createElement('style');
        s.id = 'aqp-style';
        s.textContent = css;
        document.head.appendChild(s);

        const g = document.createElement('div');
        g.id = 'aqp';
        g.innerHTML =
            '<div class="bar" id="aqp-bar">' +
                '<span>Aplus Helper</span>' +
                '<b id="aqp-x">&times;</b>' +
            '</div>' +
            '<div class="body">' +
                '<button class="go" id="aqp-go">Show Answer</button>' +
                '<div class="out" id="aqp-out"></div>' +
            '</div>';
        document.body.appendChild(g);

        // --- drag (pointer events — mouse + touch + iPad) ---
        let drag = false, ox = 0, oy = 0;
        const bar = document.getElementById('aqp-bar');

        bar.addEventListener('pointerdown', function (e) {
            if (e.target.id === 'aqp-x') return;
            e.preventDefault();
            drag = true;
            ox = e.clientX;
            oy = e.clientY;
            const r = g.getBoundingClientRect();
            g.style.right = 'auto';
            g.style.bottom = 'auto';
            g.style.left = r.left + 'px';
            g.style.top = r.top + 'px';
            try { bar.setPointerCapture(e.pointerId); } catch (err) {}
        });

        bar.addEventListener('pointermove', function (e) {
            if (!drag) return;
            e.preventDefault();
            const dx = e.clientX - ox;
            const dy = e.clientY - oy;
            const r = g.getBoundingClientRect();
            let nx = r.left + dx;
            let ny = r.top + dy;
            nx = Math.max(0, Math.min(window.innerWidth - g.offsetWidth, nx));
            ny = Math.max(0, Math.min(window.innerHeight - g.offsetHeight, ny));
            g.style.left = nx + 'px';
            g.style.top = ny + 'px';
            ox = e.clientX;
            oy = e.clientY;
        });

        bar.addEventListener('pointerup', function () { drag = false; });
        bar.addEventListener('pointercancel', function () { drag = false; });

        // --- scan ---
        function scan() {
            try {
                const app = document.getElementById('app');
                if (!app || !app.__vue__) return { ok: false, msg: 'No Vue app found.' };

                function walk(o, d) {
                    if (!o || typeof o !== 'object' || d > 15) return null;
                    if (o.__ob__) return null;

                    if (o.currentQuestion && o.currentQuestion.childQuestions) {
                        const p = o.currentQuestion.childQuestions
                            .filter(q => q.questionAnswer)
                            .map(q => ({ qNo: q.questionNo, ans: q.questionAnswer }));
                        if (p.length) return p;
                    }
                    if (o.childQuestions && Array.isArray(o.childQuestions)) {
                        const p = o.childQuestions
                            .filter(q => q.questionAnswer)
                            .map(q => ({ qNo: q.questionNo, ans: q.questionAnswer }));
                        if (p.length) return p;
                    }
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

                const a = walk(app.__vue__, 0);
                if (!a) return { ok: false, msg: 'No answer found on this page.' };
                return { ok: true, ans: a };
            } catch (e) {
                return { ok: false, msg: e.message };
            }
        }

        function esc(s) {
            return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function renderValue(raw) {
            if (Array.isArray(raw)) raw = raw.join(' ; ');
            raw = String(raw);

            const re = /\$\$\s*\\+frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}\s*\$\$/g;
            const parts = [];
            let last = 0, m, found = false;

            while ((m = re.exec(raw)) !== null) {
                found = true;
                parts.push(esc(raw.slice(last, m.index)));
                parts.push(
                    '<span class="frac">' +
                        '<span class="num">' + esc(m[1]) + '</span>' +
                        '<span class="den">' + esc(m[2]) + '</span>' +
                    '</span>'
                );
                last = re.lastIndex;
            }

            if (!found) return esc(raw);
            parts.push(esc(raw.slice(last)));
            return parts.join('');
        }

        document.getElementById('aqp-go').addEventListener('click', function () {
            const out = document.getElementById('aqp-out');
            const r = scan();
            if (r.ok) {
                let h = '<div class="lbl">Answer</div>';
                r.ans.forEach(function (item) {
                    h += '<div class="ans-row">';
                    if (r.ans.length > 1) h += '<span class="ans-q">Q' + item.qNo + '</span>';
                    h += '<span class="val">' + renderValue(item.ans) + '</span>';
                    h += '</div>';
                });
                out.innerHTML = h;
            } else {
                out.innerHTML = '<div class="lbl">Result</div><div class="err">' + esc(r.msg) + '</div>';
            }
            out.classList.add('show');
        });

        document.getElementById('aqp-x').addEventListener('click', function () {
            g.remove();
            const st = document.getElementById('aqp-style');
            if (st) st.remove();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
