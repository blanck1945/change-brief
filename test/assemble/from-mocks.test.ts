import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { assembleFromMockFixtures } from "../../src/assemble/from-mocks.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("assembleFromMockFixtures", () => {
  it("merges chronicle from sample-repo file", () => {
    const chronicle = join(
      root,
      "examples/mock-workspace/sample-repo/.change-brief/chronicle.jsonl",
    );
    const brief = assembleFromMockFixtures({
      rootDir: root,
      source: "jira",
      chroniclePath: chronicle,
    });
    expect(brief.chronicleSource).toBe("file");
    expect(brief.implementationChronicle.length).toBe(3);
    expect(brief.implementationChronicle[0]!.whatHappened).toContain("PROJ-1234");
  });
});
