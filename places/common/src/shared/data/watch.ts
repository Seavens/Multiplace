import Charm from '@rbxts/charm';
import Object from '@rbxts/object-utils';

type MapLike<T> = Readonly<Record<string, T | undefined>>;
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
    for (const [uuid, p] of Object.entries(prev)) {
      const id = uuid;
      if (nxt[id] === undefined) {
        removed?.(id, p);
      }
    }

    for (const [uuid, n] of Object.entries(nxt)) {
      const id = uuid;
      const p = prev[id];
      if (p === undefined) {
        added?.(id, n);
      } else if (p !== n) {
        changed?.(id, p, n);
      }
    }

    prev = nxt;
  });
}
