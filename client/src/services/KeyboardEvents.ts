import { injectable } from "inversify";

export type KeyboardEventType = "keydown" | "keyup";

export interface KeyboardInputEvent {
  code: string;
  event: KeyboardEvent;
  repeat: boolean;
  type: KeyboardEventType;
}

export type KeyboardEventListener = (keyboardEvent: KeyboardInputEvent) => void;

@injectable()
export class KeyboardEvents {
  private readonly listeners = new Set<KeyboardEventListener>();

  public constructor() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  public subscribe(listener: KeyboardEventListener): void {
    this.listeners.add(listener);
  }

  public unsubscribe(listener: KeyboardEventListener): void {
    this.listeners.delete(listener);
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    this.emit({
      code: event.code,
      event,
      repeat: event.repeat,
      type: "keydown"
    });
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    this.emit({
      code: event.code,
      event,
      repeat: event.repeat,
      type: "keyup"
    });
  };

  private emit(keyboardEvent: KeyboardInputEvent): void {
    for (const listener of this.listeners) {
      listener(keyboardEvent);
    }
  }
}
