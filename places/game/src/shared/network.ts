import type { GameReplicationPayload } from './game/replication';

declare module '@common/shared' {
  interface ClientToServerEvents {}

  interface ServerToClientEvents {
    game: {
      sync: (payload: GameReplicationPayload) => void;
    };
  }

  interface ClientToServerFunctions {
    requestGameHydration: () => void;
  }

  interface ServerToClientFunctions {}
}
