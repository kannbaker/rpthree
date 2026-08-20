import { BoxGeometry, Mesh, MeshPhongMaterial, type Scene } from "three";

import type { SceneComponent } from "../types/SceneComponent";

type RotatingCubeState = "idle";

export class RotatingCube implements SceneComponent<RotatingCubeState> {
  private readonly cube: Mesh;
  private state: RotatingCubeState = "idle";

  public constructor() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshPhongMaterial({ color: 0x00aaff });

    this.cube = new Mesh(geometry, material);
  }

  public add(scene: Scene): void {
    scene.add(this.cube);
  }

  public getSources(): string[] {
    return [];
  }

  public build(_resources: unknown[]): void {}

  public remove(scene: Scene): void {
    scene.remove(this.cube);
  }

  public setPosition(x: number, y: number, z: number): void {
    this.cube.position.set(x, y, z);
  }

  public transition(state: RotatingCubeState): void {
    this.state = state;
  }

  public getState(): RotatingCubeState {
    return this.state;
  }

  public tick(deltaTime: number): void {
    this.cube.rotation.x += deltaTime;
    this.cube.rotation.y += deltaTime;
  }
}
