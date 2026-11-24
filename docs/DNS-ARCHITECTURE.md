# DNS 1.0 — Dynamic NPC Simulation

Status: approved design, staged integration across Project Kingdoms Alpha 0.3.x.
Goal: a city feels populated by hundreds while a smartphone simulates only a small active neighbourhood.

## Actor persistence classes
- **Permanent / important:** named lords, shopkeepers, guards in charge, quest characters; stable profession, real workplace, home, conversations and saved identity. Off-screen state advances coarsely, not tile by tile.
- **Temporary / ambient:** passers-by and visitors spawned within camera-neighbourhood chunks. No expensive biography or fully persistent schedules by default.
- **Promoted / observed:** ambient characters upgraded in place to realistic routes, schedules, interiors and richer interactions as the player observes them. Keep appearance, location and direction unchanged when upgrading.
- **Remembered:** characters talked to or followed by the player can enter a small save registry, with retention policy rather than immediate disappearance.

## Four simulation levels (planned)
- L0 ambient: low-cost local motion and collision without full daily schedule.
- L1 observed: after roughly 20 seconds continuous visibility, meaningful destination and sensible routes.
- L2 followed: longer attention (~60 seconds), daily schedule and ability to enter real buildings.
- L3 permanent: important and personally promoted characters, interactions, persistent memory and off-screen abstract state.
- Apply hysteresis and elapsed real time (not frame counts) for upgrades and cooldowns.
- Prioritize direct interactions, followed NPC, important active NPC, then nearby observed NPC; avoid fully simulating 40 characters solely because they are on screen.

## Spatial population (planned)
- Partition each city into chunks. Activate current viewport plus several buffered neighbouring blocks.
- City/chunk/day/hour/district seeds determine plausible temporary residents.
- Spawn beyond actual viewport, never directly in front of the camera. Despawn with a grace period only after leaving buffered area.
- Characters outside active chunks do not run individual physics, routing or animation.
- Target: several hundred population potential per city, 20–50 simultaneously active near the player (device dependent). These targets are not measured limits.

## Camera and minimap (planned)
- Lower zoom limit increases from 25% to 50% to cap visible geometry.
- Low-resolution minimap draws simplified terrain, roads, buildings, player, camera bounds, active NPCs and stationary important NPCs.
- Update minimap at low frequency. Zoom must not generate ambient NPCs outside active spatial chunks.

## Current milestone — Alpha 0.3.24
- Existing 40 NPC retained: 12 permanent and 28 resident. NPC metadata includes simulationClass; ambient streaming stays disabled.
- Twelve named NPCs receive explicit role/workplace/behaviour/dialogue. Berta works in the market; Daria is innkeeper in the tavern.
- Guards patrol waypoint circuits; indoor workers spend longer at their stations instead of repeatedly pacing.
- Earlier night return and save schema remain supported.

## Implemented — Alpha 0.3.25, ambient population streaming
- A second transient NPC layer runs alongside the 40 saved city NPCs. Temporary actors are never written to the old campaign save format.
- City divided into 12 × 12 tile chunks. Only chunks touching the camera viewport plus a small buffer are used to seed actors.
- A fixed cap of 38 active temporary characters keeps CPU and memory bounded even if many chunks exist.
- Density differs between market, artisan quarter, housing, fortress precinct and countryside; night-time generation is reduced.
- New pedestrians are spawned strictly outside the visible camera rectangle. They initially walk towards nearby streets visible to the player.
- An out-of-range actor receives a 14-second grace period before deletion. Active chunks are rearmed after the camera moves away.
- Temporary actors have only L0 local steering (maximum four neighbour candidates), no A* or individual schedules. They are not yet promoted by observation, cannot be followed across building interiors, and have no persistent identity.
- Side panel displays currently active ambient actors and cumulative creation/removal counters.
- Tested simulated 20-second viewport at several hours: by midday 14 temporary actors entered the image naturally, zero spawned visibly, zero stepped on prohibited wall/door/rampart tiles. Further real-device tests required.

## Implemented — Alpha 0.3.26, observation priorities
- NPC tła zawierają zegary obserwacji z czasu rzeczywistego. Używany jest czas widoczności w obrębie kamery oraz bliskość gracza; przeliczenia są ograniczone do jednego skupionego celu i niewielkiej liczby kandydatów.
- Dotknięcie tymczasowego NPC lub przycisk Zbadaj w jego pobliżu ustawia jawne zainteresowanie; ponowne dotknięcie odznacza go, z krótkim okresem ochronnym przed automatycznym ponownym wyborem.
- Pierwszy awans po około 20 sekundach => L1: spójne, dłuższe trasy planowane ograniczonym BFS. Drugi po około 60 sekundach skoncentrowanej obserwacji => L2: ważniejsze cele podróży do dzielnic i punktów miejskich.
- Każdy awans zachowuje ten sam obiekt, współrzędne, kolory, nazwę i animację. Kolorowy obrys ułatwia rozpoznanie śledzonej postaci.
- Budżet: najwyżej 3 podniesione poziomy symulacji (L1/L2) równocześnie i maksymalnie 1 postać L2. Pozostałe NPC używają lekkiego ruchu L0.
- Licznik DNS w bocznym panelu pokazuje liczbę aktorów, podniesionych symulacji, śledzonego NPC, poziom i liczbę sekund obserwacji.
- W 0.3.26 L2 oznacza zaawansowane **trasy na zewnątrz**. Zapis tożsamości po zniknięciu, wejścia do budynków i pamięć postaci są odłożone do 0.3.27.
- Wersja 0.3.26 nie zmienia układu Miasta 1, limitu 38 tymczasowych NPC, systemu zapisów, zoomu ani minimapy.

