# MTL hotfix 0.3.32.1

User reported 96 errors from 24 rejected dotted interior paths. Canonical paths interiors/bNNN/fN.json reuse exactly the original Git blobs; geometry and IDs unchanged. Old paths retained. Cache version bumped, new paths precached. Safe-path checks unchanged. Added a regression test using the actual viewer loader. Path and cache syntax checks passed; further runtime checks required.
