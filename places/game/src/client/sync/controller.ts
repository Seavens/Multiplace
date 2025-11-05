import { Events, Functions } from '@common/client/network';
import { Controller, OnStart } from '@flamework/core';
import CharmSync from '@rbxts/charm-sync';
import { GameSelectors } from '../../shared/sync/types';

@Controller({})
export class GameSyncController implements OnStart {
  private readonly syncer = CharmSync.client({ atoms: GameSelectors });

  public onStart(): void {
    Events.game.sync.connect((payload) => this.syncer.sync(payload));
    Functions.game.requestHydration();
  }
}
