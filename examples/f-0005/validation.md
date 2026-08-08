# Funebra Watch BN3 — Browser Validation Record

## Identification

| Field | Value |
| --- | --- |
| Specification | F-0005 v1.0 — First Public Edition |
| Entry | Funebra Watch BN3 |
| Entry version | 1.0.0 |
| Namespace | `__FUNEBRA_WATCH_BN3` |
| Division | DOM / BN-Point |
| Author | Peter M. Lugha |
| Validation date | 2026-08-08 |
| Result | PASS |

## Test environment

| Field | Value |
| --- | --- |
| Operating system | Windows 11 |
| Browser | Google Chrome 151 |
| Hosting | GitHub Pages |
| External dependencies | None |

## Live reference

https://funebra.github.io/bookmarklet-compiler/examples/f-0005/

## Validated files

- `watch-bn3.js`
- `index.html`
- `manifest.json`

## Lifecycle test sequence

| Step | Action | Observed result | Status |
| --- | --- | --- | --- |
| 1 | Open test page | Neutral test interface displayed with status `Ready` | PASS |
| 2 | Load / Execute | Watch BN3 overlay created and animated | PASS |
| 3 | Pause | Motion stopped and internal control changed to `Resume` | PASS |
| 4 | Resume | Rendering and clock motion continued | PASS |
| 5 | Toggle UI | Watch overlay became hidden | PASS |
| 6 | Toggle UI again | Existing watch overlay became visible without duplication | PASS |
| 7 | Destroy | Overlay was removed and status reported `Destroyed cleanly` | PASS |
| 8 | Load / Execute again | Watch was reconstructed and animation restarted | PASS |

## Compliance observations

- The canonical DOM/BN-point watch rendered without Canvas or WebGL.
- The 12-hour and 60-minute BN rings displayed correctly.
- Hour, minute, and second hands were projected into the rotating 3D scene.
- Pause and resume operated through the public lifecycle controller.
- UI visibility toggled without reconstructing the entry.
- Destroy removed the injected scene.
- Reload after destruction confirmed that the namespace could be established again.
- No external dependency was required.

## Validation conclusion

The Funebra Watch BN3 reference entry completed the manual Chrome lifecycle
validation sequence for F-0005 v1.0.

**Final result: PASS**
