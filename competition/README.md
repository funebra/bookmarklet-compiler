# Funebra 3D Graphics Bookmarklet Competition

Turn one browser bookmark into a living mathematical scene.

This directory contains the public submission kit for the **Funebra 3D
Graphics Bookmarklet Competition**, governed by the frozen
**F-0005 v1.0 — First Public Edition** specification.

## Official standard

- [F-0005 v1.0 specification](../docs/specifications/F-0005-v1.0.md)
- [F-0005 v1.0 release](https://github.com/funebra/bookmarklet-compiler/releases/tag/f-0005-v1.0)
- [Canonical Watch BN3 demonstration](https://funebra.github.io/bookmarklet-compiler/examples/f-0005/)

## Competition divisions

1. **Tiny Code (< 1 KB)** — Raw JavaScript below 1,024 bytes before URI
   encoding.
2. **DOM / BN-Point** — Projected 3D scenes rendered with DOM-native BN points.
3. **Mathematical Scene** — Parametric, implicit, fractal, procedural, or
   higher-dimensional geometry.
4. **Interactive Scene** — Mouse, touch, audio, keyboard, or page-relative
   interaction.
5. **Printable 3D Translation** — Valid OBJ or STL manifold-mesh generation.

Canvas and WebGL entries may be accepted only in their declared specialized
track. The canonical Funebra division is DOM / BN-Point.

## Required lifecycle interface

Every official entry must expose a collision-resistant controller on `window`
with these methods:

```js
window.__FUNEBRA_NS_ENTRY = {
  start(),
  pause(),
  resume(),
  toggleUI(),
  destroy()
};
```

Pausing and destroying an entry must cancel its active animation frame. Destroy
must also remove injected DOM nodes, listeners, temporary URLs, and globals.

## Submission contents

Create one directory per entry:

```text
submissions/
  creator-handle/
    entry-name/
      entry.js
      manifest.json
      README.md
      index.html          # optional neutral demonstration
      validation.md       # optional validation evidence
```

Required files:

- `entry.js` — Complete `javascript:` bookmarklet source.
- `manifest.json` — Metadata following the F-0005 schema.
- `README.md` — Description, usage, mathematical method, and known limitations.

Do not include secrets, credentials, analytics identifiers, tracking code, or
undeclared remote dependencies.

## Manifest

Copy [`submission-template/manifest.json`](submission-template/manifest.json)
and replace every placeholder with measured entry data.

Raw and URI-encoded byte counts must be calculated from the submitted
`entry.js`; do not estimate them.

## How to submit

1. Fork `funebra/bookmarklet-compiler`.
2. Create your entry directory under `competition/submissions/`.
3. Add the required files and test the full lifecycle.
4. Open a pull request against `main`.
5. Use the pull-request title:

   ```text
   F-0005 Entry: <entry name> — <division>
   ```

6. In the pull-request description, confirm:

   - the entry is original or all reused material is declared;
   - external dependencies are listed in `manifest.json`;
   - Start, Pause, Resume, Toggle UI, and Destroy were tested;
   - the entry does not damage or permanently modify its host page.

Submission does not guarantee acceptance. Entries may be returned for technical
corrections before judging.

## Judging

Entries are evaluated out of 100 points:

| Criterion | Points |
| --- | ---: |
| Mathematical originality | 25 |
| Visual impact and aesthetics | 25 |
| Technical compactness | 20 |
| Performance and frame stability | 15 |
| Browser compatibility and hygiene | 15 |

The complete judging definitions are normative in F-0005 v1.0.

## Reference entry

The first canonical reference submission is
[`examples/f-0005/watch-bn3.js`](../examples/f-0005/watch-bn3.js), accompanied
by its manifest, live test page, and browser-validation record.

## Current status

The F-0005 standard and reference implementation are public and frozen. A
competition round, submission deadline, and judging dates will be announced
separately; none are implied by this repository document.

## Stewardship

F-0005 is maintained by **Peter M. Lugha / pLabs Entertainment** under the
Funebra project. Changes to the frozen standard require an erratum or a new
version.
