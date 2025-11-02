import { computed } from '@rbxts/charm';
import { produce } from '@rbxts/immut';

import { dataAtom } from './atom';
import { DEFAULT_DATA, type Data } from './types';

function buildKey(id: number): string {
  return `Player:${id}`;
}

function cloneDefaults(): Data {
  return {
    profile: { ...DEFAULT_DATA.profile },
    player: { ...DEFAULT_DATA.player },
  };
}

export class DataManager {
  public static getData(id: number): Data {
    const key = buildKey(id);
    return dataAtom()[key] ?? DEFAULT_DATA;
  }

  public static setData(id: number, data: Data): void {
    const key = buildKey(id);
    dataAtom((prev) =>
      produce(prev, (draft): void => {
        draft[key] = data;
      }),
    );
  }

  public static selectData(id: number): () => Data {
    const key = buildKey(id);
    return computed(() => dataAtom()[key] ?? DEFAULT_DATA);
  }

  public static deleteData(id: number): void {
    const key = buildKey(id);
    dataAtom((prev) =>
      produce(prev, (draft): void => {
        delete draft[key];
      }),
    );
  }

  public static updateData(id: number, mutator: (data: Data) => Data | void): void {
    const key = buildKey(id);
    dataAtom((prev) =>
      produce(prev, (draft): void => {
        const current = draft[key] as Data | undefined;
        const base: Data = current ?? cloneDefaults();
        const nxt = mutator(base);
        draft[key] = (nxt ?? base) as Data;
      }),
    );
  }
}
