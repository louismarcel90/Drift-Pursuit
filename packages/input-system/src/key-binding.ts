import type { PlayerCommandKind } from "@drift-pursuit-grid/contracts";

export type KeyBinding = {
  readonly key: string;
  readonly commandKind: PlayerCommandKind;
  readonly description: string;
};

export const defaultKeyBindings: readonly KeyBinding[] = [
  {
    key: "w",
    commandKind: "accelerate",
    description: "Accelerate"
  },
  {
    key: "s",
    commandKind: "brake",
    description: "Brake"
  },
  {
    key: "a",
    commandKind: "steer-left",
    description: "Steer left"
  },
  {
    key: "d",
    commandKind: "steer-right",
    description: "Steer right"
  },
  {
    key: " ",
    commandKind: "handbrake",
    description: "Handbrake"
  },
  {
    key: "p",
    commandKind: "pause",
    description: "Pause"
  },
  {
    key: "r",
    commandKind: "resume",
    description: "Resume"
  },
  {
    key: "q",
    commandKind: "quit",
    description: "Quit"
  }
];

export function mapKeyToCommandKind(
  key: string,
  bindings: readonly KeyBinding[] = defaultKeyBindings
): PlayerCommandKind | undefined {
  return bindings.find((binding) => binding.key === key)?.commandKind;
}