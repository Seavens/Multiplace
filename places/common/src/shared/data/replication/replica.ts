import { HttpService } from '@rbxts/services';
import type { Cursor } from '@rbxts/squash';
import Squash from '@rbxts/squash';

import type { Data } from '../types';
import type { DataReplicationDelta } from './types';
import { DataFlags } from './types';

const serdesKey = Squash.string();
const serdesFlags = Squash.uint(2);
const serdesPayload = Squash.opt(Squash.string());

export class DataReplica {
  private lastSerialized?: string;
  private initialized = false;

  public constructor(
    public readonly key: string,
    initial: Data,
  ) {
    this.lastSerialized = this.stringify(initial);
  }

  public update(data: Data): DataReplicationDelta | undefined {
    const serialized = this.stringify(data);
    if (this.initialized && serialized === this.lastSerialized) {
      return undefined;
    }

    this.lastSerialized = serialized;

    const flags = (
      this.initialized ? DataFlags.Data : DataFlags.Data | DataFlags.Spawn
    ) as DataFlags;

    this.initialized = true;

    return {
      key: this.key,
      flags,
      data,
      spawn: (flags & DataFlags.Spawn) !== 0,
    };
  }

  public snapshotDelta(data: Data): DataReplicationDelta {
    this.lastSerialized = this.stringify(data);

    return {
      key: this.key,
      flags: DataFlags.Data | DataFlags.Spawn,
      data,
      spawn: true,
    };
  }

  public cleanup(): DataReplicationDelta {
    this.lastSerialized = undefined;
    this.initialized = false;

    return {
      key: this.key,
      flags: DataFlags.Cleanup,
      cleanup: true,
    };
  }

  public prime(): void {
    this.initialized = true;
  }

  public static serialize(cursor: Cursor, delta: DataReplicationDelta): void {
    serdesPayload.ser(cursor, delta.data ? HttpService.JSONEncode(delta.data) : undefined);
    serdesFlags.ser(cursor, delta.flags);
    serdesKey.ser(cursor, delta.key);
  }

  public static deserialize(cursor: Cursor): DataReplicationDelta {
    const key = serdesKey.des(cursor) as string;
    const flags = serdesFlags.des(cursor) as DataFlags;
    const payload = serdesPayload.des(cursor) as string | undefined;

    return {
      key,
      flags,
      data: payload !== undefined ? (HttpService.JSONDecode(payload) as Data) : undefined,
      spawn: (flags & DataFlags.Spawn) !== 0,
      cleanup: (flags & DataFlags.Cleanup) !== 0,
    };
  }

  private stringify(data: Data): string {
    return HttpService.JSONEncode(data);
  }
}
