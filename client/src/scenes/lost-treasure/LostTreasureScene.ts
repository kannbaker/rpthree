import { inject, injectable } from "inversify";
import { Color, Fog, PerspectiveCamera, Scene as ThreeScene, Vector3 } from "three";

import { SERVICE_TYPES } from "../../container/serviceTypes";
import { GroundComponentFactory } from "../../scene-component-factories/GroundComponentFactory";
import { PlayerCharacterComponentFactory } from "../../scene-component-factories/PlayerCharacterComponentFactory";
import { GroundComponent } from "../../scene-components/GroundComponent";
import { Lighting } from "../../scene-components/Lighting";
import { MainCameraComponent } from "../../scene-components/MainCameraComponent";
import { PlayerCharacterComponent } from "../../scene-components/PlayerCharacterComponent";
import { FollowPlayerScenario } from "../../scenarios/FollowPlayerScenario";
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
  private readonly mainCamera: MainCameraComponent;
  private readonly playerControlsScenario: Scenario<PlayerCharacterComponent>;
  private readonly followPlayerCameraScenario: Scenario<{
    mainCamera: MainCameraComponent;
    playerCharacter: PlayerCharacterComponent;
  }>;
  private readonly groundFactory: SceneComponentFactory<GroundComponent>;
  private readonly playerCharacterFactory: SceneComponentFactory<PlayerCharacterComponent>;
  private readonly playerPosition = new Vector3();
  private playerCharacter: PlayerCharacterComponent | null = null;
  private lighting: Lighting | null = null;
  private sceneComponents: SceneComponent<string>[] = [];

  public constructor(
    @inject(SERVICE_TYPES.KeyboardEvents) keyboardEvents: KeyboardEvents
  ) {
    this.scene = new ThreeScene();
    this.scene.background = new Color(0xa0a0a0);
    this.scene.fog = new Fog(0xa0a0a0, 200, 1000);
    this.mainCamera = new MainCameraComponent();
    this.playerControlsScenario = new PlayerControlsScenario(keyboardEvents);
    this.followPlayerCameraScenario = new FollowPlayerScenario();
    this.groundFactory = new GroundComponentFactory();
    this.playerCharacterFactory = new PlayerCharacterComponentFactory();
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
    this.lighting = lighting;
    this.sceneComponents = [ground, lighting, playerCharacter, this.mainCamera];
  }

  public start(): void {
    this.scene.clear();

    for (const sceneComponent of this.sceneComponents) {
      sceneComponent.add(this.scene);
    }

    this.playerControlsScenario.start(this.playerCharacter!);
    this.followPlayerCameraScenario.start({
      mainCamera: this.mainCamera,
      playerCharacter: this.playerCharacter!
    });
  }

  public stop(): void {
    this.followPlayerCameraScenario.stop();
    this.playerControlsScenario.stop();

    for (const sceneComponent of this.sceneComponents) {
      sceneComponent.remove(this.scene);
    }
  }

  public tick(deltaTime: number): void {
    for (const sceneComponent of this.sceneComponents) {
      sceneComponent.tick(deltaTime);
    }

    if (this.playerCharacter !== null && this.lighting !== null) {
      this.playerCharacter.getWorldPosition(this.playerPosition);
      this.lighting.setFocus(this.playerPosition.x, this.playerPosition.y, this.playerPosition.z);
    }
  }

  public getScene(): ThreeScene {
    return this.scene;
  }

  public getMainCamera(): PerspectiveCamera {
    return this.mainCamera.getCamera();
  }

}
