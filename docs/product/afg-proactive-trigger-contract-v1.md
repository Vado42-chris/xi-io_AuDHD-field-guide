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

# AFG Proactive Trigger Contract v1, preview

Decision value: `AFG_LEXICON_TRIGGERS_PREVIEW_ONLY_TRACKED_NOT_IMPLEMENTED`

## Purpose

Define preview-only advisory trigger candidates for the AuDHD Field Guide Meaning UI.

These triggers are not runtime automation. They are future review prompts that may help the user notice patterns, revisit raw ingress, check capacity, or choose a lower-demand next step.

## Core invariants

```text
Triggers are advisory only.
Advisory trigger is not runtime automation.
Trigger detection does not authorize tool execution.
Trigger detection does not authorize model calls.
Trigger detection does not authorize private data export.
Human approval is required before write actions.
Raw user language must be preserved.
Canonical tags are projections, not replacements.
Unknown is not success.
EventAtom is evidence-bearing context, not permission.
FailureAtom is evidence-bearing failure context, not permission to fix.
```

## Trigger candidate table

| Trigger candidate | Signal pattern | Related bins | Related personas | Privacy posture | Allowed suggestion | Blocked action | Receipt expectation | Blocked claims |
|---|---|---|---|---|---|---|---|---|
| Raw ingress older than review threshold | Raw note exists past a user-defined review threshold without routing, reflection, or dismissal. | Raw Ingress, Delayed Recall, Evidence / Export | Memory Bridge, State Router, Egress Clerk, Ibal | Private by default. | Suggest: “Review this when you have capacity” or “keep raw only.” | Cannot summarize, export, delete, or reinterpret automatically. | Record raw ref, age, threshold, user action, and whether review was deferred. | Does not claim neglect, urgency, or meaning. |
| Same stressor repeating | Similar stressor appears repeatedly within a configured window. | Triggers / Stressors, Current State, Decisions / Outcomes | Pattern Analyst, Regulation Coach, Autonomy Lab, Ibal | Private by default. | Suggest a pattern review or ask whether this is the same stressor. | Cannot declare a causal pattern or create action tasks automatically. | Record evidence count, window, counterexamples, and user confirmation state. | Does not claim causality from repetition alone. |
| Sensory entropy plus poor sleep | Sensory load notes overlap with poor sleep or low recovery signals. | Sensory Environment, Health / Body Signals, Current State | Sensory Cartographer, Body Signal Analyst, Regulation Coach, Ibal | Highly private by default. | Suggest low-demand sensory/body check or environmental note. | Cannot diagnose, prescribe, or escalate without user approval. | Record signal refs, uncertainty, and medical-overreach block. | Does not diagnose sleep disorder, burnout, or sensory condition. |
| Task overwhelm | Task/demand volume exceeds user-stated capacity or produces stalled action. | Tasks / Demands, Capacity / Spoons / User Unit, Current State | Autonomy Lab, Capacity Steward, State Router, Ibal | Private by default. | Suggest smaller next action, defer path, or capacity check. | Cannot execute tasks, send messages, calendar items, or external updates. | Record demand source, capacity signal, suggested option, and user choice if present. | Does not decide priority for the user. |
| Social confusion | User marks a conversation, message, tone, obligation, or interpersonal signal as unclear. | People / Social Signals, Raw Ingress, Decisions / Outcomes | Social Decoder, Memory Bridge, Choice Simulator, Ibal | Private by default. | Suggest facts vs interpretations review. | Cannot send replies, infer intent as fact, or disclose content externally. | Record source text ref, interpretations, uncertainty, and chosen next step. | Does not claim to know another person’s intent. |
| Capacity debt rising | Repeated capacity notes indicate less available capacity over time or increasing recovery debt. | Capacity / Spoons / User Unit, Health / Body Signals, Tasks / Demands | Capacity Steward, Body Signal Analyst, Regulation Coach, Ibal | Private by default. | Suggest capacity-preserving option or review of commitments. | Cannot cancel commitments, notify people, or change schedules automatically. | Record capacity units, trend window, uncertainty, and blocked action. | Does not diagnose health decline or force rest. |
| Delayed memory resurfacing | User records a memory fragment after a delay and marks it as relevant, unresolved, or emotionally loaded. | Delayed Recall, Raw Ingress, People / Social Signals, Evidence / Export | Memory Bridge, Pattern Analyst, Social Decoder, Ibal | Private by default. | Suggest preserving raw memory and optionally linking to prior context. | Cannot claim memory accuracy, causality, or legal significance automatically. | Record raw fragment, timing, links, confidence, and uncertainty. | Does not convert memory into verified fact. |
| Conflict plus legal/financial tag | Conflict, demand, legal, money, housing, support, vehicle, work, or official-process signal appears together. | People / Social Signals, Tasks / Demands, Evidence / Export, Decisions / Outcomes | Social Decoder, Autonomy Lab, Egress Clerk, Choice Simulator, Ibal | Highly private by default. | Suggest evidence preservation, neutral summary, or explicit consent before export. | Cannot send, file, forward, delete, or disclose content automatically. | Record source refs, audience, consent state, and blocked export claims. | Does not provide legal advice or claim court readiness. |
| Unanswered did-this-help feedback | A prior suggestion lacks user feedback after an appropriate interval. | Supports / De-Stressers, Decisions / Outcomes, Current State | Regulation Coach, Pattern Analyst, Ibal | Private by default. | Ask whether the suggestion helped, harmed, was irrelevant, or should be ignored. | Cannot treat silence as success. | Record original suggestion, interval, feedback state, and uncertainty. | Unknown is not success. |
| Repeated support works | User repeatedly confirms a support lowered load or improved recovery. | Supports / De-Stressers, Current State, Capacity / Spoons / User Unit | Regulation Coach, Capacity Steward, Pattern Analyst, Ibal | Private by default. | Suggest adding support to preferred options or making it easier to find. | Cannot prescribe, schedule, or notify others automatically. | Record evidence count, feedback examples, counterexamples, and user confirmation. | Does not claim the support will always work. |

