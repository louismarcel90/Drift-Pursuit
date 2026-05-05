import {
  createCommandsFromScriptedInput,
  showcaseScriptedInput
} from "../../../packages/input-system/src/index.js";
import {
  projectAsciiRenderModel,
  renderAsciiFrame
} from "../../../packages/renderer-ascii/src/index.js";
import {
  replayFromRecord,
  runSimulationForReplayRecord,
  verifyReplayRecord
} from "../../../packages/replay-engine/src/index.js";

const inputLog = createCommandsFromScriptedInput(showcaseScriptedInput);

const initialRun = runSimulationForReplayRecord({
  scenarioId: "showcase.perfect-storm",
  seed: 20260502,
  tickDurationMs: 100,
  totalTicks: 24,
  inputLog
});

const replayRun = replayFromRecord(initialRun.replayRecord);
const verification = verifyReplayRecord(initialRun.replayRecord);

const renderModel = projectAsciiRenderModel(replayRun.finalState, {
  width: 72,
  height: 20,
  eventFeedLimit: 8
});

const replaySummary = [
  "",
  "REPLAY VERIFICATION",
  `Status            : ${verification.status}`,
  `Expected Checksum : ${initialRun.replayRecord.expectedFinalChecksum}`,
  `Actual Checksum   : ${replayRun.actualFinalChecksum}`,
  `Verified          : ${replayRun.verified ? "yes" : "no"}`
].join("\n");

console.log(renderAsciiFrame(renderModel));
console.log(replaySummary);