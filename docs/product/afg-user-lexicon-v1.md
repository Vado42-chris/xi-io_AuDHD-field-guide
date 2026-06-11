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

# AFG User Lexicon v1, preview

Decision value: `AFG_LEXICON_TRIGGERS_PREVIEW_ONLY_TRACKED_NOT_IMPLEMENTED`

## Purpose

Define the AuDHD Field Guide product-local user lexicon contract for future Meaning UI work.

The AFG lexicon preserves raw user language and maps it to optional product-local meaning projections. It does not replace the user’s words with canonical tags.

## Core invariants

```text
Raw user language must be preserved.
Canonical tags are projections, not replacements.
User lexicon terms are user-owned.
The user can correct mappings.
Product-local lexicon mappings are not global xi-io doctrine.
EventAtom is evidence-bearing context, not permission.
FailureAtom is evidence-bearing failure context, not permission to fix.
Unknown is not success.
Private user language must not be exported to xi-io.net by default.
```

## Lexicon record shape, non-runtime

This is a documentation contract only. It is not a TypeScript type, schema, storage format, or runtime implementation.

```text
user_term
raw_phrase_preservation
canonical_meaning_projection
related_bins
related_personas
privacy_posture
correction_rule
receipt_expectation
blocked_claims
```

## Required field rules

| Field | Meaning | Rule |
|---|---|---|
| user_term | The word, phrase, metaphor, shorthand, or signal the user actually uses. | Must preserve user wording. |
| raw_phrase_preservation | The original phrase and surrounding context where available. | Must not be overwritten by normalization. |
| canonical_meaning_projection | Optional internal projection for routing or review. | Must remain a projection, not a replacement. |
| related_bins | Product-local AFG bins that may receive the signal. | Must reference AFG bins only, not global xi-io bins. |
| related_personas | Personas that may review the signal. | Must not grant execution authority. |
| privacy_posture | Default handling for the term and examples. | Private by default unless explicitly marked public-safe metadata. |
| correction_rule | How the user can correct the mapping. | User correction overrides inferred mapping. |
| receipt_expectation | What future receipts must record. | Must include source, projection, confidence, correction status, and blocked claims. |
| blocked_claims | What must not be inferred from the mapping. | Must prevent diagnosis, coercive action, export, or false certainty. |

## Starter lexicon examples

| User term | Raw phrase preservation | Canonical meaning projection | Related bins | Related personas | Privacy posture | Correction rule | Receipt expectation | Blocked claims |
|---|---|---|---|---|---|---|---|---|
| cheeseburgers | Preserve exact user phrase and context. Example: “I have two cheeseburgers left.” | capacity_units | Capacity / Spoons / User Unit, Current State, Tasks / Demands | Capacity Steward, State Router, Autonomy Lab, Ibal | Private by default. Public-safe export may only say a user-specific capacity unit exists. | User can rename, redefine, scale, disable, or reject this mapping. | Record raw phrase, mapped projection, confidence, user correction state, and whether a task/action suggestion was blocked. | Does not quantify medical capacity. Does not create task authority. Does not export values. |
| spoons | Preserve exact phrase and context. | capacity_units | Capacity / Spoons / User Unit, Current State | Capacity Steward, Regulation Coach, Ibal | Private by default. | User can choose whether spoons remain active or are replaced by a preferred metaphor. | Record whether the term was user-supplied or system-suggested. | Does not force spoon theory framing on the user. |
| batteries | Preserve exact phrase and context. | energy_capacity | Capacity / Spoons / User Unit, Health / Body Signals, Supports / De-Stressers | Capacity Steward, Body Signal Analyst, Regulation Coach, Ibal | Private by default. | User can clarify whether battery means physical energy, cognitive load, pain tolerance, social capacity, or something else. | Record ambiguity and user correction when available. | Does not assume one energy dimension. |
| shutdown | Preserve exact phrase and context. | regulation_state | Current State, Health / Body Signals, Sensory Environment | State Router, Regulation Coach, Body Signal Analyst, Ibal | Highly private by default. | User can clarify whether this means sensory shutdown, task shutdown, social withdrawal, fatigue, pain, or another state. | Record uncertainty and any blocked medical/diagnostic claim. | Does not diagnose, predict collapse, or trigger emergency action by itself. |
| too many tabs open | Preserve exact phrase and context. | cognitive_load | Current State, Tasks / Demands, Raw Ingress | State Router, Capacity Steward, Autonomy Lab, Ibal | Private by default. | User can define whether it means task overload, sensory load, decision fatigue, or memory pressure. | Record projected meaning and uncertainty. | Does not force a productivity interpretation. |
| can’t make words | Preserve exact phrase and context. | communication_capacity_low | Current State, Raw Ingress, People / Social Signals | State Router, Memory Bridge, Social Decoder, Ibal | Private by default. | User can define preferred low-demand response mode. | Record that low-language mode may be appropriate, if confirmed. | Does not send messages or speak for the user. |
| angry bees | Preserve exact phrase and context. | sensory_or_nervous_system_agitation | Sensory Environment, Current State, Health / Body Signals | Sensory Cartographer, Regulation Coach, Body Signal Analyst, Ibal | Private by default. | User can define whether this is pain, sound sensitivity, anxiety, akathisia-like restlessness, or another signal. | Record ambiguity and blocked medical claim. | Does not diagnose or prescribe. |
| red folder | Preserve exact phrase and context. | high_priority_context | Tasks / Demands, Evidence / Export, Decisions / Outcomes | Autonomy Lab, Egress Clerk, Ibal | Private by default. | User defines what priority class this represents. | Record user-defined priority and permission boundary. | Does not create automatic action or export. |

## Correction authority

User correction is authoritative for product-local meaning.

Future runtime must support these correction outcomes before claiming lexicon maturity:

```text
accept mapping
reject mapping
rename term
change projection
change related bins
change related personas
mark term private-only
disable future suggestions
restore raw-only mode
```

## Canonical projection boundary

Canonical projections may help the product route signals, but they must never erase raw language.

Correct:

```text
raw: “I have two cheeseburgers left”
projection: capacity_units
user-facing display: cheeseburgers
```

Incorrect:

```text
replace user language with capacity_units
export private capacity value
trigger a task action automatically
claim framework-wide meaning for cheeseburgers
```

## Receipt expectations

Future lexicon receipts should include:

```text
raw_user_term
raw_context_ref
projection
related_bins
related_personas
confidence
user_correction_state
privacy_posture
blocked_claims
export_allowed
```

## Blocked implementation claims

```text
This document does not create runtime lexicon storage.
This document does not create TypeScript types.
This document does not create schemas.
This document does not wire UI.
This document does not create model prompts.
This document does not call models.
This document does not execute tools.
This document does not export private data.
This document does not globalize AFG lexicon mappings.
This document does not claim xi-io.net#201 or xi-io.net#202 are accepted framework contracts.
```

## Next related document

```text
docs/product/afg-proactive-trigger-contract-v1.md
```
