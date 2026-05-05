export const verificationScenarioIds = [
  "training.first-contact",
  "pursuit.downtown-pressure",
  "showcase.perfect-storm",
] as const;

export type VerificationScenarioId = (typeof verificationScenarioIds)[number];

export const expectedMinimumEventCountByScenario: Record<VerificationScenarioId, number> = {
  "training.first-contact": 20,
  "pursuit.downtown-pressure": 30,
  "showcase.perfect-storm": 30,
};
