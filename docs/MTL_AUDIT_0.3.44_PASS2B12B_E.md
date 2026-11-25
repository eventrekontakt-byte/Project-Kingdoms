# Alpha 0.3.44 — II-B12b–e: korekty przed odbiorem MTL
2026-11-25. Wykonano zgodnie z końcowym raportem i MDS 1.0 §§49–61 (oryginalny dokument odczytany; §21 i §40 dla BDS/FDS). r14 bez zmian, r15 nieopublikowana. Nakładki B12b–e kolejno po B12a; definicje mebli B9 v2 zachowane.

## B12b — pozostałe zgłoszenia komunikacji
4/4: HOUSE_S04, HOUSE_S05, APOTHECARY_M01, INN_M01. Wszystkie 3 izolowane pola i 1 zajęty odcinek granicy RTS usunięte. Przesunięcia i obroty, zachowanie obiektów/propów. 16 obrotów bez błędów. Razem B12a+b: 35→0 izolowanych pól i 9→0 zajętych odcinków.

## B12c — wykorzystanie przestrzeni zamków
| Model | Piętro | Ściany przed→po | Pomieszczenia przed→po |
|---|---:|---:|---:|
| NOB_KEEP_M01 | 2 | 51.3% → 39.5% | 8 → 12 |
| NOB_KEEP_M01 | 3 | 47.0% → 42.0% | 7 → 9 |
| NOB_KEEP_L01 | 2 | 56.5% → 34.6% | 9 → 17 |
| NOB_KEEP_L01 | 3 | 61.6% → 42.7% | 8 → 14 |
996 pól odzyskano z maski ścian; 20 funkcjonalnych pomieszczeń i 20 nowych obiektów adekwatnych do nowej funkcji. Zachowano istniejące pomieszczenia, obiekty, schody, wejścia, zewnętrzny obrys, strefy; dekoracje przełożone na właściwe ściany (12 operacji). Dwu-kaflowe przejścia do stref o identycznej etykiecie dostępu; nie implementuje to zamków/uprawnień. Wstępne próby jednorazowego wyburzenia nie przeszły walidacji podparcia i dekoracji, nie zapisano ich. Ostatecznie każdą dobudówkę walidowano osobno; 32 obroty całych modeli bez błędów. Próg 45% wyłącznie screening; nie jest normą MDS.

## Zbiorczy regres po B12c
163 modele, 96 nakładkowych, 229 kondygnacji, 582 pokoje, 2585 obiektów, 5164 dekoracje, 2906 stanowisk, 916 obrotów. 0 błędów, izolowanych pól, zajętych granic, sygnałów nadmiernej maski, błędów BDS (w tym 2 wieże objęte §21 tower; FDS zależy od konkretnego zastosowania), nieprawidłowych etykiet dostępu i stacji w innym pokoju. Plik templates/mtl/ids-review-0.3.44.json. Dokładniejsze porównanie §50 wykazało 78 rozbieżności obwiedni w 48 modelach (część fałszywa przez progi); 1 sygnał szerokości w SAC_TEMPLE_L01.

## B12d — rzeczywiste strefy funkcjonalne i pomiar progów
13 zgłoszeń wyjaśnionych przez odjęcie wąskiego pasa progu, zachowanie rdzenia użytkowego zgodnego z §50. 17 stref funkcjonalnych z faktycznie odrębnymi czynnościami, 5 korekt oznaczeń pomieszczeń. 19 zmodyfikowanych modeli, 132 obroty V8 bez błędów. Nie zmieniano obiektów, ścian, dekoracji, portali; w strefach otwartych nie deklarować fizycznej prywatności. SAC_TEMPLE_L01 +1: główny 4-polowy korytarz x12–15, y1–34 ciągły; boczny układ przechodzi 2×2 (jedna spójna składowa), oddzielne pola 3×3 wynikają z bocznej odnogi, nie z przerwania głównej osi.

## B12e — domy mieszkalne
10/10 pozostałych rodzinnych modeli przebudowano: HOUSE_S03/S06, HOUSE_M02/M05, HOUSE_M03/M06, HOUSE_L02/L05, HOUSE_L03/L06. 24 przesunięcia/obroty, zachowane wszystkie obiekty/dekoracje i miejsca snu. Dwa małe domy: sypialnia 5×3 oraz strefa sanitarno-składowa 3×3; osiem średnich/dużych: fizyczna partycja i niezależne wejścia do dwóch sypialń. 40 obrotów bez kolizji, niedostępnych stanowisk/izolowanych pól/granic; do potwierdzenia w końcowym globalnym przebiegu wymiarów. 
- HOUSE_S03: 3 przesunięć, bedroom 15 pól, washroom 9 pól, living 49 pól.
- HOUSE_S06: 4 przesunięć, bedroom 15 pól, washroom 9 pól, living 49 pól.
- HOUSE_M02: 2 przesunięć, bedroom 15 pól, living 76 pól, bedroom 18 pól.
- HOUSE_M05: 2 przesunięć, bedroom 15 pól, living 76 pól, bedroom 18 pól.
- HOUSE_M03: 4 przesunięć, bedroom 20 pól, bedroom 16 pól, living 72 pól.
- HOUSE_M06: 5 przesunięć, bedroom 20 pól, bedroom 16 pól, living 72 pól.
- HOUSE_L02: 1 przesunięć, bedroom 28 pól, kitchen 36 pól, living 67 pól, bedroom 24 pól.
- HOUSE_L05: 1 przesunięć, bedroom 28 pól, kitchen 36 pól, living 67 pól, bedroom 24 pól.
- HOUSE_L03: 1 przesunięć, bedroom 30 pól, bedroom 25 pól, living 98 pól.
- HOUSE_L06: 1 przesunięć, bedroom 30 pól, bedroom 25 pól, living 98 pól.

