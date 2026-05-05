export type AsciiRendererConfig = {
  readonly width: number;
  readonly height: number;
  readonly eventFeedLimit: number;
};

export const defaultAsciiRendererConfig: AsciiRendererConfig = {
  width: 64,
  height: 18,
  eventFeedLimit: 6
};