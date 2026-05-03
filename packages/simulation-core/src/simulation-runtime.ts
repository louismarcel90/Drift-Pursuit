import type { SimulationSnapshot } from "@drift-pursuit-grid/contracts";
import {
  createGridPosition,
  createInitialPursuitState,
  createStoppedPlayerVehicle,
} from "@drift-pursuit-grid/domain";
import type { PlayerVehicle, PursuitState } from "@drift-pursuit-grid/domain";
import { createDeterministicRng } from "@drift-pursuit-grid/deterministic-rng";
import type { DeterministicRng } from "@drift-pursuit-grid/deterministic-rng";

import { simulationPhaseOrder } from "./simulation-phase.js";
import type { SimulationPhase } from "./simulation-phase.js";

export type PlayerCommand = {
  readonly kind:
    | "accelerate"
    | "brake"
    | "steer-left"
    | "steer-right"
    | "handbrake";
  readonly tick: number;
  readonly source: "keyboard" | "script" | "replay";
};

export type RuntimeSimulationEvent = {
  readonly kind:
    | "mission-started"
    | "player-command-accepted"
    | "traffic-updated";
  readonly tick: number;
  readonly message: string;
  readonly scenarioId?: string;
  readonly seed?: number;
};

export type SimulationRuntimeConfig = {
  readonly scenarioId: string;
  readonly seed: number;
  readonly tickDurationMs: number;
};

export type SimulationRuntimeState = {
  readonly config: SimulationRuntimeConfig;
  readonly tick: number;
  readonly rng: DeterministicRng;
  readonly playerVehicle: PlayerVehicle;
  readonly pursuitState: PursuitState;
  readonly acceptedCommands: readonly PlayerCommand[];
  readonly events: readonly RuntimeSimulationEvent[];
  readonly executedPhases: readonly SimulationPhase[];
};

export type SimulationTickResult = {
  readonly state: SimulationRuntimeState;
  readonly snapshot: SimulationSnapshot;
};

export function createSimulationRuntime(
  config: SimulationRuntimeConfig,
): SimulationRuntimeState {
  return {
    config,
    tick: 0,
    rng: createDeterministicRng(config.seed),
    playerVehicle: createStoppedPlayerVehicle(
      "player-vehicle",
      createGridPosition(12, 8),
    ),
    pursuitState: createInitialPursuitState(),
    acceptedCommands: [],
    events: [
      {
        kind: "mission-started",
        tick: 0,
        message: "Mission runtime initialized.",
        scenarioId: config.scenarioId,
        seed: config.seed,
      },
    ],
    executedPhases: [],
  };
}

export function advanceSimulationTick(
  state: SimulationRuntimeState,
  commands: readonly PlayerCommand[],
): SimulationTickResult {
  const nextTick = state.tick + 1;
  const acceptedCommands = commands.filter(
    (command) => command.tick === nextTick,
  );

  const [trafficPressureRoll, nextRng] = state.rng.nextInt(0, 100);

  const commandEvents: readonly RuntimeSimulationEvent[] = acceptedCommands.map(
    (command) => ({
      kind: "player-command-accepted",
      tick: nextTick,
      message: `Accepted command: ${command.kind}.`,
    }),
  );

  const trafficEvent: RuntimeSimulationEvent = {
    kind: "traffic-updated",
    tick: nextTick,
    message: `Traffic pressure roll: ${trafficPressureRoll}.`,
  };

  const nextState: SimulationRuntimeState = {
    ...state,
    tick: nextTick,
    rng: nextRng,
    acceptedCommands: [...state.acceptedCommands, ...acceptedCommands],
    events: [...state.events, ...commandEvents, trafficEvent],
    executedPhases: [...state.executedPhases, ...simulationPhaseOrder],
  };

  return {
    state: nextState,
    snapshot: createSimulationSnapshot(nextState),
  };
}

export function createSimulationSnapshot(
  state: SimulationRuntimeState,
): SimulationSnapshot {
  return {
    scenarioId: state.config.scenarioId,
    seed: state.config.seed,
    tick: state.tick,
    mode: "showcase",
    missionStatus: "running",
    healthStatus: "nominal",
    playerVehicle: {
      id: state.playerVehicle.identity.id,
      x: state.playerVehicle.position.x,
      y: state.playerVehicle.position.y,
      speed: state.playerVehicle.dynamics.speed,
      headingDegrees: state.playerVehicle.dynamics.headingDegrees,
      driftFactor: state.playerVehicle.dynamics.driftFactor,
      controlLevel: state.playerVehicle.dynamics.controlLevel,
    },
    degradedModes: [],
  };
}