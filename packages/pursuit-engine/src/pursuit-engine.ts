import type { ReasonCode } from "@drift-pursuit-grid/contracts";
import type { GridPosition, PursuitState, TargetVehicle, PlayerVehicle } from "@drift-pursuit-grid/domain";

import { defaultPursuitEngineConfig } from "./pursuit-config.js";
import type { PursuitEngineConfig } from "./pursuit-config.js";

export type PursuitEngineInput = {
  readonly playerVehicle: PlayerVehicle;
  readonly targetVehicle: TargetVehicle;
  readonly previousPursuitState: PursuitState;
  readonly config?: PursuitEngineConfig;
};

export type PursuitEngineResult = {
  readonly pursuitState: PursuitState;
  readonly reasonCode?: ReasonCode;
};

function calculateDistance(first: GridPosition, second: GridPosition): number {
  const deltaX = first.x - second.x;
  const deltaY = first.y - second.y;

  return Number(Math.sqrt(deltaX * deltaX + deltaY * deltaY).toFixed(4));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function derivePursuitPressure(params: {
  readonly previousPressure: number;
  readonly hasLock: boolean;
  readonly config: PursuitEngineConfig;
}): number {
  if (params.hasLock) {
    return clamp(
      params.previousPressure + params.config.pressureGainPerTick,
      0,
      params.config.maxPressure,
    );
  }

  return clamp(params.previousPressure - params.config.pressureLossPerTick, 0, params.config.maxPressure);
}

export function updatePursuitState(input: PursuitEngineInput): PursuitEngineResult {
  const config = input.config ?? defaultPursuitEngineConfig;
  const targetDistance = calculateDistance(
    input.playerVehicle.position,
    input.targetVehicle.position,
  );

  if (targetDistance > config.lockLossDistance) {
    return {
  pursuitState: {
    lockState: "lost",
    targetDistance,
    pursuitPressure: 0,
    interceptWindowOpen: false,
    lastReasonCode: "target-distance-exceeded",
  },
  reasonCode: "target-distance-exceeded",
};
  }

  const hasLock =
    input.previousPursuitState.lockState === "acquired" ||
    targetDistance <= config.lockAcquireDistance;

  const nextPressure = derivePursuitPressure({
    previousPressure: input.previousPursuitState.pursuitPressure,
    hasLock,
    config,
  });

  const interceptWindowOpen =
    hasLock &&
    targetDistance <= config.interceptDistance &&
    nextPressure >= config.interceptPressureMin;

  const reasonCode: ReasonCode | undefined = interceptWindowOpen
  ? "mission-objective-completed"
  : undefined;

return {
  pursuitState: {
    lockState: hasLock ? "acquired" : "not-acquired",
    targetDistance,
    pursuitPressure: nextPressure,
    interceptWindowOpen,
    ...(reasonCode === undefined ? {} : { lastReasonCode: reasonCode }),
  },
  ...(reasonCode === undefined ? {} : { reasonCode }),
};
}