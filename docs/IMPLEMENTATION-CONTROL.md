# MR control = implementation control (not code)

## Context

Code is increasingly written by **AI**. Before the MR there may be a Jira ticket, spec, or handoff—but **during** the task you get discoveries, pivots, and architecture calls. The diff only shows the **end state**.

Human MR review should validate **implementation** (story + decisions + delivered scope), not re-read code for style—that is Guardrails. The brief’s **`humanValidation`** block (correct signals, red flags, quick checks) plus **traceability roll-up** is the primary “did we build the right thing?” surface.

| Layer | Owner | Question |
|-------|--------|----------|
| Code quality | Guardrails agent | Bugs, security, rules? |
| **Implementation** | Human + **Change Brief** | Planned X, happened Y, decided Z—does that explain what merged? |

## Global, not file-by-file

- **Global:** capabilities, services, contracts, data, deploy.
- **Specific anchors only when helpful** (migration name, public API path)—not a 80-file list.

## Living input vs PR snapshot

1. **Baseline** — what we understood at start (ticket/spec/plan).
2. **Chronicle** — discovery → decision → consequence during work.
3. **PR snapshot** — brief tied to `workSource` + `headSha` at review time.

**Durable for humans:** published on **GitHub PR** (pinned comment + neutral check). Optional mirror URL.

See [`FORMAT.md`](FORMAT.md) and [`WORK-SOURCES.md`](WORK-SOURCES.md).
