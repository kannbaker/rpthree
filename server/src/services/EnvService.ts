import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { injectable } from "inversify";

@injectable()
export class EnvService {
  private readonly serverRoot = resolve(__dirname, "../..");

  public constructor() {
    const envFilePath = resolve(this.serverRoot, process.env.ENV_FILE ?? ".env");
    if (existsSync(envFilePath)) {
      process.loadEnvFile(envFilePath);
    }
  }

  public getPort(): number {
    const portValue = process.env.PORT ?? "3000";
    const port = Number.parseInt(portValue, 10);

    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
      throw new Error(`Invalid PORT value: ${portValue}`);
    }

    return port;
  }

  public getStaticDir(): string {
    const configuredPath = process.env.STATIC_DIR ?? "../static";
    const staticDir = resolve(this.serverRoot, configuredPath);

    if (!existsSync(staticDir) || !statSync(staticDir).isDirectory()) {
      throw new Error(`Static directory not found: ${staticDir}`);
    }

    return staticDir;
  }
}
