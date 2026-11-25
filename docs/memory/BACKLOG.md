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

**Checkpoint II-B3:** SP_INN_CELLAR, PRISON_M01 zapisane. Dokończyć INN_L01, SP_PRISON_DEEP. Następnie duże domy i rezydencje kupieckie; kontrola szerokości korytarzy, klasyfikacji i dalsza integracja r15. Drzwi zamykane cel wymagają odrębnego wsparcia silnika. Pełne testy i odbiór otwarte.
