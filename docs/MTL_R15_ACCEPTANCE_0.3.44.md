# MTL r15 — protokół odbioru technicznego (review)

Data: 2026-11-25. Stan: **zamrożona referencja / review**, nie zatwierdzenie produkcyjne. Aktualny status: [protokół zamknięcia zakresu](MTL_R15_CLOSURE_0.3.44.md). Poniższy checkpoint historyczny.


## Checkpoint II-B12h–B14 — r15 review (czat 6, 2026-11-25)
Lista 33: 19 korekt, 14 uzasadnionych wyjątków proponowanych do akceptacji, 0 nierozstrzygniętych. B12h: 8 modeli, 68 obrotów V8, commit 40429f3. Rejestr: templates/mtl/pass2b12h-candidates.json, docs/MTL_AUDIT_0.3.44_PASS2B12H.md. B13: catalog-v15.json (0.15.0), 118 ID z nakładek, 163 modele/229 kondygnacji/628 pomieszczeń/2585 obiektów/5164 dekoracji/2906 stanowisk wnętrz/191 definicji mebli. Regres całej biblioteki przed korektą kotwic: 916 obrotów V8, 0 FPS/RTS/dekoracje. Pełny profil MFS początkowo wykrył 7 kotwic na wyposażeniu w 5 modelach, poprawiono je w tych samych pokojach (99fee41, r15-anchor-fixes.json); powtórna walidacja kompletnej galerii r15: 0 ERROR, 0 WARNING, 1 INFO, 230 scen, 2930 stanowisk razem z infrastrukturą; RURAL_AREAS 0. Galeria r15 na main (5bc4e43), wpis tylko w maps/review.json, r1–r14 i maps/world.json bez zmian. Raport templates/mtl/r15-mfs-final-report.json. B14 techniczny profil final pozytywny, ale nie pełna akceptacja: pominięte IDS_PROGRAM, RDS_VEHICLES, NPC_RUNTIME, MDS_MANUAL; 14 wyjątków i klasyfikacja depozytu/sztabu do akceptacji; wizualny odbiór, Node, przeglądarka/Android, Pages, offline i rzeczywista logistyka pozostają otwarte. Nie wracać do B11 ani otwierać nowej ogólnej listy wymiarowej. Przed produkcyjnym użyciem r15 rozstrzygnąć akceptację i sprawdzić wizualnie. Następnie Nowe Miasto 1, osobna mapa review, plan migracji ID i zapisów według MFS §; zachować legacy, DNS nadal wstrzymany.

## Bramki
- Katalog i skala instancji, kolizje, FPS, RTS, dekoracje, portale, sieć dróg, działki, kompilacja MFS: pozytywne w wykonanych kontrolach V8 i profilu final.
- Wyjątki: lista 14 z indywidualnymi uzasadnieniami w pass2b12h-candidates.json; decyzje użytkownika E01–E14 i C01–C02 zapisane w D010 (16/16), z warunkami odbioru. Nie zmieniono standardu IDS.
- Nie uznawać testów V8 za uruchomienie aplikacji Node/Android. Nie testowano publikacji Pages ani offline. Kontrole pominięte przez walidator jawnie zapisane w JSON.
- Nie zatwierdzono użytkowania produkcyjnego; nie modyfikowano świata ani zapisów.

## Zamknięcie zakresu r15
Zamrożono bibliotekę referencyjną; projektowe decyzje przyjęte, pozostałe bramki jawnie otwarte. Szczegóły i ograniczenia: [MTL_R15_CLOSURE_0.3.44.md](MTL_R15_CLOSURE_0.3.44.md). Nie zmieniono statusu manifestu ani readyForPublication/playable.
