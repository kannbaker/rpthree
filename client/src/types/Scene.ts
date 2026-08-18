import type { PerspectiveCamera, Scene as ThreeScene } from "three";

export interface Scene {
  start(): void;
  stop(): void;
  tick(deltaTime: number): void;
  getScene(): ThreeScene;
  getMainCamera(): PerspectiveCamera;
}
