import type { DataReplicationDelta } from '@common/shared';
import {
  buildDataKey,
  Clock,
  dataAtom,
  DataManager,
  DataReplica,
  parseDataUserId,
} from '@common/shared';
import type { OnStart } from '@flamework/core';
import { Service } from '@flamework/core';
import Object from '@rbxts/object-utils';
import { Players } from '@rbxts/services';
import Squash from '@rbxts/squash';

import { Events, Functions } from '../network';
import type { PlayerStateService } from '../players';

const SYNC_INTERVAL = 1 / 10;
const serdesCount = Squash.vlq();

@Service({})
export class DataReplicationService implements OnStart {
  private readonly replicas = new Map<string, DataReplica>();
  private readonly hydratedPlayers = new Set<number>();
  private readonly clock = new Clock(SYNC_INTERVAL);

  public constructor(private readonly playerStateService: PlayerStateService) {}

  public onStart(): void {
    this.playerStateService.onPlayerLoaded((player) => this.sendInitialSnapshot(player));
    this.playerStateService.onPlayerRemoving((player) =>
      this.hydratedPlayers.delete(player.UserId),
    );
    Functions.requestHydration.setCallback((player) => this.sendInitialSnapshot(player));
    this.clock.on(() => this.tick());
  }

  private tick(): void {
    const grouped = this.collectDeltas();

    // Use forEach to avoid Map for-of TS(2802) squiggle (VSCode-only, not a real error)
    grouped.forEach((deltas, userId) => {
      if (deltas.size() === 0) {
        return;
      }

      const player = Players.GetPlayerByUserId(userId);
      if (!player) {
        return;
      }

      Events.core.dataDelta(player, this.encode(deltas));
    });
  }

  private collectDeltas(): Map<number, Array<DataReplicationDelta>> {
    const grouped = new Map<number, Array<DataReplicationDelta>>();
    const current = dataAtom();
    const seen = new Set<string>();

    for (const [key, data] of Object.entries(current)) {
      const recordKey = key as string;
      seen.add(recordKey);

      const userId = parseDataUserId(recordKey);
      if (userId === undefined || !this.playerStateService.isPlayerLoaded(userId)) {
        continue;
      }

      let replica = this.replicas.get(recordKey);
      if (!replica) {
        replica = new DataReplica(recordKey, data);
        this.replicas.set(recordKey, replica);
      }

      const delta = replica.update(data);
      if (delta !== undefined) {
        this.pushDelta(grouped, userId, delta);
      }
    }

    const stale: Array<string> = [];
    this.replicas.forEach((_, key) => {
      if (!seen.has(key)) {
        stale.push(key);
      }
    });

    for (const key of stale) {
      const replica = this.replicas.get(key)!;
      this.replicas.delete(key);
      const userId = parseDataUserId(key);
      if (userId !== undefined) {
        this.pushDelta(grouped, userId, replica.cleanup());
      }
    }

    return grouped;
  }

  private sendInitialSnapshot(player: Player): void {
    if (this.hydratedPlayers.has(player.UserId)) {
      return;
    }

    const key = buildDataKey(player.UserId);
    if (dataAtom()[key] === undefined) {
      return;
    }

    const entry = DataManager.getData(player.UserId);

    let replica = this.replicas.get(key);
    if (!replica) {
      replica = new DataReplica(key, entry);
      this.replicas.set(key, replica);
    }

    const snapshot = replica.snapshotDelta(entry);
    replica.prime();
    this.hydratedPlayers.add(player.UserId);

    Events.core.dataDelta(player, this.encode([snapshot]));
  }

  private encode(deltas: ReadonlyArray<DataReplicationDelta>): buffer {
    const cursor = Squash.cursor();
    for (const delta of deltas) {
      DataReplica.serialize(cursor, delta);
    }

    serdesCount.ser(cursor, deltas.size());
    return Squash.tobuffer(cursor);
  }

  private pushDelta(
    grouped: Map<number, Array<DataReplicationDelta>>,
    userId: number,
    delta: DataReplicationDelta,
  ): void {
    let list = grouped.get(userId);
    if (!list) {
      list = new Array<DataReplicationDelta>();
      grouped.set(userId, list);
    }

    list.push(delta);
  }
}
