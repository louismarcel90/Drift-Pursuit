# Evidence Pack Model

## Purpose

The evidence engine produces a structured proof artifact for a simulation run.

It connects:

- scenario definition
- seed
- input log
- replay record
- replay verification
- final authoritative state
- debrief summary
- integrity manifest

## Current Responsibilities

At STEP 19, the evidence engine handles:

- evidence pack creation
- stable digests
- scenario digest
- input log digest
- event log digest
- final state digest
- debrief digest
- replay digest
- evidence pack digest
- readable evidence summary

## Evidence Pack Contents

An evidence pack contains:

- evidence version
- generator identity
- scenario
- seed
- tick duration
- total ticks
- input log
- replay record
- replay verification
- final state
- debrief
- integrity manifest

## Integrity Manifest

The integrity manifest contains:

- scenarioDigest
- inputLogDigest
- eventLogDigest
- finalStateDigest
- debriefDigest
- replayDigest
- evidencePackDigest

## Boundary Rule

The evidence engine consumes completed run artifacts.

It must not:

- advance simulation time
- mutate authoritative state
- rewrite events
- change replay status
- alter debrief conclusions

## Reviewer Signal

This module demonstrates audit-oriented engineering.

It turns a terminal simulation run into a structured, verifiable artifact.
