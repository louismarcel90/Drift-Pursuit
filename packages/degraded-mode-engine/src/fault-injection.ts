import type { DegradedMode } from "@drift-pursuit-grid/contracts";
import type { DeterministicRng } from "@drift-pursuit-grid/deterministic-rng";

import type { DegradedModeEngineConfig, FaultInjectionRule } from "./degraded-mode-config.js";

export type FaultInjectionResult = {
  readonly degradedModes: readonly DegradedMode[];
  readonly rng: DeterministicRng;
  readonly activatedMode?: DegradedMode;
};

function isModeAlreadyActive(
  degradedModes: readonly DegradedMode[],
  rule: FaultInjectionRule,
): boolean {
  return degradedModes.some(
    (mode) => mode.kind === rule.degradedModeKind && mode.status === "active",
  );
}

function createDegradedMode(params: {
  readonly rule: FaultInjectionRule;
  readonly tick: number;
  readonly durationTicks: number;
}): DegradedMode {
  return {
    kind: params.rule.degradedModeKind,
    status: "active",
    activatedAtTick: params.tick,
    recoveredAtTick: params.tick + params.durationTicks,
    faultCode: params.rule.faultCode,
  };
}

export function injectFaultIfRequired(params: {
  readonly tick: number;
  readonly degradedModes: readonly DegradedMode[];
  readonly rng: DeterministicRng;
  readonly config: DegradedModeEngineConfig;
}): FaultInjectionResult {
  const { tick, degradedModes, config } = params;
  let rng = params.rng;

  if (!config.enabled) {
    return {
      degradedModes,
      rng,
    };
  }

  if (degradedModes.length >= config.maxActiveDegradedModes) {
    return {
      degradedModes,
      rng,
    };
  }

  for (const rule of config.rules) {
    if (isModeAlreadyActive(degradedModes, rule)) {
      continue;
    }

    const [shouldActivate, rngAfterActivationRoll] = rng.nextBoolean(rule.activationChancePerTick);
    rng = rngAfterActivationRoll;

    if (!shouldActivate) {
      continue;
    }

    const [durationTicks, rngAfterDuration] = rng.nextInt(
      rule.minDurationTicks,
      rule.maxDurationTicks,
    );
    rng = rngAfterDuration;

    const activatedMode = createDegradedMode({
      rule,
      tick,
      durationTicks,
    });

    return {
      degradedModes: [...degradedModes, activatedMode],
      rng,
      activatedMode,
    };
  }

  return {
    degradedModes,
    rng,
  };
}
