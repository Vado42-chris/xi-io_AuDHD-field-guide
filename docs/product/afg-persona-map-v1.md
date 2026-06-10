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

# AFG Persona Map v1, preview

Decision value: `AFG_BINS_PERSONAS_PREVIEW_ONLY_TRACKED_NOT_IMPLEMENTED`

## Purpose

Define the AuDHD Field Guide product-local persona map for future Meaning UI work.

Personas are interpretive roles. They are not bins, tools, models, schemas, agents, accounts, APIs, or sources of permission.

## Core invariants

```text
Personas are separate from bins.
Ibal remains outside as observer/conductor.
Personas cannot execute tools directly.
Personas cannot call models directly unless a later ModelAdapter contract allows it.
Personas cannot bypass Ibal.
Personas cannot bypass a future Verifier Gate.
Personas cannot export private data.
Personas cannot mutate repos, files, emails, calendars, provider data, or runtime state.
EventAtom is evidence-bearing context, not permission.
FailureAtom is evidence-bearing failure context, not permission to fix.
Unknown is not success.
```

## Ibal conductor rule

Ibal is not a product-local bin. Ibal sits above the AFG product-local bins and personas as the observer / conductor layer.

Ibal may later coordinate routing, review, receipts, and permission checks, but this document does not grant runtime authority to Ibal or any persona.

## Persona table

| Persona | Role | Allowed decisions | Blocked decisions | Related bins | Receipt expectations | Why it cannot execute tools directly | Why it cannot call models directly | Why it cannot bypass Ibal / Verifier Gate |
|---|---|---|---|---|---|---|---|---|
| Ibal | Observer / conductor outside bins. Coordinates meaning, routing, receipts, and permission posture. | May suggest which persona should review a signal. May preserve blocked claims and escalation needs. | Cannot act without permission. Cannot export private data. Cannot treat suggestion as consent. | All bins, but belongs to none. | Must record routing basis, uncertainty, blocked claims, and consent posture. | Tool execution requires explicit tool boundary, ActionEnvelope, and verifier approval. | Model use requires a later ModelAdapter contract and consent posture. | Ibal is the conductor, but still cannot bypass verifier or human approval. |
| Memory Bridge | Preserves raw language, delayed recall, continuity, and later review context. | May decide that raw wording must be preserved and that a memory fragment needs later review. | Cannot rewrite user memory as fact. Cannot infer causality without evidence. | Raw Ingress, Delayed Recall, Evidence / Export, People / Social Signals | Must record source, timestamp where available, raw text preservation, and uncertainty. | Memory preservation is not permission to write or export. | Model summarization could distort raw language unless explicitly adapter-gated. | Ibal must coordinate whether memory routing is safe and reviewable. |
| State Router | Routes current-state signals to the least-demand next view or persona. | May suggest Help Now, Journal, Learn Me, Customize, or defer. | Cannot diagnose state. Cannot force a path. Cannot block the user from unclear/low-demand options. | Current State, Capacity / Spoons / User Unit, Sensory Environment, Health / Body Signals | Must record selected route, source signals, uncertainty, and user override if present. | Routing is advisory until UI/action boundary exists. | Model inference could overreach unless bounded by adapter rules. | State routing needs conductor-level review to avoid overconfident automation. |
| Capacity Steward | Interprets user-defined capacity metaphors and capacity debt. | May suggest capacity-preserving options and lower-demand task framing. | Cannot decide what the user must do. Cannot treat capacity as a clinical metric. | Capacity / Spoons / User Unit, Tasks / Demands, Current State, Supports / De-Stressers | Must record user unit, mapping confidence, age of signal, and blocked claims. | Capacity estimates cannot trigger tasks or external actions by themselves. | Model use could mis-map user metaphors without approved lexicon controls. | Ibal / verifier must govern action proposals involving capacity. |
| Pattern Analyst | Reviews recurring stressors, supports, sensory patterns, and outcomes. | May suggest candidate patterns for user review. | Cannot claim causality from correlation. Cannot lock a pattern without feedback evidence. | Triggers / Stressors, Supports / De-Stressers, Sensory Environment, Delayed Recall, Decisions / Outcomes | Must record evidence count, counterexamples, confidence, and unknowns. | Pattern detection is not permission to change data, schedule actions, or notify others. | Model pattern analysis requires bounded context and evidence rules. | Ibal must prevent pattern suggestions from becoming autonomous claims. |
| Regulation Coach | Suggests low-demand regulation options based on current context and known supports. | May suggest grounding, reduced input, rest, body check, or environment adjustment options. | Cannot prescribe treatment. Cannot diagnose crisis. Cannot override emergency guidance. | Current State, Supports / De-Stressers, Sensory Environment, Health / Body Signals | Must record chosen suggestion class, contraindication unknowns, and user feedback if available. | Regulation suggestions do not authorize device actions or external communication. | Model-generated advice must be bounded and non-medical unless governed later. | Ibal / verifier must gate any escalation, export, or external action. |
| Autonomy Lab | Reframes demands, options, tasks, and choices to preserve user agency. | May propose lower-demand task shapes, optional next actions, and refusal/boundary language. | Cannot coerce, manipulate, or decide for the user. Cannot create commitments without approval. | Tasks / Demands, Decisions / Outcomes, People / Social Signals, Capacity / Spoons / User Unit | Must record option set, tradeoffs, user-selected path, and unselected alternatives when useful. | Tool execution would convert suggestion into action and requires explicit approval. | Model drafting requires adapter and egress boundaries. | Ibal must ensure autonomy is preserved and action remains consented. |
| Social Decoder | Separates observable facts from social interpretation, ambiguity, and possible intent. | May identify uncertainty, possible interpretations, missing context, and safer response options. | Cannot claim to know another person’s intent. Cannot escalate conflict automatically. | People / Social Signals, Raw Ingress, Triggers / Stressors, Decisions / Outcomes | Must record observable facts, interpretations, confidence, and missing context. | Social review cannot send messages or contact people. | Model inference of social intent is high-risk without strict uncertainty rules. | Ibal / verifier must gate any outward communication. |
| Sensory Cartographer | Maps sensory environment signals and load patterns. | May suggest sensory categories, environment adjustments, and later review tags. | Cannot claim universal sensory rules. Cannot diagnose sensory disorder. | Sensory Environment, Current State, Triggers / Stressors, Supports / De-Stressers | Must record sensory dimensions, source context, confidence, and feedback if available. | Sensory tags do not authorize hardware/device actions. | Model interpretation of images/audio/environment data requires future adapter/privacy rules. | Ibal must govern device, image, and environment data boundaries. |
| Body Signal Analyst | Tracks symptoms, pain, sleep, food, hydration, movement, and body-state notes. | May suggest recording, red-flag review, or low-risk self-observation categories. | Cannot diagnose. Cannot prescribe. Cannot replace medical care. Cannot ignore red flags. | Health / Body Signals, Current State, Supports / De-Stressers, Evidence / Export | Must record body signal, time context, uncertainty, and medical-overreach blocks. | Body-signal tracking cannot contact providers or alter records without approval. | Model health analysis requires strict medical safety and adapter boundaries. | Ibal / verifier must gate any health-related action or export. |
| Choice Simulator | Helps compare possible outcomes, tradeoffs, risks, and capacity effects. | May simulate options as hypothetical paths with uncertainty. | Cannot predict certainty. Cannot choose for the user. Cannot treat simulation as outcome. | Decisions / Outcomes, Tasks / Demands, Capacity / Spoons / User Unit, People / Social Signals | Must record assumptions, paths compared, uncertainty, and user decision if provided. | Simulation cannot execute chosen path. | Model simulation needs evidence and uncertainty boundaries. | Ibal must keep simulation advisory and permission-gated. |
| Egress Clerk | Prepares consented export, summaries, receipts, and public-safe metadata boundaries. | May identify what is exportable, what requires redaction, and what must remain private. | Cannot export by default. Cannot remove source uncertainty. Cannot launder private data into public-safe summaries. | Evidence / Export, Raw Ingress, People / Social Signals, Health / Body Signals, Decisions / Outcomes | Must record consent, redactions, source refs, intended audience, and blocked claims. | Export is a side effect and requires explicit permission. | Model summarization can leak or distort unless governed by adapter/privacy rules. | Ibal / verifier must gate all outward egress. |

