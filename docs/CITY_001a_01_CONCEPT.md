# CITY-001a.01 — Karta lokacji Miasta 1 (zatwierdzone parametry)
2026-11-25 | Alpha 0.3.44 | CMS 1.0 | baza 64622ba
Status: sześć parametrów zatwierdzonych przez użytkownika (D012, 2026-11-25), uwagi: brak. 75%/72/24 wynika z MDS §17/70. Pozostałe szczegóły opisowe robocze. Bez kodu, map, geometrii, migracji i DNS.
## Podstawa
GDD 1.0 §1–4, 8–10, 18–25, 27, 32–35, 49; MDS 1.0 §2–6, 11, 17, 19, 37, 44, 70–76 i D07/D12; MFS 1.0 §7, 25–28. Weryfikacja HEAD: identyczny z 64622ba. R15 zamrożona review-only, pełny odbiór nadal otwarty. maps/world.json zawiera jedynie wpis testowy mfs_test_001; legacy nie zinwentaryzowano.
## Karta i założenia robocze (zatwierdzone: klasa, wymiary, liczba działek, populacja, specjalizacja, F3 + twierdza)
- Nazwa robocza Miasto 1; docelowe ID city_001 jako propozycja do weryfikacji w migracji.
- Średnie miasto, 192×192 kafle (36 864), 96 działek standardowych, 72 zabudowane i 24 wolne (75%). Twierdza, ulice, infrastruktura i inne obszary specjalne poza mianownikiem.
- Docelowa populacja symulowana 400; nie oznacza aktywnych NPC ani zweryfikowanych miejsc noclegowych. Weryfikacja łóżek/IDS/RRS przed odbiorem.
- Regionalne miasto handlowo-rzemieślnicze, ośrodek administracyjny, funkcjonujące i rozwijające się, naturalny częściowo nieregularny charakter. Proponowana historia: rozwój wokół siedziby lokalnego władcy i traktu, następnie rozbudowa rzemiosła i murów.
- Proponowane mury F3 i odrębny kompleks twierdzy (S/PS); konkretna klasa kompleksu, rezerwy i geometria później.
- Handel, produkcja, dostawy i zapasy, mieszkania, usługi; własność prywatna, organizacyjna i publiczna; powiązania z okolicznymi dostawcami. Bez deklaracji działania mechanik.
- Państwo, nazwa właściwa, dokładne położenie, rzeka/port i kierunki wyjść: otwarte. Nie zakładać nowych lokacji poza GDD.
- Funkcje wymagane MDS §73: woda, mieszkanie, żywność, magazyny, handel, kowalstwo, karczma, kult, administracja, opieka medyczna, straż. Edukacja, biblioteka i więzienie opcjonalne; port geograficzny.
## Plan roboczy CITY-001a
01 karta lokacji (niniejsza propozycja); 02 topografia i geografia; 03 dzielnice i program; 04 bilans działek i zabudowa; 05 komunikacja/logistyka/infrastruktura; 06 fortyfikacje/kompleks; 07 gospodarka/własność/rozwój; 08 populacja/aktywności/dostęp; 09 założenia migracji; 10 konsolidacja i odbiór koncepcji. Wyłącznie opis, bez geometrii. Każda kolejna partia po akceptacji poprzedniej. W CITY-001b zachować kolejność MDS/MFS parcelacja → drogi → odbiór → fortyfikacje → odbiór → zabudowa → wnętrza → infrastruktura → odbiór; osobna mapa review.
## Kontrola
Zgodność liczb z zakresami MDS §3.1, §17, §70: 192×192 w zakresie 144–224; 96 w zakresie 70–120; 400 w zakresie 300–700; 72/96=75%. Brak weryfikacji rzeczywistej geometrii, pojemności, dróg, ID legacy, testów runtime. MTL bramki nadal otwarte. Migracja: jawne mapowanie starych ID i pozycji, ochrona mienia i oryginalnych zapisów, rollback przy błędzie; nie wykorzystywać przykładowych ID MFS jako dowodu zgodności. Zasady szczegółowe w partii 09. Kontrola 2026-11-25 po decyzji D012: parametry zgodne z MDS §3.1, 6, 17, 19, 37, 43–44, 70–73. Następna partia 02 rozpoczęta na polecenie użytkownika; [propozycja topografii](CITY_001a_02_TOPOGRAPHY.md).
