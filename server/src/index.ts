import "reflect-metadata";

import { App } from "./app/App";
import { createContainer } from "./container/container";
import { SERVICE_TYPES } from "./container/serviceTypes";

class Bootstrap {
  public run(): void {
    const container = createContainer();
    const app = container.get<App>(SERVICE_TYPES.App);

    void app.start().catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
  }
}

new Bootstrap().run();
