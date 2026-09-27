# Change Brief Format (CBF) v0.4

Technical **implementation narrative** for human MR review—not a diff walkthrough.

Context: [`IMPLEMENTATION-CONTROL.md`](IMPLEMENTATION-CONTROL.md)

**Language:** all rendered Markdown in **English**.

## Principles

1. **Implementation control, not code review** — humans validate story and decisions; Guardrails validates code.
2. **Global first** — capabilities, services, contracts; not file inventories (≤5 anchor paths optional).
3. **Plan vs reality** — baseline + chronicle of what changed during work.
4. **Traceability** — Jira or spec requirements with behavioral evidence ([`WORK-SOURCES.md`](WORK-SOURCES.md)).
5. **Separate Guardrails** — quality/style in another section.
6. **Multi-repo** — sibling MRs + merge order when applicable.

## Markdown template (PR comment)

Rendered by `src/core/render/markdown.ts` from JSON (`templates/change-brief.schema.json`).

Sections: header → one-liner → **requirement** → **integration** (flowchart + optional **sequence** Mermaid, touchpoints) → **agent considerations** → **worth calling out** → **how to judge if this is right** (`humanValidation`) → **requirements traceability** (with roll-up) → **behavior** → plan baseline → chronicle → … → checklist → footer.

**humanValidation** is the main “is this OK to merge?” block: correct signals, red flags, and a quick-check table (`action` / `passIf`).

**Mermaid:** GitLab and GitHub render fenced ` ```mermaid ` blocks in MR descriptions when Mermaid is enabled; local HTML previews load Mermaid.js from CDN (`src/core/render/mermaid-html.ts`).

## Structured output

Agent emits JSON valid against the schema; CLI `change-brief render` produces Markdown for GitHub.

## Inputs (runtime, F1+)

| Input | Use |
|-------|-----|
| Jira or spec | Baseline + requirements |
| MR metadata | Author context |
| Diff + bounded exploration | Surfaces and behavior |
| Chronicle / Baking handoff | Plan vs reality |
| Guardrails summary | “Already covered” section |

## Anti-patterns

- Brief that only paraphrases the MR title.
- 40 files with no capability grouping.
- Mixing bug findings with product decisions without sections.
- Claiming “met” with no behavioral evidence.
