#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assembleFromMockFixtures } from "../assemble/from-mocks.js";
import { appendChronicleLine, defaultChroniclePath } from "../chronicle/io.js";
import { chronicleEventType } from "../core/schema.js";
import {
  buildGitHubPublishPlan,
  formatPublishPlanDryRun,
} from "../github/publish-plan.js";
import {
  buildGitLabPublishPlan,
  formatGitLabPublishPlanDryRun,
} from "../gitlab/publish-plan.js";
import {
  runAllMockGithubFlows,
  runMockGithubFlow,
} from "../mock/run-github-mock.js";
import type { MockWorkSourceKind } from "../mock/types.js";
import type { MockValidationReport } from "../mock/types.js";
import { renderChangeBriefMarkdown } from "../core/render/markdown.js";
import { validateChangeBrief } from "../core/validate.js";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function usage(): never {
  console.error(`Usage:
  change-brief validate <file.json>
  change-brief render <file.json> [--out path.md]
  change-brief log --type <plan|discovery|...> --what TEXT --decision TEXT [--path file.jsonl] [--actor agent|human]
  change-brief assemble --source jira|spec [--chronicle path.jsonl] [--out file.json]
  change-brief publish --dry-run [--forge github|gitlab] (--brief file.json | --source jira|spec [--chronicle path.jsonl])
  change-brief mock-github [--source jira|spec|both] [--write]`);
  process.exit(2);
}

function loadJson(path: string): unknown {
  const raw = readFileSync(path, "utf8");
  return JSON.parse(raw) as unknown;
}

function argValue(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  if (i < 0) return undefined;
  return args[i + 1];
}

function printValidation(v: MockValidationReport): boolean {
  console.log(
    `Mock GitHub flow · ${v.workSourceKind} · ${v.workSourceRef} · ${v.pr}`,
  );
  console.log(`Requirement coverage: ${v.ok ? "OK" : "FAILED"}`);
  for (const req of v.requirements) {
    const st = req.traced ? req.status : "missing";
    const tail = req.evidence ? ` — ${req.evidence.slice(0, 60)}…` : "";
    console.log(`  ${req.id}: ${st}${tail}`);
  }
  if (v.missingFromTraceability.length) {
    console.error("Missing in traceability:", v.missingFromTraceability.join(", "));
  }
  if (v.extraTraceabilityRefs.length) {
    console.log("Extra refs (not on source):", v.extraTraceabilityRefs.join(", "));
  }
  return v.ok;
}

const args = process.argv.slice(2);
const cmd = args[0];
if (!cmd || cmd === "--help" || cmd === "-h") usage();

if (cmd === "log") {
  const typeRaw = argValue(args, "--type");
  if (!typeRaw) usage();
  const parsedType = chronicleEventType.safeParse(typeRaw);
  if (!parsedType.success) {
    console.error("Invalid --type");
    process.exit(1);
  }
  const what = argValue(args, "--what");
  const decision = argValue(args, "--decision");
  if (!what || !decision) usage();
  const path = resolve(process.cwd(), argValue(args, "--path") ?? defaultChroniclePath());
  const actorRaw = argValue(args, "--actor");
  const actor =
    actorRaw === "agent" || actorRaw === "human" || actorRaw === "system"
      ? actorRaw
      : undefined;
  const line = appendChronicleLine(path, {
    type: parsedType.data,
    whatHappened: what,
    decisionOrConsequence: decision,
    actor,
  });
  console.log(`Appended seq=${line.seq} → ${path}`);
  process.exit(0);
}

if (cmd === "assemble") {
  const source = argValue(args, "--source") as MockWorkSourceKind | undefined;
  if (source !== "jira" && source !== "spec") usage();
  const chronicleRel = argValue(args, "--chronicle");
  const chroniclePath = chronicleRel
    ? resolve(process.cwd(), chronicleRel)
    : undefined;
  const brief = assembleFromMockFixtures({
    rootDir: pkgRoot,
    source,
    chroniclePath,
  });
  const out = argValue(args, "--out");
  const json = JSON.stringify(brief, null, 2);
  if (out) {
    writeFileSync(resolve(process.cwd(), out), json, "utf8");
    console.log(`Wrote ${out}`);
  } else {
    process.stdout.write(json + "\n");
  }
  process.exit(0);
}

