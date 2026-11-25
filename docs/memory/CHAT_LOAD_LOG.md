# Historia obciążenia rozmów — Project Kingdoms
## Zasady
Rejestr techniczny, aktualizowany przy każdym checkpointcie i przy zmianie czatu. Nie jest telemetrią ChatGPT ani pomiarem limitu tokenów. Nie ma dostępnego licznika wykorzystanego/pozostałego kontekstu, limitu długości rozmowy ani progu awarii aplikacji. Awaria aplikacji może mieć przyczyny inne niż długość rozmowy.
Mierzalne wskaźniki zastępcze: liczba zakończonych partii produkcyjnych w czacie (z repozytorium), liczba kandydatów, liczba zapisanych checkpointów, ewentualne objawy (utrata ciągłości, nieudane odczyty, awaria przy otwieraniu zgłoszona przez użytkownika). Nie utożsamiać ich z tokenami lub procentami. Ocena jakościowa Niskie/Umiarkowane/Wysokie/Krytyczne/niepewne; kolejny etap bezpieczny/tylko mały checkpoint/zalecany nowy czat. Przy problemie zapisać ostatni potwierdzony checkpoint, o ile dostępny. Nie próbować celowo wywoływać awarii.
 
| Data | Czat | Zakończone partie II-B w rozmowie | Kandydaci łącznie | Obciążenie (szacunek) | Stan / rekomendacja |
|---|---|---:|---:|---|---|
| 2026-11-25 | (3) | nieustalone | — | nieustalone | Użytkownik zgłosił awarię przy otwieraniu; przyczyna i granica pojemności niezweryfikowane. |
| 2026-11-25 | (4), II-B7 | 7 | 56 | wysokie, rosnące | Zapis produkcyjny działa; brak ustalonego progu awarii. Zalecany nowy czat przed obszerną integracją. |

**Wniosek obserwacyjny:** w czacie (4) potwierdzono możliwość wykonania co najmniej siedmiu kolejnych partii II-B, nie oznacza to gwarantowanego zapasu ani limitu rozmowy. Następne wpisy zachować w tej tabeli; aktualizować po każdym checkpointcie i odnotowywać zgłoszone objawy bez spekulowania o przyczynie.

### Kolejna obserwacja — 2026-11-25, czat (4), II-B8a
7 zakończonych partii II-B i 1 techniczny checkpoint II-B8a; 56 kandydatów. Obciążenie wysokie, rosnące; dostępna pojemność nieustalona. Pierwsza zbiorcza operacja przekroczyła limit wywołań narzędzi w jednym skrypcie (nie oznacza to przekroczenia limitu czatu); wykonana w mniejszych partiach. Brak nowego zgłoszenia awarii. Zalecana zmiana rozmowy przed kolejną obszerną operacją. Rejestr nie jest licznikiem tokenów.

### Kolejna obserwacja — 2026-11-25, czat (4), II-B8b
8 zakończonych partii II-B (II-B8 podzielony na 2 checkpointy), 56 unikatowych kandydatów. W tej partii 16 modeli zastąpiono nowszymi, nie dodawano ID. Obciążenie szacunkowe wysokie, rosnące; pojemność pozostała nieustalona. Zapis i kompilacje V8 zadziałały; brak nowego zgłoszenia awarii aplikacji. Zalecany nowy czat przed kolejnym dużym etapem. Brak pomiaru limitu czatu.

### Kolejna obserwacja — 2026-11-25, czat (4), II-B9
9 zakończonych partii II-B (II-B8 dwa checkpointy), 74 unikatowe kandydaty. W tej partii 28 zmienionych modeli, 18 nowych ID. Obciążenie orientacyjnie wysokie, rosnące; pozostała pojemność nieustalona. Zapis i testy V8 zadziałały. Brak nowego zgłoszenia awarii; zalecany nowy czat przed dużym etapem monumentalnym. Nie ma rzeczywistego pomiaru pojemności.

### Kolejna obserwacja — 2026-11-25, czat (4), II-B10a
9 zakończonych partii II-B i techniczny checkpoint II-B10a (II-B8 miała dwa checkpointy). 75 unikatowych kandydatów. Obciążenie szacunkowo wysokie, rosnące; pozostała pojemność nieustalona. Testy V8 i zapis zadziałały. Brak nowego zgłoszenia awarii. Zalecana zmiana czatu przed kolejnym dużym etapem. Nie jest to pomiar pojemności.

### Kolejna obserwacja — 2026-11-25, czat (4), II-B10b
10 zakończonych partii II-B (B8 i B10 po dwa checkpointy), 79 unikatowych kandydatów. Obciążenie szacunkowe wysokie, rosnące, pozostała pojemność nieustalona. Testy V8 i zapis zadziałały. Brak nowego zgłoszenia awarii. Rekomendacja: zmiana czatu przed B11, szczególnie przed integracją. Nie jest to pomiar tokenów ani progu awarii.

