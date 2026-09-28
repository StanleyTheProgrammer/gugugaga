(function() {
  if (document.getElementById('aqp')) {
    document.getElementById('aqp').remove();
    return;
  }

  const s = document.createElement('style');
  s.textContent = `
    #aqp{position:fixed;bottom:16px;right:16px;z-index:2147483647;width:calc(100vw - 32px);max-width:260px;background:#252526;border:1px solid #3c3c3c;border-radius:8px;font-family:-apple-system,"Segoe UI",Roboto,sans-serif;font-size:13px;color:#cccccc;box-shadow:0 6px 20px rgba(0,0,0,0.5);user-select:none;-webkit-user-select:none;touch-action:none}
    #aqp .bar{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#2d2d30;border-bottom:1px solid #3c3c3c;border-radius:8px 8px 0 0;cursor:move;touch-action:none}
    #aqp .bar span{font-size:13px;color:#cccccc;font-weight:500;pointer-events:none}
    #aqp .bar b{background:none;border:none;color:#858585;font-size:18px;cursor:pointer;padding:0 4px;line-height:1;touch-action:manipulation}
    #aqp .bar b:hover{color:#ffffff}
    #aqp .body{padding:12px}
    #aqp button.go{width:100%;padding:11px;background:#0e639c;color:#ffffff;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-family:inherit;touch-action:manipulation}
    #aqp button.go:hover{background:#1177bb}
    #aqp button.go:active{background:#0a4d7a}
    #aqp .out{margin-top:10px;padding:10px;background:#1e1e1e;border:1px solid #3c3c3c;border-radius:6px;font-family:Consolas,Menlo,monospace;font-size:12px;color:#d4d4d4;word-break:break-all;line-height:1.5;display:none;max-height:150px;overflow-y:auto;-webkit-overflow-scrolling:touch}
    #aqp .out.show{display:block}
    #aqp .out .lbl{color:#858585;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px}
    #aqp .out .val{color:#4ec9b0}
  `;
  document.head.appendChild(s);

  const g = document.createElement('div');
  g.id = 'aqp';
  g.innerHTML = '<div class="bar" id="aqp-bar"><span>Aplus Helper</span><b id="aqp-x">&times;</b></div><div class="body"><button class="go" id="aqp-go">Show Answer</button><div class="out" id="aqp-out"></div></div>';
  document.body.appendChild(g);

  let drag = false, ox = 0, oy = 0;
  const bar = document.getElementById('aqp-bar');

  function startDrag(x, y) {
    drag = true;
    const r = g.getBoundingClientRect();
    ox = x - r.left;
    oy = y - r.top;
    g.style.right = 'auto';
    g.style.bottom = 'auto';
    g.style.left = r.left + 'px';
    g.style.top = r.top + 'px';
  }
  function moveDrag(x, y) {
    if (!drag) return;
    let nx = x - ox, ny = y - oy;
    nx = Math.max(0, Math.min(window.innerWidth - g.offsetWidth, nx));
    ny = Math.max(0, Math.min(window.innerHeight - g.offsetHeight, ny));
    g.style.left = nx + 'px';
    g.style.top = ny + 'px';
  }
  function endDrag() { drag = false; }

  bar.addEventListener('mousedown', function(e) {
    if (e.target.id === 'aqp-x') return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  });
  document.addEventListener('mousemove', function(e) {
    if (!drag) return;
    e.preventDefault();
    moveDrag(e.clientX, e.clientY);
  });
  document.addEventListener('mouseup', endDrag);

  bar.addEventListener('touchstart', function(e) {
    if (e.target.id === 'aqp-x') return;
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  }, { passive: true });
  document.addEventListener('touchmove', function(e) {
    if (!drag) return;
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
  }, { passive: true });
  document.addEventListener('touchend', endDrag);

  function scan() {
    try {
      const app = document.getElementById('app');
      if (!app || !app.__vue__) return null;
      function walk(o, d) {
        if (!o || typeof o !== 'object' || d > 15) return null;
        if (o.__ob__) return null;
        if (o.currentQuestion && o.currentQuestion.childQuestions) {
          const a = o.currentQuestion.childQuestions.map(q => q.questionAnswer).filter(Boolean);
          if (a.length) return a;
        }
        if (o.childQuestions && Array.isArray(o.childQuestions)) {
          const a = o.childQuestions.map(q => q.questionAnswer).filter(Boolean);
          if (a.length) return a;
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

  document.getElementById('aqp-go').addEventListener('click', function() {
    const out = document.getElementById('aqp-out');
    const a = scan();
    if (!a) {
      out.innerHTML = '<div class="lbl">Result</div><div>No answer found on this page.</div>';
    } else {
      out.innerHTML = '<div class="lbl">Answer</div><div class="val">' + a.join(' &nbsp;·&nbsp; ') + '</div>';
    }
    out.classList.add('show');
  });

  document.getElementById('aqp-x').addEventListener('click', function() {
    g.remove();
  });
})();
