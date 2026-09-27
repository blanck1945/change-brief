# Change Brief

**Implementation record** for merge requests when code is written by AI (or human+agent). Humans approve the **implementation story**—plan, discoveries, decisions, architecture, scope—not line-by-line code.

Complements [Guardrails](../codereview-ai/guardrails/) (code quality).

**English only** for docs, CLI, prompts, and rendered briefs (`.cursor/rules/english-only.mdc`).

**Baking required** in this repo (`strict: true`): implementation uses ROUTER + handoff + metrics. Read-only Q&A may gate-out.

| Layer | Validates |
|-------|-----------|
| **Change Brief (CBF)** | Ticket/spec alignment, plan vs reality, decisions, global scope |
| **Guardrails** | Bugs, security, style, repo rules |

- **Overview + GitHub:** [`docs/PROJECT-AND-GITHUB.md`](docs/PROJECT-AND-GITHUB.md)
- **GitLab (MR notes, preview):** [`docs/GITLAB.md`](docs/GITLAB.md)
- Concept: [`docs/IMPLEMENTATION-CONTROL.md`](docs/IMPLEMENTATION-CONTROL.md)
- Intake **Jira or spec**: [`docs/WORK-SOURCES.md`](docs/WORK-SOURCES.md)

## Artifacts

- [`docs/FORMAT.md`](docs/FORMAT.md) — **CBF** specification
- [`templates/change-brief.schema.json`](templates/change-brief.schema.json) — structured agent output
- [`templates/example-PROJ-1234.md`](templates/example-PROJ-1234.md) — rendered example
- [`prompts/generate-change-brief.md`](prompts/generate-change-brief.md) — generator instructions
- [`docs/TESTING.md`](docs/TESTING.md) — **how to test** (F0: `pnpm check`, validate, render)
- [`docs/MOCK-GITHUB-FLOW.md`](docs/MOCK-GITHUB-FLOW.md) — mock Jira + PR + implementation → GitHub comment
- Handoffs under `.cursor/handoff/`

## F0 status

Offline core: `pnpm check`, `change-brief validate|render`. See [`docs/TESTING.md`](docs/TESTING.md).

**Full PR preview (MD + GitHub-style HTML):** `pnpm preview` — [`examples/mock-workspace/README.md`](examples/mock-workspace/README.md)

## Next (F1+)

Resolve `workSource` + diff + chronicle on each PR `synchronize`; publish pinned comment + neutral check on GitHub.
