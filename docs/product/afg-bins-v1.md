---
status: preview_only
framework_dependency:
  - "xi-io.net#201 draft"
  - "xi-io.net#202 draft"
runtime_changes_allowed: false
schema_changes_allowed: false
ui_changes_allowed: false
private_data_export_allowed: false
---

# AFG Bins v1, preview

Decision value: `AFG_BINS_PERSONAS_PREVIEW_ONLY_TRACKED_NOT_IMPLEMENTED`

## Purpose

Define the AuDHD Field Guide product-local bins for future Meaning UI work.

These bins are not global xi-io bins. They are AFG-specific landing zones for user-provided signals, delayed recall, capacity language, regulation context, and consented export preparation.

## Framework posture

```text
EventAtom is evidence-bearing context, not permission.
FailureAtom is evidence-bearing failure context, not permission to fix.
AFG bins are product-local.
AFG bins do not grant tool authority.
AFG bins do not grant model authority.
AFG bins do not grant private-data egress authority.
Unknown is not success.
Advisory trigger is not runtime automation.
```

## Privacy boundary

AFG may later produce product-safe metadata for framework freshness, but private memory, health, legal, journal, relationship, sensory, or capacity content must not be exported to xi-io.net by default.

Allowed public-safe export candidates are limited to structural metadata such as:

```text
product id
schema/doc version
bin names
persona names
contract status
blocked claim status
receipt ids
preview-only decision values
```

## Product-local bin table

| Bin | Purpose | Privacy posture | Related personas | Candidate EventAtom classes | Possible FailureAtom or blocked-state relationships | Blocked claims |
|---|---|---|---|---|---|---|
| Current State | Capture what is true right now so the user can orient without reconstructing everything from memory. | Private by default. Can become public-safe only as aggregate status metadata. | State Router, Capacity Steward, Regulation Coach, Ibal | state_snapshot, capacity_snapshot, regulation_context | stale_state, unsupported_state_inference, missing_user_confirmation | Does not diagnose, predict collapse, or override user self-report. |
| Raw Ingress | Preserve unprocessed user language before categorization, summarization, or canonical mapping. | Private by default. Raw text must remain user-owned and non-exported unless explicitly consented. | Memory Bridge, Pattern Analyst, Egress Clerk, Ibal | raw_note, user_statement, ingress_capture | raw_signal_loss, over-normalization, missing_source_context | Does not replace raw wording with canonical tags. |
| Delayed Recall | Hold resurfaced memory fragments that may become meaningful later through pattern review. | Private by default. Timing metadata may be public-safe only if content is stripped. | Memory Bridge, Pattern Analyst, State Router, Ibal | delayed_memory, recall_fragment, temporal_context | missing_timeline_link, premature_interpretation, false_continuity_claim | Does not claim causal meaning from a resurfaced memory without evidence. |
| Capacity / Spoons / User Unit | Track user-defined capacity terms, including spoons, cheeseburgers, batteries, or other preferred metaphors. | Private by default. Public-safe export may include only the existence of a user-unit mapping, not values or context. | Capacity Steward, State Router, Autonomy Lab, Ibal | capacity_unit, capacity_debt, load_estimate | invalid_unit_mapping, stale_capacity_estimate, overconfident_recommendation | Does not force one capacity metaphor or treat capacity as a medical measurement. |
| Triggers / Stressors | Capture demands, sensory inputs, conflicts, uncertainty, time pressure, or other load sources. | Private by default. Requires explicit consent before any external use. | Pattern Analyst, Regulation Coach, Social Decoder, Ibal | stressor_signal, demand_signal, conflict_signal | unsupported_trigger_claim, missing_counterexample, unsafe_escalation | Does not declare a trigger as permanent or universal. |
| Supports / De-Stressers | Capture what helps, including actions, environments, people, routines, tools, and recovery supports. | Private by default. Can be summarized only with explicit consent. | Regulation Coach, Capacity Steward, Autonomy Lab, Ibal | support_signal, regulation_action, recovery_context | unsupported_support_claim, stale_support_effect, missing_feedback | Does not claim a support will work every time. |
| Sensory Environment | Capture light, sound, texture, movement, temperature, crowding, interruption, and environmental load. | Private by default. Environmental categories may be public-safe only when detached from user episode content. | Sensory Cartographer, State Router, Regulation Coach, Ibal | sensory_signal, environment_snapshot, entropy_context | missing_context, unsupported_entropy_score, unsafe_environment_advice | Does not turn sensory notes into diagnosis or universal rules. |
| People / Social Signals | Capture interpersonal context, social ambiguity, conflict, obligations, support, and boundary signals. | Private by default. Names and relationship content are never public-safe by default. | Social Decoder, Memory Bridge, Autonomy Lab, Egress Clerk, Ibal | social_signal, relationship_context, boundary_signal | unsafe_social_interpretation, missing_other_party_context, overconfident_intent_claim | Does not claim to know another person’s intent. |
| Tasks / Demands | Capture obligations, chores, deadlines, forms, calls, messages, appointments, and decisions requiring effort. | Private by default. Task labels may become public-safe only after redaction and consent. | Autonomy Lab, Capacity Steward, State Router, Ibal | task_signal, demand_queue, action_candidate | unsafe_prioritization, missing_capacity_check, unapproved_action | Does not execute tasks or create obligations without approval. |
| Health / Body Signals | Capture symptoms, pain, sleep, food, hydration, medication context, movement, and body-state observations. | Highly private by default. Health/body content must not be exported without explicit consent. | Body Signal Analyst, State Router, Regulation Coach, Ibal | body_signal, symptom_note, recovery_context | medical_overreach, missing_red_flag_review, unsupported_body_claim | Does not diagnose, prescribe, or replace medical care. |
| Decisions / Outcomes | Capture choices, possible paths, tradeoffs, predictions, outcomes, and post-action reflection. | Private by default. Public-safe export limited to structural decision metadata with content removed. | Choice Simulator, Autonomy Lab, Egress Clerk, Ibal | decision_point, outcome_note, reflection_signal | false_outcome_claim, missing_feedback, premature_pattern_lock | Does not decide for the user or treat simulation as certainty. |
| Evidence / Export | Prepare consented summaries, receipts, reports, and public-safe metadata while preserving source boundaries. | Consent-gated. Export must be redacted, scoped, and reviewable. | Egress Clerk, Memory Bridge, Pattern Analyst, Ibal | export_candidate, receipt_ref, evidence_ref | private_data_leak, missing_consent, unverifiable_claim | Does not export private content by default. |

## Bin processing rule

Every future bin mapping must preserve:

```text
raw user signal
product-local bin assignment
optional user lexicon mapping
optional canonical tag projection
persona routing suggestion
evidence reference
privacy posture
blocked claims
human approval requirement where action or export is involved
```

## Blocked implementation claims

```text
This document does not create runtime bins.
This document does not create TypeScript types.
This document does not create schemas.
This document does not create storage.
This document does not wire UI.
This document does not create triggers.
This document does not call models.
This document does not execute tools.
This document does not export private data.
This document does not claim xi-io.net#201 or xi-io.net#202 are accepted framework contracts.
```

## Next related document

```text
docs/product/afg-persona-map-v1.md
```
