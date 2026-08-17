import type { PerspectiveCamera, Scene as ThreeScene } from "three";

export interface Scene {
  start(): void;
  stop(): void;
  getScene(): ThreeScene;
  getMainCamera(): PerspectiveCamera;
}
