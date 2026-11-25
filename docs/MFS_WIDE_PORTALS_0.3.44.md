# MFS/MTL — szerokie progi II-B8a (WIP)
Data 2026-11-25. MDS 1.0 §§53–54 oraz MFS 1.0 §17: obsługa wszystkich dopuszczalnych pól progu, jawne pozycje przybycia, skala zewnętrzna/wnętrze 1:2. Rozszerzenie zgodne wstecznie ze starym formatem, bez zmiany numeru schematu 1.0.0.

## Kontrakt
Dotychczasowy endpoint {sceneId,trigger,arrival} pozostaje bez zmian jako pojedynczy pas. Opcjonalne lanes: na obu końcach, od 1 do 4 wpisów {trigger,arrival,target}, indeks zero zgodny z głównym trigger/arrival. Co najmniej jedna strona szersza niż jedno pole. target wskazuje indeks pozycji PRZYBYCIA na drugiej stronie. Każdy pas ma sąsiedni wolny approach; pasy ciągłe, prostopadłe do kierunku ruchu, z jedną orientacją. Schody zachowują dotychczasowy format. Wszystkie progi są indeksowane w skompilowanej scenie i mają wspólne logiczne ID drzwi (istniejący adapter odczytuje stan według ID). Różna liczba pasów po obu stronach umożliwia odwzorowanie lokalnych skal; mapowanie wielu do jednego nie gwarantuje powrotu na identyczny kafel.

MTL opcjonalne entrySpan:{outside:1|2,inside:2|3|4}. Kanoniczne wejście od południa, entry/interiorEntry określają pierwszy pas; następne pasy w +x. Mapowanie floor(i*liczbaDrugiejStrony/liczbaTejStrony). Obrót i przesunięcie stosują się do każdego progu i pola przybycia. Autor dobiera położenie, szerokość oraz dojścia; nie zmieniono automatycznie istniejących modeli. Kontrola wszystkich pasów przez kompilator, walidator, FPS, RTS, dekoracje i techniczny viewer. Wersja walidatora 1.3.1, cache SW 0344-v2. Brak obsługi transportu wielokaflowych aktorów.

## Rzeczywiście wykonane testy
Uruchomiono zmodyfikowane moduły w V8 (import/export adaptowane do środowiska testowego) na rzeczywistych danych maps/mfs_test_001, nie na opublikowanej mapie z nowymi wrotami.
- Stary poligon: identyczne kafle, portale i indeks drzwi względem poprzedniego kodu; 0 ERROR walidatora.
- Kopia poligonu w pamięci: 2 pola na zewnątrz i 4 we wnętrzu; sprawdzono wszystkie 6 kierunków przejścia i wspólne ID; 0 ERROR walidatora.
- Techniczny model viewer: sprawdzone obie sceny, odpowiednio 2 i 4 pola.
- 7 nieprawidłowych konfiguracji odrzuconych przez kompilator i walidator: nieciągły próg, zły cel, brak drugiej strony, niezgodność pola głównego, zablokowane arrival, próg poza obrysem, wielopolowe schody.
- 2 kontrole ochrony dodatkowego progu (FPS i dekoracje).
- 12 kombinacji szerokości i obrotu testowego szablonu (2/3/4 pola wnętrza × cztery orientacje).
- 652 orientacje 163 starych szablonów r14 porównane z poprzednim generatorem: identyczne dane.
Dodano tests/mfs-wide-portals.mjs. Node test dodany, nieuruchomiony w Node. Testy przeglądarkowe, faktyczne otwieranie/zamykanie przez UI, Android, offline, NPC i większe jednostki, cały MFS r15 i wizualny odbiór nadal otwarte. Nie wprowadzono nowej mapy do rejestru ani nie nadpisano galerii r14.

## Następne
II-B8b: dopasować 16 kandydatów gospodarczych II-B7 do nowych progów, mebli, dojść i dekoracji; sprawdzić każdy próg we wszystkich orientacjach. Weryfikować rzeczywistą szerokość, skalę i drogi na mapie. Zachować stare rewizje, nie publikować r15 przed pełnym odbiorem. Następnie II-B9 semantyka i klasyfikacja, II-B10 monumentalne, II-B11 meble/dekoracje, II-B12 IDS, II-B13 integracja, II-B14 QA.
