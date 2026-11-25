# Dziennik produkcyjny
Skrócony dziennik checkpointów; pełna historia kodu w Git, szczegółowe zmiany w ../CHANGELOG.md i raportach etapowych.

| Data | Wersja / etap | Wynik | Commit / dokument |
|---|---|---|---|
| 2026-11-25 | 0.3.39 | MTL r9, checkpoint; odbiór otwarty | ../PRODUCTION_CHECKPOINT_0.3.39.md |
| 2026-11-25 | 0.3.40 | MTL r10, budynki publiczne i administracyjne | ../MTL_CIVIC_0.3.40.md |
| 2026-11-25 | 0.3.41 | MTL r11, sakralne i szlacheckie | ../MTL_SACRED_NOBLE_0.3.41.md |
| 2026-11-25 | 0.3.42 | MTL r12, zabudowa i teren wiejski | b48aacad99e8ae9dae3e3f374ebb89011c7331f9 |
| 2026-11-25 | 0.3.43 | MTL r13, budynki specjalne i niezależne podziemia | b651058967af255cb1d5cfc9e4e44b57bcc00a3a |
| 2026-11-25 | 0.3.44 | MTL r14, Pass I: 161 poprawionych modeli, walidacja statyczna; otwarty Pass II | ac670f9f5fc2cd78efb86e107e3133c850627117 |
| 2026-11-25 | Dokumentacja | Czat (4): odzyskano stan z GitHub, wdrożono pamięć produkcyjną i monitor; bez zmiany wersji gry | bieżący commit dokumentacyjny |

| 2026-11-25 | 0.3.44 Pass II-A | Triage 67/67 modeli według MDS; brak zmian w mapach, test kompletności ID; brak nowych testów runtime | ../MTL_AUDIT_0.3.44_PASS2A.md |

| 2026-11-25 | 0.3.44 Pass II-B1 (WIP) | Cztery modele kandydujące, 8 nowych stanowisk, 16 obrotów sprawdzonych w V8; bez publikacji r15 | ../MTL_AUDIT_0.3.44_PASS2B1.md |

| 2026-11-25 | 0.3.44 Pass II-B2 (WIP) | 4 modele, 8 → 30 pomieszczeń, 32 obrotów V8, bez publikacji r15 | ../MTL_AUDIT_0.3.44_PASS2B2.md |

| 2026-11-25 | 0.3.44 Pass II-B3 (WIP) | 3 modele, 8 → 29 pomieszczeń, 28 obrotów V8 | ../MTL_AUDIT_0.3.44_PASS2B3.md |

| 2026-11-25 | 0.3.44 Pass II-B4 (WIP) | 5 modeli, 10 → 50 pomieszczeń, 40 obrotów V8 | ../MTL_AUDIT_0.3.44_PASS2B4.md |

| 2026-11-25 | 0.3.44 Pass II-B5 (WIP) | 7 modeli, 12 → 55 pomieszczeń, 48 obrotów V8 | ../MTL_AUDIT_0.3.44_PASS2B5.md |

| 2026-11-25 | 0.3.44 Pass II-B6 (WIP) | 17 modeli, +34 mebli, +92 dekoracji, 68 obrotów V8 | ../MTL_AUDIT_0.3.44_PASS2B6.md |

| 2026-11-25 | 0.3.44 Pass II-B7 (WIP) | 16 modeli, +43 mebli, +89 dekoracji, 88 obrotów V8; rejestr obciążenia rozmów | ../MTL_AUDIT_0.3.44_PASS2B7.md |

Dalsze wpisy: data, zakres, wersja, commit, rzeczywiście wykonane testy, ograniczenia i następny krok. Wpisy dopisywać bez usuwania historii.

| 2026-11-25 | II-B8a WIP | Wielopolowy portal, MTL/FPS/RTS/IDS/viewer; regresja V8 poligonu, 12 nowych i 652 zgodne stare orientacje | ../MFS_WIDE_PORTALS_0.3.44.md |

| 2026-11-25 | II-B8b review | 16 szerokich wejść, 64 kompilacje, 372 pola przejścia, 88 obrotów kondygnacji; 56 unikatowych kandydatów | ../MTL_AUDIT_0.3.44_PASS2B8B.md |

