import { describe, expect, it } from "vitest";

import {
  calculateManhattanDistance,
  createGridPosition,
  isInsideWorldBounds,
} from "./position.js";

describe("GridPosition domain helpers", () => {
  it("calculates Manhattan distance between two grid positions", () => {
    const first = createGridPosition(2, 3);
    const second = createGridPosition(7, 11);

    expect(calculateManhattanDistance(first, second)).toBe(13);
  });

  it("detects whether a position is inside world bounds", () => {
    const position = createGridPosition(5, 5);

    expect(
      isInsideWorldBounds(position, {
        minX: 0,
        maxX: 10,
        minY: 0,
        maxY: 10,
      }),
    ).toBe(true);
  });
});