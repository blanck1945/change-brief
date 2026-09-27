import type { ChangeBrief } from "../core/schema.js";
import type {
  MockJiraIssue,
  MockSpecDocument,
  MockValidationReport,
  MockWorkSourceKind,
} from "./types.js";

function validateAgainstRequirementIds(
  kind: MockWorkSourceKind,
  workSourceRef: string,
  requirementIds: string[],
  requirementTexts: Map<string, string>,
  brief: ChangeBrief,
): MockValidationReport {
  const traced = brief.requirementsTraceability;
  const byRef = new Map<string, (typeof traced)[number]>();
  for (const row of traced) {
    if (row.sourceRef) byRef.set(row.sourceRef, row);
  }

  const missingFromTraceability: string[] = [];
  const requirements = requirementIds.map((id) => {
    const row = byRef.get(id);
    const text = requirementTexts.get(id) ?? id;
    if (!row) {
      missingFromTraceability.push(id);
      return { id, text, traced: false };
    }
    return {
      id,
      text,
      traced: true,
      status: row.status,
      evidence: row.evidence,
    };
  });

  const extraTraceabilityRefs = traced
    .map((r) => r.sourceRef)
    .filter((ref): ref is string => !!ref && !requirementIds.includes(ref));

  const notes: string[] = [];
  if (brief.workSource.kind !== kind) {
    notes.push(
      `brief workSource.kind is ${brief.workSource.kind}, expected ${kind}`,
    );
  }
  if (brief.workSource.ref !== workSourceRef) {
    notes.push(
      `workSource.ref (${brief.workSource.ref}) does not match ${workSourceRef}`,
    );
  }

  const ok =
    missingFromTraceability.length === 0 &&
    notes.length === 0 &&
    brief.workSource.kind === kind &&
    brief.workSource.ref === workSourceRef;

  return {
    ok,
    workSourceKind: kind,
    workSourceRef,
    pr: `${brief.mergeRequest.repo}#${brief.mergeRequest.number}`,
    requirements,
    missingFromTraceability,
    extraTraceabilityRefs,
    notes,
  };
}

export function validateBriefAgainstJira(
  jira: MockJiraIssue,
  brief: ChangeBrief,
): MockValidationReport {
  const texts = new Map(jira.acceptanceCriteria.map((a) => [a.id, a.text]));
  return validateAgainstRequirementIds(
    "jira",
    jira.key,
    jira.acceptanceCriteria.map((a) => a.id),
    texts,
    brief,
  );
}

export function validateBriefAgainstSpec(
  spec: MockSpecDocument,
  brief: ChangeBrief,
): MockValidationReport {
  const texts = new Map(spec.requirements.map((r) => [r.id, r.text]));
  return validateAgainstRequirementIds(
    "spec",
    spec.id,
    spec.requirements.map((r) => r.id),
    texts,
    brief,
  );
}
