export * from "./simulation-event.js";

export type SimulationEvent =
  | SimulationStartedEvent
  | SimulationStoppedEvent
  | TickAdvancedEvent;

export type SimulationStartedEvent = {
  type: "simulation.started";
  scenarioId: string;
  seed: number;
};

export type SimulationStoppedEvent = {
  type: "simulation.stopped";
};

export type TickAdvancedEvent = {
  type: "simulation.tick_advanced";
  tick: number;
};