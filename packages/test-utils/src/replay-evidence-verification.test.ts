import { describe, expect, it } from "vitest";

import { verificationScenarioIds } from "./verification-fixtures.js";
import { runScenarioHarness } from "./run-scenario-harness.js";

describe("Replay and evidence verification", () => {
  it.each(verificationScenarioIds)("creates verified evidence for %s", (scenarioId) => {
    const result = runScenarioHarness(scenarioId);

    expect(result.evidencePack.replayVerification.status).toBe("verified");
    expect(result.evidencePack.integrity.scenarioDigest).toHaveLength(8);
    expect(result.evidencePack.integrity.inputLogDigest).toHaveLength(8);
    expect(result.evidencePack.integrity.eventLogDigest).toHaveLength(8);
    expect(result.evidencePack.integrity.finalStateDigest).toHaveLength(8);
    expect(result.evidencePack.integrity.debriefDigest).toHaveLength(8);
    expect(result.evidencePack.integrity.replayDigest).toHaveLength(8);
    expect(result.evidencePack.integrity.evidencePackDigest).toHaveLength(8);
  });

  it("produces different evidence digests for different scenarios", () => {
    const firstContact = runScenarioHarness("training.first-contact");
    const perfectStorm = runScenarioHarness("showcase.perfect-storm");

    expect(firstContact.evidencePack.integrity.evidencePackDigest).not.toBe(
      perfectStorm.evidencePack.integrity.evidencePackDigest,
    );
  });
});
