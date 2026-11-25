# Alpha 0.3.44 — MTL Pass II-B7 (WIP)
Data 2026-11-25. Baza r14. MDS §§21,50,53–56,60: szerokość przejścia gospodarczego 2–3, wrót 2–4. Zbadano 16 modeli L z II-A. Kandydaci nie zintegrowani.

| Model | Nowe meble | Dekoracje | Stanowiska + | Wolny prostokąt przy wejściu (szer.×gł.) |
|---|---:|---:|---:|---|
| WAREHOUSE_M01 | 2 | 2 | 2 | 3×4 |
| GRANARY_M01 | 2 | 4 | 2 | 3×3 |
| BARN_M01 | 2 | 5 | 2 | 3×4 |
| STABLE_M01 | 2 | 2 | 2 | 3×4 |
| CARPENTER_M01 | 2 | 3 | 2 | 3×4 |
| SUPPLY_L01 | 2 | 6 | 2 | 3×4 |
| RUR_GRANARY_S01 | 1 | 6 | 1 | 3×4 |
| RUR_GRANARY_M01 | 4 | 12 | 4 | 3×4 |
| RUR_BARN_M01 | 2 | 5 | 2 | 3×4 |
| RUR_BARN_L01 | 4 | 9 | 4 | 3×4 |
| RUR_STABLE_M01 | 2 | 3 | 2 | 3×4 |
| RUR_STABLE_L01 | 4 | 6 | 4 | 3×4 |
| RUR_BYRE_M01 | 2 | 2 | 2 | 3×4 |
| RUR_SAWMILL_M01 | 4 | 7 | 4 | 3×4 |
| RUR_SHED_M01 | 4 | 11 | 4 | 3×4 |
| SP_MINE_STORE | 4 | 6 | 4 | 3×4 |
| Razem | 43 | 89 | 43 | — |

Pomiar: największa szerokość do 3, następnie głębokość do 4 pól prostokąta zawierającego pole przybycia za drzwiami, bez ścian, obiektów, stanowisk interakcji ani innych pól portali. Nie jest to pomiar całej trasy dostaw. Zachowano najlepszy istniejący prostokąt przy wejściu i wszystkie wcześniejsze portale, geometrię, wyposażenie, dekoracje. 16/16 kandydatów ma prostokąt szerokości co najmniej 2; nie oznacza to szerokich wrót. 0 dodatkowych mebli pominięto z powodu braku bezkolizyjnej pozycji. Dopasowano dekoracje do zawodów i przeznaczenia. Silnik MFS aktualnie używa pojedynczych pól trigger i arrival; MDS 2–4 dla wrót nie spełnione. Nie rozszerzano formatu bez migracji/QA. Zewnętrzny dojazd, wybiegi, nośność/transport pionowy, manewrowanie większych jednostek, semantyka sprzętu i pełna zgodność IDS pozostają otwarte.

Testy: rzeczywiste funkcje MTL/FPS/RTS/dekoracji w V8 plus własna kontrola kolizji i dostępności. 88 obrotów kondygnacji kandydatów bez zgłoszeń. Test Node zapisany, nieuruchomiony; pełny MFS, Android, Pages i wizualny odbiór otwarte.
Wszystkie 16 modeli zapisano jako kandydatów.

Następnie: MTL-003: rzeczywista obsługa szerokich portali (MFS/core/validator/viewer i kompatybilność), poprawa zbyt małych pól dojścia, kontrola dojazdów i wybiegów na mapie. Następnie MTL-004: semantyka i klasyfikacja; monumentalne projekty i dekoracje wcześniejszych modeli; pełna integracja i walidacja r15.
