import type { SyncPayload } from '@rbxts/charm-sync';
import { dataAtom } from 'shared/data/atom';

export const Selectors = {
  data: dataAtom,
};
export type CharmPayload = SyncPayload<typeof Selectors>;
