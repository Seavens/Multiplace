import type { LobbyReplicationPayload } from './lobby/replication';

declare module '@common/shared' {
  interface ClientToServerEvents {}

  interface ServerToClientEvents {
    lobby: {
      sync: (payload: LobbyReplicationPayload) => void;
    };
  }

  interface ClientToServerFunctions {
    requestLobbyHydration: () => void;
  }

  interface ServerToClientFunctions {}
}
