import type { Scene } from "three";

export interface SceneComponent {
  add(scene: Scene): void;
  remove(scene: Scene): void;
  tick(deltaTime: number): void;
  setPosition(x: number, y: number, z: number): void;
}
