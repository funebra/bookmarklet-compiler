/**
 * Funebra TextArt Bookmarklet Compiler v1.0 — Stable Baseline / Frozen
 * Copyright (c) 2026 Peter M. Lugha / pLabs Entertainment
 */

export const TEXTART_VERSION = "1.0.0";

function validateColor(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`${name} must be a non-empty CSS color string`);
  }

  if (/[\r\n;{}<>]|\/\*|\*\//.test(value)) {
    throw new TypeError(`${name} contains unsafe CSS characters`);
  }

  if (
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    !CSS.supports("color", value)
  ) {
    throw new TypeError(`${name} must be a valid CSS color`);
  }
}

export function generateFunebraBookmarklet(asciiArt, options = {}) {
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("options must be an object");
  }

  const {
    id = "textart001",
    layerId = "funebra-textart-layer",
    color = "#00ff88",
    bg = "rgba(0, 0, 0, 0.88)"
  } = options;

  if (typeof asciiArt !== "string") {
    throw new TypeError("asciiArt must be a string");
  }

  if (typeof id !== "string" || !id.trim()) {
    throw new TypeError("id must be a non-empty string");
  }

  if (typeof layerId !== "string" || !/^[A-Za-z][\w-]*$/.test(layerId)) {
    throw new TypeError("layerId must be a valid simple DOM ID");
  }

  validateColor(color, "color");
  validateColor(bg, "bg");

  const safeLayerId = JSON.stringify(layerId);
  const safeStyleId = JSON.stringify(`${layerId}-styles`);
  const safeId = JSON.stringify(id.trim());
  const lines = asciiArt.replace(/\r\n?/g, "\n").split("\n");
  const jsonLines = JSON.stringify(lines)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  const css = `#${layerId}{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483647;padding:18px;background:${bg};color:${color};border:1px solid ${color};border-radius:6px;box-shadow:0 0 10px ${color},0 0 30px rgba(0,255,136,.4);overflow:auto;max-width:95vw;max-height:90vh;cursor:grab;user-select:none;font-family:"Lucida Console",Monaco,monospace;font-size:14px;line-height:14px;white-space:pre}#${layerId}:active{cursor:grabbing}`;

  const bookmarkletCode = [
    '(()=>{"use strict";',
    `const e=${safeLayerId},t=${safeStyleId},n=document.getElementById(e),p=window.FunebraTextArt;`,
    'if(n){n.remove(),document.getElementById(t)?.remove(),p&&typeof p.remove==="function"&&p.remove()}',
    'else{p&&typeof p.remove==="function"&&p.remove(),document.getElementById(t)?.remove();',
    'const style=document.createElement("style");style.id=t,',
    `style.textContent=${JSON.stringify(css)},(document.head||document.documentElement).appendChild(style);`,
    `const r=${jsonLines}.join("\\n"),s=document.createElement("div");s.id=e,s.textContent=r,(document.body||document.documentElement).appendChild(s);`,
    `window.FunebraTextArt={id:${safeId},state:"active",generator:{type:"text-art",source:"bookmarklet"},representation:s,remove(){s.remove(),style.remove(),window.FunebraTextArt===this&&delete window.FunebraTextArt}};`,
    'let a=!1,c=0,d=0,l=0,i=0;s.addEventListener("pointerdown",(e=>{a=!0;const t=s.getBoundingClientRect();s.style.transform="none",s.style.left=`${t.left}px`,s.style.top=`${t.top}px`,c=e.clientX,d=e.clientY,l=t.left,i=t.top,s.setPointerCapture(e.pointerId)}));',
    's.addEventListener("pointermove",(e=>{if(!a)return;const t=e.clientX-c,n=e.clientY-d;s.style.left=`${l+t}px`,s.style.top=`${i+n}px`}));',
    'const u=e=>{a&&(a=!1,s.hasPointerCapture(e.pointerId)&&s.releasePointerCapture(e.pointerId))};s.addEventListener("pointerup",u),s.addEventListener("pointercancel",u)}',
    'void 0;})();'
  ].join("");

  return `javascript:${bookmarkletCode}`;
}
