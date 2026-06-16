# AFG-COMPLIANCE-REVIEW-001

Decision value: `AFG_COMPLIANCE_REVIEW_RECORDED_WITH_FINDINGS`

## Purpose

Record the compliance review after the runtime shell split, boundary comments, CI setup, and Help Now route skeleton.

## Reviewed scope

```text
repository: Vado42-chris/xi-io_AuDHD-field-guide
review issue: #120
review date: 2026-06-16
current main receipt: 1a9f42bdd6a386f0eb4192987d8582c95da90809
```

Reviewed areas:

```text
runtime shell split
extracted display components
boundary comments
Help Now route skeleton
coach/model call boundary
localStorage boundary
vault export wording
CI/check workflow
framework/x i-io.net boundary
```

## Completed work receipts

```text
AFG-RUNTIME-FOUNDATION-002-CODE-A: FormattedText split
AFG-RUNTIME-FOUNDATION-002-CODE-B: MetaLabel and Button split
AFG-RUNTIME-FOUNDATION-002-CODE-C: Icons split
AFG-RUNTIME-FOUNDATION-002-CODE-D: Panel split
AFG-RUNTIME-FOUNDATION-002-CODE-E: TelemetrySidebar split
AFG-CODE-COMMENTS-001: boundary comments
AFG-UI-SLICE-001: Help Now route skeleton
```

## CI status

The AFG `Check` workflow exists and was used as a merge gate for the recent runtime, comments, and Help Now PRs.

Status at review:

```text
npm run check available: yes
recent PRs merged only after Check success: yes
local terminal verification claimed: no
```

## Privacy and runtime findings

### Help Now skeleton

Status: pass with limitation.

The Help Now route is a static capture-first view. It uses an uncontrolled textarea and does not save, send, export, or add typed text to a thread in this pass.

Limitation:

```text
The Help Now route currently uses a local typed route constant in App.tsx because the cleaner Page enum change was blocked by connector safety checks after an earlier draft PR exposed unintended types.ts churn.
```

Required follow-up:

```text
Optionally replace the local typed route constant with a real Page enum value in a dedicated future pass when connector/local editing is safer.
```

### Coach / model call boundary

Status: pass for reviewed scope.

The reviewed passes did not move or change `handleSend`, Gemini service calls, grounding source display, thread persistence, or U-unit decrement behavior.

### localStorage boundary

Status: pass for reviewed scope.

The reviewed passes did not move or change localStorage reads or writes for identity, responses, lexicon, U-units, threads, or provisioning demo state.

### Vault export wording

Status: finding tracked.

Current implementation exports JSON. Current Settings button still says `Export Encrypted Vault`.

Tracked issue:

```text
#121 AFG-COMPLIANCE-FIX-001: Correct vault export wording
```

Required fix:

```text
Change user-facing wording so it does not claim encryption unless real encryption is implemented.
```

Current recommendation:

```text
Do not implement encryption in this pass.
Do not leave the wording mismatch unresolved before claiming compliance complete.
Fix wording in a dedicated micro-pass.
```

## Framework boundary findings

Status: pass with pending sync.

No EventAtom runtime, FailureAtom runtime, schema runtime, or xi-io.net sync was added by the reviewed AFG passes.

Required follow-up:

```text
XIIO-FRESHNESS-AFG-POSTREVIEW-001
```

Purpose:

```text
Update xi-io.net with public-safe AFG freshness metadata after #121 is fixed or explicitly marked as accepted pending debt.
```

## Blocked claims

Do not claim any of the following yet:

```text
vault export is encrypted
Help Now persists safely
Help Now creates event receipts
Help Now calls a model
EventAtom runtime exists
FailureAtom runtime exists
framework compliance is complete
xi-io.net is fresh after this review
```

## Required remaining work

```text
1. AFG-COMPLIANCE-FIX-001: correct vault export wording (#121)
2. XIIO-FRESHNESS-AFG-POSTREVIEW-001: update xi-io.net after #121
```

## Review status

```text
compliance review recorded: yes
blocking finding tracked: yes (#121)
compliance complete: no
framework freshness complete: no
```
