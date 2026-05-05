import { describe, expect, it } from "vitest";

import { createCommandsFromScriptedInput, showcaseScriptedInput } from "../../../packages/input-system/src/index.js";

import { replayFromRecord, runSimulationForReplayRecord, verifyReplayRecord } from "./replay-engine.js";

describe("Replay engine", () => {
  it("creates a replay record and verifies it deterministically", () => {
    const inputLog = createCommandsFromScriptedInput(showcaseScriptedInput);

    const initialRun = runSimulationForReplayRecord({
      scenarioId: "test.replay.verified",
      seed: 20260502,
      tickDurationMs: 100,
      totalTicks: 24,
      inputLog
    });

    const replayRun = replayFromRecord(initialRun.replayRecord);

    expect(replayRun.verified).toBe(true);
    expect(replayRun.actualFinalChecksum).toBe(initialRun.replayRecord.expectedFinalChecksum);
  });

  it("detects replay divergence when expected checksum is wrong", () => {
    const inputLog = createCommandsFromScriptedInput(showcaseScriptedInput);

    const initialRun = runSimulationForReplayRecord({
      scenarioId: "test.replay.divergence",
      seed: 20260502,
      tickDurationMs: 100,
      totalTicks: 24,
      inputLog
    });

    const corruptedRecord = {
      ...initialRun.replayRecord,
      expectedFinalChecksum: "00000000"
    };

    const verification = verifyReplayRecord(corruptedRecord);

    expect(verification.status).toBe("diverged");
  });
});