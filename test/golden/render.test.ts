import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderChangeBriefMarkdown } from "../../src/core/render/markdown.js";
import { parseChangeBrief } from "../../src/core/validate.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const templates = join(root, "templates");

describe("render golden", () => {
  it("example-PROJ-1234.json matches example-PROJ-1234.md", () => {
    const json = JSON.parse(
      readFileSync(join(templates, "example-PROJ-1234.json"), "utf8"),
    );
    const brief = parseChangeBrief(json);
    const md = renderChangeBriefMarkdown(brief);
    const expected = readFileSync(
      join(templates, "example-PROJ-1234.md"),
      "utf8",
    );
    expect(md).toBe(expected);
  });
});
