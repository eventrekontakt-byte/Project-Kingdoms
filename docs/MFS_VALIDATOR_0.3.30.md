# Alpha 0.3.30 — Map Validator 1.0

Validator follows MFS §22–23 and MDS §16, §21, §28, §49, §75, §77. Profiles: terrain → parcels → roads → fortifications → buildings → interiors → infrastructure → final. Reports include version, revision, severity, code, object/scene, coordinates, file and rule, results, stats and skipped checks. The test fixture is playable but is not a production map. No silent repair. Current map compiler supports F0, paired doors and stairs only. Geometry checks of fortifications are preliminary. Vehicle maneuvering, complete functional programme, full RRS, access permissions, NPC runtime, courtyard details, complex road cross-sections and manual review remain incomplete. Production certification stays false while checks are skipped. Legacy City 1 unchanged. Reports in game menu, JSON export. No new save schema. Android/offline regression requires user testing.

## Tests executed before commit (JS isolate, not a browser)
- PASS valid test map: 0 errors, 4 scenes, not production certification
- PASS draft parcels profile skips later layers
- PASS bad schema
- PASS duplicate IDs
- PASS out of bounds
- PASS overlap vs touching
- PASS incorrect parcel class
- PASS road reference
- PASS wrong road width
- PASS disconnected roads
- PASS road through parcel
- PASS parcel lacks access
- PASS building outside
- PASS bad BDS dimensions
- PASS bad BDS type
- PASS bad ISS dimensions
- PASS duplicate floor level
- PASS unknown portal target
- PASS arrival on trigger
- PASS invalid access
- PASS station on furniture
- PASS isolated floor
- PASS blocked infrastructure
- PASS spawn on empty land
- PASS wall blocks road
- PASS no mutation
- PASS warning target
- PASS world registry and all JSON files
- PASS missing layer reported, no bundle
- PASS game/service worker syntax
