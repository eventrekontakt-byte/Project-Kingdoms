# Project Kingdoms

Offline 2D fantasy RPG and kingdom simulation — projekt rozwijany etapami zgodnie z GDD 1.0.

## Stan: Alpha 0.3.41 — MFS / Map Template Library
Pierwszy uruchamialny etap: mapa 2D, ruch, kolizje, wnętrze warowni, trzy kondygnacje, dwie klatki schodowe, kamera, zoom, trasa automatyczna, sterowanie dotykowe i klawiaturą, podstawowy zegar oraz lokalny zapis.

**To nadal wersja rozwojowa.** Seria 0.3.x rozszerza MFS, walidator, Map Viewer i bibliotekę ręcznych szablonów MTL. Galeria r11 (128 budynków, 163 kondygnacje wnętrz) pozostaje w odbiorze, nie jest mapą produkcyjną. Rozwój DNS jest wstrzymany do stabilizacji mapy referencyjnej; postać, walka, gospodarka i polityka pozostają do kolejnych etapów. Szczegóły: docs/CHANGELOG.md i docs/DNS-ARCHITECTURE.md.

## Uruchomienie
- GitHub Pages: Settings → Pages → Deploy from a branch → main → /(root). Po publikacji uruchom adres wskazany przez GitHub Pages.
- Lokalnie: uruchom serwer HTTP w katalogu repozytorium, np. `python -m http.server 8000`, i otwórz `http://localhost:8000`.
- Nie otwieraj `index.html` przez `file://` — moduły JS i service worker wymagają serwera.

## Podgląd map i testy
- Map Viewer: `tools/map-viewer/` — domyślnie najnowsza galeria i mapa testowa; starsze rewizje po włączeniu archiwum.
- Test regresji galerii r10: `node --experimental-default-type=module tests/mtl-civic.mjs`.
- Test regresji galerii r9: `node --experimental-default-type=module tests/mtl-r9.mjs`.
- Status i ograniczenia: `docs/PRODUCTION_CHECKPOINT_0.3.39.md`.

## Sterowanie
- PC: strzałki lub WASD, przytrzymanie = ciągły ruch; przeciągnij mapę, aby przesunąć kamerę; kółko myszy = zoom.
- Telefon: D-pad albo joystick (wybór w menu), przeciągnięcie mapy = przesunięcie kamery.
- Dotknij pustego przechodniego pola, aby wyznaczyć trasę.
- Żółte drzwi = przejście do budynku; fioletowe schody = przejście między piętrami.
- Zapis/wczytanie wykorzystuje pamięć lokalną przeglądarki na tym urządzeniu.

## Struktura
- `engine/Universal_Engine_v0.25.1.html` — niezmieniony silnik referencyjny.
- `engine/world.js` — dane mapy, kolizje i przejścia.
- `engine/game.js` — główna pętla eksploracji, kamera, czas i interakcje.
- `ui/controls.js` — sterowanie dotykowe.
- `save/storage.js` — wersjonowany zapis lokalny.
- `styles/main.css` — adaptacyjny interfejs.
- `docs/CHANGELOG.md` — historia zmian.
- `docs/TESTS-0.1.md` — testy do przeprowadzenia.

## Plan
0.1 fundamenty → 0.2 świat i eksploracja → 0.3 postać i walka → 0.4 gospodarka → 0.5 budownictwo → 0.6 żyjący świat → 0.7 wojsko i polityka → 0.8 magia i religia → 0.9 integracja → 1.0 wydanie.

Gra powstaje jako oddzielny projekt; archiwalny Universal Engine jest wyłącznie źródłem rozwiązań technicznych.
