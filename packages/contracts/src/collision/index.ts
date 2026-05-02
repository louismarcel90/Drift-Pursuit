export * from "./collision-kind.js";

export type CollisionEvent = {
  type: "collision.detected";
  entities: [string, string];
  tick: number;
};