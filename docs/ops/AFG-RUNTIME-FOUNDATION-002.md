# AFG-RUNTIME-FOUNDATION-002

Decision value: `AFG_RUNTIME_SHELL_SPLIT_PLANNED_NOT_STARTED`

## Purpose

Plan the lowest-risk App shell split before editing runtime code.

This pass is planning-only because `npm run check` has not been verified in a local or CI environment.

## Current gate

```text
npm run check must pass before App.tsx is edited.
```

## Verified repo facts

```text
main_before_plan: ef2d63a1ea3808fad7fc83dd2abf6ff53c37d297
issue: #98
package_check_script: npm run build
App.tsx inspected: yes
App.tsx edited: no
```

## App.tsx observed responsibilities

```text
primitive UI components: MetaLabel, Panel, Button
icons: Icons object
formatted text rendering: FormattedText
telemetry sidebar: TelemetrySidebar
identity/localStorage state
responses/journal/u-units/thread state
computed Hallberg results and history trend
provision demo flow
vault export flow
Gemini coach send flow
navigation shell
page rendering
report view
coach view
settings view
```

## Lowest-risk split order

Do this only after `npm run check` passes.

```text
1. Move primitive UI only:
   App.tsx -> components/primitives.tsx
   Move: MetaLabel, Panel, Button
   Do not change props, classes, text, or behavior.

2. Move icons only:
   App.tsx -> components/icons.tsx
   Move: Icons object
   Do not change SVGs.

3. Move pure display helpers only:
   App.tsx -> components/FormattedText.tsx
   Move: FormattedText
   Do not change rendering rules.

4. Move telemetry display only:
   App.tsx -> components/TelemetrySidebar.tsx
   Move: TelemetrySidebar
   Keep props unchanged.

5. Stop and run npm run check.
```

## Do not move yet

```text
localStorage effects
identity state
responses state
lexicon state
threads state
handleSend
handleExportVault
provisionDemo
page branches
Gemini service calls
Hallberg math calls
```

Reason:

```text
These contain behavior, side effects, provider calls, storage, or page-state coupling.
```

## Blocked claims

```text
No runtime split has been implemented.
No App.tsx code has been changed.
No visible behavior has changed.
No provider/model behavior has changed.
No storage behavior has changed.
No EventAtom runtime exists.
No FailureAtom runtime exists.
No schema has been added.
No xi-io.net freshness sync has happened.
```

## Next safe action

```text
Run npm run check locally or in CI.
If it passes, start a code PR limited to steps 1-4 above.
If it fails, fix only the existing build failure before refactor.
```

## Remaining pass estimate

```text
1. AFG-RUNTIME-FOUNDATION-002-CODE
2. AFG-CODE-COMMENTS-001
3. AFG-UI-SLICE-001
4. AFG-FRAMEWORK-FRESHNESS-001
5. XIIO-FRESHNESS-AFG-001
6. AFG-COMPLIANCE-REVIEW-001
```
