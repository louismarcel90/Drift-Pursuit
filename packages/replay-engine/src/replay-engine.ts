import type { PlayerCommand } from "@drift-pursuit-grid/contracts";
import {
  advanceSimulationTick,
  createSimulationRuntime
} from "@drift-pursuit-grid/simulation-core";

import { createStateChecksum } from "./replay-checksum.js";
import type { ReplayRecord, ReplayRunResult, ReplayVerificationResult } from "./replay-record.js";

export type CreateReplayRecordInput = {
  readonly scenarioId: string;
  readonly seed: number;
  readonly tickDurationMs: number;
  readonly totalTicks: number;
  readonly inputLog: readonly PlayerCommand[];
};

export function runSimulationForReplayRecord(input: CreateReplayRecordInput): ReplayRunResult {
  let runtime = createSimulationRuntime({
    scenarioId: input.scenarioId,
    seed: input.seed,
    tickDurationMs: input.tickDurationMs
  });

  for (let index = 0; index < input.totalTicks; index += 1) {
    const result = advanceSimulationTick(runtime, input.inputLog);
    runtime = result.state;
  }

  const expectedFinalChecksum = createStateChecksum(runtime.authoritativeState);

  const replayRecord: ReplayRecord = {
    scenarioId: input.scenarioId,
    seed: input.seed,
    tickDurationMs: input.tickDurationMs,
    totalTicks: input.totalTicks,
    inputLog: input.inputLog,
    expectedFinalChecksum
  };

  return {
    replayRecord,
    finalState: runtime.authoritativeState,
    actualFinalChecksum: expectedFinalChecksum,
    verified: true
  };
}

export function replayFromRecord(record: ReplayRecord): ReplayRunResult {
  let runtime = createSimulationRuntime({
    scenarioId: record.scenarioId,
    seed: record.seed,
    tickDurationMs: record.tickDurationMs
  });

  for (let index = 0; index < record.totalTicks; index += 1) {
    const result = advanceSimulationTick(runtime, record.inputLog);
    runtime = result.state;
  }

  const actualFinalChecksum = createStateChecksum(runtime.authoritativeState);

  return {
    replayRecord: record,
    finalState: runtime.authoritativeState,
    actualFinalChecksum,
    verified: actualFinalChecksum === record.expectedFinalChecksum
  };
}

export function verifyReplayRecord(record: ReplayRecord): ReplayVerificationResult {
  const replayResult = replayFromRecord(record);

  if (replayResult.verified) {
    return {
      status: "verified",
      expectedChecksum: record.expectedFinalChecksum,
      actualChecksum: replayResult.actualFinalChecksum
    };
  }

  return {
    status: "diverged",
    expectedChecksum: record.expectedFinalChecksum,
    actualChecksum: replayResult.actualFinalChecksum,
    reason: "Replay final checksum did not match expected checksum."
  };
}