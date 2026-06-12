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

# AFG Framework Freshness Contract v1, preview

Decision value: `AFG_ROUTER_RECEIPTS_FRESHNESS_PREVIEW_ONLY_TRACKED_NOT_IMPLEMENTED`

## Purpose

Define the preview-only boundary for what the AuDHD Field Guide may later report back to xi-io.net as framework freshness.

Framework freshness is metadata-only by default. It is not private data sync.

## Core invariants

```text
Framework freshness is metadata-only by default.
No private memory, health, legal, journal, relationship, sensory, or capacity content may sync to xi-io.net by default.
Product-local AFG docs may inform framework freshness only as structural metadata.
EventAtom is evidence-bearing context, not permission.
FailureAtom is evidence-bearing failure context, not permission to fix.
Unknown is not success.
Human approval is required before write actions.
```

## Public-safe structural metadata candidates

AFG may later report only structural metadata such as:

```text
product_id
doc_version
preview_status
contract_names
bin_names
persona_names
route_names
receipt_family_names
blocked_claim_status
freshness_timestamp
source_doc_paths
canonical_issue_ids
canonical_pr_ids
```

## Private data blocked by default

AFG must not sync these to xi-io.net by default:

```text
raw journal text
health/body notes
legal notes
relationship content
private memory fragments
capacity values
sensory episode content
names of people
message contents
private task contents
user-specific lexicon values unless explicitly marked public-safe
trigger evidence content
export candidate content
```

## Allowed vs blocked examples

| Candidate | Default decision | Reason |
|---|---|---|
| `docs/product/afg-bins-v1.md` exists | Allowed metadata | Structural doc path, no private user content. |
| Bin name `Current State` | Allowed metadata | Product-local structural label. |
| User note inside Current State | Blocked | Private user content. |
| Persona name `Capacity Steward` | Allowed metadata | Product-local structural role. |
| User capacity value in cheeseburgers | Blocked | Private user-specific state. |
| Decision value for preview doc | Allowed metadata | Public-safe progress marker. |
| Raw delayed memory fragment | Blocked | Private memory content. |
| Receipt id without content | Potentially allowed | Structural reference only, if non-identifying. |
| Receipt body with source content | Blocked | Private content or context-bearing evidence. |

## Freshness report minimum shape, non-runtime

This is documentation only. It is not a schema.

```text
product_id: audhd_field_guide
freshness_scope: metadata_only
source_docs:
  - docs/product/afg-bins-v1.md
  - docs/product/afg-persona-map-v1.md
  - docs/product/afg-user-lexicon-v1.md
  - docs/product/afg-proactive-trigger-contract-v1.md
  - docs/product/afg-meaning-ui-router-v1.md
  - docs/product/afg-event-receipts-v1.md
  - docs/product/afg-framework-freshness-contract-v1.md
private_data_export_allowed: false
blocked_claims:
  - no_runtime_alignment_claim
  - no_framework_compliance_claim
  - no_private_content_sync
```

## Human approval boundary

Any future freshness operation that writes to xi-io.net must require explicit human approval and must be reviewable before write.

Future write candidates must show:

```text
what will be written
where it will be written
source docs used
private data check result
blocked claims
rollback or correction path
```

## Blocked implementation claims

```text
This document does not create framework sync.
This document does not write to xi-io.net.
This document does not create schemas.
This document does not create storage.
This document does not create a freshness CLI.
This document does not create EventAtom runtime support.
This document does not create FailureAtom runtime support.
This document does not call models.
This document does not execute tools.
This document does not export private data.
This document does not claim xi-io.net#201 or xi-io.net#202 are accepted framework contracts.
```

## Next safest AFG pass

```text
AFG-RUNTIME-FOUNDATION-001: add verification script and runtime refactor plan only after preview docs are complete
```
