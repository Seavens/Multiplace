import { atom } from '@rbxts/charm';

export interface GameState {
  time: number;
}

export const gameAtom = atom<GameState>({
  time: 0,
});
