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

# AFG Meaning UI Router v1, preview

Decision value: `AFG_ROUTER_RECEIPTS_FRESHNESS_PREVIEW_ONLY_TRACKED_NOT_IMPLEMENTED`

## Purpose

Define the preview-only Meaning UI router for the AuDHD Field Guide.

The router starts from the user's stated intent and routes toward low-demand review paths. It does not diagnose, automate, execute tools, call models, or export private data.

## Core invariants

```text
Meaning UI routes user intent, not diagnosis.
Meaning UI options are low-demand and user-correctable.
Router suggestions are advisory, not runtime automation.
EventAtom is evidence-bearing context, not permission.
FailureAtom is evidence-bearing failure context, not permission to fix.
Unknown is not success.
Human approval is required before write actions.
```

## Top-level route table

| Route label | Route purpose | Related bins | Related personas | Allowed suggestion | Blocked action | Receipt expectation |
|---|---|---|---|---|---|---|
| I need to capture this before I lose it. | Preserve raw ingress quickly before memory, wording, or context decays. | Raw Ingress, Delayed Recall, Evidence / Export | Memory Bridge, State Router, Ibal | Suggest raw capture, optional later review, or keep-raw-only mode. | Cannot summarize, classify, export, or reinterpret automatically. | Record raw capture ref, route label, privacy posture, and deferred review state. |
| I need help understanding what happened. | Separate facts, interpretations, ambiguity, and possible pattern context. | Raw Ingress, People / Social Signals, Triggers / Stressors, Delayed Recall | Social Decoder, Pattern Analyst, Memory Bridge, Ibal | Suggest facts-vs-interpretations review and unknowns list. | Cannot claim another person's intent or causal certainty. | Record source refs, interpretation options, unknowns, and blocked claims. |
| I need to know what matters most right now. | Triage current load, urgency, capacity, and safety of next attention target. | Current State, Tasks / Demands, Capacity / Spoons / User Unit, Health / Body Signals | State Router, Capacity Steward, Body Signal Analyst, Ibal | Suggest low-demand prioritization or defer/park option. | Cannot decide priorities for the user or execute tasks. | Record triage basis, uncertainty, capacity signal, and user override. |
| I need to decide what to do next. | Help compare near-term actions and reduce demand pressure. | Decisions / Outcomes, Tasks / Demands, Capacity / Spoons / User Unit | Autonomy Lab, Choice Simulator, Capacity Steward, Ibal | Suggest small next action, pause, ask-for-help option, or no-action option. | Cannot create commitments, send messages, or schedule actions. | Record options shown, assumptions, blocked actions, and user-selected path if any. |
| I need to check my capacity. | Review user-defined capacity language and current available load. | Capacity / Spoons / User Unit, Current State, Health / Body Signals, Supports / De-Stressers | Capacity Steward, State Router, Regulation Coach, Ibal | Suggest capacity reflection using user terms such as cheeseburgers/spoons if configured. | Cannot treat capacity as medical measurement or force a task decision. | Record user unit, mapping confidence, age of signal, and privacy posture. |
| I need to compare possible outcomes. | Simulate choices as hypothetical paths with uncertainty and tradeoffs. | Decisions / Outcomes, Tasks / Demands, People / Social Signals | Choice Simulator, Autonomy Lab, Social Decoder, Ibal | Suggest option comparison and likely tradeoffs with uncertainty. | Cannot predict certainty, decide for the user, or take action. | Record assumptions, compared options, uncertainty, and user correction. |
| I need this remembered for later. | Preserve context for future retrieval, continuity, or consented export review. | Delayed Recall, Raw Ingress, Evidence / Export | Memory Bridge, Egress Clerk, Pattern Analyst, Ibal | Suggest private memory anchor, tag candidate, or later review note. | Cannot export, publish, or sync private content to xi-io.net by default. | Record memory ref, storage boundary, tag projection, and export block. |

## Route handling rule

Future runtime must preserve the user's chosen route label as evidence.

Correct:

```text
user route: I need to capture this before I lose it.
action: preserve raw text first
later suggestion: optional review
```

Incorrect:

```text
infer diagnosis from route
skip raw preservation
summarize before capture
export route content to framework
trigger external action
```

## User correction rule

A user may correct route choice at any point.

Future route receipts must support:

```text
route accepted
route changed
route rejected
raw-only requested
review deferred
suggestion ignored
```

## Blocked implementation claims

```text
This document does not create runtime routes.
This document does not create UI.
This document does not create TypeScript types.
This document does not create schemas.
This document does not create storage.
This document does not call models.
This document does not execute tools.
This document does not export private data.
This document does not claim xi-io.net#201 or xi-io.net#202 are accepted framework contracts.
```
