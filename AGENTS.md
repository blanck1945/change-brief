# Change Brief — agent notes

## Purpose

Generate **CBF v0.2** memos for humans reviewing MRs. Code quality is Guardrails.

## Language

**English only** for repo artifacts — see `.cursor/rules/english-only.mdc`.

## Key files

- Spec: `docs/FORMAT.md`
- Intake: `docs/WORK-SOURCES.md` → `workSource`
- Generator prompt: `prompts/generate-change-brief.md`
- Plans: `.cursor/handoff/`

## Baking (required)

- `.cursor/baking/required.json` — strict implementation via Baking-AI.
- Handoffs: `.cursor/handoff/YYYY-MM-DD-<slug>.md`
- Metrics: `.cursor/baking/metrics/runs.jsonl`

## When implementing

- Reuse Guardrails `Workspace` from `../codereview-ai/guardrails` when wiring F2.
- Publish briefs with **neutral** check; never block merge on narrative alone.
- Idempotency: `{repo}:{mr}:{headSha}:change-brief`.
