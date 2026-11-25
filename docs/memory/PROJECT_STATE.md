# Stan produkcji — Project Kingdoms
Aktualizacja: 2026-11-25, czat (5).
Ostatni commit wydania mapy r14: ac670f9f5fc2cd78efb86e107e3133c850627117 (Alpha 0.3.44).
Gałąź: main. Gra offline 2D fantasy RPG + symulacja królestwa, rozwijana hybrydowo, oddzielnie od Universal Engine.

## Aktualny etap
MTL Audit Pass II-A — triage 67/67 modeli zakończony; II-B — przebudowa i kontrola geometrii w toku; II-B11c zapisany. R14 (Pass I) pozostaje review-only, nie jest zatwierdzoną mapą ani gotową do gry.
- 163 szablony, 229 kondygnacji, 230 scen galerii wraz z zewnętrzną, 2491 stanowisk interakcji.
- 161 zmienionych modeli, 191 dodanych mebli, 218 dodanych i 224 zastąpione dekoracje.
- 67 modeli do indywidualnej kontroli; 8 modeli z heurystycznymi brakami funkcji (nie są to automatycznie błędy MDS).
- Raport zapisany w repo: MFS 0 błędów, 0 ostrzeżeń, 1 info; 916 obrotów bez problemów FPS/RTS/IDS; walidacja terenów wiejskich 0 problemów. Nie oznacza odbioru MDS.
- Test Node tests/mtl-r14.mjs dodany, lecz nieuruchomiony w Node; przeglądarka, Android, offline i wdrożenie Pages niezweryfikowane w Pass I.

## Silnik
Istnieje eksploracja 2D, ruch/kolizje, wnętrza i kondygnacje, kamera, zoom, automatyczny marsz, sterowanie dotykowe/klawiatura, zegar i zapis lokalny. DNS ma prototypy mieszkańców i NPC tła; rozwój wstrzymany do akceptacji i stabilizacji mapy referencyjnej. Nowe Miasto 1 nie jest ukończone. Postać/walka, gospodarka, budownictwo i polityka nadal wymagają dalszych etapów.

## Źródła
- GDD 1.0, MDS 1.0 i MFS 1.0 — dokumenty projektu ChatGPT; odczytywać przy decyzjach projektowych.
- [Raport Pass I](../MTL_AUDIT_0.3.44_PASS1.md)
- [Raport kandydatów](../../templates/mtl/audit-candidates-0.3.44.json)
- [Walidacja r14](../../maps/mtl_gallery_001_r14/validation/final-report.json)
- [DNS](../DNS-ARCHITECTURE.md)
- [Przekazanie](CHAT_HANDOVER.md), [Backlog](BACKLOG.md), [Zasady](WORK_RULES.md).

- [Pass II-A — indywidualne rozstrzygnięcia](../MTL_AUDIT_0.3.44_PASS2A.md). Brak zmian map/runtime; r14 pozostaje ostatnią rewizją. Klasyfikacja nie oznacza naprawy ani odbioru.

## Pass II-B1 (WIP)
4 modele przygotowane w `templates/mtl/pass2b1-candidates.json`: BARRACKS_S02, BARRACKS_L02, GUARDHOUSE_L02, OFFICER_M01. 8 nowych stanowisk, 16 obrotów kandydatów przeszło test V8. Nie zintegrowano z r14, nie wydano r15. [Raport](../MTL_AUDIT_0.3.44_PASS2B1.md).


## Pass II-B2 (WIP)
4 modele z wydzielonymi strefami w `templates/mtl/pass2b2-candidates.json`; 8 → 30 pomieszczeń, 55 → 93 stanowisk, 32 obrotów kondygnacji bez zgłoszeń w V8. Razem z II-B1: 8 kandydatów. r14 bez zmian, r15 nieopublikowana. [Raport](../MTL_AUDIT_0.3.44_PASS2B2.md).


## Pass II-B3 (WIP)
3 modele w pass2b3-candidates.json, razem 11 kandydatów. 8 → 29 pomieszczeń, 50 → 62 stanowisk, 28 obrotów V8. INN_L01 nadal otwarta. r14 niezmieniona, r15 nieopublikowana. [Raport](../MTL_AUDIT_0.3.44_PASS2B3.md).

## Pass II-B4 (WIP)
5 modeli w pass2b4-candidates.json, razem 16 kandydatów. 10 → 50 pomieszczeń, 125 → 136 stanowisk, 40 obrotów V8. r14 niezmieniona, r15 nieopublikowana. [Raport](../MTL_AUDIT_0.3.44_PASS2B4.md).

## Pass II-B5 (WIP)
7 modeli w pass2b5-candidates.json, razem 23 kandydatów. 12 → 55 pomieszczeń, 92 → 116 stanowisk, 48 obrotów V8. r14 niezmieniona, r15 nieopublikowana. [Raport](../MTL_AUDIT_0.3.44_PASS2B5.md).

## Pass II-B6 (WIP)
17 modeli w pass2b6-candidates.json, razem 40 kandydatów. +34 mebli, +92 dekoracji, 28 usuniętych dekoracji, +34 stanowisk, 68 obrotów V8. r14 bez zmian; r15 nieopublikowana. [Raport](../MTL_AUDIT_0.3.44_PASS2B6.md).

