import { describe, expect, it } from "vitest";
import {
  runAllMockGithubFlows,
  runMockGithubFlow,
} from "../../src/mock/run-github-mock.js";

describe("mock GitHub validation flow", () => {
  it("jira: covers all acceptance criteria", () => {
    const { validation, brief } = runMockGithubFlow({ source: "jira" });
    expect(validation.ok).toBe(true);
    expect(validation.workSourceKind).toBe("jira");
    expect(brief.workSource.kind).toBe("jira");
    expect(brief.workSource.ref).toBe("PROJ-1234");
    expect(validation.missingFromTraceability).toEqual([]);
  });

  it("spec: covers all spec requirements", () => {
    const { validation, brief } = runMockGithubFlow({ source: "spec" });
    expect(validation.ok).toBe(true);
    expect(validation.workSourceKind).toBe("spec");
    expect(brief.workSource.kind).toBe("spec");
    expect(brief.workSource.ref).toBe("billing-downgrade-v2");
    expect(brief.workSource.specPath).toBe("docs/specs/billing-downgrade-v2.md");
    expect(validation.missingFromTraceability).toEqual([]);
  });

  it("both scenarios pass together", () => {
    const runs = runAllMockGithubFlows();
    expect(runs).toHaveLength(2);
    expect(runs.every((r) => r.validation.ok)).toBe(true);
  });
});
