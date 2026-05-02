import type { SimulationSnapshot } from "@drift-pursuit-grid/contracts";

const snapshot: SimulationSnapshot = {
  scenarioId: "showcase.perfect-storm",
  seed: 20260502,
  tick: 0,
  mode: "showcase",
  missionStatus: "not-started",
  healthStatus: "nominal",
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
  "",
  "STEP 2 foundation is running.",
].join("\n");

console.log(banner);