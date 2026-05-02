export * from "./simulation-snapshot.js";

export type PlayerVehicle = {
  id: string;
  x: number;
  y: number;
  speed: number;
  headingDegrees: number;
  driftFactor: number;
  controlLevel: number;
};

export type SimulationSnapshot = {
  scenarioId: string;
  seed: number;
  tick: number;
  mode: string;
  missionStatus: string;
  healthStatus: string;

  playerVehicle: PlayerVehicle;
  degradedModes: string[];
};