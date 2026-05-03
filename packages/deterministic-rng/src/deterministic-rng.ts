export type DeterministicRngState = {
  readonly seed: number;
  readonly currentState: number;
  readonly draws: number;
};

export type DeterministicRng = {
  readonly state: DeterministicRngState;
  readonly nextFloat: () => readonly [number, DeterministicRng];
  readonly nextInt: (minInclusive: number, maxInclusive: number) => readonly [number, DeterministicRng];
  readonly nextBoolean: (probabilityTrue: number) => readonly [boolean, DeterministicRng];
};

const uint32MaxExclusive = 4_294_967_296;

function normalizeSeed(seed: number): number {
  const normalized = Math.trunc(seed) >>> 0;

  if (normalized === 0) {
    return 1;
  }

  return normalized;
}

function nextState(currentState: number): number {
  return (Math.imul(1_664_525, currentState) + 1_013_904_223) >>> 0;
}

function createRngFromState(state: DeterministicRngState): DeterministicRng {
  return {
    state,

    nextFloat: () => {
      const updatedState = nextState(state.currentState);
      const value = updatedState / uint32MaxExclusive;

      return [
        value,
        createRngFromState({
          seed: state.seed,
          currentState: updatedState,
          draws: state.draws + 1,
        }),
      ];
    },

    nextInt: (minInclusive: number, maxInclusive: number) => {
      const normalizedMin = Math.ceil(minInclusive);
      const normalizedMax = Math.floor(maxInclusive);

      if (normalizedMax < normalizedMin) {
        throw new Error("maxInclusive must be greater than or equal to minInclusive.");
      }

      const [value, nextRng] = createRngFromState(state).nextFloat();
      const range = normalizedMax - normalizedMin + 1;
      const result = Math.floor(value * range) + normalizedMin;

      return [result, nextRng];
    },

    nextBoolean: (probabilityTrue: number) => {
      if (probabilityTrue < 0 || probabilityTrue > 1) {
        throw new Error("probabilityTrue must be between 0 and 1.");
      }

      const [value, nextRng] = createRngFromState(state).nextFloat();

      return [value < probabilityTrue, nextRng];
    },
  };
}

export function createDeterministicRng(seed: number): DeterministicRng {
  const normalizedSeed = normalizeSeed(seed);

  return createRngFromState({
    seed: normalizedSeed,
    currentState: normalizedSeed,
    draws: 0,
  });
}