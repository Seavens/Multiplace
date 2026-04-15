/**
 * Iterates over key-value pairs of a plain record (non-array Lua table).
 *
 * Use this instead of calling `pairs()` directly — it keeps the
 * roblox-ts/no-array-pairs lint suppression in one place and skips
 * undefined values automatically.
 */
export function iterateRecord<V>(
  record: Readonly<Record<string, V | undefined>>,
  callback: (key: string, value: V) => void,
): void {
  // eslint-disable-next-line roblox-ts/no-array-pairs
  for (const [key, value] of pairs(record)) {
    if (value !== undefined) {
      callback(key as string, value as V);
    }
  }
}
