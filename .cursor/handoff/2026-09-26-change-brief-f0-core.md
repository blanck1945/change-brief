# Change Brief F0-a — Núcleo offline

**Modo:** EXECUTE · ref hyper plan D9–D13  
**Scope:** B01–B06 (sin LLM, sin Guardrails)

## Criterios

- [x] `pnpm check` verde
- [x] `pnpm change-brief validate templates/example-PROJ-1234.json`
- [x] Golden: render(JSON) === example-PROJ-1234.md
- [x] `docs/TESTING.md` — cómo probar local

## Execution

- Paquete `change-brief` con zod v0.2, renderer, CLI validate/render, golden test.
- Fixture `templates/example-PROJ-1234.json` + MD regenerado.

## Verify (handoff vs diff)

- [x] `pnpm check` — pass (2 tests)
- [x] `pnpm change-brief validate templates/example-PROJ-1234.json` — OK
- [x] Golden render === `example-PROJ-1234.md`
