import { AmbientLight, DirectionalLight, type Scene } from "three";

import type { SceneComponent } from "../types/SceneComponent";

type LightingState = "idle";

export class Lighting implements SceneComponent<LightingState> {
  private readonly directionalLight: DirectionalLight;
  private readonly ambientLight: AmbientLight;

  public constructor() {
    this.directionalLight = new DirectionalLight(0xffffff, 2.2);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(2048, 2048);
    this.directionalLight.shadow.camera.near = 1;
    this.directionalLight.shadow.camera.far = 500;
    this.directionalLight.shadow.camera.top = 180;
    this.directionalLight.shadow.camera.bottom = -180;
    this.directionalLight.shadow.camera.left = -180;
    this.directionalLight.shadow.camera.right = 180;
    this.directionalLight.shadow.bias = -0.0002;

    this.ambientLight = new AmbientLight(0xffffff, 0.45);
  }

  public add(scene: Scene): void {
    scene.add(this.directionalLight);
    scene.add(this.ambientLight);
  }

  public remove(scene: Scene): void {
    scene.remove(this.directionalLight);
    scene.remove(this.ambientLight);
  }

  public setPosition(x: number, y: number, z: number): void {
    this.directionalLight.position.set(x, y, z);
  }

  public transition(state: LightingState): void {
    void state;
  }

  public tick(_deltaTime: number): void {}
}
