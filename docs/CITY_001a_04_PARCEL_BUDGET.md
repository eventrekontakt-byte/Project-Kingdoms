# CITY-001a.04 — Bilans działek i zabudowy (zatwierdzony bilans)
2026-11-25 | Alpha 0.3.44 | CMS 1.0 | baza 189fedc
Status: B01–B07 zatwierdzone 7/7 przez użytkownika (D015, 2026-11-25); uwaga dodatkowa: część NPC będzie tylko tłem; brak mapy, kodu, ID, geometrii i zmian MTL. D014: F01–F09 zatwierdzone 9/9 bez uwag.
## Podstawa
GDD §18–27; MDS §15–24, 59–61, 70–73; MFS §11,14–16,23,25. Odczytano zamontowane pliki po pustym wyniku Files. D012/D013/D014 bez zmian. 192×192=36 864 kafli; 96 standardowych parceli, 72/24 (75%), populacja docelowa 400; twierdza S/PS 36×44 poza bilansem. MDS §71 to wzorzec, nie sztywna proporcja.
## Dominujące funkcje
Mieszkalne 40, handlowe 8, produkcyjne 10, usługowe 4, logistyczne 4, instytucjonalne 5, gospodarstwo 1. Razem 72. Domy kupieckie liczone mieszkalnie, stajnia logistycznie, piekarnia produkcyjnie, cech instytucjonalnie, apteka usługowo. Nie dublować funkcji mieszanych. Publiczne place, pola, woda, mury i twierdza poza 96. 
## Dzielnice
| Obszar | Zabudowane | Wolne | Program główny |
|---|---:|---:|---|
| D01 | 15 | 4 | tenement ×4, merchant_house ×2, market_hall ×1, shop ×6, bakery ×1, inn ×1 |
| D02 | 18 | 6 | house ×12, large_house ×4, shop ×1, workshop ×1 |
| D03 | 18 | 5 | house ×2, large_house ×4, tenement ×12 |
| D04 | 8 | 4 | smithy ×2, workshop ×3, brewery ×1, mill ×1, tannery ×1 |
| D05 | 5 | 2 | warehouse ×2, granary ×1, stable ×1, inn ×1 |
| D06 | 7 | 2 | hall ×1, temple ×1, clinic ×1, school ×1, guildhall ×1, apothecary ×1, bathhouse ×1 |
| D08 | 1 | 1 | gospodarstwo P6 ×1 |
| D07 twierdza | — | — | osobny kompleks |
| Suma | 72 | 24 | 96 |
7 sklepów (6 w centrum: żywność, odzież, narzędzia, wyposażenie, surowce, różne; 1 lokalny), 4 warsztaty (stolarstwo, krawiectwo, szewstwo, garncarstwo), 2 kuźnie (narzędzia i uzbrojenie/metal). Biblioteka w szkole, sąd w ratuszu warunkowo zgodnie z programem wnętrz. Młyn i garbarnia warunkowo — przy braku spełnienia wymagań proponować zastępcze funkcje produkcyjne w odrębnej decyzji. Gospodarstwo P6 może zawierać kilka budynków; pola osobno. Nie utożsamiać 72 działek z pełną liczbą budynków.
## Klasy i budżet obwiedni
| Typ | Liczba | Klasa | W×L |
|---|---:|---|---|
| house | 14 | P3 | 10×12 |
| tenement | 16 | P3 | 12×14 |
| large_house + merchant_house | 10 | P4 | 14×16 |
| shop | 7 | P3 | 10×12 |
| market_hall | 1 | P5 | 18×22 |
| workshop + smithy | 6 | P4 | 12×16 |
| bakery | 1 | P3 | 10×12 |
| brewery | 1 | P4 | 16×18 |
| mill + tannery | 2 | P6 | 18×24 |
| inn | 2 | P4 | 14×18 |
| apothecary | 1 | P3 | 10×12 |
| bathhouse | 1 | P5 | 16×18 |
| warehouse | 2 | P4 | 16×20 |
| granary | 1 | P4 | 12×16 |
| stable | 1 | P6 | 18×24 |
| hall | 1 | P5 | 18×22 |
| temple | 1 | P5 | 20×24 |
| clinic + school | 2 | P5 | 16×18 |
| guildhall | 1 | P5 | 18×20 |
| gospodarstwo P6 | 1 | P6 | 20×24 |
Wolne: P1 ×2 (4×5); P2 ×4 (8×10); P3 ×10 (10×12); P4 ×5 (14×16); P5 ×2 (18×20); P6 ×1 (20×24). P1–P6 (zabudowane/wolne): P1 0/2; P2 0/4; P3 39/10; P4 22/5; P5 7/2; P6 4/1. Rozkład klas wolnych parceli w dzielnicach do późniejszego uszczegółowienia. P1/P2 początkowo wolne; nie blokować zmiany przeznaczenia. Arytmetycznie: zabudowane 14 736, wolne 3 880, twierdza 1 584, pozostałe 16 664 = 36 864 kafle. Obwiednie prostokątne, zakres PDS §16 spełniony; to nie dowód dopasowania, dostępności ani geometrii. Każde dojście, front, zaplecze, transport, maska i BDS do kontroli przy 001b. Rezerwa pozostała nie jest dowodem, że mury/drogi/rzeka itd. zmieszczą się.
## Pojemność — jawna luka
MDS §20/60/70: rzeczywiste miejsca snu, dostęp i stan stanowisk. Z galerii maps/mtl_gallery_001_r15 (review-only), buildings/manifest i wybranych scen odczytano 10 modeli, sumy capacity stanowisk action=sleep:
| Model | ID instancji | Kondygnacje | Miejsca |
|---|---|---:|---:|
| HOUSE_L04 | b056 | 1 | 3 |
| LARGE_HOUSE_M01 | b024 | 2 | 6 |
| LARGE_HOUSE_M02 | b059 | 2 | 6 |
| MERCHANT_HOUSE_M01 | b025 | 2 | 2 |
| MERCHANT_HOUSE_M02 | b060 | 2 | 2 |
| TENEMENT_S02 | b061 | 2 | 3 |
| TENEMENT_M01 | b026 | 3 | 9 |
| TENEMENT_M02 | b062 | 3 | 9 |
| NOB_HOUSE_M01 | b124 | 3 | 4 |
| NOB_HOUSE_L01 | b125 | 3 | 4 |
23 poziomy (1+2+2+2+2+2+3+3+3+3). Statyczny odczyt deklaracji, nie kontrola dostępu ani pełny audyt. Pierwsza większa partia przerwana limitem narzędzia; dwa mniejsze odczyty skuteczne. Modelowy scenariusz 14×3 + 8×6 +16×9 +2×2=238; luka 162 względem 400 przed twierdzą i innymi funkcjami. To nie maksimum całej MTL. Zatwierdzone cele per typ 14×5 +8×8 +16×16 +2×5=400 cywilnych miejsc projektowych; niepotwierdzone. 4-kondygnacyjne tenement w granicach BDS, 4 miejsca/kondygnację do IDS/RRS. Nie doliczać łóżek gości, chorych, więźniów lub załogi bez rozdzielenia kategorii. Populacja docelowa całej lokacji 400, nie 400 plus załoga; przydział w 08. W 001b po wymaganych bramkach dobór/dostosowanie konkretnych wnętrz w osobnej rewizji, bez masowego ponownego audytu i bez zmiany zamrożonej r15 teraz. Jeżeli pojemność niemożliwa, wrócić do programu lub jawnie uzasadnić odchylenie zgodnie z §70, nie wymyślać miejsc.
## Decyzje
B01 struktura 40/8/10/4/4/5/1; B02 bilans D01–D08 96; B03 wykaz głównych typów i specjalizacji; B04 klasy P1–P6 i obwiednie referencyjne; B05 24 wolne, zróżnicowane rozmiary i rozmieszczenie; B06 cele pojemnościowe 5/8/16/5, luka r15 otwarta, dostosowanie konkretnych wnętrz później; B07 bilans przestrzeni arytmetyczny 16 664 rezerwy, potwierdzenie dopiero w mapie. 
## Kontrola
Liczebności, arytmetyka, zakresy PDS i pokrycie funkcji sprawdzone dokumentacyjnie; dostępność rzeczywista, geometria, IDS/RRS, konkretne modele pozostałych typów i bramki MTL niezaliczone. Bez zmian map, kodu, MTL, migracji, DNS i bez testów runtime. 05 komunikacja/logistyka/infrastruktura NIE ROZPOCZĘTA; STOP użytkownika, wznowienie na polecenie w nowym czacie.

## Uwaga użytkownika — NPC tła (D015)
Część NPC będzie tylko tłem. Zachować rozróżnienie populacji docelowej (400 mieszkańców całej lokacji) od liczby pełnoprawnych NPC, uproszczonych NPC tła i liczby jednocześnie aktywnych postaci. Nie ustalono proporcji, trwałości stanu, harmonogramów, reguł interakcji ani zaliczania postaci tła do populacji/miejsc zamieszkania. Rozstrzygnąć w CITY-001a.08 zgodnie z GDD/MDS i architekturą DNS, bez wznawiania implementacji DNS. Nie zmieniać zatwierdzonych celów 5/8/16/5, liczby parceli ani populacji na podstawie tej uwagi. Luka 162 to różnica między przykładowym scenariuszem 238 deklarowanych miejsc snu a celem 400, nie zweryfikowany deficyt całego miasta ani dowód konieczności przerabiania wszystkich modeli.
