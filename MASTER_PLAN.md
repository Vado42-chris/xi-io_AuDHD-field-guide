# xi-io: AuDHD Field Guide, Master Plan

## Product north star

The app is not a dashboard.
The app is not a score sheet.
The app is not a journal with extra widgets.

The app is:

**a state-aware support system that helps the user regulate in the moment, remember what happened, and gradually learn what actually helps them**

Every major feature should support one of these jobs:

- help me identify what state I am in
- help me try something useful right now
- help me record what happened
- help me understand patterns over time
- help me tune the system so it feels like mine

If a feature does not clearly support one of those jobs, it should be deprioritized.

---

## Current strategic direction

Keep the center as:

**state-aware support in the moment, with memory and learning behind it**

Near-term execution should do two things in parallel:

1. finish the first complete cross-feature user loop
2. consolidate shared workflow primitives before the rest of the app catches up

---

## First complete cross-feature loop

The first full loop we are trying to complete is:

**State selection -> Help Now recommendation -> start trial -> log outcome -> optional reflection -> Learn Me evidence update -> future recommendation improvement**

This loop is the primary reference path for architecture, persistence, UX language, and tests.

---

## Phase plan

### Phase A, finish one real loop

Complete the support loop above before broadening too many secondary surfaces.

### Phase B, structural consolidation

After the loop works, do a consolidation pass focused on:

- normalized support attempt model
- normalized evidence contribution model
- shared guided-action UI primitives
- shared explanation UI primitives
- reduced prop threading
- feature-family contracts

### Phase C, raise the rest of the app toward the same maturity

After A and B, bring Journal, Learn Me, and Customize up toward the Help Now maturity level.

---

## Proposed folder structure

```txt
src/
  app/
    AppShell.tsx
    appShellConfig.ts
    providers/
      AppStateProvider.tsx
      SupportFlowProvider.tsx
    hooks/
      useAppSections.ts
      useCurrentState.ts
      useSupportFlow.ts

  domains/
    state/
      types.ts
      invariants.ts
      selectors.ts
      actions.ts
      persistence.ts

    support/
      types.ts
      invariants.ts
      recommendationEngine.ts
      ranking.ts
      grouping.ts
      revalidation.ts
      selectors.ts

    attempts/
      types.ts
      invariants.ts
      lifecycle.ts
      reflection.ts
      selectors.ts
      persistence.ts

    evidence/
      types.ts
      invariants.ts
      deriveEvidence.ts
      derivePatterns.ts
      selectors.ts

    memory/
      types.ts
      invariants.ts
      threadMemory.ts
      vault.ts
      selectors.ts

    personalization/
      types.ts
      invariants.ts
      thresholds.ts
      sensorySupports.ts
      customStates.ts
      selectors.ts

  features/
    help-now/
      HelpNowHome.tsx
      components/
      hooks/
      view-models/

    journal/
      JournalHome.tsx
      components/
      hooks/
      view-models/

    learn-me/
      LearnMeHome.tsx
      components/
      hooks/
      view-models/

    customize/
      CustomizeHome.tsx
      components/
      hooks/
      view-models/

  components/
    primitives/
      Button.tsx
      Panel.tsx
      TextArea.tsx
      Chip.tsx
      MetaPill.tsx

    patterns/
      GuidedActionPanel.tsx
      ExplanationStrip.tsx
      OutcomeChooser.tsx
      TrialBanner.tsx
      RecommendationCard.tsx
      SectionGroup.tsx

    layout/
      TabletFrame.tsx
      Sidebar.tsx
      ContentCard.tsx

  lib/
    storage/
      localStore.ts
    utils/
      time.ts
      ids.ts
      text.ts

  theme/
    app.css
    tokens.css
```

---

## Shared domain objects to standardize

### 1. SupportAttempt

This should become the core workflow primitive.

```ts
export type AttemptKind = 'normal' | 'retry' | 'revalidation' | 'transfer';

export interface SupportAttempt {
  id: string;
  recommendationId?: string;
  supportTitle: string;
  kind: AttemptKind;
  stateCanonicalId: CanonicalStateId;
  startedAt: number;
  finishedAt?: number;
  outcome?: SupportOutcome;
}
```

This should unify:

- try now
- normal use
- retries
- revalidation
- transfer cases
- outcome logging

### 2. TrialReflection

```ts
export interface TrialReflection {
  id: string;
  attemptId?: string;
  recommendationId?: string;
  supportTitle: string;
  stateCanonicalId: CanonicalStateId;
  outcome: SupportOutcome;
  prompt: 'what_changed' | 'what_helped' | 'what_made_it_harder';
  note: string;
  createdAt: number;
}
```

### 3. EvidenceContribution

```ts
export type EvidenceSource =
  | 'journal'
  | 'support_outcome'
  | 'trial_reflection'
  | 'revalidation'
  | 'manual'
  | 'customization';

export interface EvidenceContribution {
  id: string;
  source: EvidenceSource;
  stateCanonicalId?: CanonicalStateId;
  relatedRecommendationId?: string;
  tags: string[];
  summary: string;
  confidence: 'emerging' | 'repeated' | 'confirmed';
  createdAt: number;
}
```

