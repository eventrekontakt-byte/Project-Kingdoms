# II-B12f — ukierunkowana korekta IDS (WIP)
2026-11-25, czat (6).

II-B12f WIP: 33 pozycji zamkniętej listy; 12 korekt w 10 modelach, 12 indywidualnych propozycji wyjątków do akceptacji, 9 nadal wymagających korekty; 60 obrotów kondygnacji sprawdzonych w V8 dla zmienionych modeli (FPS, RTS, dekoracje, kolizje, dojścia, izolacja i granice). Nie uruchamiano Node, przeglądarki, Android ani pełnego MFS. r14 bez zmian; r15 nieopublikowana. Nie powtarzać II-B11. Szczegóły w templates/mtl/pass2b12f-candidates.json.

| Model | Piętro | Pomieszczenie | Status | Rozstrzygnięcie |
|---|---:|---|---|---|
| BARRACKS_M01 | 0 | barrack_hall 18×22 | exception_proposed | Wspólna sala zakwaterowania i ćwiczeń: sześć łóżek, wyposażenie żołnierskie oraz manekin treningowy; rozdzielenie ogranicza wspólną przestrzeń zbiórki. Wyjątek proponowany, sprawdzić adekwatność kołowrotka i rośliny w odbiorze. |
| ARMORY_M01 | 0 | armory 14×18 | exception_proposed | Wspólna zbrojownia z wydawaniem i naprawą sprzętu (stojaki, warsztat, kowadło). Szeroka wspólna przestrzeń operacyjna zamiast rozdzielania procesu. |
| BREWERY_M01 | 0 | workshop 14×18 | exception_proposed | Hala warzelni z dwiema kadziami, beczkami, piecem i przygotowaniem surowców; nie dzielić ciągu produkcyjnego ścianą. |
| TEAHOUSE_M01 | 0 | kitchen 14×5 | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| INN_M02 | 0 | kitchen 16×7 | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| INN_M02 | 1 | bedroom 16×8 | pending | Bez przesunięć wyposażenia nie znaleziono bezpiecznego podziału spełniającego wymiary, funkcje i komunikację; nie wymuszono sztucznego podziału. |
| INN_M02 | 1 | living 16×10 | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| BARRACKS_L02 | 0 | barrack_hall 9×22 | exception_proposed | Podłużna wspólna sala koszarowa: pięć łóżek piętrowych i szafki wojskowe, zachować ciąg dostępu do miejsc zakwaterowania. |
| BARRACKS_L02 | 0 | mess_hall 9×22 | exception_proposed | Podłużna wspólna stołówka koszarowa z trzema stołami, ławami i wydawaniem posiłków; wspólna przestrzeń zbiorowego żywienia. |
| GUARDHOUSE_L02 | 0 | office 6×14 | pending | Bez przesunięć wyposażenia nie znaleziono bezpiecznego podziału spełniającego wymiary, funkcje i komunikację; nie wymuszono sztucznego podziału. |
| COMMAND_M01 | 0 | office 14×9 | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| OFFICER_M01 | 0 | bedroom 12×8 | corrected | Komnata oficerska z łóżkiem dwuosobowym, garderobą, toaletką i umywalnią, 12×8 zgodne z komnatą 10×12; bez pozornego podziału. |
| CIVIC_HALL_M02 | 0 | office 14×9 | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| CIVIC_COURT_M01 | 0 | office 14×9 | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| CIVIC_GUILD_M02 | 0 | office 16×9 | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| CIVIC_GUILD_L01 | 0 | workshop 20×11 | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| NOB_HOUSE_M01 | 0 | kitchen 14×8 | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| NOB_HOUSE_L01 | 0 | dining_room 16×9 | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| NOB_HOUSE_L01 | 1 | office 16×9 | pending | Bez przesunięć wyposażenia nie znaleziono bezpiecznego podziału spełniającego wymiary, funkcje i komunikację; nie wymuszono sztucznego podziału. |
| NOB_HOUSE_L01 | 2 | kitchen 16×9 | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. open |
| RUR_HOUSE_M01 | 1 | bedroom 10×14 | pending | Bez przesunięć wyposażenia nie znaleziono bezpiecznego podziału spełniającego wymiary, funkcje i komunikację; nie wymuszono sztucznego podziału. |
| RUR_BARN_L01 | 0 | storage 16×22 | exception_proposed | Stodoła przeładunkowa z wozem, narzędziami i miejscem sortowania zbiorów; wymiar 22 zapewnia miejsce wspólnego składowania, bez sztucznych przegród. |
| RUR_BARN_L01 | 1 | storage 16×22 | exception_proposed | Strych stodoły, wspólna przestrzeń składowania siana i pasz; zachować układ i drogę podawania ładunków. |
| RUR_STABLE_L01 | 0 | stable 16×22 | pending | Brak zgodności wersji źródłowej |
| RUR_STABLE_L01 | 1 | storage 16×22 | pending | Brak zgodności wersji źródłowej |
| RUR_MILL_M01 | 1 | workroom 14×18 | exception_proposed | Hala kamienia młyńskiego, zsypu i żaren wraz z sortowaniem ziarna; zachować wspólny proces technologiczny. |
| RUR_SAWMILL_M01 | 1 | storage 16×22 | exception_proposed | Skład kłód, desek i narzędzi przy tartaku; długie elementy potrzebują wspólnej przestrzeni manewrowej. |
| RUR_BREWERY_M01 | 0 | workroom 16×22 | exception_proposed | Hala dwóch kadzi, wody, słodu i sortowania; ciąg produkcyjny wymaga nieprzerwanej przestrzeni. |
| RUR_BREWERY_M01 | 1 | storage 16×22 | exception_proposed | Zbiorczy skład ziarna i słodu z sortowaniem; wspólna przestrzeń przepływu materiału. |
| RUR_TANNERY_M01 | 0 | workroom 14×18 | exception_proposed | Hala garbarni, kadź, stół i rama suszenia, wspólny ciąg mokrych i suchych czynności; wydzielenie przestrzeni wymaga projektu technologicznego. |
| SP_INN_CELLAR | 0 | kitchen 4×9 | pending | Wymaga indywidualnej zmiany geometrii lub wyposażenia. |
| SP_KEEP_VAULT | 1 | washroom 8×6 | pending | Bez przesunięć wyposażenia nie znaleziono bezpiecznego podziału spełniającego wymiary, funkcje i komunikację; nie wymuszono sztucznego podziału. |
| SP_ARENA | -1 | storage 22×26 | pending | Specjalne zaplecze areny o większej rozpiętości; tylko cztery obiekty składowe w 572 polach. Nie zatwierdzać bez kontroli realnego programu/pojemności; kandydat do indywidualnej przebudowy, nie automatyczny wyjątek. |
