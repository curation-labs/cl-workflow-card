// ABOUTME: Contract tests for the CL Issue-driven Workflow v0.4 state model.
// ABOUTME: Prevents the workflow card from regressing to the legacy Turn/Received/Handoff model.

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CARD_ROOT } from "./helpers.mjs";

const instructions = readFileSync(join(CARD_ROOT, "instructions.md"), "utf8");
const policy = readFileSync(
  join(CARD_ROOT, "hooks", "org-conventions", "policy.ts"),
  "utf8",
);
const contractSurface = `${instructions}\n${policy}`;

describe("workflow v0.4 minimum contract", () => {
  it("derives the issue title from the generated ID", () => {
    assert.match(contractSurface, /Create the issue row/);
    assert.match(contractSurface, /Read its generated \*\*ID\*\* property/);
    assert.match(contractSurface, /\[I<N>\] <title>/);
    assert.match(contractSurface, /Do not guess or preallocate an issue number/);
  });

  it("separates Owner Status from Reviewer Status", () => {
    assert.match(contractSurface, /Owner Status and Reviewer Status (?:move|advance) independently/);
    assert.match(contractSurface, /Owner (?:may|work may) advance/);
  });

  it("keeps only the earliest ready gate actionable", () => {
    assert.match(contractSurface, /earliest ready, unapproved gate/);
    assert.match(contractSurface, /G1 (?:→|->) G2 (?:→|->) G3/);
  });

  it("defines pass and changes-requested outcomes", () => {
    assert.match(contractSurface, /review passes[\s\S]*next ready, unapproved gate/i);
    assert.match(contractSurface, /changes are requested[\s\S]*remove the gate from the reviewer queue/i);
    assert.match(contractSurface, /Architecting for G1, Planning for G2, or Building for G3/);
  });

  it("requires the complete Notion state-change transaction", () => {
    for (const required of [
      "Issue Tracker property",
      "Issue Status",
      "Issue Thread",
    ]) {
      assert.ok(contractSurface.includes(required), `missing ${required}`);
    }
  });

  it("stacks Issue Thread entries below the conventions toggle", () => {
    assert.match(contractSurface, /📖 Issue Thread conventions/);
    assert.match(contractSurface, /stack (?:every )?(?:entry|entries) immediately below/i);
  });

  it("treats Slack as an alert rather than workflow state", () => {
    assert.match(contractSurface, /Slack (?:may alert|is an alert channel)/);
    assert.match(contractSurface, /not workflow state/);
  });

  it("rejects legacy state mutation instructions", () => {
    assert.doesNotMatch(contractSurface, /Set (?:the )?Turn/);
    assert.doesNotMatch(contractSurface, /Set Status = Received/);
    assert.doesNotMatch(contractSurface, /Handoff = Received/);
  });
});
