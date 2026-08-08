# Funebra BN Bookmarklet Compiler v1.0

Canonical designation: **Evaluated BN Snapshot**.

## Frozen boundary

Version 1 captures exactly one already-rendered Funebra BN point. The snapshot
preserves:

- source and target BN identifiers;
- evaluated `innerHTML` representation;
- computed appearance;
- BN state;
- viewport-relative position;
- source and generator provenance;
- deterministic toggle and teardown behavior.

It intentionally excludes:

- the source `rings[]` array;
- `scodeX` and `scodeY` expressions;
- engine controls;
- BN relations;
- the original animation loop.

Those exclusions distinguish a portable evaluated snapshot from a complete
Funebra scene export.

## API

```js
captureFunebraBN(id, options)
compileFunebraBNSnapshot(snapshot)
generateFunebraBNBookmarklet(id, options)
installFunebraBNBookmarkletCompiler(options)
```

The installed browser helper is available as `globalThis.FunebraBNBookmarklet`.

```js
FunebraBNBookmarklet.capture("bn3");
FunebraBNBookmarklet.compile("bn3");
await FunebraBNBookmarklet.copyBN("bn3");
await FunebraBNBookmarklet.copySelected();
```

`copySelected()` requires a selected BN exposed through
`FunebraBookmark.getSelected()`.
