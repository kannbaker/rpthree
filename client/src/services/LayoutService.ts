import { inject, injectable } from "inversify";

import { SERVICE_TYPES } from "../container/serviceTypes";
import type { WebGLRenderer } from "./WebGLRenderer";

@injectable()
export class LayoutService {
  private static readonly MOUNT_NODE_ID = "mount-node";

  public constructor(
    @inject(SERVICE_TYPES.WebGLRenderer) private readonly webGLRenderer: WebGLRenderer
  ) {}

  public async start(): Promise<void> {
    const mountNode = this.getMountNode();
    await this.webGLRenderer.start(mountNode);
  }

  public stop(): void {
    this.webGLRenderer.stop();

    const mountNode = document.getElementById(LayoutService.MOUNT_NODE_ID);
    mountNode?.remove();
  }

  public getMountNode(): HTMLElement {
    const existingMountNode = document.getElementById(LayoutService.MOUNT_NODE_ID);
    if (existingMountNode) {
      return existingMountNode;
    }

    const mountNode = document.createElement("div");
    mountNode.id = LayoutService.MOUNT_NODE_ID;
    document.body.appendChild(mountNode);

    return mountNode;
  }
}
