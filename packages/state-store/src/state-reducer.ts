import type { MissionStatus, SimulationEvent } from "@drift-pursuit-grid/contracts";
import type { PlayerVehicle, PursuitState, TrafficVehicle } from "@drift-pursuit-grid/domain";

import type { AuthoritativeSimulationState } from "./authoritative-state.js";
import { assertAuthoritativeStateIsValid } from "./state-guards.js";

export type StateTransition =
  | {
      readonly kind: "advance-tick";
      readonly tick: number;
    }
  | {
      readonly kind: "replace-player-vehicle";
      readonly playerVehicle: PlayerVehicle;
    }
  | {
      readonly kind: "replace-traffic-vehicles";
      readonly trafficVehicles: readonly TrafficVehicle[];
    }
  | {
      readonly kind: "replace-pursuit-state";
      readonly pursuitState: PursuitState;
    }
  | {
      readonly kind: "append-events";
      readonly events: readonly SimulationEvent[];
    }
  | {
      readonly kind: "set-mission-status";
      readonly missionStatus: MissionStatus;
    };

export function reduceAuthoritativeState(
  state: AuthoritativeSimulationState,
  transition: StateTransition,
): AuthoritativeSimulationState {
  const nextState = applyTransition(state, transition);

  assertAuthoritativeStateIsValid(nextState);

  return nextState;
}

function applyTransition(
  state: AuthoritativeSimulationState,
  transition: StateTransition,
): AuthoritativeSimulationState {
  switch (transition.kind) {
    case "advance-tick":
      return {
        ...state,
        tick: transition.tick,
      };

    case "replace-player-vehicle":
      return {
        ...state,
        playerVehicle: transition.playerVehicle,
      };

    case "replace-traffic-vehicles":
      return {
        ...state,
        trafficVehicles: transition.trafficVehicles,
      };

    case "replace-pursuit-state":
      return {
        ...state,
        pursuitState: transition.pursuitState,
      };

    case "append-events":
      return {
        ...state,
        events: [...state.events, ...transition.events],
      };

    case "set-mission-status":
      return {
        ...state,
        missionStatus: transition.missionStatus,
        missionProgress: {
          ...state.missionProgress,
          status: transition.missionStatus,
        },
      };
  }
}