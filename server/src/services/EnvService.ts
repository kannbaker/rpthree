import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { injectable } from "inversify";

type EnvMap = Record<string, string>;

@injectable()
export class EnvService {
  private readonly serverRoot = resolve(__dirname, "../..");
  private readonly envPath = resolve(this.serverRoot, ".env");
  private readonly env: EnvMap;

  public constructor() {
    this.env = this.loadEnvFile();
  }

  public getPort(): number {
    const portValue = this.get("PORT") ?? "3000";
    const port = Number.parseInt(portValue, 10);

    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
      throw new Error(`Invalid PORT value: ${portValue}`);
    }

    return port;
  }

  public getStaticDir(): string {
    const configuredPath = this.get("STATIC_DIR") ?? "../static";
    const staticDir = resolve(this.serverRoot, configuredPath);

    if (!existsSync(staticDir) || !statSync(staticDir).isDirectory()) {
      throw new Error(`Static directory not found: ${staticDir}`);
    }

    return staticDir;
  }

  private get(key: string): string | undefined {
    return this.env[key] ?? process.env[key];
  }

  private loadEnvFile(): EnvMap {
    if (!existsSync(this.envPath)) {
      return {};
    }

    const contents = readFileSync(this.envPath, "utf8");
    const env: EnvMap = {};

    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) {
        continue;
      }

      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      const key = line.slice(0, separatorIndex).trim();
      let value = line.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith("\"") && value.endsWith("\"")) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      env[key] = value;
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }

    return env;
  }
}
