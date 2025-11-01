import { t } from "@rbxts/t";

export const IS_PROFILE_DATA = t.strictInterface({
	coins: t.number,
	gems: t.number,
	xp: t.number,
});

export const IS_SETTINGS_DATA = t.strictInterface({
	musicVolume: t.number,
	sfxVolume: t.number,
	autoSkipWave: t.boolean,
});

export const IS_PLAYER_DATA = t.strictInterface({
	lastLogin: t.number,
	totalPlaytime: t.number,
});

export const IS_DATA = t.strictInterface({
	profile: IS_PROFILE_DATA,
	settings: IS_SETTINGS_DATA,
	player: IS_PLAYER_DATA,
});

export type ProfileData = t.static<typeof IS_PROFILE_DATA>;
export type SettingsData = t.static<typeof IS_SETTINGS_DATA>;
export type PlayerData = t.static<typeof IS_PLAYER_DATA>;
export type Data = t.static<typeof IS_DATA>;

export const DEFAULT_PROFILE_DATA: ProfileData = {
	coins: 100,
	gems: 100,
	xp: 100,
};

export const DEFAULT_SETTINGS_DATA: SettingsData = {
	musicVolume: 1,
	sfxVolume: 1,
	autoSkipWave: false,
};

export const DEFAULT_PLAYER_DATA: PlayerData = {
	lastLogin: 0,
	totalPlaytime: 0,
};

export const DEFAULT_DATA: Data = {
	profile: DEFAULT_PROFILE_DATA,
	settings: DEFAULT_SETTINGS_DATA,
	player: DEFAULT_PLAYER_DATA,
};
