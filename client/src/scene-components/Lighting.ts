import { DirectionalLight, HemisphereLight, Object3D, Vector3, type Scene } from "three";

import type { SceneComponent } from "../types/SceneComponent";

type LightingState = "idle";

export class Lighting implements SceneComponent<LightingState> {
  private static readonly SUN_OFFSET = new Vector3(180, 260, 140);
  private readonly directionalLight: DirectionalLight;
  private readonly hemisphereLight: HemisphereLight;
  private readonly shadowTarget: Object3D;
  private readonly focusPosition = new Vector3();

  public constructor() {
    this.directionalLight = new DirectionalLight(0xffffff, 1.35);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(4096, 4096);
    this.directionalLight.shadow.camera.near = 1;
    this.directionalLight.shadow.camera.far = 1600;
    this.directionalLight.shadow.camera.top = 420;
    this.directionalLight.shadow.camera.bottom = -420;
    this.directionalLight.shadow.camera.left = -420;
    this.directionalLight.shadow.camera.right = 420;
    this.directionalLight.shadow.bias = -0.0001;
    this.directionalLight.shadow.normalBias = 0.02;
    this.shadowTarget = new Object3D();
    this.directionalLight.target = this.shadowTarget;

    this.hemisphereLight = new HemisphereLight(0xffffff, 0x444444, 1.1);
    this.hemisphereLight.position.set(0, 200, 0);
  }

  public add(scene: Scene): void {
    scene.add(this.directionalLight);
    scene.add(this.shadowTarget);
    scene.add(this.hemisphereLight);
  }

  public remove(scene: Scene): void {
    scene.remove(this.directionalLight);
    scene.remove(this.shadowTarget);
    scene.remove(this.hemisphereLight);
  }

  public setPosition(x: number, y: number, z: number): void {
    this.setFocus(x, 0, z);
  }

  public setFocus(x: number, y: number, z: number): void {
    this.focusPosition.set(x, y, z);
    this.shadowTarget.position.copy(this.focusPosition);
    this.directionalLight.position.copy(this.focusPosition).add(Lighting.SUN_OFFSET);
    this.directionalLight.target.updateMatrixWorld();
    this.directionalLight.shadow.camera.updateProjectionMatrix();
  }

  public transition(state: LightingState): void {
    void state;
  }

  public tick(_deltaTime: number): void {}
}
