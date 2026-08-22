export const SERVICE_TYPES = {
  App: Symbol.for("App"),
  KeyboardEvents: Symbol.for("KeyboardEvents"),
  LayoutService: Symbol.for("LayoutService"),
  MouseEvents: Symbol.for("MouseEvents"),
  ResourceFactoryBuilder: Symbol.for("ResourceFactoryBuilder"),
  Scene: Symbol.for("Scene"),
  StatsService: Symbol.for("StatsService"),
  WebGLRenderer: Symbol.for("WebGLRenderer")
} as const;
