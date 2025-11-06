import { Controller, OnStart } from '@flamework/core';
import { GameSelectors } from '@game/shared';
import CharmSync from '@rbxts/charm-sync';
import { Events, Functions } from '../network';

@Controller({})
export class GameSyncController implements OnStart {
  private readonly syncer = CharmSync.client({ atoms: GameSelectors });

  public onStart(): void {
    Events.game.sync.connect((payload) => this.syncer.sync(payload));
    Functions.requestHydration();
  }
}
