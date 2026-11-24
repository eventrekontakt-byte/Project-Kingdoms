## Alpha 0.3.28 — DNS 1.0: minimapa i zoom

- Minimalny zoom lokalnej mapy to 50%, maksymalny nadal 300%. Starsze zapisy z 25% są automatycznie ograniczane do 50%; rozmiar okna mapy pozostaje bez zmian.
- Dodano zwijaną minimapę w prawym górnym rogu, również we wnętrzach i na różnych piętrach. Pokazuje uproszczony teren, drogi, mury, bohatera, mieszkańców, aktywnych przechodniów, obserwowanego NPC, zamknięte bramy i rzeczywisty zasięg kamery.
- Teren rysowany jest raz na mapę/piętro do rastra; pamięć podręczna ograniczona do 5 map. Znaczniki i kamera aktualizowane do 4 razy na sekundę podczas zwykłej pracy; zmiana mapy i ręczny zoom odświeżają natychmiast. Zwijanie zatrzymuje odświeżanie minimapy.
- Testy V8 z atrapą Canvas: poprawne ograniczenie zoomu, proporcje, prostokąt kamery, brak ponownych odczytów 30 720 kafli miasta, 4 odświeżenia w pierwszej sekundzie, zmiana piętra i limit 5 rastrów. Składnia JS poprawna. Test rzeczywistej przeglądarki mobilnej pozostaje do wykonania.
- Użytkownik potwierdził działanie wejść NPC w 0.3.27 na swoim urządzeniu. Kolejny etap: 0.3.29 optymalizacja DNS 1.0.

## Alpha 0.3.27 — DNS: pamięć i wnętrza NPC

- Wspólne portale NPC i gracza: widoczni mieszkańcy dochodzą do rzeczywistego progu, pojawiają się po wewnętrznej stronie i wychodzą przez drzwi.
- NPC tła L0 i L2 mogą odwiedzać publiczne budynki, chodzić po parterze i wracać na ulicę. Ograniczony budżet równoczesnych wizyt.
- Dotknięcie wybiera obserwację, Zbadaj otwiera rozmowę. Rozmowa lub dłuższa obserwacja zachowuje tożsamość w rejestrze do 32 osób; zapis zachowuje wygląd, pozycję, licznik spotkań. Starsze zapisy schema 9 obsługiwane.
- Testy symulacyjne na rzeczywistych modułach w V8: 24 poprawne portale, wejście i wyjście L2, 24 kroki we wnętrzu, odtworzenie tożsamości i licznika rozmów, fizyczne wejście stałego mieszkańca, 4 wejścia L0 w 90 sekund przy aktywnej symulacji 40 mieszkańców; maks. 38 NPC tła, 0 kolizji między NPC. Test w mobilnej przeglądarce nadal wymagany. Bez zmian mapy, zoomu i minimapy.

## Alpha 0.3.26 — DNS 1.0: obserwacja NPC

- Dodano wybór obserwowanego NPC tła przez dotknięcie jego sylwetki lub Zbadaj w pobliżu. Ponowne dotknięcie anuluje obserwację.
- NPC zdobywa czas obserwacji podczas widoczności i bliskości gracza; po około 20 sekundach otrzymuje poziom L1 i dłuższe trasy, a po około 60 sekundach śledzenia L2 i cele podróży między częściami miasta.
- Zachowana zostaje tożsamość, kolor, położenie i animacja postaci podczas zmiany poziomów — nie ma teleportacji.
- Nowy budżet CPU: najwyżej 3 NPC ze zwiększoną szczegółowością i tylko 1 priorytetowy L2. Planowanie tras korzysta z ograniczonego BFS, a pozostałe NPC poruszają się tanim algorytmem lokalnym.
- Oznaczenie obserwowanego NPC na mapie oraz informacja o poziomie i czasie śledzenia w panelu DNS.
- Test symulacyjny 85 s: L1 po 20,02 s, L2 po 60,06 s; 0 naruszeń geometrii, 0 kolizji NPC; zachowane imię, kolory i obiekt aktora.
- Nadal brak trwałej pamięci i przejść do wnętrz dla NPC tła: to zakres etapu 0.3.27. Zoom 50% i minimapa również pozostają na później.
- Nie zmieniano mapy ani formatu zapisów; test przeglądarkowy na Androidzie pozostaje do potwierdzenia.

## Alpha 0.3.25 — DNS 1.0: strumieniowanie mieszkańców tła

- Dodano osobny moduł engine/dns-population.js oraz generowanie NPC na żądanie w sąsiedztwie kamery.
- Miasto dzielone na sektory 12×12 kratek; aktywne są tylko sektory przy aktualnej kamerze wraz z buforem.
- 40 dotychczasowych NPC pozostaje w grze. Obok nich silnik obsługuje maksymalnie 38 tymczasowych przechodniów.
- Gęstość postaci tła zależy od części miasta i pory dnia. Postacie pojawiają się poza widocznym ekranem, a potem pieszo wchodzą w kadr.
- Ruch tła wykorzystuje tani algorytm lokalny i nie uruchamia kosztownego A* ani pełnych harmonogramów.
- Po opuszczeniu obszaru symulacji i 14 sekundach poza zasięgiem niezapamiętane postacie są zwalniane z pamięci.
- NPC tła nie są zapisywani w plikach kampanii, nie zastępują postaci ważnych i na tym etapie nie mają pełnych rozmów ani pamięci.
- W bocznym panelu widoczny licznik aktywnych, wygenerowanych i zwolnionych postaci.
- Sprawdzone statycznie i w symulacji: 38 NPC tła to twardy limit; przy rynku 14 tymczasowych aktorów weszło w widoczny obszar w 20 sekund; 0 pojawień bezpośrednio w kadrze i 0 wejść w mury/drzwi. Test ręczny na Androidzie wciąż potrzebny.
- Zoom 50%, minimapa, promocja śledzonych NPC i ich trwała pamięć pozostają do następnych wersji serii 0.3.

