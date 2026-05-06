export type PlayerCommandKind =
  | "accelerate"
  | "brake"
  | "steer-left"
  | "steer-right"
  | "handbrake"
  | "release-handbrake"
  | "pause"
  | "resume"
  | "replay-step-forward"
  | "replay-step-backward"
  | "replay-fast-forward"
  | "quit";

export type PlayerCommandSource = "keyboard" | "script" | "replay ";

export type PlayerCommand = {
  readonly kind: PlayerCommandKind;
  readonly tick: number;
  readonly source: PlayerCommandSource;
};
