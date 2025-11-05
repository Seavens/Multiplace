import { SyncPayload } from '@rbxts/charm-sync';
import { gameAtom } from '../game/types';

export const GameSelectors = {
  game: gameAtom,
};

export type GamePayload = SyncPayload<typeof GameSelectors>;
