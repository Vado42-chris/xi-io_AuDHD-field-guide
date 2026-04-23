# Pre-Pilot Regression and Signoff Checklist

## Why this document exists

The repo now has:
- a post-44 assessment and Phase 2 blueprint
- an internal QA and product cleanup ledger
- a pilot-readiness checkpoint

That is enough planning structure.

The next practical need is a **run-ready regression and signoff checklist** that can be used before any small trusted pilot begins.

This document converts the pilot blockers and cleanup priorities into an operational checklist.

It is meant to be used, marked up, and signed off, not just read.

---

# 1. Signoff rule

A small trusted pilot should only proceed when:
- no blocking item below is marked **Fail**
- any item marked **Needs follow-up** has an explicit note and accepted risk
- the final signoff section is completed

If any blocking item fails and has no accepted mitigation, the pilot should pause.

---

# 2. Checklist legend

Status options:
- **Pass**
- **Fail**
- **Needs follow-up**
- **Not run yet**

Suggested fields for each item:
- Status
- Date run
- Owner
- Notes

---

# 3. Blocking regression checklist

## BLOCK-001, test harness execution

### Item 001-A
**Vitest test harness runs cleanly in the intended environment**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 001-B
**Local storage reset/setup behavior is stable across tests**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 001-C
**Current integration tests complete without environment drift or hidden failures**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

---

## BLOCK-002, core support-learning loop regression

### Item 002-A
**User can select a state and enter Help Now without confusion**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 002-B
**User can start a support attempt successfully**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 002-C
**Outcome logging completes and clears active attempt state correctly**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 002-D
**Optional reflection saves correctly after outcome logging**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 002-E
**Support-derived evidence becomes visible in Learn Me after logging activity**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

---

## BLOCK-003, journal-to-learning regression

### Item 003-A
**Journal thread update still works after recent slices**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 003-B
**Structured memory still appears from journal activity**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 003-C
**Journal-derived evidence enters the shared intake correctly**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 003-D
**Learn Me shared intake counts reflect journal contribution changes**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

---

## BLOCK-004, readiness and trust consistency

### Item 004-A
**Help Now and Learn Me use the same trust posture without conflicting wording**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 004-B
**Low-readiness behavior does not overclaim personalization trust**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 004-C
**Warming-up and ready states feel clearly different in user-facing language**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

---

## BLOCK-005, progressive disclosure defaults

### Item 005-A
**Help Now default path feels understandable without opening extra layers**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 005-B
**More-options and deeper-detail reveals behave predictably**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 005-C
**Pattern inspector cards remain readable before expansion**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

---

## BLOCK-006, support preference memory behavior

### Item 006-A
**Support view preference persists across reloads/sessions**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 006-B
**Switching between simpler and fuller detail does not create confusing hidden state**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 006-C
**Preference remains understandable and user-controlled**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

---

## BLOCK-007, custom state label propagation

### Item 007-A
**No raw canonical labels leak in the visible Help Now support flow**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 007-B
**Recommendation state matrix uses readable display labels consistently**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 007-C
**Pinned comforts show readable state names consistently**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

---

# 4. Non-blocking but high-value cleanup checks

## CLEANUP-001, layout and spacing

### Item 001-A
**Help Now top-of-screen stack does not feel overcrowded on tablet-first layout**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 001-B
**Learn Me top interpretation stack feels readable and not repetitive**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 001-C
**Nested glass panels still preserve clear visual hierarchy**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

---

## CLEANUP-002, language consistency

### Item 002-A
**Support wording is consistent across Help Now, Learn Me, and Customize**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 002-B
**Trust wording is steady and emotionally readable across surfaces**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 002-C
**Evidence wording does not feel too internal or system-heavy**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

---

## CLEANUP-003, pilot-observation readiness

### Item 003-A
**Product can be explained to a trusted pilot user in a few sentences without overclaiming**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 003-B
**Pilot caveats are ready to be shown or explained clearly**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

### Item 003-C
**Observation notes / confusion logging template is prepared for pilot use**

Status: Not run yet  
Date run:  
Owner:  
Notes:  

---

# 5. Stop conditions

The pilot should stop or pause if any of the following are observed during regression:

- the core support loop breaks or produces inconsistent state
- evidence does not appear after logging and reflection flows
- readiness wording contradicts actual product behavior
- personalization features appear arbitrary or misleading
- hidden canonical IDs remain in visible trust-sensitive surfaces
- disclosure behavior creates confusion or hides essential next steps

---

# 6. Accepted-risk section

Use this only when an item is not fully passed but the pilot can still proceed with a clearly stated limitation.

### Risk item
Issue:  
Why acceptable for limited pilot:  
Pilot caveat required:  
Owner approval:  
Date:  

### Risk item
Issue:  
Why acceptable for limited pilot:  
Pilot caveat required:  
Owner approval:  
Date:  

---

# 7. Final signoff

## Regression signoff

Blocking items all pass or have accepted mitigation:  
Signer:  
Date:  
Notes:  

## Pilot readiness signoff

Safe for small trusted pilot:  
Signer:  
Date:  
Notes:  

## Scope signoff

Pilot scope agreed:
- tester count:  
- duration:  
- goals:  
- caveats prepared:  

Signer:  
Date:  
Notes:  

---

# 8. Honest conclusion

This checklist is the final operational bridge between:
- planning
- cleanup
- and a real small trusted pilot

It exists to make sure the product is not moved into pilot mode by momentum alone.
It should be used as an actual gate.
