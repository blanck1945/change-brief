import type { ChangeBrief } from "../core/schema.js";
import type { z } from "zod";
import type { requirementStatus } from "../core/schema.js";

type Status = z.infer<typeof requirementStatus>;

export type MockWorkSourceKind = "jira" | "spec";

export interface MockJiraIssue {
  key: string;
  url: string;
  summary: string;
  description: string;
  acceptanceCriteria: Array<{ id: string; text: string }>;
}

export interface MockSpecDocument {
  id: string;
  title: string;
  specPath: string;
  specRevision: string;
  url?: string;
  requirements: Array<{ id: string; section?: string; text: string }>;
}

export interface MockPullRequest {
  repo: string;
  number: number;
  url: string;
  title: string;
  body: string;
  baseSha: string;
  headSha: string;
  labels?: string[];
}

type BriefBody = Omit<
  ChangeBrief,
  "version" | "workSource" | "mergeRequest" | "chronicleSource" | "generatedAt" | "status"
>;

export interface MockImplementation extends BriefBody {
  mockDiffSummary?: {
    filesChanged: number;
    insertions: number;
    deletions: number;
    topAreas: string[];
  };
}

export interface MockRequirementCoverage {
  id: string;
  text: string;
  traced: boolean;
  status?: Status;
  evidence?: string;
}

export interface MockValidationReport {
  ok: boolean;
  workSourceKind: MockWorkSourceKind;
  workSourceRef: string;
  pr: string;
  requirements: MockRequirementCoverage[];
  missingFromTraceability: string[];
  extraTraceabilityRefs: string[];
  notes: string[];
}
