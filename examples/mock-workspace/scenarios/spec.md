# Scenario: Spec → MR

## Fictional spec

- **Id:** billing-downgrade-v2  
- **Fixture:** `fixtures/spec/billing-downgrade-v2.json`  
- **Markdown (sample repo):** `sample-repo/docs/specs/billing-downgrade-v2.md`  
- **PR:** `fixtures/github/pull-request-901.json` → `billing-api#901`

## Fictional implementation

`fixtures/implementation/billing-downgrade-spec-mr901.json`

Brief uses:

```json
"workSource": {
  "kind": "spec",
  "ref": "billing-downgrade-v2",
  "specPath": "docs/specs/billing-downgrade-v2.md",
  "specRevision": "a1b2c3d"
}
```

## Validation

Every spec requirement `REQ-1`…`REQ-4` is traced. REQ-4 is **partial** (SHOULD / portal later).

```bash
pnpm mock:github -- --source spec
```

## When to use spec vs Jira

| Use Jira when | Use spec when |
|---------------|---------------|
| Team tracks AC in tickets | Spec-first / RFC in repo |
| MR title has PROJ-1234 | MR body links `docs/specs/…` |

Both produce the same **Change Brief** shape on the PR.
