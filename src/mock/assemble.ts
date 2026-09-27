import type { ChangeBrief } from "../core/schema.js";
import type {
  MockImplementation,
  MockJiraIssue,
  MockPullRequest,
  MockSpecDocument,
} from "./types.js";

export interface AssembleMocksInput {
  pr: MockPullRequest;
  impl: MockImplementation;
  jira?: MockJiraIssue;
  spec?: MockSpecDocument;
  generatedAt?: string;
  chronicleSource?: ChangeBrief["chronicleSource"];
}

export function assembleChangeBriefFromMocks(input: AssembleMocksInput): ChangeBrief {
  const { pr, impl, jira, spec } = input;
  if (jira && spec) {
    throw new Error("Provide either jira or spec, not both");
  }
  if (!jira && !spec) {
    throw new Error("Provide jira or spec work source");
  }

  const workSource = jira
    ? {
        kind: "jira" as const,
        ref: jira.key,
        title: jira.summary,
        url: jira.url,
      }
    : {
        kind: "spec" as const,
        ref: spec!.id,
        title: spec!.title,
        url: spec!.url,
        specPath: spec!.specPath,
        specRevision: spec!.specRevision,
      };

  const confidenceNote = jira
    ? "Assembled from mock Jira + mock implementation fixtures"
    : "Assembled from mock spec + mock implementation fixtures";

  return {
    version: "0.4",
    status: "ready_for_human",
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    chronicleSource: input.chronicleSource ?? "synthetic",
    workSource,
    mergeRequest: {
      repo: pr.repo,
      number: pr.number,
      url: pr.url,
      baseSha: pr.baseSha,
      headSha: pr.headSha,
    },
    oneLiner: impl.oneLiner,
    requirementSummary: impl.requirementSummary,
    integration: impl.integration,
    agentConsiderations: impl.agentConsiderations,
    worthMentioning: impl.worthMentioning,
    humanValidation: impl.humanValidation,
    planBaseline: impl.planBaseline,
    implementationChronicle: impl.implementationChronicle,
    deviations: impl.deviations,
    globalView: impl.globalView,
    anchorPoints: impl.anchorPoints,
    scope: impl.scope,
    requirementsTraceability: impl.requirementsTraceability,
    behavior: impl.behavior,
    blastRadius: impl.blastRadius,
    multiRepo: impl.multiRepo,
    humanAttention: impl.humanAttention,
    deepDives: impl.deepDives,
    qualityAgentSummary: impl.qualityAgentSummary,
    humanChecklist: impl.humanChecklist,
    assumptions: impl.assumptions,
    confidence: impl.confidence ?? {
      overall: "high",
      notes: confidenceNote,
    },
  };
}
