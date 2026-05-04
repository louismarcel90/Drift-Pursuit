import type { DeterministicRng } from "@drift-pursuit-grid/deterministic-rng";
import type { GridPosition, Incident } from "@drift-pursuit-grid/domain";

import { defaultIncidentEngineConfig } from "./incident-config.js";
import type { IncidentEngineConfig } from "./incident-config.js";
import { updateIncidentLifecycle } from "./incident-lifecycle.js";
import { maybeSpawnIncident } from "./incident-spawn.js";

export type IncidentEngineInput = {
  readonly tick: number;
  readonly playerPosition: GridPosition;
  readonly incidents: readonly Incident[];
  readonly rng: DeterministicRng;
  readonly config?: IncidentEngineConfig;
};

export type IncidentEngineResult = {
  readonly incidents: readonly Incident[];
  readonly rng: DeterministicRng;
  readonly createdIncident?: Incident;
};

export function updateIncidentEngine(input: IncidentEngineInput): IncidentEngineResult {
  const config = input.config ?? defaultIncidentEngineConfig;

  const activeIncidents = updateIncidentLifecycle({
    tick: input.tick,
    incidents: input.incidents
  });

  const spawnResult = maybeSpawnIncident({
    tick: input.tick,
    playerPosition: input.playerPosition,
    activeIncidents,
    rng: input.rng,
    config
  });

  return {
  incidents: spawnResult.incidents,
  rng: spawnResult.rng,
  ...(spawnResult.createdIncident !== undefined && {
    createdIncident: spawnResult.createdIncident,
  }),
};
}