import { Container } from "inversify";

import { App } from "../app/App";
import { RotatingCubeScene } from "../scenes/rotating-cube/RotatingCubeScene";
import { LayoutService } from "../services/LayoutService";
import { WebGLRenderer } from "../services/WebGLRenderer";
import type { Scene } from "../types/Scene";
import { SERVICE_TYPES } from "./serviceTypes";

export function createContainer(): Container {
  const container = new Container();

  container.bind<App>(SERVICE_TYPES.App).to(App).inSingletonScope();
  container.bind<LayoutService>(SERVICE_TYPES.LayoutService).to(LayoutService).inSingletonScope();
  container
    .bind<Scene>(SERVICE_TYPES.Scene)
    .to(RotatingCubeScene)
    .inSingletonScope();
  container
    .bind<WebGLRenderer>(SERVICE_TYPES.WebGLRenderer)
    .to(WebGLRenderer)
    .inSingletonScope();

  return container;
}
