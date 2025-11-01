import { Controller, OnStart } from "@flamework/core";

@Controller()
export class GameController implements OnStart {
	public onStart(): void {
		warn("GameController started");
	}
}
