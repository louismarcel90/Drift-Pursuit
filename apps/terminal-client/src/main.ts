import type { SimulationSnapshot } from "@drift-pursuit-grid/contracts";

const snapshot: SimulationSnapshot = {
  scenarioId: "showcase.perfect-storm",
  seed: 20260502,
  tick: 0,
  mode: "showcase",
  missionStatus: "not-started",
  healthStatus: "nominal",
  playerVehicle: {
    id: "player-vehicle",
    x: 12,
    y: 8,
    speed: 0,
    headingDegrees: 0,
    driftFactor: 0,
    controlLevel: 1,
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
  `Vehicle  : ${snapshot.playerVehicle.id}`,
  `Position : (${snapshot.playerVehicle.x}, ${snapshot.playerVehicle.y})`,
  "",
  "STEP 3 contracts are loaded.",
].join("\n");

console.log(banner);