import { BoxGeometry, Mesh, MeshPhongMaterial, type Scene } from "three";

import type { SceneComponent } from "./SceneComponent";

export class RotatingCube implements SceneComponent {
  private animationFrameId: number | null = null;
  private readonly cube: Mesh;

  public constructor() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshPhongMaterial({ color: 0x00aaff });

    this.cube = new Mesh(geometry, material);
  }

  public add(scene: Scene): void {
    scene.add(this.cube);
    this.animate();
  }

  public remove(scene: Scene): void {
    this.freeze();
    scene.remove(this.cube);
  }

  public animate(): void {
    if (this.animationFrameId !== null) {
      return;
    }

    this.step();
  }

  public freeze(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private readonly step = (): void => {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.animationFrameId = requestAnimationFrame(this.step);
  };
}
