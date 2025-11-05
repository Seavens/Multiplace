# VS Code Tasks

Tasks live in `.vscode/tasks.json` and mirror the npm scripts, so you can launch everything from the command palette.

## Available tasks
- `Watch Game`: runs `npm run watch:game` in the background.
- `Serve Game`: runs `npm run serve:game`.
- `Dev`: compound task that starts both of the above.

## Usage
- Open the command palette → “Run Task…” → pick `Dev` for the full loop, or start individual tasks as needed.

