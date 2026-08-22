import { Container } from "inversify";

import { App } from "../app/App";
import { KeyboardEvents } from "../services/KeyboardEvents";
import { LayoutService } from "../services/LayoutService";
import { MouseEvents } from "../services/MouseEvents";
import { ResourceFactoryBuilder } from "../services/ResourceFactoryBuilder";
import { StatsService } from "../services/StatsService";
import { WebGLRenderer } from "../services/WebGLRenderer";
import { LostTreasureScene } from "../scenes/lost-treasure/LostTreasureScene";
import type { Scene } from "../types/Scene";
import { SERVICE_TYPES } from "./serviceTypes";

export function createContainer(): Container {
  const container = new Container();

  container.bind<App>(SERVICE_TYPES.App).to(App).inSingletonScope();
  container.bind<KeyboardEvents>(SERVICE_TYPES.KeyboardEvents).to(KeyboardEvents).inSingletonScope();
  container.bind<MouseEvents>(SERVICE_TYPES.MouseEvents).to(MouseEvents).inSingletonScope();
  container.bind<LayoutService>(SERVICE_TYPES.LayoutService).to(LayoutService).inSingletonScope();
  container
    .bind<ResourceFactoryBuilder>(SERVICE_TYPES.ResourceFactoryBuilder)
    .to(ResourceFactoryBuilder)
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