## Alpha 0.3.24 — DNS 1.0, etap 1: spójne profesje i zachowania

- Zainicjowano architekturę DNS 1.0; szczegółowy projekt zapisano w docs/DNS-ARCHITECTURE.md.
- Zachowano 40 NPC w Mieście 1; 12 oznaczono jako permanent (kluczowi mieszkańcy), pozostałe 28 jako resident. Dynamiczne generowanie NPC tła nie jest jeszcze aktywne.
- 12 ważnych postaci otrzymało spójne profile: zawód, faktyczne miejsce pracy, zachowanie i zgodną wypowiedź. Berta pracuje w hali targowej, Daria prowadzi karczmę, Cedryk pracuje w kuźni itd.
- Zwykli kupcy kierowani są na targ, zamiast losowo do apteki czy karczmy. Odpowiedź o pracy uwzględnia rzeczywiste stanowisko postaci.
- Dowódca straży i strażnicy patrolują kolejne punkty kontrolne, a nie stale chodzą w małym kółku. Posłańcy otrzymali dłuższe trasy.
- Pracownicy we wnętrzach wykonują znacznie rzadsze przemieszczenia, pozwalając im pozostawać przy miejscu pracy. Status "Co teraz robisz?" opisuje zawód i stanowisko.
- Rozszerzono grafikę nakryć głowy o dowódcę straży; pozostała oprawa NPC bez zmian.
- Nie zmieniano układu miasta, zoomu, minimapy ani struktury zapisu (schema 9). Te funkcje należą do następnych etapów DNS.
- Wczytywanie starszych zapisów resetuje fazę rutyny NPC do ponownego przeliczenia, dzięki czemu kupiec zapisany wcześniej w błędnym miejscu pracy trafia do właściwego budynku bez czyszczenia historii rozmów.
- Test logiczny dnia 6:00–24:00: Berta o 8:42 i 12:00 jest w hali targowej, w godzinach nocnych przebywa w domu; nie wykryto kolizji NPC, ani niedozwolonych pozycji. Symulacja patrolu dowódcy i strażnika objęła odpowiednio 83 i 78 różnych kratek w próbie. Test mobilny w przeglądarce pozostaje do wykonania.

## Alpha 0.3.23 — NPC 1.2.2: naprawa ruchu na ekranie

- Naprawiono stan NPC przy miejscu pracy lub spotkań: po wyznaczeniu celu spaceru nowy cel nie jest już nadpisywany przed rozpoczęciem marszu.
- Wcześniej warunek „stoi w celu” był wykonywany co 220 ms mimo oczekiującej trasy, przez co NPC sprawiali wrażenie nieruchomych, a poza zasięgiem byli przenoszeni uproszczoną symulacją.
- Teraz NPC zachowują wylosowany punkt spaceru i docierają do niego krok po kroku, po czym mogą wrócić do miejsca pracy lub spotkań.
- Test regresji: statyczna pozycja gracza przez 66 sekund, osiem symulacji ruchu przy 8:00, 10:00, 15:00 i 18:00 w rejonie rynku, świątyni, karczmy i centrum. W każdej z testowanych konfiguracji odnotowano poruszających się NPC w polu widzenia.
- Bez zmian w układzie miasta, harmonogramach dnia i formacie zapisów. Test w przeglądarce na Androidzie nadal wymaga potwierdzenia.

## Alpha 0.3.22 — NPC 1.2.1: powroty do domów i wejścia do budynków

- Naprawiono przydział noclegów: wcześniej każdy budynek (w tym kuźnia, arena i magazyn) mógł zostać "domem" NPC. Teraz 40 mieszkańców ma domy w czterech dostępnych budynkach mieszkalnych (Dom 1–4).
- NPC mają osobne współrzędne wejścia do domu, pracy i miejsc spotkań; ruch prowadzi do faktycznego wejścia, a nie losowo przesuniętego pola zbiórki.
- Pola drzwi wyłączono z nawigacji pieszej NPC, aby nikt nie stał w progu i nie blokował przejść.
- Rozproszono niezależne miejsca pracy na ulicach i trasy strażników, zamiast ustawiać niezatrudnionych wewnątrz budynków mieszkańców pod drzwiami sklepów i świątyni.
- Po zakończeniu spotkań NPC wchodzą do domów już wieczorem. Przejścia morning→work oraz evening→sleep nie powodują ponownego opuszczania budynku.
- Dodatkowe zabezpieczenie: jeśli NPC nie dotrze na czas do domu przez blokadę lub niedostępną trasę, po 50 minutach gry od pory snu jego harmonogram zostaje wyrównany do prawidłowego mieszkania.
- Starsze zapisy z NPC nocującymi w nieodpowiednich budynkach podlegają korekcie przy aktualizacji harmonogramu; zachowano ten sam klucz zapisu i schemat 9.
- Test symulacyjny 08:00–00:00, trzy lokalizacje obserwatora: o 22:00, 23:00 i 00:00 wszystkie 40 NPC w prawidłowych mieszkaniach; 0 postaci na polach drzwi; brak kolizji pozycji i nieprawidłowych pól; poprawne zapisanie i odtworzenie stanu NPC.
- Test w realnej mobilnej przeglądarce pozostaje do potwierdzenia przez gracza.

## Alpha 0.3.21 — NPC 1.2: życie codzienne i rozproszenie tłumu

