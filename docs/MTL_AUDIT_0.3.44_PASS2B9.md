# Alpha 0.3.44 — MTL II-B9 (review)
Data 2026-11-25. MDS §§21,51,53,56,60,62–66: rozróżnienie deklarowanego przeznaczenia, funkcji potencjalnej i rzeczywistej czynności, właściwy typ BDS oraz rzeczywiste portale. Oryginalny MDS odczytano; nie zmieniano standardu.

## Korekty katalogu (nowe wersje, stare zachowane)
| Urządzenie | Stara funkcja | Nowa funkcja potencjalna |
|---|---|---|
| hand_quern | sharpen | mill |
| harvest_sorting_table | cook | sort_harvest |
| tanning_worktable | full_cloth | tan |
| cow_stall | stable | cattle_housing |
| chicken_perch | feed | roost |
| nest_box | storage | nest_eggs |
| offering_table | eat | offering |
| ritual_lectern | teach | ritual_read |
| farm_ladder | storage | brak stanowiska do czasu powiązania z przejściem |

Wersja 2 każdego z 9 typów mebli. Geometria, orientacje i pozycje bez zmian; osiem typów zachowuje pojemność i podejścia. Drabina bez fałszywej funkcji; pozostaje obiektem możliwym do oględzin, nie aktywnym portalem. Istniejące schody nie są zmieniane. Nowe identyfikatory czynności są danymi opisującymi możliwości wyposażenia, nie zaimplementowanymi procedurami produkcji, religii, hodowli ani NPC. Nie zmieniono globalnego katalogu r14.

## Klasyfikacja
- DEPOSIT_M01: zachowano klasę geometryczną shop. Proponowany podtyp deposit_house, funkcje reception/storage/administration, strefy Z0/Z2. Depozyt i zwrot wymagają przyszłej mechaniki. Brak odrębnej klasy BDS w MDS: podtyp nie jest zatwierdzonym wyjątkiem.
- COMMAND_M01: zachowano hall jako klasę geometryczną. Proponowany podtyp military_command, planning/administration/equip i Z3. Nie dodano publicznej obsługi mieszkańców. Odbiór klasyfikacji wymaga osobnej decyzji, nie zmieniono reguł walidatora.
- SP_PORT: zachowano port_office. Zweryfikowano potencjalne stanowiska recepcji/administracji/składu, ale także istniejący handel. Nie utożsamiać ich z przeładunkiem. Nabrzeże, transport i dostawy do sprawdzenia na właściwej mapie. Wymieniono 34 niedopasowane dekoracje (groby, krypty itp.), dodano 29 adekwatnych dekoracji (mapy, latarnie, liny, księgi, kwity, zwoje, klucze i przybory pisarskie), korzystając z istniejącego katalogu i reguł allowedHosts.

## Wpływ i testy
28 modeli, 74 unikatowych kandydatów łącznie (w tym 18 nowych ID względem II-B8b; nie oznacza 74 z 67 zgłoszeń audytu). 38 aktualizacji deklaracji funkcji pokojów na podstawie rzeczywistych zmian w RTS. -13 stanowisk, wszystkie usunięte funkcje dotyczą drabin; nie spadła liczba faktycznych stanowisk produkcyjnych.
196 obrotów kondygnacji kandydatów bez zgłoszeń w V8: rzeczywiste funkcje MTL, FPS, RTS, IDS dekoracji i kontrola kolizji, wszystkich pól portali, osiągalności stanowisk i kotwic. Dodatkowo potwierdzono zmianę akcji każdego wystąpienia danego mebla w czterech orientacjach, brak akcji drabin i identyczne położenie wszystkich mebli. Test Node zapisano, nie uruchomiono w Node. Pełny MFS, wizualny odbiór, Android, UI/offline, uprawnienia i zachowanie NPC pozostają otwarte.

## Integracja i następny krok
Do katalogu r15 dołączyć 9 nowych wersji mebli (zachować v1) i zastosować nakładkę `templates/mtl/pass2b9-candidates.json` PO B8b, nie nadpisywać nowszych szerokich wejść starymi danymi. Kolejne etapy B10 muszą korzystać z najnowszych wersji modeli i mebli. B10: CIVIC_COURT_L01, SAC_TEMPLE_M01/M02/L01, NOB_KEEP_S01/M01/L01, SP_TEMPLE_CRYPT, SP_KEEP_VAULT (część już w nakładkach; projekt indywidualny, nie nowe ID). Uzupełniać meble i dekoracje. B11 wystrój wcześniejszych wnętrz, B12 IDS, B13 integracja, B14 QA. Przed odbiorem rozstrzygnąć proponowane podtypy depozytu i sztabu, transport portowy i brak powiązania drabin z portalami. r14 bez zmian, r15 nieopublikowana.
