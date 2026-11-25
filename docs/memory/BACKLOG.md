# Aktywny backlog — CMS 1.0
2026-11-25. Alpha 0.3.44 / MTL r15 review. Historia zamkniętych prac w DEVELOPMENT_LOG, raportach i Git (d20880ca620a092901f985d411e06597dda3c486).
| ID | Priorytet | Otwarte zadanie / kryterium odbioru |
|---|---|---|
| MTL-001/002 | P0 | Lista 33 zamknięta technicznie (19 korekt, 14 propozycji wyjątków); przygotować 14 wyjątków do indywidualnej akceptacji, sprawdzić IDS_PROGRAM/MDS_MANUAL w zakresie rzeczywistych wymagań; nie rozpoczynać ponownego masowego audytu. |
| MTL-003 | P1 | Rzeczywiste dojazdy, dostawy, wybiegi, większe jednostki, RDS_VEHICLES; szerokie portale wdrożone w B8, zweryfikować zastosowanie. |
| MTL-004 | P1 | Klasyfikacja depozytu/sztabu (w tym kontekst FDS), nabrzeże SP_PORT; semantyka 9 urządzeń ma definicje, akcje opisowe nie oznaczają działających procesów. Prawa dostępu/NPC_RUNTIME pozostają otwarte. |
| MTL-005 | P1 | Odbiór wizualny wnętrz i dekoracji, podziemi i konkretnych braków; B11 zakończony, bez ponownego masowego meblowania. |
| QA-001 | P0 | Rzeczywisty Node: tests/mtl-r14.mjs oraz właściwa regresja r15; jeżeli brak środowiska zgłosić, nie udawać wyniku. |
| QA-002 | P0 | Testy przeglądarki, Android (priorytet), offline i Pages; rzeczywiste wyniki. |
| MTL-006 | P0 | Odbiór końcowy r15 według MDS/MFS, akceptacja wyjątków i klasyfikacji, wizualne i techniczne bramki; 0 ERROR/0 WARNING final MFS nie zastępuje odbioru. |
| CITY-001 | zależne | Po odbiorze r15: nowe Miasto 1, osobna mapa review, plan migracji ID i zapisów wg MFS, zachować legacy; odbiory etapowe i stabilizacja. |
| DNS-001 | wstrzymane | Po odbiorze i stabilizacji mapy referencyjnej. |

Następna partia: przygotować pakiet decyzji dla 14 wyjątków z B12h i klasyfikacji depozytu/sztabu. Źródła: ../MTL_AUDIT_0.3.44_PASS2B12H.md, ../../templates/mtl/pass2b12h-candidates.json, właściwe sekcje MDS/FDS. Bez samodzielnej akceptacji i bez zmian mapy.
