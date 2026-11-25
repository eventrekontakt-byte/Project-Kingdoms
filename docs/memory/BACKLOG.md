# Backlog produkcyjny
Aktualizacja: 2026-11-25. Wszystkie poniższe zadania pozostają otwarte, chyba że podano inaczej.

| ID | Priorytet | Zadanie | Kryterium ukończenia |
|---|---|---|---|
| MTL-001 | P0 | Indywidualny audyt 67 modeli | Każdy wpis z audit-candidates-0.3.44.json ma uzasadnioną klasyfikację i wynik; 8 braków funkcji rozstrzygniętych wg rzeczywistego programu i MDS |
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
