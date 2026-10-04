# US-0002 — Rediseño visual con gradientes

## 1. Feature pedido

Input literal del usuario:

> Rediseña visualmente la app (portfolio/CV Next.js 15): aspecto simple pero
> innovador, sustituye la imagen de fondo de `/` por gradientes y aplica
> gradientes en toda la app para que deje de verse fea.

Aclaraciones del usuario durante la planificación:

- **Solo presentación**: sin nuevos flujos de datos (nada de thunks, server
  actions ni Prisma en este feature).
- Respetar el stack: Tailwind **v4 CSS-first** (`app/globals.css`, nunca
  `tailwind.config.js`), sin `bg-opacity-*`, variante `dark:` por clase.
- No tocar `.light { --main: 15, 107, 69 }` sin re-verificar contraste.
- Preservar accesibilidad: `h1` en `Box`/`PhotoBox(big)`/`ProjectDetail`,
  secciones `h2`, tarjetas `h3`, capas decorativas con `aria-hidden`,
  `inert`/`aria-hidden` en el `Panel` cerrado, `aria-label` en controles de
  solo icono, `role="progressbar"` en Skills.
- Plan aprobado por el usuario ("Arranca con el plan") en 8 pasos: tokens →
  portada → `PhotoBox` → `Panel` → superficies (`Info`/`Timeline`/`Box`) →
  páginas/tarjetas/barras → tests → verificación + esta US.

## 2. Qué se implementó

Antes: la portada era una `<Image fill>` de `/assets/image.png` que tapaba el
contenido, y la app mezclaba colores planos hardcodeados ajenos al tema
(`bg-[#222935]` en el sidebar, `bg-gray-500` en `Info`, `bg-[#eeeeee]` +
`text-black` en `Timeline`, `bg-blue-500` en el CTA de `PhotoBox`,
`bg-blue-100` en los chips de `ProjectDetail`), con títulos en `text-main`
uniforme.

Ahora existe un **sistema de gradientes por tema** y se aplica en toda la UI:

- **Tokens en `app/globals.css`** (dentro de `.light` y `.dark`, igual que
  `--main`): `--accent-gradient`, `--accent-rgb`, `--hero-gradient`,
  `--page-gradient`, `--surface-gradient`, `--hero-card-bg/border/shadow`.
  Cambiar de tema (.light/.dark) cambia todos los gradientes sin tocar
  componentes.
- **Utilidades CSS-first**: `.bg-hero-gradient`, `.bg-page-gradient`,
  `.bg-surface-gradient`, `.bg-accent-gradient`, `.gradient-text`
  (background-clip:text), `.timeline-axis::before`, `.gradient-sidebar`,
  `.bg-panel-gradient`, `.hero-glass-card`, `.hero-blob{,-a,-b}` + keyframes
  `hero-float` con corte en `prefers-reduced-motion`.
- **`/` (portada)**: la imagen de portada desaparece; una capa
  `aria-hidden="true"` con `.bg-hero-gradient` y dos blobs desenfocados con
  animación lenta ocupan su lugar. Se eliminó `className="z-1 text-black"`:
  el texto ahora usa `--foreground` del tema.
- **`PhotoBox`**: variante `big` envuelve el contenido en una card de cristal
  (borde/sombra/blur por tema), el avatar lleva aro con el gradiente de
  acento, el `h1` usa `.gradient-text` y el CTA pasa de `bg-blue-500` a
  `bg-accent-gradient` + `text-white dark:text-gray-900`. La variante del
  sidebar (no-big) no cambia de color de texto.
- **`Panel`**: `bg-[#222935]` → `.bg-panel-gradient` (azul marino fijo en
  ambos temas con tinte de acento arriba) + filo `.gradient-sidebar` en el
  borde derecho (`aria-hidden`). `inert`/`aria-hidden` intactos. El botón
  "Go Home" pasa de `bg-[#10141b]` a `bg-black/30`.
- **Superficies**: `Info` (`bg-gray-500` → `.bg-surface-gradient` +
  `border-main/40` + `text-foreground`), `Timeline` (`bg-[#eeeeee] text-black`
  → `.bg-surface-gradient` + filo `border-l-4` + `text-foreground`; el eje
  vertical toma el gradiente vía `.timeline-axis`), tarjetas de `Portfolio`
  (esquinas redondeadas + superficie + borde de acento al hover).
