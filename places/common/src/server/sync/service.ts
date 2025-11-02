import type { OnStart } from '@flamework/core';
import { Service } from '@flamework/core';
import CharmSync from '@rbxts/charm-sync';
import { Players } from '@rbxts/services';
import { Selectors } from '../../shared';
import { Events, Functions } from '../network';

@Service({})
export class SyncService implements OnStart {
  public onStart(): void {
    const syncer = CharmSync.server({
      atoms: Selectors,
      interval: 0.1,
      preserveHistory: false,
      autoSerialize: true,
    });
    syncer.connect((plr, payload) => Events.sync(plr, payload));
    Players.PlayerAdded.Connect((plr: Player) => syncer.hydrate(plr));
    for (const player of Players.GetPlayers()) {
      syncer.hydrate(player);
    }
    Functions.requestHydration.setCallback((plr: Player) => syncer.hydrate(plr));
  }
}
