import { z } from "zod";
import { chronicleEventType } from "../core/schema.js";

export const chronicleLineSchema = z.object({
  seq: z.number().int().min(1),
  ts: z.string(),
  type: chronicleEventType,
  whatHappened: z.string().max(400),
  decisionOrConsequence: z.string().max(400),
  actor: z.enum(["agent", "human", "system"]).optional(),
});

export type ChronicleLine = z.infer<typeof chronicleLineSchema>;

export function toImplementationChronicle(
  lines: ChronicleLine[],
): Array<{
  seq: number;
  type: z.infer<typeof chronicleEventType>;
  whatHappened: string;
  decisionOrConsequence: string;
}> {
  return lines.map((l) => ({
    seq: l.seq,
    type: l.type,
    whatHappened: l.whatHappened,
    decisionOrConsequence: l.decisionOrConsequence,
  }));
}