- Zachowano 40 postaci z hybrydową symulacją (12 ważnych + 28 pozostałych).
- Wprowadzono osiem miejsc spotkań o limitach miejsc: karczma (6), rynek (8), świątynia (4), plac areny (5), skwer (5), dziedziniec (4), kasyno (3), biblioteka (5). Każdy NPC ma jeden przydział, dlatego nie ma już masowego zgromadzenia przed karczmą.
- Każdy mieszkaniec ma nieco inne godziny rozpoczęcia i zakończenia pracy, spotkań oraz nocnego odpoczynku.
- NPC odwiedzają realne wnętrza budynków: praca, spotkania i nocny wypoczynek. Przy graniu w tej samej lokacji mogą chodzić po dostępnych posadzkach i rozmawiać z graczem.
- Poprawiono uproszczoną symulację poza ekranem: podróż jest kończona bez stałych obliczeń A*, a miejsce przybycia nie powinno nachodzić na inne NPC.
- Dialogi: pytania o zajęcie, bieżącą aktywność, miasto i plotki; postacie zapamiętują liczbę rozmów i po kilku spotkaniach rozpoznają gracza.
- W karczmie i innych wnętrzach można rozmawiać przez przycisk Zbadaj, nie tylko na ulicy. Przy drzwiach pierwszeństwo ma wejście do budynku, a NPC można dotknąć na ekranie.
- Ograniczono nadmiar etykiet nad postaciami i ujednolicono importy świata/mapy, co ogranicza wielokrotne inicjalizacje modułów.
- Rozszerzono stan NPC w dotychczasowym schemacie zapisu 9 o typ aktywności wewnątrz budynku, aktualny etap dnia i liczbę spotkań; starsze zapisy pozostają obsługiwane.
- Testy kodowe: 40 NPC, 8 miejsc, brak błędnych pól ani nakładających się pozycji w próbie 17:00–23:00. Test ręczny w mobilnej przeglądarce wciąż wymagany.

## 0.3.20-alpha — NPC 1.1: trasy, animacja i plany dnia
- Zachowano populację 40 NPC, w tym 12 ważnych postaci.
- Zastąpiono krótkie losowe kroki trasami A* do pracy, targu, karczmy i domu; pojedyncze spacery obejmują kilkanaście lub kilkadziesiąt kratek.
- Wprowadzono podstawowy harmonogram: rano / praca / spotkania / powrót / noc. Ważne postacie mogą znikać z ulicy po powrocie do swojego budynku i pojawiać się w jego wnętrzu.
- Symulacja NPC poza sąsiedztwem gracza działa uproszczonym modelem; planowanie tras i animacja obejmują przede wszystkim pobliskich mieszkańców.
- Dodano rysowane w Canvas sylwetki z głową, ubiorem, nakryciem głowy zależnym od profesji, kierunkiem patrzenia i animacją nóg.
- Rozmowy mają teraz okno z opcjami: praca, miasto, pożegnanie. Obsługa na telefonie przez E/Zbadaj lub dotknięcie pobliskiej postaci.
- Zapis lokalny przechowuje pozycję i miejsce pobytu NPC (schema 9). Wczytywanie wcześniejszych zapisów pozostaje możliwe.
- Zaktualizowano wersję aplikacji i cache offline.
- Weryfikacja kodowa: 40 NPC, symulacja 90 s, 34 postacie zmieniły pozycję o 15+ kratek; składnia JS poprawna. Test na Androidzie pozostaje do wykonania.

## Alpha 0.3.13 — optymalizacja miasta i wnętrz
- Usunięto kolizję domu z biblioteką i kolizję apteki z bramą wschodnią.
- Dodano walidator nakładania się budynków, bram i wyjść.
- Usunięto wielokrotne obliczanie masek BIS i wejść podczas renderowania każdej kratki.
- Dodano statyczne układy mebli w pozostałych budynkach, z kolizją i grafiką wielokratkową.
- Zachowano dotychczasowe działanie bram i zapisów.

## 0.3.12-alpha — VIS 1.8: interaktywne bramy miejskie
- Cztery bramy miejskie mają niezależne, podnoszone i opuszczane kraty.
- Użycie Zbadaj/E w pobliżu bramy przełącza stan kraty.
- Opuszczona krata blokuje przejście, także w automatycznym wyznaczaniu trasy.
- Nie można opuścić kraty na polu zajmowanym przez bohatera.
- Stan bram jest zapisywany i przywracany razem z kampanią.
- Zachowano konstrukcje 5×5, chodniki obronne i wszystkie cztery przejazdy.

## 0.3.11.1-alpha — poprawka uruchamiania
- Usunięto błąd „undefined is not iterable” podczas rysowania bram przy mieszaniu wersji modułów.
- Dodano odświeżenie importu definicji bram oraz zabezpieczenie dla starszych danych.
- Odświeżono cache aplikacji.

## 0.3.11-alpha — cztery bramy miejskie
- Usunięto testowy most i wieżę z balkonem oraz ich specjalne powierzchnie Z.
- Cztery stałe bramy: północna, południowa, zachodnia i wschodnia.
- Każda brama ma gabaryt 5×5 kratek, w porównaniu do muru grubości 3 kratek; przejazd 3 kratki szerokości i dwie boczne wieże po 1 kratce.
- Przejazdy pozostają otwarte i przechodnie, z wizualizacją kamiennych wież i podniesionej kraty.
- Zachowano mury obronne i poziomy Z oraz obsługę tras.

## 0.3.10-alpha — VIS 1.6: wieża i balkon (bez przejścia do 0.4)
- Miasto 1: testowa wieża strażnicza z dostępnym dachem (x=39–40, y=49–51) i balkonem (x=38, y=50).
- Wejście na dach przez istniejące schody (40,52), poziom Z=2; możliwość zejścia i powrotu.
- Dach i balkon współdzielą system kolizji i poziomów z mostem, a teren pod nimi pozostaje niezależną powierzchnią Z=0.
- Dodano kamienne blanki, fakturę tarasu i drewnianą balustradę balkonu.
- A* rozpoznaje dach i balkon jako powierzchnie na wysokości Z=2.
- Wersja nadal 0.3.x: rozwijamy mapy przed awansem do 0.4.