This is the missing bridge between Journal, Help Now, reflection, Learn Me, and future onboarding.

### 4. RecommendationStatus

```ts
export interface RecommendationStatus {
  availability: RecommendationAvailability;
  confidence: RecommendationConfidence;
  trustMaturity: TrustMaturity;
  trustFreshness: TrustFreshness;
  priorityReason: string;
}
```

Every recommendation shown to the user should resolve to this readable bundle.

---

## Required invariants

### Invariant 1
A recommendation is never universally good.
It is always contextual to:

- state
- freshness
- maturity
- recent evidence

### Invariant 2
Only one active trial can exist at a time.

### Invariant 3
Every logged outcome must resolve to:

- a support title
- a state context
- a timestamp

### Invariant 4
Reflection is optional, but never contextless.
If a reflection exists, it must point to:

- an outcome
- a support title
- a state

### Invariant 5
Evidence must be attributable.
Every learnable signal must say where it came from.

### Invariant 6
User-facing explanation must exist for every ranking decision that affects visibility.

### Invariant 7
Customize changes language and presentation, not domain truth.
Renaming a state must not silently mutate semantic meaning.

---

## Reusable UI primitives to extract

### GuidedActionPanel
Use for:

- fresh check
- transfer review
- trial reflection
- optional notes
- revalidation actions

Standard structure:

- kicker
- short explanation
- optional textarea
- one to three actions
- optional history

### ExplanationStrip
Use for:

- priority reason
- why these first
- freshness explanation
- trust maturity explanation
- recovery explanation

Standard structure:

- title
- one-line explanation
- optional detail toggle

### TrialBanner
Use for:

- currently trying
- elapsed time
- gentle follow-through
- quick clear action

### OutcomeChooser
Use for:

- helped
- a little
- no change
- worse
- skipped

### SectionGroup
Use for:

- best fit now
- worth trying carefully
- needs a fresh check
- avoid for now

---

## Workflow rules

### Slice definition template
Every slice should declare:

- user problem
- domain event introduced
- state changes
- storage changes
- invariants affected
- UI surfaces touched
- cross-feature consumers
- tests required

### Feature family branch rule
Use one active branch per feature family at a time where possible.
Rebase to main before major patch sets.
Avoid long-running side branches unless they are architecture-only.

### Definition of done
A slice is not done until:

- domain types updated
- persistence updated if needed
- feature controller updated
- shell or provider updated
- shared primitive extracted if repeated
- copy reviewed for plain language
- invariants checked
- PR summary documents the above

### Integration-first testing priorities
Top integration tests should cover:

- start trial
- log outcome
- clear trial automatically
- save optional reflection
- recommendation freshness and revalidation behavior
- queue grouping behavior
- evidence contribution creation from outcome or reflection

---

## Cross-feature overlaps that must become explicit

### Journal -> Learn Me
Journal should emit structured evidence contributions, not only thread-local data.

### Help Now -> Learn Me
Outcomes, revalidations, and reflections should all emit evidence contributions.

### Customize -> Help Now
Customization should tune labels, defaults, and emphasis, not fork support logic.

### Learn Me -> Help Now
Learn Me must visibly tune:

- ranking
- confidence
- wording
- caution level

---

## Execution order after current slice

### Finish the current loop

#### Slice 33
Trial result reflection and optional note

#### Slice 34
Evidence contribution emission from:

- outcome
- reflection
- revalidation

#### Slice 35
Learn Me reads and displays those contributions in a user-visible way

This completes the first true cross-feature loop.

---

## Consolidation block

#### Slice 36
Introduce `SupportAttempt` domain and migrate live trial and outcome flow to it

#### Slice 37
Introduce `RecommendationStatus` bundle and normalize recommendation UI contracts

#### Slice 38
Extract `GuidedActionPanel`, `ExplanationStrip`, `TrialBanner`, `OutcomeChooser`

#### Slice 39
Introduce `EvidenceContribution` domain and refactor Learn Me inputs to use it

#### Slice 40
Reduce shell prop threading with provider or domain hook consolidation

---

## Broader product balance after consolidation

#### Slice 41
Journal-to-evidence integration

#### Slice 42
Onboarding and readiness flow

#### Slice 43
Customize polish tied to visible support behavior

#### Slice 44
Learn Me UX maturation so it is useful to the person, not just to the model

---

## Working rule for future slices

Do not pivot away from the center.
Keep the app centered on:

**state-aware support in the moment, with memory and learning behind it**

When choosing between multiple possible next slices, prefer the slice that most directly strengthens:

- in-the-moment support usefulness
- explainability
- lower cognitive load
- cross-feature learning integrity
- reusable structure over local one-off behavior

---

## What this plan is trying to prevent

This plan exists to prevent:

- drifting back into dashboard-first thinking
- repeated shell wiring friction
- hidden model behavior without readable explanation
- duplicated guided-action UI patterns
- parallel domain concepts that should be one shared primitive
- building secondary surfaces faster than the core support loop matures

---

## Final operating stance

The app is no longer a concept shell.
It is becoming a real product around one core loop.

The right move now is not broader ideation.
The right move is:

1. finish the first complete loop
2. consolidate the shared primitives
3. raise the rest of the app toward the same maturity