- **Títulos con degradado** (`.gradient-text`): `Box` (h1), `Timeline`,
  `Portfolio`, `Skills`, `Address` (h2), `ProjectDetail` (h1 + h2) y el
  modal de `SkillsForm`.
- **Rellenos de acento** (`bg-accent-gradient`): chip de skill, relleno de
  las barras de progreso (la pista sigue en gris), botón Login, botón "View
  on GitHub", knob del `ToggleButton`.
- **Páginas**: `/portfolio` (page + loading) y `/projects/[name]` (page +
  loading) añaden `bg-page-gradient` a sus contenedores raíz, siempre en los
  dos archivos de forma idéntica (contrato de test).
- **Detalles**: chips de `ProjectDetail` ganan variantes `dark:` (antes
  claro sobre fondo oscuro), marcos de imagen con `border-main/40` (antes
  `border-amber-200`), `not-found.tsx` recibe tinte de página, `h2` con
  gradiente y `ButtonLink` (antes `Link` plano).

Flujo de datos intacto: cero cambios en `store/`, `lib/actions/`,
`lib/github.ts` y `prisma/`. MSW sigue dormido.

## 3. Archivos creados y modificados

Creados:

- `__tests__/visual-redesign.test.js` → **nuevo**. 11 tests (ver sección 7).
  Sin fixtures MSW: no hay HTTP bajo test.
- `docs/user-stories/US-0002-visual-gradient-redesign/US-0002-visual-gradient-redesign.md`
  → **nuevo** (este archivo).
- `evidence/*.png` → **nuevos**. Capturas de la verificación manual
  (`home-dark`, `home-light`, `portfolio-dark`, `portfolio-light`,
  `panel-light`, `project-detail-light`). No versionados.

Modificados:

- `app/globals.css` → tokens de gradiente por tema + todas las utilidades
  nuevas (≈216 líneas añadidas). Sin cambios en `@theme`, `.light --main`
  ni el slider.
- `app/page.tsx` → imagen de portada eliminada; capa decorativa
  `aria-hidden` con `.bg-hero-gradient` + blobs.
- `components/PhotoBox.tsx` → card de cristal, aro de acento, nombre con
  gradiente (solo `big`), CTA con gradiente; `text-black` eliminado.
- `components/Panel.tsx` → `.bg-panel-gradient`, botón `bg-black/30`, filo
  `.gradient-sidebar` (`aria-hidden`).
- `components/Info.tsx` → superficie del tema + `text-foreground`.
- `components/Timeline.tsx` → superficie del tema, filo de acento, eje
  `.timeline-axis`, flecha del bocadillo eliminada; scrollbar
  `scrollbar-thumb-main` (antes `[#26C17E]`).
- `components/Box.tsx` → `h1` con `.gradient-text`.
- `components/Portfolio.tsx` → `h2` con gradiente; tarjeta redondeada con
  superficie y borde de acento al hover.
- `components/Skills.tsx` → `h2`, chip, relleno de barra y Login con
  gradiente (atributos ARIA de la barra intactos).
- `components/SkillsForm.tsx` → panel `bg-background bg-surface-gradient` y
  `titleClassName="gradient-text"`.
- `components/Address.tsx` → `h2` con gradiente.
- `components/ProjectDetail.tsx` → card con superficie, `h1`/`h2` con
  gradiente, chips con variantes `dark:`, marcos `border-main/40`, CTA de
  GitHub con gradiente.
- `components/ToggleButton.tsx` → knob con `.bg-accent-gradient` (texto por
  rama: gray-900 en oscuro, blanco en claro).
- `app/portfolio/page.tsx` + `app/portfolio/loading.tsx` → raíz con
  `bg-page-gradient` (idénticos en ambos, con comentario del contrato).
- `app/projects/[name]/page.tsx` + `app/projects/[name]/loading.tsx` →
  `<main>` con `bg-page-gradient` (idénticos en ambos).
- `app/not-found.tsx` → rediseño con tinte, `h2` con gradiente y
  `ButtonLink`.

