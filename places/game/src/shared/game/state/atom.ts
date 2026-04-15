import { atom } from '@rbxts/charm';

import type { GameState } from '../types';

export const gameAtom = atom<GameState>({
  time: 0,
});