if (cmd === "publish") {
  const dryRun = args.includes("--dry-run");
  let brief;
  const briefPath = argValue(args, "--brief");
  const source = argValue(args, "--source") as MockWorkSourceKind | undefined;
  if (briefPath) {
    const v = validateChangeBrief(loadJson(resolve(process.cwd(), briefPath)));
    if (!v.ok) {
      console.error(v.errors.join("\n"));
      process.exit(1);
    }
    brief = v.data;
  } else if (source === "jira" || source === "spec") {
    const chronicleRel = argValue(args, "--chronicle");
    brief = assembleFromMockFixtures({
      rootDir: pkgRoot,
      source,
      chroniclePath: chronicleRel
        ? resolve(process.cwd(), chronicleRel)
        : undefined,
    });
  } else {
    usage();
  }
  const forge = argValue(args, "--forge") ?? "gitlab";
  if (dryRun) {
    if (forge === "gitlab") {
      console.log(formatGitLabPublishPlanDryRun(buildGitLabPublishPlan(brief)));
    } else if (forge === "github") {
      console.log(formatPublishPlanDryRun(buildGitHubPublishPlan(brief)));
    } else {
      console.error("--forge must be github or gitlab");
      process.exit(1);
    }
    process.exit(0);
  }

  if (forge !== "github") {
    console.error("Live publish is GitHub-only for now; use --dry-run for GitLab plan.");
    process.exit(2);
  }

  const { publishGitHubChangeBrief, parseGitHubRepository } = await import(
    "../github/publish.js"
  );
  const token = process.env.GITHUB_TOKEN;
  const prNum = process.env.CHANGE_BRIEF_PR_NUMBER;
  const headSha = process.env.CHANGE_BRIEF_HEAD_SHA;
  const baseSha = process.env.CHANGE_BRIEF_BASE_SHA ?? "unknown";
  if (!token || !prNum || !headSha) {
    console.error(
      "Live GitHub publish needs GITHUB_TOKEN, CHANGE_BRIEF_PR_NUMBER, CHANGE_BRIEF_HEAD_SHA (and GITHUB_REPOSITORY).",
    );
    process.exit(2);
  }
  const { owner, repo } = parseGitHubRepository();
  const result = await publishGitHubChangeBrief(
    token,
    {
      owner,
      repo,
      pullNumber: Number.parseInt(prNum, 10),
      headSha,
      baseSha,
    },
    brief,
  );
  console.log(
    `OK · comment ${result.created ? "created" : "updated"} id=${result.commentId}`,
  );
  process.exit(0);
}

if (cmd === "mock-github") {
  const write = args.includes("--write");
  const sourceIdx = args.indexOf("--source");
  let source: MockWorkSourceKind | "both" = "both";
  if (sourceIdx >= 0) {
    const val = args[sourceIdx + 1];
    if (val === "jira" || val === "spec" || val === "both") source = val;
    else usage();
  }

  try {
    const runs =
      source === "both"
        ? runAllMockGithubFlows({ writeArtifacts: write })
        : [runMockGithubFlow({ source, writeArtifacts: write })];

    let allOk = true;
    for (const result of runs) {
      console.log(`\n--- ${result.scenario} ---`);
      allOk = printValidation(result.validation) && allOk;
      if (result.artifactPaths) {
        console.log("Wrote:", result.artifactPaths.markdown);
        console.log("       ", result.artifactPaths.json);
        console.log("       ", result.artifactPaths.report);
      }
    }
    if (!write && runs.length === 1) {
      console.log("\n--- PR comment preview (first 25 lines) ---\n");
      console.log(runs[0]!.markdown.split("\n").slice(0, 25).join("\n"));
      console.log("\n... (--write to save full comment under fixtures/output/)");
    }
    process.exit(allOk ? 0 : 1);
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  }
}

const fileArg = args[1];
if (!fileArg) usage();

const filePath = resolve(process.cwd(), fileArg);

if (cmd === "validate") {
  const result = validateChangeBrief(loadJson(filePath));
  if (result.ok) {
    console.log(
      `OK · version ${result.data.version} · ${result.data.workSource.kind}:${result.data.workSource.ref}`,
    );
    process.exit(0);
  }
  console.error("Invalid Change Brief:");
  for (const e of result.errors) console.error(`  - ${e}`);
  process.exit(1);
}

if (cmd === "render") {
  const result = validateChangeBrief(loadJson(filePath));
  if (!result.ok) {
    console.error("Invalid Change Brief:");
    for (const e of result.errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  const md = renderChangeBriefMarkdown(result.data);
  const outIdx = args.indexOf("--out");
  if (outIdx >= 0) {
    const outPath = args[outIdx + 1];
    if (!outPath) usage();
    writeFileSync(resolve(process.cwd(), outPath), md, "utf8");
    console.log(`Wrote ${outPath}`);
  } else {
    process.stdout.write(md);
    if (!md.endsWith("\n")) process.stdout.write("\n");
  }
  process.exit(0);
}

usage();
