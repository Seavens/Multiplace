# Build & Run

## Prerequisites
- Node 18+
- Roblox Studio with the Rojo CLI on your PATH (`rojo --version`)

## Day-to-day loop
1. `npm run watch:game` — incremental `rbxtsc` build for `places/game` and shared code.
2. `npm run serve:game` — Rojo serves `places/game/default.project.json`.
3. In Studio, open any place and attach to the Rojo server.

## What gets built
- roblox-ts outputs to `places/game/out` and `places/common/out`.
- The default Rojo project mounts both outputs into ReplicatedStorage / ServerScriptService so game code and common code ship together.

## One-off build
- `npm run build:game` performs a single compile for deployments or CI.