## Persona to bin routing summary

```text
Current State -> State Router, Capacity Steward, Regulation Coach, Ibal
Raw Ingress -> Memory Bridge, Pattern Analyst, Egress Clerk, Ibal
Delayed Recall -> Memory Bridge, Pattern Analyst, State Router, Ibal
Capacity / Spoons / User Unit -> Capacity Steward, State Router, Autonomy Lab, Ibal
Triggers / Stressors -> Pattern Analyst, Regulation Coach, Social Decoder, Ibal
Supports / De-Stressers -> Regulation Coach, Capacity Steward, Autonomy Lab, Ibal
Sensory Environment -> Sensory Cartographer, State Router, Regulation Coach, Ibal
People / Social Signals -> Social Decoder, Memory Bridge, Autonomy Lab, Egress Clerk, Ibal
Tasks / Demands -> Autonomy Lab, Capacity Steward, State Router, Ibal
Health / Body Signals -> Body Signal Analyst, State Router, Regulation Coach, Ibal
Decisions / Outcomes -> Choice Simulator, Autonomy Lab, Egress Clerk, Ibal
Evidence / Export -> Egress Clerk, Memory Bridge, Pattern Analyst, Ibal
```

## Blocked implementation claims

```text
This document does not create runtime personas.
This document does not create agents.
This document does not create TypeScript types.
This document does not create schemas.
This document does not create storage.
This document does not wire UI.
This document does not create triggers.
This document does not call models.
This document does not execute tools.
This document does not export private data.
This document does not grant Ibal runtime authority.
This document does not claim xi-io.net#201 or xi-io.net#202 are accepted framework contracts.
```

## Next safest AFG pass

```text
AFG-MEANING-UI-002B: user lexicon and proactive trigger contract
```
