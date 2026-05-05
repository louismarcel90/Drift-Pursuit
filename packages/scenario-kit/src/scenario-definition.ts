import type { SimulationMode } from "@drift-pursuit-grid/contracts";
import type { ScriptedInputStep } from "@drift-pursuit-grid/input-system";

export type ScenarioDifficulty = "training" | "standard" | "hard" | "showcase";

export type ScenarioTrafficProfile = "low" | "medium" | "high";

export type ScenarioIncidentProfile = "none" | "light" | "dynamic";

export type ScenarioDegradedProfile = "disabled" | "light" | "aggressive";

export type ScenarioDefinition = {
  readonly id: string;
  readonly title: string;
  readonly mode: SimulationMode;
  readonly difficulty: ScenarioDifficulty;
  readonly description: string;
  readonly seed: number;
  readonly totalTicks: number;
  readonly tickDurationMs: number;
  readonly trafficProfile: ScenarioTrafficProfile;
  readonly incidentProfile: ScenarioIncidentProfile;
  readonly degradedProfile: ScenarioDegradedProfile;
  readonly scriptedInput: readonly ScriptedInputStep[];
};

export type LoadedScenario = {
  readonly definition: ScenarioDefinition;
  readonly loadedAtTick: number;
};