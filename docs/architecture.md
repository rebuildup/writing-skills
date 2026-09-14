# Architecture

`writing-skills` is the canonical source for reusable Agent Skills that improve an agent's writing judgment. This document describes the Skill taxonomy, the repository's source-of-truth model, and the precedence rules used when conventions conflict.

## Skill taxonomy

Skills live under two roots:

| Root | Purpose | Naming |
| --- | --- | --- |
| `skills/` | First-class Skills. Each one solves a recurring writing problem. | `<skill-name>/SKILL.md` |
| `templates/` | Skeleton / starter Skills. Promote to `skills/` after research + trial. | `<skill-name>/SKILL.md` |

Each `SKILL.md` has YAML frontmatter with `name` (must equal the directory name) and `description` (must start with `Use when` or `Use this when`). The structural minimum is enforced by `scripts/validate-skills.mjs`; the substantive rules live in `skills/skill-authoring/SKILL.md`.

Foundation rules live in `skills/writing-discipline/SKILL.md`. Specialized Skills must refine a writing problem; they must not silently weaken foundation rules.

## Progressive disclosure

Skills are designed to be loaded on demand. The agent does not read every Skill up front; it loads one when the description matches the current task.

Conventions that make this work:

1. Each `description` is the activation condition. It must let an agent decide from the trigger phrase alone.
2. Each Skill keeps its minimum useful form. Optional sections (`## Examples`, `## Variants`, `## References`, etc.) appear only when repeated use has earned them.
3. Heavy source material goes under `references/` inside the Skill directory, never inline, and is opened at runtime.

## Source-of-truth model

| State | Canonical location |
| --- | --- |
| Released / integrated source | `main` branch on GitHub |
| Active sprint integration | `release-x-y-z` branch on GitHub |
| Ticket / priority / dependency / status | GitHub Issues and Projects |
| Ticket implementation review | Pull Requests |
| Repository workflow / agent contract | This repository's tracked documentation |

Conversation history, native session IDs, and local-only files are not canonical. They are transient optimizations.

## Decision precedence

When a writing or workflow judgment has multiple plausible answers, use this order:

1. Canonical foundation: `skills/writing-discipline/SKILL.md` for prose, this document and `docs/release.md` for workflow.
2. Project conventions visible in multiple existing Skills (single-file findings are not convention).
3. Current official guidance from the artifact / platform the Skill targets.
4. Established ecosystem convention.
5. Author preference — never introduced silently; only as an explicit decision.

Higher-precedence rules can be overridden only by an explicit, recorded decision in the relevant canonical artifact (Issue, ADR, or this document).

## Boundaries

`writing-skills` does not own:

- Domain-specific writing content (research papers, marketing copy, legal text, etc.) — only the Skills that improve the agent's judgment when producing such content.
- The `design-skills` repo's authoring Skill; we reference it as prior art but do not duplicate it.
- Runtime / supervisor / sandbox concerns — those belong to the consumer of these Skills, not to this repository.