## 0.3.9.1-alpha — poprawka uruchamiania
- Naprawiono błąd „elevation.js does not provide an export named CITY_BRIDGE” wywołany użyciem starej wersji modułu z pamięci przeglądarki.
- Dodano wersjonowane adresy importów elevation.js i pathfinding.js oraz ich wpisy w pre-cache.
- Zmieniono wersję service workera, aby wymusić odświeżenie zasobów.

## 0.3.9-alpha — VIS 1.5: dwupoziomowe powierzchnie
- Demonstracyjny drewniany most w Mieście 1 (x=40, y=53–58), nad drogą y=55–57; dwa podejścia schodowe (40,52) i (40,59).
- Most posiada dwie powierzchnie ruchu na tych samych współrzędnych: teren Z=0 pod spodem i pomost Z=2 na górze.
- Schody Z=1 są jedynym legalnym wejściem na górną powierzchnię; próba zejścia z krawędzi mostu jest blokowana.
- Bohater przechowuje wysokość z w stanie i zapisie gry; starsze zapisy automatycznie wyliczają z z terenu.
- A* rozróżnia węzły x,y,z i przejścia pomiędzy powierzchniami.
- Pomost jest półprzezroczysty, kiedy postać znajduje się bezpośrednio pod nim, aby zachować widoczność.
- To prototyp mostu i systemu z; nie wprowadzono jeszcze skoków ani swobodnego chodzenia po dachach.

## 0.3.8-alpha — VIS 1.4: model wysokości Z
- Niezależny od kondygnacji model wysokości: grunt Z=0, schody na mur Z=1, chodnik obronny Z=2.
- Wysokość terenu wynika z typu kratki; istniejące zapisy i portale nie wymagają migracji.
- Płynna interpolacja wysokości bohatera podczas wejścia na schody i zejścia z murów, zsynchronizowana z animacją kroku.
- HUD pokazuje aktualny poziom Z i orientacyjną wysokość w metrach (1 poziom = 1,5 m).
- Dachy budynków mają metadane wysokości, gotowe do przyszłych balkonów, wież, mostów i eksploracji dachów.
- Model Z jest fundamentem pod przyszłe kolizje pionowe; w tej wersji nie odblokowuje chodzenia po dachach ani skoków.

## 0.3.7-alpha — VIS 1.3: podwyższone mury i schody
- Chodnik murów obronnych otrzymał pionową, ciemniejszą krawędź muru od strony miasta i cień padający na niższy teren.
- Blanki zewnętrzne mają kamienną fakturę i obrys, nie są powiązane z pozycją postaci.
- Schody na mury są przedstawione jako pięć stopni z gradientem wysokości, zamiast pojedynczej fioletowej strzałki.
- Bohater na murze otrzymał subtelnie przesunięty cień na podłożu, bez otoczki wokół postaci.
- Bez zmian w kolizjach, trasach, zapisach i działkach.

## 0.3.6-alpha — VIS 1.2: dachy i mury obronne
- Zastąpiono wąskie, unoszące się paski nad budynkami pełnymi dachami dwuspadowymi z kalenicą, rozróżnieniem połaci, rysunkiem dachówek i pasem elewacji.
- Usunięto sztuczną obwódkę wokół postaci na murach.
- Dodano ciągłą wizualizację podwyższonego chodnika murów: jasne blanki po stronie zewnętrznej, zacieniona krawędź od strony miasta, kamienna nawierzchnia.
- Wizualizacja nie zmienia kolizji, przejść, zapisów ani geometrii działek.
- Wysokość pozostaje na razie efektem 2.5D, nie pełną symulacją pionowej perspektywy.

## 0.3.5-alpha — VIS 1.1: pierwsza warstwa wysokości 2.5D
- Miasto 1: projekcja podwyższonych dachów i górnych elewacji z wizualnym rozróżnieniem 1, 2 i 3 kondygnacji.
- Dachy nie przesłaniają drzwi na poziomie parteru, nie wpływają na siatkę kolizji ani układ PLOT.
- Podczas spaceru po murach wyświetlany jest subtelny wskaźnik wysokości.
- Zachowano płynny ruch, kamerę VIS 1.0 i rezerwacje PLOT 1.0.
- To etap wizualny 2.5D; docelowe balkony, dachy jako odrębne poziomy oraz różnice wysokości gruntu wymagają kolejnych prac.

## 0.3.4-alpha — PLOT 1.0 i reorganizacja działek Miasta 1
- Miasto 1 podzielono na 39 działek: 32 istniejące zabudowane oraz 7 nowych pustych terenów pod przyszłe budowy.
- Nowe działki automatycznie wybierane w wolnych fragmentach miasta, nie kolidują z budynkami, drogami i murami; mają co najmniej jedną kratkę bufora.
- Teren pustych działek jest oczyszczany z losowych drzew i wizualnie wyrównywany do łąki; istniejące budynki, ich drzwi, wnętrza i przejścia pozostają nienaruszone.
- Rejestr działek ma stabilne identyfikatory, obrysy, właściciela, status, powiązanie z budynkiem i walidację przyszłych parceli.
- Nowy tryb zarządzania w menu: widoczne tylko wtedy granice działek, wybór dotykiem, informacje o działce i rezerwacja/zwolnienie wolnej działki.
- Rezerwacje zapisują się w kampanii (schemat zapisu 8); stare zapisy nadal są odczytywane.
- Istniejące działki są oznaczone jako legacy: ich historyczny układ nie musi spełniać nowego bufora. Nowe działki muszą spełniać wymóg.
- Budowa, przebudowa i wyburzanie są przygotowane strukturalnie, lecz nie są jeszcze aktywnymi mechanikami.

