# Spec: billing-downgrade-v2

**Revision:** `a1b2c3d` (at implementation start)

## §3 Functional requirements

### §3.1

MUST expose self-service API for Pro → Starter downgrade.

### §3.2

MUST compute prorated credit for unused billing period.

### §3.3

MUST apply downgrade only at cycle boundary.

## §5 UX

SHOULD provide portal UI with credit preview (may ship separately).

---

Mock spec for Change Brief demo. Structured requirements live in `fixtures/spec/billing-downgrade-v2.json`.
