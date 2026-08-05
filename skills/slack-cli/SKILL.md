---
name: slack-cli
description: "Use when reading or posting to Slack — channels, threads, messages, files, or search. Wraps the authenticated `slack api` CLI (user token, posts as you). Use whenever the user mentions Slack, channels, threads, messages, reactions, or files in Slack."
---

# Slack Operations via the `slack` CLI

> **Org convention:** Curation Labs standardizes on the `slack` CLI (not a Slack MCP server) for all Slack operations. If a repo defines a channel allowlist or posting policy in `.ai/rules/`, those rules win over the defaults here — read the relevant rule file before posting.

## Overview

This skill drives Slack through the official `slack` developer CLI's `slack api <method>` subcommand, which calls any Slack Web API method. The CLI authenticates via a **user token** in the environment, so every operation happens as the token owner — messages appear from that person, not a bot.

## Prerequisites

1. **`slack` CLI on PATH** — the official Slack developer CLI (`slack --version` should print `v4.x`).
2. **`SLACK_USER_TOKEN` environment variable** — a `xoxp-…` user token. The CLI resolves it at **priority #4** of its token resolution order. Confirm it's set:
   ```bash
   echo "${SLACK_USER_TOKEN:?not set}"
   slack api auth.test   # must return ok:true with your user/team
   ```
   If `auth.test` fails, the token is missing, expired, or the app lacks the needed scope.

## Verified scope set

The token must carry these user scopes (verified against the CL app). If any operation fails with `missing_scope`, the app at `api.slack.com/apps` needs that scope added and the app reinstalled.

| Scope | Enables |
|---|---|
| `channels:read` + `channels:history` | Read public channels + messages + thread replies |
| `groups:history` | Read private channels (history) |
| `im:read` + `im:history` + `im:write` | DMs |
| `mpim:read` + `mpim:history` | Group DMs |
| `chat:write` | Post messages as you |
| `files:read` + `files:write` | Read and upload files |
| `users:read` | Resolve user IDs to names |
| `search:read` | Search messages and files workspace-wide |
| `reactions:write` | Add emoji reactions |
| `identify` | Base identity |

## Syntax convention (important)

`slack api` takes the method name as the first argument and parameters as **positional `key=value` pairs**:

```bash
slack api <method> key1=value1 key2=value2 ...
```

Do **NOT** use `--params`. This is wrong and returns nothing:

```bash
slack api conversations.history --params channel=C123,limit=10   # WRONG — empty output
slack api conversations.history channel=C123 limit=10            # CORRECT
```

Values with spaces need quoting: `text="hello world"`. For rich formatting (blocks, attachments), pass a single JSON string with `--json`.

All responses are JSON on stdout. Pipe through `python3 -m json.tool` or `jq` for readability. Errors return `{"ok":false,"error":"<reason>"}`.

## The five core patterns

### 1. Read a channel's messages

```bash
# List channels first to find the ID
slack api conversations.list limit=50 | python3 -m json.tool

# Read recent messages from a channel
slack api conversations.history channel=C066WN4CM37 limit=20 | python3 -m json.tool
```

Each message has a `ts` (timestamp, used as the ID) and `thread_ts` (equal to `ts` for the first message in a thread). `has_more: true` means older messages exist — page with `cursor=` (from `response_metadata.next_cursor`).

### 2. Read a thread's replies

```bash
# ts is the parent message's ts (the thread_ts)
slack api conversations.replies channel=C066WN4CM37 ts=1784304031.843329 | python3 -m json.tool
```

Returns the parent message plus all replies in order.

### 3. Post a message

```bash
# Simple text post
slack api chat.postMessage channel=C066WN4CM37 text="Deploy complete — see PR #142" | python3 -m json.tool

# Reply in a thread (thread_ts = parent message ts)
slack api chat.postMessage channel=C066WN4CM37 text="noted, shipping the fix" thread_ts=1784304031.843329 | python3 -m json.tool

# Rich formatting via blocks (use --json for a JSON body)
slack api chat.postMessage --json '{"channel":"C066WN4CM37","blocks":[...]}' | python3 -m json.tool
```

The response includes the posted message's `ts` and `permalink` — keep the `ts` if you may need to update or thread under it.

> **Posting policy:** a user token can only post where the token owner could post manually. Respect any repo-level `.ai/rules/` allowlist. Slack is an alert channel in the CL workflow, not a state store — do not encode workflow state in Slack messages (see `.ai/rules/org-wide/06_issue_workflow.md`).

### 4. Fetch a file's content

This is a **two-step** operation because file bytes live at a separate URL that needs Bearer auth — `slack api` returns metadata, then `curl` fetches the bytes.

```bash
# Step 1: get file metadata + the private download URL
slack api files.info file=F0BJ05FS50V | python3 -m json.tool
# → note url_private (and url_private_download) from the response

# Step 2: download the bytes with Bearer auth (NOT a slack api call)
curl -H "Authorization: Bearer $SLACK_USER_TOKEN" \
     -o downloaded.png \
     "https://files.slack.com/files-pri/T066ZL3DENN-F0BJ05FS50V/img_8781.png"
```

The `url_private` URL requires the `Authorization: Bearer <token>` header — it is not a public link and will return 401 without it. `url_private_download` is the "force download" variant. Both work with the same Bearer header.

To list files workspace-wide: `slack api files.list limit=20`.

### 5. Search messages and files

```bash
# Search messages (uses search:read)
slack api search.messages query="deploy failed" count=5 | python3 -m json.tool

# Search files
slack api search.files query="architecture" count=5 | python3 -m json.tool
```

Search supports Slack query modifiers: `from:U0827CMUG10`, `in:#channel`, `after:2026-07-01`, `has:link`. Example: `query="deploy in:#ops after:2026-08-01"`.

## Identity and workspace

- Operations run as the **token owner** (user `U0827CMUG10` in the Curation Labs workspace, `T066ZL3DENN`).
- The token's reach = whatever the owner can access. There is no separate "bot" identity in this model.
- To confirm identity at any time: `slack api auth.test`.

## Why CLI, not MCP

Curation Labs standardizes on the `slack` CLI for Slack operations. This gives one tool, one auth path, and one set of documented patterns — avoiding the auth fragmentation and inconsistent tool surfaces that come with per-app MCP servers. If you encounter a Slack MCP server declaration in another card, prefer this skill unless that card's owner has explicitly documented otherwise.
