/* Funebra TextArt 001 — Universal Scene v2.0.0 */
(() => {
  "use strict";

  const SCENE_ID = "funebra-textart001-upgraded";
  const HOST_ID = SCENE_ID + "-host";
  const STORAGE_KEY = SCENE_ID + ".settings";
  const registry = (window.FunebraScenes ??= Object.create(null));

  if (registry[SCENE_ID]?.destroy) {
    registry[SCENE_ID].destroy();
    return;
  }

  document.getElementById(HOST_ID)?.remove();

  const DEFAULT_ART = String.raw`______________________________________________________________________________________________________
__|___|__|___|____|____|___|___|_____|_____|___|_____|_____|___|_____|___|_________|___|__________|___
____|______|_______|__|___|___|____|___|____|____|____|___|___|____|___|___|___|____|______|____|___|_
__|_____|   |_|_____|__|_\  |_____|___|____|__\___    \_____|_____|___|__|__|____|_______|_____|___|__
\  __ \_|   |____\__  \___| __ \__/  ___/_|____|    |  \__/  _ \__/  ___/|  |__/ __ \__/    \__/  ___/
|  |_\ \|   |_|___/ __ \__| \_\ \_\__  \____|__|    |   \\   __/__\__  \_|  |_/ /_/ \|   |\ \_\__  \_
|  ____/|_______\(____  /_|___  //____  \|____/_______  /_\___  //____  \|__|_\___  /_|___|  //____  \
|__|______|____\/__|__\/______\/___|__\/____|_____|___\/______\/___|__\/__|__/_____/______\/___|__\/_
_____|___|__|________|_____|_________|____|_____|____|_____|_________|_____|____|________|________|___`;

  const defaults = {
    text: DEFAULT_ART,
    primary: "#00ff88",
    secondary: "#ff2bd6",
    background: "#050509",
    glow: 14,
    speed: 0.055,
    width: 900,
    height: 360,
    left: null,
    top: null,
    minimized: false,
    editorOpen: false
  };

  function loadSettings() {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch {
      return { ...defaults };
    }
  }

  const settings = loadSettings();
  let memorySettings = { ...settings };

  function saveSettings() {
    memorySettings = { ...settings };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Opaque origins such as a directly opened about:blank keep settings in memory.
    }
  }

  const host = document.createElement("div");
  host.id = HOST_ID;
  Object.assign(host.style, {
    position: "fixed",
    left: settings.left == null ? "50%" : settings.left + "px",
    top: settings.top == null ? "50%" : settings.top + "px",
    transform: settings.left == null ? "translate(-50%, -50%)" : "none",
    zIndex: "2147483647",
    width: Math.max(360, settings.width) + "px",
    height: Math.max(150, settings.height) + "px",
    minWidth: "360px",
    minHeight: "34px",
    maxWidth: "98vw",
    maxHeight: "95vh",
    resize: settings.minimized ? "none" : "both",
    overflow: "hidden",
    pointerEvents: "auto"
  });

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      * { box-sizing: border-box; }
      #shell {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border: 1px solid var(--primary);
        border-radius: 8px;
        background: var(--background);
        box-shadow: 0 0 12px var(--primary), 0 0 34px color-mix(in srgb, var(--primary) 38%, transparent);
      }
      #bar {
        position: relative;
        z-index: 5;
        height: 34px;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 0 7px 0 11px;
        color: var(--primary);
        background: rgba(0,0,0,.88);
        font: 12px/1 "Lucida Console", Monaco, monospace;
        cursor: grab;
        user-select: none;
        touch-action: none;
      }
      #bar:active { cursor: grabbing; }
      #title { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      button {
        min-width: 27px;
        height: 24px;
        border: 1px solid color-mix(in srgb, var(--primary) 55%, transparent);
        border-radius: 4px;
        color: var(--primary);
        background: rgba(0,0,0,.6);
        font: 12px/1 monospace;
        cursor: pointer;
      }
      button:hover { background: color-mix(in srgb, var(--primary) 18%, #000); }
      #body {
        position: relative;
        height: calc(100% - 34px);
        overflow: hidden;
      }
      #viewport {
        position: absolute;
        inset: 0;
        overflow: auto;
        padding: 18px;
      }
      #art {
        position: relative;
        z-index: 2;
        display: inline-block;
        min-width: max-content;
        white-space: pre;
        font: 14px/14px "Lucida Console", Monaco, monospace;
      }
      .bn {
        display: inline;
        font: inherit;
        will-change: color, text-shadow;
      }
      #particles {
        position: absolute;
        inset: 0;
        z-index: 1;
        overflow: hidden;
        pointer-events: none;
      }
      .particle {
        position: absolute;
        bottom: -12px;
        width: var(--size);
        height: var(--size);
        border-radius: 50%;
        background: var(--particle-color);
        box-shadow: 0 0 5px var(--particle-color), 0 0 12px var(--particle-color);
        opacity: 0;
        animation: rise var(--duration) linear var(--delay) infinite;
      }
      @keyframes rise {
        0% { transform: translate3d(0, 15px, 0) scale(.4); opacity: 0; }
        15% { opacity: .9; }
        70% { opacity: .6; }
        100% { transform: translate3d(var(--drift), -430px, 0) scale(1.4); opacity: 0; }
      }
      #editor {
        position: absolute;
        z-index: 6;
        inset: 0;
        display: none;
        grid-template-rows: 1fr auto;
        gap: 8px;
        padding: 10px;
        color: #eee;
        background: rgba(5,5,9,.97);
        font: 12px/1.3 "Lucida Console", Monaco, monospace;
      }
      #editor.open { display: grid; }
      textarea {
        width: 100%;
        min-height: 110px;
        resize: none;
        border: 1px solid var(--primary);
        padding: 8px;
        color: #fff;
        background: #09090f;
        font: 12px/14px "Lucida Console", Monaco, monospace;
        white-space: pre;
      }
      #controls { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; }
      label { display: inline-flex; align-items: center; gap: 5px; }
      input[type="color"] { width: 30px; height: 24px; border: 0; padding: 0; background: none; }
      input[type="range"] { width: 90px; }
      #apply { margin-left: auto; min-width: 62px; }
      .minimized #body { display: none; }
    </style>
    <section id="shell">
      <header id="bar">
        <span id="title">Funebra TextArt 001 · v2.0.0</span>
        <button id="pause" title="Pause or resume animation">Ⅱ</button>
        <button id="edit" title="Edit TextArt and palette">✎</button>
        <button id="minimize" title="Minimize or restore">−</button>
        <button id="close" title="Close">×</button>
      </header>
      <div id="body">
        <div id="particles"></div>
        <main id="viewport"><span id="art"></span></main>
        <section id="editor">
          <textarea id="text" spellcheck="false"></textarea>
          <div id="controls">
            <label>Primary <input id="primary" type="color"></label>
            <label>Accent <input id="secondary" type="color"></label>
            <label>Background <input id="background" type="color"></label>
            <label>Glow <input id="glow" type="range" min="0" max="30" step="1"></label>
            <label>Speed <input id="speed" type="range" min="0" max="0.2" step="0.005"></label>
            <button id="reset" type="button">Reset</button>
            <button id="apply" type="button">Apply</button>
          </div>
        </section>
      </div>
    </section>`;

  const shell = shadow.getElementById("shell");
  const art = shadow.getElementById("art");
  const particleLayer = shadow.getElementById("particles");
  const editor = shadow.getElementById("editor");
  const textInput = shadow.getElementById("text");
  const primaryInput = shadow.getElementById("primary");
  const secondaryInput = shadow.getElementById("secondary");
  const backgroundInput = shadow.getElementById("background");
  const glowInput = shadow.getElementById("glow");
  const speedInput = shadow.getElementById("speed");

  let cells = [];
  let animationFrame = 0;
  let running = false;
  let destroyed = false;
  let phase = 0;
  let lastTimestamp = performance.now();
  let preMinimizeHeight = settings.height;

  const status = {
    state: "ready",
    cellCount: 0,
    rows: 0,
    columns: 0,
    phase: 0,
    selectedBN: null,
    storage: "memory",
    updatedAt: Date.now()
  };

  function applyPalette() {
    shell.style.setProperty("--primary", settings.primary);
    shell.style.setProperty("--secondary", settings.secondary);
    shell.style.setProperty("--background", settings.background);
  }

  function renderText(text) {
    settings.text = String(text).replace(/\r\n?/g, "\n");
    const rows = settings.text.split("\n");
    const columns = Math.max(0, ...rows.map(row => [...row].length));
    const fragment = document.createDocumentFragment();
    cells = [];
    art.textContent = "";

    rows.forEach((row, rowIndex) => {
      [...row.padEnd(columns, " ")].forEach((character, columnIndex) => {
        const cell = document.createElement("span");
        const index = cells.length;
        cell.className = "bn";
        cell.id = "textart-bn" + index;
        cell.dataset.bnId = "bn" + index;
        cell.dataset.row = String(rowIndex);
        cell.dataset.column = String(columnIndex);
        cell.dataset.character = character;
        cell.textContent = character === " " ? "\u00a0" : character;
        cell.addEventListener("click", event => {
          event.stopPropagation();
          status.selectedBN = {
            id: cell.dataset.bnId,
            index,
            row: rowIndex,
            column: columnIndex,
            character,
            color: getComputedStyle(cell).color,
            phase
          };
          window.FunebraSelectedBN = status.selectedBN;
          cell.animate(
            [{ outline: "1px solid #fff" }, { outline: "1px solid transparent" }],
            { duration: 700 }
          );
        });
        cells.push(cell);
        fragment.appendChild(cell);
      });
      fragment.appendChild(document.createElement("br"));
    });

    art.appendChild(fragment);
    status.cellCount = cells.length;
    status.rows = rows.length;
    status.columns = columns;
    status.updatedAt = Date.now();
  }

  function createParticles(count = 42) {
    particleLayer.textContent = "";
    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement("i");
      particle.className = "particle";
      particle.style.left = (Math.random() * 100).toFixed(2) + "%";
      particle.style.setProperty("--size", (1 + Math.random() * 3).toFixed(2) + "px");
      particle.style.setProperty("--duration", (4 + Math.random() * 7).toFixed(2) + "s");
      particle.style.setProperty("--delay", (-Math.random() * 9).toFixed(2) + "s");
      particle.style.setProperty("--drift", (-45 + Math.random() * 90).toFixed(1) + "px");
      particle.style.setProperty("--particle-color", index % 2 ? settings.primary : settings.secondary);
      particleLayer.appendChild(particle);
    }
  }

  function animate(timestamp) {
    if (!running || destroyed) return;
    const delta = Math.min((timestamp - lastTimestamp) / 16.667, 3);
    lastTimestamp = timestamp;
    phase += settings.speed * delta;

    cells.forEach((cell, index) => {
      if (cell.dataset.character === " ") {
        cell.style.color = "transparent";
        cell.style.textShadow = "none";
        return;
      }
      const wave = (Math.sin(index * 0.11 + phase) + 1) / 2;
      const hue = (phase * 18 + index * 0.7 + wave * 55) % 360;
      cell.style.color = `hsl(${hue} 100% ${56 + wave * 22}%)`;
      cell.style.textShadow = `0 0 ${Math.max(0, settings.glow * wave).toFixed(1)}px currentColor`;
    });

    status.phase = phase;
    status.updatedAt = Date.now();
    animationFrame = requestAnimationFrame(animate);
  }

  function start() {
    if (running || destroyed) return;
    running = true;
    status.state = "running";
    lastTimestamp = performance.now();
    shadow.getElementById("pause").textContent = "Ⅱ";
    animationFrame = requestAnimationFrame(animate);
  }

  function stop() {
    if (!running) return;
    running = false;
    status.state = "stopped";
    cancelAnimationFrame(animationFrame);
    shadow.getElementById("pause").textContent = "▶";
  }

  function updateEditor() {
    textInput.value = settings.text;
    primaryInput.value = settings.primary;
    secondaryInput.value = settings.secondary;
    backgroundInput.value = settings.background;
    glowInput.value = String(settings.glow);
    speedInput.value = String(settings.speed);
    editor.classList.toggle("open", settings.editorOpen && !settings.minimized);
  }

  function applyEditor() {
    settings.primary = primaryInput.value;
    settings.secondary = secondaryInput.value;
    settings.background = backgroundInput.value;
    settings.glow = Number(glowInput.value);
    settings.speed = Number(speedInput.value);
    applyPalette();
    renderText(textInput.value);
    createParticles();
    settings.editorOpen = false;
    updateEditor();
    saveSettings();
  }

  function toggleMinimize() {
    settings.minimized = !settings.minimized;
    shell.classList.toggle("minimized", settings.minimized);
    if (settings.minimized) {
      preMinimizeHeight = host.getBoundingClientRect().height;
      host.style.height = "34px";
      host.style.resize = "none";
      settings.editorOpen = false;
    } else {
      host.style.height = Math.max(150, preMinimizeHeight) + "px";
      host.style.resize = "both";
    }
    shadow.getElementById("minimize").textContent = settings.minimized ? "□" : "−";
    updateEditor();
    saveGeometry();
  }

  function saveGeometry() {
    const rect = host.getBoundingClientRect();
    if (!settings.minimized) {
      settings.width = Math.round(rect.width);
      settings.height = Math.round(rect.height);
    }
    settings.left = Math.round(rect.left);
    settings.top = Math.round(rect.top);
    status.storage = "memory";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      status.storage = "localStorage";
    } catch {
      memorySettings = { ...settings };
    }
  }

  function reset() {
    Object.assign(settings, defaults);
    phase = 0;
    host.style.left = "50%";
    host.style.top = "50%";
    host.style.transform = "translate(-50%, -50%)";
    host.style.width = defaults.width + "px";
    host.style.height = defaults.height + "px";
    host.style.resize = "both";
    shell.classList.remove("minimized");
    applyPalette();
    renderText(DEFAULT_ART);
    createParticles();
    updateEditor();
    saveSettings();
  }

  function destroy() {
    if (destroyed) return;
    stop();
    destroyed = true;
    status.state = "destroyed";
    resizeObserver.disconnect();
    host.remove();
    if (registry[SCENE_ID] === scene) delete registry[SCENE_ID];
  }

  const scene = {
    id: SCENE_ID,
    version: "2.0.0",
    generator: {
      type: "textart-character-wave",
      particles: true,
      source: "external-bookmarklet-scene"
    },
    representation: { type: "character-bn-field", host, shadow, get cells() { return cells; } },
    settings,
    status,
    start,
    stop,
    reset,
    destroy,
    edit() {
      settings.editorOpen = true;
      settings.minimized = false;
      shell.classList.remove("minimized");
      host.style.height = Math.max(220, preMinimizeHeight) + "px";
      host.style.resize = "both";
      updateEditor();
    },
    get memorySettings() { return { ...memorySettings }; }
  };

  registry[SCENE_ID] = scene;
  document.documentElement.appendChild(host);
  applyPalette();
  renderText(settings.text);
  createParticles();
  shell.classList.toggle("minimized", settings.minimized);
  if (settings.minimized) host.style.height = "34px";
  updateEditor();

  shadow.getElementById("close").addEventListener("click", destroy);
  shadow.getElementById("pause").addEventListener("click", () => running ? stop() : start());
  shadow.getElementById("minimize").addEventListener("click", toggleMinimize);
  shadow.getElementById("edit").addEventListener("click", () => {
    settings.editorOpen = !settings.editorOpen;
    updateEditor();
    saveSettings();
  });
  shadow.getElementById("apply").addEventListener("click", applyEditor);
  shadow.getElementById("reset").addEventListener("click", reset);

  const dragHandle = shadow.getElementById("bar");
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  dragHandle.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    dragging = true;
    const rect = host.getBoundingClientRect();
    host.style.transform = "none";
    host.style.left = rect.left + "px";
    host.style.top = rect.top + "px";
    startX = event.clientX;
    startY = event.clientY;
    initialLeft = rect.left;
    initialTop = rect.top;
    dragHandle.setPointerCapture(event.pointerId);
  });

  dragHandle.addEventListener("pointermove", event => {
    if (!dragging) return;
    host.style.left = initialLeft + event.clientX - startX + "px";
    host.style.top = initialTop + event.clientY - startY + "px";
  });

  const stopDragging = event => {
    if (!dragging) return;
    dragging = false;
    if (dragHandle.hasPointerCapture(event.pointerId)) {
      dragHandle.releasePointerCapture(event.pointerId);
    }
    saveGeometry();
  };

  dragHandle.addEventListener("pointerup", stopDragging);
  dragHandle.addEventListener("pointercancel", stopDragging);

  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeObserver.timer);
    resizeObserver.timer = setTimeout(saveGeometry, 180);
  });
  resizeObserver.observe(host);

  start();
})();
