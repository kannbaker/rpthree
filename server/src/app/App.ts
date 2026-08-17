import { inject, injectable } from "inversify";

import { SERVICE_TYPES } from "../container/serviceTypes";
import type { HttpService } from "../services/HttpService";

@injectable()
export class App {
  public constructor(
    @inject(SERVICE_TYPES.HttpService) private readonly httpService: HttpService
  ) {}

  public async start(): Promise<void> {
    await this.httpService.start();
  }

  public async stop(): Promise<void> {
    await this.httpService.stop();
  }
}