## 0.3.3-alpha — BIS 1.0
- Wymiary wnętrz Miasta 1 wynikają z wymiarów budynku na mapie: 1 kratka elewacji = 3 kratki wnętrza w obu osiach.
- Nowy moduł engine/bis.js: maski obrysu, drzwi zgodne z fasadą, obsługa kształtów L i T oraz pełnych prostokątów.
- 23 standardowe wnętrza Miasta 1 korzystają z BIS; wyeliminowano arbitralne rozmiary 22x17 i 30x22.
- Karczma 01 ma teraz dokładnie 36x27 kratek (zewnętrzne 12x9), trzy kondygnacje, zachowane wyposażenie i schody; wejście i teleportacja dostosowane do nowego wymiaru.
- PLOT 1.0 i wizualne wysokości 2.5D pozostają zaplanowane na 0.3.4–0.3.5.

## 0.3.2-alpha — VIS 1.0: płynne poruszanie i kamera
- Współrzędne logiczne gracza nadal są kafelkowe, ale pozycja na ekranie jest interpolowana przez 150 ms (smoothstep).
- Kamera ma wygładzone podążanie i martwą strefę 0,9 × 0,65 kratki; nie przeskakuje już automatycznie po każdym kroku.
- Przesuwanie mapy palcem zachowuje ręczną kontrolę nad kamerą do następnego kroku lub wycentrowania.
- Teleportacje, wczytanie zapisu, zmiana mapy i kondygnacji resetują interpolację bez przesuwania postaci przez obce lokacje.
- Zatwierdzono kontekstową widoczność PLOT, BIS 1.0 i VIS 1.0; BIS/PLOT będą wdrażane w kolejnych wersjach.

## 0.3.1-alpha — naprawa teleportacji do karczmy
- Naprawiono rozjazd wersji: moduł game.js ładuje world.js z numerem wydania, world.js ładuje szablon karczmy z tym samym numerem.
- Offline fallback nie ignoruje już parametrów wersji adresu modułu, co zapobiega podstawianiu starej mapy 30×22 do nowej 36×28.
- Przy wejściu do karczmy używane są współrzędne nowego holu (18,26).

## 0.3.0-alpha — Karczma 01 i szybka podróż
- Ręcznie zaprojektowane 36×28, trzy kondygnacje: sala, kuchnia i zaplecze; pokoje; piwnica.
- 64 obiekty, w tym 20 krzeseł, stałe pozycje i kolizje TBI.
- Dwie pary schodów łączą parter z piętrem i piwnicą; nowa pozycja wejścia/wyjścia.
- Menu: szybka podróż bezpośrednio do karczmy na potrzeby testów.
- Testy logiki: brak kolizji; dostępność wszystkich obiektów z głównej sieci przejść na każdej kondygnacji.

## 0.2.9.1-alpha — stałe meble przy ścianach i powrót krzeseł
- Ręcznie poprawiono położenie 21 mebli, tak by cała odpowiednia krawędź dotykała ściany.
- Przywrócono 12 krzeseł przy trzech stołach; brak automatycznego przestawiania.
- Usunięto niepotrzebny losowy slot dekoracji; układ jest deterministyczny.
- Test modułu: 46 obiektów, 0 kolizji, 0 nieprzylegających mebli ściennych; wszystkie meble dostępne z osiągalnych pól obu pięter.

## 0.2.9-alpha — TBI 1.0, etap I
- Wprowadzono niezmienny wzorzec tavern-urban-01 i indywidualną instancję budynku.
- Wyłączono automatyczne przestawianie mebli oraz generowanie krzeseł w istniejącej karczmie.
- Renderowanie i kolizje korzystają z tej samej rozstrzygniętej listy obiektów; mapa zajętości budowana jednorazowo od zera.
- TBI obsługuje nakładki zmian obiektów, dekoracyjne sloty wariantów i walidację kolizji.
- To etap migracji, nie nowy ręcznie zaprojektowany układ karczmy (planowany w 0.3.0).

## 0.2.8.3-alpha — naprawa kolizji po przesuwaniu mebli
- Przebudowa mapy zajętości od zera z ostatecznych współrzędnych mebli, bez pozostałości po ich dawnych pozycjach.
- Walidacja całego układu i przejść po każdej próbie ustawienia mebla; odrzucanie nakładających się obiektów.
- Test kodu: 42 meble, 106 zajętych kafelków, 0 błędnych przylegań do ściany, obie kondygnacje przechodnie.

## 0.2.8.2-alpha — ściany i cache
- Meble wymagające ściany przylegają do niej całą tylną krawędzi; łóżka wezgłowiem, nie przypadkowym bokiem.
- Wymuszone odświeżenie modułów IGS i szablonu karczmy przez wersjonowane adresy importów, nowa wersja cache Service Workera.
- Testy logiki: 42 obiekty, brak błędnego przylegania mebli ściennych, połączenia przejść na obu piętrach.

## 0.2.8.1-alpha — poprawa rozmieszczenia mebli
- Wykrywanie ścian i granic funkcjonalnych pomieszczeń; łóżka, szafy, komody, regały, skrzynie, beczki i rośliny ustawiane przy ścianach.
- Rośliny preferują narożniki, duże meble zachowują dostęp i nie nachodzą na schody.
- Walidacja przejść po każdym przestawieniu mebla na obu kondygnacjach.
- Test modułowy: 42 obiekty, 0 mebli ściennych bez kontaktu ze ścianą, obie kondygnacje zachowują połączone główne przejścia.

## 0.2.8-alpha — fundament IGS 1.0 / przyszły edytor budynków
- Nowy moduł engine/igs/core.js: modele budynków, deterministyczne seed, katalog zasad mebli, ocena położeń, kontrola kolizji, dostępności i tras.
- Karczma korzysta z modelu IGS; krzesła przy stołach są generowane na podstawie identyfikatora budynku, bez blokowania wskazanych przejść.
- Przygotowano warstwę zmian gracza (przesuwanie/dodawanie/usuwanie obiektów i osobne zmiany kafelków), z zachowaniem pierwotnego szablonu.
- Schemat zapisu 7 przechowuje buildingEdits; wcześniejsze zapisy pozostają kompatybilne.
- Pełny edytor, przebudowa ścian i generowanie pozostałych mebli zostają na dalsze etapy.

