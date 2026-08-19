# Changelog

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
