# Project Kingdoms — końcowy przegląd kandydatów MTL (II-B11 / wejście do II-B12)
Data 2026-11-25, czat (5). Alpha 0.3.44. Stan źródeł ab2205450331b4ab3c8d95a61dae3b1a7d8010a6. Raport zbiorczy 163/163 modeli. r14 pozostaje niezmieniona; r15 nie została zintegrowana ani opublikowana. Zamknięto ogólną rundę rozbudowy wyposażenia, nie zamknięto odbioru IDS/MFS.

## Metodyka
Katalog r14 + najnowsze nakładki B6, B8b, B9, B10a, B10b, B11a–c, z 9 dodatkowymi wersjami definicji wyposażenia B9 obok v1. Sprawdzono osobno, że wszystkie 39 wystąpień ID we wcześniejszych nakładkach B1–B5 i B7 są pokryte nowszymi wersjami. Złożenie w pamięci, bez publikowania katalogu. Oryginalny MDS 1.0 §§7,20–21,40,49–61,64 i MFS 1.0 §§15–19,22–24,32 odczytane z dokumentów projektu. Kontrole: validateLibrary, instantiateBuilding, FPS, RTS, decorationIssues, kolizje, ISS, połączenia pięter, BFS od każdego indywidualnego pola przybycia do wszystkich stanowisk, kotwic i pól przybycia w czterech orientacjach. Dodatkowo przegląd obwiedni BDS, wybranych rozpoznanych typów pokojów IDS, izolowanych pól, obiektów na granicach RTS, przynależności stanowisk do pomieszczeń i wskaźnika ścian >45% brutto (próg analityczny, nie zatwierdzony standard). Wstępne uruchomienie nieudane z powodu braku structuredClone w V8; po usunięciu zbędnego klonowania wykonano całość. Wynik surowy w [JSON](../templates/mtl/final-candidate-review-0.3.44.json).

## Wynik
163 modele, 79 nakładkowych i 84 r14; 229 kondygnacji, 916 obrotów; 562 pokoje, 2565 obiektów, 5164 dekoracje, 2886 stanowisk. W porównaniu z r14: +358 obiektów, +557 dekoracji netto, +395 stanowisk. Każda kondygnacja ma wyposażenie i dekoracje. 0 modeli z błędami w wykonanych podstawowych kontrolach, 105 bez sygnałów przeglądu, 58 z co najmniej jednym sygnałem. Nie utożsamiać 105 z pełnym odbiorem. 161 modeli spełnia sprawdzone ogólne limity BDS (wymiary, powierzchnia prostokątna, liczba kondygnacji); 2 wieże wymagają rozstrzygnięcia FDS. Nie wykryto rozbieżności stanowiska z pokojem obiektu w tej kontroli. 
   
