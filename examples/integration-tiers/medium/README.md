# Medium tier — AUTH-88 magic link

**Integration level:** public API + durable token store + cache/session layer + async email.

Compare to **simple:** more touchpoints, feature flag, blast radius, and a longer happy-path sequence.

**Preview:** [`../output/medium-mr-gitlab.html`](../output/medium-mr-gitlab.html) (after `pnpm preview:tiers`).

The billing downgrade demo in [`../../mock-workspace/`](../../mock-workspace/) is a similar “medium” shape (API + DB + worker + third party).
