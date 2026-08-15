import { Container } from "inversify";

import { App } from "../app/App";
import { CameraService } from "../services/CameraService";
import { LayoutService } from "../services/LayoutService";
import { SceneService } from "../services/SceneService";
import { Service3D } from "../services/Service3D";
import { SERVICE_TYPES } from "./serviceTypes";

export function createContainer(): Container {
  const container = new Container();

  container.bind<App>(SERVICE_TYPES.App).to(App).inSingletonScope();
  container.bind<CameraService>(SERVICE_TYPES.CameraService).to(CameraService).inSingletonScope();
  container.bind<LayoutService>(SERVICE_TYPES.LayoutService).to(LayoutService).inSingletonScope();
  container.bind<SceneService>(SERVICE_TYPES.SceneService).to(SceneService).inSingletonScope();
  container
    .bind<Service3D>(SERVICE_TYPES.Service3D)
    .to(Service3D)
    .inSingletonScope();

  return container;
}