No se modificó: `store/`, `lib/actions/`, `lib/github.ts`, `prisma/`,
`jest.setup.ts`, `mocks/`, `components/Navigation.tsx` (ver decisión 3),
`components/PortfolioSkeleton.tsx`/`ProjectSkeleton.tsx` (contratos de la
US-0001), `public/assets/image.png` (sigue siendo el avatar que pasan los
tests de US-0001).

## 4. Contratos (para escribir tests sin leer toda la conversación)

- **Tokens** (en `app/globals.css`, uno por bloque `.light`/`.dark`):
  - `--accent-gradient`: claro = `linear-gradient(135deg, rgb(15, 107, 69),
rgb(10, 84, 130))` (extremos oscuros → texto blanco ≥4.5:1);
    oscuro = `linear-gradient(135deg, rgb(38, 193, 126), rgb(64, 206, 216))`
    (extremos claros → texto gray-900).
  - `--accent-rgb` (segundo extremo, para `rgba()` de blobs/filos),
    `--hero-gradient` (3 radiales + base opaca), `--page-gradient`
    (2 radiales translúcidos, sin base: va sobre `bg-background`),
    `--surface-gradient` (blanco translúcido: claro 0.8→0.35, oscuro
    0.07→0.02), `--hero-card-bg/border/shadow`.
- **Utilidades**: `.bg-hero-gradient` y `.bg-page-gradient` /
  `.bg-surface-gradient` / `.bg-accent-gradient` fijan solo
  `background-image` (combinables con `bg-*` de Tailwind, que fijan
  `background-color`); `.gradient-text` fija `background-image` +
  `background-clip:text` + `color: transparent` y vive **fuera de capas**,
  por eso gana a cualquier `text-*` en el mismo elemento.
- **`.timeline-axis::before`** da el `background-image` del eje de
  `Timeline`: Tailwind solo admite variantes `before:` sobre utilidades
  suyas, así que el gradiente no puede ir como `before:bg-accent-gradient`.
- **Portada** (`app/page.tsx`, export default `Home()`): el DOM contiene un
  `.bg-hero-gradient` con `aria-hidden="true"` que envuelve ≥2 `.hero-blob`;
  `container.innerHTML` **no** contiene `image.png`; exactamente un `h1`
  ("Alan Madrigal Saenz") y un `<a href="/portfolio">` con texto "Know
  More".
- **Contrato page/loading (US-0001, sigue vigente)**: la raíz de
  `app/portfolio/page.tsx` y `app/portfolio/loading.tsx` debe ser byte a
  byte `bg-background bg-page-gradient relative px-4 pt-10 pb-10` (un test
  la compara con `toBe`); el `<main>` de
  `app/projects/[name]/page.tsx` y `.../loading.tsx` debe ser
  `bg-page-gradient container h-full min-w-[100vw] bg-[#313131] px-5 py-8`
  (comparado con `toBe` y con `toContain("bg-[#313131]")`).
- **Panel**: el sidebar es el elemento `.bg-panel-gradient` y, cerrado,
  lleva `inert` + `aria-hidden="true"` (al abrir: sin `inert`,
  `aria-hidden="false"`); el filo `.gradient-sidebar` siempre
  `aria-hidden="true"`.
- **Skills**: `role="progressbar"` + `aria-valuenow/min/max` sin cambios; el
  relleno (primer hijo) tiene `.bg-accent-gradient` y el chip del nombre
  también. Para ver barras en test, el mock de `@/lib/actions/skills` debe
  resolver `{ skills: [{ id, name, level }] }`.
- **Jerarquía de headings** (comprobada en browser): `/` → `h1` en el hero y
  `h2` dentro del panel; `/portfolio` → `h1` "Who I am", `h2` de sección
  (Projects, Skills, Education, Contacts) y `h3` en tarjetas/timeline.

## 5. Decisiones difíciles

1. **Gradientes como variables CSS por tema, no como config de Tailwind.**
   Tailwind v4 es CSS-first (`@theme` solo registra colores): crear
   `tailwind.config.js` sería invisible para el build (decisión documentada
   en AGENTS). Al vivir en `.light`/`.dark`, el cambio de tema (clase en
   `<html>`, next-themes) actualiza todos los gradientes sin JavaScript.
   Descartada la vía `@utility` de v4: obligaría a mover `.gradient-text`
   a la capa `utilities`, donde perdería frente a `text-*` por orden.