### Zmiana rozmowy — 2026-11-25, czat (4) → (5)
Użytkownik zgłosił przeciążenie (4) po ostatnim zapisanym II-B10b: 10 zakończonych partii II-B, 79 unikatowych kandydatów, B8 i B10 po dwa checkpointy. Nie znamy przyczyny, progu ani dokładnego momentu awarii. Czat (5) odzyskał stan z HEAD 20293c8.

### Kolejna obserwacja — 2026-11-25, czat (5), II-B11a
1 zapisany checkpoint produkcyjny (B11 WIP), 79 unikatowych kandydatów; 4 zaktualizowane modele. Obciążenie orientacyjne umiarkowane (odczyty katalogu, pamięci i kodu, jedna partia produkcyjna); brak licznika kontekstu. Próba git ls-remote nieudana z powodu DNS w kontenerze, pierwsza walidacja V8 przerwana przez składnię export async, obie przeszkody obejściowe; ponowna walidacja i zapis GitHub udane. Kontynuacja mniejszymi partiami; checkpoint aktualny.

### Kolejna obserwacja — 2026-11-25, czat (5), II-B11b
2 zapisane checkpointy produkcyjne (B11 WIP), 79 unikatowych kandydatów, 15 zaktualizowanych modeli w tym czacie. II-B11b: 11 modeli, 84 obroty V8, zapis nakładki i raportu udany; bez zgłoszonej awarii aplikacji. Obciążenie orientacyjne umiarkowane, rosnące; brak pomiaru kontekstu i progu awarii. Kontynuować małymi partiami; checkpoint aktualny.

### Kolejna obserwacja — 2026-11-25, czat (5), II-B11c
3 zapisane checkpointy produkcyjne (B11 WIP), 79 unikatowych kandydatów, 22 zaktualizowane modele w tym czacie. II-B11c: 7 modeli, 48 obrotów V8, zapis nakładki i raportu udany; bez zgłoszonej awarii aplikacji. Obciążenie orientacyjne umiarkowane, rosnące; brak pomiaru kontekstu i progu awarii. Kontynuować małymi partiami; checkpoint aktualny.

### Kolejna obserwacja — 2026-11-25, czat (5), II-B11 FINAL
4 zapisane checkpointy (3 partie wyposażenia + pełny przegląd), 79 unikatowych kandydatów, 163 modele zbadane w 916 obrotach kondygnacji. W tym czacie 22 modele zaktualizowano przed audytem. Użytkownik wskazał powielenie prac; skorygowano harmonogram. Pierwsza próba audytu przerwana przez brak structuredClone w V8, ponowna zakończona powodzeniem. Raport i pamięć zapisane; brak zgłoszenia awarii. Obciążenie orientacyjne wysokie z uwagi na odczyty licznych nakładek, kodu i pełnego raportu; bez telemetrii kontekstu. Zalecany nowy czat przed obszernym II-B12.

### Kolejna obserwacja — 2026-11-25, czat (5), II-B12a
5 zapisanych checkpointów (3 partie B11, pełny przegląd, B12a). 93 unikatowe ID nakładkowe; 28 modeli skontrolowanych i 25 zmienionych w B12a. Pierwsza próba przerwana przez brak notes w starszych modelach, poprawiona i wykonana ponownie. Obciążenie orientacyjne wysokie; brak telemetrii i progu awarii. Zapis i testy zakończone, brak nowego zgłoszenia awarii. Zalecana zmiana czatu przed rozbudowanym B12b lub integracją.

### Kolejna obserwacja — 2026-11-25, czat (5), II-B12b–e
6 checkpointów rozmowy (B12b–e skonsolidowany). 110 unikatowych ID nakładkowych. Kilka prób dużej korekty zamków odrzucono przez walidację; zapisano wyłącznie poprawne indywidualne aneksy. Pełny audyt po B12c i korekty B12d/e zapisane. Obciążenie orientacyjne bardzo wysokie, brak telemetrii i progu awarii; przed dalszą rozbudowaną pracą zalecany nowy czat, bez ponawiania B11.

**Dopisek do checkpointu 6:** pierwszy globalny regres przerwany przez rozłączenie serwera, ponowiony odczyt w paczkach po 4 pliki zakończony powodzeniem. Obciążenie orientacyjnie bardzo wysokie; zalecany nowy czat. Regres po B12e potwierdzony: 163/163 modeli, 110 nakładkowych, 229 kondygnacji, 609 pomieszczeń, 2585 obiektów, 5164 dekoracje, 2906 stanowisk, 916 obrotów bez błędów w wykonanych kontrolach; izolacja 0, granice 0, nierozstrzygnięte sygnały przekrojów i maski ścian 0. Pozostały dokładnie 33 zgłoszenia wymiarowe w 25 modelach (138 bez takich zgłoszeń). Dane: templates/mtl/ids-regression-after-b12e.json, raport docs/MTL_AUDIT_0.3.44_PASS2B12B_E.md. Rozstrzygnąć skończoną listę korekt/indywidualnych wyjątków; nie wracać do B11. r14 bez zmian, r15 nieopublikowana.
