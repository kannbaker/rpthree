import type { AnimationAction } from "three";

export type PlayerAnimationState = "idle" | "walk" | "loot";

export interface PlayerActions {
  idle: AnimationAction;
  walk: AnimationAction;
  loot: AnimationAction;
}
