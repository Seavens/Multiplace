# Troubleshooting

No client change logs
- Ensure you update atoms using their updater, not mutating the snapshot:
  - Good: `dataAtom(prev => ({ ...prev, [key]: next }))`
  - Good: `dataAtom(prev => produce(prev, draft => { ... }))`
  - Bad: calling `produce(prev, ...)` without writing back to the atom

Lapis assertion on write
- Your schema uses `t.strictInterface` in `types.ts`. Extra fields or wrong shapes will fail validation.
- Fix by:
  - Writing only fields in the schema; or
  - Expanding the schema and defaults to include desired fields

Defaults being mutated globally
- Always clone defaults for new players (see `cloneDefaults()` pattern in `DataManager`).

Rojo not seeing code
- Ensure `npm run watch:game` is running so `out/` is populated
- Ensure `default.project.json` mounts `out/game` and `out/common`