## Pass II-B7 (WIP)
16 modeli w pass2b7-candidates.json, razem 56 kandydatów; +43 mebli, +89 dekoracji, +43 stanowisk, 88 obrotów V8. Wrota nadal jednokaflowe; 16/16 ma prostokąt dojścia o szerokości ≥2. r14 bez zmian, r15 nieopublikowana. [Raport](../MTL_AUDIT_0.3.44_PASS2B7.md). [Rejestr obciążenia](CHAT_LOAD_LOG.md).

## Pass II-B8a (WIP)
II-B8a: kod wielopolowych progów, MTL, walidacja i viewer; pozytywna regresja V8. II-B8b: wdrożyć entrySpan w 16 kandydatach gospodarczych II-B7, dopasować dojścia, wystrój i wyposażenie; sprawdzić wszystkie pasy, skale i obroty. 56 kandydatów bez zmian, r14 niezmieniona, r15 nieopublikowana. Node, Android, offline, UI, większe jednostki i pełna walidacja nadal otwarte. [Raport](../MFS_WIDE_PORTALS_0.3.44.md).

## Pass II-B8b (review)
II-B8 zakończony w zakresie mechanizmu i migracji kandydatów: 16 modeli II-B7 zastąpiono nowszymi z II-B8b; 15 wejść 2/4 i 1 wejście 1/2, 64 kompilacje instancji i 372 pola przejścia sprawdzone, 88 obrotów kondygnacji, wszystkie meble i dekoracje zachowane. 56 unikatowych kandydatów. r14 niezmieniona, r15 nieopublikowana. [Raport](../MTL_AUDIT_0.3.44_PASS2B8B.md).

## Pass II-B9 (review)
II-B9: 9 wersjonowanych definicji wyposażenia, 28 zaktualizowanych modeli, 74 unikatowych kandydatów (18 nowych ID), 196 obrotów V8, 38 zmian funkcji pokojów, 13 nieprawidłowych stanowisk drabin wyłączono. SP_PORT: +29/-34 dekoracje. Zachowano typy BDS; proponowane podtypy depozytu i sztabu wymagają akceptacji, nabrzeże portu otwarte. Nowe akcje opisowe, nie działające procesy. r14 bez zmian, r15 nieopublikowana. [Raport](../MTL_AUDIT_0.3.44_PASS2B9.md).

## Pass II-B10a (WIP)
II-B10a: sąd i trzy świątynie, 4 modele, 20→49 pomieszczeń, 172→218 stanowisk, +30 mebli, +44 dekoracje, 0 usuniętych, 40 obrotów V8. 75 unikatowych kandydatów; r14 bez zmian. B10 nadal WIP. [Raport](../MTL_AUDIT_0.3.44_PASS2B10A.md).

## Pass II-B10b (review)
II-B10b: 5 modeli (trzy zamki, krypta, skarbiec), 39→110 pomieszczeń, 242→350 stanowisk, +80 mebli, +70 dekoracji, 0 usuniętych, 72 obroty V8. B10 łącznie 9 modeli, +100 pomieszczeń, +110 mebli, +114 dekoracji, +154 stanowiska. 79 unikatowych kandydatów, r14 bez zmian. B10 zakończony w zakresie kandydatów. [Raport](../MTL_AUDIT_0.3.44_PASS2B10B.md).

## Pass II-B11a (WIP)
Czat (5). Cztery modele wojskowe i mieszkalne w templates/mtl/pass2b11a-candidates.json; +13 mebli, +33 dekoracje, 50→63 stanowiska, 16 obrotów V8 bez zgłoszeń. 79 unikatowych kandydatów; r14 bez zmian; r15 nieopublikowana. II-B11 nadal WIP. [Raport](../MTL_AUDIT_0.3.44_PASS2B11A.md).

## Pass II-B11b (WIP)
II-B11b: 11 modeli z B2–B4, +51 mebli, +165 dekoracji, 246→301 stanowisk, 84 obroty V8 bez zgłoszeń. 79 unikatowych kandydatów; B11a+B11b: 15 modeli, +64 meble, +198 dekoracji, +68 stanowisk, 100 obrotów. Jedna cela PRISON_M01 bez dodatkowej ławy (brak bezpiecznej pozycji). r14 bez zmian, r15 nieopublikowana. B11 nadal WIP. [Raport](../MTL_AUDIT_0.3.44_PASS2B11B.md).

## Pass II-B11c (WIP)
II-B11c: 7 modeli B5 (RUR_HOUSE_L01 z B9), +36 mebli, +114 dekoracji, 116→156 stanowisk, 48 obrotów V8 bez zgłoszeń. Nowe meble nie zajmują końców roomCuts; nowe stanowiska w pokoju obiektu. Jedna przebieralnia BATHHOUSE_M01 bez dodatkowego mebla. B11a–c: 22 modele, +100 mebli, +312 dekoracji, +108 stanowisk, 148 obrotów; 79 unikatowych kandydatów. r14 bez zmian, r15 nieopublikowana, B11 WIP. [Raport](../MTL_AUDIT_0.3.44_PASS2B11C.md).
