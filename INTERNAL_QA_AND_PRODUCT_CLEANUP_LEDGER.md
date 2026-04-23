# Internal QA and Product Cleanup Ledger

## Why this document exists

Phase 2 has already improved:
- reliability scaffolding
- Help Now density
- Learn Me hierarchy
- evidence semantics
- contradiction handling
- custom state label propagation
- comfort-tool personalization
- support preference memory
- readiness and trust consistency

That is strong progress.

The next correct move is not more feature invention.
The next correct move is to capture remaining debt and verification gaps in one explicit ledger so cleanup does not get lost between slices.

This document is that ledger.

---

# 1. QA status summary

## 1.1 What is materially improved

### A. The product has a real cross-feature loop
The app now has a meaningful end-to-end flow connecting:
- state selection
- support attempt
- outcome logging
- optional reflection
- evidence intake
- Learn Me visibility

### B. The app is more readable than it was
The largest high-density surfaces have already been improved:
- Help Now now uses stronger progressive disclosure
- Learn Me now has better prioritization
- the pattern inspector is calmer by default

### C. Trust language is more coherent
Readiness and trust messaging are now more consistent across:
- Help Now
- Learn Me

### D. User-owned customization is more visible
User changes now affect:
- labels
- comfort prioritization
- support presentation defaults

These are real product maturity gains.

---

## 1.2 What is still not proven enough

### A. Test coverage is still too narrow relative to the architecture
There is now a real test harness and early integration coverage, but the product still relies too much on implementation confidence instead of broad verification.

### B. UI cleanup has not yet been systematically audited
Several slices improved behavior and hierarchy, but not every component has been revisited after those changes.

### C. There is still branch and slice carry-forward complexity
A few reliability slices required carrying forward prior setup work because branches were not always cut from the newest head. This was handled honestly, but it means cleanup discipline matters even more now.

### D. There are still likely style and naming inconsistencies across surfaces
The product is more coherent, but not yet fully normalized.

---

# 2. Cleanup categories

## 2.1 High-priority QA blockers

These items should be treated as the most important before any pilot-readiness claim.

### QA-001
**Run and verify the test harness end to end**

Need:
- confirm Vitest setup runs cleanly in the repo environment
- confirm the current test files execute without environment drift
- confirm local storage setup/reset behavior is stable

Status:
- planned
- not yet explicitly verified in this ledger

### QA-002
**Verify core support-learning loop after all later UX slices**

Need regression checks on:
- state route selection
- support attempt start
- outcome logging
- reflection persistence
- evidence contribution visibility
- recommendation detail toggles after support preference memory changes

Status:
- partially covered conceptually
- needs explicit regression pass

### QA-003
**Verify journal evidence still enters shared intake after later slices**

Need regression checks on:
- journal thread update
- structured memory creation
- journal evidence visibility in Learn Me
- shared intake counts

Status:
- partially covered in Phase 2 reliability work
- needs final confirmation after later UI changes

### QA-004
**Verify readiness/trust copy consistency after recent refactors**

Need:
- Help Now wording audit
- Learn Me wording audit
- confirm both use same shared trust posture correctly
- confirm no conflicting old copy remains

Status:
- in progress by design
- needs full audit

---

## 2.2 High-priority UI cleanup items

### UI-001
**Normalize section spacing and card density after multiple additive slices**

Why:
Several screens were improved iteratively, which can create uneven spacing or card rhythm.

Targets:
- Help Now
- Learn Me
- Customize
- pattern inspector cards

### UI-002
**Audit glass and panel layering for visual consistency**

Why:
Multiple slices added new glass sections and nested cards. Need to ensure the visual hierarchy still reads clearly.

Targets:
- nested glass panels inside Help Now
- top interpretation blocks in Learn Me
- Customize explanation panels

### UI-003
**Audit meta-pill consistency**

Why:
Meta pills are now used in several places. Need consistency in wording length, ordering, and wrapping behavior.

### UI-004
**Audit chip/button labels for consistency**

Examples:
- Show more options / Show fewer options
- Show deeper detail / Hide deeper detail
- Simpler view / Fuller detail
- Got it

Need to confirm these are consistently phrased and visually balanced.

### UI-005
**Review textarea and note-entry surfaces**

Why:
Optional note and resolution note areas should feel consistent in voice, spacing, and instruction style.

---

## 2.3 Naming and language cleanup items

