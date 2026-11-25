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


## Checkpoint II-B12f — WIP (czat 6)
II-B12f WIP: 33 pozycji zamkniętej listy; 12 korekt w 10 modelach, 12 indywidualnych propozycji wyjątków do akceptacji, 9 nadal wymagających korekty; 60 obrotów kondygnacji sprawdzonych w V8 dla zmienionych modeli (FPS, RTS, dekoracje, kolizje, dojścia, izolacja i granice). Nie uruchamiano Node, przeglądarki, Android ani pełnego MFS. r14 bez zmian; r15 nieopublikowana. Nie powtarzać II-B11. Szczegóły w templates/mtl/pass2b12f-candidates.json. Obciążenie wysokie (duży odczyt źródeł i operacja zbiorcza); brak telemetrii; checkpoint, kontynuacja od nierozstrzygniętych pozycji.


## Checkpoint II-B12g — WIP (czat 6)
II-B12g WIP: kontrola semantyczna B12f; 11/33 korekt kandydackich, 14 indywidualnych wyjątków proponowanych do akceptacji, 8 nadal otwartych. 5 modeli zmieniono w B12g, 40 obrotów w V8; urealniono etykiety kuchni, kancelarii i jadalni, rozstrzygnięto źródło RUR_STABLE_L01 B8b. Nie uznawać strefy niespełniającej §50 za magazyn, gdy ma funkcję kuchni. Brak pełnego odbioru, r15 nieopublikowana. Obciążenie wysokie; druga partia, 5 odczytanych modeli wymagających korekty semantycznej, bez znanych objawów awarii; brak telemetrii.


## Checkpoint II-B12h–B14 — r15 review (czat 6, 2026-11-25)
Lista 33: 19 korekt, 14 uzasadnionych wyjątków proponowanych do akceptacji, 0 nierozstrzygniętych. B12h: 8 modeli, 68 obrotów V8, commit 40429f3. Rejestr: templates/mtl/pass2b12h-candidates.json, docs/MTL_AUDIT_0.3.44_PASS2B12H.md. B13: catalog-v15.json (0.15.0), 118 ID z nakładek, 163 modele/229 kondygnacji/628 pomieszczeń/2585 obiektów/5164 dekoracji/2906 stanowisk wnętrz/191 definicji mebli. Regres całej biblioteki przed korektą kotwic: 916 obrotów V8, 0 FPS/RTS/dekoracje. Pełny profil MFS początkowo wykrył 7 kotwic na wyposażeniu w 5 modelach, poprawiono je w tych samych pokojach (99fee41, r15-anchor-fixes.json); powtórna walidacja kompletnej galerii r15: 0 ERROR, 0 WARNING, 1 INFO, 230 scen, 2930 stanowisk razem z infrastrukturą; RURAL_AREAS 0. Galeria r15 na main (5bc4e43), wpis tylko w maps/review.json, r1–r14 i maps/world.json bez zmian. Raport templates/mtl/r15-mfs-final-report.json. B14 techniczny profil final pozytywny, ale nie pełna akceptacja: pominięte IDS_PROGRAM, RDS_VEHICLES, NPC_RUNTIME, MDS_MANUAL; 14 wyjątków i klasyfikacja depozytu/sztabu do akceptacji; wizualny odbiór, Node, przeglądarka/Android, Pages, offline i rzeczywista logistyka pozostają otwarte. Nie wracać do B11 ani otwierać nowej ogólnej listy wymiarowej. Przed produkcyjnym użyciem r15 rozstrzygnąć akceptację i sprawdzić wizualnie. Następnie Nowe Miasto 1, osobna mapa review, plan migracji ID i zapisów według MFS §; zachować legacy, DNS nadal wstrzymany.
Obciążenie orientacyjne wysokie: 6 zapisanych partii (B12f/g/h, katalog, kotwice, galeria), 33 rozstrzygnięcia, 163 modeli, liczne operacje, dwie przerwane próby zapisu/odczytu narzędzia; wznowienie zakończone. Brak telemetrii kontekstu. Zalecany nowy czat przed budową miasta.

