import type { PlayerCommand } from "@drift-pursuit-grid/contracts";
import { advanceSimulationTick, createSimulationRuntime } from "@drift-pursuit-grid/simulation-core";

const commands: readonly PlayerCommand[] = [
  { kind: "accelerate", tick: 1, source: "keyboard" },
  { kind: "accelerate", tick: 2, source: "keyboard" },
  { kind: "accelerate", tick: 3, source: "keyboard" },
  { kind: "accelerate", tick: 4, source: "keyboard" },
  { kind: "accelerate", tick: 5, source: "keyboard" },
  { kind: "accelerate", tick: 6, source: "keyboard" },
  { kind: "steer-right", tick: 7, source: "keyboard" },
  { kind: "handbrake", tick: 7, source: "keyboard" },
  { kind: "steer-right", tick: 8, source: "keyboard" },
  { kind: "handbrake", tick: 8, source: "keyboard" },
];

let runtime = createSimulationRuntime({
  scenarioId: "showcase.perfect-storm",
  seed: 20260502,
  tickDurationMs: 100,
});

for (let index = 0; index < 14; index += 1) {
  const result = advanceSimulationTick(runtime, commands);
  runtime = result.state;
}

const playerVehicle = runtime.authoritativeState.playerVehicle;
const targetVehicle = runtime.authoritativeState.targetVehicle;
const pursuitState = runtime.authoritativeState.pursuitState;
const trafficVehicles = runtime.authoritativeState.trafficVehicles;
const collisionEvents = runtime.authoritativeState.events.filter(
  (event) => event.kind === "collision-detected",
);
const latestEvent =
  runtime.authoritativeState.events[runtime.authoritativeState.events.length - 1];

const targetRow =
  targetVehicle === undefined
    ? "Target          : missing"
    : `Target          : (${targetVehicle.position.x.toFixed(2)}, ${targetVehicle.position.y.toFixed(2)})`;

const latestCollisionRow =
  collisionEvents.length === 0
    ? "Latest Collision: none"
    : `Latest Collision: ${collisionEvents[collisionEvents.length - 1]?.message ?? "none"}`;

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
  `Control Level   : ${playerVehicle.dynamics.controlLevel.toFixed(2)}`,
  `Control State   : ${playerVehicle.dynamics.controlState}`,
  `Position        : (${playerVehicle.position.x.toFixed(2)}, ${playerVehicle.position.y.toFixed(2)})`,
  targetRow,
  `Pursuit Lock    : ${pursuitState.lockState}`,
  `Target Distance : ${pursuitState.targetDistance.toFixed(2)}`,
  `Pressure        : ${pursuitState.pursuitPressure.toFixed(2)}`,
  `Traffic Count   : ${trafficVehicles.length}`,
  `Collision Count : ${collisionEvents.length}`,
  latestCollisionRow,
  `RNG Draws       : ${runtime.rng.state.draws}`,
  `Accepted Inputs : ${runtime.acceptedCommands.length}`,
  `Latest Event    : ${latestEvent?.message ?? "No event emitted."}`,
  "",
  "STEP 10 collision engine is running.",
].join("\n");

console.log(banner);