// aplus-autofill.js
(function () {
    'use strict';

    if (window.__aplusAutofillRunning) {
        console.log('[autofill] already running');
        return;
    }
    window.__aplusAutofillRunning = true;

    const POLL_MS = 800;
    let lastKey = null;

    // ---------- 1. Find current question data ----------
    function getAnswers() {
        try {
            const app = document.getElementById('app');
            if (!app || !app.__vue__) return null;

            function walk(o, d) {
                if (!o || typeof o !== 'object' || d > 15) return null;
                if (o.__ob__) return null;

                if (o.currentQuestion && o.currentQuestion.childQuestions) {
                    const list = o.currentQuestion.childQuestions
                        .filter(q => q.questionAnswer)
                        .map(q => ({
                            qNo: q.questionNo,
                            ans: q.questionAnswer,
                            options: q.options || null
                        }));
                    if (list.length) return { key: o.currentQuestion.questionId || JSON.stringify(list), list };
                }
                if (o.childQuestions && Array.isArray(o.childQuestions)) {
                    const list = o.childQuestions
                        .filter(q => q.questionAnswer)
                        .map(q => ({
                            qNo: q.questionNo,
                            ans: q.questionAnswer,
                            options: q.options || null
                        }));
                    if (list.length) return { key: JSON.stringify(list), list };
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

            return walk(app.__vue__, 0);
        } catch (e) {
            return null;
        }
    }

    // ---------- 2. Fill text inputs ----------
    function fillInputs(answers) {
        const inputs = document.querySelectorAll('textarea.ant-input');
        if (!inputs.length) return 0;

        let filled = 0;
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const a = answers[i];
            if (!a) break;

            let val = a.ans;
            if (Array.isArray(val)) val = val[0];
            if (typeof val !== 'string') val = String(val);

            // Skip if already filled with the same value
            if (input.value === val) continue;

            input.focus();
            input.value = val;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.blur();

            input.style.outline = '2px solid #4ec9b0';
            filled++;
        }
        return filled;
    }

    // ---------- 3. Click MC options ----------
    function clickChoices(answers) {
        const groups = document.querySelectorAll('ul.TEXT, ul.MATH, ul.CHINESE, ul.ENGLISH');
        if (!groups.length) return 0;

        let clicked = 0;

        for (let gi = 0; gi < groups.length; gi++) {
            const ul = groups[gi];
            const items = ul.querySelectorAll('li.optionNumOneRaw1');
            if (!items.length) continue;

            const a = answers[gi];
            if (!a) continue;

            let targetLetter = null;
            let targetText = null;

            const raw = Array.isArray(a.ans) ? a.ans[0] : a.ans;
            if (typeof raw === 'string') {
                const m = raw.match(/^\s*([A-Z])\b/);
                if (m) targetLetter = m[1];
                else if (/^[A-Z]$/.test(raw.trim())) targetLetter = raw.trim();
                else targetText = raw;
            }

            if (!targetLetter && a.options) {
                const correct = a.options.find(o => o.correct || o.isCorrect);
                if (correct && correct.optionNo) targetLetter = correct.optionNo;
                else if (correct && correct.optionContent) targetText = correct.optionContent;
            }

            let matched = null;

            if (targetLetter) {
                for (const li of items) {
                    const label = li.querySelector('.label span');
                    if (!label) continue;
                    const txt = label.textContent.replace(/\s|&nbsp;/g, '');
                    if (txt === targetLetter + '.') {
                        matched = li;
                        break;
                    }
                }
            }

            if (!matched && targetText) {
                for (const li of items) {
                    const con = li.querySelector('.con span');
                    if (!con) continue;
                    const txt = con.textContent.trim();
                    if (txt === targetText || txt.includes(targetText) || targetText.includes(txt)) {
                        matched = li;
                        break;
                    }
                }
            }

            if (matched) {
                // Skip if already selected — many UIs mark selection with a class
                // If the site doesn't mark it, this will re-click; guard with dataset
                if (matched.dataset.autofilled === '1') continue;

                matched.click();
                matched.dataset.autofilled = '1';
                matched.style.outline = '2px solid #4ec9b0';
                clicked++;
            }
        }

        return clicked;
    }

    // ---------- 4. Tick ----------
    function tick() {
        const found = getAnswers();
        if (!found) return;

        // Only run when the question identity changes
        if (found.key === lastKey) return;
        lastKey = found.key;

        // Clear stale "autofilled" marks from previous question
        document.querySelectorAll('[data-autofilled="1"]').forEach(el => {
            el.removeAttribute('data-autofilled');
            el.style.outline = '';
        });

        const inputsFilled = fillInputs(found.list);
        const choicesClicked = clickChoices(found.list);

        if (inputsFilled || choicesClicked) {
            console.log(`[autofill] ${inputsFilled} input(s), ${choicesClicked} choice(s)`);
        }
    }

    // ---------- 5. Start loop ----------
    setInterval(tick, POLL_MS);

    // Stop method (call window.__aplusAutofillStop() from console to kill it)
    const intervalId = setInterval(() => {}, POLL_MS); // just to keep a handle
    window.__aplusAutofillStop = function () {
        clearInterval(intervalId);
        window.__aplusAutofillRunning = false;
        console.log('[autofill] stopped');
    };

    console.log('[autofill] running — polls every ' + POLL_MS + 'ms');
})();
