# Alpha 0.3.44 — MTL Pass II-B1 (WIP)
Data: 2026-11-25. Baza r14. Zmiany w oddzielnej nakładce kandydatów, NIE w aktualnym katalogu lub galerii. Nie publikowano r15. MDS 1.0 §§51,54,55–56,60–64: koszary wymagają zakwaterowania i sprzętu, dom snu i przygotowania posiłków; potencjał wyposażenia nie oznacza aktywnej mechaniki.

| Model | Nowe obiekty | Stanowiska przed → po |
|---|---|---|
| BARRACKS_S02 | weapon_rack, armor_rack | 9 → 11 |
| BARRACKS_L02 | weapon_rack, armor_rack | 15 → 17 |
| OFFICER_M01 | fireplace, food_rack | 9 → 11 |
| GUARDHOUSE_L02 | watch_desk, armor_rack | 9 → 11 |

Wszystkie cztery modele: wersja szablonu 2 → 3, zachowane obrysy, progi, kondygnacje, istniejące wyposażenie i dekoracje. 8 nowych obiektów i stanowisk. Komendantura: obserwacja i sprzęt, nie działający system wart. Kwatera: aneks gotowania w strefie gabinetu, dalszy podział/wymiary pomieszczeń do przeglądu.

## Testy faktycznie wykonane
Rzeczywiste funkcje kompilacji MTL, FPS, RTS i walidacji dekoracji z repozytorium uruchomiono w V8 (import/export dostosowane do wykonania). Dodatkowo kolizje ścian i wyposażenia, portale, flood-fill od wejścia do wszystkich stanowisk i kotwic pomieszczeń; 16 obrotów bazowych + 16 kandydatów, zero zgłoszeń po skorygowaniu kolizji i blokady stanowiska w kwaterze. Nie wykonano pełnego MFS galerii, testu Node, wizualnego, Android ani Pages. Skrypt regresji tests/mtl-pass2b1.mjs zapisany; uruchomienie Node pozostaje otwarte. Kontener nie może połączyć się z GitHub.

## Następna partia
CLINIC_M01, SP_CLINIC i HALL_M01 mają już reception_desk w r14; nie dublować. Zaprojektować rzeczywiste strefy recepcji/obsługi, leczenia, administracji i zaplecza. Następnie SP_KEEP_VAULT (mieszkanie/reprezentacja). Po zebraniu i walidacji kandydatów kompilować r15, zachować r14. Kontrola wymiarów IDS i całej nawigacji otwarta.
