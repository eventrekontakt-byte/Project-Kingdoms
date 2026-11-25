# Plan produkcji
Aktualizacja: 2026-11-25. Plan operacyjny wynikający z istniejącego raportu, nie nowe zatwierdzenie zakresu.

## Najbliższa ścieżka
1. [x] Alpha 0.3.44 Pass I / r14 — audyt techniczny.
2. [x] Alpha 0.3.44 Pass II-A — triage 67/67 modeli i indywidualne zalecenia wg MDS.
   - [ ] Pass II-B — weryfikacja geometrii, funkcji i klasyfikacji, przebudowa układów, logistyka, semantyka, podziemia i wyposażenie.
3. [ ] Kolejne rewizje MTL wg wyników kontroli; zachować archiwum.
4. [ ] Odbiór biblioteki MTL wg MDS; rzeczywiste testy i akceptacja.
5. [ ] Projekt nowego Miasta 1 wg MDS, z kolejnymi bramkami odbioru.
6. [ ] Integracja i stabilizacja mapy referencyjnej.
7. [ ] Wznowienie DNS.

## Ogólny plan wersji z README
0.1 fundamenty → 0.2 świat i eksploracja → 0.3 postać i walka → 0.4 gospodarka → 0.5 budownictwo → 0.6 żyjący świat → 0.7 wojsko i polityka → 0.8 magia i religia → 0.9 integracja → 1.0 wydanie.
Numeracja rzeczywistych wersji 0.3.x odbiega od pierwotnego planu (rozbudowa MFS/MTL). Nie traktować numeracji jako dowodu ukończenia funkcji.

## Korekta po przeglądzie II-B11 (2026-11-25, czat 5)
II-B1–B10: kandydaci przygotowani; II-B11: końcowy przegląd 163 modeli zakończony. Nie wykonywać ponownego masowego meblowania B11d/e/f. II-B12: rozstrzygnięcia i niezbędne korekty na podstawie ../MTL_FINAL_REVIEW_0.3.44.md, pełne właściwe bramki IDS. II-B13: integracja r15. II-B14: QA i odbiór wizualny. Akceptacja użytkownika przed uznaniem biblioteki za produkcyjną; następnie Nowe Miasto 1 i DNS po stabilizacji. Brak zmiany nadrzędnych standardów MDS/MFS.


## Checkpoint II-B12h–B14 — r15 review (czat 6, 2026-11-25)
Lista 33: 19 korekt, 14 uzasadnionych wyjątków proponowanych do akceptacji, 0 nierozstrzygniętych. B12h: 8 modeli, 68 obrotów V8, commit 40429f3. Rejestr: templates/mtl/pass2b12h-candidates.json, docs/MTL_AUDIT_0.3.44_PASS2B12H.md. B13: catalog-v15.json (0.15.0), 118 ID z nakładek, 163 modele/229 kondygnacji/628 pomieszczeń/2585 obiektów/5164 dekoracji/2906 stanowisk wnętrz/191 definicji mebli. Regres całej biblioteki przed korektą kotwic: 916 obrotów V8, 0 FPS/RTS/dekoracje. Pełny profil MFS początkowo wykrył 7 kotwic na wyposażeniu w 5 modelach, poprawiono je w tych samych pokojach (99fee41, r15-anchor-fixes.json); powtórna walidacja kompletnej galerii r15: 0 ERROR, 0 WARNING, 1 INFO, 230 scen, 2930 stanowisk razem z infrastrukturą; RURAL_AREAS 0. Galeria r15 na main (5bc4e43), wpis tylko w maps/review.json, r1–r14 i maps/world.json bez zmian. Raport templates/mtl/r15-mfs-final-report.json. B14 techniczny profil final pozytywny, ale nie pełna akceptacja: pominięte IDS_PROGRAM, RDS_VEHICLES, NPC_RUNTIME, MDS_MANUAL; 14 wyjątków i klasyfikacja depozytu/sztabu do akceptacji; wizualny odbiór, Node, przeglądarka/Android, Pages, offline i rzeczywista logistyka pozostają otwarte. Nie wracać do B11 ani otwierać nowej ogólnej listy wymiarowej. Przed produkcyjnym użyciem r15 rozstrzygnąć akceptację i sprawdzić wizualnie. Następnie Nowe Miasto 1, osobna mapa review, plan migracji ID i zapisów według MFS §; zachować legacy, DNS nadal wstrzymany.
