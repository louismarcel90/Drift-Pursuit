import {
  createCommandsFromScriptedInput,
  showcaseScriptedInput
} from "../../../packages/input-system/src/index.js";
import {
  projectAsciiRenderModel,
  renderAsciiFrame
} from "../../../packages/renderer-ascii/src/index.js";
import { advanceSimulationTick, createSimulationRuntime } from "@drift-pursuit-grid/simulation-core";

const commands = createCommandsFromScriptedInput(showcaseScriptedInput);

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