import { t } from '@rbxts/t';

export const IS_PROFILE_DATA = t.strictInterface({
  coins: t.number,
});

export const IS_PLAYER_DATA = t.strictInterface({
  lastLogin: t.number,
});

export const IS_DATA = t.strictInterface({
  profile: IS_PROFILE_DATA,
  player: IS_PLAYER_DATA,
});

export type ProfileData = t.static<typeof IS_PROFILE_DATA>;
export type PlayerData = t.static<typeof IS_PLAYER_DATA>;
export type Data = t.static<typeof IS_DATA>;

export const DEFAULT_PROFILE_DATA: ProfileData = {
  coins: 100,
};

export const DEFAULT_PLAYER_DATA: PlayerData = {
  lastLogin: 0,
};

export const DEFAULT_DATA: Data = {
  profile: DEFAULT_PROFILE_DATA,
  player: DEFAULT_PLAYER_DATA,
};
