import type { CollisionKind, CollisionSeverity } from "../collision/index.js";

export * from "./simulation-event.js";

export type SimulationEvent =
  | MissionStartedEvent
  | MissionEndedEvent
  | PlayerCommandAcceptedEvent
  | TrafficUpdatedEvent
  | VehicleUpdatedEvent
  | PursuitLockLostEvent
  | PursuitLockAcquiredEvent
  | InterceptWindowOpenedEvent
  | InterceptWindowClosedEvent
  | CollisionDetectedEvent
  | TargetUpdatedEvent
  | IncidentCreatedEvent
  | DegradedModeActivatedEvent
  | DegradedModeRecoveredEvent
  | ReplayDivergenceDetectedEvent
  | ReplayCheckpointCreatedEvent
  | EvidencePackCreatedEvent;

export type MissionStartedEvent = {
  kind: "mission-started";
  tick: number;
  message: string;
  scenarioId: string;
  seed: number;
};

export type PlayerCommandAcceptedEvent = {
  kind: "player-command-accepted";
  tick: number;
  message: string;
};

export type TrafficUpdatedEvent = {
  kind: "traffic-updated";
  tick: number;
  message: string;
};

export type VehicleUpdatedEvent = {
  kind: "vehicle-updated";
  tick: number;
  message: string;
};

export type PursuitLockLostEvent = {
  kind: "pursuit-lock-lost";
  tick: number;
  message: string;
  reasonCode: "target-distance-exceeded";
};

export type InterceptWindowOpenedEvent = {
  kind: "intercept-window-opened";
  tick: number;
  message: string;
};

export type PursuitLockAcquiredEvent = {
  kind: "pursuit-lock-acquired";
  tick: number;
  message: string;
};

export type CollisionDetectedEvent = {
  kind: "collision-detected";
  tick: number;
  message: string;
  collisionKind: CollisionKind;
  severity: CollisionSeverity;
};

export type TargetUpdatedEvent = {
  kind: "target-updated";
  tick: number;
  message: string;
};

export type IncidentCreatedEvent = {
  kind: "incident-created";
  tick: number;
  message: string;
  incidentId: string;
};

export type MissionEndedEvent = {
  kind: "mission-ended";
  tick: number;
  message: string;
  reasonCode: string;
};

export type DegradedModeActivatedEvent = {
  kind: "degraded-mode-activated";
  tick: number;
  message: string;
  faultCode: string;
};

export type DegradedModeRecoveredEvent = {
  kind: "degraded-mode-recovered";
  tick: number;
  message: string;
};

export type ReplayDivergenceDetectedEvent = {
  kind: "replay-divergence-detected";
  tick: number;
  message: string;
};

export type ReplayCheckpointCreatedEvent = {
  kind: "replay-checkpoint-created";
  tick: number;
  message: string;
};

export type EvidencePackCreatedEvent = {
  kind: "evidence-pack-created";
  tick: number;
  message: string;
};

export type InterceptWindowClosedEvent = {
  kind: "intercept-window-closed";
  tick: number;
  message: string;
};
