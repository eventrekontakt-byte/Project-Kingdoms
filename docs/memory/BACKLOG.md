# Backlog produkcyjny
Aktualizacja: 2026-11-25. Wszystkie poniższe zadania pozostają otwarte, chyba że podano inaczej.

| ID | Priorytet | Zadanie | Kryterium ukończenia |
|---|---|---|---|
| MTL-001 | P0 | Triage 67 modeli — wykonany (II-A); weryfikacja geometrii i realizacja otwarte (II-B) | Raport ../MTL_AUDIT_0.3.44_PASS2A.md zawiera 67/67 indywidualnych zaleceń; w II-B zweryfikować i poprawić rzeczywiste programy, typy, pola użycia i geometrię |
| MTL-002 | P0 | Układy większych wnętrz: karczmy, lecznice, rezydencje, więzienia, obiekty publiczne | Strefy, dostępy, przejścia i stanowiska odpowiadają przeznaczeniu; brak utraty nawigacji |
| MTL-003 | P1 | Tereny wiejskie, dostawy, stajnie, obory, szerokie wrota | Zweryfikować rzeczywiste dojścia/dostawy; nie uznawać jednokaflowych portali za szerokie wrota |
| MTL-004 | P1 | Semantyka interakcji | Rozstrzygnąć hand_quern, harvest_sorting_table, tanning_worktable, cow_stall, chicken_perch, nest_box, offering_table, ritual_lectern, farm_ladder; kompatybilność wsteczna |
| MTL-005 | P1 | Podziemia, meble, dekoracje, wygląd | Indywidualny przegląd, uzupełnienie uzasadnionych typów, weryfikacja wizualna |
| QA-001 | P0 | Uruchomienie testu Node r14 | Wynik rzeczywistego node --experimental-default-type=module tests/mtl-r14.mjs |
| QA-002 | P0 | Przeglądarka, Android, offline, Pages | Udokumentowane rzeczywiste wyniki, oddzielnie od walidacji statycznej |
| MTL-006 | P0 | Odbiór końcowy MTL | Odbiór wizualny i MDS, nie wyłącznie wynik walidatora |
| CITY-001 | zależne | Nowe Miasto 1 | Odbiór etapów MDS i stabilizacja |
| DNS-001 | wstrzymane | Dalszy rozwój DNS | Wznowić po odbiorze i stabilizacji mapy |

Źródło szczegółowe: [Pass I](../MTL_AUDIT_0.3.44_PASS1.md), [67 modeli](../../templates/mtl/audit-candidates-0.3.44.json). Nie powielać całego katalogu danych w pamięci.

**Checkpoint II-B1:** cztery kandydaty w nakładce pass2b1-candidates.json; testy V8 pozytywne, pełny MFS/Node i architektura otwarte. Następne: CLINIC_M01, SP_CLINIC, HALL_M01 (istniejące reception_desk, wydzielenie stref), SP_KEEP_VAULT. Integracja dopiero w r15 po walidacji.


**Checkpoint II-B2:** wszystkie cztery modele zapisane jako kandydaty. MTL-002: karczmy, więzienia i duże domy; następnie kontrola błędnych heurystyk i integracja r15. Weryfikacja dostępu, wymiarów IDS, podziemi i odbiór wizualny pozostają otwarte. Pełny MFS/Node/Android otwarte.


**Checkpoint II-B3:** SP_INN_CELLAR, PRISON_M01, SP_PRISON_DEEP zapisane. Dokończyć INN_L01 (wejście parteru: x10,y23, pole przybycia x10,y22; nie zabudowywać). Następnie duże domy i rezydencje kupieckie; kontrola szerokości korytarzy, klasyfikacji i dalsza integracja r15. Drzwi zamykane cel wymagają wsparcia silnika. Pełne testy i odbiór otwarte.

**Checkpoint II-B4:** INN_L01, LARGE_HOUSE_M01, LARGE_HOUSE_M02, MERCHANT_HOUSE_M01, MERCHANT_HOUSE_M02 zapisane. RUR_HOUSE_L01, biblioteka, szkoły, łaźnie, archiwum; potem weryfikacja procesów i logistyki. Przed integracją r15 sprawdzić szerokości, wymiary IDS i Z0–Z5. Pełne testy i odbiór otwarte.

**Checkpoint II-B5:** LIBRARY_M01, SCHOOL_M01, SP_SCHOOL, BATHHOUSE_M01, SP_BATHHOUSE, SP_ARCHIVE, RUR_HOUSE_L01 zapisane. Następnie MTL-001/003/004: weryfikacja procesów zawodowych, logistyki, semantyki i klasyfikacji depozytu/sztabu. Weryfikacja indywidualnych projektów monumentalnych, IDS (w tym szerokości, wymiary, dostęp), pełna integracja r15 pozostają otwarte. Pełne testy i odbiór otwarte.

**Checkpoint II-B6:** WORKSHOP_M01, WORKSHOP_L01, BARBER_S01, REPAIR_M01, SCRIVENER_S01, COOPER_M01, WEAVER_M01, DYER_M01, POTTER_S01, POTTER_L01, MASON_M01, CANDLE_M01, PAPER_M01, GLASS_M01, FOUNDRY_L01, RUR_ANNEX_S01, RUR_WORKYARD_S01 zapisane. MTL-003: magazyny, spichlerze, stodoły, stajnie, obory i dojazdy. Szerokie wrota wymagają sprawdzenia formatu portali/runtime; nie udawać szerokiej bramy przez jednokaflowy portal. MTL-004: semantyka 9 urządzeń, klasyfikacja depozytu/sztabu, indywidualne projekty monumentalne. Przed r15 kontrola IDS, visual review i pełny MFS. Uzupełnić wyposażenie/dekoracje również w poprzednich przebudowanych modelach przed odbiorem. Pełne testy i odbiór otwarte.

