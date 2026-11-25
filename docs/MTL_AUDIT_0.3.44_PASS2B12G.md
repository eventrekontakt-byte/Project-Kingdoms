# II-B12g — semantyczna kontrola skończonej listy

II-B12g WIP: kontrola semantyczna B12f; 11/33 korekt kandydackich, 14 indywidualnych wyjątków proponowanych do akceptacji, 8 nadal otwartych. 5 modeli zmieniono w B12g, 40 obrotów w V8; urealniono etykiety kuchni, kancelarii i jadalni, rozstrzygnięto źródło RUR_STABLE_L01 B8b. Nie uznawać strefy niespełniającej §50 za magazyn, gdy ma funkcję kuchni. Brak pełnego odbioru, r15 nieopublikowana.

| Model | Piętro | Pokój | Stan | Uzasadnienie |
|---|---:|---|---|---|
| BARRACKS_M01 | 0 | barrack_hall | exception_proposed | Wspólna sala zakwaterowania i ćwiczeń: sześć łóżek, wyposażenie żołnierskie oraz manekin treningowy; rozdzielenie ogranicza wspólną przestrzeń zbiórki. Wyjątek proponowany, sprawdzić adekwatność kołowrotka i rośliny w odbiorze. |
| ARMORY_M01 | 0 | armory | exception_proposed | Wspólna zbrojownia z wydawaniem i naprawą sprzętu (stojaki, warsztat, kowadło). Szeroka wspólna przestrzeń operacyjna zamiast rozdzielania procesu. |
| BREWERY_M01 | 0 | workshop | exception_proposed | Hala warzelni z dwiema kadziami, beczkami, piecem i przygotowaniem surowców; nie dzielić ciągu produkcyjnego ścianą. |
| TEAHOUSE_M01 | 0 | kitchen | pending | B12f rozdzielił funkcje, ale strefa 5×4 ma aktywne przygotowanie potraw i nie spełnia wymiaru kuchni zbiorowej; nie zaliczać do poprawionych. Potrzebny ukierunkowany układ. |
| INN_M02 | 0 | kitchen | corrected | Dwa rzeczywiste pomieszczenia o odrębnych stanowiskach tej samej funkcji, nie magazyn; kuchnia przygotowania i kuchnia obróbki cieplnej. |
| INN_M02 | 1 | bedroom | pending | Bez przesunięć wyposażenia nie znaleziono bezpiecznego podziału spełniającego wymiary, funkcje i komunikację; nie wymuszono sztucznego podziału. |
| INN_M02 | 1 | living | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| BARRACKS_L02 | 0 | barrack_hall | exception_proposed | Podłużna wspólna sala koszarowa: pięć łóżek piętrowych i szafki wojskowe, zachować ciąg dostępu do miejsc zakwaterowania. |
| BARRACKS_L02 | 0 | mess_hall | exception_proposed | Podłużna wspólna stołówka koszarowa z trzema stołami, ławami i wydawaniem posiłków; wspólna przestrzeń zbiorowego żywienia. |
| GUARDHOUSE_L02 | 0 | office | pending | Bez przesunięć wyposażenia nie znaleziono bezpiecznego podziału spełniającego wymiary, funkcje i komunikację; nie wymuszono sztucznego podziału. |
| COMMAND_M01 | 0 | office | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| OFFICER_M01 | 0 | bedroom | corrected | Komnata oficerska z łóżkiem dwuosobowym, garderobą, toaletką i umywalnią, 12×8 zgodne z komnatą 10×12; bez pozornego podziału. |
| CIVIC_HALL_M02 | 0 | office | corrected | Dwa rzeczywiste pomieszczenia o odrębnych stanowiskach tej samej funkcji, nie magazyn; dwie kancelarie z niezależnymi stanowiskami. |
| CIVIC_COURT_M01 | 0 | office | corrected | Dwa rzeczywiste pomieszczenia o odrębnych stanowiskach tej samej funkcji, nie magazyn; dwie kancelarie z niezależnymi stanowiskami. |
| CIVIC_GUILD_M02 | 0 | office | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| CIVIC_GUILD_L01 | 0 | workshop | corrected | Funkcjonalnie odrębne pomieszczenia; zachowano wszystkie obiekty i stanowiska. wall |
| NOB_HOUSE_M01 | 0 | kitchen | corrected | Dwa rzeczywiste pomieszczenia o odrębnych stanowiskach tej samej funkcji, nie magazyn; kuchnia przygotowania i kuchnia obróbki cieplnej. |
| NOB_HOUSE_L01 | 0 | dining_room | corrected | Dwa rzeczywiste pomieszczenia o odrębnych stanowiskach tej samej funkcji, nie magazyn; dwie jadalnie ze stołami i miejscami siedzącymi. |
| NOB_HOUSE_L01 | 1 | office | pending | Bez przesunięć wyposażenia nie znaleziono bezpiecznego podziału spełniającego wymiary, funkcje i komunikację; nie wymuszono sztucznego podziału. |
| NOB_HOUSE_L01 | 2 | kitchen | corrected | Dwa rzeczywiste pomieszczenia o odrębnych stanowiskach tej samej funkcji, nie magazyn; kuchnia przygotowania i kuchnia obróbki cieplnej. |
| RUR_HOUSE_M01 | 1 | bedroom | pending | Bez przesunięć wyposażenia nie znaleziono bezpiecznego podziału spełniającego wymiary, funkcje i komunikację; nie wymuszono sztucznego podziału. |
| RUR_BARN_L01 | 0 | storage | exception_proposed | Stodoła przeładunkowa z wozem, narzędziami i miejscem sortowania zbiorów; wymiar 22 zapewnia miejsce wspólnego składowania, bez sztucznych przegród. |
| RUR_BARN_L01 | 1 | storage | exception_proposed | Strych stodoły, wspólna przestrzeń składowania siana i pasz; zachować układ i drogę podawania ładunków. |
| RUR_STABLE_L01 | 0 | stable | exception_proposed | Wspólna stajnia 16×22, trzy stanowiska koni, poidło, pasze i osprzęt; proponowany wyjątek 2 pól długości dla wspólnej komunikacji obsługi. Konie wymagają oddzielnego testu manewrów. |
| RUR_STABLE_L01 | 1 | storage | exception_proposed | Strych stajni 16×22, składowanie siana, pasz i osprzętu, zachować wspólną przestrzeń logistyczną; proponowany wyjątek 2 pól długości. Nie potwierdza dostaw ani obsługi zwierząt. |
| RUR_MILL_M01 | 1 | workroom | exception_proposed | Hala kamienia młyńskiego, zsypu i żaren wraz z sortowaniem ziarna; zachować wspólny proces technologiczny. |
| RUR_SAWMILL_M01 | 1 | storage | exception_proposed | Skład kłód, desek i narzędzi przy tartaku; długie elementy potrzebują wspólnej przestrzeni manewrowej. |
| RUR_BREWERY_M01 | 0 | workroom | exception_proposed | Hala dwóch kadzi, wody, słodu i sortowania; ciąg produkcyjny wymaga nieprzerwanej przestrzeni. |
| RUR_BREWERY_M01 | 1 | storage | exception_proposed | Zbiorczy skład ziarna i słodu z sortowaniem; wspólna przestrzeń przepływu materiału. |
| RUR_TANNERY_M01 | 0 | workroom | exception_proposed | Hala garbarni, kadź, stół i rama suszenia, wspólny ciąg mokrych i suchych czynności; wydzielenie przestrzeni wymaga projektu technologicznego. |
| SP_INN_CELLAR | 0 | kitchen | pending | Wymaga indywidualnej zmiany geometrii lub wyposażenia. |
| SP_KEEP_VAULT | 1 | washroom | pending | Bez przesunięć wyposażenia nie znaleziono bezpiecznego podziału spełniającego wymiary, funkcje i komunikację; nie wymuszono sztucznego podziału. |
| SP_ARENA | -1 | storage | pending | Specjalne zaplecze areny o większej rozpiętości; tylko cztery obiekty składowe w 572 polach. Nie zatwierdzać bez kontroli realnego programu/pojemności; kandydat do indywidualnej przebudowy, nie automatyczny wyjątek. |
