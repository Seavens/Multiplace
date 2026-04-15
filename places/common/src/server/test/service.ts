import { DataManager } from '@common/shared';
import type { OnStart } from '@flamework/core';
import { Service } from '@flamework/core';

import type { PlayerStateService } from '../players';

/**
 * Demonstrates the server-side data system.
 * Prints each player's loaded data so you can confirm DataStore is wiring up correctly.
 */
@Service({})
export class DataTestService implements OnStart {
  public constructor(private readonly playerStateService: PlayerStateService) {}

  public onStart(): void {
    this.playerStateService.onPlayerLoaded((player) => {
      const data = DataManager.getData(player.UserId);
      print(`[DataTestService] ${player.Name} loaded — coins=${data.profile.coins}`);
    });
  }
}
