import { DataManager } from '@common/shared';
import { OnTick, Service } from '@flamework/core';
import { GameManager } from '@game/shared';
import { Players } from '@rbxts/services';

const COIN_REWARD = 10;
const REWARD_INTERVAL = 5;

@Service({})
export class GameService implements OnTick {
  private elapsed = 0;

  public onTick(dt: number): void {
    GameManager.updateState((state) => {
      state.time += dt;
    });

    this.elapsed += dt;
    if (this.elapsed < REWARD_INTERVAL) {
      return;
    }

    this.elapsed -= REWARD_INTERVAL;
    for (const player of Players.GetPlayers()) {
      DataManager.updateData(player.UserId, (data) => {
        data.profile.coins += COIN_REWARD;
      });
    }
  }
}
