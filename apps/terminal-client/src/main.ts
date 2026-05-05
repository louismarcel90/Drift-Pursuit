import { createDebriefSummary, renderDebriefSummary } from "../../../packages/debrief-engine/src/index.js";
import { loadBuiltInScenario } from "../../../packages/scenario-kit/src/index.js";
import {
  projectAsciiRenderModel,
  renderAsciiFrame
} from "../../../packages/renderer-ascii/src/index.js";
import {
  replayFromRecord,
  runSimulationForReplayRecord,
  verifyReplayRecord
} from "../../../packages/replay-engine/src/index.js";
import { createEvidencePack, renderEvidencePackSummary } from "../../../packages/evidence-engine/src/index.js";

const loadedScenario = loadBuiltInScenario("showcase.perfect-storm");
const scenario = loadedScenario.scenario.definition;

const initialRun = runSimulationForReplayRecord({
  scenarioId: scenario.id,
  seed: scenario.seed,
  tickDurationMs: scenario.tickDurationMs,
  totalTicks: scenario.totalTicks,
  inputLog: loadedScenario.inputLog
});

const replayRun = replayFromRecord(initialRun.replayRecord);
const verification = verifyReplayRecord(initialRun.replayRecord);
const debriefSummary = createDebriefSummary(replayRun.finalState);

const evidencePack = createEvidencePack({
  scenario,
  replayRecord: initialRun.replayRecord,
  replayVerification: verification,
  finalState: replayRun.finalState,
  debrief: debriefSummary
});

const renderModel = projectAsciiRenderModel(replayRun.finalState, {
  width: 72,
  height: 20,
  eventFeedLimit: 8
});

const scenarioSummary = [
  "",
  "SCENARIO",
  `Id         : ${scenario.id}`,
  `Title      : ${scenario.title}`,
  `Mode       : ${scenario.mode}`,
  `Difficulty : ${scenario.difficulty}`,
  `Ticks      : ${scenario.totalTicks}`,
  `Traffic    : ${scenario.trafficProfile}`,
  `Incidents  : ${scenario.incidentProfile}`,
  `Degraded   : ${scenario.degradedProfile}`
].join("\n");

const replaySummary = [
  "",
  "REPLAY VERIFICATION",
  `Status            : ${verification.status}`,
  `Expected Checksum : ${initialRun.replayRecord.expectedFinalChecksum}`,
  `Actual Checksum   : ${replayRun.actualFinalChecksum}`,
  `Verified          : ${replayRun.verified ? "yes" : "no"}`
].join("\n");

console.log(renderAsciiFrame(renderModel));
console.log(scenarioSummary);
console.log(replaySummary);
console.log("");
console.log(renderDebriefSummary(debriefSummary));
console.log("");
console.log(renderEvidencePackSummary(evidencePack));