## Advisory trigger lifecycle, non-runtime

This is a preview lifecycle for future design work. It is not implemented.

```text
candidate_signal
preserve_raw_input
map_to_product_local_bin
project_optional_canonical_tag
route_to_persona_suggestion
check_privacy_posture
record_blocked_claims
ask_for_user_review_or_defer
record_feedback
```

## Allowed suggestion classes

Future triggers may suggest only low-authority options unless a later permission boundary allows more.

```text
review later
keep raw only
name this pattern?
check capacity
choose smaller next action
separate facts from interpretations
preserve evidence privately
ask did this help?
mark support as useful
ignore this suggestion
```

## Blocked action classes

```text
send message
forward email
delete content
export private data
write to xi-io.net
create calendar event
create task outside AFG
call model automatically
execute tool automatically
run local agent automatically
claim diagnosis
claim legal conclusion
claim another person's intent
claim pattern certainty
```

## Receipt expectations

Future advisory trigger receipts should include:

```text
trigger_candidate_id
signal_refs
raw_language_preserved
related_bins
related_personas
privacy_posture
allowed_suggestion
blocked_actions
user_feedback_state
unknowns
blocked_claims
```

## Blocked implementation claims

```text
This document does not create runtime triggers.
This document does not create TypeScript types.
This document does not create schemas.
This document does not create storage.
This document does not wire UI.
This document does not call models.
This document does not execute tools.
This document does not export private data.
This document does not claim trigger validation.
This document does not claim xi-io.net#201 or xi-io.net#202 are accepted framework contracts.
```

## Next safest AFG pass

```text
AFG-MEANING-UI-002C: Meaning UI router, receipts, and framework freshness docs
```
