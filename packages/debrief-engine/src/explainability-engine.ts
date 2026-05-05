import type { ReasonCode } from "@drift-pursuit-grid/contracts";
import type { AuthoritativeSimulationState } from "@drift-pursuit-grid/state-store";

import type { DebriefOutcome } from "./debrief-summary.js";
import type { ExtractedEvents } from "./event-extractor.js";

export type ExplanationResult = {
  readonly outcome: DebriefOutcome;
  readonly primaryReasonCode: ReasonCode;
  readonly headline: string;
  readonly explanation: string;
};

export function explainMissionOutcome(params: {
  readonly state: AuthoritativeSimulationState;
  readonly extractedEvents: ExtractedEvents;
}): ExplanationResult {
  const { state, extractedEvents } = params;

  if (extractedEvents.pursuitLossEvents.length > 0) {
    return {
      outcome: "failure",
      primaryReasonCode: "target-distance-exceeded",
      headline: "Pursuit failed: target distance exceeded.",
      explanation:
        "The pursuit lock was lost because the target moved outside the allowed tracking distance.",
    };
  }

  if (extractedEvents.interceptEvents.length > 0 || state.pursuitState.interceptWindowOpen) {
    return {
      outcome: "success",
      primaryReasonCode: "mission-objective-completed",
      headline: "Interception opportunity achieved.",
      explanation:
        "The player maintained enough pursuit pressure and closed the target distance enough to open an interception window.",
    };
  }

  if (extractedEvents.collisionEvents.length > 0) {
    return {
      outcome: "incomplete",
      primaryReasonCode: "collision-control-loss",
      headline: "Run degraded by collision impact.",
      explanation:
        "One or more collisions reduced speed or control, affecting pursuit quality and future scoring.",
    };
  }

  if (state.pursuitState.lockState === "acquired") {
    return {
      outcome: "incomplete",
      primaryReasonCode: "mission-timeout",
      headline: "Pursuit maintained but not completed.",
      explanation:
        "The player kept the target under pressure, but no final interception or mission completion condition was reached.",
    };
  }

  return {
    outcome: "incomplete",
    primaryReasonCode: "mission-timeout",
    headline: "Mission incomplete.",
    explanation: "The session ended before a decisive success or failure condition was reached.",
  };
}
