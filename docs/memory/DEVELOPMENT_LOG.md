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