2. **Las utilidades nuevas van fuera de `@layer`.** CSS sin capa gana a
   cualquier CSS en capa (`@import "tailwindcss"` declara
   `@layer theme, base, components, utilities`), así `.gradient-text`
   fija `color: transparent` aunque el JSX traiga también `text-*`.
   **Al testear**: asumir que `className` de esos elementos contiene
   `gradient-text`, no su valor de color computado (jsdom no pinta).
3. **Verde hardcodeado del sidebar intacto (`Navigation.tsx`).** Comentario
   preexistente: el panel siempre es azul marino y `--main` en tema claro
   (verde oscuro) daría 2.94:1 sobre él. El filo y el tinte del panel usan
   `rgba(38, 193, 126)` fijo (mismo motivo: superficie fija → sin `dark:`).
   **Al testear**: no "unificar" esos enlaces a `text-main`.
4. **Flecha del bocadillo de `Timeline` eliminada, no recoloreada.** El
   triángulo `before:border-r-[#eeeeee]` imitaba el color sólido de la
   tarjeta; con un gradiente no hay color sólido que lo iguale. Alternativa
   descartada: variable `--bubble` por tema (más complejidad para el mismo
   resultado). La tarjeta quedó con `border-l-4` de acento, que sí escala
   con el tema.
5. **Contraste re-verificado, `--main` no tocado.** Extremos del acento en
   claro son oscuros: texto blanco pasa ~6.5:1 (verde) y ~8:1 (azul) sobre
   ambos; en oscuro los extremos son claros y el par es `dark:text-gray-900`
   (patrón ya usado por AGENTS con `bg-main`). El par `--main` claro
   (15, 107, 69) sigue intacto: 4.62:1 sobre `--background`.
