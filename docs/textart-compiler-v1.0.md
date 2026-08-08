# API Documentation: Funebra TextArt Bookmarklet Compiler v1.0

The **Funebra TextArt Bookmarklet Compiler** converts compact TextArt into a portable, self-contained browser scene. It compiles small-to-medium multiline TextArt into a self-contained `javascript:` bookmarklet URL, subject to browser bookmark and synchronization limits. The resulting bookmarklet creates a draggable, ID-scoped DOM overlay with explicit lifecycle management and runtime state tracking under the single-instance `window.FunebraTextArt` global namespace.




Advanced representations should use the **Funebra External Scene Loader**, keeping the bookmarklet lightweight while delegating generators, BN state, animation, and interaction to a versioned JavaScript scene file.




## 1. Architectural Deployment Profiles

| **Profile**                    | **Target Architecture**                     | **Primary Best Use Case**                                                                    | **Operational Profile**                              |
| ------------------------------ | ------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Self-Contained Compiler v1** | `Funebra TextArt Bookmarklet Compiler v1.0` | Small TextArt, offline portability, zero external server dependency                          | Compact / Self-contained / Offline (Stable baseline) |
| **External Scene Loader v2**   | `Funebra External Scene Loader v2`          | BN cells, dynamic particles, full 3D animation, controls, large scene files                  | Lightweight bookmarklet + hosted JavaScript asset    |
| **Browser Extension**          | `Funebra Web Extension Engine` *(Future)*   | Protected pages where Content Security Policies (CSP) block external inline script injection | Local extension background context                   |

## 2. API Signature & Source Implementation

TypeScript

```
export function generateFunebraBookmarklet(
  asciiArt: string,
  options?: {
    id?: string;
    layerId?: string;
    color?: string;
    bg?: string;
  }
): string;

```

### Complete ES Module Export Implementation

JavaScript

```
/**
 * Validates CSS color parameters across Browser and Node.js environments.
 *
 * @param {string} value - CSS color string to test.
 * @param {string} name - Option property name for error messaging.
 */
function validateColor(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`${name} must be a non-empty CSS color string`);
  }

  // Prevent CSS escaping, injection, or comment breakout in Node.js where CSS.supports is missing
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

/**
 * Compiles small-to-medium multiline TextArt into a single-line Funebra bookmarklet URL.
 *
 * @param {string} asciiArt - Raw multiline ASCII art string.
 * @param {Object} [options] - Optional customization parameters.
 * @param {string} [options.id="textart001"] - Funebra Scene Object ID.
 * @param {string} [options.layerId="funebra-textart-layer"] - DOM layer element ID.
 * @param {string} [options.color="#00ff88"] - Foreground text color.
 * @param {string} [options.bg="rgba(0, 0, 0, 0.88)"] - Container background color.
 * @returns {string} Single-line `javascript:` bookmarklet string.
 */
export function generateFunebraBookmarklet(asciiArt, options = {}) {
  // 1. Options Object Validation
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("options must be an object");
  }

  const {
    id = "textart001",
    layerId = "funebra-textart-layer",
    color = "#00ff88",
    bg = "rgba(0, 0, 0, 0.88)"
  } = options;

  // 2. Input Type Hardening & Identifier Validation
  if (typeof asciiArt !== "string") {
    throw new TypeError("asciiArt must be a string");
  }

  if (typeof id !== "string" || !id.trim()) {
    throw new TypeError("id must be a non-empty string");
  }

  if (typeof layerId !== "string" || !/^[A-Za-z][\w-]*$/.test(layerId)) {
    throw new TypeError("layerId must be a valid simple DOM ID");
  }

  // 3. Robust CSS Color Verification (Delimiters + Comment Check + Browser Native Check)
  validateColor(color, "color");
  validateColor(bg, "bg");

  // 4. Safe Identifier & String Serialization
  const safeLayerId = JSON.stringify(layerId);
  const safeStyleId = JSON.stringify(`${layerId}-styles`);
  const safeId = JSON.stringify(id.trim());

  // 5. Newline Normalization (\r\n, \r, \n) & Line Array Serialization
  const lines = asciiArt.replace(/\r\n?/g, "\n").split("\n");
  const jsonLines = JSON.stringify(lines);

  // 6. Stylesheet Construction
  const css = `#${layerId}{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483647;padding:18px;background:${bg};color:${color};border:1px solid ${color};border-radius:6px;box-shadow:0 0 10px ${color},0 0 30px rgba(0,255,136,.4);overflow:auto;max-width:95vw;max-height:90vh;cursor:grab;user-select:none;font-family:"Lucida Console",Monaco,monospace;font-size:14px;line-height:14px;white-space:pre}#${layerId}:active{cursor:grabbing}`;

  // 7. Minified Single-Line Runtime Payload Assembly with Lifecycle DOM Fallbacks
  const bookmarkletCode = [
    '(()=>{"use strict";',
    `const e=${safeLayerId},t=${safeStyleId},n=document.getElementById(e),p=window.FunebraTextArt;`,
    'if(n){n.remove(),document.getElementById(t)?.remove(),p&&typeof p.remove==="function"&&p.remove()}',
    'else{p&&typeof p.remove==="function"&&p.remove(),document.getElementById(t)?.remove();',
    'const style=document.createElement("style");style.id=t,',
    `style.textContent=${JSON.stringify(css)},(document.head||document.documentElement).appendChild(style);`,
    `const r=${jsonLines}.join("\\n"),s=document.createElement("div");s.id=e,s.textContent=r,(document.body||document.documentElement).appendChild(s);`,
    `window.FunebraTextArt={id:${safeId},state:"active",generator:{type:"text-art",source:"bookmarklet"},representation:s,remove(){s.remove(),style.remove(),window.FunebraTextArt===this&&delete window.FunebraTextArt}};`,
    'let a=!1,c=0,d=0,l=0,i=0;s.addEventListener("pointerdown",(e=>{a=!0;const t=s.getBoundingClientRect();s.style.transform="none",s.style.left=\`\${t.left}px\`,s.style.top=\`\${t.top}px\`,c=e.clientX,d=e.clientY,l=t.left,i=t.top,s.setPointerCapture(e.pointerId)}));',
    's.addEventListener("pointermove",(e=>{if(!a)return;const t=e.clientX-c,n=e.clientY-d;s.style.left=\`\${l+t}px\`,s.style.top=\`\${i+n}px\`}));',
    'const u=e=>{a&&(a=!1,s.hasPointerCapture(e.pointerId)&&s.releasePointerCapture(e.pointerId))};s.addEventListener("pointerup",u),s.addEventListener("pointercancel",u)}',
    'void 0;})();'
  ].join("");

  return `javascript:${bookmarkletCode}`;
}

