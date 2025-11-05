import { Events, Functions } from '@common/server/network';
import { OnStart, Service } from '@flamework/core';
import CharmSync from '@rbxts/charm-sync';
import { Players } from '@rbxts/services';
import { GamePayload, GameSelectors } from '../../shared/sync/types';

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
    Functions.game.requestHydration.setCallback((player: Player) => syncer.hydrate(player));
  }
}
