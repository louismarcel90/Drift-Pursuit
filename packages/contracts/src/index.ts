export type SimulationMode =
  | "training"
  | "pursuit"
  | "intercept"
  | "evasion"
  | "degraded-systems"
  | "replay"
  | "debrief"
  | "showcase";

export type MissionStatus = "not-started" | "running" | "succeeded" | "failed" | "aborted";

export type PlayerCommandKind =
  | "accelerate"
  | "brake"
  | "steer-left"
  | "steer-right"
  | "handbrake"
  | "pause"
  | "resume";

export type PlayerCommand = {
  readonly kind: PlayerCommandKind;
  readonly tick: number;
};

export type SimulationEventKind =
  | "mission-started"
  | "mission-ended"
  | "vehicle-updated"
  | "target-updated"
  | "pursuit-lock-acquired"
  | "pursuit-lock-lost"
  | "collision-detected"
  | "degraded-mode-activated";

export type SimulationEvent = {
  readonly kind: SimulationEventKind;
  readonly tick: number;
  readonly message: string;
};

export type EngineHealthStatus = "nominal" | "degraded" | "failed";

export type SimulationSnapshot = {
  readonly scenarioId: string;
  readonly seed: number;
  readonly tick: number;
  readonly mode: SimulationMode;
  readonly missionStatus: MissionStatus;
  readonly healthStatus: EngineHealthStatus;
};