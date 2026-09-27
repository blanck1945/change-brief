import type { ChangeBrief } from "../core/schema.js";
import { buildGitHubPublishPlan } from "./publish-plan.js";

const GITHUB_API = "https://api.github.com";

export interface GitHubRepoPull {
  owner: string;
  repo: string;
  pullNumber: number;
  headSha: string;
  baseSha: string;
}

export function patchBriefForPullRequest(
  brief: ChangeBrief,
  target: GitHubRepoPull,
): ChangeBrief {
  const full = `${target.owner}/${target.repo}`;
  return {
    ...brief,
    mergeRequest: {
      repo: full,
      number: target.pullNumber,
      url: `https://github.com/${full}/pull/${target.pullNumber}`,
      baseSha: target.baseSha,
      headSha: target.headSha,
    },
  };
}

interface IssueComment {
  id: number;
  body: string;
}

async function ghFetch(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
  return res;
}

async function findCommentWithMarker(
  token: string,
  owner: string,
  repo: string,
  pullNumber: number,
  marker: string,
): Promise<IssueComment | undefined> {
  const res = await ghFetch(
    token,
    `/repos/${owner}/${repo}/issues/${pullNumber}/comments?per_page=100`,
  );
  if (!res.ok) {
    throw new Error(`List comments failed: ${res.status} ${await res.text()}`);
  }
  const comments = (await res.json()) as IssueComment[];
  return comments.find((c) => c.body.includes(marker));
}

export interface PublishGitHubResult {
  commentId: number;
  created: boolean;
  bodyLength: number;
}

/** Post or update pinned Change Brief on a pull request (issue comment with marker). */
export async function publishGitHubChangeBrief(
  token: string,
  target: GitHubRepoPull,
  brief: ChangeBrief,
): Promise<PublishGitHubResult> {
  const patched = patchBriefForPullRequest(brief, target);
  const plan = buildGitHubPublishPlan(patched);
  const body = plan.issueComment.bodyMarkdown;
  const { owner, repo, pullNumber } = target;

  const existing = await findCommentWithMarker(
    token,
    owner,
    repo,
    pullNumber,
    plan.issueComment.marker,
  );

  if (existing) {
    const res = await ghFetch(
      token,
      `/repos/${owner}/${repo}/issues/comments/${existing.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      },
    );
    if (!res.ok) {
      throw new Error(`Update comment failed: ${res.status} ${await res.text()}`);
    }
    const updated = (await res.json()) as IssueComment;
    return { commentId: updated.id, created: false, bodyLength: body.length };
  }

  const res = await ghFetch(
    token,
    `/repos/${owner}/${repo}/issues/${pullNumber}/comments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    },
  );
  if (!res.ok) {
    throw new Error(`Create comment failed: ${res.status} ${await res.text()}`);
  }
  const created = (await res.json()) as IssueComment;
  return { commentId: created.id, created: true, bodyLength: body.length };
}

export function parseGitHubRepository(env = process.env): {
  owner: string;
  repo: string;
} {
  const slug = env.GITHUB_REPOSITORY;
  if (!slug?.includes("/")) {
    throw new Error("GITHUB_REPOSITORY must be owner/repo (set by Actions or export manually)");
  }
  const [owner, repo] = slug.split("/");
  return { owner, repo };
}
