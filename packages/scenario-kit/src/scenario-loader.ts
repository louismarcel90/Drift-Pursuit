import { createCommandsFromScriptedInput } from "@drift-pursuit-grid/input-system";
import type { PlayerCommand } from "@drift-pursuit-grid/contracts";

import { builtInScenarios } from "./built-in-scenarios.js";
import type { LoadedScenario, ScenarioDefinition } from "./scenario-definition.js";
import { assertScenarioDefinitionIsValid } from "./scenario-validation.js";

export type ScenarioLoadResult = {
  readonly scenario: LoadedScenario;
  readonly inputLog: readonly PlayerCommand[];
};

export function findBuiltInScenarioById(id: string): ScenarioDefinition | undefined {
  return builtInScenarios.find((scenario) => scenario.id === id);
}

export function loadScenarioDefinition(definition: ScenarioDefinition): ScenarioLoadResult {
  assertScenarioDefinitionIsValid(definition);

  return {
    scenario: {
      definition,
      loadedAtTick: 0
    },
    inputLog: createCommandsFromScriptedInput({
      steps: definition.scriptedInput
    })
  };
}

export function loadBuiltInScenario(id: string): ScenarioLoadResult {
  const scenario = findBuiltInScenarioById(id);

  if (scenario === undefined) {
    throw new Error(`Built-in scenario not found: ${id}`);
  }

  return loadScenarioDefinition(scenario);
}