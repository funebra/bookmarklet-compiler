javascript:(() => {
  "use strict";

  const NAMESPACE = "__FUNEBRA_NS_REPLACE_WITH_ENTRY_NAME";
  const previous = window[NAMESPACE];
  if (previous && typeof previous.destroy === "function") previous.destroy();

  const POINT_COUNT = 48;
  const state = {
    running: false,
    paused: false,
    uiVisible: true,
    angle: 0
  };

  let rafId = null;
  let host = null;
  let scene = null;
  let controls = null;
  let pauseButton = null;
  const points = [];
  const nodes = [];

  function buildPoints() {
    if (points.length) return;
    for (let i = 0; i < POINT_COUNT; i += 1) {
      const t = (i / POINT_COUNT) * Math.PI * 2;
      points.push({
        id: `bn${i + 1}`,
        xyz: [Math.cos(t) * 92, Math.sin(t) * 92, Math.sin(t * 3) * 32],
        phase: t
      });
    }
  }

  function createNode(tag, styles) {
    const node = document.createElement(tag);
    Object.assign(node.style, styles);
    return node;
  }

  function ensureDOM() {
    if (host) return;

    host = createNode("section", {
      position: "fixed",
      right: "24px",
      top: "24px",
      width: "300px",
      height: "340px",
      zIndex: "2147483646",
      background: "#080b14",
      border: "1px solid #00d9ff66",
      borderRadius: "18px",
      boxShadow: "0 18px 50px #0009",
      color: "#00e5ff",
      font: "14px monospace",
      overflow: "hidden"
    });
    host.dataset.funebraNamespace = NAMESPACE;

    scene = createNode("div", {
      position: "absolute",
      left: "50%",
      top: "47%",
      width: "1px",
      height: "1px",
      transformStyle: "preserve-3d"
    });

    controls = createNode("div", {
      position: "absolute",
      left: "12px",
      right: "12px",
      bottom: "12px",
      display: "flex",
      gap: "8px"
    });

    pauseButton = createNode("button", {
      flex: "1",
      padding: "7px",
      border: "1px solid #00d9ff88",
      borderRadius: "6px",
      background: "#132238",
      color: "#00e5ff",
      font: "inherit",
      cursor: "pointer"
    });
    pauseButton.type = "button";
    pauseButton.addEventListener("click", onPauseClick);

    const closeButton = createNode("button", {
      padding: "7px 11px",
      border: "1px solid #ff174466",
      borderRadius: "6px",
      background: "#350817",
      color: "#ff4569",
      font: "inherit",
      cursor: "pointer"
    });
    closeButton.type = "button";
    closeButton.textContent = "×";
    closeButton.addEventListener("click", onDestroyClick);

    controls.append(pauseButton, closeButton);
    host.append(scene, controls);
    document.body.appendChild(host);

    points.forEach((point, index) => {
      const node = createNode("div", {
        position: "absolute",
        width: "6px",
        height: "6px",
        margin: "-3px",
        borderRadius: "50%",
        background: index % 6 === 0 ? "#75ff00" : "#00d9ff",
        boxShadow: "0 0 8px currentColor",
        willChange: "transform, opacity"
      });
      node.id = `${NAMESPACE}-${point.id}`;
      node.dataset.funebraOwned = NAMESPACE;
      scene.appendChild(node);
      nodes.push(node);
    });
  }

  function syncPauseButton() {
    if (pauseButton) pauseButton.textContent = state.paused ? "Resume" : "Pause";
  }

  function render() {
    const cosY = Math.cos(state.angle);
    const sinY = Math.sin(state.angle);

    points.forEach((point, index) => {
      const [x, y, z] = point.xyz;
      const rx = x * cosY - z * sinY;
      const rz = x * sinY + z * cosY;
      const depth = Math.max(120, 420 + rz);
      const scale = 420 / depth;
      const px = rx * scale;
      const py = y * scale;
      const light = Math.max(0.28, Math.min(1, 0.62 + rz / 150));
      const node = nodes[index];
      node.style.transform = `translate(${px}px, ${py}px) scale(${scale})`;
      node.style.opacity = String(light);
      node.style.zIndex = String(Math.round(rz + 200));
    });
  }

  function tick() {
    rafId = null;
    if (!state.running || state.paused) return;
    state.angle += 0.012;
    render();
    if (state.running && !state.paused) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function onPauseClick() {
    if (state.paused) controller.resume();
    else controller.pause();
  }

  function onDestroyClick() {
    controller.destroy();
  }

  const controller = {
    state,

    start: () => {
      if (!document.body) throw new Error("Run this bookmarklet after document.body exists.");
      if (state.running) return controller;
      buildPoints();
      ensureDOM();
      state.running = true;
      state.paused = false;
      state.uiVisible = true;
      host.style.display = "block";
      controls.style.display = "flex";
      syncPauseButton();
      render();
      tick();
      return controller;
    },

    pause: () => {
      if (state.running && !state.paused) {
        state.paused = true;
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        syncPauseButton();
      }
      return controller;
    },

    resume: () => {
      if (state.running && state.paused) {
        state.paused = false;
        syncPauseButton();
        tick();
      } else if (!state.running) {
        controller.start();
      }
      return controller;
    },

    toggleUI: () => {
      if (!state.running) controller.start();
      state.uiVisible = !state.uiVisible;
      controls.style.display = state.uiVisible ? "flex" : "none";
      return controller;
    },

    destroy: () => {
      state.running = false;
      state.paused = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (pauseButton) pauseButton.removeEventListener("click", onPauseClick);
      const closeButton = controls && controls.querySelector("button:last-child");
      if (closeButton) closeButton.removeEventListener("click", onDestroyClick);
      nodes.splice(0).forEach((node) => node.remove());
      if (host) host.remove();
      host = null;
      scene = null;
      controls = null;
      pauseButton = null;
      if (window[NAMESPACE] === controller) delete window[NAMESPACE];
      return controller;
    }
  };

  window[NAMESPACE] = controller;
  controller.start();
})();
