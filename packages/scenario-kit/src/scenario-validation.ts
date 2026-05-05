import type { ScenarioDefinition } from "./scenario-definition.js";

export type ScenarioValidationIssueCode =
  | "missing-id"
  | "missing-title"
  | "invalid-seed"
  | "invalid-total-ticks"
  | "invalid-tick-duration"
  | "empty-scripted-input"
  | "scripted-input-out-of-range";

export type ScenarioValidationIssue = {
  readonly code: ScenarioValidationIssueCode;
  readonly message: string;
};

export type ScenarioValidationResult = {
  readonly valid: boolean;
  readonly issues: readonly ScenarioValidationIssue[];
};

function createIssue(code: ScenarioValidationIssueCode, message: string): ScenarioValidationIssue {
  return {
    code,
    message,
  };
}

export function validateScenarioDefinition(scenario: ScenarioDefinition): ScenarioValidationResult {
  const issues: ScenarioValidationIssue[] = [];

  if (scenario.id.trim().length === 0) {
    issues.push(createIssue("missing-id", "Scenario id is required."));
  }

  if (scenario.title.trim().length === 0) {
    issues.push(createIssue("missing-title", "Scenario title is required."));
  }

  if (!Number.isInteger(scenario.seed) || scenario.seed <= 0) {
    issues.push(createIssue("invalid-seed", "Scenario seed must be a positive integer."));
  }

  if (!Number.isInteger(scenario.totalTicks) || scenario.totalTicks <= 0) {
    issues.push(
      createIssue("invalid-total-ticks", "Scenario totalTicks must be a positive integer."),
    );
  }

  if (!Number.isInteger(scenario.tickDurationMs) || scenario.tickDurationMs <= 0) {
    issues.push(
      createIssue("invalid-tick-duration", "Scenario tickDurationMs must be a positive integer."),
    );
  }

  if (scenario.scriptedInput.length === 0) {
    issues.push(createIssue("empty-scripted-input", "Scenario scripted input must not be empty."));
  }

  const outOfRangeStep = scenario.scriptedInput.find(
    (step) => step.tick < 1 || step.tick > scenario.totalTicks,
  );

  if (outOfRangeStep !== undefined) {
    issues.push(
      createIssue(
        "scripted-input-out-of-range",
        `Scripted input tick ${outOfRangeStep.tick} is outside scenario range.`,
      ),
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function assertScenarioDefinitionIsValid(scenario: ScenarioDefinition): void {
  const result = validateScenarioDefinition(scenario);

  if (!result.valid) {
    const details = result.issues.map((issue) => `${issue.code}: ${issue.message}`).join("; ");

    throw new Error(`Invalid scenario definition: ${details}`);
  }
}
