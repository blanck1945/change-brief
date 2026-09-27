import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ChangeBrief } from "../core/schema.js";
import { parseChangeBrief } from "../core/validate.js";
import { chronicleFileToBriefEvents } from "../chronicle/io.js";
import { assembleChangeBriefFromMocks } from "../mock/assemble.js";
import type {
  MockImplementation,
  MockJiraIssue,
  MockPullRequest,
  MockSpecDocument,
  MockWorkSourceKind,
} from "../mock/types.js";

export interface AssembleFromMocksOptions {
  rootDir: string;
  source: MockWorkSourceKind;
  chroniclePath?: string;
  chronicleSource?: ChangeBrief["chronicleSource"];
}

const PATHS = {
  jira: {
    jira: "fixtures/jira/PROJ-1234-issue.json",
    pr: "fixtures/github/pull-request-842.json",
    impl: "fixtures/implementation/billing-downgrade-mr842.json",
  },
  spec: {
    spec: "fixtures/spec/billing-downgrade-v2.json",
    pr: "fixtures/github/pull-request-901.json",
    impl: "fixtures/implementation/billing-downgrade-spec-mr901.json",
  },
};

function load<T>(root: string, rel: string): T {
  return JSON.parse(readFileSync(join(root, rel), "utf8")) as T;
}

export function assembleFromMockFixtures(
  opts: AssembleFromMocksOptions,
): ChangeBrief {
  const { rootDir, source, chroniclePath } = opts;
  const chronicleSource =
    opts.chronicleSource ?? (chroniclePath ? "file" : "synthetic");

  function withChronicle(impl: MockImplementation): MockImplementation {
    if (!chroniclePath) return impl;
    const events = chronicleFileToBriefEvents(chroniclePath);
    if (events.length === 0) return impl;
    return { ...impl, implementationChronicle: events };
  }

  let raw: ChangeBrief;
  if (source === "jira") {
    const cfg = PATHS.jira;
    const pr = load<MockPullRequest>(rootDir, cfg.pr);
    const impl = withChronicle(load<MockImplementation>(rootDir, cfg.impl));
    const jira = load<MockJiraIssue>(rootDir, cfg.jira);
    raw = assembleChangeBriefFromMocks({
      jira,
      pr,
      impl,
      chronicleSource,
    });
  } else {
    const cfg = PATHS.spec;
    const pr = load<MockPullRequest>(rootDir, cfg.pr);
    const impl = withChronicle(load<MockImplementation>(rootDir, cfg.impl));
    const spec = load<MockSpecDocument>(rootDir, cfg.spec);
    raw = assembleChangeBriefFromMocks({
      spec,
      pr,
      impl,
      chronicleSource,
    });
  }

  return parseChangeBrief(raw);
}
