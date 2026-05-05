import { describe, expect, it } from "vitest";

import { perfectStormScenario } from "./built-in-scenarios.js";
import { loadBuiltInScenario, loadScenarioDefinition } from "./scenario-loader.js";
import { validateScenarioDefinition } from "./scenario-validation.js";

describe("Scenario kit", () => {
  it("validates a built-in scenario", () => {
    const result = validateScenarioDefinition(perfectStormScenario);

    expect(result.valid).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("loads a scenario and converts scripted input to commands", () => {
    const result = loadScenarioDefinition(perfectStormScenario);

    expect(result.scenario.definition.id).toBe("showcase.perfect-storm");
    expect(result.inputLog.length).toBeGreaterThan(0);
    expect(result.inputLog[0]?.source).toBe("script");
  });

  it("loads a built-in scenario by id", () => {
    const result = loadBuiltInScenario("showcase.perfect-storm");

    expect(result.scenario.definition.title).toBe("Perfect Storm");
  });

  it("rejects invalid scenario definitions", () => {
    const invalidScenario = {
      ...perfectStormScenario,
      id: "",
      seed: -1
    };

    const result = validateScenarioDefinition(invalidScenario);

    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });
});