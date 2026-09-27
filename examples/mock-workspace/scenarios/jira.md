# Scenario: Jira ticket → MR

## Fictional ticket

- **Key:** PROJ-1234  
- **Fixture:** `fixtures/jira/PROJ-1234-issue.json`  
- **PR:** `fixtures/github/pull-request-842.json` → `billing-api#842`

## Fictional implementation

See `examples/mock-workspace/sample-repo/` — backend downgrade API + job.

Implementation record: `fixtures/implementation/billing-downgrade-mr842.json`

## Validation

Every Jira AC (`AC1`…`AC4`) must appear in `requirementsTraceability`:

```bash
pnpm mock:github -- --source jira
```

AC4 is **not met** on purpose (UI in another ticket) — the brief still documents it.

## Human review question

> “Is it OK to merge backend without AC4 if PROJ-1290 tracks UI?”

That is what the checklist section is for — not Guardrails line comments.
