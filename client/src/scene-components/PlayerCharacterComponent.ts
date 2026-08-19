import { Object3D, Vector3, type Group, type Scene } from "three";

import type { SceneComponent } from "../types/SceneComponent";

export class PlayerCharacterComponent implements SceneComponent {
  private object: Object3D | null = null;
  private readonly position = new Vector3();
  private static readonly CHARACTER_SOURCE = "/static/losttreasure/fbx/girl-walk.fbx";

  public getSources(): string[] {
    return [PlayerCharacterComponent.CHARACTER_SOURCE];
  }

  public add(scene: Scene): void {
    if (this.object !== null) {
      scene.add(this.object);
    }
  }

  public remove(scene: Scene): void {
    if (this.object !== null) {
      scene.remove(this.object);
    }
  }

  public setPosition(x: number, y: number, z: number): void {
    this.position.set(x, y, z);
    this.object?.position.copy(this.position);
  }

  public tick(_deltaTime: number): void {}

  public build(resources: unknown[]): void {
    const [character] = resources as Array<Group | undefined>;
    if (character === undefined) {
      throw new Error(`Resource not loaded: ${PlayerCharacterComponent.CHARACTER_SOURCE}`);
    }

    const instance = character;
    instance.position.copy(this.position);
    instance.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });

    this.object = instance;
  }
}
