# #102 — cl-workflow-card v0.4 task plan

## Implementation

1. Add failing v0.4 contract assertions.
2. Update instructions and hook context with the compact state model.
3. Add phase-specific guidance to the relevant workflow skills.
4. Update card metadata and maintenance documentation.
5. Run contract and full test suites.
6. Open a draft PR linked to #102 and the v0.4 proposal.

## Testing strategy (TDD contract)

### Behaviors & invariants

- Tracker-generated IDs are read back and applied to issue titles as `[I<N>] <title>`.
- Independent Owner Status and Reviewer Status are explicit.
- Only the earliest ready, unapproved gate is actionable.
- Passed and changes-requested outcomes set Owner Status to Received while advancing or removing the correct Reviewer Status.
- Received is an Owner alert/inbox that the Owner acknowledges into the gate-appropriate execution phase.
- State changes require all three Notion surfaces, with thread entries stacked newest-first immediately below `📖 Issue Thread conventions`.
- Decision threads do not tag a reviewer or imply a handoff.
- Slack is alert-only.
- Legacy Turn/Handoff instructions and v0.3 Received handoffs do not return.

### Layer ownership (unit / integration / smoke / E2E)

- Node contract tests inspect the card's durable instruction and hook surfaces.
- Existing hook tests verify injected context structure.
- Existing functional tests cover materialization and runtime hook execution.
- No browser E2E is needed because this change contains no UI or network behavior.

### TDD sequence (ordered red → green increments)

1. Add version and workflow-contract assertions.
2. Observe failures against v1.0.1 content.
3. Update the smallest instruction and hook surfaces needed to pass.
4. Add phase guidance and documentation.
5. Run the full suite to detect regressions.

### Case catalog

- New tracker row receives ID 102 and is retitled `[I102] <title>`.
- An agent attempts to guess an issue number before row creation.
- Owner work ahead of review.
- Multiple ready downstream artifacts with only the earliest gate current.
- Passed gate advances review.
- Passed or changes-requested review sets Owner Status to Received.
- Owner acknowledges Received into the gate-appropriate phase.
- Changes requested remove the gate from the reviewer queue until resubmission.
- State update missing one of the three Notion surfaces.
- Issue Thread entry placed above or away from `📖 Issue Thread conventions`.
- Decision entry incorrectly tags a reviewer.
- Slack text mistakenly treated as state.
- Stale v0.3 repository rule detected.

### Harness, fixtures & test data

Tests use Node's built-in test runner and repository text fixtures. No external services or mutable test data are required.

### Commands & environment

```bash
npm run test:contract
npm test
npm run test:all
```

Node.js is the only prerequisite for the unit and contract suites. Functional tests may additionally require the local `drwn` development environment.

### Required CI jobs / definition of green

All repository tests must pass. If environment-dependent functional checks are unavailable, the PR must distinguish unavailable infrastructure from product failures and record the residual risk.

### Non-goals, manual checks & residual risk

- This PR does not publish v1.1.0.
- This PR does not update every consumer repository's `.ai/rules/`.
- Hook text changes require consumers to re-trust the card.
- Manual review must confirm the compact contract matches the v0.4 Notion reader.
