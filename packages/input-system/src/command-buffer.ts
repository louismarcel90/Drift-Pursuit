import type { PlayerCommand, PlayerCommandKind, PlayerCommandSource } from "@drift-pursuit-grid/contracts";

export type CommandBuffer = {
  readonly commands: readonly PlayerCommand[];
};

export const emptyCommandBuffer: CommandBuffer = {
  commands: []
};

export function appendCommandToBuffer(params: {
  readonly buffer: CommandBuffer;
  readonly kind: PlayerCommandKind;
  readonly tick: number;
  readonly source: PlayerCommandSource;
}): CommandBuffer {
  return {
    commands: [
      ...params.buffer.commands,
      {
        kind: params.kind,
        tick: params.tick,
        source: params.source
      }
    ]
  };
}

export function appendCommandsToBuffer(params: {
  readonly buffer: CommandBuffer;
  readonly commands: readonly PlayerCommand[];
}): CommandBuffer {
  return {
    commands: [...params.buffer.commands, ...params.commands]
  };
}

export function getCommandsForTick(params: {
  readonly buffer: CommandBuffer;
  readonly tick: number;
}): readonly PlayerCommand[] {
  return params.buffer.commands.filter((command) => command.tick === params.tick);
}

export function removeCommandsBeforeTick(params: {
  readonly buffer: CommandBuffer;
  readonly tick: number;
}): CommandBuffer {
  return {
    commands: params.buffer.commands.filter((command) => command.tick >= params.tick)
  };
}