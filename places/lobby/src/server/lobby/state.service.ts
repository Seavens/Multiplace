import { GameClock } from '@common/shared';
import type { OnStart } from '@flamework/core';
import { Service } from '@flamework/core';
import { LobbyManager } from '@lobby/shared';
import { Players } from '@rbxts/services';

const LOBBY_COUNTDOWN = 15;

@Service({})
export class LobbyStateService implements OnStart {
  private elapsed = 0;

  public onStart(): void {
    GameClock.on((dt) => {
      this.elapsed += dt;
      if (this.elapsed < 1) {
        return;
      }

      this.elapsed -= 1;
      this.tick();
    });
  }

  private tick(): void {
    LobbyManager.updateState((state) => {
      const players = Players.GetPlayers().size();
      state.players = players;

      if (players === 0) {
        state.countdown = LOBBY_COUNTDOWN;
        state.phase = 'waiting';
        return;
      }

      if (state.countdown <= 1) {
        state.countdown = LOBBY_COUNTDOWN;
        state.phase = 'teleporting';
        return;
      }

      state.countdown -= 1;
      state.phase = 'countdown';
    });
  }
}
