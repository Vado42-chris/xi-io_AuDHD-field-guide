# Pilot Readiness Progression Ladder

## Why this document exists

The repo now has:
- pilot readiness and caveat documents
- pre-pilot regression and signoff artifacts
- execution workbooks and closeout templates for Batch 1 and Batch 2
- a comparison template across the first two pilot rounds

That is enough to run and evaluate early pilot work.

The next practical need is a **progression ladder** that answers:
- what level the product is currently at
- what evidence is required to move up
- what issues force a pause or step back
- what broader readiness actually means in this repo's language

This ladder is meant to stop advancement by momentum alone.

---

# 1. Ladder overview

The product can move through these progression states:

## Level 0
**Internal concept and architecture validation**

Meaning:
- product structure exists
- major flows are being built or consolidated
- no real pilot claim yet

## Level 1
**Trusted pilot only, first-contact validation**

Meaning:
- small trusted testers only
- first-use comprehension and trust are being checked
- product is still explicitly caveated and fragile

## Level 2
**Trusted pilot, repeated-use validation**

Meaning:
- limited pilot continues
- repeated-use value is being tested
- personalization and Learn Me return value are under observation

## Level 3
**Expanded readiness planning**

Meaning:
- product is still not broadly released
- but pilot evidence is strong enough to justify planning for a somewhat wider or more formal evaluation phase

## Level 4
**Broader readiness candidate**

Meaning:
- the product has shown enough stability, clarity, and trustworthy behavior that planning for broader exposure becomes reasonable
- this is still not the same as full validation or unrestricted rollout

---

# 2. Current assessed position

## Current position

**Recommended current position: Level 1 moving into Level 2**

Why:
- the trusted pilot stack is now fully documented
- Batch 1 and Batch 2 operations are explicitly scaffolded
- the current posture supports small trusted pilot work
- broader readiness is not yet justified without actual batch evidence

This means:
- trusted pilot work is justified
- broader readiness planning is not yet justified by documentation alone

---

# 3. Advancement criteria by level

## 3.1 Moving from Level 0 to Level 1

To move from internal concept/architecture validation to trusted pilot only, first-contact validation, the product should have:
- a real cross-feature support loop
- explicit caveats and trust posture
- a pre-pilot regression gate
- a participant brief and facilitator runbook
- a way to capture and synthesize observations

This repo now satisfies that structurally.

---

## 3.2 Moving from Level 1 to Level 2

To move from first-contact validation to repeated-use validation, the product should show:
- Batch 1 completed with no unmitigated blocking failure in the core support loop
- Help Now generally understandable without heavy coaching
- trust language not consistently rejected as too certain or too vague
- at least some indication that Learn Me is worth revisiting
- no major evidence that personalization is purely decorative

If these are not true, the product should remain in Level 1 or pause for fixes.

---

## 3.3 Moving from Level 2 to Level 3

To move from repeated-use validation to expanded readiness planning, the product should show:
- Batch 2 completed with no major unresolved pilot blocker that undermines product trust
- repeated-use value visible for at least some participants
- Learn Me showing durable value beyond first-contact novelty
- personalization showing some sustained usefulness over time
- trust posture still landing correctly after repeated use
- comparison across Batch 1 and Batch 2 showing meaningful improvement or stable positive direction

If Batch 2 mainly adds more complexity without clearer value, the product should not move to Level 3.

---

## 3.4 Moving from Level 3 to Level 4

To move from expanded readiness planning to broader readiness candidate, the product should show:
- multiple pilot batches with stable synthesis and no major unresolved contradictions in the core product value
- the support loop holding up without heavy facilitation dependence
- trust language consistently understood across participants
- Help Now and Learn Me both demonstrating usable value
- personalization behaving as meaningful support, not decorative noise
- issue triage and decision logs showing that major pilot findings are being resolved, not only recorded

Level 4 still does not mean “finished” or “fully validated.”
It means broader readiness planning is becoming reasonable.

---

# 4. Pause and fallback conditions

The ladder is not one-way.
The product should pause or step back if evidence weakens.

## Pause conditions

Pause advancement if:
- the core support loop breaks in practice
- trust language is being misunderstood in a serious or repeated way
- Learn Me creates more confusion than value
- personalization creates misleading or arbitrary impressions
- disclosure behavior hides the next step too often
- repeated-use evidence shows degradation rather than increasing clarity

## Fallback conditions

Step back a level if:
- later pilot rounds reveal the earlier confidence was overly optimistic
- accepted risks turn into real blockers
- the comparison across batches shows instability rather than maturation

---

# 5. Evidence categories used in the ladder

The ladder should be advanced based on evidence in these categories.

## Category A, Support loop stability

Questions:
- does the main flow hold up?
- can users complete it without heavy rescue?

## Category B, Trust and tone

Questions:
- does the trust posture feel honest?
- is the product too certain or too abstract?

## Category C, Learn Me value

Questions:
- does Learn Me feel readable?
- does it become worth revisiting?

## Category D, Personalization value

Questions:
- do custom labels, pinned comforts, and support preferences feel meaningful?

## Category E, Operational maturity

Questions:
- are findings being synthesized, triaged, and turned into real decisions?
- is the pilot being run with discipline rather than drift?

The ladder should not advance if only one category is strong while the others remain weak in core ways.

---

# 6. Promotion checklist by level

## Promotion to Level 2 checklist

- [ ] Batch 1 complete
- [ ] Batch 1 closeout complete
- [ ] no unmitigated blocking failure in the core support loop
- [ ] first-contact comprehension at least moderately successful
- [ ] trust language not consistently failing
- [ ] explicit decision to continue made

## Promotion to Level 3 checklist

- [ ] Batch 2 complete
- [ ] Batch 2 closeout complete
- [ ] Batch 1 to Batch 2 comparison complete
- [ ] repeated-use value visible for at least some participants
- [ ] comparison shows positive or meaningfully clarifying movement
- [ ] explicit decision to continue or broaden planning made

## Promotion to Level 4 checklist

- [ ] additional pilot evidence beyond early batches exists
- [ ] major open blockers are no longer dominating the pilot signal
- [ ] support loop, trust posture, Learn Me value, and personalization all show stable enough behavior
- [ ] broader readiness planning is explicitly justified in writing

---

# 7. What should never count as promotion evidence by itself

These are not enough on their own:
- enthusiasm from a small number of testers
- completion of documentation alone
- absence of explicit complaints in one small batch
- facilitator explanation making the product seem clearer than it is
- a good-looking single session with no repeated-use evidence

The ladder is meant to resist false confidence.

---

# 8. Recommended use of this ladder

Use this ladder at these checkpoints:
- before Batch 1
- after Batch 1 closeout
- after Batch 2 closeout
- after Batch 1 to Batch 2 comparison
- before any move toward broader readiness planning

When using it, answer explicitly:
- what level are we at now?
- what evidence supports that?
- what evidence is still missing?
- what would force a pause?

---

# 9. Honest recommendation

The product should not claim progression beyond Level 1 / early Level 2 until real batch evidence exists.

The documentation stack is now strong enough to run the pilot well.
That does not by itself justify broader readiness language.

The ladder should be used to keep those two truths separate.

---

# 10. Honest conclusion

A good progression ladder is not a reward chart.
It is a control system.

Its purpose is to make sure the product advances because the evidence got stronger, not because the team got tired of waiting.

That is the standard this ladder is meant to hold.
