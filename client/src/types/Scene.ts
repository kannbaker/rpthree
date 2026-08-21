import type { PerspectiveCamera, Scene as ThreeScene } from "three";
import type { ResourceFactory } from "../services/ResourceFactory";

export interface Scene {
  getSources(): string[];
  build(resourceFactory: ResourceFactory): Promise<void>;
  start(): void;
  stop(): void;
  tick(deltaTime: number): void;
  getScene(): ThreeScene;
  getMainCamera(): PerspectiveCamera;
}
