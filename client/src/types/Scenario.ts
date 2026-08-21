export interface Scenario<TTarget = unknown> {
  start(target: TTarget): void;
  stop(): void;
}
