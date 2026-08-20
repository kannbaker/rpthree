import type { SceneComponent } from "./SceneComponent";

export interface Scenario<TState extends string = string> {
  start(sceneComponent: SceneComponent<TState>): void;
  stop(): void;
}
