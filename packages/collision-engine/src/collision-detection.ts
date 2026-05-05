import type { CollisionKind, CollisionSeverity } from "@drift-pursuit-grid/contracts";
import type {
  GridPosition,
  PlayerVehicle,
  TargetVehicle,
  TrafficVehicle,
} from "@drift-pursuit-grid/domain";

import { defaultCollisionEngineConfig } from "./collision-config.js";
import type { CollisionEngineConfig } from "./collision-config.js";

export type CollisionActorKind = "target" | "traffic";

export type CollisionCandidate = {
  readonly actorKind: CollisionActorKind;
  readonly actorId: string;
  readonly position: GridPosition;
  readonly speed: number;
};

export type CollisionDetectionResult = {
  readonly collided: boolean;
  readonly actorKind?: CollisionActorKind;
  readonly actorId?: string;
  readonly collisionKind: CollisionKind;
  readonly severity: CollisionSeverity;
  readonly impactSpeed: number;
  readonly distance: number;
};

function calculateDistance(first: GridPosition, second: GridPosition): number {
  const deltaX = first.x - second.x;
  const deltaY = first.y - second.y;

  return Number(Math.sqrt(deltaX * deltaX + deltaY * deltaY).toFixed(4));
}

function deriveCollisionKind(actorKind: CollisionActorKind): CollisionKind {
  switch (actorKind) {
    case "target":
      return "front-impact";

    case "traffic":
      return "traffic-scrape";
  }
}

function deriveCollisionSeverity(
  impactSpeed: number,
  config: CollisionEngineConfig,
): CollisionSeverity {
  if (impactSpeed >= config.severeSpeedThreshold) {
    return "severe";
  }

  if (impactSpeed >= config.moderateSpeedThreshold) {
    return "moderate";
  }

  if (impactSpeed >= config.minorSpeedThreshold) {
    return "minor";
  }

  return "minor";
}

export function createCollisionCandidates(params: {
  readonly targetVehicle?: TargetVehicle;
  readonly trafficVehicles: readonly TrafficVehicle[];
}): readonly CollisionCandidate[] {
  const targetCandidates: readonly CollisionCandidate[] =
    params.targetVehicle === undefined
      ? []
      : [
          {
            actorKind: "target",
            actorId: params.targetVehicle.identity.id,
            position: params.targetVehicle.position,
            speed: params.targetVehicle.dynamics.speed,
          },
        ];

  const trafficCandidates = params.trafficVehicles.map(
    (vehicle): CollisionCandidate => ({
      actorKind: "traffic",
      actorId: vehicle.identity.id,
      position: vehicle.position,
      speed: vehicle.dynamics.speed,
    }),
  );

  return [...targetCandidates, ...trafficCandidates];
}

export function detectNearestCollision(params: {
  readonly playerVehicle: PlayerVehicle;
  readonly candidates: readonly CollisionCandidate[];
  readonly config?: CollisionEngineConfig;
}): CollisionDetectionResult {
  const config = params.config ?? defaultCollisionEngineConfig;

  const nearestCandidate = params.candidates
    .map((candidate) => ({
      candidate,
      distance: calculateDistance(params.playerVehicle.position, candidate.position),
    }))
    .filter((entry) => entry.distance <= config.contactDistance)
    .sort((first, second) => first.distance - second.distance)[0];

  if (nearestCandidate === undefined) {
    return {
      collided: false,
      collisionKind: "none",
      severity: "minor",
      impactSpeed: 0,
      distance: Number.POSITIVE_INFINITY,
    };
  }

  const impactSpeed = Math.abs(
    params.playerVehicle.dynamics.speed - nearestCandidate.candidate.speed,
  );

  return {
    collided: true,
    actorKind: nearestCandidate.candidate.actorKind,
    actorId: nearestCandidate.candidate.actorId,
    collisionKind: deriveCollisionKind(nearestCandidate.candidate.actorKind),
    severity: deriveCollisionSeverity(impactSpeed, config),
    impactSpeed,
    distance: nearestCandidate.distance,
  };
}
