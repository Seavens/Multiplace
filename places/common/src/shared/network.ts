import { Networking } from '@flamework/networking';
import type { CommonPayload } from './sync/types';

export interface ClientToServerEvents {}

export interface ServerToClientEvents {
  common: {
    sync: (payload: CommonPayload) => void;
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
