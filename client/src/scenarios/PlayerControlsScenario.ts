import type { KeyboardEventListener, KeyboardInputEvent } from "../services/KeyboardEvents";
import type { PlayerCharacterComponent } from "../scene-components/PlayerCharacterComponent";
import type { KeyboardEvents } from "../services/KeyboardEvents";
import type { Scenario } from "../types/Scenario";

type PlayerAnimationControlState = "stand" | "walk" | "loot";
type PlayerTurnControlState = "none" | "left" | "right";

export class PlayerControlsScenario implements Scenario<PlayerCharacterComponent> {
  private playerCharacter: PlayerCharacterComponent | null = null;
  private readonly pressedKeys = new Set<string>();
  private currentAnimationState: PlayerAnimationControlState = "stand";
  private currentTurnState: PlayerTurnControlState = "none";

  public constructor(private readonly keyboardEvents: KeyboardEvents) {}

  public start(playerCharacter: PlayerCharacterComponent): void {
    this.stop();
    this.playerCharacter = playerCharacter;
    this.playerCharacter.setLootFinishedListener(this.handleLootFinished);
    this.keyboardEvents.subscribe(this.handleKeyboardEvent);
    this.playerCharacter.stand();
  }

  public stop(): void {
    this.keyboardEvents.unsubscribe(this.handleKeyboardEvent);
    this.pressedKeys.clear();
    this.currentAnimationState = "stand";
    this.currentTurnState = "none";
    this.playerCharacter?.setLootFinishedListener(null);
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
    this.setAnimationState(this.resolveAnimationState());
    this.setTurnState(this.resolveTurnState());
  }

  private resolveAnimationState(): PlayerAnimationControlState {
    if (this.pressedKeys.has("KeyS")) {
      return "loot";
    }

    if (this.currentAnimationState === "loot" && !this.pressedKeys.has("KeyW")) {
      return "loot";
    }

    if (this.pressedKeys.has("KeyW")) {
      return "walk";
    }

    return "stand";
  }

  private resolveTurnState(): PlayerTurnControlState {
    if (this.pressedKeys.has("KeyA")) {
      return "left";
    }

    if (this.pressedKeys.has("KeyD")) {
      return "right";
    }

    return "none";
  }

  private setAnimationState(nextState: PlayerAnimationControlState): void {
    if (this.playerCharacter === null || this.currentAnimationState === nextState) {
      return;
    }

    this.currentAnimationState = nextState;

    switch (nextState) {
      case "stand":
        this.playerCharacter.stand();
        return;
      case "walk":
        this.playerCharacter.walk();
        return;
      case "loot":
        this.playerCharacter.loot();
        return;
    }
  }

  private setTurnState(nextState: PlayerTurnControlState): void {
    if (this.playerCharacter === null || this.currentTurnState === nextState) {
      return;
    }

    this.currentTurnState = nextState;

    switch (nextState) {
      case "none":
        this.playerCharacter.stopTurning();
        return;
      case "left":
        this.playerCharacter.turnLeft();
        return;
      case "right":
        this.playerCharacter.turnRight();
        return;
    }
  }

  private readonly handleLootFinished = (): void => {
    this.currentAnimationState = "stand";
    this.syncState();
  };
}
