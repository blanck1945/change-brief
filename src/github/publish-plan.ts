import type { ChangeBrief } from "../core/schema.js";
import { renderChangeBriefMarkdown } from "../core/render/markdown.js";

export interface GitHubPublishPlan {
  checkRun: {
    name: string;
    conclusion: "neutral";
    headSha: string;
    title: string;
    summary: string;
  };
  issueComment: {
    marker: string;
    bodyMarkdown: string;
    bodyLength: number;
    updateStrategy: "find-marker-then-patch-or-create";
  };
  idempotencyKey: string;
}

export function buildGitHubPublishPlan(brief: ChangeBrief): GitHubPublishPlan {
  const mr = brief.mergeRequest;
  const marker = `<!-- change-brief:${mr.repo}:${mr.number} -->`;
  const bodyMarkdown = `${marker}\n\n${renderChangeBriefMarkdown(brief)}`;
  const idempotencyKey = `${mr.repo}:${mr.number}:${mr.headSha}:change-brief`;

  return {
    checkRun: {
      name: "Change Brief",
      conclusion: "neutral",
      headSha: mr.headSha,
      title: "Implementation record ready for human review",
      summary: `${brief.workSource.kind}:${brief.workSource.ref} · ${brief.oneLiner.slice(0, 200)}`,
    },
    issueComment: {
      marker,
      bodyMarkdown,
      bodyLength: bodyMarkdown.length,
      updateStrategy: "find-marker-then-patch-or-create",
    },
    idempotencyKey,
  };
}

export function formatPublishPlanDryRun(plan: GitHubPublishPlan): string {
  return `GitHub publish plan (dry-run)
=============================
Idempotency: ${plan.idempotencyKey}

Check run:
  name: ${plan.checkRun.name}
  conclusion: ${plan.checkRun.conclusion}
  head_sha: ${plan.checkRun.headSha}
  title: ${plan.checkRun.title}

Issue comment:
  strategy: ${plan.issueComment.updateStrategy}
  marker: ${plan.issueComment.marker}
  body length: ${plan.issueComment.bodyLength} chars

APIs (F2 — Guardrails job):
  - POST /repos/{owner}/{repo}/check-runs
  - GET  /repos/{owner}/{repo}/issues/{pr}/comments (find marker)
  - POST or PATCH issue comment with rendered Markdown
`;
}
