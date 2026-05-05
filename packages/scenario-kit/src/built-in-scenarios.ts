import type { ScenarioDefinition } from "./scenario-definition.js";

export const firstContactScenario: ScenarioDefinition = {
  id: "training.first-contact",
  title: "First Contact",
  mode: "training",
  difficulty: "training",
  description: "Learn basic acceleration, steering, and target tracking.",
  seed: 20260501,
  totalTicks: 18,
  tickDurationMs: 100,
  trafficProfile: "low",
  incidentProfile: "none",
  degradedProfile: "disabled",
  scriptedInput: [
    {
      tick: 1,
      commands: ["accelerate"],
    },
    {
      tick: 2,
      commands: ["accelerate"],
    },
    {
      tick: 3,
      commands: ["accelerate"],
    },
    {
      tick: 5,
      commands: ["steer-right"],
    },
    {
      tick: 6,
      commands: ["steer-left"],
    },
    {
      tick: 8,
      commands: ["accelerate"],
    },
  ],
};

export const downtownPressureScenario: ScenarioDefinition = {
  id: "pursuit.downtown-pressure",
  title: "Downtown Pressure",
  mode: "pursuit",
  difficulty: "standard",
  description: "Maintain pressure through dynamic traffic and urban incidents.",
  seed: 20260502,
  totalTicks: 24,
  tickDurationMs: 100,
  trafficProfile: "medium",
  incidentProfile: "dynamic",
  degradedProfile: "light",
  scriptedInput: [
    {
      tick: 1,
      commands: ["accelerate"],
    },
    {
      tick: 2,
      commands: ["accelerate"],
    },
    {
      tick: 3,
      commands: ["accelerate"],
    },
    {
      tick: 4,
      commands: ["accelerate"],
    },
    {
      tick: 5,
      commands: ["steer-right", "handbrake"],
    },
    {
      tick: 6,
      commands: ["steer-right", "handbrake"],
    },
    {
      tick: 7,
      commands: ["accelerate"],
    },
    {
      tick: 8,
      commands: ["steer-left"],
    },
    {
      tick: 9,
      commands: ["accelerate"],
    },
    {
      tick: 10,
      commands: ["accelerate"],
    },
  ],
};

export const perfectStormScenario: ScenarioDefinition = {
  id: "showcase.perfect-storm",
  title: "Perfect Storm",
  mode: "showcase",
  difficulty: "showcase",
  description: "A compact showcase run with traffic, incidents, target AI, replay, and debrief.",
  seed: 20260502,
  totalTicks: 24,
  tickDurationMs: 100,
  trafficProfile: "medium",
  incidentProfile: "dynamic",
  degradedProfile: "light",
  scriptedInput: downtownPressureScenario.scriptedInput,
};

export const builtInScenarios: readonly ScenarioDefinition[] = [
  firstContactScenario,
  downtownPressureScenario,
  perfectStormScenario,
];
