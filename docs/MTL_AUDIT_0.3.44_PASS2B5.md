# Alpha 0.3.44 — MTL Pass II-B5 (WIP)
Data: 2026-11-25. MDS §§49–54,61–64 odczytane z oryginalnego dokumentu projektu. Bazowy katalog r14; kandydaci do integracji, nie publikacja r15.

| Model | Pomieszczenia przed → po | Stanowiska przed → po |
|---|---:|---:|
| LIBRARY_M01 | 1 → 5 | 15 → 16 |
| SCHOOL_M01 | 1 → 4 | 12 → 14 |
| SP_SCHOOL | 2 → 8 | 9 → 15 |
| BATHHOUSE_M01 | 1 → 5 | 12 → 14 |
| SP_BATHHOUSE | 2 → 9 | 11 → 15 |
| SP_ARCHIVE | 2 → 9 | 10 → 15 |
| RUR_HOUSE_L01 | 3 → 15 | 23 → 27 |


W zapisanych modelach zachowano istniejące wyposażenie, obrysy, wejścia, schody i kondygnacje. Dodano funkcjonalne strefy, otwarte dwukaflowe przejścia i korytarze; deklaracje funkcji wynikają z umieszczonych stanowisk. Dekoracje przeniesiono lub usunięto w razie kolizji (wykaz JSON). Chronione archiwum: dostęp Z1/Z2, nie zmieniono na bibliotekę w pełni publiczną. Żarna/sortowanie plonów i kołowrotek w pralni pozostają do przeglądu semantycznego; nie zmieniano globalnego katalogu. Z0–Z5 to metadane, nie działające blokady. Pełne wymiary, rzeczywista szerokość i dostęp większych jednostek, pojemność i ocena wizualna pozostają otwarte.

Testy: rzeczywiste funkcje MTL/FPS/RTS/dekoracji w V8, kontrola kolizji, portali i osiągalności stanowisk/kotwic. 48 obrotów kondygnacji kandydatów i tyle samo bazy bez zgłoszeń. Node test dodany, nieuruchomiony. Pełny MFS, Android, Pages, odbiór wizualny otwarte.

Następnie: Następnie MTL-001/003/004: weryfikacja procesów zawodowych, logistyki, semantyki i klasyfikacji depozytu/sztabu. Weryfikacja indywidualnych projektów monumentalnych, IDS (w tym szerokości, wymiary, dostęp), pełna integracja r15 pozostają otwarte.
