#!/usr/bin/env node
import { buildAllPreviewsHub } from "./build-index.js";

console.log(`
Change Brief — preview:all
==========================

1. Rebuilds billing MR previews (mock-workspace)
2. Rebuilds integration tier previews (simple / medium / complex)
3. Writes a single HTML hub with links to everything
`);

const { indexPath } = buildAllPreviewsHub();

console.log(`
Open in browser:

  ${indexPath}

Tip: double-click index.html or: start "" "${indexPath.replace(/\//g, "\\")}"
`);
