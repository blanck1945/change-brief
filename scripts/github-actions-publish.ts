#!/usr/bin/env node
/**
 * Used by .github/workflows/change-brief.yml
 * Publishes a demo Change Brief (jira mock) on the current PR.
 */
import { assembleFromMockFixtures } from "../src/assemble/from-mocks.js";
import {
  parseGitHubRepository,
  publishGitHubChangeBrief,
} from "../src/github/publish.js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("GITHUB_TOKEN is required");
    process.exit(1);
  }
  const pr = process.env.CHANGE_BRIEF_PR_NUMBER;
  const headSha = process.env.CHANGE_BRIEF_HEAD_SHA;
  const baseSha = process.env.CHANGE_BRIEF_BASE_SHA ?? "base";
  if (!pr || !headSha) {
    console.error("CHANGE_BRIEF_PR_NUMBER and CHANGE_BRIEF_HEAD_SHA are required");
    process.exit(1);
  }

  const { owner, repo } = parseGitHubRepository();
  const source =
    process.env.CHANGE_BRIEF_DEMO_SOURCE === "spec" ? "spec" : "jira";

  const brief = assembleFromMockFixtures({
    rootDir: pkgRoot,
    source,
    chronicleSource: "synthetic",
  });

  const result = await publishGitHubChangeBrief(
    token,
    {
      owner,
      repo,
      pullNumber: Number.parseInt(pr, 10),
      headSha,
      baseSha,
    },
    brief,
  );

  console.log(
    `Change Brief ${result.created ? "posted" : "updated"} on PR #${pr} (comment id ${result.commentId}, ${result.bodyLength} chars)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
