import { SyncPayload } from '@rbxts/charm-sync';
import { dataAtom } from '../data/atom';

export const CommonSelectors = {
  data: dataAtom,
};

export type CommonPayload = SyncPayload<typeof CommonSelectors>;
