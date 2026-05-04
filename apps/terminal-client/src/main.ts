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
  { kind: "accelerate", tick: 9, source: "keyboard" },
  { kind: "steer-left", tick: 10, source: "keyboard" }
];

let runtime = createSimulationRuntime({
  scenarioId: "showcase.perfect-storm",
  seed: 20260502,
  tickDurationMs: 100
});

for (let index = 0; index < 24; index += 1) {
  const result = advanceSimulationTick(runtime, commands);
  runtime = result.state;
}

const playerVehicle = runtime.authoritativeState.playerVehicle;
const targetVehicle = runtime.authoritativeState.targetVehicle;
const pursuitState = runtime.authoritativeState.pursuitState;
const trafficVehicles = runtime.authoritativeState.trafficVehicles;
const incidents = runtime.authoritativeState.incidents;
const latestTargetEvent = [...runtime.authoritativeState.events]
  .reverse()
  .find((event) => event.kind === "target-updated");
const latestIncidentEvent = [...runtime.authoritativeState.events]
  .reverse()
  .find((event) => event.kind === "incident-created");
const latestEvent =
  runtime.authoritativeState.events[runtime.authoritativeState.events.length - 1];

const targetRow =
  targetVehicle === undefined
    ? "Target          : missing"
    : `Target          : (${targetVehicle.position.x.toFixed(2)}, ${targetVehicle.position.y.toFixed(2)}) speed=${targetVehicle.dynamics.speed.toFixed(2)}`;

const incidentRows =
  incidents.length === 0
    ? ["Incidents       : none"]
    : incidents.slice(0, 3).map((incident) => {
        return `Incident ${incident.id} : ${incident.kind} ${incident.severity} at (${incident.position.x.toFixed(2)}, ${incident.position.y.toFixed(2)})`;
      });

const banner = [
  "╔══════════════════════════════════════════════════════════════╗",
  "║                    DRIFT PURSUIT GRID                       ║",
  "║  Terminal-native. Deterministic. Replayable. Explainable.   ║",
  "╚══════════════════════════════════════════════════════════════╝",
  "",
  `Scenario        : ${runtime.config.scenarioId}`,
  `Seed            : ${runtime.config.seed}`,
  `Current Tick    : ${runtime.authoritativeState.tick}`,
  `Player Speed    : ${playerVehicle.dynamics.speed.toFixed(2)}`,
  `Player Control  : ${playerVehicle.dynamics.controlState}`,
  `Player Position : (${playerVehicle.position.x.toFixed(2)}, ${playerVehicle.position.y.toFixed(2)})`,
  targetRow,
  `Pursuit Lock    : ${pursuitState.lockState}`,
  `Target Distance : ${pursuitState.targetDistance.toFixed(2)}`,
  `Pressure        : ${pursuitState.pursuitPressure.toFixed(2)}`,
  `Traffic Count   : ${trafficVehicles.length}`,
  `Incident Count  : ${incidents.length}`,
  ...incidentRows,
  `RNG Draws       : ${runtime.rng.state.draws}`,
  `Accepted Inputs : ${runtime.acceptedCommands.length}`,
  `Target AI       : ${latestTargetEvent?.message ?? "No target decision emitted."}`,
  `Incident Event  : ${latestIncidentEvent?.message ?? "No incident created."}`,
  `Latest Event    : ${latestEvent?.message ?? "No event emitted."}`,
  "",
  "STEP 12 incident engine is running.",
].join("\n");

console.log(banner);