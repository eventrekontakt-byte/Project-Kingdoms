# Project Kingdoms — dziennik zmian

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
