import { RunService } from '@rbxts/services';

export const USE_MOCK_DATA = RunService.IsStudio();
export const COLLECTION_NAME = USE_MOCK_DATA ? 'MockData' : 'PlayerData';
export const DOCUMENT_PREFIX = USE_MOCK_DATA ? 'Mock:' : 'Player:';
