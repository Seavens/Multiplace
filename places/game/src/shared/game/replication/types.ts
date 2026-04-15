import type { GameState } from '../types';

export interface GameReplicationPayload {
  readonly state: GameState;
}
