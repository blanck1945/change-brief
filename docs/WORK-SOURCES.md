# Work source: Jira or spec

Canonical intake is **`workSource`** (one primary):

| `kind` | When | `ref` | Traceability |
|--------|------|-------|--------------|
| **`jira`** | Classic ticket → MR | `PROJ-1234` | Acceptance criteria on the issue |
| **`spec`** | Spec-first, RFC, Baking handoff | slug or id | Numbered sections, MUST/SHOULD, checklists |

## Spec shapes

- In-repo Markdown: `docs/specs/*.md`, `.cursor/handoff/*.md`
- External link via `url` + optional copy in repo
- For `kind=spec`, set **`specPath`** and **`specRevision`** (SHA at task start)

## Both Jira and spec mentioned

Pick **one** primary `workSource`; note the other in `planBaseline` or `assumptions`.

## No Jira and no spec

Degraded brief from diff + chronicle; checklist includes “missing canonical source”.

**All rendered text: English** (`.cursor/rules/english-only.mdc`).
