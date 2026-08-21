import { cloneResource } from "../utils/cloneResource";

export class ResourceFactory {
  public constructor(private readonly loadedResources: Map<string, unknown>) {}

  public get<T>(source: string): T {
    const resource = this.loadedResources.get(source);
    if (resource === undefined) {
      throw new Error(`Resource not loaded: ${source}`);
    }

    return cloneResource(resource) as T;
  }
}
