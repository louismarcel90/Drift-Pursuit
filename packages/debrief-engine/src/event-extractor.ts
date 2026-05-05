import type { SimulationEvent } from "@drift-pursuit-grid/contracts";

export type ExtractedEvents = {
  readonly keyEvents: readonly SimulationEvent[];
  readonly collisionEvents: readonly SimulationEvent[];
  readonly incidentEvents: readonly SimulationEvent[];
  readonly pursuitLossEvents: readonly SimulationEvent[];
  readonly interceptEvents: readonly SimulationEvent[];
};

function isKeyEvent(event: SimulationEvent): boolean {
  switch (event.kind) {
    case "collision-detected":
    case "incident-created":
    case "pursuit-lock-lost":
    case "intercept-window-opened":
    case "degraded-mode-activated":
    case "replay-divergence-detected":
    case "mission-ended":
      return true;

    case "mission-started":
    case "player-command-accepted":
    case "vehicle-updated":
    case "target-updated":
    case "traffic-updated":
    case "pursuit-lock-acquired":
    case "intercept-window-closed":
    case "degraded-mode-recovered":
    case "replay-checkpoint-created":
    case "evidence-pack-created":
      return false;
  }
}

export function extractDebriefEvents(events: readonly SimulationEvent[]): ExtractedEvents {
  return {
    keyEvents: events.filter(isKeyEvent),
    collisionEvents: events.filter((event) => event.kind === "collision-detected"),
    incidentEvents: events.filter((event) => event.kind === "incident-created"),
    pursuitLossEvents: events.filter((event) => event.kind === "pursuit-lock-lost"),
    interceptEvents: events.filter((event) => event.kind === "intercept-window-opened"),
  };
}
