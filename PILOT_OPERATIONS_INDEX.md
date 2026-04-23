# Pilot Operations Index

## Why this document exists

The repo now contains a substantial trusted-pilot operations stack.

That is good.

But once the number of pilot artifacts gets large enough, the next risk is not missing documentation.
The next risk is operational fragmentation, where people are unsure:
- which file to use first
- which file is for planning vs execution vs synthesis
- what the correct order of operations is
- what minimum set of documents is required for Batch 1
- how later pilot batches and readiness checkpoints connect back to the early stack

This index exists to solve that.

It is the master map for running the trusted pilot stack.

---

# 1. Pilot operations stack at a glance

## Planning and readiness artifacts

### `POST_44_ASSESSMENT_AND_PHASE_2_BLUEPRINT.md`
What it is for:
- post-44 product assessment
- Phase 2 structure
- macro planning

Use when:
- understanding why Phase 2 exists
- checking the original hardening plan

### `INTERNAL_QA_AND_PRODUCT_CLEANUP_LEDGER.md`
What it is for:
- cleanup debt
- QA gaps
- UI/naming/interaction issues
- pilot blockers

Use when:
- identifying unresolved cleanup work
- deciding what still needs verification before or during pilot work

### `PILOT_READINESS_CHECKPOINT.md`
What it is for:
- defining the pilot posture
- clarifying what is safe to test
- setting caveats and success criteria

Use when:
- deciding whether a small trusted pilot is appropriate at all
- aligning on what the pilot should and should not claim

### `PILOT_READINESS_PROGRESSION_LADDER.md`
What it is for:
- defining progression levels
- setting advancement criteria
- preventing readiness drift by momentum alone

Use when:
- deciding whether the product is still in trusted-pilot territory
- deciding whether broader readiness planning is justified

---

## Pre-pilot gate artifact

### `PRE_PILOT_REGRESSION_AND_SIGNOFF_CHECKLIST.md`
What it is for:
- final operational gate before pilot activity
- blocking checks and signoff

Use when:
- deciding whether Batch 1 can actually proceed
- recording pass/fail/accepted-risk outcomes

This is the go / no-go gate.

---

## Session execution artifacts

### `TRUSTED_PILOT_PARTICIPANT_BRIEF.md`
What it is for:
- participant-facing explanation
- caveats
- tone-setting

Use when:
- a participant has agreed to join
- sending materials before a session

### `PILOT_FACILITATOR_RUNBOOK.md`
What it is for:
- facilitator posture
- opening script
- recommended session flow
- neutral prompts
- stop conditions

Use when:
- running or observing a live session

### `PILOT_OBSERVATION_SESSION_TEMPLATE.md`
What it is for:
- structured per-session note capture

Use when:
- during or immediately after each pilot session

---

## Outreach artifacts

### `TRUSTED_PILOT_INVITATION_TEMPLATE.md`
What it is for:
- inviting trusted participants

Use when:
- reaching out to potential testers

### `PILOT_POST_SESSION_FOLLOWUP_TEMPLATE.md`
What it is for:
- thanking participants
- inviting late-emerging feedback

Use when:
- after a session or short use period

---

## Synthesis and decision artifacts

### `PILOT_FINDINGS_SYNTHESIS_TEMPLATE.md`
What it is for:
- cross-session synthesis
- recurring patterns
- blockers
- go / no-go guidance after a batch

Use when:
- after a group of sessions has been completed

### `PILOT_ISSUE_TRIAGE_TEMPLATE.md`
What it is for:
- converting a pilot finding into a tracked issue

Use when:
- a finding is important enough to track explicitly

### `PILOT_DECISION_LOG_TEMPLATE.md`
What it is for:
- recording explicit product or pilot decisions based on findings

Use when:
- the team makes a real call, such as fix now, defer, accept risk, or pause

---

## Rollout control artifacts

### `PILOT_ROLLOUT_TRACKER_TEMPLATE.md`
What it is for:
- tracking invitation status, session status, follow-up status, and synthesis status by participant

Use when:
- managing the actual pilot roster

### `PILOT_BATCH_SCHEDULE_TEMPLATE.md`
What it is for:
- planning batches, timing, synthesis windows, and continue/pause checkpoints

