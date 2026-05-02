import type { CollisionKind, CollisionSeverity } from "../collision/index.js";
import type { FaultCode, ReasonCode } from "../reasoning/index.js";

export type SimulationEventKind =
  | "mission-started"
  | "mission-ended"
  | "player-command-accepted"
  | "vehicle-updated"
  | "target-updated"
  | "traffic-updated"
  | "incident-created"
  | "pursuit-lock-acquired"
  | "pursuit-lock-lost"
  | "intercept-window-opened"
  | "intercept-window-closed"
  | "collision-detected"
  | "degraded-mode-activated"
  | "degraded-mode-recovered"
  | "replay-checkpoint-created"
  | "replay-divergence-detected"
  | "evidence-pack-created";

export type SimulationEventBase = {
  readonly kind: SimulationEventKind;
  readonly tick: number;
  readonly message: string;
};

export type MissionStartedEvent = SimulationEventBase & {
  readonly kind: "mission-started";
  readonly scenarioId: string;
  readonly seed: number;
};

export type MissionEndedEvent = SimulationEventBase & {
  readonly kind: "mission-ended";
  readonly reasonCode: ReasonCode;
};

export type CollisionDetectedEvent = SimulationEventBase & {
  readonly kind: "collision-detected";
  readonly collisionKind: CollisionKind;
  readonly severity: CollisionSeverity;
};

export type PursuitLockLostEvent = SimulationEventBase & {
  readonly kind: "pursuit-lock-lost";
  readonly reasonCode: ReasonCode;
};

export type DegradedModeActivatedEvent = SimulationEventBase & {
  readonly kind: "degraded-mode-activated";
  readonly faultCode: FaultCode;
};

export type ReplayDivergenceDetectedEvent = SimulationEventBase & {
  readonly kind: "replay-divergence-detected";
  readonly faultCode: "replay-divergence-detected";
  readonly expectedChecksum: string;
  readonly actualChecksum: string;
};

export type GenericSimulationEvent = SimulationEventBase & {
  readonly kind: Exclude<
    SimulationEventKind,
    | "mission-started"
    | "mission-ended"
    | "collision-detected"
    | "pursuit-lock-lost"
    | "degraded-mode-activated"
    | "replay-divergence-detected"
  >;
};

export type SimulationEvent =
  | MissionStartedEvent
  | MissionEndedEvent
  | CollisionDetectedEvent
  | PursuitLockLostEvent
  | DegradedModeActivatedEvent
  | ReplayDivergenceDetectedEvent
  | GenericSimulationEvent;