### LANG-001
**Reduce remaining system-sounding phrasing**

Need to look for wording that still sounds too internal, such as:
- intake
- confidence
- resolution
- review
- transfer

Not all of these terms are bad, but they need consistent plain-language framing where user-facing.

### LANG-002
**Check mixed use of support/supports/support tool/comfort tool**

Need to normalize where possible.

### LANG-003
**Check state wording consistency**

Need to confirm:
- custom labels override correctly where intended
- fallback labels are clean and human-readable
- no remaining raw canonical IDs leak through visible UI

### LANG-004
**Check trust wording consistency**

Need to verify there is no meaningful drift between:
- cautious
- stronger
- grounded
- early
- warming up
- ready

These should feel intentional, not accidental.

---

## 2.4 Interaction cleanup items

### INT-001
**Check progressive disclosure defaults**

Need to verify whether the defaults still feel right for:
- Help Now recommendation groups
- Help Now selected-support detail
- pattern inspector references/tools/history

### INT-002
**Check support view preference memory behavior**

Need to verify:
- preference persists correctly
- preference does not create confusing state after route changes
- preference remains understandable to the user

### INT-003
**Check readiness guide dismissal behavior**

Need to verify:
- dismissal persists correctly
- guide does not return unexpectedly
- guide remains discoverable enough for first-use scenarios

### INT-004
**Check pinned comfort prioritization behavior**

Need to verify:
- current-state matches sort correctly
- fallback ordering still feels sensible when there is no match
- explanation text matches actual prioritization logic

---

## 2.5 Learn Me cleanup items

### LM-001
**Audit top interpretation stack for repeated messaging**

Need to check whether these sections are too close in meaning:
- Readiness and trust
- What seems most true right now
- What to do with this
- What still looks mixed or uncertain

### LM-002
**Check evidence-card verbosity after semantics improvements**

Need to confirm cards are informative but not too repetitive now that they include:
- confidence
- confidence explanation
- source explanation
- tags

### LM-003
**Check inspector relationship to top interpretation layers**

Need to ensure the user understands that the inspector is deeper detail, not the main reading path.

---

## 2.6 Help Now cleanup items

### HN-001
**Audit top-of-screen stack height**

The following now sit high in the page:
- meta pills
- readiness and trust
- support view preference
- readiness guide
- pinned comforts
- active trial banner

Need to confirm this still feels manageable on tablet-first layout.

### HN-002
**Check recommendation detail reveal flow**

Need to verify that users understand:
- best fit now
- more options
- deeper detail

without losing the main path.

### HN-003
**Check relationship between starter supports and tailored supports**

Need to confirm the product still clearly communicates:
- starter supports are safe first moves
- tailored supports are more trust-dependent

---

# 3. Suggested QA execution order

## Pass 1, Functional regression
Focus on:
- state selection
- attempt lifecycle
- outcome logging
- reflections
- evidence visibility
- local storage preferences

## Pass 2, Surface consistency
Focus on:
- Help Now
- Learn Me
- Customize
- inspector cards

## Pass 3, language audit
Focus on:
- trust wording
- readiness wording
- support wording
- state wording

## Pass 4, layout polish
Focus on:
- spacing
- glass layering
- chip/button consistency
- card rhythm

---

# 4. Pilot-blocking issues

These should be treated as blockers until explicitly cleared.

## BLOCK-001
Test harness not fully executed and confirmed in environment

## BLOCK-002
Remaining visible naming drift or raw canonical state leakage

## BLOCK-003
Conflicting readiness or trust copy across surfaces

## BLOCK-004
Progressive disclosure defaults causing confusion in Help Now or Learn Me

## BLOCK-005
Support preference memory causing hidden or confusing UI state

---

# 5. Completion definition for Slice 56

Slice 56 should be considered successful because it creates a durable repo-level cleanup and QA ledger that:
- captures the remaining debt clearly
- groups it into actionable bins
- identifies pilot blockers
- gives the next slice a clear checklist to close against

This slice does not claim the cleanup work is finished.
It makes the cleanup work impossible to lose.

---

# 6. Honest conclusion

The product is in a much stronger place than it was even a short time ago.

But Phase 2 has introduced enough improvement that the remaining rough edges are now more visible, not less.
That is normal.

The right response is not to rush past them.
The right response is to name them clearly, verify them systematically, and close them with the same discipline used to build the stronger architecture and calmer user flows.
