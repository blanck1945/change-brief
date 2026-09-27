# Change Brief F1-a — Chronicle + assemble + publish dry-run

**Modo:** EXECUTE · after F0-a  
**Scope:** B07 (chronicle log/read), assemble CLI, publish dry-run (F2 prep)

## Criterios

- [x] `change-brief log` appends valid JSONL
- [x] `change-brief assemble --source jira|spec` merges chronicle file when passed
- [x] `change-brief publish --dry-run` prints GitHub actions summary
- [x] `pnpm check` green

## Execution

- `src/chronicle/*` — JSONL read/append
- `src/assemble/from-mocks.ts` — fixtures + optional chronicle override
- `src/github/publish-plan.ts` — F2 dry-run (check + comment marker)
- CLI: `log`, `assemble`, `publish --dry-run`

## Verify (handoff vs diff)

- [x] `pnpm check` — pass (5 tests)
- [x] `publish --dry-run --source jira` — prints idempotency key + APIs
