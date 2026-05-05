export type ReasonCode =
  | "target-distance-exceeded"
  | "line-of-sight-lost"
  | "unsafe-intercept-angle"
  | "collision-control-loss"
  | "excessive-speed-in-turn"
  | "traffic-blocked-route"
  | "degraded-target-indicator"
  | "mission-objective-completed"
  | "mission-timeout"
  | "player-aborted"
  | "degraded-mode-impact"
  | "clean-intercept"
  | "high-risk-recovery";
