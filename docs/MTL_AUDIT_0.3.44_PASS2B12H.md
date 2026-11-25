# II-B12h — ukierunkowane układy resztkowe

II-B12h WIP: 19/33 korekt kandydackich, 14 wyjątków do akceptacji, 0 otwartych; 8 nowych zmian modeli, 68 obrotów V8. Próby ograniczone do resztkowych pomieszczeń, bez powtórnego wyposażania; zachowano wyposażenie i dekoracje w kandydatach. Brak pełnego odbioru. r14 bez zmian.

| Model | Piętro | Typ | Stan | Uzasadnienie |
|---|---:|---|---|---|
| BARRACKS_M01 | 0 | barrack_hall | exception_proposed | Wspólna sala zakwaterowania i ćwiczeń: sześć łóżek, wyposażenie żołnierskie oraz manekin treningowy; rozdzielenie ogranicza wspólną przestrzeń zbiórki. Wyjątek proponowany, sprawdzić adekwatność kołowrotka i rośliny w odbiorze. |
| ARMORY_M01 | 0 | armory | exception_proposed | Wspólna zbrojownia z wydawaniem i naprawą sprzętu (stojaki, warsztat, kowadło). Szeroka wspólna przestrzeń operacyjna zamiast rozdzielania procesu. |
| BREWERY_M01 | 0 | workshop | exception_proposed | Hala warzelni z dwiema kadziami, beczkami, piecem i przygotowaniem surowców; nie dzielić ciągu produkcyjnego ścianą. |
| TEAHOUSE_M01 | 0 | kitchen | corrected | Wydzielona kuchnia zbiorowa i magazyn surowców; zachowano wyposażenie, dekoracje i stanowiska. |
| INN_M02 | 0 | kitchen | corrected | Dwa rzeczywiste pomieszczenia o odrębnych stanowiskach tej samej funkcji, nie magazyn; kuchnia przygotowania i kuchnia obróbki cieplnej. |
| INN_M02 | 1 | bedroom | corrected | Dwa fizycznie wydzielone pokoje noclegowe, wejścia ze wspólnej przestrzeni; zachowano wyposażenie, dekoracje i stanowiska. |
| INN_M02 | 1 | living | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| BARRACKS_L02 | 0 | barrack_hall | exception_proposed | Podłużna wspólna sala koszarowa: pięć łóżek piętrowych i szafki wojskowe, zachować ciąg dostępu do miejsc zakwaterowania. |
| BARRACKS_L02 | 0 | mess_hall | exception_proposed | Podłużna wspólna stołówka koszarowa z trzema stołami, ławami i wydawaniem posiłków; wspólna przestrzeń zbiorowego żywienia. |
| GUARDHOUSE_L02 | 0 | office | corrected | Oddzielny gabinet służbowy i zbrojownia z dojściem z recepcji; zachowano wyposażenie, dekoracje i stanowiska. |
| COMMAND_M01 | 0 | office | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| OFFICER_M01 | 0 | bedroom | corrected | Komnata oficerska z łóżkiem dwuosobowym, garderobą, toaletką i umywalnią, 12×8 zgodne z komnatą 10×12; bez pozornego podziału. |
| CIVIC_HALL_M02 | 0 | office | corrected | Dwa rzeczywiste pomieszczenia o odrębnych stanowiskach tej samej funkcji, nie magazyn; dwie kancelarie z niezależnymi stanowiskami. |
| CIVIC_COURT_M01 | 0 | office | corrected | Dwa rzeczywiste pomieszczenia o odrębnych stanowiskach tej samej funkcji, nie magazyn; dwie kancelarie z niezależnymi stanowiskami. |
| CIVIC_GUILD_M02 | 0 | office | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| CIVIC_GUILD_L01 | 0 | workshop | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| NOB_HOUSE_M01 | 0 | kitchen | corrected | Dwa rzeczywiste pomieszczenia o odrębnych stanowiskach tej samej funkcji, nie magazyn; kuchnia przygotowania i kuchnia obróbki cieplnej. |
| NOB_HOUSE_L01 | 0 | dining_room | corrected | Dwa rzeczywiste pomieszczenia o odrębnych stanowiskach tej samej funkcji, nie magazyn; dwie jadalnie ze stołami i miejscami siedzącymi. |
| NOB_HOUSE_L01 | 1 | office | corrected | Prywatna kancelaria i odrębna czytelnia wypoczynkowa; zachowano wyposażenie, dekoracje i stanowiska. |
| NOB_HOUSE_L01 | 2 | kitchen | corrected | Dwa rzeczywiste pomieszczenia o odrębnych stanowiskach tej samej funkcji, nie magazyn; kuchnia przygotowania i kuchnia obróbki cieplnej. |
| RUR_HOUSE_M01 | 1 | bedroom | corrected | Dwie sypialnie rodzinne oraz wspólny pokój dzienny na piętrze; zachowano wyposażenie, dekoracje i stanowiska. |
| RUR_BARN_L01 | 0 | storage | exception_proposed | Stodoła przeładunkowa z wozem, narzędziami i miejscem sortowania zbiorów; wymiar 22 zapewnia miejsce wspólnego składowania, bez sztucznych przegród. |
| RUR_BARN_L01 | 1 | storage | exception_proposed | Strych stodoły, wspólna przestrzeń składowania siana i pasz; zachować układ i drogę podawania ładunków. |
| RUR_STABLE_L01 | 0 | stable | exception_proposed | Wspólna stajnia 16×22, trzy stanowiska koni, poidło, pasze i osprzęt; proponowany wyjątek 2 pól długości dla wspólnej komunikacji obsługi. Konie wymagają oddzielnego testu manewrów. |
| RUR_STABLE_L01 | 1 | storage | exception_proposed | Strych stajni 16×22, składowanie siana, pasz i osprzętu, zachować wspólną przestrzeń logistyczną; proponowany wyjątek 2 pól długości. Nie potwierdza dostaw ani obsługi zwierząt. |
| RUR_MILL_M01 | 1 | workroom | exception_proposed | Hala kamienia młyńskiego, zsypu i żaren wraz z sortowaniem ziarna; zachować wspólny proces technologiczny. |
| RUR_SAWMILL_M01 | 1 | storage | exception_proposed | Skład kłód, desek i narzędzi przy tartaku; długie elementy potrzebują wspólnej przestrzeni manewrowej. |
| RUR_BREWERY_M01 | 0 | workroom | exception_proposed | Hala dwóch kadzi, wody, słodu i sortowania; ciąg produkcyjny wymaga nieprzerwanej przestrzeni. |
| RUR_BREWERY_M01 | 1 | storage | exception_proposed | Zbiorczy skład ziarna i słodu z sortowaniem; wspólna przestrzeń przepływu materiału. |
| RUR_TANNERY_M01 | 0 | workroom | exception_proposed | Hala garbarni, kadź, stół i rama suszenia, wspólny ciąg mokrych i suchych czynności; wydzielenie przestrzeni wymaga projektu technologicznego. |
| SP_INN_CELLAR | 0 | kitchen | corrected | Poszerzona kuchnia do pięciu pól, zachowana dwupolowa oś publiczna i podparcie dekoracji; zachowano wyposażenie, dekoracje i stanowiska. |
| SP_KEEP_VAULT | 1 | washroom | corrected | Fizycznie wydzielona łazienka i podręczne zaplecze prywatne; zachowano wyposażenie, dekoracje i stanowiska. |
| SP_ARENA | -1 | storage | corrected | Dwa magazyny wyposażenia i zapasów areny oraz poprzeczny trakt dostaw przy schodach; zachowano wyposażenie, dekoracje i stanowiska. |
