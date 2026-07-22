# Org Convention Overrides for Workflow Skills

This card bundles customized workflow skills that follow the Curation Labs engineering workflow. When any skill's hardcoded convention conflicts with `.ai/rules/`, the **rules win**.

## Conventions to use instead of skill defaults

### Document and plan paths
Use the `clNNNN_<slug>_<kind>.md` grammar from `.ai/rules/org-wide/06_issue_workflow.md`:
- Architecture docs → `.ai/analyses/clNNNN_<slug>_target_architecture.md`
- Task plans → `.ai/tasks/clNNNN_<slug>_task_plan.md`
- Completion docs → `.ai/tasks/clNNNN_<slug>_completion.md`

Do **NOT** use `docs/plans/YYYY-MM-DD-*` paths.

### Commit prefixes
Use the area-based prefix table from `.ai/rules/repo-wide/01_git_conventions.md` (e.g. `[studio-be]`, `[auth-hub]`, `[deploy]`).

Do **NOT** use `[type:component]` or `[feat:auth]` style prefixes.

### Test commands
Use the `pnpm <area>:test` commands from `.ai/rules/repo-wide/02_test_stack.md`.

Do **NOT** use `npm test` as the default test command.

### PR descriptions
Include the mandatory `Testing & CI evidence` section per GATE 3 requirements in `.ai/rules/org-wide/06_issue_workflow.md`.

### Worktree setup
Detect `pnpm-workspace.yaml` and run `pnpm install` (see `.ai/rules/repo-wide/02_test_stack.md` for the full command map).

### Project instructions file
Use `AGENTS.md` or `.ai/rules/` as the project instructions file.

Do **NOT** look for `CLAUDE.md`.

## Workflow alignment

These skills map onto the CL Issue-driven Workflow phases:

| Skill | Workflow phase |
|---|---|
| brainstorming | Architecting → GATE 1 |
| writing-plans | Planned → GATE 2 |
| executing-plans, subagent-driven-development | Building → GATE 3 |
| test-driven-development | TDD contract execution (all phases) |
| systematic-debugging | Investigation (any phase) |
| verification-before-completion | Evidence gates (GATE 2 + 3) |
| requesting-code-review, receiving-code-review | GATE 3 review |
| finishing-a-development-branch | Merged → Knowledge-captured |
| incremental-commits | All implementation phases |