| 2026-11-25 | II-B9 review | 9 wersji mebli; 28 modeli, 196 obrotów V8; 74 unikatowe kandydaty; klasyfikacja BDS do rozstrzygnięcia | ../MTL_AUDIT_0.3.44_PASS2B9.md |

| 2026-11-25 | II-B10a WIP | 4 modele; +29 pomieszczeń, +46 stanowisk, +30 mebli, +44 dekoracje, 40 obrotów V8 | ../MTL_AUDIT_0.3.44_PASS2B10A.md |

| 2026-11-25 | II-B10b review | 5 modeli, +71 pomieszczeń, +108 stanowisk, +80 mebli, +70 dekoracji, 72 obroty V8; 79 unikatowych kandydatów | ../MTL_AUDIT_0.3.44_PASS2B10B.md |

| 2026-11-25 | II-B11a WIP, czat (5) | 4 modele, +13 mebli, +33 dekoracje, 50→63 stanowiska, 16 obrotów V8; 79 unikatowych kandydatów | ../MTL_AUDIT_0.3.44_PASS2B11A.md |

| 2026-11-25 | II-B11b WIP, czat (5) | 11 modeli, +51 mebli, +165 dekoracji, 246→301 stanowisk, 84 obroty V8; 79 unikatowych kandydatów | ../MTL_AUDIT_0.3.44_PASS2B11B.md |

| 2026-11-25 | II-B11c WIP, czat (5) | 7 modeli, +36 mebli, +114 dekoracji, 116→156 stanowisk, 48 obrotów V8; nowe stanowiska w pokojach obiektów; 79 unikatowych kandydatów | ../MTL_AUDIT_0.3.44_PASS2B11C.md |

| 2026-11-25 | II-B11 final review, czat (5) | 163/163 modeli, 916 obrotów V8, 0 błędów w wykonanych testach, 58 modeli z sygnałami do rozstrzygnięcia; ogólne meblowanie zakończone, bez zmian modeli | ../MTL_FINAL_REVIEW_0.3.44.md |

| 2026-11-25 | II-B12a WIP, czat (5) | 28 modeli skontrolowanych, 25 zmienionych; 29 przesunięć, izolowane 35→3, granice 9→1, 128 obrotów V8; 93 unikatowe ID | ../MTL_AUDIT_0.3.44_PASS2B12A.md |

| 2026-11-25 | II-B12b–e WIP, czat (5) | komunikacja 35→0 / 9→0; zamki +20 pomieszczeń, 996 pól; 13 progów wyjaśnionych, 17 stref, 5 korekt programu, 10 domów poprawionych; 110 ID | ../MTL_AUDIT_0.3.44_PASS2B12B_E.md |

**Dopisek — potwierdzenie po pełnym regresie:** Regres po B12e potwierdzony: 163/163 modeli, 110 nakładkowych, 229 kondygnacji, 609 pomieszczeń, 2585 obiektów, 5164 dekoracje, 2906 stanowisk, 916 obrotów bez błędów w wykonanych kontrolach; izolacja 0, granice 0, nierozstrzygnięte sygnały przekrojów i maski ścian 0. Pozostały dokładnie 33 zgłoszenia wymiarowe w 25 modelach (138 bez takich zgłoszeń). Dane: templates/mtl/ids-regression-after-b12e.json, raport docs/MTL_AUDIT_0.3.44_PASS2B12B_E.md. Rozstrzygnąć skończoną listę korekt/indywidualnych wyjątków; nie wracać do B11. r14 bez zmian, r15 nieopublikowana.


## Checkpoint II-B12f — WIP (czat 6)
II-B12f WIP: 33 pozycji zamkniętej listy; 12 korekt w 10 modelach, 12 indywidualnych propozycji wyjątków do akceptacji, 9 nadal wymagających korekty; 60 obrotów kondygnacji sprawdzonych w V8 dla zmienionych modeli (FPS, RTS, dekoracje, kolizje, dojścia, izolacja i granice). Nie uruchamiano Node, przeglądarki, Android ani pełnego MFS. r14 bez zmian; r15 nieopublikowana. Nie powtarzać II-B11. Szczegóły w templates/mtl/pass2b12f-candidates.json.


