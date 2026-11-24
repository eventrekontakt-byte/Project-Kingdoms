# Alpha 0.3.31 — Map Viewer
Standalone read-only viewer at tools/map-viewer/. Shared core rasterize and validator, selectable revisions, 16 layer controls, floors, cell area, zoom/pan/pinch, grid/IDs, inspection, measurement, validation and error focus, JSON report and current viewport PNG. Separate maps/review.json draft registry (mapId,mapRevision,manifest,profile); never loaded into gameplay. URL ?map=mfs_test_001&rev=1. Report calculated from loaded inputs; revision mismatch rejected. Drafts without a compiled scene show no collision claims. Rooms currently anchor-only; no complete RRS, route simulation or full graphical editor. PNG is viewport, not formal plan with legend. Game logic untouched; header, menu link and offline cache updated. Real Android gestures and offline cold start not tested. Automated JS checks:
- PASS valid fixture and four scenes
- PASS same parcel masks as core
- PASS same building mask as compiler
- PASS all scene collision parity
- PASS two stairs middle floor
- PASS selection priority
- PASS selection respects layer
- PASS touching parcels distinct
- PASS area 90 tiles
- PASS zoom anchor
- PASS distance
- PASS separate draft revisions
- PASS duplicate revision rejected
- PASS draft without collision claims
- PASS invalid geometry reported
- PASS load selected revision with fresh report
- PASS revision mismatch rejected
- PASS UI and SW syntax
