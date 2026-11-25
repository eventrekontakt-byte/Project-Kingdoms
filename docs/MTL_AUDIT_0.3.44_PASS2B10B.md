# Alpha 0.3.44 — MTL II-B10b (review)
Data 2026-11-25. MDS 1.0 §§50–54,59–61 odczytane z oryginalnego dokumentu. Indywidualne programy trzech siedzib władców, krypty i podziemi zamkowego skarbca. Baza r14, SP_KEEP_VAULT z B2, definicje mebli B9. Dane r14 bez zmian, r15 nieopublikowana.

| Model | Pomieszczenia przed → po | Stanowiska przed → po | Nowe meble | Nowe dekoracje |
|---|---:|---:|---:|---:|
| NOB_KEEP_S01 | 6 → 17 | 51 → 65 | 12 | 13 |
| NOB_KEEP_M01 | 8 → 27 | 65 → 90 | 19 | 17 |
| NOB_KEEP_L01 | 8 → 30 | 65 → 109 | 30 | 18 |
| SP_TEMPLE_CRYPT | 3 → 13 | 16 → 31 | 9 | 13 |
| SP_KEEP_VAULT | 14 → 23 | 45 → 55 | 10 | 9 |
| Razem | 39 → 110 | 242 → 350 | 80 | 70 |

## Program
- NOB_KEEP_S01: sala audiencyjna, wartownia, jadalnia, kuchnia, gabinet, biblioteka, komnata i pokój dzienny, łazienki, skarbiec 8×10, służbowa sypialnia i magazyn.
- NOB_KEEP_M01: sala audiencyjna 12×20, poczekalnia, wartownia, jadalnia, magazyn, biblioteka z czytelnią, kancelaria, archiwum, komnaty mieszkalne, zaplecze sanitarne, skarbiec 8×10, kuchnia 10×12, spiżarnia.
- NOB_KEEP_L01: sala tronowa 16×26, wartownia, sala rady, biblioteka 16×20, czytelnia, archiwum, gabinet, dwa prywatne zespoły mieszkalne, skarbiec 8×10, kuchnia i kwatery służby.
- SP_TEMPLE_CRYPT: sala obrzędowa, kaplica i zakrystia na parterze, archiwum, gabinet i czytelnia na piętrze, dwie komory grobowe, kaplica podziemna i pomieszczenie relikwii.
- SP_KEEP_VAULT: zachowano przebudowane w B2 kondygnacje 0 i +1; na -1 skarbiec 8×10, archiwum, wartownia i gabinet, na -2 trzy magazyny, spiżarnia, wartownia. Nie zmieniano schodów.

Ręcznie określone prostokątne strefy i centralna czterokaflowa komunikacja na 16 przebudowanych kondygnacjach, przejścia 2–3 pola. Wszystkie obrysy, wejścia, schody i dotychczasowe meble zachowane. Dopasowanie pozycji wyposażenia deterministyczne na etapie projektowania, nie runtime. Dodano wyposażenie obronne (stojaki, wartownie), reprezentacyjne, mieszkalne, gospodarcze i sakralne. Dodano tematyczne dekoracje ścienne i powierzchniowe; wcześniejsze dekoracje przeniesiono, jeśli potrzebne, 0 usuniętych.
 
## Testy i ograniczenia
72 obrotów kondygnacji kandydatów i tyle samo poprzednich wersji bez zgłoszeń w V8: MTL/FPS/RTS/IDS dekoracji, kolizje, wszystkie pola przybycia, BFS do stanowisk i kotwic. Node test zapisany, nieuruchomiony w Node. Czterokaflowy korytarz to wymiar projektowy; progi i schody nadal ograniczają ruch, nie testowano wielokaflowych aktorów. Część niewykorzystanego obrysu wypełniono pełną maską ścian: szczególnie duże zamki wymagają kontroli proporcji powierzchni użytkowej, grubości ścian, wizualnego odbioru i ewentualnego dodania użytecznych pomieszczeń. Nie jest to pełna akceptacja IDS. Otwarta kontrola wszystkich wymiarów, funkcji, pojemności, własności, Z0–Z5 (metadane, bez egzekwowania) i estetyki. Pełny MFS, Node, Android i offline nadal do sprawdzenia.

## Integracja
Nakładka templates/mtl/pass2b10b-candidates.json po B10a. 79 unikatowych kandydatów (4 nowe ID, SP_KEEP_VAULT zastępuje B2); B10a+B10b: 9 modeli, +100 pomieszczeń, +110 mebli, +114 dekoracji, +154 stanowiska, 112 obrotów kondygnacji. B10 zakończony w zakresie przygotowania kandydatów, nie odbioru IDS.
 
## Dalej
II-B11: wyposażenie, dekoracje i przegląd tematyczny wcześniej przebudowanych wnętrz; stosować najnowsze nakładki B1–B10b. II-B12: IDS, wymiary, pojemność, strefy i proporcje wykorzystania obrysu, klasyfikacja i dopuszczalne wyjątki. II-B13 integracja; II-B14 QA. Nie publikować r15 przed odbiorem.
