import type { SceneComponent } from "./SceneComponent";
import type { ResourceFactory } from "../services/ResourceFactory";

export interface SceneComponentFactory<TComponent extends SceneComponent = SceneComponent> {
  getSources(): string[];
  build(resourceFactory: ResourceFactory): TComponent;
}
