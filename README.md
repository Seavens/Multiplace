# Flamework Multiplace Template

Starter kit for Roblox multiplace projects with Flamework, Lapis-backed data, Charm state, and charm-sync replication.

- Stack: Flamework • Lapis • Charm • charm-sync • roblox-ts • Rojo
- Places: `places/common` (shared runtime + data) and `places/game` (experience-specific code)

See `docs/` for deeper dives:
- `docs/build-and-run.md` — local loop + deploy build command
- `docs/sync-and-data.md` — how atoms, sync, and data layers fit together
- `docs/troubleshooting.md` — quick fixes for common issues
- `docs/vscode-tasks.md` — one-click tasks inside VS Code

## Getting Started
1. Install Node 18+ and the Rojo CLI (`rojo --version`).
2. `npm install`
3. In one terminal run `npm run watch:game` (rbxtsc).
4. In another run `npm run serve:game` (Rojo).
5. Join from Studio and attach to the Rojo server.

## Highlights
- Charm atoms live in `places/common/src/shared`; game-specific atoms live under `places/game/src/shared`.
- charm-sync bridges the server/client gaps (`CommonSyncService`, `GameSyncService`, and matching controllers).
- `DataService` uses Lapis documents and `@rbxts/t` validation; mock data is on by default for local work.
- Game code can mutate shared data through the exported managers (`DataManager`, `GameManager`).

## Using the Template
- Click “Use this template” on GitHub, or clone then `rm -rf .git && git init -b main`.
- Update `package.json` metadata, then `npm install`.

## Production Checklist
- Disable mock data: set `USE_MOCK_DATA = false` in `places/common/src/server/data/service.ts`.
- Extend `DEFAULT_DATA` and `IS_DATA` when you add new fields; keep validators and defaults in sync.
- Tune sync interval in `places/common/src/server/sync/service.ts` (`interval: 0.1` by default).
- Replace `warn(...)` with structured logging if you need observability.
- Use `npm run build:game` for CI/deploy builds; ensure the Rojo project still mounts `out/common` + `out/game`.

## Structure
- `places/common` — shared data, networking, services, and client controllers used by every place.
- `places/game` — game-specific services/controllers plus Rojo project configuration.

---

Initial idea inspired by imkalrbx/rbxts-multiplace-setup-flamework. Licensed MIT (see `LICENSE`).
