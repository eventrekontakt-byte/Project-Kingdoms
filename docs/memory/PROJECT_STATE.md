# Stan produkcji — Project Kingdoms
2026-11-25 | Alpha 0.3.44 | main | CMS 1.0.
Punkt odniesienia: galeria r15 commit 5bc4e43; historia sprzed CMS: d20880ca620a092901f985d411e06597dda3c486.

## Stan
MTL II-A (67 modeli) i II-B11 (przegląd 163) zakończone. II-B12: 33 pozycje, 19 korekt i 14 indywidualnych wyjątków zatwierdzonych przez użytkownika z warunkami odbioru; brak nierozstrzygniętych pozycji listy. II-B13: zintegrowana r15 (katalog 0.15.0, 118 ID nakładkowych). II-B14: zapisany profil final pozytywny. Prace katalogowe r15 zamknięte jako zamrożona referencja / review; pełny odbiór produkcyjny otwarty.
163 modele, 229 kondygnacji, 628 pomieszczeń, 2585 obiektów, 5164 dekoracje, 2906 stanowisk wnętrz, 191 definicji mebli. Galeria: 230 scen i 2930 stanowisk z infrastrukturą. Tylko maps/review.json; r1–r14 i maps/world.json niezmienione. r15 nie jest mapą produkcyjną.

## MTL-006 — decyzje r15
Pakiet [E01–E14, C01–C02](../MTL_R15_DECISIONS_0.3.44.md) zatwierdzony przez użytkownika 2026-11-25 (16/16, uwagi: brak; D010). Warunki odbioru nadal otwarte; końcowy odbiór r15 nie nastąpił. R15 zamrożona na polecenie użytkownika; następnie projekt koncepcyjny Miasta 1 wyłącznie na nowe polecenie. [Raport zamknięcia](../MTL_R15_CLOSURE_0.3.44.md). E04 rozbieżność 198-18=180 wyjaśniona statycznie; inne warunki pozostają otwarte. Bez zmian map, katalogu i walidatora. Warunki: maska E04, dojścia, pionowa logistyka, konie, garbarnia, dostęp. Nie wykonano nowych testów runtime.

## Testy zapisane
916 obrotów V8 przed poprawką 7 kotwic w 5 modelach; po poprawce final MFS 0 ERROR, 0 WARNING, 1 INFO; RURAL_AREAS 0. Pominięte IDS_PROGRAM, RDS_VEHICLES, NPC_RUNTIME, MDS_MANUAL. Brak potwierdzenia Node, przeglądarki/Android, Pages, offline, odbioru wizualnego, praw dostępu, rzeczywistej logistyki i większych jednostek. Nie przedstawiać jako pełnego odbioru.

## Silnik i dalsza produkcja
Eksploracja 2D, ruch/kolizje, wnętrza i kondygnacje, kamera, zoom, automatyczny marsz, sterowanie dotykowe/klawiatura, zegar i zapis lokalny. DNS prototyp mieszkańców i tła, wstrzymany do odbioru i stabilizacji mapy referencyjnej. CITY-001a.01: [karta WIP](../CITY_001a_01_CONCEPT.md) — średnie miasto, 192×192, 96 parceli (72/24), 400 mieszkańców docelowo, handel/rzemiosło, F3 i twierdza; oczekuje akceptacji. Bez kodu/map/migracji; następna 02 po poleceniu. Nowe Miasto 1 nieukończone; postać/walka, gospodarka, budownictwo i polityka wymagają dalszych etapów.

## Źródła na żądanie
- GDD 1.0, MDS 1.0, MFS 1.0 w projekcie ChatGPT (właściwe sekcje).
- [Rozstrzygnięcia B12h](../MTL_AUDIT_0.3.44_PASS2B12H.md), [kandydaci B12h](../../templates/mtl/pass2b12h-candidates.json).
- [Raport r15](../../templates/mtl/r15-mfs-final-report.json), [review](../../maps/review.json), [DNS](../DNS-ARCHITECTURE.md).
- [Aktywny backlog](BACKLOG.md), [plan](ROADMAP.md), [decyzje](DECISIONS.md).
- Nie wracać do masowego meblowania B11 ani nowej ogólnej listy wymiarowej; korygować konkretne rzeczywiste błędy. Następnie koncepcja Miasta 1; mapa review i migracja ID/zapisów w osobnych partiach. Przed produkcyjną integracją rozstrzygnąć zaległe bramki r15; zachować legacy.