## Checkpoint II-B12g — WIP (czat 6)
II-B12g WIP: kontrola semantyczna B12f; 11/33 korekt kandydackich, 14 indywidualnych wyjątków proponowanych do akceptacji, 8 nadal otwartych. 5 modeli zmieniono w B12g, 40 obrotów w V8; urealniono etykiety kuchni, kancelarii i jadalni, rozstrzygnięto źródło RUR_STABLE_L01 B8b. Nie uznawać strefy niespełniającej §50 za magazyn, gdy ma funkcję kuchni. Brak pełnego odbioru, r15 nieopublikowana.


## Checkpoint II-B12h–B14 — r15 review (czat 6, 2026-11-25)
Lista 33: 19 korekt, 14 uzasadnionych wyjątków proponowanych do akceptacji, 0 nierozstrzygniętych. B12h: 8 modeli, 68 obrotów V8, commit 40429f3. Rejestr: templates/mtl/pass2b12h-candidates.json, docs/MTL_AUDIT_0.3.44_PASS2B12H.md. B13: catalog-v15.json (0.15.0), 118 ID z nakładek, 163 modele/229 kondygnacji/628 pomieszczeń/2585 obiektów/5164 dekoracji/2906 stanowisk wnętrz/191 definicji mebli. Regres całej biblioteki przed korektą kotwic: 916 obrotów V8, 0 FPS/RTS/dekoracje. Pełny profil MFS początkowo wykrył 7 kotwic na wyposażeniu w 5 modelach, poprawiono je w tych samych pokojach (99fee41, r15-anchor-fixes.json); powtórna walidacja kompletnej galerii r15: 0 ERROR, 0 WARNING, 1 INFO, 230 scen, 2930 stanowisk razem z infrastrukturą; RURAL_AREAS 0. Galeria r15 na main (5bc4e43), wpis tylko w maps/review.json, r1–r14 i maps/world.json bez zmian. Raport templates/mtl/r15-mfs-final-report.json. B14 techniczny profil final pozytywny, ale nie pełna akceptacja: pominięte IDS_PROGRAM, RDS_VEHICLES, NPC_RUNTIME, MDS_MANUAL; 14 wyjątków i klasyfikacja depozytu/sztabu do akceptacji; wizualny odbiór, Node, przeglądarka/Android, Pages, offline i rzeczywista logistyka pozostają otwarte. Nie wracać do B11 ani otwierać nowej ogólnej listy wymiarowej. Przed produkcyjnym użyciem r15 rozstrzygnąć akceptację i sprawdzić wizualnie. Następnie Nowe Miasto 1, osobna mapa review, plan migracji ID i zapisów według MFS §; zachować legacy, DNS nadal wstrzymany.

| 2026-11-25 | CMS 1.0 | Migracja dokumentacji pamięci; aktualny handover, stan, backlog, plan i reguły. Kod i mapy bez zmian; nie wykonywano testów gry. | CMS_1.0.md; baza historyczna d20880ca620a092901f985d411e06597dda3c486 |

- 2026-11-25 | MTL-006: przygotowano pakiet 14 wyjątków IDS i 2 klasyfikacji BDS/FDS; 16 oczekuje decyzji. Bez zmian map/katalogu/walidatora, bez nowych testów runtime. Raport: ../MTL_R15_DECISIONS_0.3.44.md.

- 2026-11-25 | MTL-006: użytkownik zatwierdził E01–E14 i C01–C02 (16/16), uwagi: brak; zachowano wszystkie warunki odbioru. D010 i raport decyzji zaktualizowane; bez zmian kodu/map/katalogu/walidatorów i nowych testów. STOP na polecenie użytkownika.

- 2026-11-25 | MTL r15 zamrożona referencja / review. Statyczna kontrola 12 modeli/17 kondygnacji, 14 pokojów E01–E14, C01/C02, E04 198-18=180; zapisany final report i manifest zgodne. Brak rzeczywistego Node/Chromium z powodu niedostępnego pobrania repozytorium. Pełny odbiór otwarty; bez zmian kodu/map i rozpoczęcia miasta. Raport ../MTL_R15_CLOSURE_0.3.44.md.

- 2026-11-25 | CITY-001a.01 WIP: zweryfikowano 64622ba=HEAD main, przygotowano kartę i podział koncepcji; propozycja średniego miasta (192×192, 96 parceli, 72/24, 400 mieszkańców docelowo, F3/twierdza). Oczekuje akceptacji, bez kodu/map/migracji/DNS i testów. Raport ../CITY_001a_01_CONCEPT.md.
