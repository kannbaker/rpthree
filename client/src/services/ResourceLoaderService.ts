import { injectable } from "inversify";
import { type Group } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

@injectable()
export class ResourceLoaderService {
  private readonly fbxLoader = new FBXLoader();
  private readonly pendingResources = new Map<string, Promise<unknown>>();
  private readonly loadedResources = new Map<string, unknown>();

  public async load(sources: string[]): Promise<void> {
    await Promise.all(sources.map((source) => this.loadSource(source)));
  }

  public get(sources: string[]): unknown[] {
    const resources: unknown[] = [];

    for (const source of sources) {
      const resource = this.loadedResources.get(source);
      if (resource === undefined) {
        throw new Error(`Resource not loaded: ${source}`);
      }

      resources.push(resource);
    }

    return resources;
  }

  private async loadSource(source: string): Promise<void> {
    if (this.loadedResources.has(source)) {
      return;
    }

    let pendingResource = this.pendingResources.get(source);
    if (pendingResource === undefined) {
      pendingResource = this.loadByExtension(source);
      this.pendingResources.set(source, pendingResource);
    }

    const resource = await pendingResource;
    this.loadedResources.set(source, resource);
  }

  private loadByExtension(source: string): Promise<unknown> {
    if (source.endsWith(".fbx")) {
      return this.loadFbx(source);
    }

    throw new Error(`Unsupported resource type: ${source}`);
  }

  private loadFbx(path: string): Promise<Group> {
    return new Promise<Group>((resolvePromise, rejectPromise) => {
      this.fbxLoader.load(
        path,
        (asset) => {
          resolvePromise(asset);
        },
        undefined,
        (error) => {
          rejectPromise(error);
        }
      );
    });
  }
}
