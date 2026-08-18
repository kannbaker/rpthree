import { inject, injectable } from "inversify";
import { WebGLRenderer as ThreeWebGLRenderer } from "three";

import { SERVICE_TYPES } from "../container/serviceTypes";
import type { Scene } from "../types/Scene";

@injectable()
export class WebGLRenderer {
  private mountNode: HTMLElement | null = null;
  private animationFrameId: number | null = null;
  private lastFrameTime: number | null = null;
  private readonly renderer: ThreeWebGLRenderer;

  public constructor(@inject(SERVICE_TYPES.Scene) private readonly scene: Scene) {
    this.renderer = new ThreeWebGLRenderer({ antialias: true });
  }

  public start(mountNode: HTMLElement): void {
    this.mountNode = mountNode;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.updateViewport();
    this.mountNode.appendChild(this.renderer.domElement);
    this.scene.start();
    this.tick();
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.lastFrameTime = null;
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
    const deltaTime = this.lastFrameTime === null ? 0 : (time - this.lastFrameTime) / 1000;
    this.lastFrameTime = time;

    this.scene.tick(deltaTime);
    this.renderer.render(this.scene.getScene(), this.scene.getMainCamera());
    this.animationFrameId = requestAnimationFrame(this.tick);
  };
}
