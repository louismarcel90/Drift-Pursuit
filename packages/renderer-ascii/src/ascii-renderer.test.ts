import { describe, expect, it } from "vitest";

import {
  createGridPosition,
  createInitialPursuitState,
  createStoppedPlayerVehicle,
} from "@drift-pursuit-grid/domain";
import { createAuthoritativeSimulationState } from "@drift-pursuit-grid/state-store";

import { renderAsciiFrame } from "./ascii-frame-renderer.js";
import { projectAsciiRenderModel } from "./render-projector.js";

describe("ASCII renderer", () => {
  it("projects authoritative state into a render model", () => {
    const state = createAuthoritativeSimulationState({
      scenarioId: "test.renderer",
      seed: 1,
      mode: "showcase",
      playerVehicle: createStoppedPlayerVehicle("player", createGridPosition(5, 5)),
      pursuitState: createInitialPursuitState(),
      missionProgress: {
        missionId: "test.renderer",
        status: "in-progress",
        completedObjectiveIds: [],
      },
    });

    const model = projectAsciiRenderModel(state, {
      width: 20,
      height: 10,
      eventFeedLimit: 3,
    });

    expect(model.title).toBe("DRIFT PURSUIT GRID");
    expect(model.glyphs.some((glyph) => glyph.kind === "player")).toBe(true);
  });

  it("renders a terminal frame containing player glyph and HUD", () => {
    const state = createAuthoritativeSimulationState({
      scenarioId: "test.renderer.frame",
      seed: 1,
      mode: "showcase",
      playerVehicle: createStoppedPlayerVehicle("player", createGridPosition(5, 5)),
      pursuitState: createInitialPursuitState(),
      missionProgress: {
        missionId: "test.renderer.frame",
        status: "in-progress",
        completedObjectiveIds: [],
      },
    });

    const model = projectAsciiRenderModel(state, {
      width: 20,
      height: 10,
      eventFeedLimit: 3,
    });

    const frame = renderAsciiFrame(model);

    expect(frame).toContain("DRIFT PURSUIT GRID");
    expect(frame).toContain("P");
    expect(frame).toContain("HUD");
  });
});
