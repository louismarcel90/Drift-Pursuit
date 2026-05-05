import type { PlayerCommand } from "@drift-pursuit-grid/contracts";
import type { AuthoritativeSimulationState } from "@drift-pursuit-grid/state-store";

export type ReplayRecord = {
  readonly scenarioId: string;
  readonly seed: number;
  readonly tickDurationMs: number;
  readonly totalTicks: number;
  readonly inputLog: readonly PlayerCommand[];
  readonly expectedFinalChecksum: string;
};

export type ReplayRunResult = {
  readonly replayRecord: ReplayRecord;
  readonly finalState: AuthoritativeSimulationState;
  readonly actualFinalChecksum: string;
  readonly verified: boolean;
};

export type ReplayVerificationResult =
  | {
      readonly status: "verified";
      readonly expectedChecksum: string;
      readonly actualChecksum: string;
    }
  | {
      readonly status: "diverged";
      readonly expectedChecksum: string;
      readonly actualChecksum: string;
      readonly reason: string;
    };
