# Przekazanie do następnego czatu
Aktualizacja: 2026-11-25, czat (4). Punkt startowy: Alpha 0.3.44 / MTL r14 / Audit Pass II-A zakończony (triage 67/67); II-B do wykonania.

## Procedura wznawiania
1. Połącz się z GitHub eventrekontakt-byte/Project-Kingdoms i sprawdź aktualny HEAD main. Nie ufaj wyłącznie numerowi w README ani streszczeniu rozmowy.
2. Odczytaj WORK_RULES.md, PROJECT_STATE.md, ten plik, BACKLOG.md oraz odpowiednie DECISIONS.md i ROADMAP.md.
3. Porównaj ostatni commit funkcjonalny z HEAD, sprawdź niezakończone prace/WIP i raporty. W razie rozbieżności najpierw ustal stan faktyczny.
4. Wznów dokładnie najbliższe otwarte zadanie, korzystając z GDD, MDS, MFS i kodu. Nie rekonstruuj całej gry.
5. Po etapie uaktualnij stan, backlog, log i to przekazanie; przy nowych decyzjach także rejestr i plan.

## Bezpośredni następny krok
MTL-001/002: rozpocząć Pass II-B według ../MTL_AUDIT_0.3.44_PASS2A.md. Najpierw rzeczywiste braki programu i klasyfikacja F/H: koszary, lecznice, ratusz, SP_KEEP_VAULT; następnie układy S (karczmy, więzienia, domy). Odczytać geometrię i katalog r14, zaprojektować następną rewizję, nie nadpisywać r14. MDS §51: kuchnia w keep dodatkowa, mieszkanie i reprezentacja obowiązkowe.
Nie wdrażać DNS ani nowych niezwiązanych mechanik na tym etapie. Nie uznawać r14 za odebraną mapę.
Nie odzyskano dosłownego końca rozmowy (3); repozytorium i raporty są podstawą odzyskania stanu. W czacie (4) dodano pamięć oraz raport Pass II-A; nie zmieniano kodu/map ani nie przeprowadzono nowych testów silnika.

## Polecenie startowe
„Kontynuuj produkcję Project Kingdoms. Odczytaj docs/memory/CHAT_HANDOVER.md i WORK_RULES.md z gałęzi main, a następnie wznow pracę.”

## Checkpoint II-B1 — najnowszy
4 modele w nakładce `templates/mtl/pass2b1-candidates.json`, test V8 16 obrotów pozytywny; r14 bez zmian. Przeczytaj `../MTL_AUDIT_0.3.44_PASS2B1.md`. Następne: CLINIC_M01, SP_CLINIC, HALL_M01 (recepcje istnieją, układ stref do poprawy), potem SP_KEEP_VAULT. Nakładki integrować dopiero w r15 po walidacji. Nie powtarzać czterech modeli bez powodu. Test Node, wizualny, Android i pełny MFS nie wykonane.


## Checkpoint II-B2 — najnowszy
Wszystkie 4 modele w `templates/mtl/pass2b2-candidates.json` obok 4 z II-B1; 32 obrotów kondygnacji bez zgłoszeń w V8. Raport ../MTL_AUDIT_0.3.44_PASS2B2.md. MTL-002: karczmy, więzienia i duże domy; następnie kontrola błędnych heurystyk i integracja r15. Weryfikacja dostępu, wymiarów IDS, podziemi i odbiór wizualny pozostają otwarte. Nie nadpisywać r14; r15 po pełnej walidacji. Node, Android, Pages nie wykonane.


## Checkpoint II-B3 — najnowszy
3 modele w pass2b3-candidates.json obok 8 z II-B1/B2. Raport ../MTL_AUDIT_0.3.44_PASS2B3.md. Dokończyć INN_L01 (wejście parteru: x10,y23, pole przybycia x10,y22; nie zabudowywać). Następnie duże domy i rezydencje kupieckie; kontrola szerokości korytarzy, klasyfikacji i dalsza integracja r15. Cele otwarte, blokady runtime niewdrożone. Node, Android, Pages, pełny MFS i odbiór wizualny nadal otwarte. Nie nadpisywać r14.

## Checkpoint II-B4 — najnowszy
5 modeli w `templates/mtl/pass2b4-candidates.json` obok 11 z II-B1/B2/B3. Raport ../MTL_AUDIT_0.3.44_PASS2B4.md. RUR_HOUSE_L01, biblioteka, szkoły, łaźnie, archiwum; potem weryfikacja procesów i logistyki. Przed integracją r15 sprawdzić szerokości, wymiary IDS i Z0–Z5. Nie integrować bez pełnej walidacji. Node, Android, Pages i wizualny odbiór nadal otwarte; r14 niezmieniona. Użytkownik wybrał kontynuację czatu (4) mimo wysokiego obciążenia.
