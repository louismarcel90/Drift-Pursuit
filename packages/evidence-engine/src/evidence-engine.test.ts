import { describe, expect, it } from "vitest";

import { createDebriefSummary } from "@drift-pursuit-grid/debrief-engine";
import {
  replayFromRecord,
  runSimulationForReplayRecord,
  verifyReplayRecord,
} from "@drift-pursuit-grid/replay-engine";
import { loadBuiltInScenario } from "@drift-pursuit-grid/scenario-kit";

import { createDigest } from "./evidence-digest.js";
import { createEvidencePack, renderEvidencePackSummary } from "./evidence-engine.js";

describe("Evidence engine", () => {
  it("creates stable digests for the same payload", () => {
    const firstDigest = createDigest({
      scenarioId: "test",
      seed: 2026,
      values: [1, 2, 3],
    });

    const secondDigest = createDigest({
      values: [1, 2, 3],
      seed: 2026,
      scenarioId: "test",
    });

    expect(firstDigest).toBe(secondDigest);
  });

  it("creates an evidence pack from scenario, replay, final state, and debrief", () => {
    const loadedScenario = loadBuiltInScenario("showcase.perfect-storm");
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

    const pack = createEvidencePack({
      scenario,
      replayRecord: initialRun.replayRecord,
      replayVerification,
      finalState: replayRun.finalState,
      debrief,
    });

    expect(pack.evidenceVersion).toBe("1.0");
    expect(pack.generatedBy).toBe("drift-pursuit-grid");
    expect(pack.integrity.evidencePackDigest).toHaveLength(8);
    expect(pack.replayVerification.status).toBe("verified");
  });

  it("renders a readable evidence summary", () => {
    const loadedScenario = loadBuiltInScenario("showcase.perfect-storm");
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

    const pack = createEvidencePack({
      scenario,
      replayRecord: initialRun.replayRecord,
      replayVerification,
      finalState: replayRun.finalState,
      debrief,
    });

    const rendered = renderEvidencePackSummary(pack);

    expect(rendered).toContain("EVIDENCE PACK");
    expect(rendered).toContain("Evidence Digest");
  });
});
