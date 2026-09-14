# Security

`writing-skills` ships Skills, not a runtime. The security boundary is therefore different from a typical application's: a compromised or malicious Skill can influence the agent that loads it, and the agent can in turn produce reader-facing artifacts that affect downstream systems. The Skill must be reviewed at the same severity as code, even though it is documentation.

## Threat model

| Risk | How it shows up here |
| --- | --- |
| Skill instructs agent to perform unsafe actions | Frontmatter description is too broad; activation phrase matches too many tasks. |
| Skill encodes a hidden payload in prose | Counter-example, footnote, or unicode trickery that an LLM-skim review can miss. |
| Skill leaks or smuggles credentials | Skill refers to local paths, environment variables, or copy-pasteable secrets. |
| Skill fabricates authority | Skill quotes a non-existent "official standard" as justification for a normative rule. |
| Skill blurs source boundaries | Skill copies a third-party text (license unknown) without attribution. |
| Supply chain | A Skill is added under a directory name that resembles a trusted Skill. |
| Main branch compromise | Direct push or ruleset bypass on the protected release path. |

The Skills themselves are code. Treat them with the same review rigor as code.

## Source priority for advisory intake

When new advisory or guidance becomes available, prioritize by severity first, then by reachability into this repository:

1. Official advisories from Skills / agent runtimes that load these files (Claude Code, MCP, ACP).
2. Official release notes from Skill distribution tooling (`bunx skills`, `npx skills`).
3. GitHub Security Advisories / Dependabot alerts for any tooling pinned by CI.
4. Ecosystem advisories for Node.js / GitHub Actions versions.
5. Trusted secondary reporting.

A meaningful advisory is converted into a GitHub Issue, assigned to the appropriate target release, and tracked to closure the same way a feature is. A critical exposed vulnerability may interrupt the current sprint in favor of a patch release; the patch is delivered through a new `release-x-y-z` branch and a release PR. `main` is never edited directly.

## Required checks for new and changed Skills

Before a Skill lands on a release trunk:

- The frontmatter `description` does not over-activate on tasks the Skill is not designed for.
- No third-party text is reproduced beyond what license and attribution permit. Sources beyond short quotes must be referenced by link.
- No instructions refer to absolute host paths, environment variables, secrets, or unverified external commands.
- No normative rule is presented as universal when it is one source's house style.
- `node scripts/validate-skills.mjs` passes for the Skill and its `references/`.
- A cold reader, given only the Skill and not the authoring conversation, can apply it without mis-activation.

## Release-time security checks

- `release-source-check.yml` is a required check on every PR to `main`; it confirms the head branch matches `release-*`.
- Linear history is enforced on `main`; merge commits and force pushes are blocked.
- Admins are not exempt from protection.
- The release PR body must list any advisories addressed in the release.

## Incident response

If a merged Skill is found to be unsafe:

1. Open a GitHub Issue tagged `security` and the appropriate target release.
2. If the risk is active in production Skill distributions, decide whether to interrupt the sprint. The default answer for an actively loaded unsafe Skill is yes.
4. Patch via a new `release-x-y-z` branch from `main`, not via direct `main` edit. The patch PR's head must match the active `release-*` pattern.
5. After merge, close the Issue with the merge commit reference.

## What this repository does not do

- It does not pin or distribute runtime dependencies. Consumers of these Skills are responsible for their runtime security.
- It does not store secrets. There are no `.env` files, tokens, or credentials in this repository.
- It does not have a private / non-public advisory channel. Use GitHub Issues with the `security` label.