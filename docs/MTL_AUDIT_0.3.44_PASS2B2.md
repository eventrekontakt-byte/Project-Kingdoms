# Alpha 0.3.44 — MTL Pass II-B2 (WIP)
Data: 2026-11-25. Baza r14. Program stref według MDS §§50–54,59–64. Kandydaty wyłącznie w nakładce, bez publikacji r15. Pierwszy zapis obejmował dwa modele; obsłużono brak pola notes w starszych szablonach i ponowiono próbę pozostałych dwóch.

| Model | Pomieszczenia przed → po | Stanowiska przed → po | Sprawdzone obroty kondygnacji |
|---|---:|---:|---:|
| SP_CLINIC | 2 → 6 | 10 → 14 | 8 |
| SP_KEEP_VAULT | 4 → 14 | 20 → 45 | 16 |
| CLINIC_M01 | 1 → 5 | 11 → 14 | 4 |
| HALL_M01 | 1 → 5 | 14 → 20 | 4 |
| Łącznie | 8 → 30 | 55 → 93 | 32 |

Lecznice: przyjęcia, dwie sale lecznicze i zaplecze. Ratusz: recepcja, kancelaria, sala posiedzeń, archiwum. Siedziba: wartownia, poczekalnia, sala audiencyjna, magazyn, komnata, gabinet, archiwum, pokój dzienny, łazienka i skład. Wydzielone strefy, centralne korytarze, ściany i dwukaflowe otwarte przejścia. Zewnętrzne obrysy, wejścia, schody, kondygnacje i istniejące obiekty zachowano; obiekty przełożono do stosownych stref. Dekoracje kolidujące z nową geometrią usunięto (szczegóły w JSON); kompatybilne zachowano lub przeniesiono z gospodarzem. Podziemia SP_KEEP_VAULT i SP_CLINIC bez zmian. Strefy Z0–Z5 to metadane, nie aktywna egzekucja dostępu. Dostęp publiczny SP_CLINIC przez korytarz Z1, gabaryty łazienki i skarbca w SP_KEEP_VAULT oraz jakość wizualna wymagają dalszej kontroli; nie deklarujemy pełnej zgodności IDS.

## Testy
Uruchomiono rzeczywiste funkcje MTL, FPS, RTS, dekoracji w V8 oraz kontrolę kolizji, pól portali i flood-fill dostępności kotwic/stanowisk od wejścia. Ponownie sprawdzono całą nakładkę: 32 obrotów kondygnacji kandydatów i tyle samo bazowych, bez zgłoszeń; sprawdzono zachowanie obrysów i portali. Nie wykonano pełnego MFS całej mapy, rzeczywistego uruchomienia testu Node, Android, Pages ani odbioru wizualnego. Dodano tests/mtl-pass2b2.mjs.

## Następny krok
MTL-002: karczmy, więzienia i duże domy. Dokończyć błędne heurystyki, typ depozytu i sztabu; monumentalne projekty nadal wymagają indywidualnego odbioru. Dopiero po integracji kandydatów przejść do kompilacji i pełnej walidacji r15.
