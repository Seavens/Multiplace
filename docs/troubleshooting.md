# Troubleshooting

## Atom updates not firing
- Always call the atom with a new value or an updater; never mutate the snapshot you read.
- Good: `dataAtom((prev) => produce(prev, (draft) => { ... }))`
- Bad: `produce(prev, ...)` without assigning the result back through the atom.

## Lapis validation errors
- Schemas use `t.strictInterface`, so unexpected keys or shapes throw.
- Align writes with `DEFAULT_DATA`, or expand the validator/defaults before sending new fields.

## Shared defaults leaking state
- Clone defaults when seeding player data (`cloneDefaults()` already does this). Avoid reusing mutable tables between players.

## Rojo can’t find scripts
- Keep `npm run watch:game` running so `out/` stays fresh.
- Confirm `places/game/default.project.json` maps `out/common` and `out/game` to the right services.

