import type { PerspectiveCamera, Scene as ThreeScene } from "three";

export interface Scene {
  getSources(): string[];
  build(resources: unknown[]): Promise<void>;
  start(): void;
  stop(): void;
  tick(deltaTime: number): void;
  getScene(): ThreeScene;
  getMainCamera(): PerspectiveCamera;
}
