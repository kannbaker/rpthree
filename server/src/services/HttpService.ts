import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import { inject, injectable } from "inversify";

import { SERVICE_TYPES } from "../container/serviceTypes";
import type { EnvService } from "./EnvService";
import type { StaticService } from "./StaticService";

@injectable()
export class HttpService {
  public constructor(
    @inject(SERVICE_TYPES.EnvService) private readonly envService: EnvService,
    @inject(SERVICE_TYPES.StaticService) private readonly staticService: StaticService
  ) {}

  public async start(): Promise<void> {
    const port = this.envService.getPort();
    const staticDir = this.staticService.getStaticDir();

    const server = createServer((request, response) => {
      void this.handleRequest(request, response);
    });

    await new Promise<void>((resolvePromise) => {
      server.listen(port, () => {
        console.log(`Static proxy server is listening on http://localhost:${port}`);
        console.log(`Serving /static/* from ${staticDir}`);
        resolvePromise();
      });
    });
  }

  private async handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const method = request.method ?? "GET";
    if (method !== "GET" && method !== "HEAD") {
      response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Method Not Allowed");
      return;
    }

    const requestUrl = request.url ?? "/";
    if (!this.isStaticRoute(requestUrl)) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }

    if (method === "HEAD") {
      await this.staticService.respondHead(requestUrl, response);
      return;
    }

    await this.staticService.serve(requestUrl, response);
  }

  private isStaticRoute(urlPath: string): boolean {
    const pathname = urlPath.split("?")[0];
    return pathname === "/static" || pathname === "/static/" || pathname.startsWith("/static/");
  }
}
