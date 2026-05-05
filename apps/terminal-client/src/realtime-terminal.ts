import { mapKeyToCommandKind } from "../../../packages/input-system/src";
import { projectAsciiRenderModel, renderAsciiFrame } from "@drift-pursuit-grid/renderer-ascii";
import {
  advanceSimulationTick,
  createSimulationRuntime,
} from "@drift-pursuit-grid/simulation-core";
import type { PlayerCommand } from "@drift-pursuit-grid/contracts";

type TerminalInputState = {
  readonly commands: readonly PlayerCommand[];
  readonly shouldQuit: boolean;
};

function createInitialInputState(): TerminalInputState {
  return {
    commands: [],
    shouldQuit: false,
  };
}

function clearTerminal(): void {
  process.stdout.write("\x1Bc");
}

function renderRuntime(runtime: ReturnType<typeof createSimulationRuntime>): void {
  const renderModel = projectAsciiRenderModel(runtime.authoritativeState, {
    width: 72,
    height: 20,
    eventFeedLimit: 8,
  });

  clearTerminal();
  console.log(renderAsciiFrame(renderModel));
  console.log("");
  console.log("Controls: W accelerate | S brake | A left | D right | SPACE handbrake | Q quit");
}

export function runRealtimeTerminalDemo(): void {
  let runtime = createSimulationRuntime({
    scenarioId: "showcase.realtime-terminal",
    seed: 20260502,
    tickDurationMs: 100,
  });

  let inputState = createInitialInputState();

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  process.stdin.on("data", (key: string) => {
    const commandKind = mapKeyToCommandKind(key);

    if (commandKind === "quit") {
      inputState = {
        ...inputState,
        shouldQuit: true,
      };

      return;
    }

    if (commandKind !== undefined) {
      const nextTick = runtime.authoritativeState.tick + 1;

      inputState = {
        ...inputState,
        commands: [
          ...inputState.commands,
          {
            kind: commandKind,
            tick: nextTick,
            source: "keyboard",
          },
        ],
      };
    }
  });

  const interval = setInterval(() => {
    if (inputState.shouldQuit) {
      clearInterval(interval);

      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }

      process.stdin.pause();
      return;
    }

    const result = advanceSimulationTick(runtime, inputState.commands);
    runtime = result.state;

    inputState = {
      ...inputState,
      commands: inputState.commands.filter(
        (command) => command.tick > runtime.authoritativeState.tick,
      ),
    };

    renderRuntime(runtime);
  }, runtime.config.tickDurationMs);
}
