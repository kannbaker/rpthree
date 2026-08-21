import {
  Object3D,
  Vector3,
  type AnimationMixer,
  type Scene
} from "three";

import type { PlayerActions, PlayerAnimationState } from "../player-animation/types";
import type { SceneComponent } from "../types/SceneComponent";

export class PlayerCharacterComponent implements SceneComponent<PlayerAnimationState> {
  private readonly position = new Vector3();

  public constructor(
    private readonly object: Object3D,
    private readonly mixer: AnimationMixer,
    private readonly actions: PlayerActions
  ) {}

  public add(scene: Scene): void {
    scene.add(this.object);
    this.object.position.copy(this.position);
    this.mixer.addEventListener("finished", this.handleFinished);
    this.startIdle();
  }

  public remove(scene: Scene): void {
    this.mixer.removeEventListener("finished", this.handleFinished);
    this.stopAllActions();
    scene.remove(this.object);
  }

  public setPosition(x: number, y: number, z: number): void {
    this.position.set(x, y, z);
    this.object.position.copy(this.position);
  }

  public tick(deltaTime: number): void {
    this.mixer.update(deltaTime);
  }

  public transition(state: PlayerAnimationState): void {
    switch (state) {
      case "idle":
        this.startIdle();
        return;
      case "walk":
        this.startWalk();
        return;
      case "loot":
        this.startLoot();
        return;
    }
  }

  private startIdle(): void {
    const idleAction = this.actions.idle;
    this.stopAllActions();
    idleAction.reset();
    idleAction.paused = false;
    idleAction.play();
  }

  private startWalk(): void {
    const walkAction = this.actions.walk;
    this.stopAllActions();
    walkAction.reset();
    walkAction.paused = false;
    walkAction.play();
  }

  private startLoot(): void {
    const lootAction = this.actions.loot;
    this.stopAllActions();
    lootAction.reset();
    lootAction.paused = false;
    lootAction.play();
  }

  private stopAllActions(): void {
    this.actions.idle.stop();
    this.actions.walk.stop();
    this.actions.loot.stop();
  }

  private readonly handleFinished = (event: { action?: unknown }): void => {
    if (event.action !== this.actions.loot) {
      return;
    }

    this.startIdle();
  };
}
