import type { CollisionResult } from "@drift-pursuit-grid/contracts";
import type { PlayerVehicle, TargetVehicle, TrafficVehicle } from "@drift-pursuit-grid/domain";

import { defaultCollisionEngineConfig, type CollisionEngineConfig } from "./collision-config.js";
import { applyCollisionEffects } from "./collision-effects.js";
import { createCollisionCandidates, detectNearestCollision } from "./collision-detection.js";

export type CollisionEngineInput = {
  readonly playerVehicle: PlayerVehicle;
  readonly targetVehicle?: TargetVehicle;
  readonly trafficVehicles: readonly TrafficVehicle[];
  readonly config?: CollisionEngineConfig;
};

export type CollisionEngineResult = {
  readonly playerVehicle: PlayerVehicle;
  readonly collided: boolean;
  readonly collidedActorId?: string;
  readonly collisionResult: CollisionResult;
};

export function updateCollisionEngine(input: CollisionEngineInput): CollisionEngineResult {
  const config = input.config ?? defaultCollisionEngineConfig;

  const detectionResult = detectNearestCollision({
    playerVehicle: input.playerVehicle,
    candidates: createCollisionCandidates({
      ...(input.targetVehicle !== undefined && {
        targetVehicle: input.targetVehicle,
      }),
      trafficVehicles: input.trafficVehicles,
    }),
    config,
  });
  if (!detectionResult.collided) {
    return {
      playerVehicle: input.playerVehicle,
      collided: false,
      collisionResult: {
        kind: "none",
        severity: "minor",
        speedPenalty: 0,
        controlPenalty: 0,
      },
    };
  }

  const effectResult = applyCollisionEffects({
    playerVehicle: input.playerVehicle,
    collisionKind: detectionResult.collisionKind,
    severity: detectionResult.severity,
  });

  return {
    playerVehicle: effectResult.playerVehicle,
    collided: true,
    collidedActorId: detectionResult.actorId ?? "unknown-actor",
    collisionResult: effectResult.collisionResult,
  };
}
