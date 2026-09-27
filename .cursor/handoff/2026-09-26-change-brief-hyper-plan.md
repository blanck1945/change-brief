# Change Brief — Hyper Plan (PLAN-ONLY)

| Campo | Valor |
|---|---|
| **Archivo** | `C:\Users\elabu\Desktop\side-apps\change-brief\.cursor\handoff\2026-09-26-change-brief-hyper-plan.md` |
| **Creado** | 2026-09-26 |
| **Rol** | Baking · planner-hyper (sustituto `ai-architect`; Fable no disponible por policy) |
| **Modo** | PLAN-ONLY. No se ejecutó código ni se modificó el repo en el subagent. |
| **Supersede** | Backlog §5 de `.cursor/handoff/2026-09-24-change-brief-foundation.md` (B01–B06 → B01–B20) |
| **Gate** | `.cursor/baking/required.json` → `bakingRequired: true`, `strict: true` |
| **Repo hermano** | `../codereview-ai/guardrails` |
| **Idioma de salida del brief** | El de la fuente de trabajo (D4) |

---

## 1. Resumen ejecutivo

Change Brief tiene **concepto y formato cerrados**; **cero runtime**. Tres brechas críticas:

1. **Crónica sin productor** — sin ella el brief = resumen del diff.
2. **Guardrails hoy = GitHub** — GitLab no existe en el camino cloud.
3. **Contratos faltantes** — `qualityReview` estructurado; schema con deprecados y campos opcionales que la visión exige.

**Arquitectura elegida:** paquete TS + CLI en `change-brief/` (núcleo sin I/O), consumido por Guardrails como **segundo job** del mismo webhook. Crónica en `.change-brief/chronicle.jsonl` en el branch.

---

## 2. Inventario

| # | Artefacto | Estado |
|---|-----------|--------|
| 1–10 | Docs, schema, ejemplo, prompt, README, AGENTS, foundation handoff, Baking strict | ✅ HECHO (ejemplo ⚠️ incompleto vs FORMAT; schema con deuda) |
| 11–22 | package, renderer, sources, chronicle, LLM, CLI, Guardrails job, eval, GitLab | ❌ FALTA |

Detalle completo en secciones 2–6 del plan original del hyper pass (tablas B01–B20, gaps G1–G11, contrato §7).

---

## 3. Roadmap F0–F3

| Fase | Objetivo | Gate |
|------|----------|------|
| **F0** | Núcleo offline: schema v0.2, renderer, CLI validate/render | Golden JSON→MD |
| **F1** | workSource, crónica + `log`, Jira/spec, generador LLM, guardas | 3 briefs locales con crónica real |
| **F2** | Job Guardrails, check neutral, comentario idempotente, qualityReview | 1 PR dogfood end-to-end |
| **F3** | Multi-repo, eval humana, GitLab o ADR out-of-scope | Mediana utilidad ≥4/5 |

---

## 4. Backlog B01–B20 (resumen)

| IDs | Contenido |
|-----|-----------|
| B01–B06 | Scaffold TS, schema v0.2, zod, fixtures, renderer, CLI render/validate |
| B07–B13 | Crónica JSONL, ingest Baking, spec/jira resolve, generate + guards |
| B14–B17 | QualityReviewSummary, change-brief-job, publish, config + dedupe |
| B18–B20 | Siblings multi-repo, eval 10 casos, GitLab o ADR |

DoD por ítem: ver tabla completa en versión extendida (commit de este archivo — secciones 6–10 abajo).

---

## 5. Próximo EXECUTE (slice F0-a)

**B01 + B02 + B04 + B05 + B06** — handoff dedicado `2026-09-2X-change-brief-f0-core.md`, **planner → executor-cursor**, verify `pnpm check` + golden render.

---

## 6. Decisiones humanas (2026-09-26)

