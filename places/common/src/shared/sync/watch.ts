import Charm from '@rbxts/charm';

type MapLike<T> = Readonly<Record<string, T>>;
type Unsubscribe = () => void;

export function watchMap<T>(
  atom: (update?: ((v: MapLike<T>) => MapLike<T>) | MapLike<T>) => MapLike<T>,
  handlers: {
    added?: (id: string, cur: T) => void;
    changed?: (id: string, prev: T, cur: T) => void;
    removed?: (id: string, prev: T) => void;
  },
): Unsubscribe {
  let prev = atom();
  const { added, changed, removed } = handlers;

  return Charm.subscribe(atom, (nxt) => {
    for (const [uuid, p] of pairs(prev)) {
      if ((nxt as MapLike<T>)[uuid] === undefined) {
        removed?.(uuid, p as T);
      }
    }

    for (const [uuid, n] of pairs(nxt)) {
      const p = (prev as MapLike<T>)[uuid];
      if (p === undefined) {
        added?.(uuid, n as T);
        continue;
      }

      if (p === n) {
        continue;
      }

      changed?.(uuid, p as T, n as T);
    }

    prev = nxt as MapLike<T>;
  });
}
