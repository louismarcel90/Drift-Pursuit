import { describe, expect, it } from "vitest";

import {
  expectedMinimumEventCountByScenario,
  verificationScenarioIds,
} from "./verification-fixtures.js";
import { runScenarioHarness } from "./run-scenario-harness.js";

describe("Global deterministic verification", () => {
  it.each(verificationScenarioIds)("reproduces stable results for %s", (scenarioId) => {
    const firstRun = runScenarioHarness(scenarioId);
    const secondRun = runScenarioHarness(scenarioId);

    expect(firstRun.finalChecksum).toBe(secondRun.finalChecksum);
    expect(firstRun.finalState).toEqual(secondRun.finalState);
    expect(firstRun.replayVerified).toBe(true);
    expect(secondRun.replayVerified).toBe(true);
  });

  it.each(verificationScenarioIds)("produces meaningful event streams for %s", (scenarioId) => {
    const result = runScenarioHarness(scenarioId);

    expect(result.finalState.events.length).toBeGreaterThanOrEqual(
      expectedMinimumEventCountByScenario[scenarioId],
    );
  });
});
