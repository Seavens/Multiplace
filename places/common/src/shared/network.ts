import { Networking } from '@flamework/networking';

import type { CharmPayload } from './sync';

interface ClientToServerEvents {}

interface ServerToClientEvents {
  sync: (p: CharmPayload) => void;
}

interface ClientToServerFunctions {
  requestHydration: () => void;
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<
  ClientToServerFunctions,
  ServerToClientFunctions
>();
