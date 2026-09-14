# Recovery

A fresh agent must be able to reconstruct the state of this repository from durable, canonical sources — without relying on prior conversation, native session IDs, or local-only state. This document specifies the durable sources, the failure model, and the reconstruction procedure.

## Durable sources (priority order)

When state is uncertain, read them in this order:

1. GitHub Issues and Projects — ticket scope, dependency, status, target release, assignee, labels.
2. `release-x-y-z` branch — current sprint trunk.
3. Ticket branches and their remote commit graph — implementation state, including remote head SHA.
5. Draft / Ready PRs — review state, validation state, base / target release / stack relation.
6. Repository-controlled documentation — `AGENTS.md`, `CONTRIBUTING.md`, this directory.
7. Commit history — the canonical record of what was integrated into `main`.
8. Repository-tracked structured checkpoints (when present in the Issue body or PR description).

Sources not in this list — conversation history, native session IDs, supervisor local databases, shell history, IDE state — are transient optimizations. They may speed recovery; they may not be the only path.

## Failure model

A recovery plan must handle, at minimum:

- Model / session context exhaustion.
- Agent process crash or restart.
- Parent agent loss while a child continues.
- Sandbox / container / VM recreation.
- Host reboot.
- Transient network / API provider failure.
- Provider-side state loss for non-durable checkpoints.

If your environment also faces machine loss or provider loss, define additional RPO / RTO targets above this baseline.

## Soft vs hard checkpoint

A **soft checkpoint** lives in the same host or sandbox where the agent runs: filesystem snapshots, supervisor journals, native session state. Useful for fast recovery; insufficient if the sandbox is gone.

A **hard checkpoint** survives sandbox / provider loss. For durable ticket work, the hard checkpoint boundary is:

- A recorded commit exists on the canonical remote.
- The remote head identity for that branch is known.
- A Draft PR exists, with current metadata (labels, reviewers, linked Issue, target release, stack context).

Until all three hold, the ticket's work state is not durable. Repair the surface before continuing.

A release branch with zero diff against `main` is the only state in which a Draft release PR is not required. The moment the first meaningful integrated difference appears, a Draft release PR is required for the release surface to be durable.

## Checkpoint triggers

Capture a checkpoint at the start and end of each:

- Meaningful implementation milestone.
- Risky refactor or migration.
- Child agent spawn and child result integration.
- Long validation run.
- External side effect (publishing a Skill to a registry, opening a release PR, merging a release).
- Provider TTL or shutdown approaching.
- Graceful cancellation / shutdown signal.
- Context-window limit approaching.

Do not checkpoint every edit; checkpoint at the boundary that lets a fresh agent pick up without losing more than a single meaningful milestone.

## Structured recovery checkpoint

When a checkpoint must be captured in text, use the following minimal schema:

```
schema_version
issue_id
target_release
ticket_branch
pr_number
immediate_pr_base
predecessor_issue_or_pr
predecessor_sha
base_sha
checkpoint_sha_or_snapshot
execution_generation
status
completed_steps
next_steps
pending_validation
active_children
integrated_child_results
external_side_effects
blockers
decision_refs
artifact_refs
updated_at
```

Do not store secrets, machine-specific absolute paths, or private reasoning. A fresh agent must be able to act on the checkpoint without learning anything that is not in the canonical repository state.

## Recovery procedure for a fresh agent

1. Identify the active `release-x-y-z` from the GitHub Projects board or from `git ls-remote origin 'refs/heads/release-*'`.
2. Identify every durable ticket branch (`refs/heads/<issue-number>`) and its remote head SHA.
3. For each ticket branch:
   - Confirm a Draft or Ready PR exists, with current metadata.
   - Confirm the remote head SHA matches the local commit at the head of the working copy.
   - Read the latest checkpoint, if one is recorded in the Issue body or PR description.
4. Identify any active child agents via the supervisor's child registry (if available). Classify each as running, completed, failed, or orphaned.
5. Read this document, `docs/release.md`, and the foundation Skills (`skills/writing-discipline/SKILL.md`, `skills/skill-authoring/SKILL.md`) before resuming implementation work.
6. Resume work at the latest recorded `next_steps` for each branch. Do not trust the conversation log.
7. After resuming, run the validator (`node scripts/validate-skills.mjs`) and any CI checks for the affected branch. Treat their output as the ground truth for the current state.

## Parent / child split-brain prevention

If a parent agent is lost while a child continues:

- Children are owned by the supervisor, not the parent. Do not cancel them on parent loss if they are safe.
- When the parent recovers, it re-derives child state from the supervisor's registry.
- A recovered parent refuses to integrate a child result whose `execution_generation` does not match the latest recorded one.
- Heartbeat loss alone is not grounds to re-run an external side effect. Confirm the actual remote effect before retrying.

## Recovery drill

This repository's owner should periodically:

1. Pick an active ticket branch.
2. Capture a checkpoint.
3. Discard the local working tree.
4. Reconstruct the branch state from GitHub Issues, the remote commit graph, the PR metadata, and the checkpoint.
5. Resume work and produce a single non-trivial change.
6. Confirm no duplicate mutation has occurred.

If any step fails, update this document or the surrounding workflow until it passes.