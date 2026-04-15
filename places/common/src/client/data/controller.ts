import { DataManager, DataReplica, normalizeData, parseDataUserId } from '@common/shared';
import type { OnStart } from '@flamework/core';
import { Controller } from '@flamework/core';
import Squash from '@rbxts/squash';

import { Events, Functions } from '../network';

const serdesCount = Squash.vlq();

@Controller({})
export class DataController implements OnStart {
  public onStart(): void {
    Events.core.dataDelta.connect((payload) => this.onDataDelta(payload));
    void Functions.requestHydration.invoke();
  }

  private onDataDelta(payload: buffer): void {
    const [ok, err] = pcall(() => {
      const cursor = Squash.frombuffer(payload);
      const count = serdesCount.des(cursor);

      for (let i = 0; i < count; i++) {
        const delta = DataReplica.deserialize(cursor);
        const userId = parseDataUserId(delta.key);
        if (userId === undefined) {
          continue;
        }

        if (delta.cleanup) {
          DataManager.deleteData(userId);
          continue;
        }

        if (delta.data !== undefined) {
          DataManager.setData(userId, normalizeData(delta.data));
        }
      }
    });

    if (!ok) {
      warn(`[DataController] failed to deserialize delta: ${tostring(err)}`);
    }
  }
}
