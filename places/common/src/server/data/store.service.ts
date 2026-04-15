import type { Data } from '@common/shared';
import { DataManager, DEFAULT_DATA, IS_DATA, normalizeData } from '@common/shared';
import type { OnStart } from '@flamework/core';
import { Service } from '@flamework/core';
import { effect } from '@rbxts/charm';
import type { Document } from '@rbxts/lapis';
import { createCollection } from '@rbxts/lapis';

import type { PlayerStateService } from '../players';
import { COLLECTION_NAME, DOCUMENT_PREFIX, USE_MOCK_DATA } from './constants';

type Unsubscribe = () => void;

@Service({})
export class DataStoreService implements OnStart {
  private readonly collection = createCollection(COLLECTION_NAME, {
    defaultData: DEFAULT_DATA,
    validate: IS_DATA,
    // Add a new entry here each time the Data schema changes.
    // Each function upgrades one version: index 0 = v0→v1, index 1 = v1→v2, etc.
    // Lapis runs pending migrations in order before validation, then saves the version.
    // Example — adding a new field:
    //   (data) => ({ ...data, profile: { ...(data as { profile: object }).profile, gems: 0 } }),
    migrations: [
      // Each entry upgrades one schema version. Add new entries here when the Data
      // type changes — never edit existing ones. The last migration must return Data.
      //
      // normalizeData fills every field with its default when missing, so it works
      // as a universal "add new fields" migration. If you need to transform existing
      // values (e.g. rename a field), do that in a preceding Migration<unknown> entry.
      //
      // v0 → v1: added player.totalPlayTime
      (data): Data => normalizeData(data as Partial<Data>),
    ],
  });

  private readonly docs = new Map<number, Document<Data>>();
  private readonly subs = new Map<number, Unsubscribe>();
  private readonly sessionStarts = new Map<number, number>();

  public constructor(private readonly playerStateService: PlayerStateService) {}

  public onStart(): void {
    this.playerStateService.onPlayerAdded((player) => this.loadPlayer(player));
    this.playerStateService.onPlayerRemoving((player) => this.unloadPlayer(player));
  }

  private async loadPlayer(player: Player): Promise<void> {
    const id = player.UserId;

    if (USE_MOCK_DATA) {
      DataManager.setData(id, DEFAULT_DATA);
      DataManager.updateData(id, (data) => {
        data.player.lastLogin = os.time();
      });
      this.sessionStarts.set(id, os.time());
      this.playerStateService.markPlayerLoaded(player);
      return;
    }

    const key = `${DOCUMENT_PREFIX}${id}`;

    try {
      const doc = await this.collection.load(key, [id]);
      if (!this.playerStateService.getPlayerByUserId(id)) {
        await doc
          .close()
          .catch((e) => warn(`[DataStoreService]: close on early-exit failed for ${id}: ${e}`));
        return;
      }

      const initial = doc.read();
      const isNewPlayer = initial.player.lastLogin === 0;

      DataManager.setData(id, initial);
      DataManager.updateData(id, (data) => {
        data.player.lastLogin = os.time();
      });

      if (isNewPlayer) {
        print(`[DataStoreService] ${player.Name} is a new player`);
        // Hook: grant starter pack, trigger tutorial, award first-login bonus, etc.
      }

      this.sessionStarts.set(id, os.time());

      const unsubscribe = effect(() => {
        const current = DataManager.getData(id);
        doc.write(current);
      });

      this.subs.set(id, unsubscribe);
      this.docs.set(id, doc);
    } catch (err) {
      warn(`[DataStoreService]: failed to load data for ${player.Name} (${id}): ${err}`);
      DataManager.setData(id, DEFAULT_DATA);
    }

    this.playerStateService.markPlayerLoaded(player);
  }

  private async unloadPlayer(player: Player): Promise<void> {
    const id = player.UserId;

    // Stamp total play time before any write so the final save includes this session.
    const sessionStart = this.sessionStarts.get(id);
    this.sessionStarts.delete(id);
    if (sessionStart !== undefined) {
      DataManager.updateData(id, (data) => {
        data.player.totalPlayTime += os.time() - sessionStart;
      });
    }

    if (USE_MOCK_DATA) {
      DataManager.deleteData(id);
      return;
    }

    const doc = this.docs.get(id);
    if (doc) {
      // Explicit final write — belt-and-suspenders alongside the Charm effect.
      doc.write(DataManager.getData(id));
    }

    this.subs.get(id)?.();
    this.subs.delete(id);
    DataManager.deleteData(id);

    if (!doc) {
      return;
    }

    await doc.close().catch((e) => warn(`[DataStoreService]: close failed for ${id}: ${e}`));
    this.docs.delete(id);
  }
}
