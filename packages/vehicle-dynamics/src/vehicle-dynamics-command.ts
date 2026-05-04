import type { PlayerCommand } from "@drift-pursuit-grid/contracts";

export type VehicleControlIntent = {
  readonly accelerate: boolean;
  readonly brake: boolean;
  readonly steerLeft: boolean;
  readonly steerRight: boolean;
  readonly handbrake: boolean;
};

export const emptyVehicleControlIntent: VehicleControlIntent = {
  accelerate: false,
  brake: false,
  steerLeft: false,
  steerRight: false,
  handbrake: false,
};

export function deriveVehicleControlIntent(
  commands: readonly PlayerCommand[],
): VehicleControlIntent {
  return commands.reduce<VehicleControlIntent>(
    (intent, command) => {
      switch (command.kind) {
        case "accelerate":
          return {
            ...intent,
            accelerate: true,
          };

        case "brake":
          return {
            ...intent,
            brake: true,
          };

        case "steer-left":
          return {
            ...intent,
            steerLeft: true,
          };

        case "steer-right":
          return {
            ...intent,
            steerRight: true,
          };

        case "handbrake":
          return {
            ...intent,
            handbrake: true,
          };

        case "release-handbrake":
        case "pause":
        case "resume":
        case "replay-step-forward":
        case "replay-step-backward":
        case "replay-fast-forward":
        case "quit":
          return intent;
      }
    },
    emptyVehicleControlIntent,
  );
}