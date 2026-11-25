# MTL II-B12a — ukierunkowane korekty komunikacji
2026-11-25, czat (5). Źródło: końcowy przegląd 163 modeli, HEAD 7fcbbdf93abfa5660ba15604cfbdc2b8d33a2ad1. MDS §§49–56,60–61: rzeczywiste przejścia, pola użycia, komunikacja. Nakładka templates/mtl/pass2b12a-candidates.json, commit d696c5b2379c04ff60263328cedfc51c46c39fa7. Nie zmieniano r14 ani silnika; r15 nieopublikowana.

## Wynik
28 modeli objętych zgłoszeniami ISOLATED_FREE_CELLS/CUT_OCCUPIED. 25 zmieniono; 29 operacji przesunięcia istniejących obiektów i powiązanych dekoracji. 35→3 izolowane pola, 9→1 zajętych odcinków logicznej granicy RTS. Bez dodawania/usuwania mebli, dekoracji, ścian, zmian orientacji, wejść, schodów, pokojów i zależności. 14 zmienionych modeli dotąd pochodziło bezpośrednio z r14; teraz 93 unikatowe ID nakładek (163 modele łącznie).

| ID | Przesunięcia | Izolowane przed→po | Granice przed→po |
|---|---:|---:|---:|
| HOUSE_S01 | 1 | 1 → 0 | 0 → 0 |
| HOUSE_S02 | 1 | 1 → 0 | 0 → 0 |
| HOUSE_S03 | 1 | 2 → 0 | 0 → 0 |
| SHOP_S01 | 3 | 0 → 0 | 3 → 0 |
| SHOP_M01 | 1 | 0 → 0 | 1 → 0 |
| SHOP_L01 | 1 | 0 → 0 | 1 → 0 |
| BAKERY_M01 | 2 | 0 → 0 | 2 → 0 |
| APOTHECARY_M01 | 1 | 1 → 1 | 1 → 0 |
| INN_M01 | 0 | 0 → 0 | 1 → 1 |
| LIBRARY_M01 | 1 | 1 → 0 | 0 → 0 |
| SCHOOL_M01 | 2 | 3 → 0 | 0 → 0 |
| BARN_M01 | 1 | 1 → 0 | 0 → 0 |
| BATHHOUSE_M01 | 1 | 1 → 0 | 0 → 0 |
| GUILDHALL_M01 | 1 | 1 → 0 | 0 → 0 |
| BAKERY_L01 | 1 | 1 → 0 | 0 → 0 |
| HOUSE_S04 | 0 | 1 → 1 | 0 → 0 |
| HOUSE_S05 | 0 | 1 → 1 | 0 → 0 |
| HOUSE_S06 | 1 | 2 → 0 | 0 → 0 |
| BARBER_S01 | 1 | 1 → 0 | 0 → 0 |
| APOTHECARY_M02 | 1 | 1 → 0 | 0 → 0 |
| SMITHY_X01 | 1 | 2 → 0 | 0 → 0 |
| WEAVER_M01 | 1 | 2 → 0 | 0 → 0 |
| POTTER_S01 | 1 | 2 → 0 | 0 → 0 |
| PAPER_M01 | 1 | 1 → 0 | 0 → 0 |
| GLASS_M01 | 1 | 4 → 0 | 0 → 0 |
| ARMORY_S02 | 1 | 2 → 0 | 0 → 0 |
| NOB_KEEP_S01 | 1 | 1 → 0 | 0 → 0 |
| RUR_HOUSE_L01 | 1 | 2 → 0 | 0 → 0 |

## Metoda i testy
Deterministyczna próba przesunięcia obiektów bez obrotu o 1–4 pola od aktualnej pozycji, tylko gdy poprawia wynik i nie pogarsza drugiej metryki, nie zmienia przynależności do pokoju ani nie pogarsza liczby stanowisk w innym pokoju. Chroniono kotwice, stanowiska innych obiektów, wejścia, pola przybycia i czteropolowe dojście do wielopolowego wejścia. Powiązane dekoracje przesunięto razem z hostem. Wszystkie 128 obrotów kondygnacji (28 modeli, także 3 niezmienione) przeszły MTL/FPS/RTS/dekoracje, kontrole kolizji, osiągalności celów od każdego pola przybycia i braku pogorszenia obu metryk. Pierwsza próba zatrzymała się na braku notes w starszym modelu, poprawiono obsługę i wykonano ponownie. Nie jest to pełny pomiar przekrojów IDS, manewrowania wielopolowych jednostek, szerokości wszystkich tras, pojemności ani test pełnej galerii MFS. Test Node, Android, offline, Pages i wizualny odbiór otwarte.

## Pozostałe cztery przypadki
- APOTHECARY_M01: poziom 0: 1 izolowanych pól [{"x":10,"y":1}], 0 zajętych odcinków [].
- INN_M01: poziom 0: 0 izolowanych pól [], 1 zajętych odcinków [[{"x":6,"y":1},{"x":7,"y":1}]].
- HOUSE_S04: poziom 0: 1 izolowanych pól [{"x":8,"y":1}], 0 zajętych odcinków [].
- HOUSE_S05: poziom 0: 1 izolowanych pól [{"x":8,"y":1}], 0 zajętych odcinków [].
Nie wymuszać przebudowy wyłącznie dla zera w heurystyce. Ustalić, czy wolny zakamarek jest potrzebny i czy logiczna granica odpowiada realnemu przejściu. Dopuszczalna korekta z obrotem/przestawieniem powiązanych mebli po indywidualnej analizie.

## Dalej
II-B12b: rozstrzygnąć cztery resztkowe przypadki, przeanalizować 29 obwiedni pokojów w 26 modelach według rzeczywistego IDS §50 (uwzględnić nieregularne i wielofunkcyjne rzuty), cztery piętra zamków z wysokim udziałem ścian; następnie pozostałe bramki IDS, klasyfikacja i rzeczywiste przekroje/pojemność. Nie rozpoczynać masowego meblowania. B13 integracja, B14 QA. Stosować B12a po B11c i definicjach mebli B9. 
