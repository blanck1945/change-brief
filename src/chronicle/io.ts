import { appendFileSync, readFileSync, existsSync } from "node:fs";
import { chronicleLineSchema, toImplementationChronicle, type ChronicleLine } from "./schema.js";

const DEFAULT_PATH = ".change-brief/chronicle.jsonl";

export function defaultChroniclePath(): string {
  return DEFAULT_PATH;
}

export function readChronicleFile(path: string): ChronicleLine[] {
  if (!existsSync(path)) return [];
  const raw = readFileSync(path, "utf8");
  const lines: ChronicleLine[] = [];
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    lines.push(chronicleLineSchema.parse(JSON.parse(t)));
  }
  lines.sort((a, b) => a.seq - b.seq);
  return lines;
}

export function nextSeq(existing: ChronicleLine[]): number {
  if (existing.length === 0) return 1;
  return Math.max(...existing.map((l) => l.seq)) + 1;
}

export function appendChronicleLine(
  path: string,
  entry: Omit<ChronicleLine, "seq" | "ts"> & { seq?: number; ts?: string },
): ChronicleLine {
  const existing = readChronicleFile(path);
  const line: ChronicleLine = chronicleLineSchema.parse({
    seq: entry.seq ?? nextSeq(existing),
    ts: entry.ts ?? new Date().toISOString(),
    type: entry.type,
    whatHappened: entry.whatHappened,
    decisionOrConsequence: entry.decisionOrConsequence,
    actor: entry.actor,
  });
  appendFileSync(path, JSON.stringify(line) + "\n", "utf8");
  return line;
}

export function chronicleFileToBriefEvents(path: string) {
  return toImplementationChronicle(readChronicleFile(path));
}
