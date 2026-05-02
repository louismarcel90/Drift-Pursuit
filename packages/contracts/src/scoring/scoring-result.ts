import type { ReasonCode } from "../reasoning/index.js";

export type ScoreGrade = "S" | "A" | "B" | "C" | "D" | "F";

export type ScoringBreakdown = {
  controlScore: number;
  pursuitScore: number;
  efficiencyScore: number;
  collisionPenalty: number;
  riskPenalty: number;
  styleBonus: number;
};

export type ScoringResult = {
  finalScore: number;
  grade: ScoreGrade;
  breakdown: ScoringBreakdown;
  primaryReasonCode: ReasonCode;
  explanation: string;
};