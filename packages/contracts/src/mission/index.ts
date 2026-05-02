export * from "./simulation-mode.js";
export * from "./mission-status.js";

export type MissionStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "failed";

export type MissionState = {
  id: string;
  status: MissionStatus;
};