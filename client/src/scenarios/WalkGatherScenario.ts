import type { PlayerAnimationState } from "../player-animation/types";
import type { Scenario } from "../types/Scenario";

export class WalkGatherScenario implements Scenario<{
  transition(state: PlayerAnimationState): void;
}> {
  private static readonly STEP_TIMEOUT_MS = 6000;
  private nextState: PlayerAnimationState = "walk";
  private sceneComponent: { transition(state: PlayerAnimationState): void } | null = null;
  private timeoutId: number | null = null;

  public start(sceneComponent: { transition(state: PlayerAnimationState): void }): void {
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
      this.nextState = this.nextState === "walk" ? "loot" : "walk";
      this.scheduleNextTransition();
    }, WalkGatherScenario.STEP_TIMEOUT_MS);
  }
}
