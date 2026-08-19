import { inject, injectable } from "inversify";

import { SERVICE_TYPES } from "../container/serviceTypes";
import type { LayoutService } from "../services/LayoutService";

@injectable()
export class App {
  public constructor(@inject(SERVICE_TYPES.LayoutService) private readonly layoutService: LayoutService) {}

  public async start(): Promise<void> {
    await this.layoutService.start();
  }
}
