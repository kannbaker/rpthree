import type { MainCameraComponent } from "../scene-components/MainCameraComponent";
import type { PlayerCharacterComponent } from "../scene-components/PlayerCharacterComponent";
import type { Scenario } from "../types/Scenario";

interface FollowPlayerTarget {
  mainCamera: MainCameraComponent;
  playerCharacter: PlayerCharacterComponent;
}

export class FollowPlayerScenario implements Scenario<FollowPlayerTarget> {
  private mainCamera: MainCameraComponent | null = null;

  public start(target: FollowPlayerTarget): void {
    this.stop();
    this.mainCamera = target.mainCamera;
    this.mainCamera.follow(target.playerCharacter);
  }

  public stop(): void {
    this.mainCamera?.unfollow();
    this.mainCamera = null;
  }
}
