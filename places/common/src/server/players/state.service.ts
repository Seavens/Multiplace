import type { OnStart } from '@flamework/core';
import { Service } from '@flamework/core';
import { Players } from '@rbxts/services';
import Signal from '@rbxts/signal';

@Service({})
export class PlayerStateService implements OnStart {
  private readonly players = new Set<Player>();
  private readonly loadedPlayers = new Set<Player>();

  private readonly playerAdded = new Signal<(player: Player) => void>();
  private readonly playerLoaded = new Signal<(player: Player) => void>();
  private readonly playerRemoving = new Signal<(player: Player) => void>();

  public onStart(): void {
    Players.PlayerAdded.Connect((player) => this.handlePlayerAdded(player));
    Players.PlayerRemoving.Connect((player) => this.handlePlayerRemoving(player));

    for (const player of Players.GetPlayers()) {
      this.handlePlayerAdded(player);
    }
  }

  public onPlayerAdded(callback: (player: Player) => void): RBXScriptConnection {
    this.players.forEach((player) => task.spawn(callback, player));
    return this.playerAdded.Connect(callback);
  }

  public onPlayerLoaded(callback: (player: Player) => void): RBXScriptConnection {
    this.loadedPlayers.forEach((player) => task.spawn(callback, player));
    return this.playerLoaded.Connect(callback);
  }

  public onPlayerRemoving(callback: (player: Player) => void): RBXScriptConnection {
    return this.playerRemoving.Connect(callback);
  }

  public getPlayers(): ReadonlyArray<Player> {
    return [...this.players];
  }

  public getLoadedPlayers(): ReadonlyArray<Player> {
    return [...this.loadedPlayers];
  }

  public getPlayerByUserId(userId: number): Player | undefined {
    let found: Player | undefined;
    this.players.forEach((player) => {
      if (player.UserId === userId) {
        found = player;
      }
    });
    return found;
  }

  public isPlayerLoaded(userId: number): boolean {
    let loaded = false;
    this.loadedPlayers.forEach((player) => {
      if (player.UserId === userId) {
        loaded = true;
      }
    });
    return loaded;
  }

  public markPlayerLoaded(player: Player): void {
    if (!this.players.has(player) || this.loadedPlayers.has(player)) {
      return;
    }

    this.loadedPlayers.add(player);
    this.playerLoaded.Fire(player);
  }

  private handlePlayerAdded(player: Player): void {
    if (this.players.has(player)) {
      return;
    }

    this.players.add(player);
    this.playerAdded.Fire(player);
  }

  private handlePlayerRemoving(player: Player): void {
    if (!this.players.has(player)) {
      return;
    }

    this.players.delete(player);
    this.loadedPlayers.delete(player);
    this.playerRemoving.Fire(player);
  }
}
