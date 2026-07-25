# Org Convention Overrides for Workflow Skills

This card bundles customized workflow skills that follow the Curation Labs engineering workflow. Repository-specific paths, commands, and conventions come from `.ai/rules/`; the workflow state contract below is the minimum supported version.

## CL Issue-driven Workflow v0.4 contract

The Issue Tracker holds two independent operational truths:

- **Owner Status** records the Owner's current execution phase. The Owner may advance downstream work while an earlier gate awaits review.
- **Reviewer Status** records only the earliest ready, unapproved gate. Gates remain ordered G1 → G2 → G3.

When a review passes, record that gate as passed and surface the next ready, unapproved gate. When changes are requested, remove the gate from the reviewer queue and return Owner Status to Architecting for G1, Planning for G2, or Building for G3.

Whenever either status changes, the person making the change completes one atomic Notion transaction:

1. Update the Issue Tracker property.
2. Update the issue page's **Issue Status** table.
3. Add the newest-first **Issue Thread** entry with timestamp, event label, one-line title, evidence, and next action. Review and handoff events include from → to. A `📝 Decision` entry records the decision only: do not tag a reviewer or imply a handoff. Stack every entry immediately below the `📖 Issue Thread conventions` toggle; do not place entries above the conventions.

Slack may alert the next person, but it is not workflow state. Do not prescribe the legacy `Turn`, `Status = Received`, or `Handoff` mechanism.

If `.ai/rules/org-wide/06_issue_workflow.md` still prescribes the legacy model, report workflow-rule drift before mutating issue state. Do not silently mix v0.3 and v0.4.

### Issue identity

The Issue Tracker generates the canonical number:

1. Create the issue row.
2. Read its generated **ID** property.
3. Rewrite the title as `[I<N>] <title>` (for example, `[I102] Update workflow card`).
4. Use that number for branch names, PR titles, Slack threads, and zero-padded `clNNNN_` document names.

Do not guess or preallocate an issue number, and do not create downstream artifacts before reading the generated ID.

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

These mappings describe Owner execution. They do not imply that an earlier review must finish before downstream Owner work can begin. Approval and merge order remain strict even when work is stacked.