**Checkpoint II-B7:** WAREHOUSE_M01, GRANARY_M01, BARN_M01, STABLE_M01, CARPENTER_M01, SUPPLY_L01, RUR_GRANARY_S01, RUR_GRANARY_M01, RUR_BARN_M01, RUR_BARN_L01, RUR_STABLE_M01, RUR_STABLE_L01, RUR_BYRE_M01, RUR_SAWMILL_M01, RUR_SHED_M01, SP_MINE_STORE zapisane. MTL-003: rzeczywista obsługa szerokich portali (MFS/core/validator/viewer i kompatybilność), poprawa zbyt małych pól dojścia, kontrola dojazdów i wybiegów na mapie. Następnie MTL-004: semantyka i klasyfikacja; monumentalne projekty i dekoracje wcześniejszych modeli; pełna integracja i walidacja r15. Pełne testy i odbiór otwarte.

**Checkpoint II-B8a:** II-B8a: kod wielopolowych progów, MTL, walidacja i viewer; pozytywna regresja V8. II-B8b: wdrożyć entrySpan w 16 kandydatach gospodarczych II-B7, dopasować dojścia, wystrój i wyposażenie; sprawdzić wszystkie pasy, skale i obroty. 56 kandydatów bez zmian, r14 niezmieniona, r15 nieopublikowana. Node, Android, offline, UI, większe jednostki i pełna walidacja nadal otwarte.

**Checkpoint II-B8b:** II-B8 zakończony w zakresie mechanizmu i migracji kandydatów: 16 modeli II-B7 zastąpiono nowszymi z II-B8b; 15 wejść 2/4 i 1 wejście 1/2, 64 kompilacje instancji i 372 pola przejścia sprawdzone, 88 obrotów kondygnacji, wszystkie meble i dekoracje zachowane. 56 unikatowych kandydatów. r14 niezmieniona, r15 nieopublikowana. II-B9: semantyka 9 urządzeń (MTL-004) i klasyfikacja DEPOSIT_M01, COMMAND_M01, SP_PORT; potem II-B10 monumentalne, II-B11 wyposażenie, II-B12 IDS, II-B13 integracja i II-B14 QA. Przy integracji B8b ma pierwszeństwo przed B7; nie liczyć jako dodatkowych 16 modeli. Pełny MFS, Node, Android, UI/offline, większe jednostki, rzeczywiste dojazdy/wybiegi i wizualny odbiór nadal otwarte.

**Checkpoint II-B9:** II-B9: 9 wersjonowanych definicji wyposażenia, 28 zaktualizowanych modeli, 74 unikatowych kandydatów (18 nowych ID), 196 obrotów V8, 38 zmian funkcji pokojów, 13 nieprawidłowych stanowisk drabin wyłączono. SP_PORT: +29/-34 dekoracje. Zachowano typy BDS; proponowane podtypy depozytu i sztabu wymagają akceptacji, nabrzeże portu otwarte. Nowe akcje opisowe, nie działające procesy. r14 bez zmian, r15 nieopublikowana. II-B10: monumentalne CIVIC_COURT_L01, SAC_TEMPLE_M01/M02/L01, NOB_KEEP_S01/M01/L01, SP_TEMPLE_CRYPT, SP_KEEP_VAULT; stosować najnowsze nakładki B1–B9, także nowe definicje mebli. B11 wyposażenie/dekoracje, B12 IDS (w tym klasyfikacja i pojemność), B13 integracja, B14 QA. Node, Android, pełny MFS i wizualny odbiór otwarte.

**Checkpoint II-B10a:** II-B10a: sąd i trzy świątynie, 4 modele, 20→49 pomieszczeń, 172→218 stanowisk, +30 mebli, +44 dekoracje, 0 usuniętych, 40 obrotów V8. 75 unikatowych kandydatów; r14 bez zmian. B10 nadal WIP. II-B10b: trzy zamki NOB_KEEP_S01/M01/L01, krypta SP_TEMPLE_CRYPT i SP_KEEP_VAULT (użyć wersji z B2). Następnie B11 wyposażenie/dekoracje, B12 IDS, B13 integracja i B14 QA. Node, Android, pełny MFS, dostępy oraz odbiór wizualny otwarte.

**Checkpoint II-B10b:** II-B10b: 5 modeli (trzy zamki, krypta, skarbiec), 39→110 pomieszczeń, 242→350 stanowisk, +80 mebli, +70 dekoracji, 0 usuniętych, 72 obroty V8. B10 łącznie 9 modeli, +100 pomieszczeń, +110 mebli, +114 dekoracji, +154 stanowiska. 79 unikatowych kandydatów, r14 bez zmian. B10 zakończony w zakresie kandydatów. II-B11: wzbogacić wyposażenie i dekoracje wcześniej przebudowanych wnętrz, zachowując najnowsze wersje z B1–B10b i definicje mebli B9. II-B12 IDS: w tym proporcje powierzchni użytkowej i pełnych masek ścian w monumentalnych budynkach, wymiary, pojemność, dostępy, klasyfikacja, widok. II-B13 integracja, II-B14 QA. Node, Android, pełny MFS, offline i odbiór wizualny otwarte.

**Checkpoint II-B11a:** 4 modele (BARRACKS_S02, BARRACKS_L02, OFFICER_M01, GUARDHOUSE_L02), +13 mebli, +33 dekoracje, 16 obrotów V8, 79 unikatowych kandydatów. B11b: lecznice, ratusz, karczmy, więzienia, rezydencje; następnie pozostałe przebudowy. B12 IDS, B13 integracja, B14 QA. Pełne testy i odbiór otwarte.
