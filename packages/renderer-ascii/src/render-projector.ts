import type { SimulationEvent } from "@drift-pursuit-grid/contracts";
import type { AuthoritativeSimulationState } from "@drift-pursuit-grid/state-store";

import { defaultAsciiRendererConfig } from "./ascii-renderer-config.js";
import type { AsciiRendererConfig } from "./ascii-renderer-config.js";
import type { HudLine, RenderGlyph, RenderModel } from "./render-model.js";

function normalizeToGrid(value: number, max: number): number {
  const rounded = Math.round(value);

  if (rounded < 0) {
    return 0;
  }

  if (rounded >= max) {
    return max - 1;
  }

  return rounded;
}

function createRoadGlyphs(width: number, height: number): readonly RenderGlyph[] {
  const centerY = Math.floor(height / 2);
  const upperLaneY = Math.max(centerY - 2, 0);
  const lowerLaneY = Math.min(centerY + 2, height - 1);

  const glyphs: RenderGlyph[] = [];

  for (let x = 0; x < width; x += 1) {
    glyphs.push({
      kind: "road",
      x,
      y: upperLaneY,
      symbol: "-"
    });

    glyphs.push({
      kind: "road",
      x,
      y: centerY,
      symbol: "="
    });

    glyphs.push({
      kind: "road",
      x,
      y: lowerLaneY,
      symbol: "-"
    });
  }

  return glyphs;
}

function projectEventFeed(
  events: readonly SimulationEvent[],
  eventFeedLimit: number
): readonly string[] {
  return events
    .slice(-eventFeedLimit)
    .map((event) => `[t=${event.tick}] ${event.message}`);
}

function createHudLines(state: AuthoritativeSimulationState): readonly HudLine[] {
  return [
    {
      label: "Scenario",
      value: state.scenarioId
    },
    {
      label: "Tick",
      value: state.tick.toString()
    },
    {
      label: "Speed",
      value: state.playerVehicle.dynamics.speed.toFixed(2)
    },
    {
      label: "Control",
      value: state.playerVehicle.dynamics.controlState
    },
    {
      label: "Pursuit",
      value: state.pursuitState.lockState
    },
    {
      label: "Distance",
      value: state.pursuitState.targetDistance.toFixed(2)
    },
    {
      label: "Pressure",
      value: state.pursuitState.pursuitPressure.toFixed(2)
    },
    {
      label: "Traffic",
      value: state.trafficVehicles.length.toString()
    },
    {
      label: "Incidents",
      value: state.incidents.length.toString()
    }
  ];
}

export function projectAsciiRenderModel(
  state: AuthoritativeSimulationState,
  config: AsciiRendererConfig = defaultAsciiRendererConfig
): RenderModel {
  const roadGlyphs = createRoadGlyphs(config.width, config.height);

  const playerGlyph: RenderGlyph = {
    kind: "player",
    x: normalizeToGrid(state.playerVehicle.position.x, config.width),
    y: normalizeToGrid(state.playerVehicle.position.y, config.height),
    symbol: "P"
  };

  const targetGlyphs: readonly RenderGlyph[] =
    state.targetVehicle === undefined
      ? []
      : [
          {
            kind: "target",
            x: normalizeToGrid(state.targetVehicle.position.x, config.width),
            y: normalizeToGrid(state.targetVehicle.position.y, config.height),
            symbol: "T"
          }
        ];

  const trafficGlyphs = state.trafficVehicles.map(
    (vehicle): RenderGlyph => ({
      kind: "traffic",
      x: normalizeToGrid(vehicle.position.x, config.width),
      y: normalizeToGrid(vehicle.position.y, config.height),
      symbol: "C"
    })
  );

  const incidentGlyphs = state.incidents.map(
    (incident): RenderGlyph => ({
      kind: "incident",
      x: normalizeToGrid(incident.position.x, config.width),
      y: normalizeToGrid(incident.position.y, config.height),
      symbol: "!"
    })
  );

  return {
    title: "DRIFT PURSUIT GRID",
    width: config.width,
    height: config.height,
    glyphs: [...roadGlyphs, ...targetGlyphs, ...trafficGlyphs, ...incidentGlyphs, playerGlyph],
    hudLines: createHudLines(state),
    eventFeed: projectEventFeed(state.events, config.eventFeedLimit)
  };
}