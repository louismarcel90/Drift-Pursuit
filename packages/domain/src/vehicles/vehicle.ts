import type { GridPosition, HeadingDegrees, Vector2D } from "../geometry/index.js";

export type VehicleRole = "player" | "target" | "traffic";

export type VehicleControlState = "stable" | "drifting" | "recovering" | "control-lost";

export type VehicleIdentity = {
  readonly id: string;
  readonly role: VehicleRole;
  readonly displayName: string;
};

export type VehicleDynamicsState = {
  readonly speed: number;
  readonly headingDegrees: HeadingDegrees;
  readonly velocity: Vector2D;
  readonly driftFactor: number;
  readonly controlLevel: number;
  readonly controlState: VehicleControlState;
};

export type Vehicle = {
  readonly identity: VehicleIdentity;
  readonly position: GridPosition;
  readonly dynamics: VehicleDynamicsState;
};

export type PlayerVehicle = Vehicle & {
  readonly identity: VehicleIdentity & {
    readonly role: "player";
  };
};

export type TargetVehicle = Vehicle & {
  readonly identity: VehicleIdentity & {
    readonly role: "target";
  };
  readonly aggressionLevel: number;
};

export type TrafficVehicle = Vehicle & {
  readonly identity: VehicleIdentity & {
    readonly role: "traffic";
  };
  readonly laneId: string;
  readonly desiredSpeed: number;
};

export function createStoppedPlayerVehicle(id: string, position: GridPosition): PlayerVehicle {
  return {
    identity: {
      id,
      role: "player",
      displayName: "P1",
    },
    position,
    dynamics: {
      speed: 0,
      headingDegrees: 0,
      velocity: { x: 0, y: 0 },
      driftFactor: 0,
      controlLevel: 1,
      controlState: "stable",
    },
  };
}