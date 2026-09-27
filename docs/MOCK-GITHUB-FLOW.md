# Mock GitHub flow (Jira **or** spec)

Simulates **work source → implementation on PR → Change Brief comment** without APIs or LLM.

## Scenarios

| `--source` | Work source fixture | PR | Implementation |
|------------|---------------------|-----|----------------|
| `jira` (default alone) | `fixtures/jira/PROJ-1234-issue.json` | `#842` | `billing-downgrade-mr842.json` |
| `spec` | `fixtures/spec/billing-downgrade-v2.json` | `#901` | `billing-downgrade-spec-mr901.json` |
| `both` (default) | Runs **both** scenarios | | |

Same domain (billing downgrade), two intake shapes: **Jira AC** vs **spec REQ / §**.

## Commands

```bash
cd change-brief
pnpm check
pnpm mock:github                      # both jira + spec
pnpm mock:github -- --source jira
pnpm mock:github -- --source spec
pnpm mock:github -- --write           # artifacts for both
pnpm mock:github -- --source spec --write
```

## Outputs with `--write`

| File | Scenario |
|------|----------|
| `fixtures/output/mock-jira-*` | Jira → PR #842 |
| `fixtures/output/mock-spec-*` | Spec → PR #901 |

Each set: `*-brief.json`, `*-pr-comment.md`, `*-validation.json`.

## Validation

For **jira**: every AC id on the ticket appears in `requirementsTraceability.sourceRef`.

For **spec**: every `REQ-*` on the spec document is traced; brief uses `workSource.kind: "spec"` with `specPath` and `specRevision`.

## Manual GitHub check

Paste `mock-jira-pr-comment.md` or `mock-spec-pr-comment.md` into a test PR and review as a human.

## F2

Real pipeline picks `workSource` from MR (Jira key vs spec path in body); same assemble → validate → render → post.
