# Change Brief — Foundation (PLAN-ONLY)

**Creado:** 2026-09-24  
**Pedido:** formato amigable vía agente que explique cambio y alcance para revisores humanos; calidad de código la valida otro agente; multi-repo + Jira detallado pero opaco en alcance.  
**Modo:** PLAN-ONLY + scaffold de docs (sin implementación cloud aún).  
**Relación:** complemento de `codereview-ai/guardrails` (Greptile-like).

---

## 1. Problema

| Actor | Dolor |
|-------|--------|
| Revisor humano | Ticket Jira largo ≠ mapa mental del MR; difícil ver qué quedó afuera y blast radius |
| Autor | Repite contexto en cada MR; multi-repo empeora |
| Agente de calidad | Excelente en bugs/reglas; no debe ser la única narrativa de **intención y alcance** |

**Hipótesis:** una capa **Change Brief** fija en el MR reduce tiempo de review humano a validación de scope/riesgo (~2–5 min), dejando el diff para casos puntuales.

---

## 2. Solución propuesta

**CBF (Change Brief Format) v0.1** — ver `docs/FORMAT.md` + JSON schema.

Pipeline objetivo (fases):

```
PR opened/updated
  → fetch Jira (issue + AC + links)
  → fetch sibling MRs (Jira remote links / fixVersion / label)
  → agente exploración acotada (Workspace compartido con Guardrails)
  → emit JSON (schema) + Markdown
  → publicar: comentario pinned / check neutral "Change Brief"
  → (opcional) mirror Confluence bajo epic
```

**Separación de checks GitHub/GitLab:**

| Check / artefacto | Owner | Conclusión |
|-------------------|-------|------------|
| Guardrails | agente calidad | neutral + comentarios inline |
| Change Brief | agente alcance | neutral — no bloquea merge |

---

## 3. Decisiones (v0.1)

| # | Decisión | Elección | Por qué |
|---|----------|----------|---------|
| D1 | Granularidad | Componente / contrato / flujo | Legible para humano sin ser diff |
| D2 | Trazabilidad | Tabla AC ↔ evidencia comportamental | Cierra gap Jira ↔ código |
| D3 | Salida dual | JSON + Markdown | JSON para UI/dashboard; MD para MR |
| D4 | Idioma | Igual que ticket Jira | Menos fricción en equipos mixtos |
| D5 | Multi-repo | Sección obligatoria si >1 MR detectado | Orden de merge explícito |
| D6 | No duplicar Guardrails | Sección "ya cubierto por agente" | Evita re-review de estilo |
| D7 | Confianza | `confidence` + `assumptions` | Honestidad cuando falta contexto |
| D8 | Proceso | **`baking require on` strict** | Todo backlog B01+ solo vía Baking (handoff + metrics) |

**Descartado por ahora:** brief como único comentario del bot (mezcla roles); walkthrough por archivo; bloquear merge por brief.

---

## 4. Integración con Guardrails (futuro)

Reusar de `guardrails/` cuando exista:

- `Workspace` + sandbox clone
- Webhook dedupe + workflow
- Agente `summary` separado del loop de findings (nuevo prompt `change-brief`, no `report_findings`)

Contrato sugerido:

```ts
generateChangeBrief(input: {
  workspace: Workspace;
  diff: ParsedDiff;
  jira: JiraIssue;
  siblingMrs: MergeRequestRef[];
  qualityReview?: { summary: string; openFindings: number; url?: string };
}): ChangeBrief; // schema v0.1
```

---

## 5. Backlog (priorizado)

| ID | Tarea | Criterio de hecho |
|----|-------|-------------------|
| B01 | Renderer MD ← JSON | Golden test con `example-PROJ-1234` |
| B02 | CLI local `change-brief generate --jira PROJ-1234 --repo .` | Imprime MD en stdout |
| B03 | Jira client (API token / OAuth) | AC parseados en traceability |
| B04 | GitHub/GitLab: post pinned comment | Idempotente por headSha |
| B05 | Detección sibling MRs | ≥1 epic con 2 repos de prueba |
| B06 | Eval: 10 tickets reales, humano puntúa utilidad 1–5 | Mediana ≥4 |

---

## 6. Riesgos

- **Alucinación de AC cumplidos** → mitigar con status `partial` + assumptions; humano checklist obligatorio.
- **Costo doble** (Guardrails + Brief) → brief con Haiku/triage + budget bajo; compartir context pack indexado.
- **MR sin ticket** → brief degradado: scope solo desde diff + pedir link Jira en checklist.

---

## 7. Entregables de esta sesión (scaffold)

- [x] Carpeta `change-brief/` con README, FORMAT, schema, ejemplo, prompt, este handoff

## Verify (PLAN-ONLY)

Scaffold presente; decisiones documentadas; sin código runtime aún — N/A diff verify.
