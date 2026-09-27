# Try Change Brief on GitHub

This repo can **post a demo Change Brief on every pull request** via GitHub Actions (no extra secrets).

## What happens on a PR

Workflow [`.github/workflows/change-brief.yml`](../.github/workflows/change-brief.yml):

1. Assembles the **billing downgrade** mock brief (Jira PROJ-1234).
2. Rewrites `mergeRequest` to **this repo’s PR** (number + SHAs).
3. **Creates or updates** one issue comment containing the marker `<!-- change-brief:owner/repo:number -->` and full Markdown (Mermaid, human validation, etc.).

Workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs `pnpm check` on push/PR.

## One-time setup

```bash
cd change-brief
git init -b main
git add -A
git commit -m "Initial commit: Change Brief core and GitHub demo"
gh repo create YOUR-USER/change-brief --public --source=. --remote=origin --push
```

(Use a private repo if you prefer: drop `--public`.)

## See it in action

1. Create a branch and open a PR:

```bash
git checkout -b demo/try-change-brief
echo "# demo" >> DEMO.md
git add DEMO.md
git commit -m "demo: trigger Change Brief workflow"
git push -u origin demo/try-change-brief
gh pr create --title "Demo: Change Brief on PR" --body "Watch the Checks tab and PR comments."
```

2. On the PR:
   - **Checks** → `Change Brief on PR` job should succeed.
   - **Conversation** → new comment from `github-actions` with the full brief (scroll for Mermaid).

3. Push another commit to the same PR → the **same comment is updated** (marker idempotency).

## Local publish (real API)

With a PAT or `gh auth token` that can write PR comments:

```bash
export GITHUB_TOKEN="$(gh auth token)"
export GITHUB_REPOSITORY="owner/repo"
export CHANGE_BRIEF_PR_NUMBER=1
export CHANGE_BRIEF_HEAD_SHA="$(gh pr view 1 --json headRefOid -q .headRefOid)"
export CHANGE_BRIEF_BASE_SHA="$(gh pr view 1 --json baseRefOid -q .baseRefOid)"
pnpm exec tsx scripts/github-actions-publish.ts
```

## Previews without GitHub

```bash
pnpm preview:all
# open examples/preview-all/output/index.html
```

## Limitations (demo)

- PR workflow uses **fixture content**, not your diff or Jira yet (F1 generate / F2 productization).
- Check Runs API is planned; today only the **PR comment** is posted.
- Default demo source is Jira mock; set `CHANGE_BRIEF_DEMO_SOURCE=spec` in the workflow to use the spec fixture.

