import { describe, expect, it } from "vitest";

import type { ScoringResult } from "./scoring-result.js";

describe("ScoringResult contract", () => {
  it("supports a reason-coded scoring result", () => {
    const result: ScoringResult = {
      finalScore: 920,
      grade: "S",
      breakdown: {
        controlScore: 300,
        pursuitScore: 300,
        efficiencyScore: 250,
        collisionPenalty: 0,
        riskPenalty: 0,
        styleBonus: 70,
      },
      primaryReasonCode: "mission-objective-completed",
      explanation: "Mission completed with high control and clean pursuit pressure.",
    };

    expect(result.grade).toBe("S");
    expect(result.primaryReasonCode).toBe("mission-objective-completed");
  });
});