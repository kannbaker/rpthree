import { injectable } from "inversify";
import { TextureLoader, type Group, type Texture } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

import { ResourceFactory } from "./ResourceFactory";

@injectable()
export class ResourceFactoryBuilder {
  private readonly fbxLoader = new FBXLoader();
  private readonly textureLoader = new TextureLoader();
  private readonly pendingResources = new Map<string, Promise<unknown>>();
  private readonly loadedResources = new Map<string, unknown>();

  public async build(sources: string[]): Promise<ResourceFactory> {
    await Promise.all(sources.map((source) => this.loadSource(source)));
    return new ResourceFactory(this.loadedResources);
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

    if (
      source.endsWith(".png") ||
      source.endsWith(".jpg") ||
      source.endsWith(".jpeg") ||
      source.endsWith(".svg")
    ) {
      return this.loadTexture(source);
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

  private loadTexture(path: string): Promise<Texture> {
    return new Promise<Texture>((resolvePromise, rejectPromise) => {
      this.textureLoader.load(
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
