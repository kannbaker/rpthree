import { PerspectiveCamera, Vector3, type Scene } from "three";

import type { PlayerCharacterComponent } from "./PlayerCharacterComponent";
import type { SceneComponent } from "../types/SceneComponent";

type MainCameraState = "idle";

export class MainCameraComponent implements SceneComponent<MainCameraState> {
  private static readonly CAMERA_DISTANCE = 220;
  private static readonly CAMERA_HEIGHT = 120;
  private static readonly LOOK_AHEAD_DISTANCE = 40;
  private static readonly LOOK_AT_HEIGHT = 80;
  private readonly camera: PerspectiveCamera;
  private readonly position = new Vector3();
  private readonly playerPosition = new Vector3();
  private readonly playerForward = new Vector3();
  private readonly lookAtTarget = new Vector3();
  private followTarget: PlayerCharacterComponent | null = null;

  public constructor() {
    this.camera = new PerspectiveCamera(45, 1, 1, 2000);
    this.camera.position.set(0, 120, 220);
    this.camera.lookAt(0, 80, 0);
  }

  public add(scene: Scene): void {
    scene.add(this.camera);
  }

  public remove(scene: Scene): void {
    scene.remove(this.camera);
  }

  public tick(_deltaTime: number): void {
    if (this.followTarget === null) {
      return;
    }

    this.followTarget.getWorldPosition(this.playerPosition);
    this.followTarget.getForward(this.playerForward);

    this.camera.position
      .copy(this.playerPosition)
      .addScaledVector(this.playerForward, -MainCameraComponent.CAMERA_DISTANCE);
    this.camera.position.y += MainCameraComponent.CAMERA_HEIGHT;

    this.lookAtTarget
      .copy(this.playerPosition)
      .addScaledVector(this.playerForward, MainCameraComponent.LOOK_AHEAD_DISTANCE);
    this.lookAtTarget.y += MainCameraComponent.LOOK_AT_HEIGHT;

    this.camera.lookAt(this.lookAtTarget);
  }

  public setPosition(x: number, y: number, z: number): void {
    this.position.set(x, y, z);
    this.camera.position.copy(this.position);
  }

  public transition(state: MainCameraState): void {
    void state;
  }

  public follow(playerCharacter: PlayerCharacterComponent): void {
    this.followTarget = playerCharacter;
    this.tick(0);
  }

  public unfollow(): void {
    this.followTarget = null;
  }

  public getCamera(): PerspectiveCamera {
    return this.camera;
  }
}
