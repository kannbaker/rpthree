import {
  AnimationMixer,
  Object3D,
  Vector3,
  type AnimationAction,
  type Group,
  type Scene
} from "three";

import type { SceneComponent } from "../types/SceneComponent";

export type PlayerCharacterState = "idle" | "walk" | "gather-objects";

export class PlayerCharacterComponent implements SceneComponent<PlayerCharacterState> {
  private static readonly IDLE_SOURCE = "/static/losttreasure/fbx/look-around.fbx";
  private static readonly CHARACTER_SOURCE = "/static/losttreasure/fbx/girl-walk.fbx";
  private static readonly GATHER_OBJECTS_SOURCE = "/static/losttreasure/fbx/gather-objects.fbx";
  private static readonly IDLE_DURATION = 8;
  private static readonly TO_IDLE_TRANSITION_DURATION = 0.35;
  private static readonly WALK_TO_IDLE_TRANSITION_DURATION = 0.7;
  private static readonly GATHER_OBJECTS_TO_IDLE_TRANSITION_DURATION = 1.05;
  private static readonly FROM_IDLE_TRANSITION_DURATION = 0.35;
  private pendingTransitionTimeoutId: number | null = null;
  private mixer: AnimationMixer | null = null;
  private readonly actions = new Map<PlayerCharacterState, AnimationAction>();
  private currentState: PlayerCharacterState = "idle";
  private object: Object3D | null = null;
  private readonly position = new Vector3();

  public getSources(): string[] {
    return [
      PlayerCharacterComponent.IDLE_SOURCE,
      PlayerCharacterComponent.CHARACTER_SOURCE,
      PlayerCharacterComponent.GATHER_OBJECTS_SOURCE
    ];
  }

  public add(scene: Scene): void {
    if (this.object !== null) {
      scene.add(this.object);
    }

    this.actions.get(this.currentState)?.reset().play();
  }

  public remove(scene: Scene): void {
    this.clearPendingTransition();
    this.actions.get(this.currentState)?.stop();

    if (this.object !== null) {
      scene.remove(this.object);
    }
  }

  public setPosition(x: number, y: number, z: number): void {
    this.position.set(x, y, z);
    this.object?.position.copy(this.position);
  }

  public tick(deltaTime: number): void {
    this.mixer?.update(deltaTime);
  }

  public transition(state: PlayerCharacterState): void {
    if (state === this.currentState) {
      return;
    }

    const nextAction = this.actions.get(state);
    if (nextAction === undefined) {
      return;
    }

    this.clearPendingTransition();

    if (this.currentState !== "idle" && state !== "idle") {
      this.playTransition("idle", this.getToIdleTransitionDuration());
      this.pendingTransitionTimeoutId = window.setTimeout(() => {
        this.pendingTransitionTimeoutId = null;
        this.transition(state);
      }, this.getToIdleTransitionDuration() * 1000);

      return;
    }

    this.playTransition(
      state,
      this.currentState === "idle"
        ? PlayerCharacterComponent.FROM_IDLE_TRANSITION_DURATION
        : this.getToIdleTransitionDuration()
    );
  }

  public getState(): PlayerCharacterState {
    return this.currentState;
  }

  public build(resources: unknown[]): void {
    const [idle, character, gatherObjects] = resources as Array<Group | undefined>;
    if (idle === undefined) {
      throw new Error(`Resource not loaded: ${PlayerCharacterComponent.IDLE_SOURCE}`);
    }

    if (character === undefined) {
      throw new Error(`Resource not loaded: ${PlayerCharacterComponent.CHARACTER_SOURCE}`);
    }

    this.clearPendingTransition();
    this.currentState = "idle";
    this.actions.clear();

    const instance = character;
    instance.position.copy(this.position);
    instance.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });

    this.mixer = new AnimationMixer(instance);

    const [idleClip] = idle.animations;
    if (idleClip !== undefined) {
      const idleAction = this.mixer.clipAction(idleClip, instance);
      idleAction.setDuration(PlayerCharacterComponent.IDLE_DURATION);
      this.actions.set("idle", idleAction);
    }

    const [walkClip] = character.animations;
    if (walkClip !== undefined) {
      this.actions.set("walk", this.mixer.clipAction(walkClip, instance));
    }

    const [gatherObjectsClip] = gatherObjects?.animations ?? [];
    if (gatherObjectsClip !== undefined) {
      this.actions.set("gather-objects", this.mixer.clipAction(gatherObjectsClip, instance));
    }

    this.object = instance;
  }

  private playTransition(state: PlayerCharacterState, duration: number): void {
    const currentAction = this.actions.get(this.currentState);
    const nextAction = this.actions.get(state);
    if (nextAction === undefined) {
      return;
    }

    nextAction.reset();
    nextAction.play();
    currentAction?.crossFadeTo(nextAction, duration, true);
    this.currentState = state;
  }

  private clearPendingTransition(): void {
    if (this.pendingTransitionTimeoutId !== null) {
      window.clearTimeout(this.pendingTransitionTimeoutId);
      this.pendingTransitionTimeoutId = null;
    }
  }

  private getToIdleTransitionDuration(): number {
    if (this.currentState === "walk") {
      return PlayerCharacterComponent.WALK_TO_IDLE_TRANSITION_DURATION;
    }

    return this.currentState === "gather-objects"
      ? PlayerCharacterComponent.GATHER_OBJECTS_TO_IDLE_TRANSITION_DURATION
      : PlayerCharacterComponent.TO_IDLE_TRANSITION_DURATION;
  }
}
