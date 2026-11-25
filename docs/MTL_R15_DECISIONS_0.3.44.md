# MTL-006 — pakiet decyzji r15 (Alpha 0.3.44)
2026-11-25 | REVIEW — 16 indywidualnych decyzji oczekuje na użytkownika. Nie jest akceptacją ani zmianą walidatora. Źródła: B12h raport i rekordy results (14/33), B9, MDS 1.0 §§21,43–46,50–51. Wymiary użytkowe core w kafelkach; limity maksymalne IDS §50. Zgoda tylko na wskazany model, poziom, typ i kotwicę; nie na wszystkie pomieszczenia tego typu.

| ID decyzji | Model / poziom / typ / kotwica | Fakt: core / max / przekroczenie | Uzasadnienie i rekomendacja (niezatwierdzona) |
|---|---|---|---|
| E01 | BARRACKS_M01 / 0 / barrack_hall / 10,12 | 18×22 / 14×18 / +4,+4; 6 łóżek, manekin, Z3 | Wspólne zakwaterowanie i ćwiczenia. Warunkowo: największa militarna sala; zweryfikować przestrzeń zbiórki, kołowrotek i roślinę. |
| E02 | ARMORY_M01 / 0 / armory / 8,10 | 14×18 / 12×16 / +2,+2; stojaki, warsztat, kowadło, Z3 | Wspólne wydawanie i naprawy. Rekomendacja: zachować; kontrola dostępu i dojść. |
| E03 | BREWERY_M01 / 0 / workshop / 8,10 | 14×18 / 12×16 / +2,+2; 2 kadzie, piec, beczki, Z2 | Ciąg warzenia; zachować bez podziału, sprawdzić obsługę i dostawy. |
| E04 | BARRACKS_L02 / 0 / barrack_hall / 5,12 | 9×22 / 14×18 / 0,+4; 5 łóżek piętrowych, Z3 | Podłużna sala dostępu do łóżek. Warunkowo: rekord area=180, obwiednia 9×22=198; sprawdzić maskę i komunikację, nie traktować rozbieżności jako potwierdzonego błędu geometrii. |
| E05 | BARRACKS_L02 / 0 / mess_hall / 15,12 | 9×22 / 10×14 / 0,+8; 3 stoły, ławy, Z3 | Wspólna stołówka; warunkowo, duże wydłużenie, sprawdzić przepływ i wydawanie posiłków. |
| E06 | RUR_BARN_L01 / 0 / storage / 10,12 | 16×22 / 16×20 / 0,+2; wóz, sortowanie, Z2 | Wspólny skład i przeładunek; zachować, test rzeczywistych dostaw. |
| E07 | RUR_BARN_L01 / 1 / storage / 10,12 | 16×22 / 16×20 / 0,+2; siano, pasze, farm_cart, Z2 | Wspólny strych; warunkowo, sprawdzić podawanie ładunków i zasadność wozu na piętrze. |
| E08 | RUR_STABLE_L01 / 0 / stable / 10,12 | 16×22 / 16×20 / 0,+2; 3 boksy, poidło, Z2 | Zachować przestrzeń obsługi; warunkowo, test koni i manewrów. |
| E09 | RUR_STABLE_L01 / 1 / storage / 10,12 | 16×22 / 16×20 / 0,+2; pasze, osprzęt, farm_cart, Z2 | Wspólny strych; warunkowo, zweryfikować dostawy pionowe i wóz. |
| E10 | RUR_MILL_M01 / 1 / workroom / 9,10 | 14×18 / 12×16 / +2,+2; kamień, zsyp, żarna, Z2 | Wspólny przemiał i sortowanie; zachować, sprawdzić przepływ ziarna. |
| E11 | RUR_SAWMILL_M01 / 1 / storage / 10,12 | 16×22 / 16×20 / 0,+2; kłody, deski, farm_cart, Z2 | Długie elementy; warunkowo, dostęp pionowy i transport drewna/wozu. |
| E12 | RUR_BREWERY_M01 / 0 / workroom / 10,12 | 16×22 / 12×16 / +4,+6; 2 kadzie, woda, słód, Z2 | Ciąg technologiczny; warunkowo, znaczne przekroczenie, sprawdzić wykorzystanie powierzchni i dostęp. |
| E13 | RUR_BREWERY_M01 / 1 / storage / 10,12 | 16×22 / 16×20 / 0,+2; ziarno i słód, sortowanie, Z2 | Skład surowców; zachować pod warunkiem sprawdzenia dostaw pionowych. |
| E14 | RUR_TANNERY_M01 / 0 / workroom / 9,10 | 14×18 / 12×16 / +2,+2; kadź, stół, rama suszenia, Z2 | Wspólny ciąg mokry/suchy; warunkowo, BDS wymaga odseparowanego zaplecza, sprawdzić rozdzielenie bez sztucznej ściany i dostęp. |

C01 — DEPOSIT_M01. Fakt B9: klasa geometryczna shop, proponowany deposit_house, reception/storage/administration, Z0/Z2. BDS nie ma samodzielnej klasy depozytu; shop standardowo wymaga sprzedaży, nie depozytu. Propozycja: indywidualny podtyp funkcjonalny z geometrią shop i programem recepcja/skład/administracja zamiast wymuszania handlu; Z0 tylko obsługa klienta, Z2 zaplecze; Z5 opcjonalnie dla osobno projektowanego skarbca, nie automatycznie. Nie potwierdza mechaniki przyjęcia/zwrotu, uprawnień ani zmiany programu BDS globalnie.
C02 — COMMAND_M01. Fakt B9: geometria hall, proponowany military_command, planning/administration/equip, Z3; brak publicznej obsługi. BDS hall normalnie obejmuje obsługę mieszkańców; FDS §§43–45 dopuszcza administracyjno-militarny kompleks i rozdzielne funkcje. Propozycja: indywidualny podtyp sztabu z geometrią hall, programem wojskowym, Z3; bez wymuszania Z0. W twierdzy przypisać do kompleksu S/PS, nie samodzielnej fortyfikacji ani automatycznego przejęcia; poza twierdzą nadal kontrolowany obiekt wojskowy. Weryfikacja granic, punktów kontroli i uprawnień w późniejszym odbiorze.

Rekomendacje są projektowe; zatwierdzenie wyjątku wymiarowego nie znosi pozostałych wymagań IDS/BDS/FDS i nie potwierdza logistyki, NPC ani testów runtime. Użytkownik może zaakceptować/odrzucić każdy ID osobno. Brak zmian map, katalogu, reguł walidacji, standardów. Nie wykonywano Node/Android ani nowej walidacji MFS. Następny checkpoint: zapisać odpowiedzi użytkownika i dopiero na odrębne polecenie wykonać uzgodnione korekty/pozostałe bramki.
