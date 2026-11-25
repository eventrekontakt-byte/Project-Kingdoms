# Alpha 0.3.44 — MTL II-B11a (WIP)
2026-11-25, czat (5). Wznowienie z HEAD 20293c8db66a902ac735ff4a9242de6c9d637abc (B10b). MDS §§49–61, w szczególności §51, §55–60; D006. Pierwsza z partii wyposażenia wcześniejszych przebudów. Nakładka templates/mtl/pass2b11a-candidates.json, commit 9ab560c2129ee4c03412a54fdfffb842ad1ca614.

| Model | Meble + | Dekoracje + | Stanowiska przed → po | Dostępne pola przed → po |
|---|---:|---:|---:|---:|
| BARRACKS_S02 | 3 | 7 | 11 → 14 | 221 → 215 |
| BARRACKS_L02 | 4 | 8 | 17 → 21 | 339 → 330 |
| OFFICER_M01 | 3 | 9 | 11 → 14 | 155 → 149 |
| GUARDHOUSE_L02 | 3 | 9 | 11 → 14 | 132 → 125 |
| Razem | 13 | 33 | 50 → 63 | 847 → 819 |

Dodano łóżka piętrowe, szafki wojskowe, ławy, skrzynię zaopatrzeniową, stół, skrzynię osobistą, biurko odpraw, regał i tablicę ogłoszeń. Tematyczne dekoracje powierzchniowe i ścienne: wyposażenie wojskowe, racje, dokumenty, książki, środki higieny, mapy i oświetlenie. Użyto istniejących definicji katalogu; te cztery ID nie występują w późniejszych nakładkach B2–B10b (według rejestru i listy B9). Zachowano wszystkie wcześniejsze obiekty, dekoracje, pomieszczenia, ściany, wejścia i zależności. Wersje modeli 3→4; liczba unikatowych ID nadal 79. Rozmieszczenie deterministyczne, na etapie projektowym, z preferencją obrzeży pomieszczeń; nie jest generacją runtime.

## Walidacja
V8: 16 obrotów nowych kondygnacji oraz 16 obrotów poprzednich wersji, bez zgłoszeń FPS/RTS/dekoracji, kolizji mebli, blokad wejścia, nieosiągalnych kotwic i stanowisk. BFS od pól przybycia: bez wzrostu liczby nieosiągalnych wolnych pól; spadek liczby dostępnych pól o 28 wynika z zajętości nowych mebli. Wszystkie 13 planowanych mebli rozmieszczono. Nie oznacza to weryfikacji minimalnych szerokości IDS ani jakości wizualnej; szczególnie nowe meble przy komunikacji należy ocenić w B12. Pierwsze wywołanie V8 przerwane przez obsługę składni export async; poprawione i wykonane ponownie. Node, pełny MFS, Android, offline, Pages i odbiór wizualny nie wykonane. Próba git ls-remote w kontenerze nie powiodła się (DNS); użyto działającego konektora GitHub. Nie wydano r15, nie zmieniono r14.

## Dalej
II-B11b: lecznice, ratusz, karczmy, więzienia i rezydencje (najnowsze nakładki, nie nadpisywać B10b dla SP_KEEP_VAULT). Kolejne partie B11: obiekty edukacyjne, łaźnie, warsztaty, gospodarcze, sakralne i pozostałe; nie uznawać B11a za cały etap. B12 IDS, B13 integracja, B14 QA. Zachować B9 definicje v2 oraz pierwszeństwo B8b nad B7.
