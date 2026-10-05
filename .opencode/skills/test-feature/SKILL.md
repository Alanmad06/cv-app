---
description: Crea test cases y tests unificados de un feature a partir de su user story, sin contexto previo
---

# Testear feature

Crea test cases y tests unificados para el feature: **$ARGUMENTS**

`$ARGUMENTS` puede ser el ID de la user story (`US-0001`), su título o la ruta a su archivo (`docs/user-stories/<ID>-<título>/<ID>-<título>.md`), o la ruta a los archivos implementados. Si está vacío, o no encuentras ningún candidato obvio (busca en `docs/user-stories/`), pide al usuario la ruta de la user story o de los archivos del feature antes de continuar.

Estado actual del repo:

!`git status --short`

Toma de referencia: la user story en `docs/user-stories/<ID>-<título>/` (si existe). **No tienes el contexto de la conversación en la que el feature fue implementado**: trabaja solo con lo que está en el repo. La user story es una guía, no una verdad absoluta — verifica sus afirmaciones contra el código real y anota cualquier discrepancia que encuentres.

## Fase 1 — Reunir hechos

1. Lee `AGENTS.md` (sección Testing sobre todo) y `jest.config.ts` / `jest.setup.ts`.
2. Lee la user story del feature (si existe) y **todos** los archivos del feature: componentes, actions, thunks, types, tests existentes. No asumas comportamiento: léelo.
3. Identifica la superficie testeable: qué entradas recibe, qué sale en éxito y en error, qué estado de Redux/UI cambia, qué dependencias externas tiene (Prisma, GitHub, HTTP, `next/navigation`, `localStorage`, themes).

## Fase 2 — Diseñar los test cases (antes de escribir código)

Escribe primero una matriz de test cases en tu respuesta, cubriendo como mínimo:

- **Happy path**: el flujo principal renderiza/funciona.
- **Interacciones**: clicks, submits, navegación — qué thunk/action se dispatchea, con qué payload.
- **Estados async**: loading, éxito, error (el error debe llegar a `role="alert"` si aplica).
- **Casos borde**: datos vacíos, valores límite de inputs/Zod, doble submit.
- **Accesibilidad**: roles/nombres accesibles, labels, jerarquía de headings, `aria-*` relevantes del feature.
- **Regresión**: los comportamientos de la user story que podrían romperse.

Cada caso: nombre descriptivo en inglés (estilo `"<Sujeto> should <comportamiento>"` como los existentes), qué se afirma, y qué se mockea.

## Fase 3 — Escribir los tests unificados

1. Un solo archivo por feature en `__tests__/` (p. ej. `__tests__/<feature>.test.js`), con `describe`/`it` anidados por área. Sigue el estilo de `__tests__/portfolio.test.js`.
2. Mockea `@/lib/actions/*` (y cualquier dependencia externa) **en ámbito de módulo**, arriba del todo. Nunca dejes que un thunk llegue a Prisma o a la red real.
3. **Mockeo de data**: crea fixtures con los shapes reales (Prisma/Zod/GitHub) y aféjalos a los mocks. Si el feature consume HTTP:
   - Prefiere activar MSW **en el archivo de test**: `import { server } from "@/mocks/node"` (ajusta el path real), `beforeAll(server.listen)`, `afterEach(server.resetHandlers)`, `afterAll(server.close)`, con `server.use(...)` para los handlers de este feature.
   - Activa el wiring global en `jest.setup.ts` solo si justificas por qué no rompe la suite existente.
   - MSW está dormant a propósito; `mocks/README.md` miente sobre su integración — confía en el código.
4. Si un test de este feature necesita ejecutarse aislado del resto, debe poder correr solo: `npx jest __tests__/<feature>.test.js --coverage=false`.
5. No dupliques cobertura existente sin razón; prioriza comportamiento nuevo o frágil.

## Fase 4 — Ejecutar y depurar

1. Itera con `npx jest __tests__/<feature>.test.js --coverage=false`.
2. Al pasar, corre la suite completa `npm test` (siempre recolecta coverage, es lento) y asegúrate de no haber roto nada existente.
3. Ruido esperado: warnings `act()` en thunks async y errores de consola de Prisma en entorno browser — no los persigas si los tests pasan. Si `jest.mock` no aplica, recuerda que `moduleNameMapper` de Jest resuelve el string literal de `jest.mock("@/...")`.
4. Verificación final:

```
npm run lint
npx tsc --noEmit
npm run format:check
npm test
```

## Fase 5 — Verificación en navegador real (MCP Playwright + DevTools, si aplica)

Usa los MCPs `playwright` y `devtools` (ambos sobre Brave, ya configurados en `opencode.json`) para verificar el flujo real que Jest/jsdom no puede cubrir.

**Guardia "si aplica"**: esta fase solo corre si el feature tiene superficie visible en la UI (ruta o componente navegable). Si es lógica pura, una server action sin UI o un cambio no navegable → omítela y anota el motivo en el reporte (Fase 6).

1. **Servidor**: comprueba si `http://localhost:3000` responde. Si **ya corre, no lo toques**. Si no responde, arráncalo en background (`npm run dev`), espera a que esté listo y **menciónalo en el reporte** (el usuario decide después si lo detiene; `npm run build` con el dev server vivo sufre `EPERM` con `prisma generate`).
2. **Playwright MCP** (navegación e interacción):
   - Recorre el flujo completo del feature: click → **comprueba que el skeleton/loading aparece antes que el contenido** (es la regresión crítica si el feature toca navegación) → contenido final → navegación de vuelta.
   - Interacciones reales: clicks, teclado (Tab hasta el control y Enter — el equivalente de teclado de cada interacción), y si aplica el toggle de tema claro/oscuro (valida los colores de skeleton/contraste en ambos temas).
   - Captura screenshots como evidencia de cada paso clave.
3. **DevTools MCP** (mismo navegador):
   - **Console**: sin errores nuevos respecto al baseline de la app (los warnings conocidos —`act()`, Prisma en browser si aparecen— no cuentan como fallo).
   - **Network**: las llamadas esperadas (p. ej. `api.github.com`) con status 200, y en la segunda visita que se sirvan desde caché (ISR/revalidate).
4. **A11y en vivo**: verifica en el DOM real que los estados de carga exponen `role="status"` (y `aria-*` relevantes del feature) durante la transición.

Si el servidor o el navegador no arrancan, no bloquees: continúa al reporte marcando esta fase como ⏭️ omitida con el motivo.

## Fase 6 — Reporte

Termina con:

1. **Matriz de test cases**: caso → estado (✅ pass / ❌ fail / ⏭️ no aplicable) → archivo:línea. Incluye una fila por verificación de la Fase 5 (o `⏭️ omitida (motivo)` si no corrió).
2. **Discrepancias** entre la user story/lo esperado y el código real (si el feature tiene un bug, NO lo arregles: repórtalo).
3. **Archivos creados/modificados** (tests, fixtures, wiring de MSW).
4. **Comandos** para que otro agente reproduce: test del feature aislado y suite completa.
5. **Estado del dev server** (si se arrancó en esta sesión) y evidencia del navegador (screenshots, errores de consola/red vistos).

No hagas commit salvo que el usuario lo pida.
