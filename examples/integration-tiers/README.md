# Integration tiers — mock projects

Three **fictional** products show how Change Brief (CBF v0.4) documents integrations at different complexity levels. No Jira, GitLab API, or LLM required.

## Run

From repo root:

```bash
pnpm preview:tiers
```

**All demos (billing + tiers) in one page:** `pnpm preview:all` → [`../preview-all/output/index.html`](../preview-all/output/index.html)

| Tier | Story | Touchpoints |
|------|--------|-------------|
| **Simple** | [OPS-12 Slack deploy notify](simple/) | Event hook → HTTPS webhook |
| **Medium** | [AUTH-88 magic link](medium/) | API + Postgres + Redis + email queue |
| **Complex** | [catalog-sync-v3](complex/) | S3, Kafka, OpenSearch, 3 repos, webhooks |

## Layout per tier

| Path | Purpose |
|------|---------|
| `change-brief.json` | Source of truth (validate + render) |
| `change-brief.md` | Regenerated Markdown brief |
| `mock-repo/` | Tiny stub “codebase” the MR pretends to change |
| `README.md` | Tier-specific narrative |

Generated MR previews: [`output/README.md`](output/README.md) (after `preview:tiers`).

## Compare to billing demo

[`../mock-workspace/`](../mock-workspace/) is one **medium** billing flow with Jira/spec fixtures and chronicle files. This folder is a **side-by-side** comparison of brief depth and sections.

## Validate one tier

```bash
pnpm change-brief validate examples/integration-tiers/simple/change-brief.json
pnpm change-brief render examples/integration-tiers/medium/change-brief.json
```
