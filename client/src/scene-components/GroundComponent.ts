import {
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  type Texture,
  Vector3,
  type Scene
} from "three";

import type { SceneComponent } from "../types/SceneComponent";

type GroundState = "idle";

export class GroundComponent implements SceneComponent<GroundState> {
  private readonly ground: Mesh;
  private readonly position = new Vector3();

  public constructor(groundTexture: Texture) {
    this.ground = new Mesh(
      new PlaneGeometry(600, 600),
      new MeshStandardMaterial({ color: 0x8c9b75 })
    );
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;

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

  public transition(state: GroundState): void {
    void state;
  }
}
