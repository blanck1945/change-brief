import type { z } from "zod";
import type { requirementStatus } from "../schema.js";

type Status = z.infer<typeof requirementStatus>;

const STATUS_EN: Record<Status, string> = {
  met: "met",
  partial: "partial",
  not_met: "not met",
  na: "n/a",
  out_of_scope: "out of scope",
};

export function statusLabel(status: Status): string {
  return STATUS_EN[status];
}

export function chronicleTypeLabel(type: string): string {
  return type;
}

export function escapeTableCell(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\n/g, " ");
}
