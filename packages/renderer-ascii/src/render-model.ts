export type RenderGlyphKind = "player" | "target" | "traffic" | "incident" | "road" | "empty";

export type RenderGlyph = {
  readonly kind: RenderGlyphKind;
  readonly x: number;
  readonly y: number;
  readonly symbol: string;
};

export type HudLine = {
  readonly label: string;
  readonly value: string;
};

export type RenderModel = {
  readonly title: string;
  readonly width: number;
  readonly height: number;
  readonly glyphs: readonly RenderGlyph[];
  readonly hudLines: readonly HudLine[];
  readonly eventFeed: readonly string[];
};
