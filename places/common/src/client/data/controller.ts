import { Controller, OnStart } from '@flamework/core';
import { dataAtom } from '../../shared/data/atom';
import { Data } from '../../shared/data/types';
import { watchMap } from '../../shared/sync/watch';

@Controller({})
export class DataController implements OnStart {
  public onStart(): void {
    watchMap(dataAtom, {
      added: (userId: string, data: Data) => {
        print(`[DataController]: User ${userId} data added`, data);
      },
      changed: (userId: string, _prev: Data, cur: Data) => {
        print(`[DataController]: User ${userId} data changed`, cur);
      },
      removed: (userId: string, data: Data) => {
        print(`[DataController]: User ${userId} data removed`, data);
      },
    });
  }
}
