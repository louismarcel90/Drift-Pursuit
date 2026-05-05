import type { DegradedMode } from "@drift-pursuit-grid/contracts";
import type { DeterministicRng } from "@drift-pursuit-grid/deterministic-rng";

import { defaultDegradedModeEngineConfig } from "./degraded-mode-config.js";
import type { DegradedModeEngineConfig } from "./degraded-mode-config.js";
import { injectFaultIfRequired } from "./fault-injection.js";

export type DegradedModeEngineInput = {
  readonly tick: number;
  readonly degradedModes: readonly DegradedMode[];
  readonly rng: DeterministicRng;
  readonly config?: DegradedModeEngineConfig;
};

export type DegradedModeEngineResult = {
  readonly degradedModes: readonly DegradedMode[];
  readonly rng: DeterministicRng;
  readonly activatedMode?: DegradedMode;
  readonly recoveredModes: readonly DegradedMode[];
};

function recoverExpiredModes(params: {
  readonly tick: number;
  readonly degradedModes: readonly DegradedMode[];
}): {
  readonly activeModes: readonly DegradedMode[];
  readonly recoveredModes: readonly DegradedMode[];
} {
  const recoveredModes: DegradedMode[] = [];
  const activeModes: DegradedMode[] = [];

  for (const mode of params.degradedModes) {
    if (mode.recoveredAtTick !== undefined && params.tick >= mode.recoveredAtTick) {
      recoveredModes.push({
        ...mode,
        status: "recovered"
      });
      continue;
    }

    activeModes.push(mode);
  }

  return {
    activeModes,
    recoveredModes
  };
}

export function updateDegradedModeEngine(
  input: DegradedModeEngineInput
): DegradedModeEngineResult {
  const config = input.config ?? defaultDegradedModeEngineConfig;

  const recoveryResult = recoverExpiredModes({
    tick: input.tick,
    degradedModes: input.degradedModes
  });

  const faultResult = injectFaultIfRequired({
    tick: input.tick,
    degradedModes: recoveryResult.activeModes,
    rng: input.rng,
    config
  });

  const result: DegradedModeEngineResult = {
  degradedModes: faultResult.degradedModes,
  rng: faultResult.rng,
  recoveredModes: recoveryResult.recoveredModes,
};

if (faultResult.activatedMode !== undefined) {
  return {
    ...result,
    activatedMode: faultResult.activatedMode,
  };
}

return result;
}