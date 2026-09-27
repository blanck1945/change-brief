#!/usr/bin/env node
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildIntegrationTierPreviews } from "./build-previews.js";

const out = join(dirname(fileURLToPath(import.meta.url)), "output");

console.log(`
Change Brief — integration tiers (simple / medium / complex)
============================================================

Open GitLab-style mocks in a browser:

  examples/integration-tiers/output/simple-mr-gitlab.html
  examples/integration-tiers/output/medium-mr-gitlab.html
  examples/integration-tiers/output/complex-mr-gitlab.html

Index: examples/integration-tiers/output/README.md
`);

buildIntegrationTierPreviews();
console.log(`\nDone. Output folder:\n  ${out}\n`);
