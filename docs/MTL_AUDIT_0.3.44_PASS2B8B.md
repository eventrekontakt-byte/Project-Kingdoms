# Alpha 0.3.44 — MTL II-B8b — szerokie wrota gospodarcze (review)
Data 2026-11-25. Kontynuacja II-B8a i II-B7. MDS §§53–54: przejście gospodarcze 2–3, wrota magazynowe 2–4, skala wnętrza 1:2. Wykorzystano nowy mechanizm portali z II-B8a.
 
| Model | Wersja przed → po | Zewnętrze × wnętrze (pola progu) | Wolna szerokość × głębokość za progiem | Przesunięte dekoracje |
|---|---:|---:|---:|---:|
| WAREHOUSE_M01 | 7 → 8 | 2 / 4 | 4×4 | 0 |
| GRANARY_M01 | 4 → 5 | 2 / 4 | 4×3 | 0 |
| BARN_M01 | 4 → 5 | 2 / 4 | 4×4 | 0 |
| STABLE_M01 | 4 → 5 | 2 / 4 | 4×4 | 0 |
| CARPENTER_M01 | 3 → 4 | 2 / 4 | 4×4 | 0 |
| SUPPLY_L01 | 3 → 4 | 2 / 4 | 4×4 | 0 |
| RUR_GRANARY_S01 | 3 → 4 | 1 / 2 | 2×4 | 0 |
| RUR_GRANARY_M01 | 3 → 4 | 2 / 4 | 4×4 | 0 |
| RUR_BARN_M01 | 3 → 4 | 2 / 4 | 4×4 | 0 |
| RUR_BARN_L01 | 3 → 4 | 2 / 4 | 4×4 | 0 |
| RUR_STABLE_M01 | 2 → 3 | 2 / 4 | 4×4 | 0 |
| RUR_STABLE_L01 | 3 → 4 | 2 / 4 | 4×4 | 0 |
| RUR_BYRE_M01 | 2 → 3 | 2 / 4 | 4×4 | 0 |
| RUR_SAWMILL_M01 | 3 → 4 | 2 / 4 | 4×4 | 0 |
| RUR_SHED_M01 | 3 → 4 | 2 / 4 | 4×4 | 0 |
| SP_MINE_STORE | 3 → 4 | 2 / 4 | 4×4 | 0 |

15 modeli ma wrota 2 pola na zewnątrz / 4 we wnętrzu, mały spichlerz RUR_GRANARY_S01 — 1/2. Wewnętrzny pierwszy pas jest wyrównany do 2× współrzędnej zewnętrznej. Wybrano najbliższe poprawne położenie względem poprzedniego wejścia, z uwzględnieniem głębokości wolnego dojścia; niektóre pierwsze pola drzwi przesunięto. Zachowano obrysy, schody, wyposażenie, stanowiska, układ pomieszczeń i wszystkie dekoracje II-B7 (0 przesuniętych, 0 usuniętych). Nowe meble/dekoracje nie były celem II-B8b; dalsze wzbogacanie wnętrz w II-B11.

## Wykonane testy
- 64 instancji (16 modeli × 4 orientacje) rzeczywiście skompilowanych przez compileMap w V8 na odrębnych, syntetycznych parcelach z drogą; 152 skompilowanych scen.
- 372 pól przejścia (zewnętrze i wnętrze, wszystkie orientacje): rzeczywisty kafel door, wspólny identyfikator, poprawny cel przybycia, wolne pole dojścia.
- 88 obrotów kondygnacji: FPS, RTS, dekoracje, kolizje, flood-fill do wszystkich pól przybycia, stanowisk i kotwic.
- Wnętrza: 14 modeli 4×4, GRANARY_M01 4×3, mały spichlerz 2×4. Nie jest to pomiar przejazdu na całej trasie; brak wniosków o większych aktorach.
- Dodano tests/mtl-pass2b8b.mjs; test odtworzony w V8, nieuruchomiony w Node. Nie wykonywano pełnego walidatora MFS dla rzeczywistej galerii, testu UI, Android, offline, transportu zwierząt i ładunków ani odbioru wizualnego.

## Integracja
`templates/mtl/pass2b8b-candidates.json` zastępuje 16 modeli z II-B7 (nie dodaje nowych identyfikatorów). Przy składaniu r15 nakładki stosować w kolejności B1–B7, następnie B8b, używając najnowszej wersji danego ID. Łącznie nadal 56 unikatowych kandydatów; r14 niezmieniona. Nie publikować r15 przed pełną walidacją.

## Dalej
II-B9: semantyka 9 urządzeń oraz klasyfikacja DEPOSIT_M01, COMMAND_M01, SP_PORT. II-B10 monumentalne, II-B11 meble i dekoracje wcześniejszych wnętrz, II-B12 IDS/pojemności/dostępy, II-B13 integracja, II-B14 testy. Dalsza kontrola dojazdów i wybiegu na rzeczywistej mapie, zewnętrznej logistyki oraz większych jednostek pozostaje otwarta.
