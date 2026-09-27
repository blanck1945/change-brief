import type { ChangeBrief } from "../schema.js";
import { chronicleTypeLabel, escapeTableCell, statusLabel } from "./labels.js";

function workSourceLine(b: ChangeBrief): string {
  const ws = b.workSource;
  const title = ws.title;
  if (ws.kind === "jira") {
    const link = ws.url ? `[${ws.ref}](${ws.url})` : ws.ref;
    return `**Source (\`jira\`):** ${link} — ${title}`;
  }
  const path = ws.specPath ?? ws.ref;
  const rev = ws.specRevision ? `@${ws.specRevision}` : "";
  const link = ws.url ? `[${path}${rev}](${ws.url})` : `\`${path}${rev}\``;
  return `**Source (\`spec\`):** ${link} — ${title}`;
}

function statusHuman(b: ChangeBrief): string {
  if (b.status === "ready_for_human") return "ready for human review";
  return "draft";
}

function traceabilityRollup(b: ChangeBrief): string {
  const rows = b.requirementsTraceability;
  if (rows.length === 0) return "No requirements traced.";
  const counts = new Map<string, number>();
  for (const r of rows) {
    const label = statusLabel(r.status);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const parts = [...counts.entries()].map(([label, n]) => `${n} ${label}`);
  return `${rows.length} requirement(s): ${parts.join(", ")}.`;
}

export function renderChangeBriefMarkdown(b: ChangeBrief): string {
  const lines: string[] = [];
  const ref = b.workSource.ref;
  const mr = `${b.mergeRequest.repo}#${b.mergeRequest.number}`;

  lines.push(`## Change Brief · ${ref} · ${mr}`, "");
  lines.push(`**Status:** ${statusHuman(b)}`);
  const gen = b.generatedAt ?? new Date().toISOString();
  lines.push(
    `**Generated:** ${gen} · **Base:** \`${b.mergeRequest.baseSha}\` → \`${b.mergeRequest.headSha}\``,
  );
  lines.push(workSourceLine(b));
  lines.push("");

  lines.push("### One-liner", "", b.oneLiner, "");

  lines.push("### Requirement (from source)", "", b.requirementSummary, "");

  lines.push("### Integration (what was wired)", "", b.integration.summary, "");
  if (b.integration.touchpoints?.length) {
    lines.push("| From | To | Protocol | Notes |");
    lines.push("|------|-----|----------|-------|");
    for (const t of b.integration.touchpoints) {
      lines.push(
        `| ${escapeTableCell(t.from)} | ${escapeTableCell(t.to)} | ${escapeTableCell(t.protocol ?? "—")} | ${escapeTableCell(t.notes ?? "")} |`,
      );
    }
    lines.push("");
  }
  if (b.integration.mermaid?.trim()) {
    lines.push("*Architecture / wiring:*", "");
    lines.push("```mermaid", b.integration.mermaid.trim(), "```", "");
  }
  if (b.integration.mermaidSequence?.trim()) {
    lines.push("*Happy path (verify in staging or review):*", "");
    lines.push(
      "```mermaid",
      b.integration.mermaidSequence.trim(),
      "```",
      "",
    );
  }

  lines.push("### Agent considerations", "");
  lines.push("| Question / concern | Resolution |");
  lines.push("|--------------------|------------|");
  for (const c of b.agentConsiderations) {
    lines.push(
      `| ${escapeTableCell(c.question)} | ${escapeTableCell(c.resolution)} |`,
    );
  }
  lines.push("");

  lines.push("### Worth calling out", "");
  for (const w of b.worthMentioning) {
    lines.push(`- ${w}`);
  }
  lines.push("");

  lines.push("### How to judge if this is right", "");
  if (b.humanValidation.headline?.trim()) {
    lines.push(b.humanValidation.headline.trim(), "");
  }
  lines.push("**Correct signals**");
  for (const s of b.humanValidation.correctSignals) {
    lines.push(`- ${s}`);
  }
  lines.push("");
  lines.push("**Red flags — worth blocking or escalating**");
  for (const r of b.humanValidation.redFlags) {
    lines.push(`- ${r}`);
  }
  lines.push("");
  lines.push("| Quick check | Pass if |");
  lines.push("|-------------|---------|");
  for (const q of b.humanValidation.quickChecks) {
    lines.push(
      `| ${escapeTableCell(q.action)} | ${escapeTableCell(q.passIf)} |`,
    );
  }
  lines.push("");

  lines.push("### Requirements traceability", "");
  lines.push(`*Roll-up:* ${traceabilityRollup(b)}`, "");
  lines.push("| Requirement (AC / spec §) | Status | Evidence (no line numbers) |");
  lines.push("|---------------------------|--------|------------------------------|");
  for (const r of b.requirementsTraceability) {
    const crit = r.sourceRef ? `${r.sourceRef}: ${r.criterion}` : r.criterion;
    lines.push(
      `| ${escapeTableCell(crit)} | ${statusLabel(r.status)} | ${escapeTableCell(r.evidence)} |`,
    );
  }
  lines.push("");

  lines.push("### Behavior", "");
  lines.push(`**Before:** ${b.behavior.before}`);
  lines.push(`**After:** ${b.behavior.after}`);
  if (b.behavior.featureFlags?.length) {
    const flags = b.behavior.featureFlags
      .map((f) => {
        const def = f.default ? ` default \`${f.default}\`` : "";
        const notes = f.notes ? ` (${f.notes})` : "";
        return `\`${f.name}\`${def}${notes}`;
      })
      .join("; ");
    lines.push(`**Feature flags / config:** ${flags}`);
  }
  lines.push("");

  lines.push("### Plan baseline (at task start)");
  for (const item of b.planBaseline) {
    lines.push(`- ${item}`);
  }
  lines.push("");

  if (b.implementationChronicle.length > 0) {
    lines.push("### Implementation chronicle", "");
    lines.push("| # | Type | What happened | Decision / consequence |");
    lines.push("|---|------|---------------|-------------------------|");
    for (const e of b.implementationChronicle) {
      lines.push(
        `| ${e.seq} | ${chronicleTypeLabel(e.type)} | ${escapeTableCell(e.whatHappened)} | ${escapeTableCell(e.decisionOrConsequence)} |`,
      );
    }
    lines.push("");
  }

  if (b.deviations && b.deviations.length > 0) {
    lines.push("### Deviations from plan", "");
    lines.push(
      "| Expected (ticket/plan) | What shipped instead | Reason | OK to merge? |",
    );
    lines.push("|------------------------|----------------------|--------|--------------|");
    for (const d of b.deviations) {
      const ok =
        d.acceptableForMerge === undefined
          ? "—"
          : d.acceptableForMerge
            ? "yes"
            : "no";
      lines.push(
        `| ${escapeTableCell(d.expected)} | ${escapeTableCell(d.actual)} | ${escapeTableCell(d.reason)} | ${ok} |`,
      );
    }
    lines.push("");
  }

  if (b.globalView && b.globalView.length > 0) {
    lines.push("### Global view (capabilities / architecture)", "");
    lines.push("| Capability or layer | Role in this MR | Notes |");
    lines.push("|---------------------|-----------------|-------|");
    for (const g of b.globalView) {
      lines.push(
        `| ${escapeTableCell(g.capabilityOrLayer)} | ${escapeTableCell(g.roleInMr)} | ${escapeTableCell(g.notes ?? "")} |`,
      );
    }
    lines.push("");
    if (b.anchorPoints && b.anchorPoints.length > 0) {
      lines.push("*Anchors:* " + b.anchorPoints.map((a) => `\`${a}\``).join(", "));
      lines.push("");
    }
  }

  lines.push("### Scope", "");
  lines.push("| Area | What changed (component level) |");
  lines.push("|------|--------------------------------|");
  for (const a of b.scope.areas) {
    lines.push(`| ${escapeTableCell(a.name)} | ${escapeTableCell(a.summary)} |`);
  }
  lines.push("");
  lines.push("**In scope:** " + b.scope.inScope.join("; ") + ".");
  lines.push("**Out of scope (this MR):** " + b.scope.outOfScope.join("; ") + ".");
  if (b.scope.followUp?.length) {
    lines.push("**Follow-up / explicit debt:** " + b.scope.followUp.join("; ") + ".");
  }
  lines.push("");

  if (
    b.blastRadius &&
    (b.blastRadius.usersRoles ||
      b.blastRadius.data ||
      b.blastRadius.integrations ||
      b.blastRadius.deployNotes)
  ) {
    lines.push("### Surfaces and blast radius", "");
    if (b.blastRadius.usersRoles) {
      lines.push(`- **Users / roles affected:** ${b.blastRadius.usersRoles}`);
    }
    if (b.blastRadius.data) {
      lines.push(`- **Data:** ${b.blastRadius.data}`);
    }
    if (b.blastRadius.integrations) {
      lines.push(`- **Integrations:** ${b.blastRadius.integrations}`);
    }
    if (b.blastRadius.deployNotes) {
      lines.push(`- **Deploy:** ${b.blastRadius.deployNotes}`);
    }
    lines.push("");
  }

  if (b.multiRepo?.links?.length) {
    lines.push("### Multi-repo", "");
    lines.push("| Repo | MR | Role |");
    lines.push("|------|-----|------|");
    for (const l of b.multiRepo.links) {
      lines.push(`| ${l.repo} | ${l.mr} | ${escapeTableCell(l.role)} |`);
    }
    lines.push("");
    if (b.multiRepo.mergeOrder) {
      lines.push(`**Suggested merge order:** ${b.multiRepo.mergeOrder}`, "");
    }
  }

  lines.push("### Human attention", "");
  b.humanAttention.forEach((h, i) => {
    lines.push(`${i + 1}. ${h}`);
  });
  lines.push("");

  if (b.deepDives?.length) {
    lines.push("### Deep dives (optional, max 3)", "");
    for (const d of b.deepDives) {
      lines.push(`#### ${d.title}`, "", d.body, "");
    }
  }

  lines.push("### Already covered by the quality agent", "");
  for (const c of b.qualityAgentSummary.coveredByAgent) {
    lines.push(`- ${c}`);
  }
  lines.push("");
  lines.push(
    `**Open findings (agent):** ${b.qualityAgentSummary.openFindingsCount}.`,
  );
  if (b.qualityAgentSummary.reviewUrl) {
    lines.push(`**Review:** ${b.qualityAgentSummary.reviewUrl}`);
  }
  lines.push("");
  lines.push(
    "**Human does not need to re-check:** minor style already covered by repo rules.",
  );
  lines.push("");

  lines.push("### Human reviewer checklist (~2 min)", "");
  for (const item of b.humanChecklist) {
    lines.push(`- [ ] ${item}`);
  }
  lines.push("");
  lines.push("---");
  lines.push(
    `*CBF v${b.version} · generated by Change Brief · does not replace merge approval*`,
  );

  return lines.join("\n");
}
