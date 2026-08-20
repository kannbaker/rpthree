import {
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
  Vector3,
  type Scene
} from "three";

import type { SceneComponent } from "../types/SceneComponent";

export class GroundComponent implements SceneComponent {
  private static readonly GROUND_TEXTURE_SOURCE = "/static/losttreasure/textures/ground-grid.svg";
  private readonly ground: Mesh;
  private readonly position = new Vector3();

  public constructor() {
    this.ground = new Mesh(
      new PlaneGeometry(600, 600),
      new MeshStandardMaterial({ color: 0x8c9b75 })
    );
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
  }

  public getSources(): string[] {
    return [GroundComponent.GROUND_TEXTURE_SOURCE];
  }

  public build(resources: unknown[]): void {
    const [groundTexture] = resources as Array<Texture | undefined>;
    if (groundTexture === undefined) {
      throw new Error(`Resource not loaded: ${GroundComponent.GROUND_TEXTURE_SOURCE}`);
    }

    groundTexture.colorSpace = SRGBColorSpace;
    groundTexture.wrapS = RepeatWrapping;
    groundTexture.wrapT = RepeatWrapping;
    groundTexture.repeat.set(6, 6);

    const material = this.ground.material as MeshStandardMaterial;
    material.map = groundTexture;
    material.needsUpdate = true;
  }

  public add(scene: Scene): void {
    scene.add(this.ground);
  }

  public remove(scene: Scene): void {
    scene.remove(this.ground);
  }

  public tick(_deltaTime: number): void {}

  public setPosition(x: number, y: number, z: number): void {
    this.position.set(x, y, z);
    this.ground.position.copy(this.position);
  }
}
