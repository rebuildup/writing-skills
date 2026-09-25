# Agent Instructions

## Purpose

This repository is the canonical source for reusable writing-oriented Agent Skills.

Keep the root contract concise. Detailed writing behavior belongs in `skills/` and is loaded only when relevant.

## Canonical behavior

- For persistent or reader-facing prose, use `skills/writing-discipline/SKILL.md`.
- Treat conversation, investigation, execution history, and raw tool output as working context, not as prose to serialize.
- Preserve the meaning of an existing Skill when moving, splitting, or refining it. Do not silently drop normative rules.
- Specialized Skills may refine a writing task, but must not weaken repository-wide foundation rules without an explicit decision.

## Repository workflow

- `main` is released / integrated state.
- Active work targets a `release-x-y-z` branch.
- One top-level Issue maps to one number-only ticket branch and one ticket PR.
- Publish a Draft PR after the first meaningful ticket commit.
- Do not merge, land, enable auto-merge, or perform an equivalent integration action without explicit user authorization for the identified PR or bounded PR set.

## Writing changes

Before finalizing reader-facing text:

1. Select the audience, purpose, and necessary communicative content.
2. Compose in the reader's order of understanding.
3. Reread the whole artifact without relying on task or conversation memory.

Prefer deletion, reordering, and rewriting over appending explanations to a structurally weak draft.

## Language

- Source-like identifiers and commit messages: English.
- Internal development documentation and GitHub Issue / PR discussion: Japanese by default.
- Public-facing documentation may use the language appropriate to its audience.

## Temporary material

Use `.tmp/` for transient investigation / verification output and `.reference/` for temporary external reference repositories. Neither is canonical project state.


## Constitution / operating profile

- 最上位 contract: [`constitution/CONSTITUTION.md`](constitution/CONSTITUTION.md)
- current Operating Model: [`organization/profiles/release-driven-solo.md`](organization/profiles/release-driven-solo.md)
- repository自身の `skills/` は published source、imported project-init Skills は project-local development dependency として分離する。
