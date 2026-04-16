import type { DataStoreService } from '@common/server/data';
import { Clock } from '@common/shared';
import type { OnStart } from '@flamework/core';
import { Service } from '@flamework/core';
import { LobbyManager } from '@lobby/shared';
import { Players, TeleportService } from '@rbxts/services';

// TODO: replace with your game place ID before shipping.
const GAME_PLACE_ID = 0;

const LOBBY_COUNTDOWN = 15;

@Service({})
export class LobbyStateService implements OnStart {
  private readonly clock = new Clock(1);

  public constructor(private readonly dataStoreService: DataStoreService) {}

  public onStart(): void {
    this.clock.on(() => this.tick());
  }

  private tick(): void {
    let shouldTeleport = false;

    LobbyManager.updateState((state) => {
      const players = Players.GetPlayers().size();
      state.players = players;

      // Stay in 'teleporting' until all players have left, then reset.
      if (state.phase === 'teleporting') {
        if (players === 0) {
          state.countdown = LOBBY_COUNTDOWN;
          state.phase = 'waiting';
        }
        return;
      }

      if (players === 0) {
        state.countdown = LOBBY_COUNTDOWN;
        state.phase = 'waiting';
        return;
      }

      if (state.countdown <= 1) {
        state.countdown = LOBBY_COUNTDOWN;
        state.phase = 'teleporting';
        shouldTeleport = true;
        return;
      }

      state.countdown -= 1;
      state.phase = 'countdown';
    });

    if (shouldTeleport) {
      this.teleportPlayers();
    }
  }

  private teleportPlayers(): void {
    const players = Players.GetPlayers();
    if (players.size() === 0) {
      return;
    }

    // Flush session time into the Lapis buffer before the destination server
    // can steal the session lock, reducing the teleport data-loss window.
    for (const player of players) {
      this.dataStoreService.preflushPlayer(player);
    }

    const [ok, err] = pcall(() => TeleportService.TeleportAsync(GAME_PLACE_ID, players));
    if (!ok) {
      warn(`[LobbyStateService] teleport failed: ${tostring(err)}`);
    }
  }
}
