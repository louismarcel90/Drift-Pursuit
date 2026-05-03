import { describe, expect, it } from "vitest";

import { createDeterministicRng } from "./deterministic-rng.js";

describe("createDeterministicRng", () => {
  it("produces the same float sequence for the same seed", () => {
    let firstRng = createDeterministicRng(12345);
    let secondRng = createDeterministicRng(12345);

    const firstValues: number[] = [];
    const secondValues: number[] = [];

    for (let index = 0; index < 5; index += 1) {
      const [firstValue, nextFirstRng] = firstRng.nextFloat();
      const [secondValue, nextSecondRng] = secondRng.nextFloat();

      firstValues.push(firstValue);
      secondValues.push(secondValue);

      firstRng = nextFirstRng;
      secondRng = nextSecondRng;
    }

    expect(firstValues).toEqual(secondValues);
  });

  it("tracks how many draws were consumed", () => {
    const rng = createDeterministicRng(99);
    const [, nextRng] = rng.nextInt(1, 10);
    const [, finalRng] = nextRng.nextBoolean(0.5);

    expect(finalRng.state.draws).toBe(2);
  });
});