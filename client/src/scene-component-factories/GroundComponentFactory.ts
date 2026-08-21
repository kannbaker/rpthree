import {
  RepeatWrapping,
  SRGBColorSpace,
  type Texture
} from "three";

import { GroundComponent } from "../scene-components/GroundComponent";
import type { ResourceFactory } from "../services/ResourceFactory";
import type { SceneComponentFactory } from "../types/SceneComponentFactory";

export class GroundComponentFactory implements SceneComponentFactory<GroundComponent> {
  private static readonly GROUND_TEXTURE_SOURCE = "/static/losttreasure/textures/ground-grid.svg";

  public getSources(): string[] {
    return [GroundComponentFactory.GROUND_TEXTURE_SOURCE];
  }

  public build(resourceFactory: ResourceFactory): GroundComponent {
    const groundTexture = resourceFactory.get<Texture>(GroundComponentFactory.GROUND_TEXTURE_SOURCE);

    groundTexture.colorSpace = SRGBColorSpace;
    groundTexture.wrapS = RepeatWrapping;
    groundTexture.wrapT = RepeatWrapping;
    groundTexture.repeat.set(6, 6);

    return new GroundComponent(groundTexture);
  }
}
