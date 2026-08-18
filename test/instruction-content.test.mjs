// ABOUTME: Content tests for the instruction sections added in v1.4.0 (issue pages, SCQA, communication rules).
// ABOUTME: Pins the normative vocabulary so later edits cannot silently drop or weaken the three sections.

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CARD_ROOT } from "./helpers.mjs";

const instructions = readFileSync(join(CARD_ROOT, "instructions.md"), "utf8");

describe("issue Notion page management", () => {
  it("requires the four page-body elements", () => {
    for (const required of ["motivation", "core objectives", "target end state", "success criteria"]) {
      assert.ok(instructions.includes(required), `missing "${required}"`);
    }
  });

  it("ties success criteria to verification", () => {
    assert.match(instructions, /success criteria[\s\S]*?verified or tested/i);
  });

  it("prescribes toggles for incremental updates", () => {
    assert.match(instructions, /toggles[\s\S]*incremental progress updates/i);
  });

  it("allows the ntn API CLI", () => {
    assert.match(instructions, /`ntn` API CLI/);
  });
});

describe("SCQA issue and gap descriptions", () => {
  it("names all four SCQA elements", () => {
    for (const required of ["Situation", "Complication", "Question(s)", "Answer(s)"]) {
      assert.ok(instructions.includes(required), `missing SCQA element "${required}"`);
    }
  });

  it("allows multiple questions", () => {
    assert.match(instructions, /multiple questions are allowed/i);
  });

  it("requires pros/cons analysis on each option", () => {
    assert.match(instructions, /possible ways forward, each with a pros\/cons analysis/i);
  });

  it("scopes SCQA to decisions and discussions", () => {
    assert.match(instructions, /issue or gap that needs to be decided or discussed/i);
  });
});

describe("communication rules", () => {
  it("requires self-contained communication without jargon", () => {
    assert.match(instructions, /self-contained/i);
    assert.match(instructions, /Do \*\*NOT\*\* use unexplained jargon/);
  });

  it("requires context and architecture for thorough understanding", () => {
    assert.match(instructions, /all relevant context and architecture needed to understand/i);
  });

  it("bans ungrounded speculation", () => {
    assert.match(instructions, /Do \*\*NOT\*\* base assertions on ungrounded speculation/);
    assert.match(instructions, /articulate only from evidence/i);
  });
});
