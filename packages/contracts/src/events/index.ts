export * from "./simulation-event.js";

export type SimulationEvent =
  | MissionStartedEvent
  | PlayerCommandAcceptedEvent
  | TrafficUpdatedEvent
  | VehicleUpdatedEvent
  | PursuitLockLostEvent
  | InterceptWindowOpenedEvent
  | PursuitLockAcquiredEvent;

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