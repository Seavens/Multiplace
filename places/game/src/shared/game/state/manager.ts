import { computed } from '@rbxts/charm';
import { produce } from '@rbxts/immut';

import type { GameState } from '../types';
import { gameAtom } from './atom';

export class GameManager {
  public static getState(): GameState {
    return gameAtom();
  }

  public static setState(state: GameState): void {
    gameAtom(state);
  }

  public static selectState(): () => GameState {
    return computed(() => gameAtom());
  }

  public static updateState(mutator: (state: GameState) => void): void {
    gameAtom((state: GameState): GameState => {
      return produce(state, (draft: GameState) => {
        mutator(draft);
      });
    });
  }
}
