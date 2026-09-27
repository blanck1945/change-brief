# Change Brief on GitLab

## Why this exists (human review in the agent era)

When agents write most of the code, **humans should not re-review every line**. They should validate:

- Does the **implementation** match the ticket or spec?
- Were **pivots and scope** acceptable?
- Is **blast radius** OK to merge?

**Guardrails** (or similar) handles **code quality** on the diff. **Change Brief** is the **implementation record** on the merge request.

Same CBF JSON/Markdown whether you use GitLab or GitHub; only **where it is posted** changes.

---

## Can you see it on GitLab today?

| Mode | Available now? |
|------|----------------|
| Generate brief locally (`assemble`, `mock-github`, `preview`) | **Yes** |
| **GitLab-style browser preview** (mock UI) | **Yes** — `pnpm preview` → `*-gitlab.html` |
| Paste note into a **real MR** (manual) | **Yes** |
| Bot posts/updates note on every push | **No** — F2 GitLab publisher |

---

## How it will appear on a real GitLab MR

GitLab has no native “implementation review” panel. Same idea as GitHub:

```text
Merge request !842
├── Pipeline (optional)
│     job change-brief:publish   ← informational, or external status
├── Changes (diff)               ← agent code review / Guardrails
└── Activity
      🤖 change-brief-bot note   ← full Implementation Record (Markdown)
      other threads…
```

Humans read the **note**, skim **Changes** only for red flags, approve the **MR** (1–2 approvals via project rules).

---

## Try it locally (GitLab look)

```bash
cd change-brief
pnpm preview
```

Open:

- `examples/mock-workspace/preview/output/pr-842-jira-gitlab.html`
- `examples/mock-workspace/preview/output/pr-901-spec-gitlab.html`

Markdown (forge-agnostic): `pr-842-jira.md` — works in GitLab’s note editor too.

---

## Try it on a real GitLab MR (manual, today)

1. `pnpm mock:github -- --source jira --write`
2. Copy `fixtures/output/mock-jira-pr-comment.md`
3. Open your test MR → **Add a note to this merge request**
4. Paste Markdown → **Comment**

That is exactly the content F2 will post automatically.

Dry-run APIs:

```bash
pnpm change-brief publish --dry-run --forge gitlab --source jira
```

---

## F2 on GitLab (planned)

- Trigger: GitLab webhook `merge_request` (open / update)
- Publish: MR **note** with HTML marker for idempotent updates
- Optional: external status check or manual `change-brief` CI job
- Config: project token / bot user (your infra, your cost)

Guardrails today targets GitHub; **GitLab publisher lives in `change-brief`** and can run from **GitLab CI** without Guardrails if needed.

---

## Related

- [`PROJECT-AND-GITHUB.md`](PROJECT-AND-GITHUB.md) — same product story (GitHub wording; surfaces map 1:1 to GitLab notes + pipeline)
- [`IMPLEMENTATION-CONTROL.md`](IMPLEMENTATION-CONTROL.md)
