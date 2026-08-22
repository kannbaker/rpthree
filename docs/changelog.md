# Changelog

## v1.0.10

- added singleton `MouseEvents` service
- added `PlayerCameraControlsScenario` for mouse drag orbit and wheel zoom
- moved camera orbit state updates into the camera control scenario
- changed `MainCameraComponent` to apply precomputed orbit state in the render loop
- updated `client-arch.md` with `MouseEvents`

## v1.0.9

- moved the main camera into `MainCameraComponent`
- replaced `FollowPlayerCameraScenario` with `FollowPlayerScenario`
- removed `tick(...)` from the `Scenario` interface and all scenario implementations

## v1.0.8

- added forward movement during `walk` based on the player character facing direction

## v1.0.7

- split `SceneComponent` and `SceneComponentFactory`
- added `GroundComponentFactory` and `PlayerCharacterComponentFactory`
- replaced `ResourceLoaderService` with `ResourceFactoryBuilder` and `ResourceFactory`
- `ResourceFactory` now returns cloned resources by source key
- moved player animation playback back into `PlayerCharacterComponent`
- simplified `PlayerControlsScenario` to keyboard input state routing only
- renamed player animation state `gather-objects` to `loot`
- updated client architecture docs with current runtime and scene lifecycle diagrams

## v1.0.6

- added `Scenario` abstraction with `WalkGatherScenario`
- added player states `idle`, `walk`, `gather-objects`
- added `look-around.fbx` as idle animation source
- switched player transitions to `transition(...)` with `crossFade`
- routed non-idle player transitions through intermediate `idle`
- tuned idle and return transition durations for smoother animation changes

## v1.0.5

- added `GroundComponent` to `LostTreasureScene`
- added textured ground via `ResourceLoaderService` image loading
- enabled renderer shadows and directional light shadow setup
- tuned ground texture tiling for a less dense grid

## v1.0.4

- added default character animation playback via `AnimationMixer`
- added `StatsService` FPS overlay
- mounted stats overlay relative to the scene mount node

## v1.0.3

- added `LostTreasureScene`
- added `ResourceLoaderService` with resource cache
- scene/component resource lifecycle switched to `getSources()` + `build(...)`
- rendering now starts only after scene resources are loaded and built
- added `compileAsync` renderer warmup before starting the main render loop

## v1.0.2

- client scene lifecycle switched to `tick(deltaTime)`
- `WebGLRenderer` owns the single render loop
- `SceneComponent` no longer owns per-component `requestAnimationFrame`

## v1.0.1

- express -> fastify
- CameraService removed
- SceneService -> RotatingCubeScene
- Service3D -> WebGLRenderer
- Scene and SceneComponent moved to `src/types`
- scene components moved to `src/scene-components`

## v1.0.0

- static server
- client threejs cube scene
