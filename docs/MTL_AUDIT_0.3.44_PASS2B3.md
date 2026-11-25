# Alpha 0.3.44 — MTL Pass II-B3 (WIP)
Data 2026-11-25. Baza r14; MDS §§49–54,59–61. Modele nie są zintegrowane z galerią.

| Model | Pomieszczenia przed → po | Stanowiska przed → po |
|---|---:|---:|
| SP_INN_CELLAR | 2 → 5 | 17 → 19 |
| PRISON_M01 | 2 → 6 | 11 → 13 |
| SP_PRISON_DEEP | 4 → 18 | 22 → 30 |
| Łącznie | 8 → 29 | 50 → 62 |

Karczma z piwnicą: kuchnia, magazyn, sala obsługi i korytarz. Areszt: dwie cele 4×5, łazienka, straż. Więzienie głębokie: 6 cel 4×5 na każdym z dwóch poziomów podziemnych, korytarz główny 6 pól i wartownia 6×4. Zastąpiono niedostępne obszary pełnymi ścianami; nadziemne piętra zachowane. Dotychczasowe wejścia, schody, obiekty zachowano; zmieniono położenie obiektów, dodano 8 prycz. Dekoracje usunięte/zmienione w JSON. Dostęp Z3/Z5 i otwarte progi nie są zamykanymi drzwiami. Pomiar wszystkich szerokości i manewrowania, pozostałych pomieszczeń oraz odbiór wizualny otwarte.

## Testy
Rzeczywiste funkcje MTL, FPS, RTS, dekoracji w V8, kontrola kolizji, portali i dostępności stanowisk/kotwic. 28 obrotów kondygnacji zapisanych kandydatów bez zgłoszeń. Wstępna próba SP_PRISON_DEEP miała niedostępne fragmenty korytarzy; skorygowano i ponowiono testy. Test Node dodany, nieuruchomiony. Pełny MFS, Android, Pages i odbiór wizualny otwarte.

## Następny krok
Dokończyć INN_L01 (wejście parteru: x10,y23, pole przybycia x10,y22; nie zabudowywać). Następnie duże domy i rezydencje kupieckie; kontrola szerokości korytarzy, klasyfikacji i dalsza integracja r15.
