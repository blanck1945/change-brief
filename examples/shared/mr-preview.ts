import { marked } from "marked";
import {
  MERMAID_SCRIPT,
  mermaidHtmlFromMarked,
} from "../../src/core/render/mermaid-html.js";

export interface MrPreviewMeta {
  repo: string;
  number: number;
  url: string;
  title: string;
  body: string;
  baseSha: string;
  headSha: string;
  labels?: string[];
}

export function buildFullPrMarkdown(
  pr: MrPreviewMeta,
  briefMarkdown: string,
  workSourceLabel: string,
): string {
  return `# ${pr.title} #${pr.number}

**Repo:** \`${pr.repo}\` · **Mock PR:** [${pr.url}](${pr.url})

\`\`\`text
user wants to merge 1 commit into main from feature branch
base: ${pr.baseSha}  →  head: ${pr.headSha}
\`\`\`

## Description

${pr.body}

**Labels:** ${(pr.labels ?? []).join(", ") || "—"}

---

## Checks (mock)

| Check | Status | Notes |
|-------|--------|-------|
| Guardrails | neutral | Code quality agent (separate comment thread) |
| Change Brief | neutral | Implementation record — does not block merge |

**Work source:** ${workSourceLabel}

---

## Conversation

### Pinned · Change Brief bot · \`headSha=${pr.headSha}\`

<!-- change-brief:${pr.repo}:${pr.number} -->

${briefMarkdown}
`;
}

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function briefHtmlFromMarkdown(briefMarkdown: string): string {
  let briefHtml = marked.parse(briefMarkdown, { async: false }) as string;
  return mermaidHtmlFromMarked(briefHtml);
}

