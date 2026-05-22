# Active Work Checkpoint — AuDHD Field Guide

Status: refresh required before implementation
Last updated: 2026-05-22
Repo: `Vado42-chris/xi-io_AuDHD-field-guide`

## Current state

```yaml
repo_full_name: Vado42-chris/xi-io_AuDHD-field-guide
product_lane: audhd_field_guide
active_issue_or_sprint: refresh_required
active_branch: main
latest_known_safe_sha: 8da7edb7f27c924060524d660ccd3a8f237f20fa
latest_commit_seen: 8da7edb7f27c924060524d660ccd3a8f237f20fa
current_operator: Chris Hallberg
current_agent_or_chat: none_active_in_this_checkpoint
status: paused_refresh_required
verification_state: unknown_current_runtime_not_checked
```

## Purpose

This checkpoint preserves the Field Guide as an active xi-io product lane while preventing stale-context edits.

The repo should not be modified from older chat history. Any new work must begin with a fresh repo audit and an explicit next-slice plan.

## Known context to preserve

```text
AFG remains a product lane and donor/context source for xi-io support UX, privacy/trust language, local-first thinking, and ops-console planning.
AFG does not currently own xi-io.net control-plane truth.
Any old ops-console blueprint or draft PR must be treated as donor evidence until intentionally promoted into xi-io.net.
```

## Allowed next actions

```text
read-only repo audit
open issue/PR inventory
build/test command discovery
manifest readiness review
privacy/export/local-first boundary review
ops-console donor audit
next-slice proposal
```

## Blocked until refresh

```text
runtime code changes
UI refactors
dependency updates
provider/model integration
automation implementation
MCP implementation
cross-repo promotion without donor audit
```

## Next safe action

```text
Run an AFG refresh audit and produce:
- current branch and latest remote SHA
- open PRs and issues
- current build/test status
- product readiness state
- donor artifacts worth promoting to xi-io.net
- next one-slice recommendation
```

## Handoff rule

Any agent resuming this repo must first report current repo state from GitHub and local checkout evidence. Do not rely on previous chat history as authority.
