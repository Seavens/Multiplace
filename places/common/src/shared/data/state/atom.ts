import { atom } from '@rbxts/charm';

import type { Data } from '../types';

export interface DataState {
  readonly [user: string]: Data | undefined;
}

export const dataAtom = atom<DataState>({});
