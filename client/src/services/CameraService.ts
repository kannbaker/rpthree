import { injectable } from "inversify";
import { PerspectiveCamera } from "three";

@injectable()
export class CameraService {
  private readonly camera: PerspectiveCamera;

  public constructor() {
    this.camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 3;
  }

  public getCamera(): PerspectiveCamera {
    return this.camera;
  }

  public onResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
