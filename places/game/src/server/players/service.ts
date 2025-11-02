import type { OnStart } from '@flamework/core';
import { Service } from '@flamework/core';
import { Players } from '@rbxts/services';

@Service()
export class PlayerService implements OnStart {
  public onStart(): void {
    Players.PlayerAdded.Connect((player: Player) => {
      warn(`PlayerService: Player ${player.Name} has joined the game`);
    });
  }
}
