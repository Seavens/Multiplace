# Build and Run

Requirements
- Node 18+
- Roblox Studio + Rojo CLI (`rojo` on PATH)

Terminal workflow
- Terminal A: `npm run serve:game` (Rojo serve places/game)
- Terminal B: `npm run watch:game` (rbxtsc watch compile)
- In Studio: open a base place and connect to the Rojo server

How it compiles
- roblox-ts compiles TS under `places/game` and `places/common` into `out/game` and `out/common`
- `places/game/default.project.json` mounts both `out/game` and `out/common` into ReplicatedStorage/ServerScriptService as appropriate

Single build
- `npm run build:game` compiles once for CI or release output

