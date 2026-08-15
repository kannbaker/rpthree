import { injectable } from "inversify";
import { Scene } from "three";

import { Lighting } from "./scene/Lighting";
import { RotatingCube } from "./scene/RotatingCube";
import type { SceneComponent } from "./scene/SceneComponent";

@injectable()
export class SceneService {
  private readonly scene: Scene;
  private readonly sceneComponents: SceneComponent[] = [];

  public constructor() {
    this.scene = new Scene();
    this.sceneComponents.push(new RotatingCube(), new Lighting());
  }

  public getScene(): Scene {
    return this.scene;
  }

  public start(): void {
    for (const sceneComponent of this.sceneComponents) {
      sceneComponent.add(this.scene);
    }
  }

  public stop(): void {
    for (const sceneComponent of this.sceneComponents) {
      sceneComponent.freeze();
      sceneComponent.remove(this.scene);
    }
  }
}
