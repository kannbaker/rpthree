import { Object3D } from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

export function cloneResource<T>(resource: T): T {
  if (resource instanceof Object3D) {
    return cloneSkeleton(resource) as T;
  }

  if (
    typeof resource === "object" &&
    resource !== null &&
    "clone" in resource &&
    typeof (resource as { clone: () => unknown }).clone === "function"
  ) {
    return (resource as { clone: () => T }).clone();
  }

  return resource;
}
