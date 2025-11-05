import { computed } from '@rbxts/charm';
import { produce } from '@rbxts/immut';
import { GameState, gameAtom } from './types';

export class GameManager {
  public static getState(): GameState {
    return gameAtom();
  }

  public static selectState(): () => GameState {
    return computed(() => gameAtom());
  }

  public static updateState(mutator: (state: GameState) => void): void {
    gameAtom((state: GameState): GameState => {
      const nxt = produce(state, (draft: GameState) => {
        mutator(draft);
      });
      return nxt;
    });
  }
}
