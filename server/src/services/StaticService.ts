import fastifyStatic from "@fastify/static";
import { type FastifyInstance } from "fastify";

import { injectable } from "inversify";

@injectable()
export class StaticService {
  public async start(app: FastifyInstance, staticDir: string): Promise<void> {
    await app.register(fastifyStatic, {
      root: staticDir,
      prefix: "/static/",
      decorateReply: false
    });
  }
}
