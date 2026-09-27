import { z } from "zod";

export const chronicleEventType = z.enum([
  "plan",
  "discovery",
  "pivot",
  "decision",
  "scope_change",
  "blocker",
]);

export const requirementStatus = z.enum([
  "met",
  "partial",
  "not_met",
  "na",
  "out_of_scope",
]);

export const integrationTouchpointSchema = z.object({
  from: z.string(),
  to: z.string(),
  protocol: z.string().optional(),
  notes: z.string().max(280).optional(),
});

export const agentConsiderationSchema = z.object({
  question: z.string().max(400),
  resolution: z.string().max(500),
});

export const humanValidationCheckSchema = z.object({
  action: z.string().max(350),
  passIf: z.string().max(350),
});

export const humanValidationSchema = z.object({
  headline: z.string().max(500).optional(),
  correctSignals: z.array(z.string()).min(2).max(8),
  redFlags: z.array(z.string()).min(1).max(8),
  quickChecks: z.array(humanValidationCheckSchema).min(2).max(10),
});

export const changeBriefSchema = z.object({
  version: z.literal("0.4"),
  status: z.enum(["draft", "ready_for_human"]).optional(),
  generatedAt: z.string().optional(),
  chronicleSource: z.enum(["file", "baking", "none", "synthetic"]).optional(),
  workSource: z.object({
    kind: z.enum(["jira", "spec"]),
    ref: z.string(),
    title: z.string(),
    url: z.string().url().optional(),
    specPath: z.string().optional(),
    specRevision: z.string().optional(),
  }),
  mergeRequest: z.object({
    repo: z.string(),
    number: z.number().int(),
    url: z.string().url(),
    baseSha: z.string(),
    headSha: z.string(),
  }),
  oneLiner: z.string().max(400),
  requirementSummary: z.string().max(1200),
  integration: z.object({
    summary: z.string().max(1200),
    mermaid: z.string().max(8000).optional(),
    mermaidSequence: z.string().max(8000).optional(),
    touchpoints: z.array(integrationTouchpointSchema).max(12).optional(),
  }),
  agentConsiderations: z.array(agentConsiderationSchema).min(1).max(12),
  worthMentioning: z.array(z.string()).min(1).max(10),
  humanValidation: humanValidationSchema,
  planBaseline: z.array(z.string()).max(8),
  implementationChronicle: z
    .array(
      z.object({
        seq: z.number().int().min(1),
        type: chronicleEventType,
        whatHappened: z.string().max(400),
        decisionOrConsequence: z.string().max(400),
      }),
    )
    .max(20),
  deviations: z
    .array(
      z.object({
        expected: z.string(),
        actual: z.string(),
        reason: z.string(),
        acceptableForMerge: z.boolean().optional(),
      }),
    )
    .optional(),
  globalView: z
    .array(
      z.object({
        capabilityOrLayer: z.string(),
        roleInMr: z.string().max(280),
        notes: z.string().optional(),
      }),
    )
    .optional(),
  anchorPoints: z.array(z.string()).max(5).optional(),
  scope: z.object({
    areas: z
      .array(
        z.object({
          name: z.string(),
          summary: z.string().max(280),
        }),
      )
      .max(12),
    inScope: z.array(z.string()).max(8),
    outOfScope: z.array(z.string()).max(8),
    followUp: z.array(z.string()).optional(),
  }),
  requirementsTraceability: z.array(
    z.object({
      criterion: z.string(),
      sourceRef: z.string().optional(),
      status: requirementStatus,
      evidence: z.string().max(500),
    }),
  ),
  behavior: z.object({
    before: z.string(),
    after: z.string(),
    featureFlags: z
      .array(
        z.object({
          name: z.string(),
          default: z.string().optional(),
          notes: z.string().optional(),
        }),
      )
      .optional(),
  }),
  blastRadius: z
    .object({
      usersRoles: z.string().optional(),
      data: z.string().optional(),
      integrations: z.string().optional(),
      deployNotes: z.string().optional(),
    })
    .optional(),
  multiRepo: z
    .object({
      links: z
        .array(
          z.object({
            repo: z.string(),
            mr: z.string(),
            role: z.string(),
          }),
        )
        .optional(),
      mergeOrder: z.string().optional(),
    })
    .optional(),
  humanAttention: z.array(z.string()).min(1).max(7),
  deepDives: z
    .array(
      z.object({
        title: z.string(),
        body: z.string().max(1200),
      }),
    )
    .max(3)
    .optional(),
  qualityAgentSummary: z.object({
    coveredByAgent: z.array(z.string()).max(6),
    openFindingsCount: z.number().int().min(0),
    reviewUrl: z.string().url().optional(),
  }),
  humanChecklist: z.array(z.string()).min(4).max(7),
  assumptions: z.array(z.string()).optional(),
  confidence: z
    .object({
      overall: z.enum(["high", "medium", "low"]),
      notes: z.string().optional(),
    })
    .optional(),
});

export type ChangeBrief = z.infer<typeof changeBriefSchema>;
