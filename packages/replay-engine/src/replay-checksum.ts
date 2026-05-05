import type { SimulationEvent } from "@drift-pursuit-grid/contracts";
import type { AuthoritativeSimulationState } from "@drift-pursuit-grid/state-store";

export type ChecksumPrimitive = string | number | boolean | null;

export type ChecksumJsonValue =
  | ChecksumPrimitive
  | readonly ChecksumJsonValue[]
  | {
      readonly [key: string]: ChecksumJsonValue;
    };

function stableStringify(value: ChecksumJsonValue): string {
  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const entries = Object.entries(value).sort(([firstKey], [secondKey]) =>
    firstKey.localeCompare(secondKey)
  );

  return `{${entries
    .map(([key, entryValue]) => {
      return `${JSON.stringify(key)}:${stableStringify(entryValue)}`;
    })
    .join(",")}}`;
}

function hashString(input: string): string {
  let hash = 2_166_136_261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

function projectEventForChecksum(event: SimulationEvent): ChecksumJsonValue {
  return {
    kind: event.kind,
    tick: event.tick,
    message: event.message
  };
}

export function createStateChecksum(state: AuthoritativeSimulationState): string {
  const checksumPayload: ChecksumJsonValue = {
    scenarioId: state.scenarioId,
    seed: state.seed,
    tick: state.tick,
    missionStatus: state.missionStatus,
    playerVehicle: {
      id: state.playerVehicle.identity.id,
      x: state.playerVehicle.position.x,
      y: state.playerVehicle.position.y,
      speed: state.playerVehicle.dynamics.speed,
      headingDegrees: state.playerVehicle.dynamics.headingDegrees,
      driftFactor: state.playerVehicle.dynamics.driftFactor,
      controlLevel: state.playerVehicle.dynamics.controlLevel,
      controlState: state.playerVehicle.dynamics.controlState
    },
    targetVehicle:
      state.targetVehicle === undefined
        ? null
        : {
            id: state.targetVehicle.identity.id,
            x: state.targetVehicle.position.x,
            y: state.targetVehicle.position.y,
            speed: state.targetVehicle.dynamics.speed,
            headingDegrees: state.targetVehicle.dynamics.headingDegrees
          },
    trafficVehicles: state.trafficVehicles.map((vehicle): ChecksumJsonValue => ({
      id: vehicle.identity.id,
      x: vehicle.position.x,
      y: vehicle.position.y,
      speed: vehicle.dynamics.speed
    })),
    incidents: state.incidents.map((incident): ChecksumJsonValue => ({
      id: incident.id,
      kind: incident.kind,
      severity: incident.severity,
      status: incident.status,
      x: incident.position.x,
      y: incident.position.y,
      startsAtTick: incident.startsAtTick,
      endsAtTick: incident.endsAtTick ?? null
    })),
    pursuitState: {
      lockState: state.pursuitState.lockState,
      targetDistance: state.pursuitState.targetDistance,
      pursuitPressure: state.pursuitState.pursuitPressure,
      interceptWindowOpen: state.pursuitState.interceptWindowOpen,
      lastReasonCode: state.pursuitState.lastReasonCode ?? null
    },
    events: state.events.map(projectEventForChecksum)
  };

  return hashString(stableStringify(checksumPayload));
}