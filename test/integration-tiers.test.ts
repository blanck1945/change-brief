import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderChangeBriefMarkdown } from "../src/core/render/markdown.js";
import { parseChangeBrief } from "../src/core/validate.js";
import {
  TIER_IDS,
  buildIntegrationTierPreviews,
} from "../examples/integration-tiers/build-previews.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("integration tier fixtures", () => {
  for (const tier of TIER_IDS) {
    it(`${tier} change-brief.json validates and renders`, () => {
      const path = join(root, "examples/integration-tiers", tier, "change-brief.json");
      const brief = parseChangeBrief(JSON.parse(readFileSync(path, "utf8")));
      const md = renderChangeBriefMarkdown(brief);
      expect(md).toContain("### Integration (what was wired)");
      expect(md).toContain("### How to judge if this is right");
    });
  }

  it("buildIntegrationTierPreviews writes output", () => {
    const paths = buildIntegrationTierPreviews();
    expect(paths.some((p) => p.includes("simple-mr-gitlab.html"))).toBe(true);
    expect(paths.some((p) => p.includes("output") && p.includes("README.md"))).toBe(true);
  });
});

describe("preview:all hub", () => {
  it("buildAllPreviewsHub writes index.html", async () => {
    const { buildAllPreviewsHub } = await import(
      "../examples/preview-all/build-index.js"
    );
    const { indexPath } = buildAllPreviewsHub();
    expect(indexPath).toContain("index.html");
    const html = readFileSync(indexPath, "utf8");
    expect(html).toContain("PROJ-1234");
    expect(html).toContain("catalog-sync-v3");
  });
});
