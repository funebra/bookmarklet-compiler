javascript:(function(){
  const NS = '__FUNEBRA_WATCH_BN3';
  if(window[NS]){ window[NS].toggleUI(); return; }

  // Canonical Funebra Watch Parameters
  const HOUR_COUNT = 12;
  const MINUTE_COUNT = 60;
  const MAIN_RADIUS = 120;
  const SHIFT_CLOCK_ANGLE = 45;

  let rafId = null;
  const state = {
    running: false,
    paused: false
  };

  const stage = document.createElement('div');
  stage.className = 'fb-ns-watch-root';
  stage.style.cssText = 'position:fixed;top:20px;right:20px;width:300px;height:320px;background:rgba(10,12,20,0.92);backdrop-filter:blur(8px);border:1px solid #00e5ff44;border-radius:14px;z-index:999999;box-shadow:0 12px 32px rgba(0,0,0,0.7);font-family:monospace;';

  const header = document.createElement('div');
  header.style.cssText = 'color:#00e5ff;font-size:10px;text-align:center;padding:8px 0 4px;letter-spacing:1px;font-weight:bold;';
  header.innerText = 'FUNEBRA WATCH BN3 (CANONICAL)';
  stage.appendChild(header);

  const canvas = document.createElement('div');
  canvas.style.cssText = 'position:relative;width:100%;height:240px;';
  stage.appendChild(canvas);

  const ctrlBar = document.createElement('div');
  ctrlBar.style.cssText = 'display:flex;gap:6px;padding:8px 12px;border-top:1px solid #1a2030;';
  ctrlBar.innerHTML = `
    <button data-action="toggle-pause" style="background:#1a2638;color:#00e5ff;border:1px solid #00e5ff44;padding:4px 8px;border-radius:4px;cursor:pointer;flex:1;font-size:10px;">Pause</button>
    <button data-action="close" style="background:#ff174422;color:#ff1744;border:1px solid #ff174444;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:10px;">X</button>
  `;
  stage.appendChild(ctrlBar);
  document.body.appendChild(stage);

  function makeRing(count, color, radius, pointSize) {
    const nodes = [];
    for(let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;width:${pointSize}px;height:${pointSize}px;background:${color};border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);`;
      canvas.appendChild(el);
      nodes.push({el, rad: radius, angle: (i / count) * Math.PI * 2});
    }
    return nodes;
  }

  function makeHand(color, thickness) {
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;height:${thickness}px;background:${color};transform-origin:0 0;top:50%;left:50%;border-radius:2px;`;
    canvas.appendChild(el);
    return el;
  }

  const minuteRing = makeRing(MINUTE_COUNT, '#333355', MAIN_RADIUS, 2);
  const hourRing = makeRing(HOUR_COUNT, '#00e5ff', MAIN_RADIUS, 6);

  const hourHand = makeHand('#00e5ff', 4);
  const minHand = makeHand('#76ff03', 2);
  const secHand = makeHand('#ff1744', 1);

  let angleX = (SHIFT_CLOCK_ANGLE * Math.PI) / 180;
  let angleY = 0.2;

  function project(x, y, z) {
    let y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
    let z1 = y * Math.sin(angleX) + z * Math.cos(angleX);
    let x2 = x * Math.cos(angleY) + z1 * Math.sin(angleY);
    let z2 = -x * Math.sin(angleY) + z1 * Math.cos(angleY);
    let scale = 180 / (260 + z2);
    return { px: x2 * scale, py: y1 * scale, scale, z: z2 };
  }

  function render(){
    if(!state.running) return;

    if(!state.paused){
      const now = new Date();
      const ms = now.getMilliseconds();
      const sec = now.getSeconds() + ms / 1000;
      const min = now.getMinutes() + sec / 60;
      const hr = (now.getHours() % 12) + min / 60;

      angleY += 0.003;

      minuteRing.forEach(pt => {
        let x = Math.cos(pt.angle) * pt.rad;
        let z = Math.sin(pt.angle) * pt.rad;
        let p = project(x, 0, z);
        pt.el.style.transform = `translate(${p.px}px, ${p.py}px) scale(${p.scale})`;
        pt.el.style.opacity = (p.z + 150) / 300;
      });

      hourRing.forEach(pt => {
        let x = Math.cos(pt.angle) * pt.rad;
        let z = Math.sin(pt.angle) * pt.rad;
        let p = project(x, 0, z);
        pt.el.style.transform = `translate(${p.px}px, ${p.py}px) scale(${p.scale})`;
        pt.el.style.opacity = (p.z + 150) / 300;
      });

      function drawHand(handEl, angleVal, length) {
        let radAngle = angleVal - Math.PI / 2;
        let hx = Math.cos(radAngle) * length;
        let hz = Math.sin(radAngle) * length;
        let p0 = project(0, 0, 0);
        let p1 = project(hx, 0, hz);

        let dx = p1.px - p0.px;
        let dy = p1.py - p0.py;
        let dist = Math.hypot(dx, dy);
        let rot = Math.atan2(dy, dx);

        handEl.style.left = `calc(50% + ${p0.px}px)`;
        handEl.style.top = `calc(50% + ${p0.py}px)`;
        handEl.style.width = dist + 'px';
        handEl.style.transform = `rotate(${rot}rad)`;
      }

      drawHand(hourHand, (hr / 12) * Math.PI * 2, MAIN_RADIUS * 0.55);
      drawHand(minHand, (min / 60) * Math.PI * 2, MAIN_RADIUS * 0.80);
      drawHand(secHand, (sec / 60) * Math.PI * 2, MAIN_RADIUS * 0.95);
    }

    if(state.running && !state.paused){
      rafId = requestAnimationFrame(render);
    }
  }

  function syncPauseButton(){
    const btn = stage.querySelector('[data-action="toggle-pause"]');
    if(btn) btn.innerText = state.paused ? 'Resume' : 'Pause';
  }

  // Locally Scoped Event Listeners
  stage.querySelector('[data-action="toggle-pause"]').onclick = function(){
    if(state.paused) controller.resume();
    else controller.pause();
  };

  stage.querySelector('[data-action="close"]').onclick = function(){
    controller.destroy();
  };

  // Full Explicit Controller API Implementation
  const controller = {
    start: () => {
      if(!state.running){
        state.running = true;
        state.paused = false;
        syncPauseButton();
        render();
      }
    },
    pause: () => {
      if(state.running && !state.paused){
        state.paused = true;
        if(rafId !== null){
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        syncPauseButton();
      }
    },
    resume: () => {
      if(state.running && state.paused){
        state.paused = false;
        syncPauseButton();
        render();
      } else if(!state.running){
        controller.start();
      }
    },
    toggleUI: () => {
      stage.style.display = (stage.style.display === 'none') ? 'block' : 'none';
    },
    destroy: () => {
      state.running = false;
      if(rafId) cancelAnimationFrame(rafId);
      stage.remove();
      delete window[NS];
    }
  };

  window[NS] = controller;
  controller.start();
})();

