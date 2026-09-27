import { changeBriefSchema, type ChangeBrief } from "./schema.js";

export function parseChangeBrief(input: unknown): ChangeBrief {
  return changeBriefSchema.parse(input);
}

export function validateChangeBrief(input: unknown): {
  ok: true;
  data: ChangeBrief;
} | {
  ok: false;
  errors: string[];
} {
  const result = changeBriefSchema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  const errors = result.error.issues.map(
    (i) => `${i.path.join(".") || "(root)"}: ${i.message}`,
  );
  return { ok: false, errors };
}