Use when:
- organizing the pilot into explicit learning batches

---

## Batch execution and closeout artifacts

### `BATCH_1_EXECUTION_WORKBOOK.md`
What it is for:
- running the first trusted pilot batch as a concrete operational sequence

Use when:
- executing Batch 1 day by day

### `BATCH_1_CLOSEOUT_REPORT_TEMPLATE.md`
What it is for:
- consolidating what Batch 1 proved, what it did not prove, and whether Batch 2 should proceed

Use when:
- closing Batch 1 and making the next-step call

### `BATCH_2_EXECUTION_WORKBOOK.md`
What it is for:
- running the second pilot batch with a focus on repeated-use value and Batch 1 carry-forward checks

Use when:
- executing Batch 2 day by day

### `BATCH_2_CLOSEOUT_REPORT_TEMPLATE.md`
What it is for:
- consolidating what Batch 2 proved, what stayed unresolved, and what the next pilot step should be

Use when:
- closing Batch 2 and making the next-step call

### `BATCH_1_TO_BATCH_2_COMPARISON_REPORT_TEMPLATE.md`
What it is for:
- comparing the first two pilot rounds explicitly
- identifying improvement, unresolved issues, and regressions

Use when:
- deciding whether the pilot is genuinely maturing the product

---

# 2. Correct order of operations

The pilot stack should usually be used in this order.

## Step 1
Review:
- `PILOT_READINESS_CHECKPOINT.md`
- `INTERNAL_QA_AND_PRODUCT_CLEANUP_LEDGER.md`
- `PILOT_READINESS_PROGRESSION_LADDER.md`

Purpose:
- confirm the pilot posture
- confirm known blockers and caveats
- confirm the current progression level and what evidence is still missing

## Step 2
Run:
- `PRE_PILOT_REGRESSION_AND_SIGNOFF_CHECKLIST.md`

Purpose:
- determine whether Batch 1 can proceed

## Step 3
Plan:
- `PILOT_BATCH_SCHEDULE_TEMPLATE.md`
- `PILOT_ROLLOUT_TRACKER_TEMPLATE.md`
- `BATCH_1_EXECUTION_WORKBOOK.md`

Purpose:
- define Batch 1
- assign participants and schedule windows
- turn the first batch into a concrete operating sequence

## Step 4
Invite:
- `TRUSTED_PILOT_INVITATION_TEMPLATE.md`

Purpose:
- recruit the first trusted participants

## Step 5
Brief and run:
- `TRUSTED_PILOT_PARTICIPANT_BRIEF.md`
- `PILOT_FACILITATOR_RUNBOOK.md`
- `PILOT_OBSERVATION_SESSION_TEMPLATE.md`

Purpose:
- conduct the actual session
- capture notes consistently

## Step 6
Follow up:
- `PILOT_POST_SESSION_FOLLOWUP_TEMPLATE.md`

Purpose:
- gather late-emerging feedback

## Step 7
Synthesize:
- `PILOT_FINDINGS_SYNTHESIS_TEMPLATE.md`

Purpose:
- turn multiple sessions into recurring findings

## Step 8
Triage and decide:
- `PILOT_ISSUE_TRIAGE_TEMPLATE.md`
- `PILOT_DECISION_LOG_TEMPLATE.md`

Purpose:
- convert findings into tracked product work and explicit calls

## Step 9
Close Batch 1:
- `BATCH_1_CLOSEOUT_REPORT_TEMPLATE.md`

Purpose:
- determine whether Batch 2 should proceed unchanged, proceed with caveats, or pause for fixes

## Step 10
Run Batch 2 if justified:
- `BATCH_2_EXECUTION_WORKBOOK.md`
- `BATCH_2_CLOSEOUT_REPORT_TEMPLATE.md`

Purpose:
- test repeated-use value and Batch 1 carry-forward issues
- make the next-step decision after the second round

## Step 11
Compare early pilot rounds:
- `BATCH_1_TO_BATCH_2_COMPARISON_REPORT_TEMPLATE.md`
- revisit `PILOT_READINESS_PROGRESSION_LADDER.md`

Purpose:
- decide whether the pilot is genuinely maturing the product
- decide whether broader readiness planning is justified or still premature

---

# 3. Minimum viable Batch 1 document set

