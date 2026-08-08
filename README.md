# Funebra Bookmarklet Compiler

Portable browser-scene compilers for the Funebra Math-Art Engine.

This repository preserves two stable v1 contracts and provides one home for
future Funebra bookmarklet formats:

- **TextArt Compiler v1.0 — Stable Baseline / Frozen** converts compact
  multiline TextArt into a self-contained draggable bookmarklet.
- **BN Compiler v1.0 — Evaluated BN Snapshot** captures one already-rendered
  BN point and compiles its evaluated appearance, state, relative position,
  and provenance into a portable bookmarklet.
- **F-0005 3D Graphics Bookmarklet Competition Specification v1.0 — Frozen**
  defines the official DOM/BN-point competition standard, lifecycle contract,
  judging framework, reference engines, printable mesh pathway, and canonical
  Funebra Watch BN3 submission. It extends the repository without altering the
  frozen TextArt or BN Compiler v1 contracts.

## Install

The modules have no runtime dependencies and can be imported directly:

```js
import {
  generateFunebraBookmarklet,
  installFunebraBNBookmarkletCompiler
} from "./src/index.js";
```

## TextArt

```js
import { generateFunebraBookmarklet } from "./src/textart-bookmarklet-compiler.js";

const bookmarklet = generateFunebraBookmarklet("♥ FUNEBRA ♥", {
  color: "#00ff88",
  bg: "rgba(0, 0, 0, 0.88)"
});

await navigator.clipboard.writeText(bookmarklet);
```

Run the bookmarklet again to remove its overlay.

## Evaluated BN snapshot

Load the BN compiler inside a page exposing `FunebraAPI.getBN()`:

```js
import { installFunebraBNBookmarkletCompiler } from "./src/bn-bookmarklet-compiler.js";

installFunebraBNBookmarkletCompiler();
await FunebraBNBookmarklet.copyBN("bn3");
```

For a selected BN point:

```js
await FunebraBNBookmarklet.copySelected();
```

The v1 boundary is deliberately one evaluated DOM representation. It excludes
the original `rings[]` data, `scodeX`, `scodeY`, engine controls, relations,
and source animation loop.

## Repository structure

```text
src/
  index.js
  textart-bookmarklet-compiler.js
  bn-bookmarklet-compiler.js
docs/
  textart-compiler-v1.0.md
  specifications/
    F-0005-v1.0.md
examples/
  textart-universal-scene-v2.js
test/
  textart.test.js
  bn.test.js
```

## Validation

```bash
npm test
npm run check
```

## Relationship to Math-Art Engine

The [Funebra Math-Art Engine](https://github.com/funebra/math-art-engine) is the
authoring environment. This repository owns portable bookmarklet compilation
contracts and examples. The two repositories are complementary.

## License

MIT © 2026 Peter M. Lugha / pLabs Entertainment.
