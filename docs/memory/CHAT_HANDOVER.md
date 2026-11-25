# CHAT_HANDOVER — CMS 1.0
2026-11-25 | Alpha 0.3.44 | main | MTL r15 review.
Punkt odniesienia: galeria r15 commit 5bc4e43; przed migracją CMS d20880ca620a092901f985d411e06597dda3c486. Sprawdź HEAD (metadane, nie pełny diff).

## Najbliższa partia: MTL-006 / decyzje r15
Przygotuj do akceptacji użytkownika 14 indywidualnych wyjątków IDS z B12h oraz klasyfikację depozytu/sztabu (w tym FDS). Odczytaj tylko WORK_RULES.md, raport docs/MTL_AUDIT_0.3.44_PASS2B12H.md, właściwe rekordy templates/mtl/pass2b12h-candidates.json, ewentualnie odpowiednie sekcje MDS/FDS i raport B9. Rozdziel fakty, uzasadnienia i propozycje. Nie zatwierdzaj samodzielnie, nie modyfikuj mapy i nie wykonuj kolejnej partii bez polecenia.

## Aktualny stan
II-B11 zakończony. Lista 33 w B12: 19 korekt, 14 propozycji wyjątków, 0 nierozstrzygniętych. B13: r15 zintegrowana (katalog 0.15.0; 163 modele, 229 kondygnacji, 628 pomieszczeń, 2906 stanowisk wnętrz). Tylko maps/review.json; r1–r14 i maps/world.json bez zmian. B14: zapisany raport templates/mtl/r15-mfs-final-report.json — final MFS 0 ERROR, 0 WARNING, 1 INFO po naprawie 7 kotwic. Nie oznacza odbioru. Pominięte IDS_PROGRAM, RDS_VEHICLES, NPC_RUNTIME, MDS_MANUAL. Node, przeglądarka/Android, offline, Pages, wizualny odbiór, prawa dostępu, logistyka i większe jednostki otwarte.
Po decyzjach: pozostałe bramki i odbiór r15, dopiero potem Nowe Miasto 1 w osobnej mapie review, migracja ID/zapisów i zachowanie legacy. DNS wstrzymany do stabilizacji. Nie wracaj do masowego meblowania B11 ani nie otwieraj nowego ogólnego audytu wymiarów.

## Procedura
Odczytaj WORK_RULES.md. Inne dokumenty tylko na żądanie, bez pełnych logów/katalogów. Po jednej partii zapisz checkpoint (nadpisz aktualny handover/stan, nie dopisuj historii) i raportuj monitor orientacyjny. Szczegóły CMS_1.0.md; aktywny BACKLOG.md, PROJECT_STATE.md, ROADMAP.md, DECISIONS.md — selektywnie. Historia w Git i raportach.
