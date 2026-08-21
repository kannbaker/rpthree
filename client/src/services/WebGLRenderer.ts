import { inject, injectable } from "inversify";
import { PCFSoftShadowMap, WebGLRenderer as ThreeWebGLRenderer } from "three";

import { SERVICE_TYPES } from "../container/serviceTypes";
import type { ResourceFactoryBuilder } from "./ResourceFactoryBuilder";
import type { Scene } from "../types/Scene";
import type { StatsService } from "./StatsService";

@injectable()
export class WebGLRenderer {
  private mountNode: HTMLElement | null = null;
  private animationFrameId: number | null = null;
  private lastFrameTime: number | null = null;
  private readonly renderer: ThreeWebGLRenderer;

  public constructor(
    @inject(SERVICE_TYPES.ResourceFactoryBuilder)
    private readonly resourceFactoryBuilder: ResourceFactoryBuilder,
    @inject(SERVICE_TYPES.Scene) private readonly scene: Scene,
    @inject(SERVICE_TYPES.StatsService) private readonly statsService: StatsService
  ) {
    this.renderer = new ThreeWebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
  }

  public async start(mountNode: HTMLElement): Promise<void> {
    this.mountNode = mountNode;
    const sources = this.scene.getSources();
    const resourceFactory = await this.resourceFactoryBuilder.build(sources);
    await this.scene.build(resourceFactory);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.updateViewport();
    this.mountNode.appendChild(this.renderer.domElement);
    this.statsService.mount(this.mountNode);
    this.scene.start();
    await this.warmupRenderer();
    this.tick();
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.lastFrameTime = null;
    this.statsService.unmount();
    this.scene.stop();
    this.mountNode = null;
  }

  private updateViewport(): void {
    const width = this.mountNode!.clientWidth;
    const height = this.mountNode!.clientHeight;
    const mainCamera = this.scene.getMainCamera();
    mainCamera.aspect = width / height;
    mainCamera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private readonly tick = (time: number = performance.now()): void => {
    this.statsService.begin();

    const deltaTime = this.lastFrameTime === null ? 0 : (time - this.lastFrameTime) / 1000;
    this.lastFrameTime = time;

    this.scene.tick(deltaTime);
    this.renderer.render(this.scene.getScene(), this.scene.getMainCamera());
    this.statsService.end();
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private async warmupRenderer(): Promise<void> {
    try {
      await this.renderer.compileAsync(this.scene.getScene(), this.scene.getMainCamera());
    } catch {
      this.renderer.render(this.scene.getScene(), this.scene.getMainCamera());
    }
  }
}