## Delivery roadmap (future work)
- 0.3.25: spatial chunks, temporary crowd, spawn/despawn outside viewport.
- 0.3.26: observation timer, promotion tiers, priority/cost budget.
- 0.3.27: tracking interactions, persistent identity and real building entry for promoted ambient NPCs.
- 0.3.28: camera min zoom 50% and efficient minimap.
- 0.3.29: mobile profiling, crowd density and endurance tests.

## Invariants
- Profession, actual workplace, dialogue and daytime behaviour must agree.
- Never spawn NPCs inside walls, furniture or gate barriers; never visibly teleport followed NPC.
- Important and remembered identities persist across save/load.
- Door access, road continuity and city walls cannot be broken by NPC generation.
- Do not report future DNS features as implemented before they pass tests.

## Alpha 0.3.27
- Shared NPC/player portal links; visible fixed residents and ambient visitors use real thresholds and interior floor routing.
- L0 and L2 visitors can enter public buildings; maximum three visit routes, ordinary visitors limited to two. Active ambient cap 38.
- Separate 32-record identity registry for observed and contacted NPCs; compatible with schema 9. Advanced tiers require current attention.
- Module simulation passed: 24 valid links, L2 entry/exit and 24 interior steps, identity and conversation-count restore, fixed-resident entry, 4 ordinary L0 entrances in 90 seconds with 40 residents active, 38 ambient cap and zero NPC overlap. Android browser verification pending.

## Alpha 0.3.28 — local minimap
- Local zoom clamped to 0.50–3.00 on user actions and load; strategic map unaffected.
- Tile raster LRU cache (5 maps/floors), marker updates throttled to 250 ms; no additional NPC spawning. Collapsible overlay, actual viewport rectangle, actor/gate markers.
- Mock Canvas tests passed; actual Android rendering and performance verification pending.
- User confirmed NPC building entry in 0.3.27.
## Approved DNS 2.0 roadmap
The 0.3.x series continues world/exploration development; character/combat milestone remains later. After DNS 1.0 optimisation (0.3.29), the approved order is:
- 0.3.30 NPC appearance; 0.3.31 needs; 0.3.32 dynamic daily plans.
- 0.3.33 work stations and occupational animation; 0.3.34 NPC-to-NPC interactions.
- 0.3.35 personality; 0.3.36 dialogue and memory; 0.3.37 environmental reactions; 0.3.38 integration and optimisation.
- Individual economy, social networks, life cycles and long-term ambitions are future cross-system work, not promised for this release.

## Alpha 0.3.28.1 — mobile navigation refinement
Main local zoom 100–300% after user-reported lag at 50%. Independent minimap 100–600%, four sizes, pan/follow, current-map POI search, waypoint and explicit local route, display filters, saved UI preferences. Cached terrain remains unchanged; actual mobile verification pending.

## Alpha 0.3.28.2 — local-first streaming
38 active cap unchanged; sync 650 ms or significant camera/map change. Immediate far eviction, 4 s outer grace, pressure reclamation of invisible remote actors, actual sector occupancy and retry cooldown, up to 10 new actors per cycle. Protect visible and talking actors/current interior; remembered identities remain in registry. Actual-module simulation with 40 fixed residents: full cap at 38, first remote jump reclaimed 38 and spawned 10 in one sync, 30 near after 5 s; five more jumps each spawned 10 immediately, 25–33 near after 4.4 s. Zero visible spawns or NPC overlaps, remembered conversation retained, two building visits, sector refill 37 actors. Android verification pending.

## Alpha 0.3.28.3 — zoning and load priming
Ambient terrain uses the true city polygon cached as a tile mask; spawning excludes vacant plots. Ordinary NPCs cannot roam outside the curtain wall or visit external facilities. Fixed workers are unchanged. Optional active snapshots (38 cap) alongside the remembered registry preserve visible actors on reload; older saves use bounded pre-render priming with time and viewport density, including public interiors. Invalid legacy remembered positions migrate to legal urban roads. Ordinary streaming never seeds on-screen. Real-module checks: 10 initial visible actors on legacy load, exact restored identity/position, legacy exterior identity migration, all four corners empty for 12 s each, five jumps, 38 cap, no NPC collisions or visible ordinary spawns, public interior priming. Android verification pending.

## Alpha 0.3.28.4 — module cache hotfix
Versioned city module URL for DNS and offline precache; update bootstrap independent of game imports. HTTP reload on precache and revalidation on fetch. Save schema unchanged.
