import type { Scene } from "three";

export interface SceneComponent {
  add(scene: Scene): void;
  remove(scene: Scene): void;
  animate(): void;
  freeze(): void;
}
