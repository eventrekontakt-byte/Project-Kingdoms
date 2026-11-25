# Alpha 0.3.44 — MTL II-B10a (WIP)
Data 2026-11-25. MDS §§21,49–54,59–64 (odczyt oryginału). Sąd oraz trzy indywidualnie rozplanowane świątynie. Najnowsza baza B9, z meblami v2. Nie publikowano r15.
 
| Model | Pomieszczenia przed → po | Stanowiska przed → po | Nowe meble | Nowe dekoracje |
|---|---:|---:|---:|---:|
| CIVIC_COURT_L01 | 2 → 5 | 19 → 27 | 4 | 5 |
| SAC_TEMPLE_M01 | 6 → 14 | 51 → 60 | 7 | 12 |
| SAC_TEMPLE_M02 | 6 → 14 | 54 → 63 | 7 | 13 |
| SAC_TEMPLE_L01 | 6 → 16 | 48 → 68 | 12 | 14 |
| Razem | 20 → 49 | 172 → 218 | 30 | 44 |

## Program
Sąd: sala rozpraw 8×15, kancelaria 7×9, archiwum 8×7 i poczekalnia 7×13, niezależny korytarz. Świątynia M01: sala obrzędowa 18×15, zakrystia 7×8, kaplica 6×8 (Z1); na piętrach komnaty, łazienki, biblioteka, gabinet i archiwum. M02: główna sala 22×15, druga kaplica publiczna 9×8 i zakrystia 8×8, odrębne zaplecze, biblioteka, czytelnia i archiwum. L01: główna sala 26×22 (obrót wymiarów 22×26 w granicach IDS), kaplica 10×9, zakrystia 10×9, piętra z odrębną komnatą 10×12, biblioteką 10×18, archiwum, czytelnią, gabinetem, kaplicą i skarbcem 8×6. Zachowano obrysy, portale i indeksy istniejących mebli. Dekoracje ścienne/podłogowe i powierzchniowe przeniesiono do zgodnych pozycji; 0 usuniętych. Dodano ławy, ołtarze, wyposażenie archiwalne, sanitarne i skarbcowe, mapy, latarnie, emblematy, ozdoby i przedmioty obrzędowe. Geometria stref ręcznie określona, pozycje wyposażenia dopasowane deterministycznie na etapie projektowania, bez generowania wnętrz w runtime.
 
## Testy i ograniczenia
40 obrotów kondygnacji kandydatów bez zgłoszeń w V8 (MTL/FPS/RTS/IDS dekoracji, kolizje, wszystkie pola przybycia, BFS do stanowisk i kotwic). Test Node zapisany, nieuruchomiony w Node. Geometria korytarzy rozbudowana; nie potwierdzono wszystkich szerokości, zróżnicowania wizualnego, wyłączności dostępu Z0–Z5 ani pojemności w ruchu wielu aktorów. Otwarte progi; deklaracje dostępu nie są blokadami. Z1/Z2/Z4/Z5 wymagają przyszłego egzekwowania. Odbiór wizualny i pełny MFS/Android/offline nadal otwarte. Nie deklarować pełnej zgodności IDS.
 
## Dalej
B10b: NOB_KEEP_S01/M01/L01, SP_TEMPLE_CRYPT, SP_KEEP_VAULT. Baza B2 dla SP_KEEP_VAULT, B9 dla definicji mebli, najnowsze nakładki. B10a po B9, 75 unikatowych kandydatów (1 nowy ID sądu). B11 dekoracje, B12 IDS, B13 integracja, B14 QA. Nie zmieniać galerii r14.
