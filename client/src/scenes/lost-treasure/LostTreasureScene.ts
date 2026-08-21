import { inject, injectable } from "inversify";
import { Color, PerspectiveCamera, Scene as ThreeScene } from "three";

import { SERVICE_TYPES } from "../../container/serviceTypes";
import { GroundComponentFactory } from "../../scene-component-factories/GroundComponentFactory";
import { PlayerCharacterComponentFactory } from "../../scene-component-factories/PlayerCharacterComponentFactory";
import { GroundComponent } from "../../scene-components/GroundComponent";
import { Lighting } from "../../scene-components/Lighting";
import { PlayerCharacterComponent } from "../../scene-components/PlayerCharacterComponent";
import { PlayerControlsScenario } from "../../scenarios/PlayerControlsScenario";
import type { KeyboardEvents } from "../../services/KeyboardEvents";
import type { ResourceFactory } from "../../services/ResourceFactory";
import type { Scene } from "../../types/Scene";
import type { SceneComponent } from "../../types/SceneComponent";
import type { SceneComponentFactory } from "../../types/SceneComponentFactory";
import type { Scenario } from "../../types/Scenario";

@injectable()
export class LostTreasureScene implements Scene {
  private readonly scene: ThreeScene;
  private readonly mainCamera: PerspectiveCamera;
  private readonly scenario: Scenario<PlayerCharacterComponent>;
  private readonly groundFactory: SceneComponentFactory<GroundComponent>;
  private readonly playerCharacterFactory: SceneComponentFactory<PlayerCharacterComponent>;
  private playerCharacter: PlayerCharacterComponent | null = null;
  private sceneComponents: SceneComponent<string>[] = [];

  public constructor(
    @inject(SERVICE_TYPES.KeyboardEvents) keyboardEvents: KeyboardEvents
  ) {
    this.scene = new ThreeScene();
    this.scene.background = new Color(0xa0a0a0);
    this.scenario = new PlayerControlsScenario(keyboardEvents);
    this.groundFactory = new GroundComponentFactory();
    this.playerCharacterFactory = new PlayerCharacterComponentFactory();

    this.mainCamera = new PerspectiveCamera(45, 1, 1, 2000);
    this.mainCamera.position.set(0, 120, 220);
    this.mainCamera.lookAt(0, 80, 0);
  }

  public getSources(): string[] {
    return [
      ...this.groundFactory.getSources(),
      ...this.playerCharacterFactory.getSources()
    ];
  }

  public async build(resourceFactory: ResourceFactory): Promise<void> {
    const ground = this.groundFactory.build(resourceFactory);
    ground.setPosition(0, 0, 0);
    const playerCharacter = this.playerCharacterFactory.build(resourceFactory);
    playerCharacter.setPosition(0, 0, 0);

    const lighting = new Lighting();
    lighting.setPosition(0, 200, 100);

    this.playerCharacter = playerCharacter;
    this.sceneComponents = [ground, lighting, playerCharacter];
  }

  public start(): void {
    this.scene.clear();

    for (const sceneComponent of this.sceneComponents) {
      sceneComponent.add(this.scene);
    }

    this.scenario.start(this.playerCharacter!);
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

}
