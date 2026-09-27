import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAllPrPreviews } from "../mock-workspace/preview/build-pr-preview.js";
import { buildIntegrationTierPreviews } from "../integration-tiers/build-previews.js";

const previewAllRoot = dirname(fileURLToPath(import.meta.url));
const outDir = join(previewAllRoot, "output");

export interface PreviewLink {
  group: string;
  title: string;
  subtitle: string;
  gitlabHtml: string;
  markdown?: string;
  githubHtml?: string;
}

/** Paths relative to `examples/preview-all/output/index.html` */
export const PREVIEW_CATALOG: PreviewLink[] = [
  {
    group: "Billing workspace (Jira + spec)",
    title: "PROJ-1234 · billing-api !842",
    subtitle: "Full mock-workspace flow — downgrade API + worker (medium-shaped)",
    gitlabHtml: "../../mock-workspace/preview/output/pr-842-jira-gitlab.html",
    markdown: "../../mock-workspace/preview/output/pr-842-jira.md",
    githubHtml: "../../mock-workspace/preview/output/pr-842-jira.html",
  },
  {
    group: "Billing workspace (Jira + spec)",
    title: "billing-downgrade-v2 spec · !901",
    subtitle: "Same domain, work source = spec document",
    gitlabHtml: "../../mock-workspace/preview/output/pr-901-spec-gitlab.html",
    markdown: "../../mock-workspace/preview/output/pr-901-spec.md",
    githubHtml: "../../mock-workspace/preview/output/pr-901-spec.html",
  },
  {
    group: "Integration tiers",
    title: "Simple · OPS-12 Slack",
    subtitle: "One hook → one HTTPS webhook",
    gitlabHtml: "../../integration-tiers/output/simple-mr-gitlab.html",
    markdown: "../../integration-tiers/output/simple-mr.md",
    githubHtml: "../../integration-tiers/output/simple-mr.html",
  },
  {
    group: "Integration tiers",
    title: "Medium · AUTH-88 magic link",
    subtitle: "API + Postgres + Redis + email queue",
    gitlabHtml: "../../integration-tiers/output/medium-mr-gitlab.html",
    markdown: "../../integration-tiers/output/medium-mr.md",
    githubHtml: "../../integration-tiers/output/medium-mr.html",
  },
  {
    group: "Integration tiers",
    title: "Complex · catalog-sync-v3",
    subtitle: "Multi-repo · S3 · Kafka · OpenSearch",
    gitlabHtml: "../../integration-tiers/output/complex-mr-gitlab.html",
    markdown: "../../integration-tiers/output/complex-mr.md",
    githubHtml: "../../integration-tiers/output/complex-mr.html",
  },
];

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildIndexHtml(): string {
  const byGroup = new Map<string, PreviewLink[]>();
  for (const item of PREVIEW_CATALOG) {
    const list = byGroup.get(item.group) ?? [];
    list.push(item);
    byGroup.set(item.group, list);
  }

  const sections = [...byGroup.entries()]
    .map(([group, items]) => {
      const rows = items
        .map(
          (item) => `
        <article class="card">
          <h3>${esc(item.title)}</h3>
          <p class="sub">${esc(item.subtitle)}</p>
          <div class="links">
            <a class="primary" href="${esc(item.gitlabHtml)}">GitLab mock</a>
            ${item.markdown ? `<a href="${esc(item.markdown)}">MR markdown</a>` : ""}
            ${item.githubHtml ? `<a href="${esc(item.githubHtml)}">GitHub mock</a>` : ""}
          </div>
        </article>`,
        )
        .join("\n");
      return `<section><h2>${esc(group)}</h2><div class="grid">${rows}</div></section>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Change Brief — all previews</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", system-ui, sans-serif;
      background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 45%, #fff8f0 100%);
      color: #1a1a2e;
      line-height: 1.5;
    }
    header {
      padding: 2.5rem 1.5rem 1.5rem;
      max-width: 960px;
      margin: 0 auto;
    }
    header h1 { margin: 0 0 0.5rem; font-size: 1.75rem; font-weight: 650; }
    header p { margin: 0; color: #444; max-width: 42rem; }
    main { max-width: 960px; margin: 0 auto; padding: 0 1.5rem 3rem; }
    section { margin-bottom: 2rem; }
    section h2 {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #666;
      margin: 0 0 1rem;
      font-weight: 600;
    }
    .grid { display: grid; gap: 1rem; }
    @media (min-width: 640px) { .grid { grid-template-columns: 1fr 1fr; } }
    .card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .card h3 { margin: 0 0 0.35rem; font-size: 1.05rem; }
    .sub { margin: 0 0 1rem; font-size: 0.9rem; color: #555; }
    .links { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .links a {
      font-size: 0.85rem;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      text-decoration: none;
      border: 1px solid #cbd5e1;
      color: #334155;
    }
    .links a:hover { background: #f1f5f9; }
    .links a.primary {
      background: #292961;
      color: #fff;
      border-color: #292961;
    }
    .links a.primary:hover { background: #1e1e4a; }
    footer {
      max-width: 960px;
      margin: 0 auto;
      padding: 1rem 1.5rem 2rem;
      font-size: 0.8rem;
      color: #666;
    }
    code { background: #f1f5f9; padding: 0.1rem 0.35rem; border-radius: 4px; }
  </style>
</head>
<body>
  <header>
    <h1>Change Brief — preview hub</h1>
    <p>
      Generated by <code>pnpm preview:all</code>. Each link opens a mock MR with a pinned
      Change Brief (Mermaid, human validation, traceability). Start with <strong>GitLab mock</strong>
      if that is your forge.
    </p>
  </header>
  <main>
${sections}
  </main>
  <footer>
    Regenerate: <code>pnpm preview:all</code> · Billing fixtures also update
    <code>fixtures/output/mock-*</code>
  </footer>
</body>
</html>`;
}

export function buildAllPreviewsHub(): { indexPath: string; childPaths: string[] } {
  const billingPaths = buildAllPrPreviews();
  const tierPaths = buildIntegrationTierPreviews();

  mkdirSync(outDir, { recursive: true });
  const indexPath = join(outDir, "index.html");
  writeFileSync(indexPath, buildIndexHtml(), "utf8");

  const readme = `# Preview hub

Open **[index.html](./index.html)** in a browser (file:// or via a static server).

Built by \`pnpm preview:all\` — refreshes billing mock-workspace + integration tiers, then writes this index.
`;
  writeFileSync(join(outDir, "README.md"), readme, "utf8");

  return { indexPath, childPaths: [...billingPaths, ...tierPaths] };
}

if (process.argv[1]?.endsWith("build-index.ts")) {
  const { indexPath } = buildAllPreviewsHub();
  console.log("Wrote hub:", indexPath);
}
