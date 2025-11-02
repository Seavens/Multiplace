# Flamework Multiplace Template

A clean starting point for Roblox multiplace projects using Flamework, Lapis (data), Charm (state), and charm-sync (state replication).

- Stack: Flamework • Lapis • Charm • charm-sync • roblox-ts • Rojo
- Places: `places/common` (shared code) and `places/game` (game-specific)

Initial idea from imkalrbx/rbxts-multiplace-setup-flamework.

See the docs/ folder for focused guides:
- docs/build-and-run.md
- docs/vscode-tasks.md
- docs/sync-and-data.md
- docs/troubleshooting.md

Quick start
- Install Node 18+ and Rojo
- `npm install`
- In one terminal: `npm run serve:game`
- In another: `npm run watch:game`
- Join the local server from Roblox Studio (connect to Rojo)

Highlights
- Charm atoms for reactive state in `places/common/src/shared`
- charm-sync wiring to replicate atoms server↔client
- Lapis-backed player documents with t‑validated schema
- Dev default: DataService uses mock data (`USE_MOCK_DATA = true`)

Template Usage
- On GitHub, click “Use this template” to create a new repo
- Or clone and re-init:
  - `git clone <this-repo>` → `rm -rf .git` → `git init -b main`
  - Update `name` in `package.json`
  - `npm install`

Production Notes
- Data persistence
  - Set `USE_MOCK_DATA = false` in `places/common/src/server/data/service.ts:11` before release
  - Ensure your `IS_DATA` validators match what you write, and expand defaults when adding fields
- Sync tuning
  - Server sync interval is `0.1` by default (see `places/common/src/server/sync/service.ts:12`); raise to reduce network churn
- Errors & logging
  - Replace `warn(...)` debug logs with structured logging as needed
- CI/build
  - Use `npm run build:game` for a one-off build; ensure Rojo project includes both `out/common` and `out/game`

License
- MIT. See `LICENSE`.

Structure (brief)
- `places/common`: shared code for all places
- `places/game`: place-specific code + Rojo project
