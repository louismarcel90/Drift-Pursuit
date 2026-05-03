import type { AuthoritativeSimulationState } from "./authoritative-state.js";

export type StateGuardViolationCode =
  | "negative-tick"
  | "negative-player-speed"
  | "invalid-player-control-level"
  | "completed-mission-requires-completed-status"
  | "pursuit-loss-without-reason";

export type StateGuardViolation = {
  readonly code: StateGuardViolationCode;
  readonly message: string;
};

export type StateGuardResult = {
  readonly valid: boolean;
  readonly violations: readonly StateGuardViolation[];
};

function createViolation(
  code: StateGuardViolationCode,
  message: string,
): StateGuardViolation {
  return { code, message };
}

export function validateAuthoritativeState(
  state: AuthoritativeSimulationState,
): StateGuardResult {
  const violations: StateGuardViolation[] = [];

  if (state.tick < 0) {
    violations.push(createViolation("negative-tick", "Simulation tick cannot be negative."));
  }

  if (state.playerVehicle.dynamics.speed < 0) {
    violations.push(
      createViolation("negative-player-speed", "Player vehicle speed cannot be negative."),
    );
  }

  if (
    state.playerVehicle.dynamics.controlLevel < 0 ||
    state.playerVehicle.dynamics.controlLevel > 1
  ) {
    violations.push(
      createViolation(
        "invalid-player-control-level",
        "Player vehicle control level must be between 0 and 1.",
      ),
    );
  }

  if (
    state.missionStatus === "completed" &&
    state.missionProgress.status !== "completed"
  ) {
    violations.push(
      createViolation(
        "completed-mission-requires-completed-status",
        "A completed mission must have a completed mission progress status.",
      ),
    );
  }

  if (
    state.pursuitState.lockState === "lost" &&
    state.pursuitState.lastReasonCode === undefined
  ) {
    violations.push(
      createViolation(
        "pursuit-loss-without-reason",
        "A lost pursuit lock must include a reason code.",
      ),
    );
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

export function assertAuthoritativeStateIsValid(
  state: AuthoritativeSimulationState,
): void {
  const result = validateAuthoritativeState(state);

  if (!result.valid) {
    const details = result.violations
      .map((violation) => `${violation.code}: ${violation.message}`)
      .join("; ");

    throw new Error(`Invalid authoritative simulation state: ${details}`);
  }
}