import type { OnStart } from '@flamework/core';
import { Service } from '@flamework/core';

@Service()
export class GameService implements OnStart {
  public onStart(): void {
    warn('Game Service started');
  }
}