## Ustalenia i decyzje do II-B12
| Kod | Modele | Szczegóły / rozstrzygnięcie |
|---|---:|---|
| ISOLATED_FREE_CELLS | 23 | 35 wolnych niedostępnych pól, 1–4 na model; brak niedostępnych wymaganych celów; odróżnić zbędne zakamarki od faktycznej komunikacji. |
| CUT_OCCUPIED | 6 | 9 odcinków logicznej granicy otwartej RTS zajętych przez wyposażenie. SHOP_S01/M01/L01, BAKERY_M01, APOTHECARY_M01, INN_M01. Granica otwarta nie musi być rzeczywistymi drzwiami; sprawdzić realną szerokość i trasę, poprawić tylko gdy potrzeba. Wszystkie 6 z r14, nie wynik B11. |
| ROOM_BOUNDS_REVIEW | 26 | 29 obwiedni pokojów wykracza poza zakres przyjęty dla danego typu IDS. To screening na prostokącie ograniczającym; nieregularne i wielofunkcyjne układy wymagają rozstrzygnięcia. Poprawić niezgodne programy lub udokumentować indywidualne wyjątki bez samowolnej zmiany IDS. |
| PROGRAM_ACTION_REVIEW | 5 | DEPOSIT_M01 jest depozytem, zachowana klasa shop; wymaga zatwierdzenia klasyfikacji, nie dodawania sprzedaży. Cztery keep mają salę audiencyjną/tronową, audience_throne (sit) i council_table (meeting); brak etykiety audience/rule nie oznacza braku reprezentacji. Heurystyka do korekty, nie dodawać kolejnego tronu. |
| BDS_SPECIAL_OR_UNMAPPED | 2 | WATCHTOWER_S01 5×7 i WATCHTOWER_M01 6×7, po 2 kondygnacje; pasują do zakresu baszty miejskiej FDS §40 pod względem wymiarów, jeśli taka klasyfikacja jest właściwa. Kontekst fortyfikacji i typ pozostają do rozstrzygnięcia. |
| WALL_RATIO_REVIEW | 2 | NOB_KEEP_M01 +2:51,2%, +3:47,0%; NOB_KEEP_L01 +2:56,5%, +3:61,6%. Zweryfikować pełne maski, grubość ścian i użyteczność pięter przed integracją. 45% jest progiem analitycznym, nie normą MDS. |

Sygnały nakładają się. Nie są to 58 niezależnych błędów. Szczególne priorytety: 2 zamki, 6 modeli z granicami RTS, 26 z obwiedniami pokojów, konkretne zakamarki i klasyfikacja. Dodatkowo bramki IDS/MFS: rzeczywiste przekroje wolnych przejść, wymiary wszystkich typów pokojów, pojemność z wyposażenia i możliwości jednoczesnej obsługi, Z0–Z5, własność, dostęp i poprawne rozróżnienie działań potencjalnych od aktywnych. Sprawdzić logistykę rzeczywistej mapy (drogi, dostawy, wybiegi, port), większe jednostki, powiązania FDS i indywidualne wyjątki. Nie otwierać nowej rundy meblowania całego katalogu.

## Weryfikacja B11a–c
22 modele, wszystkie wcześniejsze meble, dekoracje, partycje, roomSplits i deklaracje pokojów zachowane w porównaniu z bezpośrednią bazą B1–B5/B9. 15 bez sygnałów, 7 z sygnałami (BARRACKS_L02, OFFICER_M01, GUARDHOUSE_L02 — rozmiar pokojów; LIBRARY_M01, SCHOOL_M01, BATHHOUSE_M01, RUR_HOUSE_L01 — izolowane wolne pola). Brak wykrytego nowego zajęcia granic RTS lub stanowisk w innym pokoju. Nie dowodzi estetycznej potrzeby każdego dodatku ani zachowania minimalnych szerokości. Usuwać lub przemieszczać tylko konkretne nieuzasadnione obiekty po oględzinach; brak automatycznego cofania nakładek.

## Rejestr wszystkich modeli
W tabeli: wynik dotyczy wykonanych kontroli, nie akceptacji; liczby na 0°; źródło wersji. Szczegółowe współrzędne, kondygnacje, wymiary, sumy pojemności według akcji i zgłoszenia dostępne w JSON.

