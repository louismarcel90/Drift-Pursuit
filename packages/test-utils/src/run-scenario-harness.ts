import { createDebriefSummary } from "@drift-pursuit-grid/debrief-engine";
import { createEvidencePack } from "../../evidence-engine/src/index.js";
import type { EvidencePack } from "../../evidence-engine/src/index.js";
import {
  replayFromRecord,
  runSimulationForReplayRecord,
  verifyReplayRecord,
} from "@drift-pursuit-grid/replay-engine";
import { loadBuiltInScenario } from "@drift-pursuit-grid/scenario-kit";
import type { ScenarioDefinition } from "@drift-pursuit-grid/scenario-kit";
import type { AuthoritativeSimulationState } from "@drift-pursuit-grid/state-store";

export type ScenarioHarnessResult = {
  readonly scenario: ScenarioDefinition;
  readonly finalState: AuthoritativeSimulationState;
  readonly finalChecksum: string;
  readonly replayVerified: boolean;
  readonly evidencePack: EvidencePack;
};

export function runScenarioHarness(scenarioId: string): ScenarioHarnessResult {
  const loadedScenario = loadBuiltInScenario(scenarioId);
  const scenario = loadedScenario.scenario.definition;

  const initialRun = runSimulationForReplayRecord({
    scenarioId: scenario.id,
    seed: scenario.seed,
    tickDurationMs: scenario.tickDurationMs,
    totalTicks: scenario.totalTicks,
    inputLog: loadedScenario.inputLog,
  });

  const replayRun = replayFromRecord(initialRun.replayRecord);
  const replayVerification = verifyReplayRecord(initialRun.replayRecord);
  const debrief = createDebriefSummary(replayRun.finalState);

  const evidencePack = createEvidencePack({
    scenario,
    replayRecord: initialRun.replayRecord,
    replayVerification,
    finalState: replayRun.finalState,
    debrief,
  });

  return {
    scenario,
    finalState: replayRun.finalState,
    finalChecksum: replayRun.actualFinalChecksum,
    replayVerified: replayRun.verified,
    evidencePack,
  };
}
