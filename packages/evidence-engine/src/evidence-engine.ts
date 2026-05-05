import type { SimulationEvent } from "@drift-pursuit-grid/contracts";
import type { DebriefSummary } from "@drift-pursuit-grid/debrief-engine";
import type { ReplayRecord, ReplayVerificationResult } from "@drift-pursuit-grid/replay-engine";
import type { ScenarioDefinition } from "@drift-pursuit-grid/scenario-kit";
import type { AuthoritativeSimulationState } from "@drift-pursuit-grid/state-store";

import type { DigestJsonValue } from "./evidence-digest.js";
import { createDigest } from "./evidence-digest.js";
import type { EvidenceIntegrityManifest, EvidencePack } from "./evidence-pack.js";

export type CreateEvidencePackInput = {
  readonly scenario: ScenarioDefinition;
  readonly replayRecord: ReplayRecord;
  readonly replayVerification: ReplayVerificationResult;
  readonly finalState: AuthoritativeSimulationState;
  readonly debrief: DebriefSummary;
};

function projectEvent(event: SimulationEvent): DigestJsonValue {
  return {
    kind: event.kind,
    tick: event.tick,
    message: event.message,
  };
}

function projectFinalState(state: AuthoritativeSimulationState): DigestJsonValue {
  return {
    scenarioId: state.scenarioId,
    seed: state.seed,
    tick: state.tick,
    mode: state.mode,
    missionStatus: state.missionStatus,
    playerVehicle: {
      id: state.playerVehicle.identity.id,
      x: state.playerVehicle.position.x,
      y: state.playerVehicle.position.y,
      speed: state.playerVehicle.dynamics.speed,
      headingDegrees: state.playerVehicle.dynamics.headingDegrees,
      driftFactor: state.playerVehicle.dynamics.driftFactor,
      controlLevel: state.playerVehicle.dynamics.controlLevel,
      controlState: state.playerVehicle.dynamics.controlState,
    },
    targetVehicle:
      state.targetVehicle === undefined
        ? null
        : {
            id: state.targetVehicle.identity.id,
            x: state.targetVehicle.position.x,
            y: state.targetVehicle.position.y,
            speed: state.targetVehicle.dynamics.speed,
            headingDegrees: state.targetVehicle.dynamics.headingDegrees,
          },
    pursuitState: {
      lockState: state.pursuitState.lockState,
      targetDistance: state.pursuitState.targetDistance,
      pursuitPressure: state.pursuitState.pursuitPressure,
      interceptWindowOpen: state.pursuitState.interceptWindowOpen,
      lastReasonCode: state.pursuitState.lastReasonCode ?? null,
    },
    trafficVehicleCount: state.trafficVehicles.length,
    incidentCount: state.incidents.length,
    degradedModeCount: state.degradedModes.length,
    eventCount: state.events.length,
  };
}

function projectDebrief(debrief: DebriefSummary): DigestJsonValue {
  return {
    scenarioId: debrief.scenarioId,
    seed: debrief.seed,
    totalTicks: debrief.totalTicks,
    outcome: debrief.outcome,
    primaryReasonCode: debrief.primaryReasonCode,
    headline: debrief.headline,
    collisionCount: debrief.collisionCount,
    incidentCount: debrief.incidentCount,
    finalTargetDistance: debrief.finalTargetDistance,
    finalPursuitPressure: debrief.finalPursuitPressure,
    highlightCount: debrief.highlights.length,
  };
}

function createIntegrityManifest(input: CreateEvidencePackInput): EvidenceIntegrityManifest {
  const scenarioDigest = createDigest({
    id: input.scenario.id,
    title: input.scenario.title,
    mode: input.scenario.mode,
    seed: input.scenario.seed,
    totalTicks: input.scenario.totalTicks,
    tickDurationMs: input.scenario.tickDurationMs,
    trafficProfile: input.scenario.trafficProfile,
    incidentProfile: input.scenario.incidentProfile,
    degradedProfile: input.scenario.degradedProfile,
  });

  const inputLogDigest = createDigest(
    input.replayRecord.inputLog.map(
      (command): DigestJsonValue => ({
        kind: command.kind,
        tick: command.tick,
        source: command.source,
      }),
    ),
  );

  const eventLogDigest = createDigest(input.finalState.events.map(projectEvent));
  const finalStateDigest = createDigest(projectFinalState(input.finalState));
  const debriefDigest = createDigest(projectDebrief(input.debrief));

  const replayDigest = createDigest({
    scenarioId: input.replayRecord.scenarioId,
    seed: input.replayRecord.seed,
    tickDurationMs: input.replayRecord.tickDurationMs,
    totalTicks: input.replayRecord.totalTicks,
    expectedFinalChecksum: input.replayRecord.expectedFinalChecksum,
    verificationStatus: input.replayVerification.status,
  });

  const evidencePackDigest = createDigest({
    evidenceVersion: "1.0",
    generatedBy: "drift-pursuit-grid",
    scenarioDigest,
    inputLogDigest,
    eventLogDigest,
    finalStateDigest,
    debriefDigest,
    replayDigest,
  });

  return {
    scenarioDigest,
    inputLogDigest,
    eventLogDigest,
    finalStateDigest,
    debriefDigest,
    replayDigest,
    evidencePackDigest,
  };
}

export function createEvidencePack(input: CreateEvidencePackInput): EvidencePack {
  const integrity = createIntegrityManifest(input);

  return {
    evidenceVersion: "1.0",
    generatedBy: "drift-pursuit-grid",
    scenario: input.scenario,
    seed: input.scenario.seed,
    tickDurationMs: input.scenario.tickDurationMs,
    totalTicks: input.scenario.totalTicks,
    inputLog: input.replayRecord.inputLog,
    replayRecord: input.replayRecord,
    replayVerification: input.replayVerification,
    finalState: input.finalState,
    debrief: input.debrief,
    integrity,
  };
}

export function renderEvidencePackSummary(pack: EvidencePack): string {
  return [
    "EVIDENCE PACK",
    `Version          : ${pack.evidenceVersion}`,
    `Generated By     : ${pack.generatedBy}`,
    `Scenario         : ${pack.scenario.id}`,
    `Seed             : ${pack.seed}`,
    `Ticks            : ${pack.totalTicks}`,
    `Replay Status    : ${pack.replayVerification.status}`,
    `Scenario Digest  : ${pack.integrity.scenarioDigest}`,
    `Input Digest     : ${pack.integrity.inputLogDigest}`,
    `Event Digest     : ${pack.integrity.eventLogDigest}`,
    `State Digest     : ${pack.integrity.finalStateDigest}`,
    `Debrief Digest   : ${pack.integrity.debriefDigest}`,
    `Replay Digest    : ${pack.integrity.replayDigest}`,
    `Evidence Digest  : ${pack.integrity.evidencePackDigest}`,
  ].join("\n");
}
