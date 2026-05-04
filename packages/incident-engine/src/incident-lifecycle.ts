import type { Incident } from "@drift-pursuit-grid/domain";

export function updateIncidentLifecycle(params: {
  readonly tick: number;
  readonly incidents: readonly Incident[];
}): readonly Incident[] {
  return params.incidents
    .map((incident): Incident => {
      if (incident.endsAtTick !== undefined && params.tick >= incident.endsAtTick) {
        return {
          ...incident,
          status: "resolved"
        };
      }

      if (params.tick >= incident.startsAtTick && incident.status === "scheduled") {
        return {
          ...incident,
          status: "active"
        };
      }

      return incident;
    })
    .filter((incident) => incident.status !== "resolved");
}