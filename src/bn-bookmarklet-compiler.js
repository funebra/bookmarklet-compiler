/**
 * Funebra BN Bookmarklet Compiler v1.0 — Evaluated Point Snapshot
 * Copyright (c) 2026 Peter M. Lugha / pLabs Entertainment
 */

export const VERSION = "1.0.0";

const DEFAULTS = Object.freeze({
  namespace: "FunebraBookmarkletBN",
  targetIdPrefix: "funebra-bookmark-",
  source: "Funebra Math-Art Engine",
  generator: "rings[]"
});

function requireSimpleIdentifier(value, name) {
  if (typeof value !== "string" || !/^[A-Za-z_$][\w$]*$/.test(value)) {
    throw new TypeError(`${name} must be a valid JavaScript identifier`);
  }
  return value;
}

function requireSimpleDomId(value, name) {
  if (typeof value !== "string" || !/^[A-Za-z][\w:.-]*$/.test(value)) {
    throw new TypeError(`${name} must be a valid simple DOM ID`);
  }
  return value;
}

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeOptions(options) {
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("options must be an object");
  }

  return {
    namespace: requireSimpleIdentifier(
      options.namespace ?? DEFAULTS.namespace,
      "namespace"
    ),
    targetIdPrefix: requireSimpleDomId(
      options.targetIdPrefix ?? DEFAULTS.targetIdPrefix,
      "targetIdPrefix"
    ),
    source: String(options.source ?? DEFAULTS.source),
    generator: String(options.generator ?? DEFAULTS.generator)
  };
}

/** Capture one already-evaluated BN DOM representation. */
export function captureFunebraBN(id, options = {}) {
  const config = normalizeOptions(options);
  const api = globalThis.FunebraAPI;

  if (!api || typeof api.getBN !== "function") {
    throw new Error("FunebraAPI.getBN() is unavailable");
  }

  const bn = api.getBN(id);
  if (!bn?.element) {
    throw new Error(`Funebra BN point not found: ${id}`);
  }

  const element = bn.element;
  const computed = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const viewportWidth = Math.max(finite(globalThis.innerWidth, 1), 1);
  const viewportHeight = Math.max(finite(globalThis.innerHeight, 1), 1);

  return {
    contract: "Funebra BN Bookmarklet Compiler v1.0 — Evaluated Point Snapshot",
    version: VERSION,
    sourceId: element.id,
    targetId: config.targetIdPrefix + element.id,
    namespace: config.namespace,
    nx: finite(rect.left + rect.width / 2) / viewportWidth,
    ny: finite(rect.top + rect.height / 2) / viewportHeight,
    html: element.innerHTML,
    state: element.dataset.bnState || bn.state || "active",
    style: {
      color: computed.color,
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      fontStyle: computed.fontStyle,
      lineHeight: computed.lineHeight,
      opacity: computed.opacity,
      textShadow: computed.textShadow,
      background: computed.background,
      border: computed.border,
      borderRadius: computed.borderRadius,
      padding: computed.padding
    },
    properties: {
      source: config.source,
      generator: config.generator,
      capturedAt: Date.now()
    }
  };
}

/** Compile a captured BN snapshot into a self-contained toggle bookmarklet. */
export function compileFunebraBNSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    throw new TypeError("snapshot must be an object");
  }

  requireSimpleDomId(snapshot.targetId, "snapshot.targetId");
  requireSimpleIdentifier(snapshot.namespace, "snapshot.namespace");

  const data = JSON.stringify(snapshot)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  const code = `(()=>{"use strict";const b=${data},w=window,n=b.namespace,o=document.getElementById(b.targetId);if(o){typeof o.__destroy==="function"?o.__destroy():o.remove();return}const e=document.createElement("div");e.id=b.targetId;e.dataset.bnId=b.sourceId;e.dataset.bnState=b.state;e.dataset.bnGenerator=b.properties.generator;e.innerHTML=b.html;Object.assign(e.style,{position:"fixed",left:b.nx*innerWidth+"px",top:b.ny*innerHeight+"px",zIndex:"2147483647",color:b.style.color,fontFamily:b.style.fontFamily,fontSize:b.style.fontSize,fontWeight:b.style.fontWeight,fontStyle:b.style.fontStyle,lineHeight:b.style.lineHeight,opacity:b.style.opacity,textShadow:b.style.textShadow,background:b.style.background,border:b.style.border,borderRadius:b.style.borderRadius,padding:b.style.padding,transform:"translate(-50%,-50%)",cursor:"pointer",userSelect:"none",pointerEvents:"auto"});(document.body||document.documentElement).appendChild(e);let d=false,x=0,y=0;e.addEventListener("pointerdown",t=>{d=true;const r=e.getBoundingClientRect();x=t.clientX-r.left-r.width/2;y=t.clientY-r.top-r.height/2;e.setPointerCapture(t.pointerId)});e.addEventListener("pointermove",t=>{if(!d)return;e.style.left=t.clientX-x+"px";e.style.top=t.clientY-y+"px";b.nx=parseFloat(e.style.left)/innerWidth;b.ny=parseFloat(e.style.top)/innerHeight});const u=t=>{d=false;e.hasPointerCapture(t.pointerId)&&e.releasePointerCapture(t.pointerId)};e.addEventListener("pointerup",u);e.addEventListener("pointercancel",u);const r=()=>{e.style.left=b.nx*innerWidth+"px";e.style.top=b.ny*innerHeight+"px"};addEventListener("resize",r);e.__destroy=()=>{removeEventListener("resize",r);e.remove();w[n]?.element===e&&delete w[n]};w[n]={id:b.sourceId,state:b.state,generator:{type:"evaluated-point-snapshot",source:b.properties.source,originalGenerator:b.properties.generator,capturedAt:b.properties.capturedAt},representation:e,element:e,destroy:e.__destroy};if(w.FunebraAPI)try{w.FunebraAPI.scan?.();w.FunebraAPI.register?.(e.id,{state:b.state,properties:b.properties})}catch(t){console.warn("FunebraAPI registration skipped:",t)}void 0})();`;

  return `javascript:${code}`;
}

/** Capture and compile one BN by id. */
export function generateFunebraBNBookmarklet(id, options = {}) {
  return compileFunebraBNSnapshot(captureFunebraBN(id, options));
}

/** Install the browser-console helper used inside the Math-Art Engine. */
export function installFunebraBNBookmarkletCompiler(options = {}) {
  const config = normalizeOptions(options);

  const helper = Object.freeze({
    version: VERSION,
    capture: id => captureFunebraBN(id, config),
    compile: id => generateFunebraBNBookmarklet(id, config),
    compileSelected() {
      const selected = globalThis.FunebraBookmark?.getSelected?.();
      if (!selected?.id) {
        throw new Error("No BN selected. Click a BN point in the Math-Art Engine first.");
      }
      return this.compile(selected.id);
    },
    async copyBN(id) {
      const bookmarklet = this.compile(id);
      await navigator.clipboard.writeText(bookmarklet);
      return bookmarklet;
    },
    async copySelected() {
      const selected = globalThis.FunebraBookmark?.getSelected?.();
      if (!selected?.id) {
        throw new Error("No BN selected. Click a BN point in the Math-Art Engine first.");
      }
      return this.copyBN(selected.id);
    }
  });

  globalThis.FunebraBNBookmarklet = helper;
  return helper;
}
