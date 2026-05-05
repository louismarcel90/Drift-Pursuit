import type { PlayerCommand } from "@drift-pursuit-grid/contracts";
import {
  projectAsciiRenderModel,
  renderAsciiFrame
} from "@drift-pursuit-grid/renderer-ascii";
import { advanceSimulationTick, createSimulationRuntime } from "@drift-pursuit-grid/simulation-core";

const commands: readonly PlayerCommand[] = [
  { kind: "accelerate", tick: 1, source: "keyboard" },
  { kind: "accelerate", tick: 2, source: "keyboard" },
  { kind: "accelerate", tick: 3, source: "keyboard" },
  { kind: "accelerate", tick: 4, source: "keyboard" },
  { kind: "accelerate", tick: 5, source: "keyboard" },
  { kind: "accelerate", tick: 6, source: "keyboard" },
  { kind: "steer-right", tick: 7, source: "keyboard" },
  { kind: "handbrake", tick: 7, source: "keyboard" },
  { kind: "steer-right", tick: 8, source: "keyboard" },
  { kind: "handbrake", tick: 8, source: "keyboard" },
  { kind: "accelerate", tick: 9, source: "keyboard" },
  { kind: "steer-left", tick: 10, source: "keyboard" }
];

let runtime = createSimulationRuntime({
  scenarioId: "showcase.perfect-storm",
  seed: 20260502,
  tickDurationMs: 100
});

for (let index = 0; index < 24; index += 1) {
  const result = advanceSimulationTick(runtime, commands);
  runtime = result.state;
}

const renderModel = projectAsciiRenderModel(runtime.authoritativeState, {
  width: 72,
  height: 20,
  eventFeedLimit: 8
});

console.log(renderAsciiFrame(renderModel));