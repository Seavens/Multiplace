import { computed } from '@rbxts/charm';
import { produce } from '@rbxts/immut';

import type { Data } from '../types';
import { buildDataKey, createDefaultData, normalizeData } from '../utils';
import { dataAtom } from './atom';

export class DataManager {
  public static getData(id: number): Data {
    const key = buildDataKey(id);
    return normalizeData(dataAtom()[key]);
  }

  public static getDataEntry(id: number): Data | undefined {
    const key = buildDataKey(id);
    return dataAtom()[key];
  }

  public static setData(id: number, data: Data): void {
    const key = buildDataKey(id);
    const normalized = normalizeData(data);

    dataAtom((prev) =>
      produce(prev, (draft): void => {
        draft[key] = normalized;
      }),
    );
  }

  public static selectData(id: number): () => Data {
    return computed(() => DataManager.getData(id));
  }

  public static selectDataEntry(id: number): () => Data | undefined {
    return computed(() => DataManager.getDataEntry(id));
  }

  public static deleteData(id: number): void {
    const key = buildDataKey(id);

    dataAtom((prev) =>
      produce(prev, (draft): void => {
        delete draft[key];
      }),
    );
  }

  public static updateData(id: number, mutator: (data: Data) => Data | void): void {
    const key = buildDataKey(id);

    dataAtom((prev) =>
      produce(prev, (draft): void => {
        const current = draft[key];
        const base = current ? normalizeData(current) : createDefaultData();
        const result = mutator(base);
        draft[key] = normalizeData(result ?? base);
      }),
    );
  }
}
