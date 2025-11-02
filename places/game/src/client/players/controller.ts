import type { OnStart } from '@flamework/core';
import { Controller } from '@flamework/core';
import { Players } from '@rbxts/services';

@Controller()
export class PlayerController implements OnStart {
  public onStart(): void {
    print(`PlayerController: Player ${Players.LocalPlayer.Name} has started`);
  }
}
