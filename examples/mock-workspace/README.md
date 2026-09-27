# Mock workspace — see Change Brief end-to-end

This folder is a **fake product repo** plus instructions. No Jira, GitHub, or LLM required.

## What you are simulating

```text
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│ Work source     │     │ AI + dev implement   │     │ GitHub PR           │
│ Jira OR spec    │ ──► │ (this sample-repo/)  │ ──► │ Change Brief comment│
└─────────────────┘     └──────────────────────┘     └─────────────────────┘
```

Today steps 1–2 are **fixtures + sample files**; step 3 is **`pnpm demo`** generating the PR comment Markdown.

## Integration tiers (simple / medium / complex)

Side-by-side demos: [`../integration-tiers/`](../integration-tiers/) · **`pnpm preview:all`** → [`../preview-all/output/index.html`](../preview-all/output/index.html)

## Quick start — full PR preview

From **`change-brief/`** root:

```bash
pnpm install
pnpm preview
```

| View | File |
|------|------|
| **PR + brief in Cursor** | `examples/mock-workspace/preview/output/pr-842-jira.md` → Markdown preview (Ctrl+Shift+V) |
| **GitHub-like in browser** | `preview/output/pr-842-jira.html` (same for `pr-901-spec.*`) |

Index: [`preview/output/README.md`](preview/output/README.md) (generated after `pnpm preview`).

Shorter run (comments only): `pnpm demo` → `fixtures/output/mock-*-pr-comment.md`

## Layout

| Path | Role |
|------|------|
| [`sample-repo/`](sample-repo/) | Fictional `billing-api` — spec doc, stub code, chronicle |
| [`scenarios/jira.md`](scenarios/jira.md) | Jira path explained |
| [`scenarios/spec.md`](scenarios/spec.md) | Spec path explained |
| Root `fixtures/` | Machine-readable mocks consumed by `mock-github` |

## Try one source only

```bash
pnpm mock:github -- --source jira --write
pnpm mock:github -- --source spec --write
```

## Next (real product)

F1: LLM builds JSON from diff + chronicle · F2: Guardrails posts to PR on `synchronize`.
