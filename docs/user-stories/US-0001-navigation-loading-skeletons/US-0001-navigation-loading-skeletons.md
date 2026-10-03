# US-0001 — Navigation loading states (skeletons al navegar)

## 1. Feature pedido

Input literal del usuario:

> when clicking buttons like the know more in the first page / and the projects
> that fetch a github project, the app waits for the call/ request to be
> completed, since we don't have an loading page, check if we can implement it
> or use the skeletons, the ideal will be to navigate directly to the page and
> load the skeletons till the requests is fullfilled

Aclaraciones del usuario durante la planificación:

- Alcance para `/portfolio`: **plan completo** — no solo `loading.tsx`, sino
  también reestructurar la page para que el shell (Who I am, Skills, Timeline,
  Contacts) se pinte antes de esperar a GitHub.
- Accesibilidad: **unificar ambos skeletons** con `role="status"` + texto
  `sr-only` (mejorar también el `ProjectSkeleton` existente).

## 2. Qué se implementó

Antes: al pulsar "Know More" (home → `/portfolio`) o una tarjeta de proyecto
(home/portfolio → `/projects/[name]`), la navegación del App Router **no
commiteaba la ruta nueva hasta que el server component terminaba su fetch**,
porque no había `loading.tsx` en ningún segmento y `/portfolio` hacía el fetch
en el top level sin ningún `Suspense`. El usuario veía la página vieja
congelada (sin feedback) durante las llamadas a GitHub.

Ahora:

- **`/portfolio`**: al hacer click, la ruta se commitea al instante y muestra
  `PortfolioSkeleton` (barra de título, filtros y 4 tarjetas pulsantes). El
  shell de la página se pinta de inmediato; solo la sección Projects espera a
  `fetchPortfolioProjects()` dentro de un `Suspense` interno. Cuando GitHub
  resuelve, la rejilla real reemplaza al skeleton.
- **`/projects/[name]`**: al hacer click, la ruta se commitea al instante con
  `loading.tsx` que renderiza el `ProjectSkeleton` **dentro del mismo `<main>`
  con fondo `#313131`** de la page (sin destello del fondo del layout). El
  `Suspense` interno que ya existía se mantiene.
