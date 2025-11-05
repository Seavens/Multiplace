import { OnStart, Service } from '@flamework/core';
import { effect } from '@rbxts/charm';
import { createCollection, Document } from '@rbxts/lapis';
import { Players } from '@rbxts/services';
import { DataManager } from '../../shared/data/manager';
import { Data, DEFAULT_DATA, IS_DATA } from '../../shared/data/types';

const USE_MOCK_DATA = true;
const COLLECTION_NAME = 'PlayerData';
const DOCUMENT_PREFIX = 'Player:';

type Unsubscribe = () => void;

@Service({})
export class DataService implements OnStart {
  public static readonly collection = createCollection(COLLECTION_NAME, {
    defaultData: DEFAULT_DATA,
    validate: IS_DATA,
  });

  private static readonly docs = new Map<number, Document<Data>>();
  private static readonly subs = new Map<number, Unsubscribe>();

  public async onStart(): Promise<void> {
    // Load any players already in the server
    await Promise.allSettled(Players.GetPlayers().map((p) => this.loadPlayer(p)));

    // Handle joins and leaves
    Players.PlayerAdded.Connect((p) => this.loadPlayer(p));
    Players.PlayerRemoving.Connect((p) => this.unloadPlayer(p));
  }

  private async loadPlayer(player: Player): Promise<void> {
    const id = player.UserId;
    const key = `${DOCUMENT_PREFIX}${id}`;

    if (USE_MOCK_DATA) {
      // Ignore errors if it does not exist
      await DataService.collection.remove(key).catch(() => undefined);
    }

    try {
      const doc = await DataService.collection.load(key, [id]);
      const initial = doc.read();

      // Sync DataManager -> Lapis on change
      const unsubscribe = effect(() => {
        const current = DataManager.getData(id);
        doc.write(current);
      });

      DataManager.setData(id, initial);
      DataService.subs.set(id, unsubscribe);
      DataService.docs.set(id, doc);
    } catch (err) {
      warn(`[DataService]: failed to load data for ${player.Name} (${id}): ${err}`);
      DataManager.setData(id, DEFAULT_DATA);
    }
  }

  private async unloadPlayer(player: Player): Promise<void> {
    const id = player.UserId;

    // Stop reactive writer first
    DataService.subs.get(id)?.();
    DataService.subs.delete(id);

    // Close and forget document
    const doc = DataService.docs.get(id);
    DataManager.deleteData(id);

    if (!doc) {
      return;
    }

    await doc.close().catch((e) => warn(`[DataService]: close failed for ${id}: ${e}`));
    DataService.docs.delete(id);
  }
}
