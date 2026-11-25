# Stan produkcji — Project Kingdoms
Aktualizacja: 2026-11-25, czat (4).
Ostatni commit funkcjonalny: ac670f9f5fc2cd78efb86e107e3133c850627117 (Alpha 0.3.44).
Gałąź: main. Gra offline 2D fantasy RPG + symulacja królestwa, rozwijana hybrydowo, oddzielnie od Universal Engine.

## Aktualny etap
MTL Audit Pass II-A — triage 67/67 modeli zakończony; II-B — przebudowa i kontrola geometrii do wykonania. R14 (Pass I) pozostaje review-only, nie jest zatwierdzoną mapą ani gotową do gry.
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
