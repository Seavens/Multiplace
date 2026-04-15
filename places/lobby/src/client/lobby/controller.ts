import type { OnStart } from '@flamework/core';
import { Controller } from '@flamework/core';
import type { LobbyPhase } from '@lobby/shared';
import { LobbyManager } from '@lobby/shared';
import { computed, effect, peek } from '@rbxts/charm';

@Controller({})
export class LobbyController implements OnStart {
  public onStart(): void {
    // Only re-run when the lobby phase changes.
    const phase = computed(() => LobbyManager.getState().phase);
    effect(() => {
      const countdown = peek(() => LobbyManager.getState().countdown);
      print(`[LobbyController] ${this.formatStatus(phase(), countdown)}`);
    });
  }

  private formatStatus(phase: LobbyPhase, countdown: number): string {
    if (phase === 'waiting') {
      return 'Waiting for players';
    }

    if (phase === 'countdown') {
      return `Teleporting in ${countdown}s`;
    }

    return 'Teleporting players to the game place';
  }
}
