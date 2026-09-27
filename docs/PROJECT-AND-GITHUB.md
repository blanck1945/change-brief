# Change Brief — what it is and how it works on GitHub

> **Using GitLab?** Same product: implementation record on the **merge request**. See **[`GITLAB.md`](GITLAB.md)** (preview + manual paste + F2 plan). Default `publish --dry-run` targets GitLab.

## What this project does

**Change Brief** produces an **implementation record** for merge requests when work is driven by AI (or humans + agents).

| Layer | Question it answers |
|-------|---------------------|
| **Change Brief** | Was the **implementation** reasonable? Does it match the ticket or spec (plan, pivots, scope, architecture)? |
| **Guardrails** (separate product) | Is the **code** OK (bugs, security, style, repo rules)? |

Humans should approve the **story of the work**, not re-read every line the model wrote. Code quality stays with the review agent.

### Work source (intake)

Each brief is tied to one primary source:

- **Jira** — acceptance criteria on the issue (`workSource.kind: jira`)
- **Spec** — requirements in repo Markdown / RFC (`workSource.kind: spec`, with `specPath` and `specRevision`)

Output is **CBF v0.4**: JSON (machine) + Markdown (human), always in **English**.

### What the artifact contains

- One-liner, plan baseline, **implementation chronicle** (plan → discoveries → decisions)
- Deviations from plan, global capability view, scope in/out
- **Requirements traceability** (AC or spec REQ → met / partial / not met + evidence)
- Blast radius, human attention, checklist for a ~2 minute human review
- Summary of what the **quality agent** already covered (so humans do not re-check style)

---

## Current status (this repo)

| Done (F0) | Not done yet (F1–F2) |
|-----------|----------------------|
| Schema, validate, render, CLI | LLM generation from diff + chronicle |
| Mock Jira + spec + GitHub fixtures | Live Jira API |
| `pnpm demo`, `pnpm preview` (local PR preview) | Posting to real GitHub |
| Sample repo under `examples/mock-workspace/` | Guardrails webhook job |

---

## How it works on GitHub (target design)

Change Brief is **not a native GitHub feature**. GitHub has no built-in “implementation review” tab. Integration uses the same surfaces other bots use.

### When it runs

On each update to a pull request branch:

- GitHub event: `pull_request` → `opened` or **`synchronize`** (new push to the PR)
- Same rhythm as “refresh the MR”

### What gets published

1. **Check run** (GitHub Checks API)  
   - Name: e.g. **Change Brief**  
   - Conclusion: **`neutral`** by default (visible, does **not** block merge unless you add branch rules)  
   - Optional: `details_url` to an external dashboard later  

2. **Pull request comment** (Issues/PR Comments API)  
   - Markdown body = rendered Change Brief  
   - **Idempotent:** one logical comment per PR, updated when `headSha` changes (HTML marker `<!-- change-brief:repo:number -->`)  
   - Ideally **pinned** so reviewers see it at the top of **Conversation**

### What it looks like on a real PR (mental model)

```text
Pull request page (normal GitHub UI)
├── Checks tab / merge box
│     Guardrails          neutral  (code)
│     Change Brief        neutral  (implementation)
├── Files changed / diff   ← Guardrails inline comments
└── Conversation
      📌 change-brief-bot  ← full Implementation Record (Markdown)
      other comments…
```

The local **`pnpm preview`** HTML is only a **mock shell** (fake header + one comment). On GitHub you get the **real** PR (diff, files, timeline) plus that **comment block** and **checks**—the brief content should match what preview generates.

### Recommended integration

**GitHub App shared with Guardrails** (`codereview-ai/guardrails`):

- Same webhook, dedupe, clone/workspace as code review  
- Second job after (or alongside) Guardrails: assemble brief → validate → render → post check + comment  
- Model/cost: installation config (e.g. **z.ai `5.3-flash`**, user’s API key)

Alternative: **GitHub Action** per repo with secrets (100% user-owned runners/cost).

---

## Merge and approvals

| Mechanism | Purpose |
|-----------|---------|
| **Branch protection → required approving reviews (1 or 2)** | Native GitHub: N people must **Approve** the PR |
| **Change Brief check = neutral** | Informational by default; does **not** replace an Approve button |
| **Optional future:** check **success** only after human confirms brief (e.g. label or command) + add check to **required status checks** | Blocks merge until someone explicitly OKs implementation |

Typical setup: **1–2 human approvals** on the PR + readers use the **pinned Change Brief** to decide whether to approve. Guardrails handles code; the brief handles scope and implementation story.

---

## Try it locally (no GitHub)

```bash
cd change-brief
pnpm install
pnpm preview
```

| Output | Use |
|--------|-----|
| `examples/mock-workspace/preview/output/pr-842-jira.md` | Open in editor → Markdown preview |
| `examples/mock-workspace/preview/output/pr-842-jira.html` | Browser — approximate “comment on GitHub” styling |
| `fixtures/output/mock-jira-pr-comment.md` | Comment body only — paste into a test PR for **real** GitHub rendering |

See also: [`TESTING.md`](TESTING.md), [`MOCK-GITHUB-FLOW.md`](MOCK-GITHUB-FLOW.md), [`examples/mock-workspace/README.md`](../examples/mock-workspace/README.md).

---

## Related docs

- [`IMPLEMENTATION-CONTROL.md`](IMPLEMENTATION-CONTROL.md) — why implementation ≠ code review  
- [`WORK-SOURCES.md`](WORK-SOURCES.md) — Jira vs spec  
- [`FORMAT.md`](FORMAT.md) — CBF sections  
- Hyper plan: `.cursor/handoff/2026-09-26-change-brief-hyper-plan.md`
