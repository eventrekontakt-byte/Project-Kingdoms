# Project Kingdoms 0.1 — testy ręczne

## Uruchomienie
Włącz GitHub Pages dla gałęzi main i katalogu root, albo uruchom lokalny serwer HTTP.
Moduły ES i service worker nie działają poprawnie przez zwykłe otwarcie index.html jako file://.

## Scenariusze
1. Start: bohater w (12,17), na mapie Pogranicze.
2. D-pad: pojedyncze dotknięcie = jeden krok; przytrzymanie = powtarzanie kroków; puszczenie = stop.
3. Joystick: wybierz w panelu; sterowanie we wszystkich kierunkach; zwolnienie palca = stop.
4. Klawiatura: strzałki/WASD, również przytrzymanie.
5. Kolizje: ściany, woda i drzewa nie są przechodnie.
6. Budynek: dojście do (24,20) przenosi do warowni na parter, (8,11).
7. Schody A: (3,3) na parterze -> (3,9) na 1. piętrze; zejście (3,9) -> (3,3) na parterze.
8. Schody B: analogicznie x=13; powrót zawsze tą samą klatką.
9. Piętro 2: schody z piętra 1 działają w górę i w dół.
10. Wyjście: na parterze (8,12) -> Pogranicze (24,21).
11. Zoom: 25–300%; przy oddaleniu widać większy teren bez zmiany wielkości okna.
12. Mapa: przeciągnięcie przesuwa kamerę, przycisk ⌖ centruje na bohaterze.
13. Trasa: dotknij przechodniego pola, bohater dochodzi omijając przeszkody.
14. Zapis: zapisz we wnętrzu na piętrze 2; odśwież; wczytaj; pozycja i zegar pozostają.
15. Pauza: zegar przestaje płynąć automatycznie.
16. Offline: odwiedź stronę online, poczekaj na instalację SW, włącz tryb offline i odśwież.
17. Orientacja pozioma Android: elementy nie zasłaniają mapy, menu można zamknąć.

## Warunki akceptacji
Testy należy wykonać na telefonie i na desktopie. Ich wykonania jeszcze nie potwierdzono.