## CMS 1.0 — audyt po czacie (6), 2026-11-25
Użytkownik zgłosił wyczerpanie pamięci po jednym poleceniu. Zapis czatu (6) wykazuje 6 partii i dwie przerwane próby narzędzia; przyczyna limitu niepotwierdzona. Przed migracją handover 19095 znaków, stan 13367, backlog 16022, reguły 2630. Wdrożono odczyt warstwowy i ograniczenie partii; odczyty dokumentów oraz aktualizacje wyłącznie dokumentacyjne. Obciążenie audytu orientacyjnie wysokie, brak telemetrii; zalecany nowy czat i test A/B/C z CMS_1.0.md. Nie wykonano testów gry.

- 2026-11-25 | MTL-006 decyzje r15 | Odczyt: handover/reguły, metadata HEAD i checkpointu, B12h/B9, selekcja results 14/33 z JSON (~252 kB przetworzone w narzędziu; powtórny odczyt do selekcji), właściwe sekcje MDS/FDS, checkpoint plików pamięci; pełne logi nieprzekazane do kontekstu. 16 propozycji, brak testów i zmian map. Obciążenie orientacyjne: umiarkowane; brak przerwań, początkowa ścieżka WORK_RULES 404 skorygowana; checkpoint pakietu. Nowy czat niewymagany do decyzji.

- 2026-11-25 | MTL-006 zapis decyzji | 16/16 zatwierdzeń, 0 odrzuconych, 0 nierozstrzygniętych; HEAD, handover/reguły, pakiet decyzji i wymagane pliki checkpointu; logi przetworzone w narzędziu bez przekazania pełnej treści do kontekstu. Bez nowych odczytów katalogów, testów i następnej partii. Obciążenie orientacyjne: umiarkowane, zmiana czatu niewymagana do krótkiego zapisu; checkpoint CMS. STOP użytkownika.

- 2026-11-25 | Zamknięcie zakresu r15 | Selektywnie handover/reguły, protokół, report, rejestr, manifest, buildings, 17 kondygnacji 12 modeli (część powtórnie), checkpoint; próba odczytu katalogu 2,45 MB przerwana przez niepełny JSON (bez przekazywania całości do kontekstu); git DNS i pobranie archiwum niedostępne, Node/Chromium nieuruchomione na repo. Obciążenie orientacyjne: wysokie; rekomendowany nowy czat przed CITY-001a; żadnego nowego etapu. Checkpoint CMS z jawnymi zaległościami.

- 2026-11-25 | CITY-001a.01 WIP | Odczyt: handover/reguły, HEAD i checkpoint, stan/roadmap/backlog, właściwe fragmenty GDD/MDS/MFS z plików projektu, maps/world.json (1 wpis testowy), logi przetworzone w narzędziu. Początkowe 404 ścieżek root skorygowane; indeks Files nie zwrócił źródeł, wykorzystano zamontowane dokumenty. Bez katalogu, kodu, map i runtime. Orientacyjnie umiarkowane; brak przerwań, zmiana czatu niewymagana do akceptacji. Checkpoint WIP.

- 2026-11-25 | CITY-001a.02 WIP | HEAD=b360ead, handover/reguły/karta, selektywne sekcje zamontowanych MDS/MFS/GDD (Files nie zwrócił plików), pliki pamięci do checkpointu; logi tylko końcówki. 6 zatwierdzonych parametrów, 8 kontroli dokumentacyjnych; bez katalogu i testów. Orientacyjnie umiarkowane, zmiana czatu niewymagana przed 03. Checkpoint dokumentacyjny.

- 2026-11-25 | CITY-001a.03 WIP | HEAD=f0eba34; handover/reguły/topografia, selektywny odczyt zamontowanych MDS/MFS/GDD po pustym wyniku Files; 8 zaakceptowanych decyzji, 8 obszarów, 9 propozycji; pliki checkpointu przetworzone w narzędziu. Brak odczytu katalogu, zmian gry/testów. Orientacyjnie umiarkowane; zmiana czatu niewymagana dla krótkiej akceptacji, zalecana przed dużą partią jeśli obciążenie wzrośnie.
