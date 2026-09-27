# Integration tier demos

Three mock MRs illustrate **CBF v0.4** at different integration complexity:

| Tier | Path | Command output |
|------|------|----------------|
| Simple | `examples/integration-tiers/simple/` | `output/simple-mr-gitlab.html` |
| Medium | `examples/integration-tiers/medium/` | `output/medium-mr-gitlab.html` |
| Complex | `examples/integration-tiers/complex/` | `output/complex-mr-gitlab.html` |

```bash
pnpm preview:tiers
# or billing + tiers in one hub:
pnpm preview:all
```

Hub: `examples/preview-all/output/index.html`

Each tier includes `change-brief.json`, a stub `mock-repo/`, and generated GitLab-style HTML with Mermaid diagrams.

See [`examples/integration-tiers/README.md`](../examples/integration-tiers/README.md).
