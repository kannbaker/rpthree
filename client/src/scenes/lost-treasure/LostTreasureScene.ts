import { injectable } from "inversify";
import { Color, PerspectiveCamera, Scene as ThreeScene } from "three";

import { GroundComponent } from "../../scene-components/GroundComponent";
import { Lighting } from "../../scene-components/Lighting";
import {
  PlayerCharacterComponent,
  type PlayerCharacterState
} from "../../scene-components/PlayerCharacterComponent";
import { WalkGatherScenario } from "../../scenarios/WalkGatherScenario";
import type { Scene } from "../../types/Scene";
import type { SceneComponent } from "../../types/SceneComponent";
import type { Scenario } from "../../types/Scenario";
import { cloneResource } from "../../utils/cloneResource";

@injectable()
export class LostTreasureScene implements Scene {
  private readonly scene: ThreeScene;
  private readonly mainCamera: PerspectiveCamera;
  private readonly scenario: Scenario<PlayerCharacterState>;
  private playerCharacter: PlayerCharacterComponent | null = null;
  private sceneComponents: SceneComponent<string>[] = [];

  public constructor() {
    this.scene = new ThreeScene();
    this.scene.background = new Color(0xa0a0a0);
    this.scenario = new WalkGatherScenario();

    this.mainCamera = new PerspectiveCamera(45, 1, 1, 2000);
    this.mainCamera.position.set(0, 120, 220);
    this.mainCamera.lookAt(0, 80, 0);
    this.createSceneComponents();
  }

  public getSources(): string[] {
    const sources: string[] = [];

    for (const sceneComponent of this.sceneComponents) {
      sources.push(...sceneComponent.getSources());
    }

    return sources;
  }

  public async build(resources: unknown[]): Promise<void> {
    let resourceIndex = 0;

    for (const sceneComponent of this.sceneComponents) {
      const componentResourceCount = sceneComponent.getSources().length;
      const componentResources = resources
        .slice(resourceIndex, resourceIndex + componentResourceCount)
        .map((resource) => cloneResource(resource));

      sceneComponent.build(componentResources);
      resourceIndex += componentResourceCount;
    }
  }

  public start(): void {
    this.scene.clear();

    for (const sceneComponent of this.sceneComponents) {
      sceneComponent.add(this.scene);
    }

    this.playerCharacter !== null && this.scenario.start(this.playerCharacter);
  }

  public stop(): void {
    this.scenario.stop();

    for (const sceneComponent of this.sceneComponents) {
      sceneComponent.remove(this.scene);
    }
  }

  public tick(deltaTime: number): void {
    for (const sceneComponent of this.sceneComponents) {
      sceneComponent.tick(deltaTime);
    }
  }

  public getScene(): ThreeScene {
    return this.scene;
  }

  public getMainCamera(): PerspectiveCamera {
    return this.mainCamera;
  }

  private createSceneComponents(): void {
    const ground = new GroundComponent();
    ground.setPosition(0, 0, 0);

    const lighting = new Lighting();
    lighting.setPosition(0, 200, 100);

    const playerCharacter = new PlayerCharacterComponent();
    playerCharacter.setPosition(0, 0, 0);
    this.playerCharacter = playerCharacter;

    this.sceneComponents.push(ground, lighting, playerCharacter);
  }
}
