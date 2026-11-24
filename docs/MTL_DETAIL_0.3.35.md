# MTL expansion II — 0.3.35

{
  "templates": 46,
  "floors": 52,
  "furnitureTypes": 70,
  "decorationTypes": 76,
  "surfaceTypes": 58,
  "addedFurniture": 97,
  "surfaceProps": 782,
  "changedDecor": 55,
  "totalObjects": 561,
  "totalDecor": 1020,
  "rotations": 184,
  "counts": {
    "ERROR": 0,
    "WARNING": 0,
    "INFO": 1
  },
  "stations": 602
}

Surface props have host ID, type compatibility and four rotating slots. Decorative only; no item pickup or dynamic lighting. Explicit new furniture placed only when collision-free and all room anchors, stations and arrivals reachable without traversing portal triggers. Earlier revisions retained. 46 buildings retained; no new buildings this batch. New catalog types may be unused. Invalid host and duplicate slot rejected. No Android test.
