# Sync and Data

Charm atoms
- Atoms are reactive state containers from `@rbxts/charm`.
- Root data atom: `places/common/src/shared/data/atom.ts` (`dataAtom`).

Selectors for sync
- `places/common/src/shared/sync/types.ts` exports `Selectors` that map names to atoms.
- The server and client pass `Selectors` into charm-sync so state can replicate.

Server
- `places/common/src/server/sync/service.ts`:
  - `CharmSync.server({ atoms: Selectors, interval: 0.1, autoSerialize: true })`
  - Hydrates players on join and on request.
- `places/common/src/server/data/service.ts`:
  - Loads a Lapis document per player
  - Uses `effect` to mirror `DataManager.getData(id)` into the document

Client
- `places/common/src/client/sync/controller.ts`:
  - Creates `CharmSync.client({ atoms: Selectors })`
  - Applies incoming payloads via a Flamework networking event
- `places/common/src/client/data/controller.ts`:
  - Demonstrates `watchMap(dataAtom, { added/changed/removed })`

Add a new atom and sync it
1) Define types (optional if not player data)
- Add to `places/common/src/shared/...` as needed, potentially with `@rbxts/t` validators for server data.

2) Create the atom
- Example: `places/common/src/shared/inventory/atom.ts`
  ```ts
  import { atom } from '@rbxts/charm';

  export interface InventoryState { [user: string]: string[] }
  export const inventoryAtom = atom<InventoryState>({});
  ```

3) Export it and add to Selectors
- `places/common/src/shared/sync/types.ts`:
  ```ts
  import { dataAtom } from '../data';
  import { inventoryAtom } from '../inventory/atom';

  export const Selectors = {
    data: dataAtom,
    inventory: inventoryAtom,
  };
  ```

4) Use it
- Server: update the atom via a manager or direct updates to replicate
- Client: `Charm.subscribe` or a watcher (like `watchMap`) to react to changes

Notes
- If syncing player data stored in Lapis, ensure schema (`t.strictInterface`) matches what you write.
- Always update atoms using their updater function (e.g. `atom(prev => newPrev)`) so subscriptions fire.

