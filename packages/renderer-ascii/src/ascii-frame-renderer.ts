import type { HudLine, RenderGlyph, RenderModel } from "./render-model.js";

function createEmptyGrid(width: number, height: number): string[][] {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => " "));
}

function applyGlyph(grid: string[][], glyph: RenderGlyph): void {
  const row = grid[glyph.y];

  if (row === undefined) {
    return;
  }

  if (row[glyph.x] === undefined) {
    return;
  }

  row[glyph.x] = glyph.symbol;
}

function renderGrid(model: RenderModel): readonly string[] {
  const grid = createEmptyGrid(model.width, model.height);

  for (const glyph of model.glyphs) {
    applyGlyph(grid, glyph);
  }

  return grid.map((row) => `│${row.join("")}│`);
}

function renderHudLine(line: HudLine): string {
  return `${line.label.padEnd(10, " ")} : ${line.value}`;
}

function renderHorizontalRule(width: number): string {
  return `└${"─".repeat(width)}┘`;
}

function renderTopRule(width: number): string {
  return `┌${"─".repeat(width)}┐`;
}

export function renderAsciiFrame(model: RenderModel): string {
  const topRule = renderTopRule(model.width);
  const bottomRule = renderHorizontalRule(model.width);
  const gridRows = renderGrid(model);

  const hudRows = model.hudLines.map(renderHudLine);
  const eventRows =
    model.eventFeed.length === 0 ? ["No events yet."] : model.eventFeed;

  return [
    model.title,
    topRule,
    ...gridRows,
    bottomRule,
    "",
    "HUD",
    ...hudRows,
    "",
    "EVENT FEED",
    ...eventRows
  ].join("\n");
}