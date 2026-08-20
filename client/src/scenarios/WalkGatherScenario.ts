import type { PlayerCharacterState } from "../scene-components/PlayerCharacterComponent";
import type { Scenario } from "../types/Scenario";
import type { SceneComponent } from "../types/SceneComponent";

export class WalkGatherScenario implements Scenario<PlayerCharacterState> {
  private static readonly STEP_TIMEOUT_MS = 6000;
  private nextState: PlayerCharacterState = "walk";
  private sceneComponent: SceneComponent<PlayerCharacterState> | null = null;
  private timeoutId: number | null = null;

  public start(sceneComponent: SceneComponent<PlayerCharacterState>): void {
    this.stop();
    this.sceneComponent = sceneComponent;
    this.nextState = "walk";
    this.scheduleNextTransition();
  }

  public stop(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.sceneComponent = null;
  }

  private scheduleNextTransition(): void {
    this.timeoutId = window.setTimeout(() => {
      if (this.sceneComponent === null) {
        return;
      }

      this.sceneComponent.transition(this.nextState);
      this.nextState = this.nextState === "walk" ? "gather-objects" : "walk";
      this.scheduleNextTransition();
    }, WalkGatherScenario.STEP_TIMEOUT_MS);
  }
}
