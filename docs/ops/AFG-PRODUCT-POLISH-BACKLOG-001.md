# AFG-PRODUCT-POLISH-BACKLOG-001

Decision value: `AFG_PRODUCT_POLISH_BACKLOG_STARTED`

## Purpose

Track visible unfinished or unprofessional product gaps separately from the export wording compliance issue.

## Current completed polish

```text
AFG-UI-POLISH-001: Help Now route copy and layout polished
PR: #124
merge commit: b4ab4b1bbf19676f2320d0a57ce3da064891becd
```

## Known tracked compliance debt

```text
#121 AFG-COMPLIANCE-FIX-001: Correct vault export wording
```

This issue remains important, but it must not block unrelated product polish and route completion work.

## Immediate product gaps

### 1. Sidebar route coverage

The sidebar exposes routes that need either real route bodies or explicit disabled/coming-soon treatment.

Observed sidebar entries:

```text
Control Center
Help Now
Diagnostic Lab
Somatic Lexicon
Neural Relay
Timeline
Survival Intel
Calibration
```

Observed route bodies already present:

```text
Control Center
Help Now
Provisioning
Diagnostic Lab
Physician Trace / Report
Timeline
Neural Relay
Calibration
```

Priority gap:

```text
Somatic Lexicon route body
Survival Intel route body
```

### 2. Settings professionalism

Settings still mixes real controls, placeholder lexicon choices, wipe action, and export wording. It needs a safer information hierarchy and clearer destructive-action treatment.

### 3. Coach input maturity

Neural Relay still uses a single enter-to-send input. It needs a more deliberate composer, visible send control, and draft-safe behavior before it feels professional.

### 4. Report surface clarity

Physician Trace is visually strong, but it needs clearer language separation between experimental/self-tracking output and clinical-use language before wider release.

### 5. Route enum cleanup

Help Now currently uses a local typed route constant because a clean Page enum update was blocked during the cloud pass. Replace with a real enum value when connector/local editing is safe.

## Non-goals for this backlog

```text
no private data sync
no EventAtom runtime claim
no FailureAtom runtime claim
no framework compliance claim
no encryption implementation
```

## Recommended next pass

```text
AFG-NAV-COVERAGE-001: add or explicitly handle Somatic Lexicon and Survival Intel route bodies
```