## 0.2.7-alpha — bogatsze wnętrza karczmy
- 38 mebli i przedmiotów na dwóch kondygnacjach, w tym ławy, kredens, komody, beczki i rośliny.
- Duże schody 3×3 pola z drewnianymi stopniami i balustradą; logika przejścia zachowana na wspólnym polu obu kondygnacji.
- Dywany z obramowaniem, ścienne świeczniki ze świetlną poświatą, rośliny w donicach.
- Dekoracje nie blokują przejść; położenie mebli sprawdzane pod kątem kolizji.

## 0.2.6-alpha — schody i meble karczmy
- Naprawiono przejścia schodów: wspólne współrzędne schodów na obu piętrach, lądowanie obok schodów, bez resetowania pozycji po przejściu.
- Nowy system wyposażenia wielokratkowego z kolizją całego obiektu (stoły 3×2 i 2×3, łóżka 2×3, skrzynie 2×1, szafy 1×3).
- Meble rozmieszczono przy ścianach lub w funkcjonalnych grupach, pozostawiając korytarze.
- Indywidualne rysowane grafiki: stoły, lady, łóżka, skrzynie, szafy, komody, piece, kominki, beczki, regały, książki, krzesła.
- Test logiki: obie kondygnacje osiągalne, wszystkie 24 obiekty dostępne z sąsiednich pól, brak kolizji mebli ze ścianami i schodami.

## 0.2.5.3 — diagnostyka karczmy
- Kamera karczmy synchronizowana z pozycją gracza podczas każdego renderowania.
- Widoczne współrzędne bohatera, kondygnacja i rozmiar mapy w interfejsie.
- Zabezpieczenie przed nieprawidłowymi współrzędnymi, również nieliczbowymi.
- Wymaga potwierdzenia testem na telefonie.

## 0.2.5.2 — naprawa pozycji gracza w karczmie
- Gracz pojawia się dwie kratki wewnątrz wejścia, a nie przy samej krawędzi.
- Dodano automatyczne przywracanie poprawnej pozycji przy wykryciu błędnych współrzędnych we wnętrzu.
- Przy wejściu do karczmy przywracany jest czytelny poziom powiększenia.
- Zmieniono wersję zasobów offline; konieczny test na Androidzie.

## 0.2.5.1 — naprawa karczmy
- Usunięto nadpisywanie mapy karczmy przez ogólną definicję wnętrz Miasta 1. Wymiary 30×22 i dwie kondygnacje są teraz poprawnie rejestrowane.
- Poprawiono odświeżanie wersji i pamięci offline.

## 0.2.5-alpha — pierwsza karczma modułowa
- Dwupoziomowa karczma w Mieście 1 (30×22 pól na poziom), schody i pomieszczenia.
- 19 obiektów wyposażenia; menu interakcji mobilnych, pojemniki, czytanie, odpoczynek.
- Przedmioty mają właścicieli; zabranie cudzych rzeczy zmniejsza reputację i zapisuje wykroczenie.
- Ekwipunek i stan obiektów w zapisie gry (schemat 6, kompatybilny z wcześniejszymi).
- Test logiki: wszystkie 19 obiektów dostępne, wejście i schody osiągalne.
- Reakcje NPC, system świadków i pełna kontrolowana losowość są zaplanowane na dalsze wersje.

## 0.2.3-alpha — fortyfikacje Miasta 1
- Mury obronne mają 3 kratki szerokości; korona murów jest przechodnia.
- Cztery dojścia po schodach od strony miasta oraz przejścia przez bramy dla patroli.
- Nowa grafika kamiennych chodników, blanków i wzmocnionych narożnych baszt.
- Przesunięto budynki i dekoracje kolidujące z pogrubionym murem, zachowując 24 dostępne wnętrza.
- Testy statyczne: ciągłość ulic, dojścia do drzwi i poprawność szerokości murów; test na telefonie pozostaje do wykonania.

## 0.2.2-alpha — orientacja drzwi, drogi i mury obronne
- Naprawiono wszystkie portale 24 wnętrz: położenie drzwi w środku odpowiada kierunkowi wejścia z zewnątrz (N/S/E/W).
- Wyjście z budynku ustawia postać na zewnętrznym polu przed tymi samymi drzwiami, bez ponownego automatycznego wejścia.
- Poprawiono zabudowę nachodzącą na obwarowania; połączono izolowane fragmenty dróg z główną siecią, nie przecinając murów ani budynków.
- Korona murów obronnych jest teraz przechodnia; dwa wejścia po schodach po południowej stronie miasta. Ruch i A* blokują wspinanie się na mury bez schodów.
- Podpisy budynków wyśrodkowane pionowo na ciemnym tle; minimalna wielkość czcionki utrzymuje ich widoczność przy oddaleniu.
- Weryfikacja statyczna: 24/24 portale i powroty poprawne, 2514 pól dróg w jednej spójnej sieci, składnia dziewięciu modułów poprawna.
- Testy mobilne i przeglądarkowe pozostają do przeprowadzenia.

## 0.2.1-alpha — Miasto 1: budynki i wnętrza
- 24 oddzielne, powiększone wnętrza budynków użytkowych (30×22 lub 22×17 pól), z wyposażeniem, przegrodami i działającymi portalami wejścia/wyjścia.
- Wejście do budynku przez drzwi lub klawisz E z sąsiedniego pola; powrót do właściwych drzwi miasta.
- 8 dodatkowych budynków dekoracyjnych bez wejść: kamienice, szopy, spichlerz, domy i warsztat.
- Tekstowe nazwy budynków bez emotikon, czytelne oznaczenia drzwi.
- Ulepszone rysowanie nawierzchni ulic, ścian, dachów, trawy; dodatkowe place i dziedzińce.
- Wnętrza są celowo większe od brył budynków na mapie lokacji.
- Testy statyczne: 24/24 wnętrza posiadają powrotne portale, 24/24 drzwi dostępne pieszo z głównej bramy, składnia modułów poprawna.
- Obecne wnętrza to grywalne prototypy bez odrębnych NPC i specjalistycznych interakcji; grafika nadal proceduralna 2D, nie render 3D.
- Pozostałe miasta i wsie pozostają bez zmian.

