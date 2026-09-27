import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import {
  appendChronicleLine,
  readChronicleFile,
  chronicleFileToBriefEvents,
} from "../../src/chronicle/io.js";

describe("chronicle io", () => {
  it("appends and reads JSONL", () => {
    const dir = mkdtempSync(join(tmpdir(), "cb-chronicle-"));
    const path = join(dir, "c.jsonl");
    try {
      appendChronicleLine(path, {
        type: "discovery",
        whatHappened: "Found X",
        decisionOrConsequence: "Did Y",
        actor: "agent",
      });
      appendChronicleLine(path, {
        type: "decision",
        whatHappened: "Chose A",
        decisionOrConsequence: "Because B",
      });
      const lines = readChronicleFile(path);
      expect(lines).toHaveLength(2);
      expect(lines[0]!.seq).toBe(1);
      expect(lines[1]!.seq).toBe(2);
      const events = chronicleFileToBriefEvents(path);
      expect(events[0]!.type).toBe("discovery");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
