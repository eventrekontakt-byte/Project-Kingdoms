# Alpha 0.3.44 — MTL II-B11c (WIP)
2026-11-25, czat (5). Baza B5, RUR_HOUSE_L01 z nowszej B9. Zachowano wersjonowane definicje mebli B9 v2 (dołączane do r14). D006. Nakładka templates/mtl/pass2b11c-candidates.json, commit 43180a512e159a1e075fc5521b941667e69f1b3f. Wersja każdego modelu +1 względem użytej nakładki. r14 bez zmian; r15 nieopublikowana.

| Model | Meble + | Dekoracje + | Stanowiska przed → po | Obroty |
|---|---:|---:|---:|---:|
| LIBRARY_M01 | 3 | 12 | 16 → 19 | 4 |
| SCHOOL_M01 | 3 | 9 | 14 → 17 | 4 |
| SP_SCHOOL | 6 | 25 | 15 → 21 | 8 |
| BATHHOUSE_M01 | 3 | 9 | 14 → 17 | 4 |
| SP_BATHHOUSE | 6 | 16 | 15 → 21 | 8 |
| SP_ARCHIVE | 6 | 21 | 15 → 21 | 8 |
| RUR_HOUSE_L01 | 9 | 22 | 27 → 40 | 12 |
| Razem | 36 | 114 | 116 → 156 | 48 |

## Wyposażenie
- LIBRARY_M01: reading_desk (0, library); bookcase (0, reading_room); bookcase (0, office).
- SCHOOL_M01: school_desk (0, classroom); bookcase (0, office); bookcase (0, library).
- SP_SCHOOL: school_desk (0, classroom); bookcase (0, library); writing_desk (0, office); bookcase (1, archive); writing_desk (1, office); reading_desk (1, reading_room).
- BATHHOUSE_M01: washstand (0, bath_hall); washstand (0, bath_hall); linen_cabinet (0, laundry).
- SP_BATHHOUSE: washstand (0, bath_hall); linen_cabinet (0, changing_room); washstand (0, bath_hall); shelf (-1, storage); shelf (-1, storage); water_tub (-1, laundry).
- SP_ARCHIVE: bookcase (0, archive); reading_desk (0, reading_room); writing_desk (0, office); bookcase (-1, archive); bookcase (-1, archive); writing_desk (-1, office).
- RUR_HOUSE_L01: farm_cupboard (0, bedroom); farm_bench (0, living_room); cooking_prep (0, kitchen); chest (1, bedroom); farm_bench (1, living_room); chest (1, bedroom); root_bin (2, workshop); shelf (2, storage); farm_tool_rack (2, workshop).
Dobór według programu pokoju, do trzech nowych mebli na kondygnację, pozycje utrwalone deterministycznie na etapie projektu, nie runtime. Dodatkowe rezerwowanie końców roomCuts i wymaganie, aby nowe stanowiska mieściły się w pokoju obiektu. Dekoracje ścienne i powierzchniowe na zgodnych hostach; zachowano wcześniejsze wyposażenie, dekoracje, układy, wejścia i schody. BATHHOUSE_M01: w przebieralni nie znaleziono zgodnego miejsca dla planowanego dodatkowego mebla; zachowano dotychczasowe wyposażenie, kontrola w B12. Nie zmieniano programu pokojów ani funkcji runtime.

## Testy i ograniczenia
V8: 48 obrotów kondygnacji nowych modeli i 48 obrotów bazy, bez zgłoszeń FPS/RTS/dekoracji, kolizji obiektów, blokad portali i nieosiągalnych kotwic/stanowisk. Brak wzrostu liczby niedostępnych wolnych pól i brak pogorszenia liczby niedostępnych celów od indywidualnych pól przybycia. Dodatkowo sprawdzono położenie wszystkich nowych stanowisk w pokoju obiektu w każdym obrocie. Nowe meble nie zajmują końców istniejących roomCuts. Dostępne pola 2363 → 2282 (81 zajętych przez wyposażenie). Nie sprawdzono pełnej szerokości korytarzy IDS, wszystkich starych stanowisk względem pokoju, pojemności i estetyki; pełny MFS, Node, Android, offline, Pages oraz wizualny odbiór otwarte. 79 unikatowych kandydatów, bez nowych ID. B11a–c: 22 modele, +100 mebli, +312 dekoracji, +108 stanowisk, 148 obrotów kandydatów.

## Dalej
II-B11d: warsztaty z B6 (najnowsze nakładki, uwzględnić B9 i B8b, jeśli dotyczy). Następnie budynki gospodarcze z B7/B8b/B9 i pozostałe wcześniej przebudowane modele, w tym sakralne i monumentalne. B12: IDS, wymiary, szerokości, klasyfikacja, pojemność, strefy, proporcje ścian i wizualna kontrola; zweryfikować także wcześniejsze dodatki B11a/b pod kątem roomCuts i przynależności nowych stanowisk. B13 integracja, B14 QA. Nie nadpisywać r14.
