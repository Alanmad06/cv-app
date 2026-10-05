---
description: Implementa un nuevo feature completo (código + tests + user story para otro agente)
---

# Implementar feature

Implementa el siguiente feature en esta app: **$ARGUMENTS**

Si `$ARGUMENTS` está vacío, pide al usuario que describa el feature antes de continuar. Sigue las fases en orden; no te saltes ninguna.

Estado actual del repo (para saber qué cambios previos existen):

!`git status --short`

## Fase 0 — Contexto

1. Lee `AGENTS.md` completo: es la fuente de verdad de las convenciones de esta app. Respétalas tal cual.
2. Lee los archivos existentes relacionados con el feature antes de escribir código (componentes vecinos, actions, store, rutas similares). Reutiliza patrones ya presentes en vez de inventar nuevos.

## Fase 1 — Plan corto

Antes de editar, escribe un plan de 4-8 pasos: qué archivos crear, qué modificar, qué datos fluyen por dónde. Si el feature toca routing, server rendering o CSS, menciónalo explícitamente (afecta la verificación final).

## Fase 2 — Implementación (respetando las preferencias de la app)

Reglas obligatorias:

- **Stack**: Next.js 15 App Router + React 19 + TypeScript. Rutas de datos en server components cuando sea posible.
- **Flujo de datos**: client component → Redux thunk (`store/*.ts`, slices registrados en `store/store.ts`) → server action (`lib/actions/*.ts`, `"use server"`, validada con Zod) → Prisma singleton (`lib/db.ts`). Los datos de GitHub se leen server-side con `lib/github.ts`, nunca desde el browser.
- **UI**: primitivas de `components/ui/` — `Button` para acciones, `ButtonLink` para navegación, `Modal` para diálogos (portal, focus trap, Escape). Iconos con `aria-hidden`; todo control sin texto visible necesita `aria-label`.
- **Estilos**: Tailwind v4 CSS-first — la config vive en `app/globals.css`, NO crees `tailwind.config.js`. Usa variables CSS (`--main`, `--background`, `--foreground`) para colores dependientes del tema y `dark:` solo para superficies fijas por tema (el variant `dark` es por clase). Sin `bg-opacity-*` (v4 usa `bg-color/80`). No toques `--main` del tema `.light` sin re-verificar contraste.
- **Accesibilidad**: jerarquía de headings (`h1` de página en `Box`/`ProjectDetail`, secciones `h2`, tarjetas `h3`), `<label htmlFor>` en todo campo de formulario, errores asíncronos en `role="alert"`, `inert`/`aria-hidden` en paneles ocultos.
- **Tipos compartidos** en `interfaces/`. Alias de ruta `@/*` → raíz del repo.
- **Estilo de código**: Prettier con `.prettierrc.json` (comillas dobles, punto y coma, `trailingComma: "all"`, ancho 80). El formatter automático ya corre tras cada escritura; no pelees con él.
- Si tocas `prisma/schema.prisma`: `npx prisma migrate dev` (para eso debe estar detenido `npm run dev`).

## Fase 3 — Tests (Jest + MSW si hay HTTP)

1. Crea tests en `__tests__/`, siguiendo el estilo de `__tests__/portfolio.test.js`.
2. Mockea `@/lib/actions/*` **en ámbito de módulo** (fuera de los `it()`; `jest.mock` dentro de un `it` no se eleva). Nunca dejes que un thunk llegue a Prisma.
3. Usa `renderWithProviders` (`lib/tests/renderWithProviders.tsx`) y `setUpStore` (`store/store.ts`) para assertions de store.
4. **Mockea data cuando haga falta**: crea fixtures realistas (shapes reales de Prisma/GitHub/Zod) y compártelos dentro del archivo de test o en un fixture claro.
5. **MSW**: el scaffolding en `mocks/` existe pero está dormant (`server.listen()` comentado en `jest.setup.ts`, `initMocks()` nunca se importa). Si el feature hace HTTP:
   - Activa el wiring **en el archivo de test** (importa `server` de `mocks/node`, `beforeAll(server.listen)` / `afterEach(server.resetHandlers)` / `afterAll(server.close)`) para no afectar al resto de la suite, **o**
   - Activa el wiring global en `jest.setup.ts` solo si justificas por qué es seguro.
   - Decide, documenta la decisión en la Fase 4 y agrega handlers en `mocks/handlers.ts`.
