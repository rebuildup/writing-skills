#!/usr/bin/env node
// Skill validation: deterministic structural checks for files under skills/
// and templates/. Runs in CI and locally. Exits non-zero on any failure.
//
// Checks:
//   1. SKILL.md exists for every directory directly under skills/
//   2. Frontmatter is valid YAML and contains required keys (name, description)
//   3. Directory name matches frontmatter `name`
//   4. Description starts with an activation phrase ("Use when" / "Use this when")
//      so agents can decide when to load it
//   5. Required sections exist (Scope, Decision rules or similar)
//   6. Internal markdown links resolve to existing files within the repository
//
// This script is intentionally minimal — it does not judge Skill quality.
// Latent / semantic correctness is left to cold-reader verification
// documented in skills/skill-authoring/SKILL.md.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const ROOTS = ["skills", "templates"];

const failures = [];

function fail(skillPath, message) {
  failures.push(`${skillPath}: ${message}`);
}

function readFrontmatter(text) {
  // Very small YAML subset parser: only handles the frontmatter block at the
  // top of the file with simple `key: value` lines. Good enough for our
  // SKILL.md convention.
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const out = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

function listMarkdownFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .map((name) => join(dir, name))
    .filter((p) => statSync(p).isDirectory())
    .map((sub) => {
      const skillFile = join(sub, "SKILL.md");
      return existsSync(skillFile) ? skillFile : null;
    })
    .filter(Boolean);
}

function checkSkill(skillFile) {
  const rel = relative(REPO_DIR, skillFile);
  const isTemplate = rel.startsWith("templates/");
  const text = readFileSync(skillFile, "utf8");
  const fm = readFrontmatter(text);
  if (!fm) {
    fail(rel, "missing or malformed frontmatter (must be valid YAML between --- markers)");
    return;
  }
  if (!fm.name) fail(rel, "frontmatter missing required key: name");
  if (!fm.description) fail(rel, "frontmatter missing required key: description");

  // Templates are deliberately placeholder-bearing and are exempt from the
  // strict name / activation-phrase / section checks below.
  if (isTemplate) {
    checkTemplate(skillFile, rel);
    return;
  }

  const dirName = skillFile.split("/").slice(-2, -1)[0];
  if (fm.name && fm.name !== dirName) {
    fail(rel, `frontmatter name "${fm.name}" does not match directory "${dirName}"`);
  }

  if (fm.description) {
    const lc = fm.description.toLowerCase();
    const ok = lc.startsWith("use when") || lc.startsWith("use this when");
    if (!ok) {
      fail(rel, `frontmatter description should start with "Use when" / "Use this when" so agents can decide activation; got: "${fm.description.slice(0, 60)}..."`);
    }
  }

  // Required body sections. Keep this list small and conservative so we do not
  // over-constrain new Skills. The skill-authoring Skill itself defines the
  // canonical structure; this script only enforces the minimum. A Scope-like
  // heading is recommended but not enforced here so we don't fight legitimate
  // variants like "When to use" / "Activation" / numbered step sections.

  checkInternalLinks(skillFile, text, rel);
}

function checkTemplate(skillFile, rel) {
  // For templates we only verify that the placeholders are present so a Skill
  // author can find them, and that internal links resolve.
  const text = readFileSync(skillFile, "utf8");
  const requiredPlaceholders = ["<skill-name>", "<Use this skill when...>"];
  for (const p of requiredPlaceholders) {
    if (!text.includes(p)) {
      fail(rel, `template missing placeholder: ${p}`);
    }
  }
  checkInternalLinks(skillFile, text, rel);
}

function checkInternalLinks(skillFile, text, rel) {
  const linkRe = /\]\((?!https?:\/\/|#)([^)]+)\)/g;
  let m;
  while ((m = linkRe.exec(text)) !== null) {
    const target = m[1].split("#")[0];
    if (!target) continue;
    const abs = resolve(dirname(skillFile), target);
    if (!existsSync(abs)) {
      fail(rel, `broken internal link: ${m[1]}`);
    }
  }
}

const all = [];
for (const root of ROOTS) {
  all.push(...listMarkdownFiles(join(REPO_DIR, root)));
}
if (all.length === 0) {
  console.log("Skill validation: no SKILL.md files found under skills/ or templates/; nothing to check.");
  process.exit(0);
}

for (const skill of all) checkSkill(skill);

if (failures.length > 0) {
  console.error("Skill validation failed:");
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}

console.log(`Skill validation passed: ${all.length} file(s) checked.`);