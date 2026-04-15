import { buildDataKey, dataAtom } from '@common/shared';
import type { OnStart } from '@flamework/core';
import { Controller } from '@flamework/core';
import { computed, effect } from '@rbxts/charm';
import { Players } from '@rbxts/services';

/**
 * Demonstrates client-side data replication.
 * Prints the local player's data whenever it is hydrated or updated by the server.
 */
@Controller({})
export class DataTestController implements OnStart {
  public onStart(): void {
    const key = buildDataKey(Players.LocalPlayer.UserId);
    const selectData = computed(() => dataAtom()[key]);

    effect(() => {
      const data = selectData();
      if (data === undefined) {
        return;
      }

      print(`[DataTestController] coins=${data.profile.coins} lastLogin=${data.player.lastLogin}`);
    });
  }
}