```

## 3. Parameter Reference

### `asciiArt` *(Required)*

- **Type:** `string`



- **Description:** Small-to-medium multiline raw ASCII string or array-joined text block to be compiled into the payload.



- **Normalization:** All CRLF (`\r\n`) and CR (`\r`) sequences are automatically normalized to standard line feeds (`\n`) prior to JSON serialization.




### `options` *(Optional)*

An options object configuring target element IDs and component styles.




| **Option** | **Type** | **Default**               | **Validation & Constraints**                                                                                                      |
| ---------- | -------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `id`       | `string` | `"textart001"`            | Non-empty string after trimming. Registered on `window.FunebraTextArt.id`.                                                        |
| `layerId`  | `string` | `"funebra-textart-layer"` | Must match `/^[A-Za-z][\w-]*$/` (valid simple DOM identifier).                                                                    |
| `color`    | `string` | `"#00ff88"`               | Rejects newlines, semicolons, braces, angle brackets, and CSS comment delimiters. Validated with `CSS.supports()` when available. |
| `bg`       | `string` | `"rgba(0, 0, 0, 0.88)"`   | Rejects newlines, semicolons, braces, angle brackets, and CSS comment delimiters. Validated with `CSS.supports()` when available. |

## 4. Exceptions & Error Handling

The compiler applies strict validation checks and throws a `TypeError` if input contracts are violated:




JavaScript

```
import { generateFunebraBookmarklet } from "./funebra-compiler.js";

// Throws: TypeError("options must be an object")
generateFunebraBookmarklet("ART", null);

// Throws: TypeError("color contains unsafe CSS characters")
generateFunebraBookmarklet("ART", { color: "#000; background: red;" });

// Throws: TypeError("color contains unsafe CSS characters")
generateFunebraBookmarklet("ART", { color: "red/*" });

// Throws: TypeError("id must be a non-empty string")
generateFunebraBookmarklet("ART", { id: "   " });

// Throws: TypeError("layerId must be a valid simple DOM ID")
generateFunebraBookmarklet("ART", { layerId: "123-invalid-id!" });

