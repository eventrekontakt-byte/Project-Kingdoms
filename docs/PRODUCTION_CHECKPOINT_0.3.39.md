# Production checkpoint — Alpha 0.3.39

Source: main commit f1fe33ce179fad690e5ee2b8fcc91fcabeb0ed96, 25 November 2026.

- Gallery r9: 110 buildings, 125 interior floors, 126 scenes including exterior; 1,329 stations.
- Stored final report: 0 errors, 0 warnings, 1 info. Status is review, not playable or approved. The report skips vehicle movement, full interior programme/access/runtime RRS, NPC runtime and manual design review.
- MTL r1–r9 remain available in the archive; r9 and the engine test map are the default choices. Actual revision-menu module logic tested locally with the ten registered revision identifiers; all assertions passed.
- Added tests/mtl-r9.mjs: actual registry, latest-first/archive behavior, r9 load, review status, counts, preview geometry, decoration checks and mock canvas rendering. Run from repository root: `node --experimental-default-type=module tests/mtl-r9.mjs`. Full test not executed in this checkpoint (local environment cannot clone GitHub); no claim of browser, Android or offline test.
- README previously described 0.3.28; this checkpoint does not change the game version, map data, save schema, service worker or runtime.
- MFS §30 original numbering and actual releases have diverged: 0.3.33–0.3.39 extended MTL instead of delivering approved City 1. Do not treat the reference city as complete.
- Suggested next MTL group (not yet approved): public, civic, education, religion and health buildings, based on existing MDS §21 BDS types. Full City 1 design still requires successive MDS review gates. DNS remains paused until reference map acceptance and stabilization.
