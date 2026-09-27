#!/usr/bin/env node
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAllPrPreviews } from "./build-pr-preview.js";

const previewRoot = dirname(fileURLToPath(import.meta.url));
const out = join(previewRoot, "output");

console.log(`
Change Brief — MR/PR preview (mock)
===================================

1. Markdown       → Cursor Markdown preview (Ctrl+Shift+V)
2. *-gitlab.html  → GitLab-like layout (recommended if you use GitLab)
3. *.html         → GitHub-like layout
`);

const paths = buildAllPrPreviews();

console.log("\nFiles:\n");
console.log(`  Index:     ${join(out, "README.md")}`);
console.log(`  Jira MR:   ${join(out, "pr-842-jira.md")}`);
console.log(`             ${join(out, "pr-842-jira-gitlab.html")}  ← GitLab mock`);
console.log(`  Spec MR:   ${join(out, "pr-901-spec-gitlab.html")}`);
console.log(`
Also updated: fixtures/output/mock-jira-* and mock-spec-*
`);

void paths;
