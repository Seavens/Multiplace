import Charm from '@rbxts/charm';

import { iterateRecord } from '../utils';

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
    iterateRecord(prev, (uuid, p) => {
      if ((nxt as MapLike<T>)[uuid] === undefined) {
        removed?.(uuid, p as T);
      }
    });

    iterateRecord(nxt as MapLike<T>, (uuid, n) => {
      const p = prev[uuid];
      if (p === undefined) {
        added?.(uuid, n as T);
      } else if (p !== n) {
        changed?.(uuid, p as T, n as T);
      }
    });

    prev = nxt as MapLike<T>;
  });
}
