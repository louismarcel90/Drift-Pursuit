import type { CollisionResult, CollisionSeverity } from "@drift-pursuit-grid/contracts";
import type { PlayerVehicle } from "@drift-pursuit-grid/domain";

export type CollisionEffectResult = {
  readonly playerVehicle: PlayerVehicle;
  readonly collisionResult: CollisionResult;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function deriveSpeedPenalty(severity: CollisionSeverity): number {
  switch (severity) {
    case "minor":
      return 1.5;

    case "moderate":
      return 3.5;

    case "severe":
      return 6;

    case "critical":
      return 9;
  }
}

function deriveControlPenalty(severity: CollisionSeverity): number {
  switch (severity) {
    case "minor":
      return 0.12;

    case "moderate":
      return 0.28;

    case "severe":
      return 0.45;

    case "critical":
      return 0.65;
  }
}

export function applyCollisionEffects(params: {
  readonly playerVehicle: PlayerVehicle;
  readonly collisionKind: CollisionResult["kind"];
  readonly severity: CollisionSeverity;
}): CollisionEffectResult {
  const speedPenalty = deriveSpeedPenalty(params.severity);
  const controlPenalty = deriveControlPenalty(params.severity);

  const nextSpeed = clamp(params.playerVehicle.dynamics.speed - speedPenalty, 0, 12);
  const nextControlLevel = clamp(
    params.playerVehicle.dynamics.controlLevel - controlPenalty,
    0,
    1,
  );

  const nextControlState = nextControlLevel <= 0.4 ? "control-lost" : "recovering";

  return {
    playerVehicle: {
      ...params.playerVehicle,
      dynamics: {
        ...params.playerVehicle.dynamics,
        speed: nextSpeed,
        velocity: {
          x: Number((params.playerVehicle.dynamics.velocity.x * 0.45).toFixed(4)),
          y: Number((params.playerVehicle.dynamics.velocity.y * 0.45).toFixed(4)),
        },
        controlLevel: nextControlLevel,
        controlState: nextControlState,
      },
    },
    collisionResult: {
      kind: params.collisionKind,
      severity: params.severity,
      speedPenalty,
      controlPenalty,
    },
  };
}