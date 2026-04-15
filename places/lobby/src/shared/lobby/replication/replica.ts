import { HttpService } from '@rbxts/services';

import type { LobbyState } from '../types';
import type { LobbyReplicationPayload } from './types';

export class LobbyReplica {
  private lastSerialized?: string;

  public constructor(initial?: LobbyState) {
    if (initial !== undefined) {
      this.lastSerialized = this.serialize(initial);
    }
  }

  public update(state: LobbyState): LobbyReplicationPayload | undefined {
    const serialized = this.serialize(state);
    if (serialized === this.lastSerialized) {
      return undefined;
    }

    this.lastSerialized = serialized;
    return {
      state,
    };
  }

  public snapshot(state: LobbyState): LobbyReplicationPayload {
    this.lastSerialized = this.serialize(state);
    return {
      state,
    };
  }

  private serialize(state: LobbyState): string {
    return HttpService.JSONEncode(state);
  }
}
