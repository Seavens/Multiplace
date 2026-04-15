import type { Data } from '../types';

export interface DataReplicationDelta {
  readonly key: string;
  readonly flags: DataFlags;
  readonly data?: Data;
  readonly spawn?: boolean;
  readonly cleanup?: boolean;
}

export const enum DataFlags {
  None = 0,
  Data = 1 << 0,
  Spawn = 1 << 1,
  Cleanup = 1 << 8,
}

export type DataReplicationPayload = buffer;