| # | Tema | Decisión |
|---|------|----------|
| D9 | **Dónde vive el entregable** | Como un **MR hoy**: lo óptimo es **GitHub** (comentario fijado + check neutral). Fallback: **URL aparte** (dashboard / artefacto) si GitHub no alcanza. La crónica *durante* el trabajo es input del generador; lo durable para el humano es el **brief en el PR**, no obligar un archivo en `main`. |
| D10 | **Forge** | **Solo GitHub** (2026). GitLab fuera de scope → B20 = ADR, no implementar. |
| D11 | **Jira** | **Fuera de scope** de integración/auth; **asumir data disponible** (fixture, body del MR, o inyección manual/CI). B10 pasa a “adapter opcional / mock”. |
| D12 | **Cuándo generar y quién paga** | En cada **push al branch del PR** (`pull_request` `opened` + `synchronize`) — mismo ritmo que el MR se actualiza. Publicar **directo en GitHub**. Costo **del lado del usuario/instalación**: API key propia; modelo default **`z.ai` / `5.3-flash`** cuando el billing va por el stack GitHub/Guardrails. |
| D13 | **Schema** | **Solo v0.2** en código nuevo; migrar fixtures/ejemplo; sin reader v0.1 en prod (aún no hay). |

### Nota D9 (qué preguntábamos en #1)

No era “¿mergeamos un log a main?”. Era: **¿dónde mira el revisor la historia final?** Respuesta: **en el PR en GitHub** (ideal). URL aparte solo como espejo o si no hay App/check.

### Nota D12 (push vs MR)

“Push” en GitHub ≈ **actualizar el PR** (`synchronize`), no necesariamente push a `main`. Generar en ese momento y **subir el brief al PR** evita SaaS centralizado y alinea el costo con la key del repo/instalación.

---

## 7. Backlog detallado B01–B20

| ID | Fase | Tarea | DoD (corto) |
|----|------|-------|-------------|
| B01 | F0 | Scaffold pnpm/vitest/tsc alineado Guardrails | `pnpm check` verde |
| B02 | F0 | Schema v0.2, limpiar deprecados, required crónica/baseline | ajv + FORMAT |
| B03 | F0 | zod ↔ schema parity test | sin drift |
| B04 | F0 | Fixtures JSON + MD completos UTF-8 | 14 secciones FORMAT |
| B05 | F0 | `render/markdown.ts` + golden | byte-equal |
| B06 | F0 | CLI validate/render | exit codes |
| B07 | F1 | `chronicle.jsonl` + `change-brief log` | append atómico |
| B08 | F1 | ingest handoffs Baking | eventos `plan` |
| B09 | F1 | resolver spec + specRevision diff | requirements + deviation |
| B10 | F1 | resolver Jira (env token) | fixture + live |
| B11 | F1 | `resolveWorkSource` | 8 casos test |
| B12 | F1 | generate LLM AI SDK 7 | JSON válido <90s |
| B13 | F1 | guards anti-alucinación | tests deterministas |
| B14 | F2 | `QualityReviewSummary` en Guardrails | tests verdes |
| B15 | F2 | `change-brief-job.ts` | fixture webhook |
| B16 | F2 | check + comentario idempotente | 1 comment edit |
| B17 | F2 | config base + dedupe | no self-disable |
| B18 | F3 | sibling MRs | 2 repos epic |
| B19 | F3 | eval 10 PRs | mediana ≥4 |
| B20 | F3 | GitLab adapter **o** ADR | decisión explícita |

---

## 8. Contrato Guardrails (resumen)

- Mismo `TarballWorkspace`, dedupe, Octokit; brief **después** del review (o comparte workspace).
- `QualityReviewSummary` → sección "ya cubierto".
- Fallo brief ≠ fallo Guardrails; check brief siempre **neutral**.
- Idempotencia: `{repo}:{mr}:{headSha}:change-brief` + marker HTML en comentario.

Interfaces TypeScript: ver hyper pass completo (archivo fuente en sesión Baking 2026-09-26).

---

## 9. Riesgos (top)

| Riesgo | Mitigación |
|--------|------------|
| Crónica vacía | B08 + regla agente + `confidence: low` |
| `met` sin evidencia | B13 + checklist humano |
| Timeout Vercel | steps budget; retry on synchronize |
| PII en crónica | sanitizar como secrets Guardrails |

---

## Verify (PLAN-ONLY)

Plan documentado; repo product sin cambios de código en este run — N/A handoff-vs-diff.
