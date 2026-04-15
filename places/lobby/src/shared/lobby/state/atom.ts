import { atom } from '@rbxts/charm';

import type { LobbyState } from '../types';

export const lobbyAtom = atom<LobbyState>({
  countdown: 15,
  players: 0,
  phase: 'waiting',
});
