export type SimulationPhase =
  | "collect-commands"
  | "update-player-dynamics"
  | "update-target-ai"
  | "update-traffic"
  | "update-incidents"
  | "resolve-collisions"
  | "evaluate-pursuit"
  | "evaluate-mission"
  | "emit-events"
  | "derive-render-state";

export const simulationPhaseOrder: readonly SimulationPhase[] = [
  "collect-commands",
  "update-player-dynamics",
  "update-target-ai",
  "update-traffic",
  "update-incidents",
  "resolve-collisions",
  "evaluate-pursuit",
  "evaluate-mission",
  "emit-events",
  "derive-render-state",
];
