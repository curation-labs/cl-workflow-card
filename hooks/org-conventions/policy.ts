// ABOUTME: Tool-call policy for org-conventions.
// ABOUTME: Replace this stub with your enforcement or observer logic.

import { defineToolPolicy } from "darwinian/hook-policy";

export default defineToolPolicy({
  policyKind: "observer",
  async afterToolCall(event) {
    // event.runtime, event.phase, event.toolName, event.input, event.output, ...
  },
});
