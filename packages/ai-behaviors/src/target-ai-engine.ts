import type { DeterministicRng } from "@drift-pursuit-grid/deterministic-rng";
import type { PursuitState, TargetVehicle, TrafficVehicle } from "@drift-pursuit-grid/domain";

import { defaultTargetAiConfig } from "./target-ai-config.js";
import type { TargetAiConfig } from "./target-ai-config.js";
import { defaultTargetAiProfile } from "./target-ai-profile.js";
import type { TargetAiProfile } from "./target-ai-profile.js";

export type TargetAiDecisionKind =
  | "hold-line"
  | "increase-speed"
  | "shift-left"
  | "shift-right"
  | "pressure-escape";

export type TargetAiDecision = {
  readonly kind: TargetAiDecisionKind;
  readonly reason: string;
};

export type TargetAiInput = {
  readonly targetVehicle: TargetVehicle;
  readonly pursuitState: PursuitState;
  readonly trafficVehicles: readonly TrafficVehicle[];
  readonly rng: DeterministicRng;
  readonly config?: TargetAiConfig;
  readonly profile?: TargetAiProfile;
};

export type TargetAiResult = {
  readonly targetVehicle: TargetVehicle;
  readonly decision: TargetAiDecision;
  readonly rng: DeterministicRng;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizeHeadingDegrees(value: number): number {
  const normalized = value % 360;

  if (normalized < 0) {
    return normalized + 360;
  }

  return normalized;
}

function derivePressureFactor(pursuitState: PursuitState, profile: TargetAiProfile): number {
  return clamp(pursuitState.pursuitPressure * profile.pressureSensitivity, 0, 1);
}

function deriveNextSpeed(params: {
  readonly currentSpeed: number;
  readonly pressureFactor: number;
  readonly config: TargetAiConfig;
}): number {
  const boostedSpeed =
    params.config.baseSpeed + params.pressureFactor * params.config.pressureSpeedBoost;

  return clamp(Math.max(params.currentSpeed, boostedSpeed), 0, params.config.maxSpeed);
}

function hasNearbyTraffic(targetVehicle: TargetVehicle, trafficVehicles: readonly TrafficVehicle[]): boolean {
  return trafficVehicles.some((trafficVehicle) => {
    const deltaX = Math.abs(trafficVehicle.position.x - targetVehicle.position.x);
    const deltaY = Math.abs(trafficVehicle.position.y - targetVehicle.position.y);

    return deltaX <= 4 && deltaY <= 1.5;
  });
}

function deriveDecision(params: {
  readonly targetVehicle: TargetVehicle;
  readonly pursuitState: PursuitState;
  readonly trafficVehicles: readonly TrafficVehicle[];
  readonly lateralRoll: boolean;
  readonly lateralDirection: number;
  readonly pressureFactor: number;
  readonly profile: TargetAiProfile;
}): TargetAiDecision {
  const nearbyTraffic = hasNearbyTraffic(params.targetVehicle, params.trafficVehicles);

  if (params.pressureFactor >= 0.7 && !nearbyTraffic) {
    return {
      kind: "pressure-escape",
      reason: "Target increases escape behavior because pursuit pressure is high."
    };
  }

  if (params.pressureFactor >= 0.45) {
    return {
      kind: "increase-speed",
      reason: "Target increases speed because pursuit pressure is rising."
    };
  }

  if (params.lateralRoll && !nearbyTraffic) {
    return {
      kind: params.lateralDirection < 0 ? "shift-left" : "shift-right",
      reason: "Target shifts lane to create pursuit instability."
    };
  }

  return {
    kind: "hold-line",
    reason: nearbyTraffic
      ? "Target holds line because nearby traffic limits maneuvering."
      : "Target holds line because pressure is manageable."
  };
}

function deriveLateralOffset(decision: TargetAiDecision, config: TargetAiConfig): number {
  switch (decision.kind) {
    case "shift-left":
      return -config.maxLateralOffsetPerTick;

    case "shift-right":
      return config.maxLateralOffsetPerTick;

    case "hold-line":
    case "increase-speed":
    case "pressure-escape":
      return 0;
  }
}

function deriveHeadingOffset(decision: TargetAiDecision, config: TargetAiConfig): number {
  switch (decision.kind) {
    case "shift-left":
      return -config.headingChangeDegrees;

    case "shift-right":
      return config.headingChangeDegrees;

    case "hold-line":
    case "increase-speed":
    case "pressure-escape":
      return 0;
  }
}

export function updateTargetAi(input: TargetAiInput): TargetAiResult {
  const config = input.config ?? defaultTargetAiConfig;
  const profile = input.profile ?? defaultTargetAiProfile;

  const pressureFactor = derivePressureFactor(input.pursuitState, profile);
  const [lateralRoll, rngAfterLateralRoll] = input.rng.nextBoolean(config.lateralMoveChance);
  const [lateralDirectionRoll, rngAfterDirectionRoll] = rngAfterLateralRoll.nextBoolean(0.5);
  const lateralDirection = lateralDirectionRoll ? 1 : -1;

  const decision = deriveDecision({
    targetVehicle: input.targetVehicle,
    pursuitState: input.pursuitState,
    trafficVehicles: input.trafficVehicles,
    lateralRoll,
    lateralDirection,
    pressureFactor,
    profile
  });

  const nextSpeed = deriveNextSpeed({
    currentSpeed: input.targetVehicle.dynamics.speed,
    pressureFactor,
    config
  });

  const lateralOffset = deriveLateralOffset(decision, config);
  const headingOffset = deriveHeadingOffset(decision, config);
  const nextHeadingDegrees = normalizeHeadingDegrees(
    input.targetVehicle.dynamics.headingDegrees + headingOffset
  );

  const nextVelocity = {
    x: Number(nextSpeed.toFixed(4)),
    y: Number(lateralOffset.toFixed(4))
  };

  const nextTargetVehicle: TargetVehicle = {
    ...input.targetVehicle,
    position: {
      x: Number((input.targetVehicle.position.x + nextVelocity.x * 0.2).toFixed(4)),
      y: Number((input.targetVehicle.position.y + nextVelocity.y).toFixed(4))
    },
    dynamics: {
      ...input.targetVehicle.dynamics,
      speed: nextSpeed,
      headingDegrees: nextHeadingDegrees,
      velocity: nextVelocity,
      controlState: decision.kind === "hold-line" ? "stable" : "recovering"
    }
  };

  return {
    targetVehicle: nextTargetVehicle,
    decision,
    rng: rngAfterDirectionRoll
  };
}