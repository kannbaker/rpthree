import { Container } from "inversify";

import { App } from "../app/App";
import { EnvService } from "../services/EnvService";
import { HttpService } from "../services/HttpService";
import { StaticService } from "../services/StaticService";
import { SERVICE_TYPES } from "./serviceTypes";

export function createContainer(): Container {
  const container = new Container();

  container.bind<App>(SERVICE_TYPES.App).to(App).inSingletonScope();
  container.bind<EnvService>(SERVICE_TYPES.EnvService).to(EnvService).inSingletonScope();
  container.bind<HttpService>(SERVICE_TYPES.HttpService).to(HttpService).inSingletonScope();
  container.bind<StaticService>(SERVICE_TYPES.StaticService).to(StaticService).inSingletonScope();

  return container;
}