If someone wants the smallest usable stack for Batch 1, this is the minimum set.

## Required before Batch 1
- `PILOT_READINESS_CHECKPOINT.md`
- `PRE_PILOT_REGRESSION_AND_SIGNOFF_CHECKLIST.md`
- `PILOT_BATCH_SCHEDULE_TEMPLATE.md`
- `PILOT_ROLLOUT_TRACKER_TEMPLATE.md`
- `BATCH_1_EXECUTION_WORKBOOK.md`

## Required during Batch 1
- `TRUSTED_PILOT_PARTICIPANT_BRIEF.md`
- `PILOT_FACILITATOR_RUNBOOK.md`
- `PILOT_OBSERVATION_SESSION_TEMPLATE.md`

## Required after Batch 1
- `PILOT_POST_SESSION_FOLLOWUP_TEMPLATE.md`
- `PILOT_FINDINGS_SYNTHESIS_TEMPLATE.md`
- `PILOT_ISSUE_TRIAGE_TEMPLATE.md`
- `PILOT_DECISION_LOG_TEMPLATE.md`
- `BATCH_1_CLOSEOUT_REPORT_TEMPLATE.md`

---

# 4. Suggested Batch 1 operating sequence

This is the simplest practical version of Batch 1.

## Batch 1 goal
Learn whether:
- the main support loop is understandable
- Help Now feels calmer and clearer
- trust language feels appropriately cautious

## Suggested Batch 1 size
- 3 participants

## Suggested Batch 1 order

### Day 1
- review readiness checkpoint
- review progression ladder current-position logic
- run pre-pilot regression checklist
- create Batch 1 plan and workbook
- update rollout tracker

### Day 2 to Day 4
- send invitations
- confirm participants
- send participant brief to accepted testers
- finalize session times

### Session days
For each participant:
- use facilitator runbook
- use observation session template
- update rollout tracker immediately after session
- send follow-up template

### After 2 to 3 sessions
- run the findings synthesis template
- convert meaningful problems into triage items
- record any explicit product or pilot decisions

### Batch 1 checkpoint
- complete the Batch 1 closeout report
- decide whether Batch 2 is justified

---

# 5. Role guidance

## Coordinator
Owns:
- tracker
- batch schedule
- signoff readiness
- pause / continue coordination

## Facilitator / observer
Owns:
- participant brief delivery
- session flow
- observation notes
- red-flag capture

## Product decision owner
Owns:
- triage
- decision logs
- whether issues become fixes, accepted risks, or pauses

These roles can be the same person in a very small pilot, but the responsibilities should still be separated conceptually.

---

# 6. Common failure modes this index is trying to prevent

## Failure mode 1
Running sessions without a true pre-pilot gate

Prevented by:
- using the regression and signoff checklist first

## Failure mode 2
Capturing uneven or incomplete notes

Prevented by:
- using the session template and facilitator runbook together

## Failure mode 3
Letting findings pile up without synthesis or closeout

Prevented by:
- explicit synthesis step after each batch
- explicit closeout reports for each batch

## Failure mode 4
Talking about issues without turning them into tracked work

Prevented by:
- triage template and decision log template

## Failure mode 5
Letting the pilot drift into a loose stream of sessions with no checkpoint logic

Prevented by:
- rollout tracker and batch schedule template
- batch workbooks and closeout reports

## Failure mode 6
Assuming the pilot is progressing without explicit comparison

Prevented by:
- batch comparison report
- progression ladder revisit after early batches

---

# 7. Honest recommendation

The stack is now complete enough that the next smart move is to use it deliberately rather than keep expanding it by default.

That does not mean no further pilot documents will ever be useful.
It means any additional artifact should only be created when it clearly removes a real execution gap.

The priority should now be to actually use this index to run:
- a pre-pilot regression pass
- a small Batch 1
- a real synthesis and triage checkpoint
- a real Batch 1 closeout
- a disciplined decision on whether Batch 2 is justified

That is where the highest-value learning now lives.

---

# 8. Honest conclusion

This repo now has enough pilot operations structure to move carefully from planning into action.

That does not guarantee a successful pilot.
But it does mean the pilot no longer has to depend on memory, improvisation, or scattered notes.

That is the purpose of this index.
