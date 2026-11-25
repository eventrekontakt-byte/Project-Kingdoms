# Alpha 0.3.44 — MTL Pass II-B6 (WIP)
Data 2026-11-25. Baza r14. Audyt wyposażenia 17 modeli z grupy P w raporcie II-A. Bez zmian globalnego katalogu i bez publikacji r15. Użytkownik polecił uzupełniać meble, dekoracje i wyposażenie w dalszej produkcji.

| Model | Cel | Nowe meble | Dodane dekoracje | Usunięte nieadekwatne dekoracje | Nowe stanowiska |
|---|---|---:|---:|---:|---:|
| WORKSHOP_M01 | obróbka drewna, toczenie i składowanie desek | 2 | 6 | 2 | 2 |
| WORKSHOP_L01 | przędzenie, tkanie i składowanie tkanin | 2 | 5 | 4 | 2 |
| BARBER_S01 | narzędzia balwierza, mycie i czysta bielizna | 2 | 5 | 0 | 2 |
| REPAIR_M01 | naprawy, materiały i wydawanie obuwia | 2 | 4 | 2 | 2 |
| SCRIVENER_S01 | pisanie dokumentów, archiwum i kancelaria | 2 | 8 | 1 | 2 |
| COOPER_M01 | obróbka klepek i odbiór beczek | 2 | 4 | 0 | 2 |
| WEAVER_M01 | przędza i gotowe tkaniny | 2 | 6 | 1 | 2 |
| DYER_M01 | barwienie, suszenie i gotowa tkanina | 2 | 5 | 1 | 2 |
| POTTER_S01 | suszenie przed wypałem i przechowywanie ceramiki | 2 | 5 | 2 | 2 |
| POTTER_L01 | surowa glina i osobny odbiór ceramiki | 2 | 4 | 2 | 2 |
| MASON_M01 | obróbka kamienia, narzędzia, skład surowca | 2 | 5 | 2 | 2 |
| CANDLE_M01 | formowanie i składowanie świec; semantyka pieca osobno | 2 | 5 | 2 | 2 |
| PAPER_M01 | prasowanie i suszenie arkuszy | 2 | 3 | 3 | 2 |
| GLASS_M01 | skład półfabrykatów i gotowe szkło; suszarnia do dalszej kontroli procesu | 2 | 7 | 4 | 2 |
| FOUNDRY_L01 | odlewanie, surowce metalowe, narzędzia i wyroby | 2 | 4 | 0 | 2 |
| RUR_ANNEX_S01 | oficyna do sortowania plonów i przechowywania zapasów | 2 | 9 | 2 | 2 |
| RUR_WORKYARD_S01 | gospodarcze naprawy drewna, narzędzia i sortowanie; semantyka żaren osobno | 2 | 7 | 0 | 2 |
| Razem | | 34 | 92 | 28 | 34 |

Wykorzystano istniejące typy mebli i dekoracji z r14. Dodano narzędzia, stanowiska, składy i tematyczne przedmioty na odpowiednich gospodarzach, z uwzględnieniem allowedHosts, slotów i przejść. Usunięto nieadekwatne przedmioty (np. glina w papierni). Zachowano obrysy, wejścia, schody, podział pomieszczeń i stare meble. 0 proponowanych mebli pominięto, gdy nie znaleziono bezkolizyjnej pozycji. Szczegóły w JSON. Nie deklarować aktywnej produkcji, ekonomii, pełnego programu technologicznego ani zgodności MDS tylko na podstawie rozmieszczenia. Semantyka mielenia, sortowania, wypału i innych czynności pozostaje odrębnym zadaniem. Ocena wizualna, rzeczywiste szerokości i pojemność otwarte.

Testy: rzeczywiste funkcje MTL/FPS/RTS/dekoracji w V8, kontrola kolizji, portali, dostępności stanowisk/kotwic. 68 obrotów kondygnacji kandydatów i tyle samo bazy bez zgłoszeń. Test Node dodany, nieuruchomiony. Pełny MFS, Android, Pages i wizualny odbiór otwarte.


Następnie: MTL-003: magazyny, spichlerze, stodoły, stajnie, obory i dojazdy. Szerokie wrota wymagają sprawdzenia formatu portali/runtime; nie udawać szerokiej bramy przez jednokaflowy portal. MTL-004: semantyka 9 urządzeń, klasyfikacja depozytu/sztabu, indywidualne projekty monumentalne. Przed r15 kontrola IDS, visual review i pełny MFS.
