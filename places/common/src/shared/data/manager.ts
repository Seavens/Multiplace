import { computed } from '@rbxts/charm';
import { produce } from '@rbxts/immut';

import { dataAtom } from './atom';
import { DEFAULT_DATA_TEMPLATE } from './constants';
import type { Data } from './types';

function buildKey(id: number): string {
  return `Player:${id}`;
}

export class DataManager {
  public static getData(id: number): Data {
    const key = buildKey(id);
    return dataAtom()[key] ?? DEFAULT_DATA_TEMPLATE;
  }

  public static setData(id: number, data: Data): void {
    const key = buildKey(id);
    produce(dataAtom(), (draft): void => {
      draft[key] = data;
    });
  }

  public static selectData(id: number): () => Data {
    const key = buildKey(id);
    return computed(() => dataAtom()[key] ?? DEFAULT_DATA_TEMPLATE);
  }

  public static deleteData(id: number): void {
    const key = buildKey(id);
    produce(dataAtom(), (draft): void => {
      delete draft[key];
    });
  }

  public static updateData(id: number, mutator: (data: Data) => void): void {
    const key = buildKey(id);
    produce(dataAtom(), (draft): void => {
      const data = draft[key] ?? DEFAULT_DATA_TEMPLATE;
      mutator(data);
      draft[key] = data;
    });
  }
}
