# Alpha 0.3.44 — MTL Pass II-B4 (WIP)
Data: 2026-11-25. MDS §§49–54 (odczyt oryginalnego pliku), bazowy katalog r14. Kandydaty do późniejszej integracji, nie publikacja r15.

| Model | Pomieszczenia przed → po | Stanowiska przed → po |
|---|---:|---:|
| INN_L01 | 2 → 10 | 29 → 34 |
| LARGE_HOUSE_M01 | 2 → 10 | 24 → 25 |
| LARGE_HOUSE_M02 | 2 → 10 | 25 → 27 |
| MERCHANT_HOUSE_M01 | 2 → 10 | 23 → 24 |
| MERCHANT_HOUSE_M02 | 2 → 10 | 24 → 26 |

 
Zachowano obrysy, wejścia, schody i wszystkie dotychczasowe meble w zapisanych modelach. Rozdzielono pomieszczenia pełnymi ścianami z otwartymi przejściami dwukaflowymi, zachowano dojścia do wejść oraz schodów. Część dekoracji przeniesiono, kolizyjne usunięto (JSON). Warianty mieszkań i sklepów mają różne rozłożenie funkcji. Z0–Z5 są deklaracjami, a nie aktywnymi uprawnieniami. Nie deklarować pełnej zgodności IDS: rzeczywiste szerokości, przejścia służbowe, prywatność klientów/mieszkańców, rozmiary pomieszczeń i odbiór wizualny wymagają dalszego sprawdzenia.

Testy: rzeczywiste funkcje MTL/FPS/RTS/dekoracji w V8, własna kontrola kolizji, portali i osiągalności stanowisk/kotwic. 40 obrotów kondygnacji kandydatów i tyle samo bazy bez zgłoszeń. Node test dodany, nieuruchomiony. Pełny MFS, Android, Pages, odbiór wizualny otwarte.

Następnie: RUR_HOUSE_L01, biblioteka, szkoły, łaźnie, archiwum; potem weryfikacja procesów i logistyki. Przed integracją r15 sprawdzić szerokości, wymiary IDS i Z0–Z5.
