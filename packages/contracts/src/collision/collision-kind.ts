export type CollisionKind =
  | "none"
  | "side-contact"
  | "rear-end"
  | "front-impact"
  | "traffic-scrape"
  | "barrier-impact"
  | "hazard-impact";

export type CollisionSeverity = "minor" | "moderate" | "severe" | "critical";

export type CollisionResult = {
  readonly kind: CollisionKind;
  readonly severity: CollisionSeverity;
  readonly speedPenalty: number;
  readonly controlPenalty: number;
};
