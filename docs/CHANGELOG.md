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
