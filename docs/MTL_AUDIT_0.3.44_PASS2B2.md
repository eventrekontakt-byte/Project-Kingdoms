# Alpha 0.3.44 — MTL Pass II-B2 (WIP)
Data: 2026-11-25. Baza r14. Projekt stref wg MDS §§50–54,59–64, w szczególności leczenie/przyjęcie pacjentów, administracja/obsługa mieszkańców, administracja/mieszkanie/reprezentacja w siedzibie władcy. Wnętrza nadal review. Zmiany wyłącznie w nakładce kandydatów, bez publikacji r15.

| Model | Pomieszczenia przed → po | Stanowiska przed → po | Kontrola obrotów |
|---|---:|---:|---:|
| SP_CLINIC | 2 → 6 | 10 → 14 | 8/ 8 |
| SP_KEEP_VAULT | 4 → 14 | 20 → 45 | 16/ 16 |

Wydzielone strefy z centralnym korytarzem, ścianami i dwukaflowymi otwartymi przejściami. Lecznice: oddzielne przyjęcia, sale lecznicze, zaplecze. Ratusz: obsługa, kancelaria, sala posiedzeń i archiwum. Siedziba: reprezentacja, mieszkanie, strefy administracyjne, istniejące podziemia zachowane. Dotyczy wyłącznie modeli, które przeszły test i znalazły się w nakładce. Zachowano dotychczasowe obiekty, przeniesiono je do właściwych stref, dodano celowe wyposażenie. Dekoracje kolidujące z nową geometrią usunięto (wykaz w JSON); kompatybilne przeniesiono z gospodarzem lub zachowano. Zachowano zewnętrzne obrysy, wejścia, schody i poziomy. Z0–Z5 oznaczają metadane, brak blokad/egzekwowania uprawnień. Nie twierdzić, że osiągnięto pełną zgodność IDS, pojemność lub gotowość MDS; pomieszczenia pomocnicze, szerokości rzeczywistych przejść, wizualna jakość i podziemia nadal wymagają odbioru.

## Testy
W V8 użyto rzeczywistych funkcji kompilacji MTL, FPS, RTS i kontroli dekoracji oraz własnej kontroli kolizji, pól portali, osiągalności stanowisk i kotwic od wejść. 24 obrotów kandydatów i tyle samo bazowych bez zgłoszeń. Brak pełnej walidacji MFS całej mapy, rzeczywistego uruchomienia testu Node, Android, Pages lub odbioru wizualnego. Dodano tests/mtl-pass2b2.mjs. 
## Niezakończone kandydaty
- CLINIC_M01: TypeError: Cannot read properties of undefined (reading 'push')
- HALL_M01: TypeError: Cannot read properties of undefined (reading 'push')

## Następny krok
Dokończyć CLINIC_M01, HALL_M01; następnie karczmy, więzienia i duże domy (MTL-002).
