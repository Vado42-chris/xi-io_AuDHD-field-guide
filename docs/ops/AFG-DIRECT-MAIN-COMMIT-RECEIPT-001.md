# AFG-DIRECT-MAIN-COMMIT-RECEIPT-001

Decision value: `AFG_DIRECT_MAIN_DOCS_COMMIT_RECORDED`

## Purpose

Record a process deviation so it does not fail silently.

## Event

A docs-only product polish backlog file was created directly on `main` instead of through a pull request.

```text
commit: 8fdd55cbbb70f726faba42776c1274ef373c28a2
file: docs/ops/AFG-PRODUCT-POLISH-BACKLOG-001.md
```

## Impact

```text
runtime changed: no
application code changed: no
private data changed: no
framework sync changed: no
```

## Verification status

```text
workflow runs for commit checked immediately after commit: none returned
local check run: no
```

## Handling

This was a process miss, not a runtime behavior change. Future edits should return to branch plus PR plus CI unless the user explicitly requests a direct commit.
