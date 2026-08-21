import {
  GridHelper,
  Group,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  Vector3,
  type Scene
} from "three";

import type { SceneComponent } from "../types/SceneComponent";

type GroundState = "idle";

export class GroundComponent implements SceneComponent<GroundState> {
  private readonly root: Group;
  private readonly ground: Mesh;
  private readonly grid: GridHelper;
  private readonly position = new Vector3();

  public constructor() {
    this.ground = new Mesh(
      new PlaneGeometry(2000, 2000),
      new MeshPhongMaterial({
        color: 0x999999,
        depthWrite: false
      })
    );
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;

    this.grid = new GridHelper(2000, 40, 0x000000, 0x000000);
    this.grid.material.opacity = 0.2;
    this.grid.material.transparent = true;

    this.root = new Group();
    this.root.add(this.ground);
    this.root.add(this.grid);
  }

  public add(scene: Scene): void {
    scene.add(this.root);
  }

  public remove(scene: Scene): void {
    scene.remove(this.root);
  }

  public tick(_deltaTime: number): void {}

  public setPosition(x: number, y: number, z: number): void {
    this.position.set(x, y, z);
    this.root.position.copy(this.position);
  }

  public transition(state: GroundState): void {
    void state;
  }
}
