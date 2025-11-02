import type { OnStart } from '@flamework/core';
import { Controller } from '@flamework/core';
import { Data } from '../../shared';
import { dataAtom, watchMap } from '../../shared';

@Controller({})
export class DataController implements OnStart {
  public onStart(): void {
    watchMap(dataAtom, {
      added: (userId: string, data: Data) => {
        warn(`DataController: User ${userId} data added`, data);
      },
      changed: (userId: string, data: Data) => {
        warn(`DataController: User ${userId} data changed`, data);
      },
      removed: (userId: string, data: Data) => {
        warn(`DataController: User ${userId} data removed`, data);
      },
    });
  }
}
