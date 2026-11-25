# Alpha 0.3.44 — MTL II-B11b (WIP)
2026-11-25, czat (5). Baza r14 i B2–B4 (bez SP_KEEP_VAULT, nowszy B10b); B9 nie zastępuje żadnego z tych 11 ID. MDS 1.0 §§50–51,56–61: program funkcjonalny, pola użycia, dekoracje, pojemność i odbiór. D006. Nakładka templates/mtl/pass2b11b-candidates.json, commit f808489fa3f00b04af9484d2721b0f16def15925. Wersja każdego modelu +1 względem użytej nakładki; r14 bez zmian, r15 nieopublikowana.

| Model | Meble + | Dekoracje + | Stanowiska przed → po | Obroty |
|---|---:|---:|---:|---:|
| SP_CLINIC | 4 | 12 | 14 → 18 | 8 |
| CLINIC_M01 | 3 | 10 | 14 → 17 | 4 |
| HALL_M01 | 3 | 8 | 20 → 25 | 4 |
| SP_INN_CELLAR | 4 | 13 | 19 → 23 | 8 |
| PRISON_M01 | 3 | 9 | 13 → 18 | 4 |
| SP_PRISON_DEEP | 4 | 28 | 30 → 34 | 16 |
| INN_L01 | 6 | 19 | 34 → 40 | 8 |
| LARGE_HOUSE_M01 | 6 | 13 | 25 → 31 | 8 |
| LARGE_HOUSE_M02 | 6 | 14 | 27 → 33 | 8 |
| MERCHANT_HOUSE_M01 | 6 | 19 | 24 → 30 | 8 |
| MERCHANT_HOUSE_M02 | 6 | 20 | 26 → 32 | 8 |
| Razem | 51 | 165 | 246 → 301 | 84 |

## Wyposażenie
- SP_CLINIC: medical_supply (0, treatment); notice_board (0, reception); medical_supply (0, treatment); shelf (-1, storage).
- CLINIC_M01: medical_supply (0, treatment); notice_board (0, reception); medical_supply (0, treatment).
- HALL_M01: writing_desk (0, council_hall); bench (0, reception); archive_shelf (0, chancery).
- SP_INN_CELLAR: table_small (0, tavern_hall); food_rack (0, kitchen); shelf (0, storage); shelf (-1, storage).
- PRISON_M01: prison_bench (0, detention_cell); washstand (0, washroom); watch_desk (0, guardroom).
- SP_PRISON_DEEP: military_locker (0, guardroom); military_locker (1, guardroom); military_locker (-1, guardroom); military_locker (-2, guardroom).
- INN_L01: table_small (0, tavern_hall); food_rack (0, kitchen); shelf (0, storage); chest (1, guest_room); side_table (1, guest_room); chest (1, guest_room).
- LARGE_HOUSE_M01: chest (0, bedroom); chest (0, bedroom); cooking_prep (0, kitchen); chest (1, bedroom); side_table (1, bedroom); bookcase (1, office).
- LARGE_HOUSE_M02: chest (0, bedroom); chest (0, bedroom); side_table (0, living_room); chest (1, bedroom); side_table (1, bedroom); writing_desk (1, office).
- MERCHANT_HOUSE_M01: writing_desk (0, office); shelf (0, storage); crate (0, storage); chest (1, bedroom); linen_cabinet (1, washroom); cooking_prep (1, kitchen).
- MERCHANT_HOUSE_M02: writing_desk (0, office); workbench (0, workshop); shelf (0, storage); chest (1, bedroom); bookcase (1, office); armchair (1, living_room).
Dobór według typu pokoju, indywidualnie utrwalone pozycje z deterministycznej próby rozmieszczenia. Maksymalnie trzy nowe meble na kondygnację (dwa w podziemiach SP_PRISON_DEEP); zachowano równe wyposażenie cel głębokich podziemi. Nie jest to generator runtime. Dekoracje na dopuszczonych hostach, maksymalnie jeden nowy prop na obiekt, i tematyczne dekoracje ścienne. Wszystkie wcześniejsze obiekty, dekoracje, program pokojów, ściany, wejścia i schody zachowane. Użyto istniejących definicji, bez nowych mechanik. Jedna cela PRISON_M01 nie pomieściła planowanej ławy przy przyjętych ograniczeniach; nie wymuszono montażu. Weryfikacja wyrównania wyposażenia cel w B12.

## Testy i ograniczenia
V8: 84 obroty kondygnacji nowych modeli i 84 obroty bazy. FPS/RTS/dekoracje, kolizje, blokady wejść/schodów, osiągalność wszystkich kotwic i stanowisk od zbioru pól przybycia, brak wzrostu liczby nieosiągalnych wolnych pól oraz brak pogorszenia liczby nieosiągalnych celów od każdego indywidualnego pola przybycia. 0 zgłoszeń w tych kontrolach; dostępne pola 4709 → 4612 (97 zajętych przez dodane wyposażenie). Nie jest to dowód zachowania minimalnych przekrojów IDS, pełnego MFS ani zgodności przypisania wszystkich stanowisk do pokoju i strefy; ocena wizualna i pojemność funkcjonalna otwarte. Node, Android, offline, Pages nie wykonane. Cele i strefy nadal bez egzekwowania dostępu runtime. Żadnych nowych ID: nadal 79 unikatowych kandydatów. B11a+B11b: 15 zaktualizowanych modeli, +64 meble, +198 dekoracji, +68 stanowisk, 100 obrotów kandydatów.

## Dalej
II-B11c: LIBRARY_M01, SCHOOL_M01, SP_SCHOOL, BATHHOUSE_M01, SP_BATHHOUSE, SP_ARCHIVE, RUR_HOUSE_L01 (ostatni z B9, definicje v2). Potem warsztaty, gospodarcze, sakralne i pozostałe wcześniejsze przebudowy według najnowszego ID. B12 IDS, B13 integracja, B14 QA. Zachować B8b przed B7 i B9 definicje mebli v2; nakładki B11a i B11b po B10b. Nie nadpisywać r14.
