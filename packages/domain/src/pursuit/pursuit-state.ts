import type { ReasonCode } from "@drift-pursuit-grid/contracts";

export type PursuitLockState = "not-acquired" | "acquired" | "lost";

export type PursuitState = {
  readonly lockState: PursuitLockState;
  readonly targetDistance: number;
  readonly pursuitPressure: number;
  readonly interceptWindowOpen: boolean;
  readonly lastReasonCode?: ReasonCode;
};

export function createInitialPursuitState(): PursuitState {
  return {
    lockState: "not-acquired",
    targetDistance: 0,
    pursuitPressure: 0,
    interceptWindowOpen: false,
  };
}