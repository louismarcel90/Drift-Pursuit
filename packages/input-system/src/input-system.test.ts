import { describe, expect, it } from "vitest";

import { appendCommandToBuffer, emptyCommandBuffer, getCommandsForTick } from "./command-buffer.js";
import { mapKeyToCommandKind } from "./key-binding.js";
import { createCommandsFromScriptedInput, showcaseScriptedInput } from "./scripted-input-source.js";

describe("Input system", () => {
  it("maps keyboard keys to command kinds", () => {
    expect(mapKeyToCommandKind("w")).toBe("accelerate");
    expect(mapKeyToCommandKind("a")).toBe("steer-left");
    expect(mapKeyToCommandKind("d")).toBe("steer-right");
    expect(mapKeyToCommandKind("q")).toBe("quit");
  });

  it("stores commands in a tick-addressable buffer", () => {
    const buffer = appendCommandToBuffer({
      buffer: emptyCommandBuffer,
      kind: "accelerate",
      tick: 3,
      source: "keyboard",
    });

    expect(getCommandsForTick({ buffer, tick: 3 })).toHaveLength(1);
    expect(getCommandsForTick({ buffer, tick: 4 })).toHaveLength(0);
  });

  it("creates typed commands from scripted input", () => {
    const commands = createCommandsFromScriptedInput(showcaseScriptedInput);

    expect(commands.length).toBeGreaterThan(0);
    expect(commands[0]).toEqual({
      kind: "accelerate",
      tick: 1,
      source: "script",
    });
  });
});
