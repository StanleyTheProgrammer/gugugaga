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
    function getQuestion() {
        try {
            const app = document.getElementById('app');
            if (!app || !app.__vue__) return null;

            function walk(o, d) {
                if (!o || typeof o !== 'object' || d > 15) return null;
                if (o.__ob__) return null;

                if (o.currentQuestion && o.currentQuestion.childQuestions) {
                    return o.currentQuestion;
                }
                if (o.currentQuestion && o.currentQuestion.questionId) {
                    return o.currentQuestion;
                }
                if (o.childQuestions && Array.isArray(o.childQuestions)) {
                    return o;
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

    function getQuestionKey(q) {
        if (!q) return null;
        if (q.questionId) return q.questionId;
        if (q.childQuestions) return JSON.stringify(q.childQuestions.map(x => x.questionAnswer));
        return null;
    }

    // ---------- 2. Fill text inputs (inside current question only) ----------
    function fillInputs(q) {
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

    // ---------- 3. Click MC options (per ul group) ----------
    function clickChoices(q) {
        const card = document.querySelector('.practice_base_topic_card') || document;
        const groups = card.querySelectorAll('ul.TEXT, ul.MATH, ul.CHINESE, ul.ENGLISH');
        if (!groups.length) return 0;

        // Flatten all answers from childQuestions
        const answers = (q.childQuestions || [])
            .filter(c => c.questionAnswer)
            .map(c => {
                let raw = c.questionAnswer;
                if (Array.isArray(raw)) raw = raw[0];
                return { raw: String(raw), child: c };
            });

        let clicked = 0;

        for (let gi = 0; gi < groups.length; gi++) {
            const ul = groups[gi];
            const items = ul.querySelectorAll('li[class*="optionNumOneRaw"]');
            if (!items.length) continue;

            // Pick the answer for this group — if there are fewer answers than
            // groups, reuse the last one (some questions render the same choice set
            // once per blank)
            const a = answers[gi] || answers[answers.length - 1];
            if (!a) continue;

            let targetLetter = null;
            let targetText = null;
            const raw = a.raw;

            if (raw) {
                const m = raw.match(/^\s*([A-Z])\b/);
                if (m) targetLetter = m[1];
                else if (/^[A-Z]$/.test(raw.trim())) targetLetter = raw.trim();
                else targetText = raw;
            }

            // Try the child's own options for a correct flag
            if (!targetLetter && a.child && a.child.options) {
                const correct = a.child.options.find(o => o.correct || o.isCorrect);
                if (correct && correct.optionNo) targetLetter = correct.optionNo;
                else if (correct && correct.optionContent) targetText = correct.optionContent;
            }

            let matched = null;

            // Match by letter
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

            // Fall back to text
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
        const q = getQuestion();
        if (!q) return;

        const key = getQuestionKey(q);
        if (!key || key === lastKey) return;
        lastKey = key;

        // Clear stale marks from previous question
        document.querySelectorAll('[data-autofilled="1"]').forEach(el => {
            el.removeAttribute('data-autofilled');
            el.style.outline = '';
        });

        const inputsFilled = fillInputs(q);
        const choicesClicked = clickChoices(q);

        if (inputsFilled || choicesClicked) {
            console.log(`[autofill] ${inputsFilled} input(s), ${choicesClicked} choice(s)`);
        }
    }

    // ---------- 5. Start loop ----------
    const intervalId = setInterval(tick, POLL_MS);

    window.__aplusAutofillStop = function () {
        clearInterval(intervalId);
        window.__aplusAutofillRunning = false;
        console.log('[autofill] stopped');
    };

    console.log('[autofill] running — polls every ' + POLL_MS + 'ms');
})();
