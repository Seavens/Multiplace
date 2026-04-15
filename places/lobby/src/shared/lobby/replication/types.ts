import type { LobbyState } from '../types';

export interface LobbyReplicationPayload {
  readonly state: LobbyState;
}
