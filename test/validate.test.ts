import { describe, expect, it } from "vitest";
import { validateChangeBrief } from "../src/core/validate.js";

const minimalV04 = {
  version: "0.4" as const,
  workSource: { kind: "jira" as const, ref: "X", title: "t" },
  mergeRequest: {
    repo: "r",
    number: 1,
    url: "https://github.com/a/b/pull/1",
    baseSha: "a",
    headSha: "b",
  },
  oneLiner: "x",
  requirementSummary: "req",
  integration: { summary: "wired" },
  agentConsiderations: [{ question: "q?", resolution: "r" }],
  worthMentioning: ["note"],
  humanValidation: {
    correctSignals: ["a", "b"],
    redFlags: ["bad"],
    quickChecks: [
      { action: "do", passIf: "see" },
      { action: "do2", passIf: "see2" },
    ],
  },
  planBaseline: [],
  implementationChronicle: [],
  scope: { areas: [], inScope: [], outOfScope: [] },
  requirementsTraceability: [],
  behavior: { before: "a", after: "b" },
  humanAttention: ["risk"],
  qualityAgentSummary: { coveredByAgent: [], openFindingsCount: 0 },
  humanChecklist: ["a", "b", "c", "d"],
};

describe("validateChangeBrief", () => {
  it("rejects v0.1 version", () => {
    const result = validateChangeBrief({ ...minimalV04, version: "0.1" });
    expect(result.ok).toBe(false);
  });

  it("rejects v0.3 version", () => {
    const result = validateChangeBrief({ ...minimalV04, version: "0.3" });
    expect(result.ok).toBe(false);
  });

  it("accepts minimal v0.4", () => {
    const result = validateChangeBrief(minimalV04);
    expect(result.ok).toBe(true);
  });
});