```

## 5. Runtime Architecture & Behavior

When the compiled bookmarklet executes in a browser tab, it follows a deterministic execution path:




```
                  ┌───────────────────────────────┐
                  │ Bookmarklet Invoked by User   │
                  └──────────────┬────────────────┘
                                 │
                   [Check #layerId in DOM?]
                                 │
                ┌────────────────┴────────────────┐
                ▼                                 ▼
             {YES}                              {NO}
   ┌──────────────────────┐           ┌──────────────────────┐
   │ Toggle Off Path      │           │ Injection / Swap Path│
   │  1. Remove #layerId  │           │  1. Clear Existing P │
   │  2. Remove <style>   │           │  2. Clear Orphan CSS │
   │  3. Clear Window P   │           │  3. Inject <style>   │
   │                      │           │  4. Create #layerId  │
   │                      │           │  5. Register Object  │
   └──────────────────────┘           └──────────────────────┘

```

### Stage 1: Deterministic Toggle & Instance Swap Check

1. Queries the DOM for `#${layerId}` (`n`) and checks for `window.FunebraTextArt` (`p`).



2. **If** **`#${layerId}`** **is present (Toggle Off):** Removes `#${layerId}`, removes `#${layerId}-styles`, calls `p.remove()` if valid, and exits (`void 0;`).



3. **If** **`#${layerId}`** **is absent (Injection / Swap):** Automatically calls `p.remove()` to clean up any active instance using a different `layerId`, removes any orphaned `#${layerId}-styles`, and proceeds to inject the new overlay.




### Stage 2: Component CSS Injection & Lifecycle Robustness

Injects an ID-scoped `<style>` element into `document.head` (falling back to `document.documentElement` if invoked during early document parsing) with `id="${layerId}-styles"`.




- **Scope Limits:** The stylesheet relies on ID specificity (`#${layerId}`). It is not isolated inside a Shadow DOM; page-level styles, inherited properties, ID collisions, or external `!important` rules can affect rendering.



- **Layout Rule Set:** Applies fixed viewport positioning (`top: 50%; left: 50%; transform: translate(-50%, -50%);`), elevated stacking (`z-index: 2147483647`), and monospaced font alignment (`white-space: pre; font-size: 14px; line-height: 14px;`).




### Stage 3: DOM Layer & Text Construction

- Creates a `<div>` layer with `id="${layerId}"` appended to `document.body || document.documentElement`.



- Assigns ASCII artwork strictly using `.textContent` to avoid HTML parsing or cross-site scripting (XSS) issues.




### Stage 4: Interactive Drag Engine & Pointer Capture

Attaches pointer listeners (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`):




- Calculates pixel offsets upon `pointerdown` and converts positioning from CSS translates to explicit pixel coordinates.



- Calls `setPointerCapture(pointerId)` to maintain tracking when the cursor moves outside the overlay within the viewport.



- Pointer capture does not extend beyond the browser window surface; browser window blur or leaving the window boundary will interrupt interaction.



- Releases capture safely via `hasPointerCapture()` checks inside `pointerup` and `pointercancel`.




## 6. Global Namespace Specification (`window.FunebraTextArt`)

Upon successful instantiation, the runtime registers a `FunebraTextArt` Scene Object in a **single-instance global namespace**:




TypeScript

```
interface FunebraTextArtObject {
  id: string;
  state: "active";
  generator: {
    type: "text-art";
    source: "bookmarklet";
  };
  representation: HTMLDivElement;
  remove: () => void;
}

```

## 7. Environmental & Security Matrix

| **Environment Context**                | **Operational Behavior**                                                                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Standard HTML Pages**                | Executes as expected. Renders overlay and populates `window.FunebraTextArt`.                                                                    |
| Same-Origin Test Pages / `about:blank` | Reliable environment for automated unit testing and headless validation.                                                                        |
| **Strict CSP Pages**                   | Sites enforcing restrictive `script-src` / `style-src` directives or blocking `javascript:` execution may reject invocation or style injection. |
| Browser System Pages (`chrome://`)     | Browser security models prevent bookmarklet execution on system/extension pages.                                                                |

## Review & Freeze Approval Status

- **Implementation:** Passed



- **Security:** Passed



- **Lifecycle:** Passed



- **Documentation:** Passed



- **Freeze Status:** Approved



- **Canonical Designation:** `Funebra TextArt Bookmarklet Compiler v1.0 — Stable Baseline / Frozen`