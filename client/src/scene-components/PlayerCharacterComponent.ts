import {
  LoopRepeat,
  type AnimationAction,
  Object3D,
  Vector3,
  type AnimationMixer,
  type Scene
} from "three";

import type { PlayerActions, PlayerAnimationState } from "../player-animation/types";
import type { SceneComponent } from "../types/SceneComponent";

type PlayerCharacterTurnState = "none" | "left" | "right";

export class PlayerCharacterComponent implements SceneComponent<PlayerAnimationState> {
  private static readonly TURN_SPEED = Math.PI;
  private static readonly WALK_SPEED = 130;
  private static readonly FORWARD = new Vector3(0, 0, 1);
  private readonly position = new Vector3();
  private readonly walkDirection = new Vector3();
  private lootFinishedListener: (() => void) | null = null;
  private currentAnimationState: PlayerAnimationState = "stand";
  private turnState: PlayerCharacterTurnState = "none";
  private activeAction: AnimationAction | null = null;

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

  public getWorldPosition(target: Vector3): Vector3 {
    return this.object.getWorldPosition(target);
  }

  public getForward(target: Vector3): Vector3 {
    return target
      .copy(PlayerCharacterComponent.FORWARD)
      .applyQuaternion(this.object.quaternion)
      .setY(0)
      .normalize();
  }

  public rotateY(radians: number): void {
    this.object.rotation.y += radians;
  }

  public setLootFinishedListener(listener: (() => void) | null): void {
    this.lootFinishedListener = listener;
  }

  public tick(deltaTime: number): void {
    this.mixer.update(deltaTime);

    if (this.turnState === "left") {
      this.object.rotation.y += PlayerCharacterComponent.TURN_SPEED * deltaTime;
    } else if (this.turnState === "right") {
      this.object.rotation.y -= PlayerCharacterComponent.TURN_SPEED * deltaTime;
    }

    if (this.currentAnimationState !== "walk") {
      return;
    }

    this.getForward(this.walkDirection);

    this.object.position.addScaledVector(
      this.walkDirection,
      PlayerCharacterComponent.WALK_SPEED * deltaTime
    );
    this.position.copy(this.object.position);
  }

  public transition(state: PlayerAnimationState): void {
    switch (state) {
      case "stand":
        this.stand();
        return;
      case "walk":
        this.walk();
        return;
      case "loot":
        this.loot();
        return;
    }
  }

  public stand(): void {
    if (this.currentAnimationState === "stand") {
      this.ensureIdlePlaying();
      return;
    }

    this.currentAnimationState = "stand";
    this.startIdle();
  }

  public turnLeft(): void {
    this.turnState = "left";
  }

  public turnRight(): void {
    this.turnState = "right";
  }

  public stopTurning(): void {
    this.turnState = "none";
  }

  public walk(): void {
    if (this.currentAnimationState === "walk") {
      return;
    }

    this.currentAnimationState = "walk";
    this.startWalk();
  }

  public loot(): void {
    if (this.currentAnimationState === "loot") {
      return;
    }

    this.currentAnimationState = "loot";
    this.startLoot();
  }

  private startIdle(): void {
    const idleAction = this.actions.stand;
    this.stopAllActions();
    idleAction.reset();
    idleAction.setLoop(LoopRepeat, Infinity);
    idleAction.clampWhenFinished = false;
    idleAction.paused = false;
    idleAction.play();
    this.activeAction = idleAction;
  }

  private startWalk(): void {
    const walkAction = this.actions.walk;
    this.stopAllActions();
    walkAction.reset();
    walkAction.setLoop(LoopRepeat, Infinity);
    walkAction.clampWhenFinished = false;
    walkAction.paused = false;
    walkAction.play();
    this.activeAction = walkAction;
  }

  private startLoot(): void {
    const lootAction = this.actions.loot;
    this.stopAllActions();
    lootAction.reset();
    lootAction.paused = false;
    lootAction.play();
    this.activeAction = lootAction;
  }

  private stopAllActions(): void {
    this.actions.stand.stop();
    this.actions.walk.stop();
    this.actions.loot.stop();
    this.activeAction = null;
  }

  private ensureIdlePlaying(): void {
    if (this.activeAction === this.actions.stand && this.actions.stand.isRunning()) {
      return;
    }

    this.startIdle();
  }

  private readonly handleFinished = (event: { action?: unknown }): void => {
    if (event.action !== this.actions.loot) {
      return;
    }

    this.currentAnimationState = "stand";
    this.startIdle();
    this.lootFinishedListener?.();
  };
}
