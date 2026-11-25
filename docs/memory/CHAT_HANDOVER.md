# CHAT_HANDOVER — CMS 1.0
2026-11-25 | Alpha 0.3.45 | CITY-001b runtime r2.
## Kierunek
D016/D017: samodzielne partie, organiczna mapa. Użytkownik zlecił integrację nowego Miasta 1 z grą. R1 i MTL r15 zachowane; nie wracać do masowego audytu/koncepcji.
## Stan
city_001@2: 192×192, 96 działek (72 zabudowane/24 wolne), 79 budynków, 127 kondygnacji, 127 portali, 400 deklarowanych miejsc snu, 22 drogi. Runtime r2: world.json i loader MFS, start kampanii, kolizje, portale i wnętrza, 4 bramy i 3 wyjścia, powrót z mapy świata, rezerwacja działek, 24 uproszczone NPC tła, migracja zapisów schema 10 z kopią legacy. Stara mapa pozostaje fallback. Pełny DNS, polityka dostępu, ruch po murach/wyższe poziomy F3, logistyka i odbiór MTL/r2 pozostają otwarte.
## Testy
GitHub Actions 45656555044 i 45656775026: sukces Node (city-r2-runtime, mfs-core, mfs-validator, składnia game.js), Chromium/Playwright 853×394 (start, ruch, karczma, powrót, zapis, poligon MFS). Test z blokadą SW, nie fizyczny Android ani offline. Kod zweryfikowany na afa00c9. Nie utożsamiać runtime podstawowego z pełnym odbiorem MDS/MFS.
## Otwarte
Weryfikacja wdrożenia Pages po aktualizacji main, fizyczny Android/offline, odbiór wizualny i road017 RDS_STYLE, pełny F3 i IDS_PROGRAM/RDS_VEHICLES, DNS, bramki r15 według ../MTL_R15_CLOSURE_0.3.44.md. Nie ogłaszać pełnej certyfikacji. Sprawdź HEAD i aktualny Actions.
