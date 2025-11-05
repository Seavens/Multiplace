import type { GamePayload } from './sync/types';

declare module '@common/shared/network' {
  interface ClientToServerEvents {}

  interface ServerToClientEvents {
    game: {
      sync: (payload: GamePayload) => void; // Game specific
    };
  }

  interface ClientToServerFunctions {}

  interface ServerToClientFunctions {}
}
