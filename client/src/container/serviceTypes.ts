export const SERVICE_TYPES = {
  App: Symbol.for("App"),
  LayoutService: Symbol.for("LayoutService"),
  ResourceLoaderService: Symbol.for("ResourceLoaderService"),
  Scene: Symbol.for("Scene"),
  WebGLRenderer: Symbol.for("WebGLRenderer")
} as const;
