# Release process

How a release moves from `main` through a weekly sprint to `main` again, with the merge-authorization boundary made explicit.

## Cadence

One sprint = one target release version = one release branch.

- Sprint window: one week, by default. Out-of-cycle releases are allowed only when the release scope or date is explicitly decided (e.g., a critical advisory patch).
- Release branch name: `release-<major>-<minor>-<patch>` — only digits and dashes. The branch is the canonical sprint integration trunk.
- The release branch is created from `main` at sprint start.

## Source-of-truth split

| State | Lives in |
| --- | --- |
| Released / integrated code | `main` |
| Sprint trunk | `release-x-y-z` |
| Ticket scope / dependency / status | GitHub Issues |
| Ticket integration review | Pull Requests |

Native conversation history, local-only files, and supervisor-only databases are not canonical. They are recovery hints, not state.

## `main` is protected

`main` is the released state of the repository. It is protected for a public repository:

- Direct push, web edit, force push, and branch deletion are blocked.
- Pull requests are required, with at least one approving review.
- Linear history is enforced.
- Stale approvals are dismissed on new push.
- Conversation resolution is required.
- Admins are not exempt (`enforce_admins: true`).
- The only path to `main` is a release PR `release-x-y-z -> main`. A required CI check (`release-source-check.yml`) verifies `base == main && head matches release-*` on every PR to `main`.

If a change must bypass the release path (for example, an emergency advisory patch), open a new Issue, decide the release scope and date explicitly, and create a new `release-x-y-z` branch from the latest `main`. There is no other way.

## Ticket lifecycle

One top-level Issue maps to one durable ticket branch and one ticket PR.

```
Issue ──► Branch (Issue number) ──► PR (Draft → Ready)
```

Branch creation, first meaningful commit, canonical remote publish, remote head SHA verification, and Draft PR creation are one inseparable start procedure. A branch that has no remote head and no Draft PR is not a valid implementation surface — repair it before continuing.

## Independent vs. stacked PR

Independent ticket PRs target the active `release-x-y-z` branch directly:

```
main
└─ release-0-2-0
   ├─ 123
   └─ 124
```

Same-release linear hard dependency allows the dependent PR to stack on the immediate predecessor branch:

```
main
└─ release-0-2-0
   └─ 123
      └─ 124
         └─ 125
```

Stack rules:

- Same release, same repository, real hard dependency, ordered chain, reviewable immutable predecessor.
- Stacked members share the same `release-x-y-z` trunk.
- An Issue is not split across multiple durable PRs to fit a stack.
- A dependent branch can start as soon as the predecessor has a reviewable immutable commit, even before the predecessor merges.
- After a predecessor review changes the predecessor SHA, downstream branches must be revalidated against the new SHA. Old green results do not carry forward.

## Draft → Ready

A PR is moved from Draft to Ready only when all of the following hold:

- Acceptance criteria implemented.
- Current SHA passes the ticket integration gate (Skill validation, CI checks).
- Blocking issues resolved or explicitly scoped out.
- PR description, assignee, labels, reviewer metadata match current state.
- Required reviewer requested, or absence of meaningful reviewers documented in the PR body.
- Target release branch or immediate predecessor is fresh; conflicts handled.
- Latest durable checkpoint and branch state are consistent.

## Merge authorization boundary

A PR can be brought to ready-to-merge and validation can run autonomously. **Merge is not autonomous.**

The merge / squash / rebase / stacked landing / equivalent landing actions run only when the user explicitly asks for the identified PR or a clearly bounded set:

- "PR #N をマージして" / "Merge #N" — explicit, allowed.
- "対応して", "レビューして", "コンフリクトを解消して", "リリース準備して", "最後まで進めて" — not authorization. These describe work on the PR, not a merge instruction.
- Green CI, ready state, resolved reviews, approval — not authorization. They are prerequisites, not the instruction itself.

Authorization is bounded to the PR(s) named in the request. After authorization, if the head SHA, base, target release, or scope changes materially, re-confirm rather than reusing the old authorization.

## Release integration

When the sprint's tickets have landed on the release branch:

1. The release branch now has a meaningful diff against `main`. Open a Draft release PR `release-x-y-z -> main`. (A zero-diff release branch does not need a PR; the moment the first meaningful change lands, the PR is required.)
2. Set the Draft release PR's assignee, reviewer/CODEOWNERS, labels (`target-release:x-y-z`, `type:release-gate`), and a body that lists the included Issues / PRs, breaking changes, migration notes, validation results, and known limitations.
3. Run the release gate: full Skill validation on the release branch, required checks on the release PR, link integrity, cold-reader verification of any new or changed Skills against at least one real artifact.
4. Stop. Do not merge. Report the release PR, current head SHA, gate state, and remaining blockers.
5. On explicit merge authorization, merge the release PR. After the merge, `main` reflects the released version, and the version's Issues can be closed with reference to the merge commit.

## Done criteria for an Issue

An Issue is closed and moved to Done only when:

- Required CI / checks are green on the current landing candidate.
- Blocking reviews are resolved.
- The ticket changes have landed on the target release trunk (`release-x-y-z`).
- A merge commit on the release trunk is recorded in the Issue closure comment.
- The Project status is set to Done.

Stacked tickets reach Done only when their changes reach the target release trunk via contiguous stack landing, not when an intermediate predecessor merge alone completes. Closing keywords in a PR body alone are not sufficient for non-default-branch landings.

## Recovery summary

If context is lost mid-sprint:

1. Identify the active `release-x-y-z` branch.
2. Identify the active ticket branches and their remote head SHAs.
3. Identify the latest durable checkpoint for each branch.
4. Reconstruct the work state from GitHub Issues, the release branch commit graph, and the latest commit / branch state.
5. Continue from there. Do not trust conversation history or local-only state.

See `docs/recovery.md` for the full recovery model.