6. **Los classNames raíz cambiaron en page Y loading a la vez.**
   `loading-skeletons.test.js` compara ambos con `toBe(...)`; cambiar uno
   solo rompería el test de la US-0001. Igual para el `<main>` de
   `/projects/[name]` (además `toContain("bg-[#313131]")`, que decide el
   gris fijo del detalle: allí los grises hardcodeados son correctos,
   decisión #3 de la US-0001).
7. **Capa del hero con `h-[100dvh] w-[100dvw]` y sin `z-index`.** El
   contenido queda encima por orden de pintado: el `<section>` de `PhotoBox`
   no está posicionado, pero sus hijos directos (título, div del CTA) sí son
   flex items con `z-10`, que sí aplica `z-index`. Descartado `-z-10` en la
   capa: con un fondo opaco en `--hero-gradient` no hace falta, y un z-index
   negativo la mandaría detrás del `bg-background` del `body`.
8. **MSW sigue dormido.** Este feature no hace HTTP (solo CSS/markup), así
   que `jest.setup.ts` y `mocks/handlers.ts` quedan intactos, igual que en
   la US-0001. Si algún test futuro necesita red, activarlo _scoped al
   archivo_.
9. **La imagen `/assets/image.png` no se borró del repo.** Solo dejó de
   renderizarse en la portada; los tests de US-0001 la siguen pasando como
   prop `avatar` de `PhotoBox`.

## 6. Piezas difíciles de entender

- **Por qué `.bg-page-gradient` va junto a `bg-background`**: son longhands
  distintos (`background-image` vs `background-color`); sin el color plano
  los radiales translúcidos dejarían ver el gris/carbon de la página
  siguiente, y sin la imagen el fondo sería plano. En `/projects/[name]` el
  color sigue siendo `bg-[#313131]` (fijo, decisión US-0001) y el gradiente
  se pinta encima.
- **`before:bg-*` no sirve para clases propias**: Tailwind solo genera
  variantes sobre utilidades que conoce; por eso el eje del `Timeline` usa
  la clase `.timeline-axis` cuyo `::background-image` se define en
  `globals.css`, mientras el posicionamiento sigue con utilidades
  `before:*` en el JSX.
- **`.hero-glass-card` necesita `backdrop-filter`** (blur del hero detrás):
  jsdom no lo simula, por eso el test solo assertea la existencia de la
  clase, no el efecto.
- **Knob del `ToggleButton`**: la rama `theme === "dark"` controla la
  posición (`translate-x-6`) y el color de icono (gray-900 sobre acento
  claro / blanco sobre acento oscuro); el gradiente es común a ambas.
- **Comentario en `app/portfolio/page.tsx` y en ambos `loading.tsx`**
  explica el contrato `toBe` — leerlo antes de tocar esos classNames.
- **Ruido esperado en tests**: warnings `act()` de los thunks, logs de
  `Response from fetchSkillsAction` (el propio slice hace `console.log`) y
  el error de Prisma del mock — no son fallos.

## 7. Cómo probarlo

- **Tests del feature, aislados**:
  `npx jest __tests__/visual-redesign.test.js --coverage=false` → 11 tests
  en 5 suites: portada (capa de gradiente sin imagen, `aria-hidden`, único
  `h1`, CTA `<a href="/portfolio">`), superficies (gradient-text en
  `Box`/`Timeline`/`Address`, `Info` sin `bg-gray-500`, `Timeline` sin
  `#eeeeee`, roots de loading con `bg-page-gradient`), panel (`inert`/
  `aria-hidden` al cerrar/abrir + `.bg-panel-gradient`), Skills
  (`progressbar` con `aria-valuenow=80` + relleno/chip con gradiente) y
  CSS-first (tokens duplicados por tema, sin `tailwind.config.js`, sin
  `bg-opacity-`).
- **Suite completa**: `npm test` → **38 tests, 3 suites** (siempre
  recolecta cobertura, lento).
- **Verificación estática**: `npm run lint` ✔ · `npx tsc --noEmit` ✔ ·
  `npm run format:check` ✔.
- **Build**: `npm run build` ✔ (con el dev server detenido — `prisma
generate` sufre `EPERM` con el dev server vivo en Windows/OneDrive).
- **Manual en la UI (hecho, capturas en `evidence/`)**:
  1. `/` en oscuro y claro → hero con blobs, card de cristal, nombre con
     gradiente y CTA accesible.
  2. `/portfolio` → títulos con degradado, tintes de página, tarjetas
     redondeadas; alternar tema con el switch (arriba a la derecha).
  3. Abrir el panel hamburguesa → superficie azul marino degradada con filo
     de acento y enlaces legibles.
  4. `/projects/learn-nextjs` → `h1`/`h2` con degradado, chips con variantes
     `dark:` y README sobre el fondo fijo `#313131`.
  5. Teclado: Tab desde el hamburger → dentro del panel abierto; Escape
     cierra los modales (no regresó).
- **Mocks/env requeridos**: ninguno especial (red real a `api.github.com`
  para las imágenes de proyectos; Prisma/DATABASE_URL solo afecta a las
  skills, que se ven vacías sin DB — preexistente).

## 8. Riesgos y no-hitos

- **Dev server dejado corriendo** al final de la sesión (se arrancó para la
  verificación visual en `http://localhost:3000`). Detenerlo antes del
  próximo `npm run build` (EPERM con `prisma generate`).
- **`evidence/*.png` sin versionar** (y `evidence/` ya era untracked antes
  del feature): borrar o añadir al gusto. No se hizo commit (no se pidió).
- **Residual de contraste conocido** (preexistente, no introducido aquí):
  el thumb/track del slider de Skills en tema oscuro está ~1.96:1 (bajo el
  3:1 del 1.4.11).
- **Warnings de `next/image` "missing sizes"** en portada/detalle:
  preexistentes, no tocaron a este feature.
- **Blobs con `filter: blur(90px)` animados**: consumo de GPU en equipos
  bajos; `prefers-reduced-motion` corta la animación pero no el blur.
- **Superficies translúcidas** (`.bg-surface-gradient`) dependen del color
  que tengan detrás: si alguien cambia `--background` de forma drástica,
  las tarjetas se recolorean (es el diseño, pero hay que re-verificar
  contraste de texto).
- **`text-black` eliminado de la portada**: si se reintroduce, el hero vuelve
  a romperse en tema oscuro (el fondo ahora es oscuro).
- **Cobertura**: `ToggleButton.tsx` sigue casi sin cubrir (10.6%) —
  preexistente; `ProjectDetail.tsx` solo se cubre indirectamente.
- **Los enlaces del panel siguen hardcodeados en `#26C17E`** a propósito
  (decisión 3): no "arreglarlos" sin re-verificar 2.94:1 sobre azul marino.
