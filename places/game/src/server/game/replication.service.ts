import { Clock } from '@common/shared';
import type { OnStart } from '@flamework/core';
import { Service } from '@flamework/core';
import { GameManager, GameReplica } from '@game/shared';
import { Players } from '@rbxts/services';

import { Events, Functions } from '../network';

const SYNC_INTERVAL = 1 / 10;

@Service({})
export class GameReplicationService implements OnStart {
  private readonly replica = new GameReplica(GameManager.getState());
  private readonly clock = new Clock(SYNC_INTERVAL);

  public onStart(): void {
    Functions.requestGameHydration.setCallback((player: Player) => this.sendSnapshot(player));
    this.clock.on(() => this.flushDelta());
  }

  private flushDelta(): void {
    const payload = this.replica.update(GameManager.getState());
    if (!payload) {
      return;
    }

    for (const player of Players.GetPlayers()) {
      Events.game.sync(player, payload);
    }
  }

  private sendSnapshot(player: Player): void {
    Events.game.sync(player, this.replica.snapshot(GameManager.getState()));
  }
}
