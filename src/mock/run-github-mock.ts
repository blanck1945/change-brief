import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderChangeBriefMarkdown } from "../core/render/markdown.js";
import { parseChangeBrief, validateChangeBrief } from "../core/validate.js";
import { assembleChangeBriefFromMocks } from "./assemble.js";
import type { ChangeBrief } from "../core/schema.js";
import type {
  MockImplementation,
  MockJiraIssue,
  MockPullRequest,
  MockSpecDocument,
  MockValidationReport,
  MockWorkSourceKind,
} from "./types.js";
import {
  validateBriefAgainstJira,
  validateBriefAgainstSpec,
} from "./validate-against-source.js";

export type MockScenarioId = "jira-proj-1234" | "spec-billing-downgrade-v2";

export interface MockGithubFlowOptions {
  rootDir?: string;
  writeArtifacts?: boolean;
  /** Which mock scenario to run */
  source?: MockWorkSourceKind;
}

export interface MockGithubFlowResult {
  scenario: MockScenarioId;
  brief: ChangeBrief;
  markdown: string;
  validation: MockValidationReport;
  artifactPaths?: { json: string; markdown: string; report: string };
}

function load<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

const SCENARIOS: Record<
  MockWorkSourceKind,
  {
    scenario: MockScenarioId;
    jiraPath?: string;
    specPath?: string;
    prPath: string;
    implPath: string;
    artifactPrefix: string;
  }
> = {
  jira: {
    scenario: "jira-proj-1234",
    jiraPath: "jira/PROJ-1234-issue.json",
    prPath: "github/pull-request-842.json",
    implPath: "implementation/billing-downgrade-mr842.json",
    artifactPrefix: "mock-jira",
  },
  spec: {
    scenario: "spec-billing-downgrade-v2",
    specPath: "spec/billing-downgrade-v2.json",
    prPath: "github/pull-request-901.json",
    implPath: "implementation/billing-downgrade-spec-mr901.json",
    artifactPrefix: "mock-spec",
  },
};

export function runMockGithubFlow(
  opts: MockGithubFlowOptions = {},
): MockGithubFlowResult {
  const source = opts.source ?? "jira";
  const config = SCENARIOS[source];
  const root =
    opts.rootDir ?? join(dirname(fileURLToPath(import.meta.url)), "../..");
  const fixtures = join(root, "fixtures");

  const pr = load<MockPullRequest>(join(fixtures, config.prPath));
  const impl = load<MockImplementation>(join(fixtures, config.implPath));

  let validation: MockValidationReport;
  let assembled: ChangeBrief;

  if (source === "jira") {
    const jira = load<MockJiraIssue>(join(fixtures, config.jiraPath!));
    assembled = assembleChangeBriefFromMocks({
      jira,
      pr,
      impl,
      generatedAt: "2026-09-24T04:00:00.000Z",
      chronicleSource: "synthetic",
    });
    const check = validateChangeBrief(assembled);
    if (!check.ok) {
      throw new Error(`Assembled brief invalid: ${check.errors.join("; ")}`);
    }
    const brief = parseChangeBrief(assembled);
    validation = validateBriefAgainstJira(jira, brief);
    assembled = brief;
  } else {
    const spec = load<MockSpecDocument>(join(fixtures, config.specPath!));
    assembled = assembleChangeBriefFromMocks({
      spec,
      pr,
      impl,
      generatedAt: "2026-09-26T17:30:00.000Z",
      chronicleSource: "synthetic",
    });
    const check = validateChangeBrief(assembled);
    if (!check.ok) {
      throw new Error(`Assembled brief invalid: ${check.errors.join("; ")}`);
    }
    const brief = parseChangeBrief(assembled);
    validation = validateBriefAgainstSpec(spec, brief);
    assembled = brief;
  }

  const markdown = renderChangeBriefMarkdown(assembled);

  let artifactPaths: MockGithubFlowResult["artifactPaths"];
  if (opts.writeArtifacts) {
    const outDir = join(root, "fixtures/output");
    mkdirSync(outDir, { recursive: true });
    const p = config.artifactPrefix;
    const jsonPath = join(outDir, `${p}-brief.json`);
    const mdPath = join(outDir, `${p}-pr-comment.md`);
    const reportPath = join(outDir, `${p}-validation.json`);
    writeFileSync(jsonPath, JSON.stringify(assembled, null, 2), "utf8");
    writeFileSync(mdPath, markdown, "utf8");
    writeFileSync(reportPath, JSON.stringify(validation, null, 2), "utf8");
    artifactPaths = { json: jsonPath, markdown: mdPath, report: reportPath };
  }

  return {
    scenario: config.scenario,
    brief: assembled,
    markdown,
    validation,
    artifactPaths,
  };
}

export function runAllMockGithubFlows(
  opts: Omit<MockGithubFlowOptions, "source"> = {},
): MockGithubFlowResult[] {
  return (["jira", "spec"] as const).map((source) =>
    runMockGithubFlow({ ...opts, source }),
  );
}

export function defaultFixturesRoot(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "../..");
}

export function resolveFixturePath(root: string, ...parts: string[]): string {
  return resolve(root, "fixtures", ...parts);
}
