# Alpha 0.3.29 – MFS Core

Map data is loaded from maps/world.json. The isolated fixture is exposed through the menu. Legacy maps and save schema 9 remain intact. MFS floors use individual scene IDs; the legacy adapter exposes floor=0 per scene, while MFS stores real level separately. No NPC development, City 1 redesign, full MDS validator, templates, editing, World Delta or IndexedDB in this release. Orthogonal polylines are supported; diagonal passages require explicit masks. Fortification data must currently be empty (F0). Schema files are machine-readable core contracts; semantic runtime checks are implemented in core.js. Further geometry validation and complete rule coverage belong to 0.3.30. The test fixture is not a production settlement.

## Automated checks executed in JS isolate before commit
- PASS: compile all four scenes
- PASS: touching parcels, correct road width
- PASS: entrance, exit and middle floor both directions
- PASS: ISS and furniture collision
- PASS: rect, polygon hole, mask, rotation
- PASS: out-of-bounds geometry
- PASS: unsupported schema
- PASS: duplicate ID
- PASS: overlap
- PASS: building outside plot
- PASS: bad floor reference
- PASS: blocked arrival
- PASS: JSON manifest and registry loading
- PASS: missing required JSON rejected
- PASS: registry
- PASS: JS module syntax
- PASS: service worker syntax

Actual Android browser, full UI regression, save reload and offline cold start are not verified by these checks. Test in game: Menu → MFS Core → Open test map; go north through door, use each stair from middle floor, save and load; return to City 1. Existing save key is unchanged. The cache includes exact module URLs and JSON files.
