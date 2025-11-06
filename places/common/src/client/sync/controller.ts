import { CommonPayload, CommonSelectors } from '@common/shared';
import { Controller, OnStart } from '@flamework/core';
import CharmSync from '@rbxts/charm-sync';
import { Events, Functions } from '../network';

@Controller()
export class CommonSyncController implements OnStart {
  private readonly syncer = CharmSync.client({ atoms: CommonSelectors });
  public onStart(): void {
    Events.common.sync.connect((payload: CommonPayload) => {
      this.syncer.sync(payload);
    });
    Functions.requestHydration.invoke();
  }
}
