import { injectable } from "inversify";

export type MouseEventType = "mousedown" | "mouseup" | "mousemove" | "wheel";

export interface MouseInputEvent {
  button: number;
  deltaX: number;
  deltaY: number;
  event: MouseEvent | WheelEvent;
  type: MouseEventType;
}

export type MouseEventListener = (mouseEvent: MouseInputEvent) => void;

@injectable()
export class MouseEvents {
  private readonly listeners = new Set<MouseEventListener>();

  public constructor() {
    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("wheel", this.handleWheel, { passive: false });
  }

  public subscribe(listener: MouseEventListener): void {
    this.listeners.add(listener);
  }

  public unsubscribe(listener: MouseEventListener): void {
    this.listeners.delete(listener);
  }

  private readonly handleMouseDown = (event: MouseEvent): void => {
    this.emit({
      button: event.button,
      deltaX: 0,
      deltaY: 0,
      event,
      type: "mousedown"
    });
  };

  private readonly handleMouseUp = (event: MouseEvent): void => {
    this.emit({
      button: event.button,
      deltaX: 0,
      deltaY: 0,
      event,
      type: "mouseup"
    });
  };

  private readonly handleMouseMove = (event: MouseEvent): void => {
    this.emit({
      button: event.button,
      deltaX: event.movementX,
      deltaY: event.movementY,
      event,
      type: "mousemove"
    });
  };

  private readonly handleWheel = (event: WheelEvent): void => {
    this.emit({
      button: -1,
      deltaX: 0,
      deltaY: event.deltaY,
      event,
      type: "wheel"
    });
  };

  private emit(mouseEvent: MouseInputEvent): void {
    for (const listener of this.listeners) {
      listener(mouseEvent);
    }
  }
}
