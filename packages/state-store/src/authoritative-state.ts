import type {
  DegradedMode,
  MissionStatus,
  SimulationEvent,
  SimulationMode,
} from "@drift-pursuit-grid/contracts";
import type {
  Incident,
  MissionProgress,
  PlayerVehicle,
  PursuitState,
  TargetVehicle,
  TrafficVehicle,
} from "@drift-pursuit-grid/domain";


export type AuthoritativeSimulationState = {
  readonly scenarioId: string;
  readonly seed: number;
  readonly tick: number;
  readonly mode: SimulationMode;
  readonly missionStatus: MissionStatus;
  readonly playerVehicle: PlayerVehicle;
  readonly targetVehicle?: TargetVehicle;
  readonly trafficVehicles: readonly TrafficVehicle[];
  readonly incidents: readonly Incident[];
  readonly pursuitState: PursuitState;
  readonly missionProgress: MissionProgress;
  readonly degradedModes: readonly DegradedMode[];
  readonly events: readonly SimulationEvent[];
};

export type CreateAuthoritativeStateInput = {
  
  readonly scenarioId: string;
  readonly seed: number;
  readonly mode: SimulationMode;
  readonly playerVehicle: PlayerVehicle;
  readonly pursuitState: PursuitState;
  readonly missionProgress: MissionProgress;
};

export function createAuthoritativeSimulationState(
  input: CreateAuthoritativeStateInput,
): AuthoritativeSimulationState {
  return {
    scenarioId: input.scenarioId,
    seed: input.seed,
    tick: 0,
    mode: input.mode,
    missionStatus: input.missionProgress.status,
    playerVehicle: input.playerVehicle,
    trafficVehicles: [],
    incidents: [],
    pursuitState: input.pursuitState,
    missionProgress: input.missionProgress,
    degradedModes: [],
    events: [],
  };
}