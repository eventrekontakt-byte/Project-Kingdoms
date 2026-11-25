# Historia obciążenia rozmów — Project Kingdoms
## Zasady
Rejestr techniczny, aktualizowany przy każdym checkpointcie i przy zmianie czatu. Nie jest telemetrią ChatGPT ani pomiarem limitu tokenów. Nie ma dostępnego licznika wykorzystanego/pozostałego kontekstu, limitu długości rozmowy ani progu awarii aplikacji. Awaria aplikacji może mieć przyczyny inne niż długość rozmowy.
Mierzalne wskaźniki zastępcze: liczba zakończonych partii produkcyjnych w czacie (z repozytorium), liczba kandydatów, liczba zapisanych checkpointów, ewentualne objawy (utrata ciągłości, nieudane odczyty, awaria przy otwieraniu zgłoszona przez użytkownika). Nie utożsamiać ich z tokenami lub procentami. Ocena jakościowa Niskie/Umiarkowane/Wysokie/Krytyczne/niepewne; kolejny etap bezpieczny/tylko mały checkpoint/zalecany nowy czat. Przy problemie zapisać ostatni potwierdzony checkpoint, o ile dostępny. Nie próbować celowo wywoływać awarii.
 
| Data | Czat | Zakończone partie II-B w rozmowie | Kandydaci łącznie | Obciążenie (szacunek) | Stan / rekomendacja |
|---|---|---:|---:|---|---|
| 2026-11-25 | (3) | nieustalone | — | nieustalone | Użytkownik zgłosił awarię przy otwieraniu; przyczyna i granica pojemności niezweryfikowane. |
| 2026-11-25 | (4), II-B7 | 7 | 56 | wysokie, rosnące | Zapis produkcyjny działa; brak ustalonego progu awarii. Zalecany nowy czat przed obszerną integracją. |

**Wniosek obserwacyjny:** w czacie (4) potwierdzono możliwość wykonania co najmniej siedmiu kolejnych partii II-B, nie oznacza to gwarantowanego zapasu ani limitu rozmowy. Następne wpisy zachować w tej tabeli; aktualizować po każdym checkpointcie i odnotowywać zgłoszone objawy bez spekulowania o przyczynie.

### Kolejna obserwacja — 2026-11-25, czat (4), II-B8a
7 zakończonych partii II-B i 1 techniczny checkpoint II-B8a; 56 kandydatów. Obciążenie wysokie, rosnące; dostępna pojemność nieustalona. Pierwsza zbiorcza operacja przekroczyła limit wywołań narzędzi w jednym skrypcie (nie oznacza to przekroczenia limitu czatu); wykonana w mniejszych partiach. Brak nowego zgłoszenia awarii. Zalecana zmiana rozmowy przed kolejną obszerną operacją. Rejestr nie jest licznikiem tokenów.

### Kolejna obserwacja — 2026-11-25, czat (4), II-B8b
8 zakończonych partii II-B (II-B8 podzielony na 2 checkpointy), 56 unikatowych kandydatów. W tej partii 16 modeli zastąpiono nowszymi, nie dodawano ID. Obciążenie szacunkowe wysokie, rosnące; pojemność pozostała nieustalona. Zapis i kompilacje V8 zadziałały; brak nowego zgłoszenia awarii aplikacji. Zalecany nowy czat przed kolejnym dużym etapem. Brak pomiaru limitu czatu.

### Kolejna obserwacja — 2026-11-25, czat (4), II-B9
9 zakończonych partii II-B (II-B8 dwa checkpointy), 74 unikatowe kandydaty. W tej partii 28 zmienionych modeli, 18 nowych ID. Obciążenie orientacyjnie wysokie, rosnące; pozostała pojemność nieustalona. Zapis i testy V8 zadziałały. Brak nowego zgłoszenia awarii; zalecany nowy czat przed dużym etapem monumentalnym. Nie ma rzeczywistego pomiaru pojemności.
