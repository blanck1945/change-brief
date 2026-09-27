import { describe, expect, it } from "vitest";
import { patchBriefForPullRequest } from "../src/github/publish.js";
import { parseChangeBrief } from "../src/core/validate.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("publishGitHub", () => {
  it("patchBriefForPullRequest rewrites mergeRequest", () => {
    const json = JSON.parse(
      readFileSync(
        join(import.meta.dirname, "../examples/integration-tiers/simple/change-brief.json"),
        "utf8",
      ),
    );
    const brief = parseChangeBrief(json);
    const patched = patchBriefForPullRequest(brief, {
      owner: "acme",
      repo: "change-brief",
      pullNumber: 99,
      headSha: "abc",
      baseSha: "def",
    });
    expect(patched.mergeRequest.number).toBe(99);
    expect(patched.mergeRequest.url).toBe("https://github.com/acme/change-brief/pull/99");
    expect(patched.mergeRequest.headSha).toBe("abc");
  });
});
