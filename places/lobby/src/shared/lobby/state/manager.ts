import { computed } from '@rbxts/charm';
import { produce } from '@rbxts/immut';

import type { LobbyState } from '../types';
import { lobbyAtom } from './atom';

export class LobbyManager {
  public static getState(): LobbyState {
    return lobbyAtom();
  }

  public static setState(state: LobbyState): void {
    lobbyAtom(state);
  }

  public static selectState(): () => LobbyState {
    return computed(() => lobbyAtom());
  }

  public static updateState(mutator: (state: LobbyState) => void): void {
    lobbyAtom((state: LobbyState): LobbyState => {
      return produce(state, (draft: LobbyState) => {
        mutator(draft);
      });
    });
  }
}
