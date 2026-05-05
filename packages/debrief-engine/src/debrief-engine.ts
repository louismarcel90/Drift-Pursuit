import type { DebriefHighlight, DebriefHighlightKind } from "@drift-pursuit-grid/domain";
import type { AuthoritativeSimulationState } from "@drift-pursuit-grid/state-store";

import type { DebriefSummary } from "./debrief-summary.js";
import { explainMissionOutcome } from "./explainability-engine.js";
import { extractDebriefEvents } from "./event-extractor.js";
import type { ReasonCode } from "../../contracts/src/reasoning/index.js";
import type { SimulationEvent } from "../../contracts/src/events/index.js";

const REASON_CODE_MAP: Partial<Record<SimulationEvent["kind"], ReasonCode>> = {
  "pursuit-lock-lost": "target-distance-exceeded",
  "collision-detected": "collision-control-loss",
  "incident-created": "degraded-mode-impact",
  "intercept-window-opened": "clean-intercept",
};

function createHighlightKind(eventKind: string): DebriefHighlightKind {
  switch (eventKind) {
    case "collision-detected":
      return "collision-cost";

    case "pursuit-lock-lost":
      return "target-lost";

    case "intercept-window-opened":
      return "clean-intercept";

    case "incident-created":
      return "degraded-mode-impact";

    default:
      return "high-risk-recovery";
  }
}

function createHighlights(state: AuthoritativeSimulationState): readonly DebriefHighlight[] {
  return state.events
    .filter((event) =>
      [
        "collision-detected",
        "pursuit-lock-lost",
        "intercept-window-opened",
        "incident-created",
      ].includes(event.kind),
    )
    .map(
      (event): DebriefHighlight => ({
        kind: createHighlightKind(event.kind),
        tick: event.tick,
        message: event.message,
        reasonCode: REASON_CODE_MAP[event.kind] ?? "high-risk-recovery",
      }),
    );
}

export function createDebriefSummary(state: AuthoritativeSimulationState): DebriefSummary {
  const extractedEvents = extractDebriefEvents(state.events);
  const explanation = explainMissionOutcome({
    state,
    extractedEvents,
  });

  return {
    scenarioId: state.scenarioId,
    seed: state.seed,
    totalTicks: state.tick,
    outcome: explanation.outcome,
    primaryReasonCode: explanation.primaryReasonCode,
    headline: explanation.headline,
    explanation: explanation.explanation,
    highlights: createHighlights(state),
    keyEvents: extractedEvents.keyEvents,
    collisionCount: extractedEvents.collisionEvents.length,
    incidentCount: extractedEvents.incidentEvents.length,
    finalTargetDistance: state.pursuitState.targetDistance,
    finalPursuitPressure: state.pursuitState.pursuitPressure,
  };
}

export function renderDebriefSummary(summary: DebriefSummary): string {
  const highlightLines =
    summary.highlights.length === 0
      ? ["- No major highlights recorded."]
      : summary.highlights.map((highlight) => {
          return `- [t=${highlight.tick}] ${highlight.kind}: ${highlight.message}`;
        });

  return [
    "DEBRIEF SUMMARY",
    `Scenario        : ${summary.scenarioId}`,
    `Seed            : ${summary.seed}`,
    `Ticks           : ${summary.totalTicks}`,
    `Outcome         : ${summary.outcome}`,
    `Reason Code     : ${summary.primaryReasonCode}`,
    `Headline        : ${summary.headline}`,
    `Explanation     : ${summary.explanation}`,
    `Collisions      : ${summary.collisionCount}`,
    `Incidents       : ${summary.incidentCount}`,
    `Final Distance  : ${summary.finalTargetDistance.toFixed(2)}`,
    `Final Pressure  : ${summary.finalPursuitPressure.toFixed(2)}`,
    "",
    "Highlights",
    ...highlightLines,
  ].join("\n");
}
