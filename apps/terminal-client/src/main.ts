import {
  createDebriefSummary,
  renderDebriefSummary,
} from "../../../packages/debrief-engine/src/index.js";
import { loadBuiltInScenario } from "../../../packages/scenario-kit/src/index.js";
import {
  projectAsciiRenderModel,
  renderAsciiFrame,
} from "../../../packages/renderer-ascii/src/index.js";
import {
  replayFromRecord,
  runSimulationForReplayRecord,
  verifyReplayRecord,
} from "../../../packages/replay-engine/src/index.js";
import {
  createEvidencePack,
  renderEvidencePackSummary,
} from "../../../packages/evidence-engine/src/index.js";

const loadedScenario = loadBuiltInScenario("showcase.perfect-storm");
const scenario = loadedScenario.scenario.definition;

const finalRun = runSimulationForReplayRecord({
  scenarioId: scenario.id,
  seed: scenario.seed,
  tickDurationMs: scenario.tickDurationMs,
  totalTicks: scenario.totalTicks,
  inputLog: loadedScenario.inputLog,
});

const replayRun = replayFromRecord(finalRun.replayRecord);
const verification = verifyReplayRecord(finalRun.replayRecord);
const debriefSummary = createDebriefSummary(replayRun.finalState);

const evidencePack = createEvidencePack({
  scenario,
  replayRecord: finalRun.replayRecord,
  replayVerification: verification,
  finalState: replayRun.finalState,
  debrief: debriefSummary,
});

let currentTick = 1;

const renderTick = (): void => {
  const tickRun = runSimulationForReplayRecord({
    scenarioId: scenario.id,
    seed: scenario.seed,
    tickDurationMs: scenario.tickDurationMs,
    totalTicks: currentTick,
    inputLog: loadedScenario.inputLog,
  });

  const renderModel = projectAsciiRenderModel(tickRun.finalState, {
    width: 72,
    height: 20,
    eventFeedLimit: 8,
  });

  console.clear();
  console.log(renderAsciiFrame(renderModel));

  console.log("");
  console.log("LIVE RUN");
  console.log(`Scenario : ${scenario.id}`);
  console.log(`Tick     : ${currentTick}/${scenario.totalTicks}`);
  console.log(`Seed     : ${scenario.seed}`);
  console.log(`Mode     : ${scenario.mode}`);

  currentTick += 1;

  if (currentTick > scenario.totalTicks) {
    clearInterval(timer);

    console.log("");
    console.log("SCENARIO");
    console.log(`Id         : ${scenario.id}`);
    console.log(`Title      : ${scenario.title}`);
    console.log(`Mode       : ${scenario.mode}`);
    console.log(`Difficulty : ${scenario.difficulty}`);
    console.log(`Ticks      : ${scenario.totalTicks}`);
    console.log(`Traffic    : ${scenario.trafficProfile}`);
    console.log(`Incidents  : ${scenario.incidentProfile}`);
    console.log(`Degraded   : ${scenario.degradedProfile}`);

    console.log("");
    console.log("REPLAY VERIFICATION");
    console.log(`Status            : ${verification.status}`);
    console.log(`Expected Checksum : ${finalRun.replayRecord.expectedFinalChecksum}`);
    console.log(`Actual Checksum   : ${replayRun.actualFinalChecksum}`);
    console.log(`Verified          : ${replayRun.verified ? "yes" : "no"}`);

    console.log("");
    console.log(renderDebriefSummary(debriefSummary));

    console.log("");
    console.log(renderEvidencePackSummary(evidencePack));
  }
};

const timer = setInterval(renderTick, scenario.tickDurationMs);

renderTick();
// runRealtimeGame();
