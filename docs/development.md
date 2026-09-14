# Development

How to work on this repository end to end. Read this from a fresh clone; nothing here depends on prior conversation.

## Prerequisites

- Git 2.40+ (worktrees, `switch`, ranged log)
- Node.js 20+ (for the Skill validation script)
- `gh` CLI authenticated against the `rebuildup` org
- A Skill-aware agent runtime (Claude Code with Skills enabled, or any runtime that consumes Skills via `bunx skills` / `npx skills`)

## Clone

```sh
git clone https://github.com/rebuildup/writing-skills.git
cd writing-skills
```

## Validate locally

```sh
node scripts/validate-skills.mjs
```

The validator checks every `SKILL.md` for valid YAML frontmatter, `name`/`description` keys, directory-name match, activation phrase, required `Scope` section, and broken internal links. The script exits non-zero on the first structural failure.

## Available Skills in this repository

| Skill | When to load |
| --- | --- |
| `skills/writing-discipline/SKILL.md` | Creating or editing any persistent or reader-facing prose. |
| `skills/skill-authoring/SKILL.md` | Promoting a writing problem into a first-class Skill. |
| `templates/minimal-skill/SKILL.md` | Skeleton to copy when starting a new Skill. |

Install into your local Skill runtime with:

```sh
bunx skills add rebuildup/writing-skills --skill writing-discipline
# or
npx skills add rebuildup/writing-skills --skill writing-discipline
```

## Issue / branch / PR workflow

The full workflow lives in `docs/release.md`. The short version:

1. Open a top-level Issue describing the problem, scope, acceptance criteria, and target release.
2. Create a branch named with the Issue number only (`123`).
3. Make the first meaningful commit, push to canonical remote, verify the remote head SHA matches.
4. Open a Draft PR targeting the active `release-x-y-z` branch.
5. Iterate with the validator above and CI checks.
6. Convert Draft → Ready when acceptance criteria are met and current-SHA validation is green.
8. **Stop.** Do not merge. Report the PR identity, current head SHA, gate state, and remaining blockers. Wait for explicit authorization.

## Adding a new Skill

1. Open an Issue describing the writing problem, audience, boundary, and target release.
2. Research before authoring. See `skills/skill-authoring/SKILL.md` §2 for the source priority per category.
3. Draft the Skill starting from `templates/minimal-skill/SKILL.md`. Keep it minimal.
4. Validate: `node scripts/validate-skills.mjs`.
5. Apply the Skill to at least one real artifact; rereading it from a cold-reader perspective.
6. Open a Draft PR. Promote to Ready only after CI green and cold-reader verification passes.

## Style conventions

- Source code, identifiers, commit messages: English.
- Internal documentation, GitHub Issues, PRs, review discussion: Japanese.
- Public README content: matches the audience's preferred language; this repo's README is Japanese because the audience is bilingual and Japanese is the default.
- Reader-facing prose follows `skills/writing-discipline/SKILL.md` without exception.

## What this repository does not do

- It does not run a server. There is no `npm run dev`.
- It does not build an artifact. CI validates Skills; nothing else is produced.
- It does not have a runtime. Skills are consumed by external agents; this repo is only their source.