export * from "./scoring-result.js";

export type ScoreBreakdown = {
  safety: number;
  efficiency: number;
  completion: number;
};

export type SimulationScore = {
  total: number;
  breakdown: ScoreBreakdown;
};