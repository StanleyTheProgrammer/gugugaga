(function () {
    'use strict';
    alert("新版本! \n 已加入: \n 自動答題 (mc, input, dropdown, mc mc, input v2")
    if (document.getElementById('af-root')) {
        document.getElementById('af-root').remove();
        const s = document.getElementById('af-style');
        if (s) s.remove();
        if (window.__afStop) window.__afStop();
        return;
    }

    const POLL_MS = 800;
    let lastKey = null;
    let autoEnabled = false;
    let correctChance = 85;
    let busy = false;

    const css = `
        #af-root {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2147483647;
            width: 224px;
            background: #1c1c1e;
            border: 1px solid #2e2e30;
            border-radius: 10px;
            font-family: -apple-system, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
            font-size: 12px;
            color: #e5e5e7;
            box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45), 0 1px 0 rgba(255,255,255,0.03) inset;
            user-select: none;
            -webkit-user-select: none;
            overflow: hidden;
        }
        #af-root .bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 9px 12px;
            background: #232325;
            border-bottom: 1px solid #2e2e30;
            cursor: move;
            touch-action: none;
        }
        #af-root .bar span {
            font-size: 11.5px;
            font-weight: 600;
            letter-spacing: 0.2px;
            color: #b8b8bd;
            pointer-events: none;
        }
        #af-root .bar b {
            background: none;
            border: none;
            color: #6e6e73;
            font-size: 15px;
            font-weight: 400;
            cursor: pointer;
            padding: 0 2px;
            line-height: 1;
            transition: color 0.12s;
            touch-action: manipulation;
        }
        #af-root .bar b:hover { color: #e5e5e7; }
        #af-root .body { padding: 12px; }
        #af-root .row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        #af-root .label {
            font-size: 12px;
            color: #98989d;
            letter-spacing: 0.1px;
        }
        #af-root .toggle {
            position: relative;
            width: 36px;
            height: 20px;
            background: #333336;
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.15s ease;
            touch-action: manipulation;
            flex-shrink: 0;
        }
        #af-root .toggle.active { background: #0a84ff; }
        #af-root .toggle .knob {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 1px 2px rgba(0,0,0,0.3);
            transition: transform 0.15s ease;
        }
        #af-root .toggle.active .knob { transform: translateX(16px); }
        #af-root .sliderRow {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }
        #af-root .sliderVal {
            font-size: 11.5px;
            color: #e5e5e7;
            font-family: "SF Mono", Consolas, Menlo, monospace;
            font-feature-settings: "tnum";
            min-width: 32px;
            text-align: right;
            letter-spacing: -0.2px;
        }
        #af-root input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            flex: 1;
            height: 3px;
            background: #333336;
            border-radius: 2px;
            outline: none;
            touch-action: manipulation;
        }
        #af-root input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            background: #fff;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4);
            transition: transform 0.1s;
        }
        #af-root input[type="range"]::-webkit-slider-thumb:active {
            transform: scale(1.1);
        }
        #af-root input[type="range"]::-moz-range-thumb {
            width: 14px;
            height: 14px;
            background: #fff;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        #af-root button.act {
            width: 100%;
            padding: 8px;
            background: #333336;
            color: #e5e5e7;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            font-family: inherit;
            letter-spacing: 0.1px;
            transition: background 0.12s;
            touch-action: manipulation;
        }
        #af-root button.act:hover { background: #3d3d40; }
        #af-root button.act:active { background: #2a2a2c; }
        #af-root .out {
            margin-top: 10px;
            padding: 9px 10px;
            background: #161618;
            border: 1px solid #2e2e30;
            border-radius: 6px;
            font-family: "SF Mono", Consolas, Menlo, monospace;
            font-size: 11px;
            color: #d1d1d6;
            word-break: break-all;
            line-height: 1.5;
            display: none;
            max-height: 150px;
            overflow-y: auto;
        }
        #af-root .out.show { display: block; }
        #af-root .out .lbl {
            color: #6e6e73;
            font-size: 9.5px;
            text-transform: uppercase;
            letter-spacing: 0.7px;
            margin-bottom: 5px;
            font-weight: 600;
        }
        #af-root .out .val { color: #30d158; }
        #af-root .out .err { color: #ff453a; }
        #af-root .ans-row {
            padding: 3px 0;
            border-bottom: 1px solid #232325;
        }
        #af-root .ans-row:last-child { border-bottom: none; }
        #af-root .ans-q {
            color: #6e6e73;
            margin-right: 6px;
            font-size: 10.5px;
        }
        #af-root .frac {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            vertical-align: middle;
            margin: 0 2px;
            line-height: 1.05;
            color: #30d158;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 12px;
        }
        #af-root .frac .num { padding: 0 5px; }
        #af-root .frac .den {
            padding: 0 5px;
            border-top: 1px solid #30d158;
        }
    `;
    const styleEl = document.createElement('style');
    styleEl.id = 'af-style';
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

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
            <div class="sliderRow">
                <input type="range" id="af-slider" min="50" max="100" step="1" value="85">
                <span class="sliderVal" id="af-val">85%</span>
            </div>
            <button class="act" id="af-show">Show answer</button>
            <div class="out" id="af-out"></div>
        </div>
    `;
    document.body.appendChild(root);

    const bar = document.getElementById('af-bar');
    const toggle = document.getElementById('af-toggle');
    const slider = document.getElementById('af-slider');
    const sliderVal = document.getElementById('af-val');
    const closeBtn = document.getElementById('af-x');
    const showBtn = document.getElementById('af-show');
    const outEl = document.getElementById('af-out');

    let drag = false, ox = 0, oy = 0;

    bar.addEventListener('pointerdown', function (e) {
        if (e.target.id === 'af-x') return;
        e.preventDefault();
        drag = true;
        ox = e.clientX;
        oy = e.clientY;
        const r = root.getBoundingClientRect();
        root.style.right = 'auto';
        root.style.bottom = 'auto';
        root.style.left = r.left + 'px';
        root.style.top = r.top + 'px';
        try { bar.setPointerCapture(e.pointerId); } catch (err) {}
    });

    bar.addEventListener('pointermove', function (e) {
        if (!drag) return;
        e.preventDefault();
        const dx = e.clientX - ox;
        const dy = e.clientY - oy;
        const r = root.getBoundingClientRect();
        let nx = r.left + dx;
        let ny = r.top + dy;
        nx = Math.max(0, Math.min(window.innerWidth - root.offsetWidth, nx));
        ny = Math.max(0, Math.min(window.innerHeight - root.offsetHeight, ny));
        root.style.left = nx + 'px';
        root.style.top = ny + 'px';
        ox = e.clientX;
        oy = e.clientY;
    });

    bar.addEventListener('pointerup', function () { drag = false; });
    bar.addEventListener('pointercancel', function () { drag = false; });

    function waitFor(fn, timeout, interval) {
        timeout = timeout || 1000;
        interval = interval || 50;
        return new Promise(function (resolve) {
            const start = Date.now();
            (function check() {
                let v;
                try { v = fn(); } catch (e) { v = null; }
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

    function rollCorrect() {
        return Math.random() * 100 < correctChance;
    }

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

    function showAnswer() {
        const q = getQuestion();
        if (!q || !q.childQuestions || !q.childQuestions.length) {
            outEl.innerHTML = '<div class="lbl">Result</div><div class="err">No question found.</div>';
            outEl.classList.add('show');
            return;
        }
        const list = q.childQuestions.filter(c => c.questionAnswer);
        if (!list.length) {
            outEl.innerHTML = '<div class="lbl">Result</div><div class="err">No answer found.</div>';
            outEl.classList.add('show');
            return;
        }
        let html = '<div class="lbl">Answer</div>';
        list.forEach(function (c) {
            html += '<div class="ans-row">';
            if (list.length > 1) {
                html += '<span class="ans-q">Q' + c.questionNo + '</span>';
            }
            html += '<span class="val">' + renderValue(c.questionAnswer) + '</span>';
            html += '</div>';
        });
        outEl.innerHTML = html;
        outEl.classList.add('show');
    }

    function fillInputs(q, forceWrong) {
        const card = document.querySelector('.practice_base_topic_card') || document;
        const inputs = card.querySelectorAll('textarea.ant-input');
        if (!inputs.length) return 0;
        const answers = (q.childQuestions || []).filter(c => c.questionAnswer);
        let filled = 0;
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const a = answers[i];
            if (!a) break;
            let val = a.questionAnswer;
            if (Array.isArray(val)) val = val[0];
            if (typeof val !== 'string') val = String(val);
            if (forceWrong) val = randomWrongText(val);
            if (input.value === val) continue;
            input.focus();
            input.value = val;
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
        const answers = (q.childQuestions || [])
            .filter(c => c.questionAnswer)
            .map(c => {
                let raw = c.questionAnswer;
                if (Array.isArray(raw)) raw = raw.join(';');
                return { raw: String(raw), child: c };
            });
        let clicked = 0;
        for (let gi = 0; gi < groups.length; gi++) {
            const ul = groups[gi];
            if (ul.classList.contains('options_box')) continue;
            if (ul.closest('.select_component')) continue;
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
                    raw.trim().toUpperCase().split('').forEach(l => targetLetters.push(l));
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
            const allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            const correctIdxs = [];
            targetLetters.forEach(l => {
                const idx = allLetters.indexOf(l.toUpperCase());
                if (idx >= 0) correctIdxs.push(idx);
            });
            let wrongIdxList = [];
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
                    const letterUpper = letter.toUpperCase();
                    let matched = null;
                    for (const li of items) {
                        const label = li.querySelector('.label span');
                        if (!label) continue;
                        const txt = label.textContent.replace(/\s|&nbsp;/g, '');
                        if (txt === letterUpper + '.') { matched = li; break; }
                    }
                    if (!matched) {
                        const idx = letterUpper.charCodeAt(0) - 65;
                        if (idx >= 0 && idx < items.length) matched = items[idx];
                    }
                    if (matched) {
                        if (matched.dataset.autofilled === '1') continue;
                        matched.click();
                        matched.dataset.autofilled = '1';
                        matched.style.outline = '2px solid #30d158';
                        clicked++;
                    }
                }
            }
            for (const wi of wrongIdxList) {
                const li = items[wi];
                if (!li) continue;
                if (li.dataset.autofilled === '1') continue;
                li.click();
                li.dataset.autofilled = '1';
                li.style.outline = '2px solid #ff453a';
                clicked++;
            }
            if (!forceWrong) {
                for (const text of targetTexts) {
                    for (const li of items) {
                        const con = li.querySelector('.con span') || li.querySelector('.con');
                        if (!con) continue;
                        const txt = con.textContent.trim();
                        if (txt === text || txt.includes(text) || text.includes(txt)) {
                            if (li.dataset.autofilled === '1') break;
                            li.click();
                            li.dataset.autofilled = '1';
                            li.style.outline = '2px solid #30d158';
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
        const card = document.querySelector('.practice_base_topic_card') || document;
        const comps = card.querySelectorAll('.select_component');
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
                if (alternatives.length) {
                    letter = alternatives[Math.floor(Math.random() * alternatives.length)];
                }
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
                if (vue && vue.$data && 'flag' in vue.$data) {
                    vue.$data.flag = true;
                    if (vue.$forceUpdate) vue.$forceUpdate();
                } else {
                    const trigger = comp.querySelector('.select_box');
                    if (trigger) trigger.click();
                }
                lis = await waitFor(function () {
                    const o = comp.querySelectorAll('.options_box li');
                    return o.length ? o : null;
                }, 1500, 60);
            }
            if (!lis || !lis.length) continue;
            let target = null;
            for (const li of lis) {
                if (li.textContent.trim() === targetContent) { target = li; break; }
            }
            if (!target) {
                const norm = targetContent.replace(/\s+/g, '');
                for (const li of lis) {
                    if (li.textContent.replace(/\s+/g, '') === norm) { target = li; break; }
                }
            }
            if (!target) continue;
            target.click();
            filled++;
            await new Promise(r => setTimeout(r, 100));
        }
        return filled;
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
                el.removeAttribute('data-autofilled');
                el.style.outline = '';
            });
            const forceWrong = !rollCorrect();
            fillInputs(q, forceWrong);
            clickChoices(q, forceWrong);
            await fillDropdowns(q, forceWrong);
        } finally {
            busy = false;
        }
    }

    toggle.addEventListener('click', function () {
        autoEnabled = !autoEnabled;
        toggle.classList.toggle('active', autoEnabled);
    });

    slider.addEventListener('input', function () {
        correctChance = parseInt(slider.value, 10);
        sliderVal.textContent = correctChance + '%';
    });

    showBtn.addEventListener('click', showAnswer);

    closeBtn.addEventListener('click', function () {
        root.remove();
        styleEl.remove();
        clearInterval(intervalId);
    });

    const intervalId = setInterval(tick, POLL_MS);

    window.__afStop = function () {
        clearInterval(intervalId);
    };
})();
