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

# AFG Event Receipts v1, preview

Decision value: `AFG_ROUTER_RECEIPTS_FRESHNESS_PREVIEW_ONLY_TRACKED_NOT_IMPLEMENTED`

## Purpose

Define preview-only AFG receipt expectations for future Meaning UI and framework-aligned product work.

Receipts preserve what was seen, what was suggested, what was blocked, and what the user chose. They do not create runtime storage, schemas, automation, tool authority, or private-data export.

## Core invariants

```text
Receipts preserve evidence and boundaries.
Receipts do not grant permission.
Receipts must record blocked claims.
Unknown is not success.
Private content is private by default.
EventAtom is evidence-bearing context, not permission.
FailureAtom is evidence-bearing failure context, not permission to fix.
```

## Receipt families

| Receipt family | Purpose | Required fields | Blocked claims |
|---|---|---|---|
| Raw ingress receipt | Preserve the first capture state before interpretation. | receipt_id, raw_ref, route_label, timestamp_if_available, privacy_posture, deferred_review_state, blocked_claims | Does not mean the content was interpreted, summarized, exported, or verified. |
| Lexicon mapping receipt | Preserve the mapping from raw user term to optional projection. | receipt_id, raw_user_term, raw_context_ref, projection, related_bins, related_personas, confidence, correction_state, privacy_posture, blocked_claims | Does not replace raw wording or globalize product-local terms. |
| Trigger suggestion receipt | Preserve advisory trigger suggestion context. | receipt_id, trigger_candidate_id, signal_refs, related_bins, related_personas, allowed_suggestion, blocked_actions, user_feedback_state, unknowns, blocked_claims | Does not mean trigger automation exists or that the suggestion is correct. |
| Route suggestion receipt | Preserve how a Meaning UI route was selected or corrected. | receipt_id, route_label, source_ref, suggested_path, user_correction_state, privacy_posture, blocked_actions, blocked_claims | Does not diagnose or decide for the user. |
| Export candidate receipt | Preserve an export review candidate and consent boundary. | receipt_id, source_refs, intended_audience, redaction_state, consent_state, export_allowed, export_block_reason, blocked_claims | Does not export by default and does not make private content public-safe. |
| Blocked claim receipt | Preserve what the system refused to claim or do. | receipt_id, blocked_claim, reason, source_ref, related_boundary, next_safe_action_if_any | Does not prove the opposite claim; it only records the boundary. |

## Minimum receipt posture

Every future AFG receipt should preserve:

```text
source reference
raw language preservation status
product-local bin context where applicable
persona routing suggestion where applicable
privacy posture
unknowns
blocked claims
user correction or feedback state where applicable
```

## Non-success states

AFG receipts must support non-success without hiding uncertainty.

```text
unknown
unclear
deferred
user_rejected
needs_review
blocked_private
blocked_no_consent
blocked_no_permission
blocked_medical_overreach
blocked_legal_overreach
blocked_tool_authority
blocked_model_authority
```

## Blocked implementation claims

```text
This document does not create receipt storage.
This document does not create TypeScript types.
This document does not create schemas.
This document does not implement EventAtom runtime support.
This document does not implement FailureAtom runtime support.
This document does not wire UI.
This document does not call models.
This document does not execute tools.
This document does not export private data.
This document does not claim xi-io.net#201 or xi-io.net#202 are accepted framework contracts.
```
