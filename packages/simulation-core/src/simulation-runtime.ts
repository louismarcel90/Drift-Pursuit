import type { PlayerCommand, SimulationEvent, SimulationSnapshot } from "@drift-pursuit-grid/contracts";
import { createDeterministicRng } from "@drift-pursuit-grid/deterministic-rng";
import type { DeterministicRng } from "@drift-pursuit-grid/deterministic-rng";
import {
  createGridPosition,
  createInitialPursuitState,
  createStoppedPlayerVehicle,
  createTargetVehicle,
} from "@drift-pursuit-grid/domain";
import {
  createAuthoritativeSimulationState,
  projectSimulationSnapshot,
  reduceAuthoritativeState,
} from "@drift-pursuit-grid/state-store";
import type { AuthoritativeSimulationState } from "@drift-pursuit-grid/state-store";
import {
  deriveVehicleControlIntent,
  updatePlayerVehicleDynamics,
} from "@drift-pursuit-grid/vehicle-dynamics";

import { simulationPhaseOrder } from "./simulation-phase.js";
import type { SimulationPhase } from "./simulation-phase.js";
import { updateTrafficEngine } from '../../traffic-engine/src/traffic-engine';
import { updatePursuitState } from '../../pursuit-engine/src/pursuit-engine';

export type SimulationRuntimeConfig = {
  readonly scenarioId: string;
  readonly seed: number;
  readonly tickDurationMs: number;
};

export type SimulationRuntimeState = {
  readonly config: SimulationRuntimeConfig;
  readonly rng: DeterministicRng;
  readonly authoritativeState: AuthoritativeSimulationState;
  readonly acceptedCommands: readonly PlayerCommand[];
  readonly executedPhases: readonly SimulationPhase[];
};

export type SimulationTickResult = {
  readonly state: SimulationRuntimeState;
  readonly snapshot: SimulationSnapshot;
};

export function createSimulationRuntime(config: SimulationRuntimeConfig): SimulationRuntimeState {
  const authoritativeState = createAuthoritativeSimulationState({
    scenarioId: config.scenarioId,
    seed: config.seed,
    mode: "showcase",
    playerVehicle: createStoppedPlayerVehicle("player-vehicle", createGridPosition(12, 8)),
    pursuitState: createInitialPursuitState(),
    missionProgress: {
      missionId: config.scenarioId,
      status: "in-progress",
      completedObjectiveIds: [],
    },
  });

  const stateWithTarget = reduceAuthoritativeState(authoritativeState, {
    kind: "replace-target-vehicle",
    targetVehicle: createTargetVehicle("target-vehicle", createGridPosition(24, 8)),
  });

  const missionStartedEvent: SimulationEvent = {
    kind: "mission-started",
    tick: 0,
    message: "Mission runtime initialized.",
    scenarioId: config.scenarioId,
    seed: config.seed,
  };

  const stateWithInitialEvent = reduceAuthoritativeState(stateWithTarget, {
    kind: "append-events",
    events: [missionStartedEvent],
  });

  return {
    config,
    rng: createDeterministicRng(config.seed),
    authoritativeState: stateWithInitialEvent,
    acceptedCommands: [],
    executedPhases: [],
  };
}

export function advanceSimulationTick(
  state: SimulationRuntimeState,
  commands: readonly PlayerCommand[],
): SimulationTickResult {
  const nextTick = state.authoritativeState.tick + 1;
  const acceptedCommands = commands.filter((command) => command.tick === nextTick);
  const controlIntent = deriveVehicleControlIntent(acceptedCommands);

  const updatedPlayerVehicle = updatePlayerVehicleDynamics(
    state.authoritativeState.playerVehicle,
    controlIntent,
  );

  if (state.authoritativeState.targetVehicle === undefined) {
    throw new Error("Simulation target vehicle is required for pursuit evaluation.");
  }

  const pursuitResult = updatePursuitState({
    playerVehicle: updatedPlayerVehicle,
    targetVehicle: state.authoritativeState.targetVehicle,
    previousPursuitState: state.authoritativeState.pursuitState,
  });

  const trafficResult = updateTrafficEngine({
    tick: nextTick,
    playerPosition: updatedPlayerVehicle.position,
    trafficVehicles: state.authoritativeState.trafficVehicles,
    rng: state.rng,
  });

  const commandEvents = acceptedCommands.map(
    (command): SimulationEvent => ({
      kind: "player-command-accepted",
      tick: nextTick,
      message: `Accepted command: ${command.kind}.`,
    }),
  );

  const vehicleEvent: SimulationEvent = {
    kind: "vehicle-updated",
    tick: nextTick,
    message: `Player speed: ${updatedPlayerVehicle.dynamics.speed.toFixed(2)}, drift: ${updatedPlayerVehicle.dynamics.driftFactor.toFixed(2)}.`,
  };

  const pursuitEvent: SimulationEvent =
    pursuitResult.pursuitState.lockState === "lost"
      ? {
          kind: "pursuit-lock-lost",
          tick: nextTick,
          message: "Pursuit lock lost because target distance exceeded limit.",
          reasonCode: "target-distance-exceeded",
        }
      : pursuitResult.pursuitState.interceptWindowOpen
        ? {
            kind: "intercept-window-opened",
            tick: nextTick,
            message: "Intercept window opened.",
          }
        : {
            kind: "pursuit-lock-acquired",
            tick: nextTick,
            message: `Pursuit distance: ${pursuitResult.pursuitState.targetDistance.toFixed(2)}, pressure: ${pursuitResult.pursuitState.pursuitPressure.toFixed(2)}.`,
          };

  const trafficEvent: SimulationEvent = {
    kind: "traffic-updated",
    tick: nextTick,
    message: trafficResult.spawnedVehicle
      ? `Traffic updated with ${trafficResult.trafficVehicles.length} vehicles. New vehicle spawned.`
      : `Traffic updated with ${trafficResult.trafficVehicles.length} vehicles.`,
  };

  const advancedState = reduceAuthoritativeState(state.authoritativeState, {
    kind: "advance-tick",
    tick: nextTick,
  });

  const stateWithUpdatedVehicle = reduceAuthoritativeState(advancedState, {
    kind: "replace-player-vehicle",
    playerVehicle: updatedPlayerVehicle,
  });

  const stateWithUpdatedPursuit = reduceAuthoritativeState(stateWithUpdatedVehicle, {
    kind: "replace-pursuit-state",
    pursuitState: pursuitResult.pursuitState,
  });

  const stateWithUpdatedTraffic = reduceAuthoritativeState(stateWithUpdatedPursuit, {
    kind: "replace-traffic-vehicles",
    trafficVehicles: trafficResult.trafficVehicles,
  });

  const stateWithEvents = reduceAuthoritativeState(stateWithUpdatedTraffic, {
    kind: "append-events",
    events: [...commandEvents, vehicleEvent, pursuitEvent, trafficEvent],
  });

  const nextState: SimulationRuntimeState = {
    ...state,
    rng: trafficResult.rng,
    authoritativeState: stateWithEvents,
    acceptedCommands: [...state.acceptedCommands, ...acceptedCommands],
    executedPhases: [...state.executedPhases, ...simulationPhaseOrder],
  };

  return {
    state: nextState,
    snapshot: projectSimulationSnapshot(nextState.authoritativeState),
  };
}