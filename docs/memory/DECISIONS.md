# Rejestr decyzji
Inicjalizacja: 2026-11-25. Nie jest kopią wszystkich decyzji GDD; pełne ustalenia zachowują moc w dokumentach źródłowych. Nie odtwarzano nieznanych ustaleń czatu (3).

| ID | Status | Decyzja | Podstawa |
|---|---|---|---|
| D-001 | potwierdzona | Produkcja hybrydowa; samodzielne repo Project Kingdoms, Universal Engine jako odniesienie techniczne. | zatwierdzenie GDD, README |
| D-002 | udokumentowana | DNS wstrzymany do akceptacji i stabilizacji mapy referencyjnej. | README, checkpoint 0.3.39 |
| D-003 | udokumentowana | Galeria MTL i rewizje archiwalne pozostają review-only do odbioru; walidacja techniczna nie zastępuje akceptacji MDS. | Pass I |
| D-004 | zatwierdzona przez użytkownika | Stała pamięć produkcyjna w docs/memory/ aktualizowana po każdym zakończonym etapie; w razie ryzyka utraty kontekstu wcześniej. | czat (4), 2026-11-25 |
| D-005 | zatwierdzona przez użytkownika | Orientacyjny monitor obciążenia w każdej odpowiedzi produkcyjnej; bez fikcyjnych procentów. | czat (4), 2026-11-25 |

Nowe wpisy: data, ID, treść, status (propozycja/zatwierdzona/odrzucona/zastąpiona), źródło, wpływ. Nie przedstawiać propozycji asystenta jako zatwierdzonych decyzji użytkownika. W razie sprzeczności wskazać ją i stosować najnowsze potwierdzone ustalenia, nie nadpisując samowolnie GDD/MDS/MFS.

## D006 — wyposażenie i dekoracje
Data: 2026-11-25; status: zatwierdzone, źródło: bezpośrednie polecenie użytkownika w czacie (4). Kontynuując MTL, stale dodawać funkcjonalne wyposażenie, meble i tematyczne dekoracje; nie ograniczać się do geometrii. Wymagane kontrole dostępności i wizualne przed odbiorem. Dotyczy także wcześniejszych kandydatów r15.

## D007 — rejestr obciążenia rozmów
Data 2026-11-25; użytkownik zatwierdził regularny zapis obciążenia. CHAT_LOAD_LOG.md przechowuje mierzalne wskaźniki zastępcze i szacunki, nie fikcyjne wartości limitu. Utrzymać D005: brak dokładnego licznika, użytkownik decyduje o zmianie czatu.

## D008 — zakończenie ogólnego meblowania i ukierunkowane korekty
Data 2026-11-25; użytkownik zaakceptował skorygowane podejście po wskazaniu powielania etapów, polecił ostatni przegląd wszystkich modeli i raport. Nie powtarzać B11d/e/f; poprawiać wyłącznie rzeczywiste braki i niezgodności. Wykonany przegląd nie zastępuje IDS/MFS ani odbioru użytkownika. Źródło: czat (5), ../MTL_FINAL_REVIEW_0.3.44.md.

## D009 — CMS 1.0
2026-11-25; użytkownik zaakceptował audyt i wdrożenie CMS. Odczyt warstwowy, bieżące migawki zamiast kronik, jedna partia na polecenie, krótkie wyniki narzędzi. Szczegóły CMS_1.0.md; cele znakowe są regułą operacyjną, nie telemetrią. GDD/MDS/MFS bez zmian.

## D010 — indywidualne wyjątki IDS i klasyfikacje r15
2026-11-25; status: zatwierdzone przez użytkownika, źródło: bezpośrednia odpowiedź MTL-006. E01–E14 oraz C01–C02 (wszystkie 16/16) zatwierdzone zgodnie z rekomendacją i warunkami odbioru; uwagi: brak. Szczegółowy zakres i indywidualny rejestr: [pakiet decyzji r15](../MTL_R15_DECISIONS_0.3.44.md). Wyjątki dotyczą tylko określonych modeli/poziomów/typów/kotwic; C01 deposit_house przy shop, C02 military_command przy hall z warunkami BDS/FDS. Nie zmieniać standardów globalnie. Zgoda projektowa nie jest końcowym odbiorem r15 ani zaliczeniem bramek, uprawnień, logistyki czy mechanik runtime. Użytkownik polecił zapisać decyzje i nie rozpoczynać kolejnej partii.

## D011 — zamknięcie zakresu katalogowego r15
2026-11-25; źródło: polecenie użytkownika zakończyć r15 i przejść następnie do projektowania Miasta 1. Decyzja operacyjna: zamrożona biblioteka referencyjna r15 / review; kolejna partia koncepcyjna miasta. Nie interpretować polecenia jako zwolnienia z MDS/MFS, zatwierdzenia nieprzeprowadzonych testów lub zgody na produkcyjną publikację; zaległości pozostają otwarte przed produkcyjną integracją. [Protokół](../MTL_R15_CLOSURE_0.3.44.md). Bez zmian map/kodu; projektowania nie rozpoczęto.

## D012 — CITY-001a.01 karta Miasta 1
2026-11-25; użytkownik zatwierdził: średnie miasto, 192×192, 96 działek, populacja docelowa 400, specjalizacja handlowo-rzemieślnicza, F3 + twierdza; uwagi brak. MDS §17/70: 72/24 (75%); zgodność dokumentacyjna §3.1, 6, 19, 37, 43–44, 70–73. Nie oznacza odbioru mapy, pojemności ani akceptacji topografii. Polecenie przejść do 02 bez programowania i mapy. [Karta](../CITY_001a_01_CONCEPT.md).

## D013 — CITY-001a.02 topografia Miasta 1
2026-11-25; G01–G08 zatwierdzone (8/8), uwagi brak: miasto nadrzeczne w strefie umiarkowanej; rzeka E, nurt N–S, 5–8 kafli; wyniesiona platforma i wzgórze 5–6 m; twierdza NW; główne kierunki W/E/S; most E bez portu handlowego; średnia twierdza 36×44; łąki, pola, pastwiska, zadrzewienia, ograniczone przedmieścia. [Dokument](../CITY_001a_02_TOPOGRAPHY.md). Akceptacja koncepcyjna, nie odbiór mapy ani geometrii. Polecenie rozpocząć 03 bez kodu/mapy.

## D014 — CITY-001a.03 program funkcjonalny
2026-11-25; F01–F09 zatwierdzone 9/9, uwagi brak: osiem przenikających się obszarów, rynek i osobna twierdza, luźniejsze zachodnie i gęstsze północne mieszkania, rzemiosło SE z warunkowym młynem/garbarnią, logistyka E/S z ograniczeniem ciężkiego ruchu przez rynek, wymagane instytucje + szkoła/apteka/łaźnia/cech i łączone funkcje biblioteki/sądu, twierdza poza 96, przedmieścia bez osobnej wsi, priorytet mieszkalnictwa i 72/24. [Program](../CITY_001a_03_FUNCTIONAL_PROGRAM.md). Polecenie 04 bez kodu/mapy. Nie zatwierdzono konkretnych modeli, pojemności ani obwiedni.
