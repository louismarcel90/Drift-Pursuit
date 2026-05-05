# Traceability Matrix

| Requirement              | Implementation                      | Verification              | Evidence             |
| ------------------------ | ----------------------------------- | ------------------------- | -------------------- |
| Deterministic simulation | simulation-core + deterministic-rng | replay-engine tests       | final checksum       |
| Authoritative state      | state-store                         | state-store tests         | final state digest   |
| Replay verification      | replay-engine                       | replay tests              | replay digest        |
| Explainable outcomes     | debrief-engine                      | debrief tests             | debrief digest       |
| Evidence pack            | evidence-engine                     | evidence tests            | evidence pack digest |
| Scenario governance      | scenario-kit                        | scenario validation tests | scenario digest      |
| Degraded modes           | degraded-mode-engine                | degraded mode tests       | degraded events      |
| Terminal projection      | renderer-ascii                      | renderer tests            | render output        |

## Reviewer Signal

This matrix connects design intent to code, tests, and evidence.
