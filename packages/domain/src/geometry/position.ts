export type GridPosition = {
  readonly x: number;
  readonly y: number;
};

export type Vector2D = {
  readonly x: number;
  readonly y: number;
};

export type HeadingDegrees = number;

export type WorldBounds = {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
};

export function createGridPosition(x: number, y: number): GridPosition {
  return { x, y };
}

export function calculateManhattanDistance(first: GridPosition, second: GridPosition): number {
  return Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
}

export function isInsideWorldBounds(position: GridPosition, bounds: WorldBounds): boolean {
  return (
    position.x >= bounds.minX &&
    position.x <= bounds.maxX &&
    position.y >= bounds.minY &&
    position.y <= bounds.maxY
  );
}
