import type { CollisionKind, CollisionSeverity } from "../collision/index.js";

export * from "./simulation-event.js";

export type SimulationEvent =
  | MissionStartedEvent
  | PlayerCommandAcceptedEvent
  | TrafficUpdatedEvent
  | VehicleUpdatedEvent
  | PursuitLockLostEvent
  | InterceptWindowOpenedEvent
  | PursuitLockAcquiredEvent
  | CollisionDetectedEvent
  | TargetUpdatedEvent
  | IncidentCreatedEvent;

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