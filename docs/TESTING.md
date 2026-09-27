# How to test Change Brief (F0)

No LLM or GitHub yet: validate the **JSON contract** and the **Markdown** a reviewer would see on the PR.

## Requirements

- Node ≥ 22
- `pnpm install` at `change-brief/` root

## Commands

```bash
cd change-brief

# Typecheck + golden test (JSON → MD === example-PROJ-1234.md)
pnpm check

# Validate a brief
pnpm change-brief validate templates/example-PROJ-1234.json

# Render to stdout
pnpm change-brief render templates/example-PROJ-1234.json

# Write to file (e.g. paste into a test PR)
pnpm change-brief render templates/example-PROJ-1234.json --out /tmp/brief.md
```

## Golden test

`test/golden/render.test.ts` compares renderer output to `templates/example-PROJ-1234.md`.

If you change `src/core/render/markdown.ts`:

1. Update `templates/example-PROJ-1234.json` if needed.
2. Regenerate golden:  
   `pnpm change-brief render templates/example-PROJ-1234.json --out templates/example-PROJ-1234.md`
3. Run `pnpm check`

## Your own brief

1. Copy `templates/example-PROJ-1234.json` → `my-brief.json`.
2. Edit fields (minimum: `workSource`, `mergeRequest`, chronicle, traceability) — **English only**.
3. `pnpm change-brief validate my-brief.json`
4. `pnpm change-brief render my-brief.json`

## F1 — chronicle + assemble + publish dry-run

```bash
# Append implementation event (writes .change-brief/chronicle.jsonl in cwd)
pnpm change-brief log --type discovery --what "Found gap" --decision "Split MR"

# Build brief JSON from mock fixtures + optional chronicle file
pnpm change-brief assemble --source jira --chronicle examples/mock-workspace/sample-repo/.change-brief/chronicle.jsonl --out /tmp/brief.json

# What Guardrails would post to GitHub (no network)
pnpm change-brief publish --dry-run --source jira --chronicle examples/mock-workspace/sample-repo/.change-brief/chronicle.jsonl
```

## Later phases

| Phase | How to test |
|-------|-------------|
| F1 | `change-brief generate` with local spec + `.change-brief/chronicle.jsonl` |
| F2 | Real GitHub PR: neutral "Change Brief" check + comment |
| F2 cost | `5.3-flash` via z.ai with installation API key |

Until F1, **no network**: valid JSON + good-looking MD means F2 only adds fetch + LLM + GitHub publish.

## Mock Jira + GitHub (recommended)

End-to-end **mock** of “ticket vs what shipped on the PR”:

```bash
pnpm mock:github                              # jira + spec scenarios
pnpm mock:github -- --source jira|spec
pnpm mock:github -- --write                   # fixtures/output/mock-jira-* and mock-spec-*
```

See [`MOCK-GITHUB-FLOW.md`](MOCK-GITHUB-FLOW.md).

## Full PR preview (Markdown + GitHub-style HTML)

```bash
pnpm preview
```

Opens paths under `examples/mock-workspace/preview/output/` — use IDE preview on `.md` or browser on `.html`.
