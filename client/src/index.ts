import "reflect-metadata";

import { App } from "./app/App";
import { createContainer } from "./container/container";
import { SERVICE_TYPES } from "./container/serviceTypes";

class Bootstrap {
  public run(): void {
    try {
      const container = createContainer();
      const app = container.get<App>(SERVICE_TYPES.App);

      app.start();
    } catch (error: unknown) {
      console.error(error);
    }
  }
}

new Bootstrap().run();
