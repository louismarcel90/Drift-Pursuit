import type { SimulationSnapshot } from "@drift-pursuit-grid/contracts";
import { createGridPosition } from "@drift-pursuit-grid/domain";
import { createStoppedPlayerVehicle } from "@drift-pursuit-grid/domain";


const playerVehicle = createStoppedPlayerVehicle("player-vehicle", createGridPosition(12, 8));

const snapshot: SimulationSnapshot = {
  scenarioId: "showcase.perfect-storm",
  seed: 20260502,
  tick: 0,
  mode: "showcase",
  missionStatus: "not-started",
  healthStatus: "nominal",
  playerVehicle: {
    id: playerVehicle.identity.id,
    x: playerVehicle.position.x,
    y: playerVehicle.position.y,
    speed: playerVehicle.dynamics.speed,
    headingDegrees: playerVehicle.dynamics.headingDegrees,
    driftFactor: playerVehicle.dynamics.driftFactor,
    controlLevel: playerVehicle.dynamics.controlLevel,
  },
  degradedModes: [],
};

const banner = [
  "╔══════════════════════════════════════════════════════════════╗",
  "║                    DRIFT PURSUIT GRID                       ║",
  "║  Terminal-native. Deterministic. Replayable. Explainable.   ║",
  "╚══════════════════════════════════════════════════════════════╝",
  "",
  `Scenario : ${snapshot.scenarioId}`,
  `Seed     : ${snapshot.seed}`,
  `Mode     : ${snapshot.mode}`,
  `Status   : ${snapshot.missionStatus}`,
  `Health   : ${snapshot.healthStatus}`,
  `Vehicle  : ${playerVehicle.identity.displayName}`,
  `Position : (${snapshot.playerVehicle.x}, ${snapshot.playerVehicle.y})`,
  `Control  : ${playerVehicle.dynamics.controlState}`,
  "",
  "STEP 4 domain model is loaded.",
].join("\n");

console.log(banner);