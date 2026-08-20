import { injectable } from "inversify";
import { PerspectiveCamera, Scene as ThreeScene } from "three";

import { Lighting } from "../../scene-components/Lighting";
import { RotatingCube } from "../../scene-components/RotatingCube";
import type { Scene } from "../../types/Scene";
import type { SceneComponent } from "../../types/SceneComponent";
import { cloneResource } from "../../utils/cloneResource";

@injectable()
export class RotatingCubeScene implements Scene {
  private readonly scene: ThreeScene;
  private readonly mainCamera: PerspectiveCamera;
  private sceneComponents: SceneComponent<string>[] = [];

  public constructor() {
    this.scene = new ThreeScene();
    this.mainCamera = new PerspectiveCamera(75, 1, 0.1, 1000);
    this.mainCamera.position.z = 3;
    this.createSceneComponents();
  }

  public getSources(): string[] {
    const sources: string[] = [];

    for (const sceneComponent of this.sceneComponents) {
      sources.push(...sceneComponent.getSources());
    }

    return sources;
  }

  public async build(resources: unknown[]): Promise<void> {
    let resourceIndex = 0;

    for (const sceneComponent of this.sceneComponents) {
      const componentResourceCount = sceneComponent.getSources().length;
      const componentResources = resources
        .slice(resourceIndex, resourceIndex + componentResourceCount)
        .map((resource) => cloneResource(resource));

      sceneComponent.build(componentResources);
      resourceIndex += componentResourceCount;
    }
  }

  public start(): void {
    this.scene.clear();

    for (const sceneComponent of this.sceneComponents) {
      sceneComponent.add(this.scene);
    }
  }

  public stop(): void {
    for (const sceneComponent of this.sceneComponents) {
      sceneComponent.remove(this.scene);
    }
  }

  public tick(deltaTime: number): void {
    for (const sceneComponent of this.sceneComponents) {
      sceneComponent.tick(deltaTime);
    }
  }

  public getScene(): ThreeScene {
    return this.scene;
  }

  public getMainCamera(): PerspectiveCamera {
    return this.mainCamera;
  }

  private createSceneComponents(): void {
    const rotatingCube = new RotatingCube();
    rotatingCube.setPosition(0, 0, 0);

    const lighting = new Lighting();
    lighting.setPosition(0, 20, 10);

    this.sceneComponents.push(rotatingCube, lighting);
  }
}
