# Aktywny backlog — CMS 1.0
2026-11-25. Alpha 0.3.44 / MTL r15 review. Historia zamkniętych prac w DEVELOPMENT_LOG, raportach i Git (d20880ca620a092901f985d411e06597dda3c486).
| ID | Priorytet | Otwarte zadanie / kryterium odbioru |
|---|---|---|
| MTL-001/002 | P0 | Lista 33 zamknięta technicznie (19 korekt, 14 wyjątków); E01–E14 zatwierdzone indywidualnie z warunkami odbioru; E04 powierzchnia wyjaśniona statycznie, sprawdzić IDS_PROGRAM/MDS_MANUAL w zakresie rzeczywistych wymagań; nie rozpoczynać ponownego masowego audytu. |
| MTL-003 | P1 | Rzeczywiste dojazdy, dostawy, wybiegi, większe jednostki, RDS_VEHICLES; szerokie portale wdrożone w B8, zweryfikować zastosowanie. |
| MTL-004 | P1 | Klasyfikacja depozytu/sztabu C01–C02 zatwierdzona z warunkami odbioru (BDS/FDS), nabrzeże SP_PORT; semantyka 9 urządzeń ma definicje, akcje opisowe nie oznaczają działających procesów. Prawa dostępu/NPC_RUNTIME pozostają otwarte. |
| MTL-005 | P1 | Odbiór wizualny wnętrz i dekoracji, podziemi i konkretnych braków; B11 zakończony, bez ponownego masowego meblowania. |
| QA-001 | P0 | Rzeczywisty Node: tests/mtl-r14.mjs oraz właściwa regresja r15; jeżeli brak środowiska zgłosić, nie udawać wyniku. |
| QA-002 | P0 | Testy przeglądarki, Android (priorytet), offline i Pages; rzeczywiste wyniki. |
| MTL-006 | P0 przed integracją | Odbiór końcowy r15 według MDS/MFS, wyjątki i klasyfikacje zatwierdzone (D010); zakres katalogowy zamknięty (zamrożona referencja); pozostałe warunki decyzji oraz wizualne i techniczne bramki otwarte; 0 ERROR/0 WARNING final MFS nie zastępuje odbioru. |
| CITY-001a | WIP | 01 zatwierdzona D012; [02 topografia](../CITY_001a_02_TOPOGRAPHY.md) propozycja do akceptacji; 03 dzielnice/program po poleceniu. Bez kodu/map; geometria i bramki MDS/MFS w CITY-001b. |
| CITY-001b | zależne | Osobna mapa review, migracja ID/zapisów wg MFS, zachować legacy; odbiory etapowe, przed produkcyjną integracją rozstrzygnąć zaległe bramki r15. |
| DNS-001 | wstrzymane | Po odbiorze i stabilizacji mapy referencyjnej. |

Następna partia na polecenie po akceptacji topografii: CITY-001a.03. R15 zamrożona, dług odbiorowy w ../MTL_R15_CLOSURE_0.3.44.md.
