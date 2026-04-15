import { t } from '@rbxts/t';

// Use t.interface (non-strict) so old documents with extra or missing fields don't
// fail validation. Migrations run before validation and fill in any missing fields.
export const IS_PROFILE_DATA = t.interface({
  coins: t.number,
});

export const IS_PLAYER_DATA = t.interface({
  lastLogin: t.number,
  totalPlayTime: t.number,
});

export const IS_DATA = t.interface({
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
  totalPlayTime: 0,
};

export const DEFAULT_DATA: Data = {
  profile: DEFAULT_PROFILE_DATA,
  player: DEFAULT_PLAYER_DATA,
};
