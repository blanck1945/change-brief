import type { ChangeBrief } from "../core/schema.js";
import { renderChangeBriefMarkdown } from "../core/render/markdown.js";

export interface GitLabPublishPlan {
  externalStatus?: {
    name: string;
    label: "passed" | "failed" | "pending";
    description: string;
  };
  mergeRequestNote: {
    marker: string;
    bodyMarkdown: string;
    bodyLength: number;
    updateStrategy: "find-marker-in-notes-then-put-or-post";
  };
  idempotencyKey: string;
}

export function buildGitLabPublishPlan(brief: ChangeBrief): GitLabPublishPlan {
  const mr = brief.mergeRequest;
  const marker = `<!-- change-brief:${mr.repo}:${mr.number} -->`;
  const bodyMarkdown = `${marker}\n\n${renderChangeBriefMarkdown(brief)}`;
  const idempotencyKey = `${mr.repo}:${mr.number}:${mr.headSha}:change-brief`;

  return {
    externalStatus: {
      name: "change-brief",
      label: "passed",
      description:
        "Implementation record published (informational — does not replace human approval)",
    },
    mergeRequestNote: {
      marker,
      bodyMarkdown,
      bodyLength: bodyMarkdown.length,
      updateStrategy: "find-marker-in-notes-then-put-or-post",
    },
    idempotencyKey,
  };
}

export function formatGitLabPublishPlanDryRun(plan: GitLabPublishPlan): string {
  return `GitLab publish plan (dry-run)
=============================
Idempotency: ${plan.idempotencyKey}

External status (optional, if enabled on project):
  name: ${plan.externalStatus?.name}
  label: ${plan.externalStatus?.label}

Merge request note (primary surface):
  strategy: ${plan.mergeRequestNote.updateStrategy}
  marker: ${plan.mergeRequestNote.marker}
  body length: ${plan.mergeRequestNote.bodyLength} chars

APIs (F2 — CI job or bot):
  - POST /projects/:id/merge_requests/:iid/notes
  - PUT  /projects/:id/merge_requests/:iid/notes/:note_id (update same note on new push)
  - External status check API (if licensed/configured)
`;
}
