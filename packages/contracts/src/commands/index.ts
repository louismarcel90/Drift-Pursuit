export type SimulationCommand =
  | StartSimulationCommand
  | StopSimulationCommand
  | TickCommand;

export type StartSimulationCommand = {
  type: "simulation.start";
  scenarioId: string;
  seed: number;
};

export type StopSimulationCommand = {
  type: "simulation.stop";
};

export type TickCommand = {
  type: "simulation.tick";
  tick: number;
};