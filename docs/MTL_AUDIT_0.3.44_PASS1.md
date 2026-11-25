# Alpha 0.3.44 — MTL audit, pass 1

Status: review, not final MDS approval. All 163 templates and 229 floors analysed against existing geometry, topology, current furniture and decoration catalogue, available station actions and MDS §§50–61. This is a programmatic, per-model and per-floor technical review, not a human visual/architectural inspection.

Results: 161 template revisions; 191 furniture additions, 218 decoration additions, 224 decoration substitutions; no increase in catalogue type count yet. Interaction stations 2282 → 2491. 67 models flagged for individual review; heuristic required-action gaps 13 → 8 models. Some flags require interpretation: a deposit service is not necessarily a retail shop, and room function cannot be inferred solely from an action string. Do not equate heuristic completeness with actual MDS acceptance.

All 229 R13 interior blobs verified before changes; all 229 R14 staged interior blobs and manifest/map layers verified against generated data. MFS full validator: 0 errors, 0 warnings, 1 info. All 916 rotated floors pass FPS/RTS/IDS checks. Rural area validation: 0 issues. Approved-copy compilation passes; published registry remains review-only. Original R13 and previous catalogues retained. No changes to exterior footprints or portal pairs. Node regression script added, not executed in Node. Browser, Android, offline cache and Pages deployment not verified.

## Priority for pass 2
1. Inspect 67 flagged models individually; decide which heuristics are legitimate requirements. Address missing cooking/sleep in appropriate keeps and officer residence, military supply access, and distinguish deposit service from retail.
2. Design meaningful separate functional zones in larger buildings. Do not add walls without preserving entrances, routes and stations. Prioritize inns, clinics, noble residences, prisons and large public buildings.
3. Revisit rural layouts, delivery approaches, broad gates, stables and animal housing; existing one-cell portals do not implement wide gates.
4. Review action semantics (quern, harvest sorting, tanning table, cattle stall, chicken perch, nest box, offering table, ritual lectern and ladder). Preserve backward compatibility; new action strings alone do not implement gameplay.
5. Review independent underground maps and visual quality; add missing furniture and decoration types where useful, including unique artwork. Visual review of all models and MDS acceptance still pending.

Detailed per-model data: templates/mtl/audit-candidates-0.3.44.json. R14 is the first audit iteration, not the end of 0.3.44.
