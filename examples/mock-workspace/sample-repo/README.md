# billing-api (mock)

Fictional service for the Change Brief demo. Not a runnable app.

## Files

| File | Demo purpose |
|------|----------------|
| `docs/specs/billing-downgrade-v2.md` | Spec work source (companion to Jira PROJ-1234 story) |
| `src/api/subscriptions/downgrade.ts` | Stub “what we implemented” |
| `.change-brief/chronicle.jsonl` | Example implementation log (F1 will append live) |

## Pretend PRs

| PR | Source | Change Brief output |
|----|--------|---------------------|
| #842 | Jira PROJ-1234 | `fixtures/output/mock-jira-pr-comment.md` |
| #901 | Spec v2 | `fixtures/output/mock-spec-pr-comment.md` |

Generate comments from repo root: `pnpm demo`
