export const SERVICE_TYPES = {
  App: Symbol.for("App"),
  EnvService: Symbol.for("EnvService"),
  HttpService: Symbol.for("HttpService"),
  StaticService: Symbol.for("StaticService")
} as const;
