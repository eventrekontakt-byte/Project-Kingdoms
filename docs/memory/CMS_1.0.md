# CMS 1.0 — Context Management System
Wdrożenie: 2026-11-25. Zakres: organizacja produkcji, bez zmiany wersji gry ani wymagań GDD/MDS/MFS.

## Start: odczyt warstwowy
1. Odczytaj TYLKO CHAT_HANDOVER.md z main. Zweryfikuj HEAD oraz wskazany punkt odniesienia (metadane, bez pełnego diffu). Przy rozbieżności sprawdź tylko pliki istotne dla zadania.
2. Odczytaj WORK_RULES.md przed wykonaniem prac. Nie pobieraj automatycznie PROJECT_STATE, BACKLOG, ROADMAP, DECISIONS, DEVELOPMENT_LOG, CHAT_LOAD_LOG ani historii czatów.
3. Otwórz właściwy fragment specyfikacji GDD/MDS/MFS i tylko źródła wymagane przez aktualne zadanie. Indeksy i zakresy linii zamiast całych katalogów, jeżeli możliwe. Nie omijaj obowiązkowych wymagań ani testów.
4. Jedna odpowiedź produkcyjna = jedna zamknięta partia lub jeden checkpoint WIP. Kolejną partię uruchamiaj po nowym poleceniu. Duże integracje dziel na przygotowanie, wykonanie, regres i odbiór; nie mieszaj z innymi modułami.
5. Przetwarzaj duże JSON i logi w narzędziu, jeżeli dostępne; zwracaj tylko wybrane ID, liczniki, błędy i wyniki. Nie wklejaj całych plików lub wielkich diffów do rozmowy. Gdy brak narzędzia, używaj porcjowanych odczytów lub zgłoś ograniczenie, nie udawaj testu.
6. Zapisuj kod/dane i aktualny checkpoint na GitHubie. Zweryfikuj zapis, a dopiero potem raportuj wynik. WIP zapisz przed ryzykownym krokiem; przy przerwaniu określ dokładne miejsce wznowienia.

## Role dokumentów
- CHAT_HANDOVER: jedyny punkt wejścia; aktualny stan, jedno następne zadanie, blokery, odsyłacze. Nadpisuj, NIE dopisuj historii. Cel <= 3000 znaków.
- WORK_RULES: trwałe reguły, cel <= 4000 znaków; nie dopisuj checkpointów.
- PROJECT_STATE: aktualna migawka projektu; cel <= 5000 znaków; nadpisuj nieaktualne fakty.
- BACKLOG: tylko aktywne zadania, kryteria odbioru i statusy; cel <= 5000 znaków. Zamknięte zadania pozostają w logu/Git.
- ROADMAP: etapy i zależności, aktualizuj przy zmianie planu, nie przy każdym commicie.
- DECISIONS: rejestr decyzji z identyfikatorem i statusem; odczyt selektywny.
- DEVELOPMENT_LOG i CHAT_LOAD_LOG: archiwalne rejestry append-only, NIE odczytywane w całości na starcie. Do dopisu preferuj pracę w narzędziu lub końcowy fragment; przy większym rozmiarze rotuj do archiwum z indeksem. Raporty etapowe pozostają w dotychczasowych ścieżkach.
- Pełna historia przed migracją: commit d20880ca620a092901f985d411e06597dda3c486 (Git). Nie kopiuj jej do bieżących migawek.

## Budżet roboczy i monitor
Cele znakowe to limity dokumentów, NIE limity okna kontekstowego. Orientacyjnie: 2 pliki startowe <= 7000 znaków. W razie przekroczenia skróć stan, nie usuwaj wymagań. Przy każdym checkpointcie zapisz: partia, zakres odczytów (jeśli mierzalny), testy, przerwania, ocena Niskie/Umiarkowane/Wysokie/Krytyczne/niepewne, zalecenie. Nie podawaj procentu ani liczby pozostałych wiadomości. Wysokie/krytyczne: zapisz checkpoint i nie rozpoczynaj kolejnej dużej partii bez nowego polecenia; zalecaj nową rozmowę. Użytkownik decyduje o zmianie czatu.
Jeżeli narzędzie zgłasza limit, nie powtarzaj bezmyślnie dużego wywołania; sprawdź zapis i wznowienie od checkpointu. CMS nie gwarantuje braku awarii ani dostępu do telemetrii.

## Test diagnostyczny (użytkownik)
A: nowy czat poza projektem: Napisz OK. B: nowy czat w projekcie: Napisz OK. C: nowy czat w projekcie: odczytaj tylko CHAT_HANDOVER.md i podaj najbliższy krok, bez programowania. Zanotuj model, komunikat, czas i rezultat. Dopiero potem rozpocznij produkcję. Wynik różnicowy jest wskazówką, nie dowodem przyczyny.
