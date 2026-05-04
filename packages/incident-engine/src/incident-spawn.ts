import type { DeterministicRng } from "@drift-pursuit-grid/deterministic-rng";
import type { GridPosition, Incident, IncidentKind, IncidentSeverity } from "@drift-pursuit-grid/domain";

import type { IncidentEngineConfig } from "./incident-config.js";

export type IncidentSpawnResult = {
  readonly incidents: readonly Incident[];
  readonly rng: DeterministicRng;
  readonly createdIncident?: Incident;
};

const incidentKinds: readonly IncidentKind[] = [
  "stalled-vehicle",
  "lane-blockage",
  "minor-crash",
  "road-work",
  "reduced-visibility-zone",
  "surface-low-grip"
];

const incidentSeverities: readonly IncidentSeverity[] = ["low", "medium", "high"];

function createIncidentId(tick: number, sequence: number): string {
  return `incident-${tick}-${sequence}`;
}

function createIncidentPosition(
  playerPosition: GridPosition,
  laneOffset: number,
  forwardOffset: number
): GridPosition {
  return {
    x: playerPosition.x + forwardOffset,
    y: playerPosition.y + laneOffset
  };
}

function getIncidentKind(index: number): IncidentKind {
  return incidentKinds[index] ?? "stalled-vehicle";
}

function getIncidentSeverity(index: number): IncidentSeverity {
  return incidentSeverities[index] ?? "low";
}

export function maybeSpawnIncident(params: {
  readonly tick: number;
  readonly playerPosition: GridPosition;
  readonly activeIncidents: readonly Incident[];
  readonly rng: DeterministicRng;
  readonly config: IncidentEngineConfig;
}): IncidentSpawnResult {
  const { tick, playerPosition, activeIncidents, rng, config } = params;

  if (activeIncidents.length >= config.maxActiveIncidents) {
    return {
      incidents: activeIncidents,
      rng
    };
  }

  const [shouldSpawn, rngAfterSpawnRoll] = rng.nextBoolean(config.spawnChancePerTick);

  if (!shouldSpawn) {
    return {
      incidents: activeIncidents,
      rng: rngAfterSpawnRoll
    };
  }

  const [kindIndex, rngAfterKind] = rngAfterSpawnRoll.nextInt(0, incidentKinds.length - 1);
  const [severityIndex, rngAfterSeverity] = rngAfterKind.nextInt(0, incidentSeverities.length - 1);
  const [laneOffset, rngAfterLane] = rngAfterSeverity.nextInt(-1, 1);
  const [forwardOffset, rngAfterOffset] = rngAfterLane.nextInt(
    config.minForwardOffset,
    config.maxForwardOffset
  );
  const [durationTicks, rngAfterDuration] = rngAfterOffset.nextInt(
    config.minDurationTicks,
    config.maxDurationTicks
  );

  const incident: Incident = {
    id: createIncidentId(tick, activeIncidents.length + 1),
    kind: getIncidentKind(kindIndex),
    severity: getIncidentSeverity(severityIndex),
    status: "active",
    position: createIncidentPosition(playerPosition, laneOffset, forwardOffset),
    startsAtTick: tick,
    endsAtTick: tick + durationTicks
  };

  return {
    incidents: [...activeIncidents, incident],
    rng: rngAfterDuration,
    createdIncident: incident
  };
}