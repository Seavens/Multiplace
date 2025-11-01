import type { OnStart } from '@flamework/core';
import { Controller } from '@flamework/core';

@Controller()
export class GameController implements OnStart {
  public onStart(): void {
    warn('GameController started');
  }
}
