# @curation-labs/workflow-skills

A Darwinian Minds card bundling 13 customized workflow skills that reference `.ai/rules/` for all conventions, plus a hook policy that enforces those conventions at runtime.

## What this is

This card adapts the upstream "Superpowers" workflow skills (from the `darwinian-minds` repo) to the Curation Labs engineering workflow. Each skill has been customized to **reference `.ai/rules/` for conventions** (paths, prefixes, commands) instead of hardcoding them. This means:

- **Conventions evolve fast** (every PR might tweak a path) → they live in each repo's `.ai/rules/`
- **Procedures evolve slowly** (the TDD cycle doesn't change) → they live in this card, versioned via `drwn`
- **No duplication** between the two layers

## Three-layer cross-agent enforcement

| Layer | Mechanism | Claude Code | Codex | Cursor | OpenCode |
|---|---|---|---|---|---|
| **1. Hook policy** (`additionalContext` on Skill PreToolUse) | Mechanical, per-turn, survives compaction | ✅ | ✅ | ❌ pre-tool | ❌ |
| **2. `instructions.md`** (card manifest, materialized to disk) | File all agents can read | ✅ | ✅ | ✅ | ✅ |
| **3. Customized skill content** | Each SKILL.md references `.ai/rules/` | ✅ | ✅ | ✅ | ✅ |

## Skills included

| Skill | Maps to workflow phase |
|---|---|
| brainstorming | Architecting → GATE 1 |
| writing-plans | Planned → GATE 2 |
| executing-plans | Building → GATE 3 |
| subagent-driven-development | Building → GATE 3 |
| finishing-a-development-branch | Merged → Knowledge-captured |
| using-git-worktrees | All phases (isolation) |
| dispatching-parallel-agents | All phases (fan-out) |
| test-driven-development | TDD contract execution |
| systematic-debugging | Investigation |
| verification-before-completion | Evidence gates (GATE 2+3) |
| requesting-code-review | GATE 3 review |
| receiving-code-review | GATE 3 review |
| incremental-commits | All implementation phases |

## Installation

### Prerequisites
- The `drwn` CLI installed and on PATH (from the `darwinian-minds` repo)
- A repo with `.ai/rules/` set up (org-wide + repo-wide tiers)

### Install in a project

```bash
# From the project root:
drwn use @curation-labs/cl-workflow-blueprint

# Trust the hook policy (required for Layer 1 enforcement):
drwn card trust @curation-labs/workflow-skills --hooks

# Materialize skills + hooks + instructions:
drwn write
```

### Link for local development

Since this card lives in a flat directory (`cl-workflow-skills/`, not `@curation-labs/workflow-skills/`), use individual linking instead of `--all-from`:

```bash
drwn card link @curation-labs/workflow-skills file:/Users/pureicis/dev/darwinian-cards/cl-workflow-skills
```

## Testing

```bash
cd ~/dev/darwinian-cards/cl-workflow-skills
node --test test/*.test.mjs
```

The test suite enforces:
- **card-contract.test.mjs** — card.json shape, skill list, upstream refs, hooks, instructions
- **skill-content.test.mjs** — no forbidden hardcoded conventions (docs/plans/, [type:component], superpowers:, CLAUDE.md, npm test)
- **hook-policy.test.mjs** — policy structure and additionalContext content

## Maintenance

See [docs/maintenance-runbook.md](docs/maintenance-runbook.md) for the upstream sync workflow and [docs/customization-decisions.md](docs/customization-decisions.md) for what changed vs upstream and why.
