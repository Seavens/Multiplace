import { DataManager, GameClock } from '@common/shared';
import type { OnStart } from '@flamework/core';
import { Service } from '@flamework/core';
import { GameManager } from '@game/shared';
import { Players } from '@rbxts/services';

const COIN_REWARD = 10;
const REWARD_INTERVAL = 5;

@Service({})
export class GameStateService implements OnStart {
  private rewardElapsed = 0;

  public onStart(): void {
    GameClock.on((dt) => {
      GameManager.updateState((state) => {
        state.time += dt;
      });

      this.rewardElapsed += dt;
      if (this.rewardElapsed < REWARD_INTERVAL) {
        return;
      }

      this.rewardElapsed -= REWARD_INTERVAL;
      this.awardCoins();
    });
  }

  private awardCoins(): void {
    for (const player of Players.GetPlayers()) {
      if (DataManager.getDataEntry(player.UserId) === undefined) {
        continue;
      }
      DataManager.updateData(player.UserId, (data) => {
        data.profile.coins += COIN_REWARD;
      });
    }
  }
}
