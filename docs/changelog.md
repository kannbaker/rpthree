# Changelog

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
