export type LobbyPhase = 'waiting' | 'countdown' | 'teleporting';

export interface LobbyState {
  countdown: number;
  players: number;
  phase: LobbyPhase;
}
