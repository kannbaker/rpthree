import type { Scene } from "three";

export interface SceneComponent<TState extends string = string> {
  getSources(): string[];
  build(resources: unknown[]): void;
  add(scene: Scene): void;
  remove(scene: Scene): void;
  tick(deltaTime: number): void;
  setPosition(x: number, y: number, z: number): void;
  transition(state: TState): void;
  getState(): TState;
}
