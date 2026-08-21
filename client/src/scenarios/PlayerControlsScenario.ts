import type { PlayerAnimationState } from "../player-animation/types";
import type { KeyboardEventListener, KeyboardInputEvent } from "../services/KeyboardEvents";
import type { PlayerCharacterComponent } from "../scene-components/PlayerCharacterComponent";
import type { KeyboardEvents } from "../services/KeyboardEvents";
import type { Scenario } from "../types/Scenario";

type MoveState = "idle" | "move-forward" | "turning" | "looting";

export class PlayerControlsScenario implements Scenario<PlayerCharacterComponent> {
  private playerCharacter: PlayerCharacterComponent | null = null;
  private readonly pressedKeys = new Set<string>();
  private currentState: MoveState = "idle";

  public constructor(private readonly keyboardEvents: KeyboardEvents) {}

  public start(playerCharacter: PlayerCharacterComponent): void {
    this.stop();
    this.playerCharacter = playerCharacter;
    this.keyboardEvents.subscribe(this.handleKeyboardEvent);
    this.playerCharacter.transition("idle");
  }

  public stop(): void {
    this.keyboardEvents.unsubscribe(this.handleKeyboardEvent);
    this.pressedKeys.clear();
    this.currentState = "idle";
    this.playerCharacter = null;
  }

  private readonly handleKeyboardEvent: KeyboardEventListener = (
    keyboardEvent: KeyboardInputEvent
  ): void => {
    keyboardEvent.event.preventDefault();

    if (keyboardEvent.type === "keydown") {
      this.handleKeyDown(keyboardEvent);
      return;
    }

    this.handleKeyUp(keyboardEvent);
  };

  private handleKeyDown(keyboardEvent: KeyboardInputEvent): void {
    if (keyboardEvent.repeat || !["KeyW", "KeyA", "KeyS", "KeyD"].includes(keyboardEvent.code)) {
      return;
    }

    this.pressedKeys.add(keyboardEvent.code);
    this.syncState();
  }

  private handleKeyUp(keyboardEvent: KeyboardInputEvent): void {
    this.pressedKeys.delete(keyboardEvent.code);

    if (!["KeyW", "KeyA", "KeyD"].includes(keyboardEvent.code)) {
      return;
    }

    this.syncState();
  }

  private syncState(): void {
    this.setState(this.resolveState());
  }

  private resolveState(): MoveState {
    if (this.pressedKeys.has("KeyS")) {
      return "looting";
    }

    if (this.pressedKeys.has("KeyW")) {
      return "move-forward";
    }

    if (this.pressedKeys.has("KeyA") || this.pressedKeys.has("KeyD")) {
      return "turning";
    }

    if (this.currentState === "looting") {
      return "turning";
    }

    return "idle";
  }

  private setState(nextState: MoveState): void {
    if (this.playerCharacter === null || this.currentState === nextState) {
      return;
    }

    this.currentState = nextState;

    switch (nextState) {
      case "idle":
      case "turning":
        this.playerCharacter.transition("idle");
        return;
      case "move-forward":
        this.playerCharacter.transition("walk");
        return;
      case "looting":
        this.playerCharacter.transition("loot");
        return;
    }
  }
}
