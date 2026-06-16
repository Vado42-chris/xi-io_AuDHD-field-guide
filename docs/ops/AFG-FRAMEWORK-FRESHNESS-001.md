# AFG-FRAMEWORK-FRESHNESS-001

Decision value: `AFG_METADATA_FRESHNESS_REPORT_READY_NOT_SYNCED`

## Purpose

Create an AFG-local metadata-only freshness report for later xi-io.net alignment.

This report is public-safe structural metadata only. It does not sync private user content and does not write to xi-io.net.

## Source state

```text
canonical_issue: #104
source_repo: Vado42-chris/xi-io_AuDHD-field-guide
source_branch_before_pass: main
source_commit_before_pass: b41ac70400b9aed0d338a1f1c50a1f81c7a3ea52
product_docs_index: docs/product/README.md
preview_doc_count: 7
runtime_code_changed: false
xi_io_net_write: false
```

## Product metadata

```text
product_id: audhd_field_guide
product_repo: xi-io_AuDHD-field-guide
freshness_scope: metadata_only
private_data_export_allowed: false
framework_write_allowed: false
framework_contract_status: draft_dependency_only
```

## Indexed preview docs

```text
docs/product/afg-bins-v1.md
docs/product/afg-persona-map-v1.md
docs/product/afg-user-lexicon-v1.md
docs/product/afg-proactive-trigger-contract-v1.md
docs/product/afg-meaning-ui-router-v1.md
docs/product/afg-event-receipts-v1.md
docs/product/afg-framework-freshness-contract-v1.md
```

## Public-safe structural metadata candidates

```text
product_id
doc_paths
doc_count
preview_status
contract_names
bin_names
persona_names
route_names
receipt_family_names
blocked_claim_status
canonical_issue_ids
canonical_pr_ids
freshness_timestamp
```

## Blocked private content

```text
raw journal text
health notes
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

## Canonical completed AFG pass map

```text
AFG-CONTROL-RECON-001: complete
AFG-MEANING-UI-002A: complete
AFG-MEANING-UI-002B: complete
AFG-MEANING-UI-002C: complete
AFG-RUNTIME-FOUNDATION-001: complete
AFG-RUNTIME-FOUNDATION-002: planning complete, code split not complete
AFG-CI-CHECK-001: complete
AFG-RUNTIME-FOUNDATION-002-CODE-A: open, local/Cursor execution required
AFG-FRAMEWORK-FRESHNESS-001: this report
```

## Framework freshness payload candidate, non-executable

```text
product_id: audhd_field_guide
freshness_scope: metadata_only
source_repo: Vado42-chris/xi-io_AuDHD-field-guide
source_docs:
  - docs/product/README.md
  - docs/product/afg-bins-v1.md
  - docs/product/afg-persona-map-v1.md
  - docs/product/afg-user-lexicon-v1.md
  - docs/product/afg-proactive-trigger-contract-v1.md
  - docs/product/afg-meaning-ui-router-v1.md
  - docs/product/afg-event-receipts-v1.md
  - docs/product/afg-framework-freshness-contract-v1.md
private_data_export_allowed: false
runtime_claim: not_implemented
framework_compliance_claim: not_claimed
blocked_claims:
  - no_private_content_sync
  - no_runtime_alignment_claim
  - no_framework_compliance_claim
  - no_EventAtom_runtime_claim
  - no_FailureAtom_runtime_claim
```

## Blocked claims

```text
This report does not sync to xi-io.net.
This report does not create a framework contract.
This report does not claim xi-io.net accepts AFG metadata.
This report does not claim runtime implementation.
This report does not claim framework compliance.
This report does not expose private content.
This report does not create schemas.
This report does not create storage.
This report does not call models.
This report does not execute tools.
```

## Next safe pass

```text
XIIO-FRESHNESS-AFG-001: create a metadata-only receiver/update in xi-io.net using this report as source.
```

## Remaining pass estimate after this report

```text
1. XIIO-FRESHNESS-AFG-001
2. AFG-RUNTIME-FOUNDATION-002-CODE-A
3. AFG-RUNTIME-FOUNDATION-002-CODE-B
4. AFG-RUNTIME-FOUNDATION-002-CODE-C
5. AFG-CODE-COMMENTS-001
6. AFG-UI-SLICE-001
7. AFG-COMPLIANCE-REVIEW-001
```
