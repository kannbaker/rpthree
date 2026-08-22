import { MathUtils } from "three";

import type { MainCameraComponent } from "../scene-components/MainCameraComponent";
import type { MouseEventListener, MouseInputEvent } from "../services/MouseEvents";
import type { MouseEvents } from "../services/MouseEvents";
import type { Scenario } from "../types/Scenario";

export class PlayerCameraControlsScenario implements Scenario<MainCameraComponent> {
  private static readonly DEFAULT_YAW = 0;
  private static readonly DEFAULT_PITCH = MathUtils.degToRad(29);
  private static readonly DEFAULT_DISTANCE = 250;
  private static readonly MIN_PITCH = MathUtils.degToRad(10);
  private static readonly MAX_PITCH = MathUtils.degToRad(75);
  private static readonly MIN_DISTANCE = 120;
  private static readonly MAX_DISTANCE = 420;
  private static readonly ROTATION_SENSITIVITY = 0.01;
  private static readonly ZOOM_SENSITIVITY = 0.2;
  private mainCamera: MainCameraComponent | null = null;
  private isDragging = false;
  private yaw = PlayerCameraControlsScenario.DEFAULT_YAW;
  private pitch = PlayerCameraControlsScenario.DEFAULT_PITCH;
  private distance = PlayerCameraControlsScenario.DEFAULT_DISTANCE;

  public constructor(private readonly mouseEvents: MouseEvents) {}

  public start(mainCamera: MainCameraComponent): void {
    this.stop();
    this.mainCamera = mainCamera;
    this.yaw = PlayerCameraControlsScenario.DEFAULT_YAW;
    this.pitch = PlayerCameraControlsScenario.DEFAULT_PITCH;
    this.distance = PlayerCameraControlsScenario.DEFAULT_DISTANCE;
    this.mainCamera.setOrbitState(this.yaw, this.pitch, this.distance);
    this.mouseEvents.subscribe(this.handleMouseEvent);
  }

  public stop(): void {
    this.mouseEvents.unsubscribe(this.handleMouseEvent);
    this.isDragging = false;
    this.mainCamera = null;
  }

  private readonly handleMouseEvent: MouseEventListener = (mouseEvent: MouseInputEvent): void => {
    switch (mouseEvent.type) {
      case "mousedown":
        this.handleMouseDown(mouseEvent);
        return;
      case "mouseup":
        this.handleMouseUp(mouseEvent);
        return;
      case "mousemove":
        this.handleMouseMove(mouseEvent);
        return;
      case "wheel":
        this.handleWheel(mouseEvent);
        return;
    }
  };

  private handleMouseDown(mouseEvent: MouseInputEvent): void {
    if (mouseEvent.button !== 0) {
      return;
    }

    mouseEvent.event.preventDefault();
    this.isDragging = true;
  }

  private handleMouseUp(mouseEvent: MouseInputEvent): void {
    if (mouseEvent.button !== 0) {
      return;
    }

    this.isDragging = false;
  }

  private handleMouseMove(mouseEvent: MouseInputEvent): void {
    if (!this.isDragging || this.mainCamera === null) {
      return;
    }

    mouseEvent.event.preventDefault();
    this.yaw -= mouseEvent.deltaX * PlayerCameraControlsScenario.ROTATION_SENSITIVITY;
    this.pitch = MathUtils.clamp(
      this.pitch + mouseEvent.deltaY * PlayerCameraControlsScenario.ROTATION_SENSITIVITY,
      PlayerCameraControlsScenario.MIN_PITCH,
      PlayerCameraControlsScenario.MAX_PITCH
    );
    this.mainCamera.setOrbitState(this.yaw, this.pitch, this.distance);
  }

  private handleWheel(mouseEvent: MouseInputEvent): void {
    if (this.mainCamera === null) {
      return;
    }

    mouseEvent.event.preventDefault();
    this.distance = MathUtils.clamp(
      this.distance + mouseEvent.deltaY * PlayerCameraControlsScenario.ZOOM_SENSITIVITY,
      PlayerCameraControlsScenario.MIN_DISTANCE,
      PlayerCameraControlsScenario.MAX_DISTANCE
    );
    this.mainCamera.setOrbitState(this.yaw, this.pitch, this.distance);
  }
}
