import { injectable } from "inversify";
import Stats from "three/examples/jsm/libs/stats.module.js";

@injectable()
export class StatsService {
  private readonly stats: Stats;
  private mountNode: HTMLElement | null = null;

  public constructor() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.left = "0";
    this.stats.dom.style.top = "0";
    this.stats.dom.style.zIndex = "10";
  }

  public mount(container: HTMLElement): void {
    if (this.mountNode === container) {
      return;
    }

    this.unmount();
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
    container.appendChild(this.stats.dom);
    this.mountNode = container;
  }

  public unmount(): void {
    this.stats.dom.remove();
    this.mountNode = null;
  }

  public begin(): void {
    this.stats.begin();
  }

  public end(): void {
    this.stats.end();
  }
}