| ID | Typ | Wersja / źródło | Kond. | Pokoje | Meble | Dekor. | Stanow. | Uwagi |
|---|---|---|---:|---:|---:|---:|---:|---|
| HUT_S01 | hut | 6 / r14 | 1 | 1 | 9 | 13 | 9 | brak sygnałów |
| HUT_M01 | hut | 6 / r14 | 1 | 1 | 9 | 13 | 9 | brak sygnałów |
| HUT_L01 | hut | 6 / r14 | 1 | 1 | 10 | 13 | 10 | brak sygnałów |
| HOUSE_S01 | house | 6 / r14 | 1 | 1 | 10 | 18 | 10 | izolowane wolne pola |
| HOUSE_S02 | house | 6 / r14 | 1 | 2 | 10 | 18 | 10 | izolowane wolne pola |
| HOUSE_S03 | house | 6 / r14 | 1 | 2 | 10 | 18 | 10 | izolowane wolne pola |
| HOUSE_M01 | house | 6 / r14 | 1 | 1 | 14 | 18 | 15 | brak sygnałów |
| HOUSE_M02 | house | 6 / r14 | 1 | 2 | 13 | 18 | 13 | brak sygnałów |
| HOUSE_M03 | house | 6 / r14 | 1 | 2 | 14 | 18 | 14 | brak sygnałów |
| HOUSE_L01 | house | 6 / r14 | 1 | 1 | 15 | 19 | 16 | brak sygnałów |
| HOUSE_L02 | house | 6 / r14 | 1 | 2 | 14 | 19 | 15 | brak sygnałów |
| HOUSE_L03 | house | 6 / r14 | 1 | 2 | 15 | 19 | 16 | brak sygnałów |
| SHOP_S01 | shop | 6 / r14 | 1 | 2 | 9 | 25 | 10 | zajęte pola granicy RTS |
| SHOP_M01 | shop | 6 / r14 | 1 | 2 | 12 | 34 | 13 | zajęte pola granicy RTS |
| SHOP_L01 | shop | 6 / r14 | 1 | 2 | 13 | 34 | 16 | zajęte pola granicy RTS |
| SMITHY_S01 | smithy | 6 / r14 | 1 | 1 | 11 | 17 | 11 | brak sygnałów |
| SMITHY_M01 | smithy | 6 / r14 | 1 | 1 | 12 | 17 | 12 | brak sygnałów |
| SMITHY_L01 | smithy | 6 / r14 | 1 | 1 | 13 | 18 | 13 | brak sygnałów |
| BAKERY_M01 | bakery | 6 / r14 | 1 | 2 | 11 | 28 | 12 | zajęte pola granicy RTS |
| APOTHECARY_M01 | apothecary | 6 / r14 | 1 | 2 | 11 | 35 | 12 | izolowane wolne pola; zajęte pola granicy RTS |
| WAREHOUSE_M01 | warehouse | 8 / B8b | 1 | 1 | 18 | 30 | 18 | brak sygnałów |
| INN_M01 | inn | 6 / r14 | 1 | 3 | 16 | 36 | 19 | zajęte pola granicy RTS |
| TENEMENT_S01 | tenement | 6 / r14 | 2 | 2 | 25 | 36 | 25 | brak sygnałów |
| LARGE_HOUSE_M01 | large_house | 5 / B11b | 2 | 10 | 30 | 42 | 31 | brak sygnałów |
| MERCHANT_HOUSE_M01 | merchant_house | 5 / B11b | 2 | 10 | 28 | 68 | 30 | brak sygnałów |
| TENEMENT_M01 | tenement | 3 / r14 | 3 | 3 | 36 | 48 | 39 | brak sygnałów |
| INN_L01 | inn | 5 / B11b | 2 | 10 | 33 | 63 | 40 | brak sygnałów |
| WORKSHOP_M01 | workshop | 4 / B6 | 1 | 1 | 12 | 29 | 12 | brak sygnałów |
| WORKSHOP_L01 | workshop | 4 / B6 | 1 | 1 | 13 | 23 | 13 | brak sygnałów |
| LIBRARY_M01 | library | 5 / B11c | 1 | 5 | 17 | 45 | 19 | izolowane wolne pola |
| SCHOOL_M01 | school | 5 / B11c | 1 | 4 | 17 | 43 | 17 | izolowane wolne pola |
| CHAPEL_M01 | chapel | 3 / r14 | 1 | 1 | 10 | 11 | 14 | brak sygnałów |
| CLINIC_M01 | clinic | 5 / B11b | 1 | 5 | 15 | 32 | 17 | brak sygnałów |
| HALL_M01 | hall | 5 / B11b | 1 | 5 | 17 | 32 | 25 | brak sygnałów |
| BARRACKS_M01 | barracks | 3 / r14 | 1 | 1 | 15 | 10 | 16 | wymiary pokoju do rozstrzygnięcia |
| ARMORY_M01 | armory | 3 / r14 | 1 | 1 | 11 | 12 | 11 | wymiary pokoju do rozstrzygnięcia |
| GUARDHOUSE_M01 | guardhouse | 3 / r14 | 1 | 1 | 10 | 9 | 10 | brak sygnałów |
| GRANARY_M01 | granary | 5 / B8b | 1 | 1 | 12 | 15 | 12 | brak sygnałów |
| BARN_M01 | barn | 5 / B8b | 1 | 1 | 12 | 22 | 12 | izolowane wolne pola |
| STABLE_M01 | stable | 5 / B8b | 1 | 1 | 12 | 10 | 12 | brak sygnałów |
| BREWERY_M01 | brewery | 3 / r14 | 1 | 1 | 11 | 17 | 11 | wymiary pokoju do rozstrzygnięcia |
| BATHHOUSE_M01 | bathhouse | 5 / B11c | 1 | 5 | 15 | 17 | 17 | izolowane wolne pola |
| GUILDHALL_M01 | guildhall | 3 / r14 | 1 | 1 | 11 | 26 | 13 | izolowane wolne pola |
| SHOP_M02 | shop | 3 / r14 | 1 | 1 | 11 | 30 | 12 | brak sygnałów |
| BAKERY_L01 | bakery | 3 / r14 | 1 | 1 | 11 | 25 | 12 | izolowane wolne pola |
| APOTHECARY_L01 | apothecary | 3 / r14 | 1 | 1 | 11 | 38 | 12 | brak sygnałów |
| HUT_S02 | hut | 2 / r14 | 1 | 1 | 10 | 13 | 10 | brak sygnałów |
| HUT_M02 | hut | 2 / r14 | 1 | 1 | 10 | 13 | 10 | brak sygnałów |
| HUT_L02 | hut | 2 / r14 | 1 | 1 | 11 | 13 | 11 | brak sygnałów |
| HOUSE_S04 | house | 2 / r14 | 1 | 1 | 11 | 18 | 11 | izolowane wolne pola |
| HOUSE_S05 | house | 2 / r14 | 1 | 2 | 11 | 18 | 11 | izolowane wolne pola |
| HOUSE_S06 | house | 2 / r14 | 1 | 2 | 11 | 18 | 11 | izolowane wolne pola |
| HOUSE_M04 | house | 2 / r14 | 1 | 1 | 15 | 18 | 16 | brak sygnałów |
| HOUSE_M05 | house | 2 / r14 | 1 | 2 | 14 | 18 | 14 | brak sygnałów |
| HOUSE_M06 | house | 2 / r14 | 1 | 2 | 15 | 18 | 15 | brak sygnałów |
| HOUSE_L04 | house | 2 / r14 | 1 | 1 | 16 | 19 | 17 | brak sygnałów |
| HOUSE_L05 | house | 2 / r14 | 1 | 2 | 15 | 19 | 16 | brak sygnałów |
| HOUSE_L06 | house | 2 / r14 | 1 | 2 | 16 | 19 | 17 | brak sygnałów |
| LARGE_HOUSE_M02 | large_house | 4 / B11b | 2 | 10 | 32 | 43 | 33 | brak sygnałów |
| MERCHANT_HOUSE_M02 | merchant_house | 4 / B11b | 2 | 10 | 30 | 69 | 32 | brak sygnałów |
| TENEMENT_S02 | tenement | 2 / r14 | 2 | 2 | 26 | 36 | 26 | brak sygnałów |
| TENEMENT_M02 | tenement | 2 / r14 | 3 | 3 | 37 | 48 | 40 | brak sygnałów |
| JEWELRY_S01 | shop | 2 / r14 | 1 | 2 | 8 | 21 | 9 | brak sygnałów |
| CLOTH_M01 | shop | 2 / r14 | 1 | 2 | 10 | 25 | 13 | brak sygnałów |
| SPICE_S01 | shop | 2 / r14 | 1 | 2 | 9 | 23 | 10 | brak sygnałów |
| BAKERY_S02 | bakery | 2 / r14 | 1 | 2 | 9 | 24 | 10 | brak sygnałów |
| FISHMONGER_M01 | shop | 2 / r14 | 1 | 2 | 9 | 21 | 10 | brak sygnałów |
| BUTCHER_M01 | shop | 2 / r14 | 1 | 2 | 8 | 22 | 9 | brak sygnałów |
| BOOKSHOP_M01 | shop | 2 / r14 | 1 | 2 | 10 | 30 | 11 | brak sygnałów |
| BARBER_S01 | workshop | 3 / B6 | 1 | 2 | 11 | 22 | 13 | izolowane wolne pola |
| REPAIR_M01 | workshop | 3 / B6 | 1 | 2 | 11 | 19 | 14 | brak sygnałów |
| SCRIVENER_S01 | workshop | 3 / B6 | 1 | 2 | 11 | 30 | 13 | wymiary pokoju do rozstrzygnięcia |
| TEAHOUSE_M01 | inn | 2 / r14 | 1 | 2 | 10 | 22 | 13 | brak sygnałów |
| BATHHOUSE_S02 | bathhouse | 2 / r14 | 1 | 2 | 10 | 11 | 12 | brak sygnałów |
| CLINIC_S02 | clinic | 2 / r14 | 1 | 2 | 8 | 17 | 10 | brak sygnałów |
| INN_M02 | inn | 2 / r14 | 2 | 4 | 23 | 44 | 31 | brak sygnałów |
| DEPOSIT_M01 | shop | 3 / B9 | 1 | 2 | 9 | 22 | 11 | heurystyka programu do rozstrzygnięcia |
| APOTHECARY_M02 | apothecary | 2 / r14 | 1 | 2 | 9 | 30 | 12 | izolowane wolne pola |
| SMITHY_X01 | smithy | 2 / r14 | 1 | 2 | 9 | 10 | 10 | izolowane wolne pola |
| SMITHY_X02 | smithy | 2 / r14 | 1 | 2 | 9 | 12 | 10 | brak sygnałów |
| CARPENTER_M01 | sawmill | 4 / B8b | 1 | 2 | 11 | 19 | 12 | brak sygnałów |
| COOPER_M01 | workshop | 3 / B6 | 1 | 2 | 11 | 16 | 12 | brak sygnałów |
| TANNER_M01 | tannery | 2 / r14 | 1 | 2 | 8 | 10 | 9 | brak sygnałów |
| WEAVER_M01 | workshop | 3 / B6 | 1 | 2 | 10 | 20 | 11 | izolowane wolne pola |
| DYER_M01 | workshop | 3 / B6 | 1 | 2 | 10 | 17 | 11 | brak sygnałów |
| POTTER_S01 | workshop | 3 / B6 | 1 | 2 | 9 | 19 | 10 | izolowane wolne pola |
| POTTER_L01 | workshop | 3 / B6 | 1 | 2 | 12 | 26 | 13 | brak sygnałów |
| MASON_M01 | workshop | 3 / B6 | 1 | 2 | 10 | 20 | 11 | brak sygnałów |
| MILL_M01 | mill | 2 / r14 | 1 | 2 | 9 | 11 | 10 | brak sygnałów |
| BREWERY_L01 | brewery | 2 / r14 | 1 | 2 | 9 | 9 | 10 | wymiary pokoju do rozstrzygnięcia |
| CANDLE_M01 | workshop | 3 / B6 | 1 | 2 | 10 | 21 | 11 | brak sygnałów |
| PAPER_M01 | workshop | 3 / B6 | 1 | 2 | 10 | 16 | 11 | izolowane wolne pola |
| GLASS_M01 | workshop | 3 / B6 | 1 | 2 | 10 | 22 | 11 | izolowane wolne pola |
| FOUNDRY_L01 | workshop | 3 / B6 | 1 | 2 | 12 | 18 | 13 | brak sygnałów |
| BARRACKS_S02 | barracks | 4 / B11a | 1 | 2 | 14 | 27 | 14 | brak sygnałów |
| BARRACKS_L02 | barracks | 4 / B11a | 1 | 2 | 19 | 31 | 21 | wymiary pokoju do rozstrzygnięcia |
| ARMORY_S02 | armory | 2 / r14 | 1 | 2 | 9 | 15 | 9 | izolowane wolne pola |
| ARMORY_L02 | armory | 2 / r14 | 1 | 2 | 12 | 22 | 12 | brak sygnałów |
| GUARDHOUSE_S02 | guardhouse | 2 / r14 | 1 | 2 | 7 | 13 | 7 | brak sygnałów |
| GUARDHOUSE_L02 | guardhouse | 4 / B11a | 1 | 2 | 14 | 32 | 14 | wymiary pokoju do rozstrzygnięcia |
| WATCHTOWER_S01 | tower | 2 / r14 | 2 | 4 | 14 | 27 | 14 | klasyfikacja FDS |
| WATCHTOWER_M01 | tower | 2 / r14 | 2 | 4 | 14 | 27 | 14 | klasyfikacja FDS; wymiary pokoju do rozstrzygnięcia |
| TRAINING_M01 | arena_hall | 2 / r14 | 1 | 2 | 10 | 9 | 10 | wymiary pokoju do rozstrzygnięcia |
| ARCHERY_M01 | arena_hall | 2 / r14 | 1 | 2 | 9 | 8 | 9 | wymiary pokoju do rozstrzygnięcia |
| COMMAND_M01 | hall | 3 / B9 | 1 | 2 | 9 | 22 | 9 | wymiary pokoju do rozstrzygnięcia |
| SUPPLY_L01 | warehouse | 4 / B8b | 1 | 2 | 13 | 30 | 13 | brak sygnałów |
| INFIRMARY_M01 | clinic | 2 / r14 | 1 | 2 | 9 | 16 | 9 | brak sygnałów |
| PRISON_M01 | prison | 4 / B11b | 1 | 6 | 14 | 21 | 18 | brak sygnałów |
| OFFICER_M01 | large_house | 4 / B11a | 1 | 2 | 14 | 29 | 14 | wymiary pokoju do rozstrzygnięcia |
| GATE_GUARD_M01 | guardhouse | 2 / r14 | 2 | 4 | 16 | 28 | 16 | brak sygnałów |
| CIVIC_HALL_M02 | hall | 2 / r14 | 1 | 2 | 9 | 6 | 13 | wymiary pokoju do rozstrzygnięcia |
| CIVIC_HALL_M03 | hall | 2 / r14 | 1 | 2 | 9 | 8 | 11 | brak sygnałów |
| CIVIC_COURT_M01 | court | 2 / r14 | 1 | 2 | 9 | 7 | 13 | wymiary pokoju do rozstrzygnięcia |
| CIVIC_COURT_L01 | court | 3 / B10a | 1 | 5 | 15 | 11 | 27 | wymiary pokoju do rozstrzygnięcia |
| CIVIC_GUILD_M02 | guildhall | 2 / r14 | 1 | 2 | 9 | 7 | 13 | wymiary pokoju do rozstrzygnięcia |
| CIVIC_GUILD_L01 | guildhall | 2 / r14 | 1 | 2 | 10 | 5 | 14 | wymiary pokoju do rozstrzygnięcia |
| SAC_CHAPEL_S02 | chapel | 3 / B9 | 1 | 1 | 6 | 12 | 8 | brak sygnałów |
| SAC_CHAPEL_M02 | chapel | 3 / B9 | 1 | 1 | 7 | 18 | 9 | brak sygnałów |
| SAC_CHAPEL_L01 | chapel | 3 / B9 | 2 | 4 | 25 | 55 | 29 | wymiary pokoju do rozstrzygnięcia |
| SAC_TEMPLE_S01 | temple | 3 / B9 | 2 | 4 | 28 | 61 | 38 | brak sygnałów |
| SAC_TEMPLE_M01 | temple | 4 / B10a | 3 | 14 | 48 | 120 | 60 | brak sygnałów |
| SAC_TEMPLE_M02 | temple | 4 / B10a | 3 | 14 | 49 | 125 | 63 | brak sygnałów |
| SAC_TEMPLE_L01 | temple | 4 / B10a | 3 | 16 | 52 | 134 | 68 | brak sygnałów |
| NOB_HOUSE_M01 | large_house | 2 / r14 | 3 | 6 | 41 | 64 | 45 | wymiary pokoju do rozstrzygnięcia |
| NOB_HOUSE_L01 | large_house | 2 / r14 | 3 | 6 | 41 | 63 | 53 | wymiary pokoju do rozstrzygnięcia |
| NOB_KEEP_S01 | keep | 3 / B10b | 3 | 17 | 51 | 108 | 65 | izolowane wolne pola; heurystyka programu do rozstrzygnięcia |
| NOB_KEEP_M01 | keep | 3 / B10b | 4 | 27 | 72 | 144 | 90 | nadmierna maska ścian (próg audytu); heurystyka programu do rozstrzygnięcia |
| NOB_KEEP_L01 | keep | 3 / B10b | 4 | 30 | 83 | 145 | 109 | nadmierna maska ścian (próg audytu); heurystyka programu do rozstrzygnięcia |
| RUR_HOUSE_S01 | hut | 2 / r14 | 1 | 1 | 8 | 17 | 10 | brak sygnałów |
| RUR_HOUSE_M01 | house | 2 / r14 | 2 | 2 | 14 | 39 | 16 | brak sygnałów |
| RUR_HOUSE_L01 | large_house | 5 / B11c | 3 | 15 | 32 | 89 | 40 | izolowane wolne pola |
| RUR_HOUSE_M02 | house | 3 / B9 | 2 | 2 | 15 | 41 | 17 | brak sygnałów |
| RUR_GRANARY_S01 | granary | 5 / B9 | 1 | 1 | 9 | 22 | 8 | brak sygnałów |
| RUR_GRANARY_M01 | granary | 5 / B9 | 2 | 2 | 20 | 56 | 18 | brak sygnałów |
| RUR_BARN_M01 | barn | 5 / B9 | 1 | 1 | 11 | 25 | 10 | brak sygnałów |
| RUR_BARN_L01 | barn | 5 / B9 | 2 | 2 | 20 | 50 | 19 | wymiary pokoju do rozstrzygnięcia |
| RUR_HAYSHED_S01 | shed | 2 / r14 | 1 | 1 | 7 | 13 | 7 | brak sygnałów |
| RUR_STABLE_M01 | stable | 3 / B8b | 1 | 1 | 9 | 18 | 9 | brak sygnałów |
| RUR_STABLE_L01 | stable | 4 / B8b | 2 | 2 | 18 | 43 | 18 | wymiary pokoju do rozstrzygnięcia |
| RUR_BYRE_M01 | byre | 4 / B9 | 1 | 1 | 8 | 20 | 8 | brak sygnałów |
| RUR_COOP_S01 | coop | 3 / B9 | 1 | 1 | 5 | 12 | 5 | brak sygnałów |
| RUR_COOP_M01 | coop | 3 / B9 | 1 | 1 | 5 | 11 | 5 | brak sygnałów |
| RUR_MILL_S01 | mill | 3 / B9 | 2 | 2 | 14 | 38 | 13 | brak sygnałów |
| RUR_MILL_M01 | mill | 3 / B9 | 3 | 3 | 20 | 62 | 19 | brak sygnałów |
| RUR_SAWMILL_M01 | sawmill | 5 / B9 | 2 | 2 | 17 | 43 | 16 | wymiary pokoju do rozstrzygnięcia |
| RUR_BREWERY_M01 | brewery | 3 / B9 | 2 | 2 | 15 | 44 | 14 | wymiary pokoju do rozstrzygnięcia |
| RUR_TANNERY_M01 | tannery | 3 / B9 | 2 | 2 | 13 | 32 | 12 | brak sygnałów |
| RUR_SHED_S01 | shed | 3 / B9 | 1 | 1 | 7 | 11 | 6 | brak sygnałów |
| RUR_SHED_M01 | warehouse | 5 / B9 | 2 | 2 | 19 | 46 | 17 | brak sygnałów |
| RUR_ANNEX_S01 | annex | 4 / B9 | 1 | 1 | 8 | 27 | 8 | brak sygnałów |
| RUR_WORKYARD_S01 | workshop | 4 / B9 | 1 | 1 | 9 | 28 | 9 | brak sygnałów |
| SP_INN_CELLAR | inn | 4 / B11b | 2 | 5 | 17 | 44 | 23 | brak sygnałów |
| SP_CHAPEL_CRYPT | chapel | 2 / r14 | 2 | 2 | 10 | 38 | 12 | brak sygnałów |
| SP_TEMPLE_CRYPT | temple | 3 / B10b | 3 | 13 | 23 | 87 | 31 | brak sygnałów |
| SP_KEEP_VAULT | keep | 4 / B10b | 4 | 23 | 47 | 118 | 55 | wymiary pokoju do rozstrzygnięcia; heurystyka programu do rozstrzygnięcia |
| SP_PRISON_DEEP | prison | 4 / B11b | 4 | 18 | 30 | 84 | 34 | brak sygnałów |
| SP_ARCHIVE | library | 4 / B11c | 2 | 9 | 19 | 73 | 21 | brak sygnałów |
| SP_SCHOOL | school | 4 / B11c | 2 | 8 | 21 | 63 | 21 | brak sygnałów |
| SP_CLINIC | clinic | 4 / B11b | 2 | 6 | 16 | 39 | 18 | brak sygnałów |
| SP_BATHHOUSE | bathhouse | 4 / B11c | 2 | 9 | 19 | 42 | 21 | brak sygnałów |
| SP_ARENA | arena_hall | 2 / r14 | 2 | 2 | 8 | 39 | 8 | wymiary pokoju do rozstrzygnięcia |
| SP_PORT | port_office | 3 / B9 | 2 | 2 | 9 | 32 | 12 | brak sygnałów |
| SP_MINE_STORE | warehouse | 4 / B8b | 2 | 2 | 14 | 38 | 14 | brak sygnałów |

## Czego nie wykonano
Nie wykonano pełnej walidacji MFS skompilowanej galerii r15, pełnej kontroli IDS wszystkich wymiarów (screening obejmował wybrane typy), przejazdu jednostek wielopolowych, odbioru wizualnego rzeczywistych scen, testu Node, przeglądarki, Androida, offline, Pages i runtime praw dostępu. W audycie nie zmieniono żadnego modelu ani kodu silnika. Raport nie jest odbiorem biblioteki. 
   
## Następny krok
II-B11: ogólny przegląd zakończony; wcześniejsze B11d/e/f jako masowe meblowanie anulowane, nie są osobnymi otwartymi etapami. II-B12: zamknięta lista rzeczywistych usterek i wyjątków według tego raportu, nie kolejne ilościowe ulepszanie. II-B13: integracja r15 dopiero po rozstrzygnięciu wymagań; II-B14: pełne testy i wizualny odbiór. Potem akceptacja użytkownika, Nowe Miasto 1, DNS po stabilizacji.