## 0.2.0-alpha — Miasto 1 (pierwsza rozbudowana lokacja)
- Zmieniono nazwy 14 lokacji świata na robocze: Miasto 1/2, Zamek 1/2, Wieś 1–4, Kryjówka 1/2, Ruiny 1, Kopalnia 1, Świątynia 1, Przystań 1. Państwa otrzymały tymczasowe nazwy Państwo 1/2.
- Miasto 1 ma nową, ręcznie rozplanowaną mapę 112×88 pól z murami, czterema bramami, drogami, twierdzą i zabudową usługową.
- 24 indywidualnie nazwane obiekty, w tym karczma, kuźnia, stajnia, kasyno, zbrojownia, piekarnia, młyn, arena, biblioteka, koszary, strażnica, domy, farmy i tartak.
- Każdy obiekt ma unikalne ID, nazwę, ikonę i drzwi po stronie dojścia; nazwy i ikony są wyświetlane na mapie lokacji.
- Wejścia oznaczono na złoto; E przy wejściu identyfikuje budynek. Nowe wnętrza nie są jeszcze zaimplementowane.
- Nowa kampania rozpoczyna się w Mieście 1. Dawna mapa testowa z funkcjonalnymi wnętrzami pozostaje dostępna przez menu testowe i w starych zapisach.
- Automatyczny test spójności wykazał 24/24 wejścia dostępne pieszo z głównej bramy; wszystkie pliki źródłowe zweryfikowano pod kątem składni.
- Pozostałe mapy lokacji nie zostały jeszcze przebudowane zgodnie z życzeniem użytkownika.
- Weryfikacja w rzeczywistej przeglądarce i na urządzeniu mobilnym pozostaje do wykonania.

## 0.1.9-alpha — kamera mapy świata i terytoria państw
- Przesuwanie mapy świata myszą i przeciąganiem palcem, niezależnie od położenia postaci.
- Przybliżanie i oddalanie kółkiem myszy, gestem dwóch palców oraz przyciskami +/−.
- Przycisk ⌖ centruje kamerę na postaci; kliknięcie celu przywraca śledzenie bohatera podczas marszu.
- Zachowano ruch klawiszami WASD/strzałkami, wyznaczanie trasy kliknięciem oraz wejście do lokacji przez E.
- Wprowadzono wstępne terytoria Korony Północy i Ligi Południa, neutralne pogranicze oraz widoczne granice na mapie świata.
- Informacja o terytorium, na którym stoi postać, pojawia się w opisie mapy.
- Wstępne ulepszenia planów osad: przejścia w zabudowie, tereny uprawne i dostęp do nabrzeży.
- Weryfikacja statyczna: poprawna składnia siedmiu modułów; wszystkie 14 lokacji zachowało grywalne mapy i dostępne punkty startowe; granice obydwu państw występują na mapie.
- Brak jeszcze faktycznej polityki, straży granicznej, NPC i funkcjonalnych wnętrz nowych budynków. Testy przeglądarkowe i dotykowe pozostają do potwierdzenia.

## 0.1.8-alpha — otwarty świat i osady
- Mapa świata 120×84 pól, z kamerą śledzącą postać, ruchem strzałkami/WASD/dotykowym oraz trasami A* po kliknięciu.
- 14 lokacji zgodnych z GDD: 2 miasta, 2 zamki, 4 wsie, 2 kryjówki bandytów i 4 inne lokacje. Dwa państwa reprezentowane wstępną przynależnością lokacji.
- Każda lokacja posiada osobną wstępną mapę 64×44. Kamienogród zachowuje dotychczasową mapę z warownią, domem, karczmą i magazynem.
- Aby wejść do lokacji, należy stanąć na jej znaczniku na mapie świata i nacisnąć E (lub użyć przycisku).
- Wyjście poza granicę mapy lokacji wraca do świata. Klawisz M przełącza oba widoki.
- Różnorodne tereny i drogi między ważniejszymi punktami. Koszt czasu ruchu zależy od terenu.
- Schemat zapisu 5 obejmuje pozycję i aktywny widok mapy świata.
- Testy statyczne: składnia modułów poprawna; wszystkie 14 lokacji mają grywalne mapy i niezablokowane pola startowe. Testy urządzeń wymagane.
- Nazwy miejscowości i państw są robocze; GDD określa liczby, nie nazwy.
- Nie wdrożono jeszcze systemów gospodarki, NPC, granic politycznych, walki ani wnętrz wszystkich nowych budynków.

## 0.1.7-alpha — kierunkowe podróże i mapy regionów
- Każdy z pięciu regionów ma odrębną grywalną mapę taktyczną 64×44.
- Puszcza Cieni: gęsty las; Kamienna Przełęcz: skały i przeszkody; Zielone Doliny: łąki; Kraina Jezior: zbiorniki wodne i brzegi.
- Przekroczenie granicy lokacji otwiera mapę świata z automatycznie zaznaczonym sąsiednim regionem w kierunku wyjścia.
- Podróż przez mapę świata przenosi postać na przeciwległą krawędź mapy docelowej; po podróży otwiera się jej mapa lokacji.
- M nadal otwiera mapę świata w dowolnym momencie; podróż jest dostępna tylko z mapy zewnętrznej.
- Zachowano czas podróży 2 godziny oraz zapisywanie regionu i położenia.
- Stare zapisy strategiczne są uzgadniane z faktyczną mapą postaci.
- Kontrole statyczne i testy punktów wejścia przeprowadzone; testy interfejsu na telefonie wymagają potwierdzenia.

