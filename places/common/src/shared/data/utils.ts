import type { Data } from './types';
import { DEFAULT_DATA } from './types';

const PLAYER_KEY_PREFIX = 'Player';

export function createDefaultData(): Data {
  return {
    profile: { ...DEFAULT_DATA.profile },
    player: { ...DEFAULT_DATA.player },
  };
}

export function normalizeData(data: Partial<Data> | undefined): Data {
  return {
    profile: {
      ...DEFAULT_DATA.profile,
      ...data?.profile,
    },
    player: {
      ...DEFAULT_DATA.player,
      ...data?.player,
    },
  };
}

export function buildDataKey(id: number): string {
  return `${PLAYER_KEY_PREFIX}:${id}`;
}

export function parseDataUserId(key: string): number | undefined {
  const parts = string.split(key, ':');
  if (parts.size() !== 2 || parts[0] !== PLAYER_KEY_PREFIX) {
    return undefined;
  }

  return tonumber(parts[1]);
}
