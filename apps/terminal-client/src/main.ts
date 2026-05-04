import type { PlayerCommand } from "@drift-pursuit-grid/contracts";
import { advanceSimulationTick, createSimulationRuntime } from "@drift-pursuit-grid/simulation-core";

const commands: readonly PlayerCommand[] = [
  {
    kind: "accelerate",
    tick: 1,
    source: "keyboard",
  },
  {
    kind: "accelerate",
    tick: 2,
    source: "keyboard",
  },
  {
    kind: "accelerate",
    tick: 3,
    source: "keyboard",
  },
  {
    kind: "steer-right",
    tick: 4,
    source: "keyboard",
  },
  {
    kind: "handbrake",
    tick: 4,
    source: "keyboard",
  },
  {
    kind: "steer-right",
    tick: 5,
    source: "keyboard",
  },
  {
    kind: "handbrake",
    tick: 5,
    source: "keyboard",
  },
];

let runtime = createSimulationRuntime({
  scenarioId: "showcase.perfect-storm",
  seed: 20260502,
  tickDurationMs: 100,
});

for (let index = 0; index < 7; index += 1) {
  const result = advanceSimulationTick(runtime, commands);
  runtime = result.state;
}

const playerVehicle = runtime.authoritativeState.playerVehicle;
const latestEvent =
  runtime.authoritativeState.events[runtime.authoritativeState.events.length - 1];

const banner = [
  "╔══════════════════════════════════════════════════════════════╗",
  "║                    DRIFT PURSUIT GRID                       ║",
  "║  Terminal-native. Deterministic. Replayable. Explainable.   ║",
  "╚══════════════════════════════════════════════════════════════╝",
  "",
  `Scenario        : ${runtime.config.scenarioId}`,
  `Seed            : ${runtime.config.seed}`,
  `Current Tick    : ${runtime.authoritativeState.tick}`,
  `Speed           : ${playerVehicle.dynamics.speed.toFixed(2)}`,
  `Heading         : ${playerVehicle.dynamics.headingDegrees.toFixed(2)}°`,
  `Drift Factor    : ${playerVehicle.dynamics.driftFactor.toFixed(2)}`,
  `Control Level   : ${playerVehicle.dynamics.controlLevel.toFixed(2)}`,
  `Control State   : ${playerVehicle.dynamics.controlState}`,
  `Position        : (${playerVehicle.position.x.toFixed(2)}, ${playerVehicle.position.y.toFixed(2)})`,
  `RNG Draws       : ${runtime.rng.state.draws}`,
  `Accepted Inputs : ${runtime.acceptedCommands.length}`,
  `Latest Event    : ${latestEvent?.message ?? "No event emitted."}`,
  "",
  "STEP 7 vehicle dynamics are running.",
].join("\n");

console.log(banner);