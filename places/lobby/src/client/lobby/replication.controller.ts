import type { OnStart } from '@flamework/core';
import { Controller } from '@flamework/core';
import type { LobbyReplicationPayload } from '@lobby/shared';
import { LobbyManager } from '@lobby/shared';

import { Events, Functions } from '../network';

@Controller({})
export class LobbyReplicationController implements OnStart {
  public onStart(): void {
    Events.lobby.sync.connect((payload: LobbyReplicationPayload) =>
      LobbyManager.setState(payload.state),
    );
    Functions.requestLobbyHydration.invoke();
  }
}
