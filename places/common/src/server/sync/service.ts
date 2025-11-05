import { OnStart, Service } from '@flamework/core';
import CharmSync from '@rbxts/charm-sync';
import { Players } from '@rbxts/services';
import { CommonSelectors } from '../../shared/sync/types';
import { Events, Functions } from '../network';

@Service({})
export class CommonSyncService implements OnStart {
  public onStart(): void {
    const syncer = CharmSync.server({
      atoms: CommonSelectors,
      interval: 0.1,
      preserveHistory: false,
      autoSerialize: true,
    });
    syncer.connect((plr, payload) => Events.common.sync(plr, payload));
    Players.PlayerAdded.Connect((plr: Player) => syncer.hydrate(plr));
    for (const player of Players.GetPlayers()) {
      syncer.hydrate(player);
    }
    Functions.common.requestHydration.setCallback((plr: Player) => syncer.hydrate(plr));
  }
}
