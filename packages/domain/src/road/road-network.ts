import type { GridPosition } from "../geometry/index.js";

export type LaneDirection = "north" | "south" | "east" | "west";

export type Lane = {
  readonly id: string;
  readonly direction: LaneDirection;
  readonly cells: readonly GridPosition[];
  readonly speedLimit: number;
};

export type RoadSegmentKind = "straight" | "turn" | "intersection" | "merge" | "blocked";

export type RoadSegment = {
  readonly id: string;
  readonly kind: RoadSegmentKind;
  readonly laneIds: readonly string[];
};

export type Intersection = {
  readonly id: string;
  readonly position: GridPosition;
  readonly connectedLaneIds: readonly string[];
};

export type RoadNetwork = {
  readonly lanes: readonly Lane[];
  readonly roadSegments: readonly RoadSegment[];
  readonly intersections: readonly Intersection[];
};

export function findLaneById(network: RoadNetwork, laneId: string): Lane | undefined {
  return network.lanes.find((lane) => lane.id === laneId);
}