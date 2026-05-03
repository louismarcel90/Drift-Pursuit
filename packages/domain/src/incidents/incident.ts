import type { GridPosition } from "../geometry/index.js";

export type IncidentKind =
  | "stalled-vehicle"
  | "lane-blockage"
  | "minor-crash"
  | "road-work"
  | "reduced-visibility-zone"
  | "surface-low-grip";

export type IncidentSeverity = "low" | "medium" | "high";

export type IncidentStatus = "scheduled" | "active" | "resolved";

export type Incident = {
  readonly id: string;
  readonly kind: IncidentKind;
  readonly severity: IncidentSeverity;
  readonly status: IncidentStatus;
  readonly position: GridPosition;
  readonly startsAtTick: number;
  readonly endsAtTick?: number;
};