export function buildGithubHtml(
  pr: MrPreviewMeta,
  briefMarkdown: string,
  workSourceLabel: string,
  pageTitle: string,
): string {
  const briefHtml = briefHtmlFromMarkdown(briefMarkdown);
  const esc = escHtml;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(pageTitle)}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.8.1/github-markdown-light.min.css" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #f6f8fa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 14px; color: #1f2328; }
    .header { background: #24292f; color: #fff; padding: 16px 24px; }
    .header a { color: #58a6ff; text-decoration: none; }
    .header h1 { margin: 0 0 8px; font-size: 20px; font-weight: 600; }
    .header .meta { color: #8b949e; font-size: 13px; }
    .layout { max-width: 1012px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 16px; }
    .panel { background: #fff; border: 1px solid #d0d7de; border-radius: 6px; padding: 16px; }
    .panel h2 { margin: 0 0 12px; font-size: 16px; border-bottom: 1px solid #d8dee4; padding-bottom: 8px; }
    .checks { list-style: none; padding: 0; margin: 0; }
    .checks li { display: flex; align-items: center; gap: 8px; padding: 6px 0; }
    .badge { font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: #ddf4ff; color: #0969da; }
    .badge.neutral { background: #eaeef2; color: #57606a; }
    .comment { border: 1px solid #d0d7de; border-radius: 6px; background: #fff; }
    .comment-header { padding: 12px 16px; background: #f6f8fa; border-bottom: 1px solid #d0d7de; border-radius: 6px 6px 0 0; display: flex; align-items: center; gap: 8px; }
    .comment-header strong { font-size: 14px; }
    .comment-header .pin { font-size: 12px; color: #57606a; }
    .comment-body { padding: 16px; }
    .comment-body .markdown-body { max-width: none; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; background: #656d76; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
    .description { white-space: pre-wrap; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="header">
    <div class="meta">${esc(pr.repo)} · Pull request #${pr.number}</div>
    <h1>${esc(pr.title)}</h1>
    <div class="meta">Mock preview · ${esc(workSourceLabel)} · <a href="${esc(pr.url)}">${esc(pr.url)}</a></div>
  </div>
  <div class="layout">
    <div class="panel">
      <h2>About this PR</h2>
      <p class="description">${esc(pr.body)}</p>
      <p class="meta"><code>${esc(pr.baseSha)}</code> → <code>${esc(pr.headSha)}</code></p>
    </div>
    <div class="panel">
      <h2>Checks</h2>
      <ul class="checks">
        <li><span class="badge neutral">neutral</span> Guardrails — code review</li>
        <li><span class="badge neutral">neutral</span> Change Brief — implementation record</li>
      </ul>
    </div>
    <div class="comment">
      <div class="comment-header">
        <div class="avatar">CB</div>
        <div>
          <strong>change-brief-bot</strong> commented · pinned
          <div class="pin">Implementation review for humans (not line-by-line code)</div>
        </div>
      </div>
      <div class="comment-body">
        <article class="markdown-body">${briefHtml}</article>
      </div>
    </div>
  </div>
${MERMAID_SCRIPT}
</body>
</html>`;
}

export function buildGitlabHtml(
  pr: MrPreviewMeta,
  briefMarkdown: string,
  workSourceLabel: string,
  pageTitle: string,
): string {
  const briefHtml = briefHtmlFromMarkdown(briefMarkdown);
  const esc = escHtml;
  const gitlabMrUrl = `https://gitlab.example.com/${pr.repo}/-/merge_requests/${pr.number}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(pageTitle)}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.8.1/github-markdown-light.min.css" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #fff; font-family: "GitLab Sans", -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; color: #333; }
    .top { background: #292961; color: #fff; padding: 12px 24px; font-size: 13px; }
    .top a { color: #c1c7ff; }
    .title-bar { padding: 16px 24px; border-bottom: 1px solid #ececef; }
    .title-bar h1 { margin: 0; font-size: 21px; font-weight: 600; }
    .title-bar .iid { color: #666; font-weight: 400; }
    .layout { max-width: 1100px; margin: 0 auto; padding: 24px; display: grid; gap: 16px; }
    .tabs { color: #666; font-size: 14px; margin-bottom: 8px; }
    .tabs span { margin-right: 16px; }
    .tabs .active { color: #333; font-weight: 600; border-bottom: 2px solid #fc6d26; padding-bottom: 4px; }
    .panel { border: 1px solid #ececef; border-radius: 4px; padding: 16px; }
    .panel h2 { margin: 0 0 12px; font-size: 16px; }
    .pipeline { display: flex; gap: 8px; flex-wrap: wrap; }
    .pill { font-size: 12px; padding: 4px 10px; border-radius: 4px; background: #ecf4ee; color: #108548; }
    .pill.info { background: #f5f5f5; color: #666; }
    .note { border: 1px solid #ececef; border-radius: 4px; }
    .note-header { padding: 12px 16px; background: #fafafa; border-bottom: 1px solid #ececef; display: flex; gap: 10px; align-items: center; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; background: #fc6d26; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
    .note-body { padding: 16px; }
    .note-body .markdown-body { max-width: none; }
    .hint { font-size: 12px; color: #666; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="top">${esc(pr.repo)} · Merge requests · Mock preview</div>
  <div class="title-bar">
    <h1>${esc(pr.title)} <span class="iid">!${pr.number}</span></h1>
    <div class="hint">${esc(workSourceLabel)} · <a href="${esc(gitlabMrUrl)}" style="color:#106ba3">${esc(gitlabMrUrl)}</a></div>
  </div>
  <div class="layout">
    <div class="tabs">
      <span class="active">Overview</span><span>Commits</span><span>Pipelines</span><span>Changes</span>
    </div>
    <div class="panel">
      <h2>Description</h2>
      <p>${esc(pr.body)}</p>
      <p class="hint"><code>${esc(pr.baseSha)}</code> → <code>${esc(pr.headSha)}</code></p>
    </div>
    <div class="panel">
      <h2>Pipelines (mock)</h2>
      <div class="pipeline">
        <span class="pill">guardrails:review</span>
        <span class="pill info">change-brief:publish</span>
      </div>
      <p class="hint">Change Brief job is informational; humans approve implementation via MR note below.</p>
    </div>
    <div class="note">
      <div class="note-header">
        <div class="avatar">CB</div>
        <div>
          <strong>change-brief-bot</strong> · note on merge request
          <div class="hint">Human validates <strong>implementation</strong>, not every diff line</div>
        </div>
      </div>
      <div class="note-body">
        <article class="markdown-body">${briefHtml}</article>
      </div>
    </div>
  </div>
${MERMAID_SCRIPT}
</body>
</html>`;
}
