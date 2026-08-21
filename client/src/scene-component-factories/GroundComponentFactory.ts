import { GroundComponent } from "../scene-components/GroundComponent";
import type { ResourceFactory } from "../services/ResourceFactory";
import type { SceneComponentFactory } from "../types/SceneComponentFactory";

export class GroundComponentFactory implements SceneComponentFactory<GroundComponent> {
  public getSources(): string[] {
    return [];
  }

  public build(_resourceFactory: ResourceFactory): GroundComponent {
    return new GroundComponent();
  }
}
