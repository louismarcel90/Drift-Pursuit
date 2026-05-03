export * from "./simulation-event.js";

export type SimulationEvent =
  | MissionStartedEvent
  | PlayerCommandAcceptedEvent
  | TrafficUpdatedEvent;

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