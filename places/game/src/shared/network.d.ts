import type { GamePayload } from './sync/types';

declare module '@common/shared/network' {
  interface ClientToServerEvents {
    game: {};
  }

  interface ServerToClientEvents {
    game: {
      sync: (payload: GamePayload) => void;
    };
  }

  interface ClientToServerFunctions {
    game: {
      requestHydration: () => void;
    };
  }

  interface ServerToClientFunctions {
    game: {};
  }
}
