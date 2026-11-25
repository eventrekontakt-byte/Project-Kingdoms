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
