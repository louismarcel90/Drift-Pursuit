import type { PlayerCommand } from "@drift-pursuit-grid/contracts";
import { advanceSimulationTick, createSimulationRuntime } from "@drift-pursuit-grid/simulation-core";

const commands: readonly PlayerCommand[] = [
  {
    kind: "accelerate",
    tick: 1,
    source: "keyboard",
  },
  {
    kind: "steer-right",
    tick: 2,
    source: "keyboard",
  },
  {
    kind: "handbrake",
    tick: 3,
    source: "keyboard",
  },
];

let runtime = createSimulationRuntime({
  scenarioId: "showcase.perfect-storm",
  seed: 20260502,
  tickDurationMs: 100,
});

for (let index = 0; index < 3; index += 1) {
  const result = advanceSimulationTick(runtime, commands);
  runtime = result.state;
}

const latestEvent = runtime.authoritativeState.events[runtime.authoritativeState.events.length - 1];
const banner = [
  "╔══════════════════════════════════════════════════════════════╗",
  "║                    DRIFT PURSUIT GRID                       ║",
  "║  Terminal-native. Deterministic. Replayable. Explainable.   ║",
  "╚══════════════════════════════════════════════════════════════╝",
  "",
  `Scenario        : ${runtime.config.scenarioId}`,
  `Seed            : ${runtime.config.seed}`,
  `Tick Duration   : ${runtime.config.tickDurationMs}ms`,
  `Current Tick    : ${runtime.authoritativeState.tick}`,
  `RNG Draws       : ${runtime.rng.state.draws}`,
  `Accepted Inputs : ${runtime.acceptedCommands.length}`,
  `Executed Phases : ${runtime.executedPhases.length}`,
  `Latest Event    : ${latestEvent?.message ?? "No event emitted."}`,
  "",
  "STEP 5 deterministic runtime is running.",
].join("\n");

console.log(banner);