## 0.1.6-alpha — przełączanie map
- Mapa świata zastępuje mapę lokacji w tym samym obszarze ekranu, zamiast pojawiać się poniżej.
- Klawisz M otwiera mapę strategiczną; Esc ją zamyka w regionie Pogranicza.
- Wyjście poza granicę mapy Pogranicza otwiera mapę świata; nie działa we wnętrzach.
- Podczas oglądania mapy świata ruch bohatera po mapie lokacji jest zablokowany.
- Powrót do mapy lokacji możliwy przez przycisk, gdy bohater jest w Pograniczu.
- Testy kodu statyczne; test przeglądarkowy wymagany.

## 0.1.5-alpha — mapa świata
- Dodano oddzielną mapę strategiczną (12 × 8 pól), niezależną od mapy lokacji 64 × 44.
- Region startowy Pogranicze oraz cztery sąsiednie/połączone regiony: Puszcza Cieni, Kamienna Przełęcz, Zielone Doliny, Kraina Jezior.
- Otwieranie mapy świata z menu, klawiszem M oraz przyciskiem mobilnym.
- Wybieranie regionów i podróże wyłącznie pomiędzy sąsiednimi regionami; 2 godziny czasu gry na przejście.
- Zapis i odczyt regionu świata (schemat 4, migracja starszych zapisów).
- Mapa szczegółowa pozostaje dostępna tylko dla Pogranicza. Po wyjeździe do innych regionów gracz pozostaje na mapie strategicznej, aż wróci do Pogranicza. To celowe ograniczenie prototypu.
- Kontrola składni modułów i testy sąsiedztwa regionów zakończone pomyślnie; testy w przeglądarce i na telefonie nadal wymagane.

## 0.1.4-alpha — eksploracja i nawigacja
- Zastąpiono wyszukiwanie tras BFS algorytmem A* w osobnym module engine/pathfinding.js.
- Trasa uwzględnia przeszkody oraz stan drzwi: przez zamknięte lub zamknięte na klucz nie prowadzi.
- Kliknięcie skrzyni lub zamkniętych drzwi kieruje postać do sąsiedniego, dostępnego pola.
- Dodano przycisk „Zbadaj” bezpośrednio na ekranie dla urządzeń dotykowych.
- Zaktualizowano wersję aplikacji i cache offline.
- Testy statyczne: składnia modułów poprawna; scenariusze wyznaczania tras poprawne. Testy przeglądarkowe i mobilne wymagają weryfikacji.

# Project Kingdoms — dziennik zmian

## 0.1.3-alpha — generowanie wejść i stan drzwi (2026-11-18)
- Dodano engine/buildings.js: reguły wyznaczania wejścia na ścianie najbliższej drodze oraz reguły ścian działowych.
- Weryfikacja wejść w rejestrze lokacji przy uruchamianiu gry.
- Wnętrza domu, karczmy i magazynu otrzymały ściany działowe z przejściami.
- Drzwi mają wspólne identyfikatory wewnątrz i na zewnątrz oraz stany: otwarte, zamknięte, na klucz.
- E / Zbadaj pozwala otwierać i zamykać drzwi, poza zamkniętymi na klucz.
- Zapis schematu 3 przechowuje stan drzwi; zgodność z zapisami schematu 1 i 2.
- Dodano warianty terenu: pagórki i łąki.
- Wykonano statyczną kontrolę składni oraz testy logiczne rejestru przejść; testy manualne w przeglądarce pozostają do wykonania.

## 0.1-alpha — lokacje i interakcje (2026-11-18)
- Dodano rejestr pięciu lokacji: Pogranicze, Warownia, Dom mieszkańca, Karczma i Magazyn.
- Dodano osobne wnętrza, piętra, identyfikowane przejścia i pary schodów.
- Dodano interakcje E / przycisk Zbadaj: badanie obiektów i otwieranie skrzyń.
- Zapis schematu 2 obejmuje stan obiektów, z migracją zapisu schematu 1.
- Rozszerzono cache offline o moduł interakcji.

## 0.1-alpha — poprawka zegara (2026-11-18)
- Usunięto naliczanie dodatkowej minuty przy każdym kroku postaci.
- Zegar działa teraz tylko w centralnym interwale: 1 minuta gry na sekundę rzeczywistą, niezależnie od ruchu.
- Pauza zatrzymuje zegar; odświeżono wersję cache offline.

## 0.1-alpha (pierwszy etap, 2026-11-18)
- Utworzono oddzielny, modułowy szkielet gry, bez modyfikowania archiwalnego Universal Engine v0.25.1.
- Dodano testową mapę świata i trzykondygnacyjną warownię.
- Wprowadzono ruch w czterech kierunkach, kolizje, drzwi i dwie niezależne pary schodów na kondygnację.
- Dodano kamerę, przesuwanie, zoom 25–300%, automatyczne wyznaczanie trasy BFS, klawiaturę i dotykowe D-pad/joystick.
- Dodano podstawowy zegar świata, pauzę, zapis/wczytanie lokalne (schemat 1).
- Dodano manifest i service worker dla pracy offline po pierwszym pobraniu zasobów.

### Status
To **pierwszy uruchamialny prototyp** wersji 0.1, nie zamknięta wersja 0.1 i nie pełna gra.
Wymagane są testy w przeglądarce i na urządzeniu Android, kontrola ergonomii oraz testy zapisu i pracy offline.

### Znane ograniczenia
- Brak właściwych systemów RPG, NPC, gospodarki, polityki i walki (zaplanowane na kolejne etapy).
- Mapa i wnętrze to dane demonstracyjne; nie ma jeszcze trwałej edycji obiektów.
- Zapis lokalny jest pojedynczy; brak eksportu/importu i trybu Ironman.
- Grafika jest symboliczna; nie ma jeszcze sprite'ów ani dźwięków.
- Offline działa po instalacji cache przez service worker, nie po otwarciu pliku file://.
