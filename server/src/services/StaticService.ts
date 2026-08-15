import { createReadStream } from "node:fs";
import { promises as fs } from "node:fs";
import { type ServerResponse } from "node:http";
import { extname, isAbsolute, join, normalize, relative, resolve } from "node:path";

import { inject, injectable } from "inversify";

import { SERVICE_TYPES } from "../container/serviceTypes";
import type { EnvService } from "./EnvService";

@injectable()
export class StaticService {
  public constructor(
    @inject(SERVICE_TYPES.EnvService) private readonly envService: EnvService
  ) {}

  public getStaticDir(): string {
    return this.envService.getStaticDir();
  }

  public async serve(urlPath: string, response: ServerResponse): Promise<void> {
    const staticDir = this.envService.getStaticDir();
    const filePath = await this.toFilePath(staticDir, urlPath);

    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": this.getContentType(filePath),
      "Cache-Control": "no-cache"
    });

    createReadStream(filePath).pipe(response);
  }

  public respondHead(urlPath: string, response: ServerResponse): Promise<void> {
    return this.respondMetadata(urlPath, response);
  }

  private async respondMetadata(urlPath: string, response: ServerResponse): Promise<void> {
    const staticDir = this.envService.getStaticDir();
    const filePath = await this.toFilePath(staticDir, urlPath);

    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": this.getContentType(filePath),
      "Cache-Control": "no-cache"
    });
    response.end();
  }

  private getContentType(filePath: string): string {
    switch (extname(filePath).toLowerCase()) {
      case ".html":
        return "text/html; charset=utf-8";
      case ".css":
        return "text/css; charset=utf-8";
      case ".js":
        return "application/javascript; charset=utf-8";
      case ".json":
        return "application/json; charset=utf-8";
      case ".png":
        return "image/png";
      case ".jpg":
      case ".jpeg":
        return "image/jpeg";
      case ".gif":
        return "image/gif";
      case ".svg":
        return "image/svg+xml";
      case ".ico":
        return "image/x-icon";
      case ".txt":
        return "text/plain; charset=utf-8";
      case ".map":
        return "application/json; charset=utf-8";
      default:
        return "application/octet-stream";
    }
  }

  private async toFilePath(staticDir: string, urlPath: string): Promise<string | null> {
    let decodedPath: string;
    try {
      decodedPath = decodeURIComponent(urlPath.split("?")[0]);
    } catch {
      return null;
    }

    const requestedPath = this.stripStaticPrefix(decodedPath);
    if (requestedPath === null) {
      return null;
    }

    const normalizedPath = normalize(requestedPath);
    const resolvedPath = resolve(staticDir, `.${normalizedPath}`);
    const relativePath = relative(staticDir, resolvedPath);

    if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
      return null;
    }

    try {
      const stats = await fs.stat(resolvedPath);
      if (stats.isDirectory()) {
        const indexPath = join(resolvedPath, "index.html");
        const indexStats = await fs.stat(indexPath);
        if (!indexStats.isFile()) {
          return null;
        }
        return indexPath;
      }

      if (!stats.isFile()) {
        return null;
      }

      return resolvedPath;
    } catch {
      return null;
    }
  }

  private stripStaticPrefix(pathname: string): string | null {
    if (pathname === "/static" || pathname === "/static/") {
      return "/index.html";
    }

    if (!pathname.startsWith("/static/")) {
      return null;
    }

    return pathname.slice("/static".length);
  }
}
