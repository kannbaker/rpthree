import fastify, { type FastifyInstance } from "fastify";

import { inject, injectable } from "inversify";

import { SERVICE_TYPES } from "../container/serviceTypes";
import type { EnvService } from "./EnvService";
import type { StaticService } from "./StaticService";

@injectable()
export class HttpService {
  private app: FastifyInstance | null = null;

  public constructor(
    @inject(SERVICE_TYPES.EnvService) private readonly envService: EnvService,
    @inject(SERVICE_TYPES.StaticService) private readonly staticService: StaticService
  ) {}

  public async start(): Promise<void> {
    if (this.app !== null) {
      throw new Error("HTTP server is already started");
    }

    const app = fastify({ logger: false });
    const port = this.envService.getPort();
    const staticDir = this.envService.getStaticDir();

    try {
      app.setNotFoundHandler(async (_request, reply) => {
        reply.code(404).type("text/plain; charset=utf-8").send("Not Found");
      });

      await this.staticService.start(app, staticDir);
      await app.listen({ port, host: "0.0.0.0" });
      this.app = app;

      console.log(`Static proxy server is listening on http://localhost:${port}`);
      console.log(`Serving /static/* from ${staticDir}`);
    } catch (error: unknown) {
      await app.close().catch(() => undefined);
      this.app = null;
      throw error;
    }
  }

  public async stop(): Promise<void> {
    const app = this.app;
    this.app = null;

    if (app === null) {
      return;
    }

    await app.close();
  }
}
