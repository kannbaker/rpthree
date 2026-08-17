import { AmbientLight, DirectionalLight, type Scene } from "three";

import type { SceneComponent } from "../types/SceneComponent";

export class Lighting implements SceneComponent {
  private readonly directionalLight: DirectionalLight;
  private readonly ambientLight: AmbientLight;

  public constructor() {
    this.directionalLight = new DirectionalLight(0xffffff, 1.5);
    this.ambientLight = new AmbientLight(0x707070);
  }

  public add(scene: Scene): void {
    scene.add(this.directionalLight);
    scene.add(this.ambientLight);
  }

  public remove(scene: Scene): void {
    scene.remove(this.directionalLight);
    scene.remove(this.ambientLight);
  }

  public animate(): void {}

  public freeze(): void {}

  public setPosition(x: number, y: number, z: number): void {
    this.directionalLight.position.set(x, y, z);
  }
}
