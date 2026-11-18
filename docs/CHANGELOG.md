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