## Stan i dalsze kroki
110 unikatowych ID nakładkowych, 163 modele ogółem. Po B12d 43 zgłoszenia wymiarowe w 35 modelach; B12e rozwiązuje 10 zgłoszeń rodzinnych domów, globalny regres wymiarów otwarty. Pozostałe: rzeczywiste ograniczenia kuchni, komnat, zapleczy publicznych; udokumentowane indywidualne wyjątki dla dużych hal i pomieszczeń produkcyjnych (§50; wymagają akceptacji, nie wymuszać sztucznego podziału), depozyt/sztab. Domknąć skończoną listę, nie ponawiać meblowania. B13 integracja i B14 QA wciąż otwarte. Pełna kontrola MFS/Node, wizualna, Android, offline, Pages, prawa dostępu, własność i większe jednostki niepotwierdzone. 

## Potwierdzony regres końcowy po B12e
Commit 8b3ff05ce03227d4e2c99f326bc0e40588dd866d. Pierwszy odczyt przerwany przez rozłączenie serwera, ponowiono w paczkach po 4 pliki. Wynik 163 modele, 110 nakładkowych, 229 kondygnacji, 609 pomieszczeń, 2585 obiektów, 5164 dekoracje, 2906 stanowisk, 916 obrotów V8; 0 błędów, izolowanych pól, zajętych granic, nierozstrzygniętych sygnałów przekrojów korytarzy w zastosowanym screeningu i sygnałów maski ścian >45%. 13 pomiarów progów wyjaśnionych. 33 rozbieżności wymiarowe 25 modeli. Lista skończona poniżej; pozostałe 138 modeli bez zgłoszeń wymiarów w zastosowanym screeningu (nie pełny odbiór IDS/MFS). Dane: ../templates/mtl/ids-regression-after-b12e.json.

| Model | Kondygnacja, typ i wymiary rdzenia |
|---|---|
| BARRACKS_M01 | 0: barrack_hall 18×22 |
| ARMORY_M01 | 0: armory 14×18 |
| BREWERY_M01 | 0: workshop 14×18 |
| TEAHOUSE_M01 | 0: kitchen 14×5 |
| INN_M02 | 0: kitchen 16×7; 1: bedroom 16×8; 1: living 16×10 |
| BARRACKS_L02 | 0: barrack_hall 9×22; 0: mess_hall 9×22 |
| GUARDHOUSE_L02 | 0: office 6×14 |
| COMMAND_M01 | 0: office 14×9 |
| OFFICER_M01 | 0: bedroom 12×8 |
| CIVIC_HALL_M02 | 0: office 14×9 |
| CIVIC_COURT_M01 | 0: office 14×9 |
| CIVIC_GUILD_M02 | 0: office 16×9 |
| CIVIC_GUILD_L01 | 0: workshop 20×11 |
| NOB_HOUSE_M01 | 0: kitchen 14×8 |
| NOB_HOUSE_L01 | 0: dining_room 16×9; 1: office 16×9; 2: kitchen 16×9 |
| RUR_HOUSE_M01 | 1: bedroom 10×14 |
| RUR_BARN_L01 | 0: storage 16×22; 1: storage 16×22 |
| RUR_STABLE_L01 | 0: stable 16×22; 1: storage 16×22 |
| RUR_MILL_M01 | 1: workroom 14×18 |
| RUR_SAWMILL_M01 | 1: storage 16×22 |
| RUR_BREWERY_M01 | 0: workroom 16×22; 1: storage 16×22 |
| RUR_TANNERY_M01 | 0: workroom 14×18 |
| SP_INN_CELLAR | 0: kitchen 4×9 |
| SP_KEEP_VAULT | 1: washroom 8×6 |
| SP_ARENA | -1: storage 22×26 |

Nie ponawiać globalnego meblowania. Pozostałe 33 rozstrzygnąć indywidualnie: naprawy zwykłych pomieszczeń, udokumentowane i zaakceptowane wyjątki dla rzeczywiście nietypowych hal/składów i obiektów specjalnych. Nie publikować r15 przed odbiorem. Brak pełnego MFS i testów przeglądarki/Node/Android/offline/Pages; nie utożsamiać screeningu przekrojów z dowodem dostępności większych jednostek.
