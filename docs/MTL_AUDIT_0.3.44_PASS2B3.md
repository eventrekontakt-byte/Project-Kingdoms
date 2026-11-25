# Alpha 0.3.44 — MTL Pass II-B3 (WIP)
Baza r14, 2026-11-25. MDS §§49–54,59–61: cele 2×3–4×5, karczma: obsługa gości, kuchnia i magazyn, komunikacja niezależna. Kandydaty nie są zintegrowane z galerią.

| Model | Pomieszczenia przed → po | Stanowiska przed → po |
|---|---:|---:|
| SP_INN_CELLAR | 2 → 5 | 17 → 19 |
| PRISON_M01 | 2 → 6 | 11 → 13 |

## Otwarte modele
- INN_L01: Error: portal wall 10,22
- SP_PRISON_DEEP: 0/-1 inaccessible room corridor; 0/-1 inaccessible room corridor; 0/-2 inaccessible room corridor; 0/-2 inaccessible room corridor; 90/-1 inaccessible room corridor
 
Wyłącznie zapisane modele: zachowane obrysy, wejścia i schody, podział ścianami z otwartymi progami oraz dostęp z komunikacji. Istniejące obiekty przeniesiono; usunięte dekoracje wykazano w JSON. Cele mają użytkowy prostokąt 4×5, ale kontrola dostępu Z5 jest metadanymi, nie zamykanymi drzwiami. Weryfikacja korytarzy na całej długości i manewrowania, wymiarów innych izb, stref dostępu oraz odbiór wizualny pozostają otwarte. Nie deklarować zgodności końcowej IDS.

Testy: rzeczywiste funkcje MTL/FPS/RTS/dekoracji w V8, kontrola kolizji, portali i osiągalności stanowisk/kotwic. 12 obrotów kondygnacji kandydatów bez zgłoszeń, tyle samo bazy. Node test dodany, nieuruchomiony. Pełny MFS, Android, Pages, wizualna ocena otwarte. 
Następnie: Dokończyć INN_L01, SP_PRISON_DEEP. Następnie duże domy i rezydencje kupieckie; kontrola szerokości korytarzy, klasyfikacji i dalsza integracja r15.
