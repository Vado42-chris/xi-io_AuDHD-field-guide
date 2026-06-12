# AFG-RUNTIME-FOUNDATION-001

Decision value: `AFG_RUNTIME_FOUNDATION_GUARDED_NOT_IMPLEMENTED`

## Purpose

Add the first guarded runtime-foundation pass after completed preview-only Meaning UI documentation.

This pass prepares verification and planning before runtime refactor work. It does not refactor runtime code.

## Current repo state

```text
main_before_pass: 4708300e321beba700cd1420bedbcd91da031c9d
canonical_issue: #96
completed_preview_docs: 7
product_docs_index: added
check_script: added
```

## Completed preview docs package

```text
docs/product/afg-bins-v1.md
docs/product/afg-persona-map-v1.md
docs/product/afg-user-lexicon-v1.md
docs/product/afg-proactive-trigger-contract-v1.md
docs/product/afg-meaning-ui-router-v1.md
docs/product/afg-event-receipts-v1.md
docs/product/afg-framework-freshness-contract-v1.md
```

## Package script change

Added:

```json
"check": "npm run build"
```

Reason:

```text
The repo already had build via Vite. The smallest safe verification path is to route check through the existing build command instead of introducing new tooling.
```

## Runtime refactor plan

Next runtime pass should be `AFG-RUNTIME-FOUNDATION-002`.

Allowed direction:

```text
split only the lowest-risk app shell boundaries
preserve existing visible behavior
preserve existing provider/model behavior
preserve existing storage behavior
preserve existing routes until explicitly replaced
```

Initial candidate boundaries to inspect before editing:

```text
App shell
navigation/page state
shared primitive components
Meaning UI docs-to-route mapping
existing Gemini service boundary
existing Hallberg math service boundary
```

## Blocked claims

```text
This pass does not refactor App.tsx.
This pass does not change runtime behavior.
This pass does not add UI.
This pass does not add schemas.
This pass does not add storage.
This pass does not add triggers.
This pass does not add model adapters.
This pass does not change Gemini behavior.
This pass does not call models.
This pass does not execute tools.
This pass does not sync AFG content to xi-io.net.
This pass does not claim framework compliance.
This pass does not claim EventAtom runtime support.
This pass does not claim FailureAtom runtime support.
```

## Verification notes

Connector verification performed:

```text
searched for existing AFG-RUNTIME-FOUNDATION-001 issue
fetched package.json
confirmed docs/product/README.md missing before pass
confirmed main matched 4708300e321beba700cd1420bedbcd91da031c9d before branch
created issue #96
created branch docs/afg-runtime-foundation-001
updated package.json
created docs/product/README.md
created this receipt
```

Local terminal verification was not run in this connector pass.

## Next safe pass

```text
AFG-RUNTIME-FOUNDATION-002
```

Required next-pass gate:

```text
Run or verify npm run check.
Inspect App.tsx before editing.
Create a narrow shell-split plan.
Do not change Gemini/provider behavior.
Do not add EventAtom or FailureAtom runtime yet.
```

## Remaining pass estimate

```text
1. AFG-RUNTIME-FOUNDATION-002
2. AFG-CODE-COMMENTS-001
3. AFG-UI-SLICE-001
4. AFG-FRAMEWORK-FRESHNESS-001
5. XIIO-FRESHNESS-AFG-001
6. AFG-COMPLIANCE-REVIEW-001
```
