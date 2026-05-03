export type PlayerCommandKind =
  | "accelerate"
  | "brake"
  | "steer-left"
  | "steer-right"
  | "handbrake"
  | "release-handbrake"
  | "pause";

export type PlayerCommandSource = "keyboard" | "replay" | "scenario-script";

export type PlayerCommand = {
  readonly kind: PlayerCommandKind;
  readonly tick: number;
  readonly source: PlayerCommandSource;
};