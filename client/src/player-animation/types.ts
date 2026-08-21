import type { AnimationAction } from "three";

export type PlayerAnimationState = "stand" | "walk" | "loot";

export interface PlayerActions {
  stand: AnimationAction;
  walk: AnimationAction;
  loot: AnimationAction;
}