6. Itera rápido con `npx jest __tests__/<archivo> --coverage=false`; al final corre `npm test` completo.
7. Ruido esperado: warnings de `act()` en thunks async y errores de consola de Prisma en entorno browser — no los persigas si los tests pasan.

## Fase 4 — Documenta lo difícil

- En el código: comenta el **porqué**, no el qué, en las partes difíciles de entender (tricks de render, orden de middleware, decisiones no obvias, workarounds). Un comentario en español breve basta.
- Registra cada **decisión difícil** (la alternativa descartada y por qué) — la Fase 6 la copia a la user story.

## Fase 5 — Verificación

Corre y reporta el resultado de cada uno:

```
npm run lint
npx tsc --noEmit
npm run format:check
npm test
```

Si tocaste routing, server rendering o CSS: también `npm run build` (primero detén `npm run dev` — `prisma generate` sufre `EPERM` si el dev server tiene el DLL abierto).

No hagas commit salvo que el usuario lo pida.

## Fase 6 — User story para el agente de tests

Documenta lo hecho en una **user story** dentro de `docs/user-stories/` (carpeta en la raíz del proyecto; créala si no existe):

1. **ID único**: escanea las carpetas ya existentes en `docs/user-stories/` y asigna el siguiente `US-NNNN` secuencial (la primera es `US-0001`; nunca reutilices un ID ya presente).
2. **Título**: título corto del feature en kebab-case (p. ej. `navigation-loading-skeletons`).
3. **Carpeta**: crea `docs/user-stories/<ID>-<título-en-kebab>/`.
4. **Resumen**: dentro de esa carpeta escribe `<ID>-<título-en-kebab>.md` (p. ej. `US-0001-navigation-loading-skeletons.md`) con EXACTAMENTE estas secciones, empezando por la cabecera con ID y título, y muestra el contenido completo también en tu respuesta final. Debe ser autocontenida: otro agente de IA la leerá **sin ningún contexto de esta conversación** para crear test cases y tests unificados.

```markdown
# <ID> — <Título del feature>

## 1. Feature pedido
Copia literal del input original y, si el usuario aclaró algo, de esas aclaraciones.

## 2. Qué se implementó
Resumen en prosa del comportamiento resultante (qué hace el feature, desde el punto de vista del usuario/del código que lo consume).

## 3. Archivos creados y modificados
Lista: ruta → propósito → qué cambió. Incluye tests, fixtures y handlers de MSW.

## 4. Contratos (para escribir tests sin leer toda la conversación)
- Props, tipos e interfaces relevantes (paths en `interfaces/` o archivos).
- Server actions: nombre, schema Zod, formas de éxito/error.
- Thunks/reducers: acciones de Redux, estados que cambian, payloads.
- Rutas/páginas afectadas y cómo se llegan a ellas en la UI.
- Datos externos: qué se llama (GitHub, Prisma) y con qué shape.

## 5. Decisiones difíciles
Cada decisión: qué se decidió, alternativas descartadas y por qué. Indicar qué mirar con lupa al testear.

## 6. Piezas difíciles de entender
Fragmentos de código no obvios y su intención (el comentario en código suele estar, pero repítelo aquí).

## 7. Cómo probarlo
- Comando exacto para correr solo los tests del feature.
- Pasos manuales en la UI (ruta, botón, resultado esperado).
- Estado de los mocks/datos de prueba necesarios (fixtures, handlers MSW, env vars).

## 8. Riesgos y no-hitos
Lo que NO se implementó, edge cases conocidos sin cubrir, y cualquier bug o diferencia detectado respecto a lo pedido.
```

## Respuesta final

Termina con: (a) lo que se pidió, (b) lo que se modificó (lista de archivos), (c) resultados de verificación, (d) la ruta de la user story y su contenido.
