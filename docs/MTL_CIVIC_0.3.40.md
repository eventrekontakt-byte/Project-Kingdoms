## Alpha 0.3.40 — MTL: budynki publiczne i administracyjne

- 6 ręcznie przygotowanych parterowych wzorców: ratusz dzielnicowy, urząd podatkowy, sąd lokalny, sąd miejski, siedziba cechu kupców, dom cechu rzemieślników. Dwie strefy funkcjonalne na budynek; wykorzystano istniejący katalog wyposażenia i dekoracji. Duże obiekty publiczne nadal wymagają indywidualnego projektu (MDS §59).
- Galeria r10: 116 budynków, 131 kondygnacji, 1406 stanowisk, 132 sceny. Poprzednie rewizje zachowane; 125 starszych wnętrz skopiowano jako identyczne bloby (potwierdzono ich SHA-1). 24 obroty nowych wzorców sprawdzone FPS/RTS/IDS. Walidacja final: 0 błędów, 0 ostrzeżeń, 1 info. Zatwierdzona kopia kompiluje się, ale galeria pozostaje review-only. Dwa rozmiary działek przeklasyfikowano P3→P4 w odpowiedzi na walidację.
- Rewizja r10 zarejestrowana w Map Viewer, zaktualizowane etykiety i lista cache offline. Test regresji zapisany w repozytorium. Pełny test loadera w przeglądarce, Android i instalacja offline nie zostały wykonane; nowy skrypt testowy nie został uruchomiony w Node.
- Brak mechanik sądowych, podatków, cechów i egzekwowania access. Brak nowego renderera. Zakres ograniczony do sześciu wzorców pierwszej kategorii.

