import { Networking } from '@flamework/networking';

import type { DataReplicationPayload } from './data/replication';

export interface ClientToServerEvents {}

export interface ServerToClientEvents {
  core: {
    dataDelta: (payload: DataReplicationPayload) => void;
  };
}

export interface ClientToServerFunctions {
  requestHydration: () => void;
}

export interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<
  ClientToServerFunctions,
  ServerToClientFunctions
>();
