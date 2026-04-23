# xi-io Ops Console Local Workflow Blueprint

## Why this document exists

The `xi-io.net` admin interface should become a private operations console that makes source, build, deploy, and sync state easier to understand than raw GitHub pages or terminal history.

This document locks in the first real local workflow model for that console.

Its job is to make these things plain:
- what states exist
- what each state means
- what is happening locally versus on GitHub versus on deployed sites
- what the first local automation layer should be
- how products graduate from `xi-io.com/<product>` into their own domains later

This blueprint is deliberately written in plain operational language.

---

# 1. Core model, the four project states

For each project, the ops console should treat these as separate states:

## State 1, GitHub
This is the cloud source state.

It answers:
- what the latest remote commit is
- what branch is current in the cloud
- whether local Aries is behind or ahead
- whether pull or push actions are needed

## State 2, Aries local source
This is the working source state.

It answers:
- what commit is checked out locally
- whether there are uncommitted changes
- whether the local build is stale
- whether the local repo matches GitHub or not

## State 3, Loki test or demo deploy
This is the staging or demo state.

It answers:
- what build is currently available for testing
- whether the test deploy matches Aries
- whether the test route is healthy
- whether a deploy is needed

## State 4, Loki live deploy
This is the real public release state, even if the traffic is still light.

It answers:
- what build is currently live
- whether live is behind test or behind Aries
- whether live is healthy
- whether live should remain untouched until promotion is intentional

This four-state model must stay visible in the UI.

---

# 2. Plain-language meaning of common actions

These actions should be explained in the UI in plain language.

## Fetch
Reads the latest GitHub state.
Does not modify local files.

## Pull
Updates the Aries local repo from GitHub.
This changes local source files.

## Build
Turns Aries source files into deployable output.
This creates or refreshes build output such as `dist/`.

## Deploy to test
Copies built files to the Loki test or demo path.
This changes the test site, not GitHub.

## Deploy to live
Copies built files to the Loki live path.
This changes the live site, not GitHub.

## Smoke test
Checks whether the deployed route is reachable and behaving plausibly.

The UI should always show which state is being affected by each action.

---

# 3. Locked product path strategy for now

Until dedicated product domains are ready, products should continue to live at:
- `xi-io.com/<product>`

Examples:
- `xi-io.com/afg`
- `xi-io.com/realitypools`

This is acceptable for the current phase.

The ops console must support a later graduation path where a project can move from:
- `xi-io.com/<product>`

to:
- a dedicated domain or subdomain

Examples:
- `afg.xi-io.com`
- `realitypools.xi-io.com`
- `productdomain.com`

The UI should eventually include a field or status for:
- current route
- intended future route
- graduation readiness

---

# 4. Locked local filesystem standard

Each domain should move toward this structure:

```text
<domain>/
  public/
  private/
  shared/
```

## Meaning

### `public/`
Publicly served files only.
This is the web root for that domain.

### `private/`
Not publicly served.
This is where project manifests, scripts, logs, and status snapshots should live.

### `shared/`
Optional shared templates, docs, or reusable site assets.

---

# 5. Locked `xi-io.net` operations structure

For the ops console specifically, use this structure:

```text
xi-io.net/
  public/
    index.html
    app.js
    styles.css
  private/
    manifests/
      projects.json
    scripts/
      check-status.sh
      build-project.sh
      deploy-test.sh
      deploy-live.sh
      smoke-test.sh
    status/
      combined.json
    logs/
```

This should be treated as the local operations backbone.

The public UI reads snapshot data.
The private scripts create and update that snapshot data.

---

# 6. Locked MVP purpose for the ops console

The first working version of the ops console should not try to be a full devops platform.

Its purpose should be:
- show the four states clearly
- show sync drift clearly
- show what action is needed next
- let the user copy or trigger safe commands
- reduce GitHub and deployment confusion

The MVP should focus on:
- AFG
- the ops console itself

That is enough to prove the model.

---

# 7. First manifest model

Each managed project should have a manifest entry.

Minimum fields:
- project id
- display name
- repo URL
- branch
- Aries local repo path
- Loki test deploy path
- Loki live deploy path
- build command
- deploy test command
- deploy live command
- test health URL
- live health URL
- current public route
- intended future route
- access posture

This manifest is the source of truth for what the console should check.

---

# 8. First script contract

The first important script is:
- `check-status.sh`

It should:
- read `projects.json`
- inspect GitHub state for each project
- inspect Aries local state for each project
- inspect Loki test deploy state for each project
- inspect Loki live deploy state for each project
- write one combined snapshot JSON file

Output target:
- `xi-io.net/private/status/combined.json`

The UI should read from that file.

This is the first real operations milestone.

---

# 9. What the UI should show for each project

For each project, the UI should show:

## GitHub state
- remote branch
- remote commit
- whether local is behind or ahead

## Aries state
- local branch
- local commit
- dirty or clean
- build timestamp if known

## Loki test state
- deployed commit
- deployed timestamp
- route health
- needs deploy or not

## Loki live state
- deployed commit
- deployed timestamp
- route health
- promotion status

## Action flags
- needs pull
- needs build
- needs deploy to test
- needs promote to live
- local dirty
- test stale
- live stale

This is the demystifying layer.

---

# 10. Locked security model

## For `xi-io.net`
Protect the whole domain with Cloudflare Access.
Do not rely on a public login page as the real security boundary.

## For `xi-io.com/<product>` app routes
Protect experimental or alpha routes with Cloudflare Access as needed.

## For app-level login
Do not build app auth first unless the product itself truly needs accounts and user sessions.

Edge protection first.
App auth later if required.

---

# 11. GitHub and dependency best-practice guidance in plain language

## GitHub
GitHub should be treated as the cloud source state.
It is where repo history and remote code state live.
It is not the deployed site by itself.

## Dependencies
Each project repo should keep its own dependencies in its own repo.
That is the cleanest and safest default.

That means:
- AFG repo has its own `package.json` and dependencies
- the ops console can have its own independent structure and dependencies if needed

Do not try to share one giant dependency pool across unrelated projects in the beginning.
That creates confusion and fragile builds.

---

# 12. Recommended progression from here

## Step 1
Lock in this blueprint.

## Step 2
Create the real `projects.json` manifest for AFG and the ops console.

## Step 3
Create the first real `check-status.sh` script contract and JSON output format.

## Step 4
Wire the public `xi-io.net` admin UI to the generated snapshot file instead of the current seed file.

## Step 5
Add build and deploy scripts after the status layer is trustworthy.

This is the most efficient and safest golden path.

---

# 13. Honest reminder

The first version of the ops console does not need to automate everything.
It needs to make reality visible.

If the UI clearly shows:
- what changed
- where it changed
- what action is needed next
- what state each environment is in

then it is already doing the most valuable part of its job.
