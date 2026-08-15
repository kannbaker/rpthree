import { inject, injectable } from "inversify";
import { WebGLRenderer } from "three";

import { SERVICE_TYPES } from "../container/serviceTypes";
import type { CameraService } from "./CameraService";
import type { SceneService } from "./SceneService";

@injectable()
export class Service3D {
  private mountNode: HTMLElement | null = null;
  private animationFrameId: number | null = null;
  private readonly renderer: WebGLRenderer;

  public constructor(
    @inject(SERVICE_TYPES.CameraService) private readonly cameraService: CameraService,
    @inject(SERVICE_TYPES.SceneService) private readonly sceneService: SceneService
  ) {
    this.renderer = new WebGLRenderer({ antialias: true });
  }

  public start(mountNode: HTMLElement): void {
    this.mountNode = mountNode;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.updateViewport();
    this.mountNode.appendChild(this.renderer.domElement);
    this.sceneService.start();
    this.tick();
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.sceneService.stop();
    this.mountNode = null;
  }

  private updateViewport(): void {
    const viewport = this.getViewportSize();
    this.cameraService.onResize(viewport.width, viewport.height);
    this.renderer.setSize(viewport.width, viewport.height);
  }

  private getViewportSize(): { width: number; height: number } {
    if (!this.mountNode) {
      throw new Error("Service3D mount node is not initialized");
    }

    return {
      width: this.mountNode.clientWidth || window.innerWidth,
      height: this.mountNode.clientHeight || window.innerHeight
    };
  }

  private readonly tick = (): void => {
    this.renderer.render(this.sceneService.getScene(), this.cameraService.getCamera());
    this.animationFrameId = requestAnimationFrame(this.tick);
  };
}
