# Flamework Multiplace Template

A Roblox TypeScript starter for building a real multiplace game. Ships with shared player data, delta replication, a pauseable clock system, and Lapis DataStore persistence.

Stack: **roblox-ts · Flamework · Charm · Lapis · Squash · @rbxts/t · Immut · Rojo**

---

## Places

```
places/
  common/   shared data, replication, clocks, and utilities used by every place
  lobby/    entry place — lightweight lobby state machine
  game/     gameplay place — coin rewards, elapsed time tracking
```

`common` is a path alias (`@common/shared`, `@common/server`, `@common/client`) consumed by the other places at compile time — it is not a standalone place. Each place has its own `tsconfig.build.json` and Rojo project file.

---

## Running It

```bash
npm install

# Watch + serve in separate terminals
npm run watch:lobby && npm run serve:lobby   # port 34872
npm run watch:game  && npm run serve:game    # port 34873

# Other
npm run build:all
npm run serve:all
```

---

## Architecture

Keep these two things separate and never mix them:

| Category | What it is | Who owns it |
|---|---|---|
| **Player data** | persistent, follows the player across places | `common` |
| **Place state** | transient, only exists while the place is running | each place |

Each place mirrors the same mini-stack: `types.ts` → `state/atom` → `Manager` → `replication/` → server service → client controller.

---

## Player Data

### Schema

```typescript
export interface ProfileData { coins: number }
export interface PlayerData  { lastLogin: number; totalPlayTime: number }
export interface Data        { profile: ProfileData; player: PlayerData }
```

Validators use `t.interface` (non-strict) so documents with extra or missing fields from old schema versions still pass validation.

### DataManager

The single read/write API for player data everywhere in the codebase:

```typescript
DataManager.getData(userId)              // → Data (normalized, never undefined)
DataManager.getDataEntry(userId)         // → Data | undefined
DataManager.setData(userId, data)
DataManager.updateData(userId, mutator)  // Immer-style mutation
DataManager.deleteData(userId)
DataManager.selectData(userId)           // → Charm computed selector
```

### Persistence (Lapis)

- **Load**: runs Lapis migrations, validates, stamps `lastLogin = os.time()`.
- **Reactive write**: a Charm `effect` calls `doc.write()` on every atom change. Lapis debounces internally.
- **Unload**: adds the current session to `totalPlayTime`, does a final explicit write, then `doc.close()`.
- **Mock mode**: `USE_MOCK_DATA = RunService.IsStudio()` — DataStore is skipped in Studio entirely.

#### `lastLogin` / `totalPlayTime`

A player whose stored `lastLogin === 0` is brand new. Use the `isNewPlayer` hook in `loadPlayer` to grant starter items, run tutorials, etc. `totalPlayTime` is written before the final `doc.close()` so no session time is lost on a clean exit.

#### Schema migrations

Append to the `migrations` array in `store.service.ts` whenever `Data` changes. Never edit existing entries.

```typescript
migrations: [
  // v0 → v1: normalizeData fills any missing fields from DEFAULT_DATA
  (data): Data => normalizeData(data as Partial<Data>),
  // For renames, add a Migration<unknown> entry before the normalizeData call.
  // The final entry must always return Data.
],
```

---

## State Replication

The same delta pattern is used for player data and place state.

```
server atom → Replica (diff) → Squash buffer → RemoteEvent → client atom
```

A `Clock`-driven tick diffs the current atom against the last snapshot. Changed fields become a `DataReplicationDelta`, batched into one binary event per tick via Squash. The client controller deserializes and applies each delta.

On load, a full snapshot is sent immediately. The `hydratedPlayers` guard prevents duplicate snapshots. Clients can call `Functions.requestHydration` to re-request if they joined before data was ready.

---

## Clock System

| Singleton | Interval | Use for |
|---|---|---|
| `GameClock` | 20 hz | game logic, server services, place state |
| `CoreClock` | 60 hz | client animation, UI |

All game logic subscribes to the same `GameClock`, so you get one knob for everything:

```typescript
GameClock.pause()
GameClock.resume()
GameClock.setTimeScale(0.5)  // half speed
```

`Clock.on(listener)` returns an unsubscribe function.

---

## Reactive Patterns (Charm)

| Primitive | Purpose |
|---|---|
| `atom(value)` | mutable reactive cell |
| `computed(() => ...)` | derived value, re-runs only when dependencies change |
| `effect(() => ...)` | side effect on change, returns unsubscribe |
| `peek(selector)` | read without subscribing |

Wrap selectors in `computed` to isolate exactly what triggers a re-run:

```typescript
// Only fires when the whole-second value changes, not every frame
const elapsed = computed(() => math.floor(GameManager.getState().time));
effect(() => print(`elapsed ${elapsed()}s`));
```

**`iterateRecord`**: roblox-ts bans `for...of` on Luau tables. Import `iterateRecord` from `@common/shared` to iterate `Record<string, V>`. Use `.forEach()` for `Map` and `Set`.

---

## Adding a New Place

Copy `lobby` or `game`:

1. New `places/my-place/` with `tsconfig.build.json`, `package.json`, and a Rojo project file.
2. Add `@common/shared`, `@common/server`, `@common/client` path aliases.
3. Create `main.server.ts` / `main.client.ts` entry points and wire `Flamework.addPaths`.
4. Add `shared/my-place/` with `types.ts`, `state/`, and `replication/`.
5. Add `watch:my-place` and `serve:my-place` scripts to `package.json`.

Only add `server/` paths in server entry scripts and `client/` paths in client entry scripts. Never add `shared/`.

---

## Adding Fields to Data

1. Add the field to `Data` in `types.ts` and its default to `DEFAULT_DATA`.
2. Update the `t.interface` validator.
3. Append a migration in `store.service.ts` — `normalizeData` handles most additions:
   ```typescript
   (data): Data => normalizeData(data as Partial<Data>),
   ```

---

Each place ships a `server/test/service.ts` and `client/test/controller.ts` that print state to the output window. Remove or gate them before shipping.

---

Initial idea inspired by `imkalrbx/rbxts-multiplace-setup-flamework`. Licensed MIT.
