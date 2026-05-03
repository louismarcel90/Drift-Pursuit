import { describe, expect, it } from "vitest";

import type { PlayerCommand } from "./simulation-runtime.js";

import { advanceSimulationTick, createSimulationRuntime } from "./simulation-runtime.js";
import { simulationPhaseOrder } from "./simulation-phase.js";

describe("SimulationRuntime", () => {
  it("advances ticks with a stable deterministic phase order", () => {
    const runtime = createSimulationRuntime({
      scenarioId: "test.runtime.phase-order",
      seed: 42,
      tickDurationMs: 100,
    });

    const result = advanceSimulationTick(runtime, []);

    expect(result.state.tick).toBe(1);
    expect(result.state.executedPhases).toEqual(simulationPhaseOrder);
  });

  it("produces the same event stream for the same seed and same commands", () => {
    const commands: readonly PlayerCommand[] = [
      {
        kind: "accelerate",
        tick: 1,
        source: "keyboard",
      },
      {
        kind: "steer-left",
        tick: 2,
        source: "keyboard",
      },
    ];

    let firstRuntime = createSimulationRuntime({
      scenarioId: "test.runtime.determinism",
      seed: 2026,
      tickDurationMs: 100,
    });

    let secondRuntime = createSimulationRuntime({
      scenarioId: "test.runtime.determinism",
      seed: 2026,
      tickDurationMs: 100,
    });

    for (let index = 0; index < 3; index += 1) {
      const firstResult = advanceSimulationTick(firstRuntime, commands);
      const secondResult = advanceSimulationTick(secondRuntime, commands);

      firstRuntime = firstResult.state;
      secondRuntime = secondResult.state;
    }

    expect(firstRuntime.events).toEqual(secondRuntime.events);
    expect(firstRuntime.rng.state).toEqual(secondRuntime.rng.state);
    expect(firstRuntime.executedPhases).toEqual(secondRuntime.executedPhases);
  });

  it("accepts only commands matching the next tick", () => {
    const runtime = createSimulationRuntime({
      scenarioId: "test.runtime.command-filtering",
      seed: 7,
      tickDurationMs: 100,
    });

    const commands: readonly PlayerCommand[] = [
      {
        kind: "accelerate",
        tick: 1,
        source: "keyboard",
      },
      {
        kind: "brake",
        tick: 3,
        source: "keyboard",
      },
    ];

    const result = advanceSimulationTick(runtime, commands);

    expect(result.state.acceptedCommands).toHaveLength(1);
    expect(result.state.acceptedCommands[0]?.kind).toBe("accelerate");
  });
});