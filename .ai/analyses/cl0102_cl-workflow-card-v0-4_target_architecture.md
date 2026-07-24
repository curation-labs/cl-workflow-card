# #102 — cl-workflow-card v0.4 target architecture

## Objective

Make the workflow card enforce the minimum CL Issue-driven Workflow v0.4 state contract across supported agents without duplicating the full handbook.

## Source-of-truth boundaries

- Notion holds Owner Status, Reviewer Status, the Issue Status table, and the Issue Thread.
- Repository `.ai/rules/` hold detailed, repo-specific paths and commands.
- This card pins the minimum workflow-state version and injects it through instructions, the runtime hook, and phase-specific skills.
- The v0.4 Notion HTML reader remains the full human-facing reference.

## Design

1. Add the compact v0.4 invariant set to `instructions.md`.
2. Inject the same invariant set from `hooks/org-conventions/policy.ts`.
3. Add only phase-relevant state guidance to G1, G2, execution, review, and completion skills.
4. Detect stale repository rules and report drift instead of silently mixing v0.3 and v0.4.
5. Add contract tests and bump the card to v1.1.0.

## Invariants

- An issue's generated ID is read back and applied to its title as `[I<N>] <title>` before downstream artifacts are created.
- Owner Status may advance while an earlier gate awaits review.
- Reviewer Status exposes only the earliest ready, unapproved gate.
- Approval and merge order remains G1 → G2 → G3.
- A pass surfaces the next ready gate; changes requested remove the review item and return Owner Status to the gate-appropriate phase.
- Every state change updates the tracker property, Issue Status table, and Issue Thread together.
- Slack is an alert, not workflow state.
- The card does not prescribe Turn, Received, or Handoff.

## Test intent

Contract tests must fail if independent statuses, current-gate ordering, the three-part Notion update, or Slack alert-only semantics disappear. Existing manifest, skill-content, hook, and functional suites must remain green.

## Release boundary

The branch and draft PR may proceed before workflow ratification. Publishing v1.1.0 remains blocked until CL Issue-driven Workflow v0.4 is approved.
