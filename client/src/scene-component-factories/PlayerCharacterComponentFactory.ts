import {
  AnimationMixer,
  LoopOnce,
  type Group
} from "three";

import type { PlayerActions } from "../player-animation/types";
import { PlayerCharacterComponent } from "../scene-components/PlayerCharacterComponent";
import type { ResourceFactory } from "../services/ResourceFactory";
import type { SceneComponentFactory } from "../types/SceneComponentFactory";

export class PlayerCharacterComponentFactory implements SceneComponentFactory<PlayerCharacterComponent> {
  private static readonly IDLE_SOURCE = "/static/losttreasure/fbx/look-around.fbx";
  private static readonly CHARACTER_SOURCE = "/static/losttreasure/fbx/girl-walk.fbx";
  private static readonly GATHER_OBJECTS_SOURCE = "/static/losttreasure/fbx/gather-objects.fbx";
  private static readonly IDLE_DURATION = 16;

  public getSources(): string[] {
    return [
      PlayerCharacterComponentFactory.IDLE_SOURCE,
      PlayerCharacterComponentFactory.CHARACTER_SOURCE,
      PlayerCharacterComponentFactory.GATHER_OBJECTS_SOURCE
    ];
  }

  public build(resourceFactory: ResourceFactory): PlayerCharacterComponent {
    const idle = resourceFactory.get<Group>(PlayerCharacterComponentFactory.IDLE_SOURCE);
    const character = resourceFactory.get<Group>(PlayerCharacterComponentFactory.CHARACTER_SOURCE);
    const gatherObjects = resourceFactory.get<Group>(PlayerCharacterComponentFactory.GATHER_OBJECTS_SOURCE);

    const [idleClip] = idle.animations;
    const [walkClip] = character.animations;
    const [gatherObjectsClip] = gatherObjects?.animations ?? [];
    if (idleClip === undefined || walkClip === undefined || gatherObjectsClip === undefined) {
      throw new Error("Player actions are not initialized");
    }

    character.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });

    const mixer = new AnimationMixer(character);
    const actions = {} as PlayerActions;

    const idleAction = mixer.clipAction(idleClip, character);
    idleAction.setDuration(PlayerCharacterComponentFactory.IDLE_DURATION);
    actions.stand = idleAction;

    actions.walk = mixer.clipAction(walkClip, character);

    const lootAction = mixer.clipAction(gatherObjectsClip, character);
    lootAction.setLoop(LoopOnce, 1);
    lootAction.clampWhenFinished = true;
    actions.loot = lootAction;

    return new PlayerCharacterComponent(character, mixer, actions);
  }
}
