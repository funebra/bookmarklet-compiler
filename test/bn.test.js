import test from "node:test";
import assert from "node:assert/strict";
import {
  captureFunebraBN,
  compileFunebraBNSnapshot
} from "../src/bn-bookmarklet-compiler.js";

test("captures one evaluated BN point", () => {
  const previousApi = globalThis.FunebraAPI;
  const previousStyle = globalThis.getComputedStyle;
  const previousWidth = globalThis.innerWidth;
  const previousHeight = globalThis.innerHeight;

  const element = {
    id: "bn3",
    innerHTML: "&#9787;",
    dataset: { bnState: "active" },
    getBoundingClientRect: () => ({ left: 90, top: 180, width: 20, height: 40 })
  };

  globalThis.FunebraAPI = { getBN: id => id === "bn3" ? { element } : null };
  globalThis.getComputedStyle = () => ({
    color: "rgb(255, 0, 0)", fontFamily: "serif", fontSize: "16px",
    fontWeight: "400", fontStyle: "normal", lineHeight: "normal",
    opacity: "1", textShadow: "none", background: "none",
    border: "0px none", borderRadius: "0px", padding: "0px"
  });
  globalThis.innerWidth = 1000;
  globalThis.innerHeight = 1000;

  try {
    const snapshot = captureFunebraBN("bn3");
    assert.equal(snapshot.sourceId, "bn3");
    assert.equal(snapshot.nx, 0.1);
    assert.equal(snapshot.ny, 0.2);
    assert.equal(snapshot.generator, undefined);
  } finally {
    globalThis.FunebraAPI = previousApi;
    globalThis.getComputedStyle = previousStyle;
    globalThis.innerWidth = previousWidth;
    globalThis.innerHeight = previousHeight;
  }
});

test("compiles an evaluated snapshot into a toggle bookmarklet", () => {
  const snapshot = {
    contract: "Funebra BN Bookmarklet Compiler v1.0 — Evaluated Point Snapshot",
    version: "1.0.0",
    sourceId: "bn3",
    targetId: "funebra-bookmark-bn3",
    namespace: "FunebraBookmarkletBN",
    nx: 0.5,
    ny: 0.5,
    html: "•",
    state: "active",
    style: {
      color: "red", fontFamily: "serif", fontSize: "16px", fontWeight: "400",
      fontStyle: "normal", lineHeight: "normal", opacity: "1", textShadow: "none",
      background: "none", border: "none", borderRadius: "0", padding: "0"
    },
    properties: { source: "Funebra Math-Art Engine", generator: "rings[]", capturedAt: 1 }
  };
  const result = compileFunebraBNSnapshot(snapshot);
  assert.ok(result.startsWith("javascript:(()=>"));
  assert.match(result, /funebra-bookmark-bn3/);
});
