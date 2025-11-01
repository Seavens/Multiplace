import type { OnStart } from '@flamework/core';
import { Controller } from '@flamework/core';
import CharmSync from '@rbxts/charm-sync';
import { Events, Functions } from 'client/network';
import { Selectors } from 'shared';

@Controller()
export class SyncController implements OnStart {
  private syncer = CharmSync.client({ atoms: Selectors });
  public onStart() {
    Events.sync.connect((payload) => {
      this.syncer.sync(payload);
    });
    Functions.requestHydration.invoke();
  }
}
