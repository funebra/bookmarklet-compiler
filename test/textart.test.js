import test from "node:test";
import assert from "node:assert/strict";
import { generateFunebraBookmarklet } from "../src/textart-bookmarklet-compiler.js";

test("compiles normalized multiline TextArt", () => {
  const result = generateFunebraBookmarklet("A\r\nB\rC");
  assert.ok(result.startsWith("javascript:(()=>"));
  assert.match(result, /\["A","B","C"\]/);
  assert.equal(result.includes("\r"), false);
});

test("serializes closing script-like text safely", () => {
  const result = generateFunebraBookmarklet("</script><b>BN</b>");
  assert.equal(result.includes("</script>"), false);
  assert.match(result, /\\u003c\/script>/);
});

test("rejects unsafe identifiers and colors", () => {
  assert.throws(
    () => generateFunebraBookmarklet("x", { layerId: "bad id" }),
    /valid simple DOM ID/
  );
  assert.throws(
    () => generateFunebraBookmarklet("x", { color: "red;display:none" }),
    /unsafe CSS characters/
  );
});
