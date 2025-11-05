import { OnStart, Service } from '@flamework/core';
import { GamePayload, GameSelectors } from '@game/shared/sync/types';
import CharmSync from '@rbxts/charm-sync';
import { Players } from '@rbxts/services';
import { Events, Functions } from '../network';

@Service({})
export class GameSyncService implements OnStart {
  public onStart(): void {
    const syncer = CharmSync.server({
      atoms: GameSelectors,
      interval: 0.1,
      preserveHistory: false,
      autoSerialize: true,
    });
    syncer.connect((player: Player, payload: GamePayload) => Events.game.sync(player, payload));
    Players.PlayerAdded.Connect((player: Player) => syncer.hydrate(player));
    for (const player of Players.GetPlayers()) {
      syncer.hydrate(player);
    }
    Functions.requestHydration.setCallback((player: Player) => syncer.hydrate(player));
  }
}
