# Execution Docket

This file translates `MASTER_PLAN.md` into a working sequence.

## Operating rules

Every slice must explicitly declare:

- user problem
- domain event introduced
- state changes
- storage changes
- invariants affected
- UI surfaces touched
- cross-feature consumers
- tests required

A slice is not done until:

- domain types updated
- persistence updated if needed
- feature controller updated
- shell or provider updated
- shared primitive extracted if repeated
- copy reviewed for plain language
- invariants checked
- PR summary documents the above

---

## Active strategic sequence

### Loop completion block

#### Slice 33
**Title:** Trial result reflection and optional note

**Goal:**
Add a small optional post-outcome note so Help Now can capture a little more meaning without turning the flow into homework.

**Expected deliverables:**
- trial reflection record model
- reflection persistence
- optional post-outcome reflection UI
- prompt changes based on outcome

**Acceptance checks:**
- user can log an outcome and optionally add a short note
- reflection can be skipped cleanly
- reflection is tied to support title, state, and outcome context
- copy stays soft and non-demanding

#### Slice 34
**Title:** Evidence contribution emission from support actions

**Goal:**
Convert outcome, reflection, and revalidation events into a shared evidence contribution stream.

**Expected deliverables:**
- `EvidenceContribution` domain introduction
- emission from support outcome
- emission from trial reflection
- emission from revalidation

**Acceptance checks:**
- each emitted contribution is attributable
- source is explicit
- state linkage is preserved when available
- Learn Me can read contribution objects without custom parsing per source

#### Slice 35
**Title:** Learn Me reads support evidence contributions

**Goal:**
Make the cross-feature loop visible by letting Learn Me show user-facing value from Help Now outcomes and reflections.

**Expected deliverables:**
- Learn Me surface reads evidence contributions
- visible grouping or summaries for support-derived evidence
- user-facing plain language about what is being learned

**Acceptance checks:**
- new support-derived evidence is visible in Learn Me
- wording is understandable to a non-technical user
- no duplicate or contradictory display structures

---

### Consolidation block

#### Slice 36
**Title:** Introduce SupportAttempt domain

**Goal:**
Unify trial start, outcome logging, retry, transfer, and revalidation around one attempt lifecycle.

**Expected deliverables:**
- `SupportAttempt` domain type
- migration path for active trial and outcome logic
- attempt lifecycle utilities

**Acceptance checks:**
- one active attempt model governs support execution
- active trial is represented as an attempt state, not a separate parallel concept
- outcome resolution is tied to attempt context

#### Slice 37
**Title:** Normalize RecommendationStatus bundle

**Goal:**
Reduce loose related fields and standardize recommendation UI contracts.

**Expected deliverables:**
- `RecommendationStatus` bundle
- UI consumers updated to rely on normalized status shape

**Acceptance checks:**
- every displayed recommendation resolves the same readable status bundle
- ranking, grouping, and explanation components read from the same contract

#### Slice 38
**Title:** Extract guided support UI primitives

**Goal:**
Stop re-implementing similar action panels and explanation surfaces.

**Expected deliverables:**
- `GuidedActionPanel`
- `ExplanationStrip`
- `TrialBanner`
- `OutcomeChooser`

**Acceptance checks:**
- repeated support action layouts use shared primitives
- copy remains plain and calm
- no local one-off variants remain where a shared primitive applies

#### Slice 39
**Title:** Introduce EvidenceContribution domain

**Goal:**
Refactor Learn Me inputs around one shared contribution pipeline.

**Expected deliverables:**
- `EvidenceContribution` domain finalized
- consumer refactor for Learn Me
- source-to-contribution mapping utilities

**Acceptance checks:**
- Journal and Help Now can both feed Learn Me through the same domain object shape
- attribution and confidence survive the pipeline

#### Slice 40
**Title:** Reduce shell prop threading

**Goal:**
Lower repeated top-level wiring friction and improve maintainability.

**Expected deliverables:**
- provider or domain hook consolidation
- fewer manual shell handoff updates

**Acceptance checks:**
- adding a new support-flow field does not require excessive prop threading
- Help Now remains readable and testable after consolidation

---

### Post-consolidation product balance block

#### Slice 41
Journal-to-evidence integration

#### Slice 42
Onboarding and readiness flow

#### Slice 43
Customize polish tied to visible support behavior

#### Slice 44
Learn Me UX maturation for end-user usefulness

---

## Invariant checklist

Every relevant slice must preserve:

- recommendation truth is contextual, never universal
- only one active trial or attempt at a time
- every logged outcome has support title, state, and timestamp
- reflection is optional but never contextless
- evidence is attributable
- user-facing explanation exists for visible ranking effects
- customization changes presentation and language, not hidden semantic truth

---

## Workflow efficiency rules

- Prefer one active branch per feature family.
- Rebase to `main` before major patch sets.
- Prefer shared domain primitives over feature-local copies.
- Prefer loop-complete progress over surface-complete progress.
- When a behavior appears in three places, extract it.
- When an event matters to multiple features, normalize it.

---

## Immediate next move

Finish Slice 33, then proceed directly into Slice 34 without broadening the app surface.

The current top priority is still:

**State selection -> Help Now recommendation -> start trial -> log outcome -> optional reflection -> Learn Me evidence update -> future recommendation improvement**
