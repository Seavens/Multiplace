# Sync & Data

## Architecture
- Common owns player data: atoms live under `places/common/src/shared`, and `DataService` persists them with Lapis.
- Game adds per-experience state under `places/game/src/shared` (for example `gameAtom`).
- Both layers share networking through `@common/shared/network`, so the game can extend events/functions while reusing the core sync pipeline.

## Charm + charm-sync
- Atoms (`atom(...)`) are reactive containers. Example: `dataAtom` stores `Data` keyed by player id.
- `CommonSelectors` and `GameSelectors` map names to atoms. charm-sync snapshots those selectors and ships payloads to clients.
- Server: `GameSyncService` and `CommonSyncService` hydrate players on join or on demand (`requestHydration`).
- Client: the corresponding controllers feed payloads into `CharmSync.client(...)`, keeping local atoms up to date.

## Data lifecycle
1. `DataService` loads/creates a Lapis document for each player and writes it into `DataManager`.
2. Managers (`DataManager`, `GameManager`, etc.) mutate atoms via their updater helpers (never mutate snapshots directly).
3. charm-sync pushes the changed selectors to each subscribed client, where application code can react (e.g. `watchMap`).

## Extending with new atoms
1. Define the state shape and defaults in `places/common/src/shared/...` (optionally add `t` validators).
2. Create the atom and expose it through a manager if it needs helpers.
3. Add the atom to `CommonSelectors` or `GameSelectors` so charm-sync replicates it.
4. Update networking augmentations if you need extra RPCs/events.

Keep writes pure: always supply a new value or use `produce` in the atom updater so subscribers and Lapis effects see the change.

