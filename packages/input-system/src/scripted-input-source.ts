import type { PlayerCommand, PlayerCommandKind } from "@drift-pursuit-grid/contracts";

export type ScriptedInputStep = {
  readonly tick: number;
  readonly commands: readonly PlayerCommandKind[];
};

export type ScriptedInputSource = {
  readonly steps: readonly ScriptedInputStep[];
};

export function createCommandsFromScriptedInput(
  source: ScriptedInputSource,
): readonly PlayerCommand[] {
  return source.steps.flatMap((step) =>
    step.commands.map(
      (commandKind): PlayerCommand => ({
        kind: commandKind,
        tick: step.tick,
        source: "script",
      }),
    ),
  );
}

export const showcaseScriptedInput: ScriptedInputSource = {
  steps: [
    {
      tick: 1,
      commands: ["accelerate"],
    },
    {
      tick: 2,
      commands: ["accelerate"],
    },
    {
      tick: 3,
      commands: ["accelerate"],
    },
    {
      tick: 4,
      commands: ["accelerate"],
    },
    {
      tick: 5,
      commands: ["steer-right", "handbrake"],
    },
    {
      tick: 6,
      commands: ["steer-right", "handbrake"],
    },
    {
      tick: 7,
      commands: ["accelerate"],
    },
    {
      tick: 8,
      commands: ["steer-left"],
    },
    {
      tick: 9,
      commands: ["accelerate"],
    },
    {
      tick: 10,
      commands: ["accelerate"],
    },
  ],
};
