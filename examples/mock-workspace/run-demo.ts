#!/usr/bin/env node
/**
 * Interactive-ish demo: runs both mock GitHub flows and prints where to look.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runAllMockGithubFlows } from "../../src/mock/run-github-mock.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  Change Brief — mock workspace demo                          ║
╚══════════════════════════════════════════════════════════════╝

Sample product repo (fiction):
  examples/mock-workspace/sample-repo/

Work sources:
  • Jira  → fixtures/jira/PROJ-1234-issue.json
  • Spec  → fixtures/spec/billing-downgrade-v2.json

Generating PR comments (mock-github)…
`);

const runs = runAllMockGithubFlows({ rootDir: root, writeArtifacts: true });

for (const r of runs) {
  console.log(`\n▸ ${r.scenario}`);
  console.log(`  workSource: ${r.brief.workSource.kind}:${r.brief.workSource.ref}`);
  console.log(`  PR: ${r.brief.mergeRequest.repo}#${r.brief.mergeRequest.number}`);
  console.log(`  coverage: ${r.validation.ok ? "OK" : "FAILED"}`);
  if (r.artifactPaths) {
    console.log(`  PR comment → ${r.artifactPaths.markdown}`);
  }
}

console.log(`
Next steps:
  1. Open the two *-pr-comment.md files under fixtures/output/
  2. Read examples/mock-workspace/scenarios/jira.md and spec.md
  3. Browse sample-repo/ (spec markdown + chronicle.jsonl)

Re-run anytime: pnpm demo
`);
