import type { OnStart } from '@flamework/core';
import { Controller } from '@flamework/core';
import { GameManager } from '@game/shared';
import { computed, effect } from '@rbxts/charm';

@Controller({})
export class GameController implements OnStart {
  public onStart(): void {
    // Only re-run on whole-second boundaries, not every replicated frame
    const elapsed = computed(() => math.floor(GameManager.getState().time));
    effect(() => {
      print(`[GameController] elapsed ${elapsed()}s`);
    });
  }
}