- Ambos skeletons exponen `role="status"` con texto `sr-only` ("Loading
  projects" / "Loading project") para lectores de pantalla; los bloques
  decorativos llevan `aria-hidden`.

Flujo de datos intacto: sigue siendo server-side (`lib/github.ts`, nunca desde
el browser), ISR `revalidate = 3600` sin cambios, sin tocar Prisma, store ni
actions.

## 3. Archivos creados y modificados

- `components/PortfolioSkeleton.tsx` → **nuevo**. Fallback de dos sitios
  (Suspense interno + `loading.tsx` de `/portfolio`). Bloques con
  `bg-foreground/10` (tema-aware). Export default: `PortfolioSkeleton()`.
- `app/portfolio/loading.tsx` → **nuevo**. Fallback del segmento; envuelve el
  skeleton en el mismo div raíz de la page
  (`bg-background relative px-4 pt-10 pb-10`) para no saltar layout.
- `app/projects/[name]/loading.tsx` → **nuevo**. Fallback del segmento;
  renderiza `ProjectSkeleton` dentro de
  `<main className="container h-full min-w-[100vw] bg-[#313131] px-5 py-8">`
  (idéntico al de la page). Export default: `Loading()`.
- `app/portfolio/page.tsx` → **modificado**. Ya no es `async` ni hace fetch en
  el cuerpo; el fetch subió al child async `PortfolioProjects()` dentro de
  `<Suspense fallback={<PortfolioSkeleton />}>`. Añadidos imports de
  `Suspense` y `PortfolioSkeleton`.
- `components/ProjectSkeleton.tsx` → **modificado**. Añadido
  `role="status"` + `<span className="sr-only">Loading project</span>` en el
  contenedor raíz. Nada más cambia.
- `__tests__/loading-skeletons.test.js` → **nuevo**. 7 tests (ver sección 7).
  Sin fixtures ni handlers MSW: no hay HTTP bajo test.
- `docs/user-stories/US-0001-navigation-loading-skeletons/US-0001-navigation-loading-skeletons.md` → **nuevo** (este archivo).

No se modificó: `lib/github.ts`, `store/`, `lib/actions/`, `prisma/`,
`jest.setup.ts`, `mocks/`.

## 4. Contratos (para escribir tests sin leer toda la conversación)

- **`PortfolioSkeleton`** (`components/PortfolioSkeleton.tsx`): sin props,
  export default function. Render: `<section role="status">` con
  `<span class="sr-only">Loading projects</span>` + contenedor
  `aria-hidden="true"` que contiene 3 barras de título/filtros y un
  `.grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4` con **4** hijos
  (`min-h-40`, clase base `animate-pulse rounded-md bg-foreground/10`).
- **`ProjectSkeleton`** (`components/ProjectSkeleton.tsx`): sin props,
  export default, `"use client"`. Render: `<div role="status">` con
  `<span class="sr-only">Loading project</span>` y bloques `bg-gray-200`
  hardcodeados (vive sobre fondo fijo `#313131`).
- **`app/portfolio/loading.tsx`**: export default `Loading()` →
  `<div class="bg-background relative px-4 pt-10 pb-10">` envolviendo
  `PortfolioSkeleton`.
- **`app/projects/[name]/loading.tsx`**: export default `Loading()` →
  `<main class="container h-full min-w-[100vw] bg-[#313131] px-5 py-8">`
  envolviendo `ProjectSkeleton`.
- **`app/portfolio/page.tsx`**: export default `Portfolio()` **ya no es
  async** (importante: un test puede invocarla síncronamente). El árbol
  retornado contiene, como hijo directo del div raíz, un elemento
  `Suspense` cuyo `props.fallback.type === PortfolioSkeleton` y cuyo
  `props.children` es el elemento `<PortfolioProjects />` (child async, no
  ejecutado hasta que React lo resuelva). Exporta también
  `metadata = { title: "Portfolio" }` y `revalidate = 3600`.
- **Child async `PortfolioProjects()`** (no exportado): hace
  `await fetchPortfolioProjects()` de `@/lib/github` y renderiza
  `<PortfolioC id="portfolio" projects={projects} />`. Al no estar exportado,
  solo se cubre indirectamente.
- **Rutas afectadas**: `/` (botón "Know More" de `PhotoBox` →
  `ButtonLink href="/portfolio"`, texto visible "Know More"), `/portfolio`
  (tarjetas con `router.push(/projects/${title})` o `<Link>` en el `h3`),
  `/projects/[name]`.
- **Datos externos**: `fetchPortfolioProjects()` (N+1 a
  `api.github.com/users/Alanmad06/repos` + README por repo, cache 1h,
  devuelve `Portfolio[]`, `[]` en error) — server-only, **nunca** llega al
  jsdom de los tests.

## 5. Decisiones difíciles

1. **`loading.tsx` (segmento) Y `Suspense` interno hacen trabajos distintos
   — no es redundancia.** El `loading.tsx` es lo que commitea la navegación
   al instante al hacer click (boundary del segmento); el `Suspense` interno
   da granularidad: en `/portfolio` pinta el shell antes de que GitHub
   responda, y en `/projects/[name]` permite que el `<main>` llegue junto
   con el skeleton. **Al testear**: si solo existiera uno de los dos,
   reaparecería el bloqueo original. Descartada la opción mínima (solo
   `loading.tsx`) porque toda `/portfolio` habría sido skeleton hasta que
   GitHub resuelve (N+1 llamadas).
2. **El fetch subió del cuerpo de la page a un child async.** Alternativa
   descartada: mantener `await` en el top level de `Portfolio()` — con eso,
   ningún contenido se pinta hasta el último fetch. **Al testear**: el
   `PortfolioPage()` invocado en tests no debe lanzar ni devolver una
   promesa (si vuelve a ser async, este test rompe).
3. **`PortfolioSkeleton` usa `bg-foreground/10` (variable de tema) y
   `ProjectSkeleton` conserva `bg-gray-200`.** Diferente a propósito:
   `/portfolio` va sobre `bg-background` (cambia con el tema, clase
   `.light`/`.dark`), el skeleton gris hardcodeado se vería mal en tema
   claro; `/projects/[name]` vive sobre `bg-[#313131]` fijo, donde el
   original ya funciona. **Al testear**: no "unificar" los colores entre
   skeletons sin re-verificar ambos fondos.
4. **`loading.tsx` de `/projects/[name]` replica el `<main>` de la page.**
   Sin él, el fallback se renderiza dentro del layout (fondo
   `--background` = gris) y se ve un destello antes del `#313131`. Descartado
   `next.config.ts` `experimental.ppr` (cambiaría el modelo de render de
   toda la app para este problema).
5. **MSW NO se activó.** Decisión: ningún componente bajo test hace HTTP en
   jsdom (los loaders de GitHub son server-only y se prueban por separado si
   acaso; la page se verifica por estructura, no por render del fetch). Por
   eso `jest.setup.ts` y `mocks/handlers.ts` quedaron intactos y el wiring
   global sigue comentado. **Al testear**: si algún test nuevo necesita
   HTTP, actívalo _scoped al archivo de test_, no globalmente.
6. **El test de estructura invoca `PortfolioPage()` en vez de renderizarla.**
   Renderizarla ejecutaría el child async (fetch real a GitHub desde
   jsdom) y React 19 no resuelve server components en el client renderer.
   Descartado también `react-test-renderer` (deprecado). **Al testear**: el
   árbol se inspecciona a nivel de elementos (`tree.props.children`), no con
   `render()`.

## 6. Piezas difíciles de entender

- **`children.find(... "type" in element && element.type === Suspense)`**
  en el test: JSX produce un array de elementos heterogéneos (strings de
  whitespace no aparecen porque JSX los descarta entre líneas); el filtro
  `"type" in element` distingue elementos React de primitivos. Compara con
  `Suspense` importado de `react` — misma referencia de módulo en el test.
- **`boundary.props.fallback.type`** es la función `PortfolioSkeleton`, no
  un elemento: `fallback={<PortfolioSkeleton />}` guarda el elemento y su
  `.type` es la referencia al componente. Igual con `props.children.type`
  = `PortfolioProjects` (elemento, sin ejecutar).
- **Por qué `PortfolioSkeleton` se importa en la page y en `loading.tsx`
  por separado**: dos boundaries distintos (interno y de segmento) con el
  mismo fallback; cambiarlo en un sitio sin el otro crea una transición
  visual inconsistente.
- **Comentario en `app/portfolio/page.tsx`** ("El fetch vive en el child...")
  explica el _porqué_ del Suspense; el de `app/projects/[name]/loading.tsx`
  explica la duplicación del `<main>`.

## 7. Cómo probarlo

- **Tests del feature, aislados**:
  `npx jest __tests__/loading-skeletons.test.js --coverage=false`
  (7 tests: status a11y ×3, grid de 4 cards, main del loading de proyectos,
  boundary Suspense de la page, href de "Know More").
- **Suite completa**: `npm test` (12 tests, 2 suites — siempre recolecta
  coverage, lento). Ruido esperado: warnings `act()` en thunks async de
  `portfolio.test.js` y logs de `fetchSkillsAction` — no son fallos.
- **Verificación estática**: `npm run lint && npx tsc --noEmit && npm run
format:check` → todos limpios.
- **Pendiente**: `npm run build` NO se corrió (el usuario pidió no detener
  el dev server en el puerto 3000; `prisma generate` sufre `EPERM` si el dev
  server está vivo). **Ejecutar antes de dar por cerrado el feature.**
- **Manual en la UI**: (1) `/` → "Know More" → debe mostrarse el skeleton de
  proyectos al instante y la rejilla real después; (2) `/portfolio` → click
  en tarjeta → skeleton con fondo `#313131` al instante → `ProjectDetail`;
  (3) probar en tema claro y oscuro (el skeleton de `/portfolio` debe
  adaptarse; el de `/projects` es siempre igual); (4) teclado: Tab hasta el
  `h3` de una tarjeta → Enter.
- **Mocks/env requeridos**: ninguno especial — red real a `api.github.com`
  (o espera ISR/cache). No hay handlers MSW que configurar.

## 8. Riesgos y no-hitos

- **`npm run build` sin ejecutar** (ver arriba) — la única validación real
  del streaming/ISR en producción queda pendiente.
- **Verificación manual en navegador no hecha** en esta sesión (solo
  verificación estática + tests unitarios). Vale la pena regenerar la caché
  ISR de `/portfolio` (borrar `.next` o esperar 1h) para forzar el fetch
  lento y ver el skeleton en condiciones reales.
- **`fetchPortfolioProjects` puede tardar N+1 llamadas** — el skeleton
  cubre la espera, pero no se optimizó el fetch (fuera de alcance del
  pedido). En la primera visita tras la revalidación el skeleton visible
  puede durar segundos.
- **`loading.tsx` no cubre el caso de `<Link prefetch>` ya cacheado**: con
  la ruta prefetcheada, la navegación puede ser tan rápida que el skeleton
  no llegue a verse (comportamiento deseable, no es un bug).
- **La tarjeta de proyecto navega por `div onClick` + `router.push`** en
  `components/Portfolio.tsx` (el `h3` tiene un `Link` con
  `stopPropagation` como equivalente de teclado). Ese flujo no cambió, pero
  el `loading.tsx` sí afecta a ambos caminos.
- **Coverage**: `app/projects/[name]/page.tsx` sigue en 0% (se renderiza
  solo con datos de GitHub reales) — preexistente, no lo cubre este feature.
- No se hizo commit (no se pidió).
