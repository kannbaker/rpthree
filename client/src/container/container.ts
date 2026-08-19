import { Container } from "inversify";

import { App } from "../app/App";
import { LayoutService } from "../services/LayoutService";
import { ResourceLoaderService } from "../services/ResourceLoaderService";
import { StatsService } from "../services/StatsService";
import { WebGLRenderer } from "../services/WebGLRenderer";
import { LostTreasureScene } from "../scenes/lost-treasure/LostTreasureScene";
import type { Scene } from "../types/Scene";
import { SERVICE_TYPES } from "./serviceTypes";

export function createContainer(): Container {
  const container = new Container();

  container.bind<App>(SERVICE_TYPES.App).to(App).inSingletonScope();
  container.bind<LayoutService>(SERVICE_TYPES.LayoutService).to(LayoutService).inSingletonScope();
  container
    .bind<ResourceLoaderService>(SERVICE_TYPES.ResourceLoaderService)
    .to(ResourceLoaderService)
    .inSingletonScope();
  container.bind<StatsService>(SERVICE_TYPES.StatsService).to(StatsService).inSingletonScope();
  container
    .bind<Scene>(SERVICE_TYPES.Scene)
    .to(LostTreasureScene)
    .inSingletonScope();
  container
    .bind<WebGLRenderer>(SERVICE_TYPES.WebGLRenderer)
    .to(WebGLRenderer)
    .inSingletonScope();

  return container;
}
