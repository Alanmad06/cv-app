# US-0003 — Experience, certifications & disclaimers

## 1. Feature pedido

Input original (literal):

> **Implementar feature**
>
> Implementa el siguiente feature en esta app: **dado el portfolio.md agrega una seccion de experiencia professional y otra de certificaciones , agrega tambien el link de la credly o un boton que te lleve a ese link , ademas por ahora anade dos disclaimer , uno que diga que este portafolio fue mejorado con IA en caso de que no se han dado cuenta , y otro en la parte de skills que mencione que estas skills no estan 100% actualizadas para ver todas las skills decargue el portafolio , por ahora anade un boton en el menu para descargar portafolio todavia no implementes ese feature**

Aclaraciones del usuario (respondidas a un cuestionario durante la fase de plan):

1. **Orden de secciones en `/portfolio`**: "Exp. arriba, Cert. al final" → Who I am → **Professional Experience** → Projects (Suspense) → Languages → Skills → Education → **Certifications** → **disclaimer IA** → Contacts.
2. **Botón de descarga en el menú**: eligió **"Activo sin acción"** (botón normal _sin_ `onClick`, sin `disabled`), pese a que se le recomendó la opción "deshabilitado + coming soon".
3. **Disclaimer de IA**: **en home (`/`) y en `/portfolio`**.
4. **Menú de navegación**: **sí**, añadir ítems _Experience_ y _Certifications_ además del botón de descarga.

Segunda ronda (input literal posterior a la implementación):

> Ahora haz que el boton de descargar portafolio , descargue mi CV , cambiale el nombre por descargar CV , este seria a el archivo pdf a descagar @public/CV-AlanMadrigal.pdf

(Nota: el agente **no pudo leer el PDF** — el modelo no soporta entrada PDF —; solo se usó su ruta pública.)

Supuesto confirmado en plan: todo el texto nuevo va **en inglés**, igual que el resto de la app.

## 2. Qué se implementó

- **Sección "Professional Experience"** en `/portfolio` (`id="experience"`): las 3 posiciones de `portfolio.md` (Software Engineer — EPAM Systems, y dos pases de JavaScript Intern) renderizadas como tarjetas con `<h3>` (rol), periodo, empresa en color de acento, lista de bullets y chips de tecnologías.
- **Sección "Certifications"** en `/portfolio` (`id="certifications"`): la certificación de `portfolio.md` (Claude Certified Architect – Foundations, Anthropic) con vigencia/estado y un **botón-enlace "View credential"** que abre la URL de Credly en pestaña nueva (`target="_blank" rel="noreferrer"`).
- **Dos disclaimers** con un componente reutilizable `Disclaimer`:
  - IA, texto: _"Disclosure: this portfolio was built and improved with the help of AI, in case you hadn't noticed."_ — instanciado en `/` (debajo del PhotoBox) y en `/portfolio` (`id="ai-disclaimer"`, antes de Contacts).
  - Skills, texto: _"These skills may not be 100% up to date — download the portfolio to see the full list."_ — dentro de `Skills.tsx`, **fuera** del ternario de loading (visible también mientras cargan las skills).
- **Enlace "Download CV" en el Panel (menú lateral)**: `<a href="/CV-AlanMadrigal.pdf" download="CV-AlanMadrigal.pdf">` nativo con `aria-label="Download CV"`, que **descarga el PDF** del `public/`. En la primera ronda era un placeholder sin acción (a pedido del usuario); en la segunda ronda se implementó la descarga y se renombró.
- **2 ítems nuevos en `Navigation`**: _Experience_ → `/portfolio#experience` y _Certifications_ → `/portfolio#certifications`.
- Los datos viven en `lib/resume.ts` como módulo estático server-side (sin fetch, Prisma, thunks ni server actions: no hay datos de usuario que mutar).

## 3. Archivos creados y modificados

| Archivo (ruta relativa a la raíz)   | Tipo                                      | Qué cambió                                                                                                                                                                                                    |
| ----------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `interfaces/resume.ts`              | **creado**                                | Tipos `Experience` (campo opcional `client`) y `Certification`.                                                                                                                                               |
| `lib/resume.ts`                     | **creado y luego editado por el usuario** | `professionalExperience` (3 ítems) y `certifications` (1 ítem), transcritos de `portfolio.md`. El usuario borró `client: "Copa Airlines"`, cambió "5-member" → "(3-2)-member" y "Scrum" → "Scrum / Scrumban". |
| `public/CV-AlanMadrigal.pdf`        | asset añadido por el usuario              | CV que descarga el enlace del menú (no gitignored, entra en el build).                                                                                                                                        |
| `components/Experience.tsx`         | **creado**                                | Server component de la sección de experiencia (h2 + tarjetas h3).                                                                                                                                             |
| `components/Certifications.tsx`     | **creado**                                | Server component de la sección de certificaciones (h2 + tarjeta h3 + `ButtonLink` a Credly).                                                                                                                  |
| `components/Disclaimer.tsx`         | **creado**                                | Nota reutilizable: `<p>` con borde dashed, icono `faCircleInfo` `aria-hidden`.                                                                                                                                |
| `components/ui/ButtonLink.tsx`      | modificado                                | Props opcionales `target` y `rel` pasadas a `next/link` (para enlaces externos).                                                                                                                              |
| `components/Skills.tsx`             | modificado                                | Importa `Disclaimer` y lo renderiza al final de la sección (aviso de skills desactualizadas).                                                                                                                 |
| `components/Panel.tsx`              | modificado                                | Enlace nativo "Download CV" (`<a download>` a `/CV-AlanMadrigal.pdf`, icono `faDownload` `aria-hidden`) sobre el `ButtonLink` "Go Home". El import de `ui/Button` se eliminó al dejar de usarse.              |
| `components/Navigation.tsx`         | modificado                                | Ítems _Experience_ (`faUserTie`) y _Certifications_ (`faAward`) añadidos al array.                                                                                                                            |
| `app/page.tsx`                      | modificado                                | Disclaimer de IA debajo del `PhotoBox` (home).                                                                                                                                                                |
| `app/portfolio/page.tsx`            | modificado                                | Monta `Experience` (tras `Box`), `Certifications` + `Disclaimer` (antes de `Address`). No cambia `revalidate` ni el `Suspense`.                                                                               |
| `__tests__/resume-sections.test.js` | **creado**                                | 10 tests (datos, secciones, rama `client`, disclaimers, enlace de descarga + existencia del PDF, nav).                                                                                                        |
| `portfolio.md`                      | tocado por Prettier                       | Solo normalizó espacios dobles de la fuente humana; sin cambios de contenido (efecto de `npm run format`).                                                                                                    |

No se crearon fixtures ni handlers MSW (el feature no hace HTTP) y no se tocó `prisma/schema.prisma`, `store/`, `lib/actions/` ni `jest.setup.ts`.

## 4. Contratos (para escribir tests sin leer toda la conversación)

- **`interfaces/resume.ts`**
  - `Experience = { role: string; company: string; period: string; client?: string; bullets: string[]; technologies: string[] }`
  - `Certification = { title: string; issuer: string; period: string; status: string; url: string }`
- **`lib/resume.ts`** (datos, sin fetch):
  - `professionalExperience: Experience[]` — longitud **3**. Ítem 0: `role: "Software Engineer"`; Ítems 1 y 2: `role: "JavaScript Intern"` (claves de `key` = `role`-`period` por eso). **Ningún ítem tiene `client`** tras la edición del usuario (campo opcional, se prueba con fixture sintético).
  - `certifications: Certification[]` — longitud **1**; `url: "https://www.credly.com/badges/051213db-6403-434d-9b9e-cadb6a961e1a/public_url"`.
  - **Los textos libres los puede editar el usuario** (ya lo hizo): los tests deben afirmar contra `professionalExperience[i]` / `certifications[0]`, nunca contra literales copiados de esos datos.
- **Componentes (todos server components, sin estado)**:
  - `<Experience experiences title id />` → `<section id>` → `<h2>` `{title}` + `<article>` por experiencia con `<h3>{role}</h3>`, párrafo `{company}` + ` · Client: {client}` **solo si `client` existe**, `<ul>` de bullets y chips de `technologies`.
  - `<Certifications certifications title id />` → `<section id>` → `<h2>` + `<article>` con `<h3>{title}</h3>` y `ButtonLink` con `href={cert.url}`, `target="_blank"`, `rel="noreferrer"`, texto **"View credential"** (es un `<a>`, no `<button>`).
  - `<Disclaimer id? className? >{children}</Disclaimer>` → `<p>` con borde dashed + icono decorativo.
- **Server actions / thunks**: **ninguno nuevo**. El flujo Redux→action→Prisma no participa en este feature.
- **Rutas y UI**:
  - `/portfolio`: anclas nuevas `#experience`, `#certifications`; orden de secciones descrito en §1.
  - `/` y `/portfolio` muestran el disclaimer de IA (mismo texto exacto en ambos).
  - `Panel`: **enlace** con nombre accesible **"Download CV"** (`aria-label`), `tagName === "A"`, `href="/CV-AlanMadrigal.pdf"` y atributo `download="CV-AlanMadrigal.pdf"`. El panel cerrado tiene `inert` + `aria-hidden="true"`; hay que abrirlo (checkbox `Toggle navigation menu`) antes de consultarlo con `getByRole`.
  - `Navigation`: links `aria-label` "Experience" → `href="/portfolio#experience"` y "Certifications" → `href="/portfolio#certifications"`.
- **Datos externos**: no se llama a GitHub ni Prisma para este feature. En tests, renderizar `SkillsContainer` **sí** dispara `fetchSkills` → mockear en ámbito de módulo:
  ```js
  jest.mock("@/lib/actions/skills", () => ({
    fetchSkills: jest.fn(() => Promise.resolve({ skills: [] })),
    addSkill: jest.fn(() => Promise.resolve({})),
    updateSkill: jest.fn(() => Promise.resolve({})),
    deleteSkill: jest.fn(() => Promise.resolve({})),
  }));
  jest.mock("@/lib/actions/auth", () => ({
    login: jest.fn(() => Promise.resolve({ access: false })),
  }));
  ```
- **Textos exactos**:
  - IA: `Disclosure: this portfolio was built and improved with the help of AI, in case you hadn't noticed.`
  - Skills: `These skills may not be 100% up to date — download the portfolio to see the full list.` (nota: guion largo "—")

## 5. Decisiones difíciles

1. **Datos estáticos en `lib/resume.ts` en vez de server action + Prisma**. El flujo obligatorio de la app (thunk → action Zod → Prisma) es para datos mutables (skills/auth); aquí no hay CRUD ni usuario. Alternativa descartada: parsear `portfolio.md` en build (frágil: el archivo es texto libre con typos). _Mirar con lupa_: que `lib/resume.ts` no "invada" el patrón de actions.
2. **`ButtonLink` ganó `target`/`rel` opcionales** en vez de usar un `<a>` suelto en `Certifications`. Alternativa descartada: hardcodear `target="_blank"` en el primitive (rompería el contrato de los demás consumidores). _Mirar con lupa_: props opcionales = backwards compatible; `visual-redesign.test.js` depende de que el CTA de home siga siendo `<a>` sin `target`.
3. **La descarga usa `<a download>` nativo** (segunda ronda). Descartado: `ButtonLink`/`next/link` (haría una navegación RSC interna del PDF estático en vez de descargarlo) y `Button` + `onClick` sintético (habría que crear un `<a>` en JS y se pierde clic-derecho / abrir-en-otra-pestaña). En la primera ronda el control era un placeholder "activo sin acción" a elección explícita del usuario. _Mirar con lupa_: `download` solo fuerza descarga en same-origin (este lo es).
4. **Disclaimer de IA duplicado en dos páginas** en vez de meterlo en `layout.tsx` (que aparecería también en `/projects/[name]` y `not-found`). _Mirar con lupa_: si se añade una tercera página que lo necesite, hay que instanciarlo a mano.
5. **El disclaimer de skills vive fuera del ternario `loading ? ... : ...`** a propósito: dentro desaparecería mientras cargan las skills.
6. **Test del montaje de `/portfolio` por lectura de fuente (`fs.readFileSync` + `indexOf`) en vez de renderizar la page**: la page es un RSC con `async function PortfolioProjects()` y jsdom no puede renderizar un Server Component async. Mismo truco que el test de `globals.css` en `visual-redesign.test.js`. _Mirar con lupa_: el orden se verifica con índices de string — un `indexOf` mal orientado rompió el test en la primera pasada (la corrección fue `toBeLessThan`, no `toBeGreaterThan`).
7. **Tests data-driven tras la edición del usuario**: `lib/resume.ts` cambió en caliente (borró `client`, reescribió bullets) y rompió un literal (`/Client: Copa Airlines/`). Decisión: los tests de esas secciones afirman contra los arrays exportados (`professionalExperience[i].bullets[0]`, `.period`, `certifications[0].title`, `getAllByText(/EPAM Systems/)`) y la rama `client?` se cubre con un fixture sintético propio. _Mirar con lupa_: si el usuario edita de nuevo `resume.ts`, los tests siguen verdes; si borra una entrada entera, el `toHaveLength(3)` sí fallará (a propósito).
8. **Sin MSW**: el feature no hace HTTP, así que el wiring dormante de `jest.setup.ts` sigue dormido (decisión documentada por la Fase 3, punto 5).

## 6. Piezas difíciles de entender

- **`key={`${job.role}-${job.period}`}`** en `Experience`: los dos pases de intern comparten `role` y `company`, así que `role-period` es la combinación mínima única (si se añade un puesto repetido en fechas, esto rompe en silencio con keys duplicadas).
- **Consulta al Panel cerrado**: el div del panel lleva `inert`/`aria-hidden`; `getByRole(..., { hidden: false })` excluye subárboles `aria-hidden`, por eso el test **abre el menú** (click al checkbox) antes de buscar el enlace de descarga.
- **`aria-label="Download CV"` en el enlace**: el texto visible se oculta en viewports `<260px` (misma técnica que `ButtonLink` con `max-[260px]:hidden`); el `aria-label` garantiza nombre accesible estable (y es lo que usan los tests: `name: /download cv/i`).
- **`&apos;` en el texto del disclaimer**: JSX escapa el apóstrofo; en el DOM el texto es `hadn't`.
- **El disclaimer de home (`relative z-10 mx-auto mb-6 max-w-xl px-4 text-center`)**: la clase base de `Disclaimer` es `flex items-start gap-2`; el centrado se consigue centrando el propio `<p>` (`mx-auto max-w-xl`), no el flex interno.
- **Depuración del fallo por edición del usuario**: el test falló con _"Unable to find an element with the text: /Client: Copa Airlines/"_ sin cambios en el componente; la causa era un cambio de datos concurrente en `lib/resume.ts`, verificado con un test temporal que volcó `professionalExperience[0].client` (`undefined`) y el HTML renderizado. Un test temporal (`__tests__/tmp-debug.test.js`) se creó y borró.

## 7. Cómo probarlo

- **Tests del feature**:
  ```
  npx jest __tests__/resume-sections.test.js --coverage=false
  ```
  (10 tests; `npm test` completo → 4 suites / 48 tests en verde).
- **Suite completa**: `npm test` (recuerda: cobertura siempre activa, ruidos esperados de `act()` y Prisma-en-browser).
- **Pasos manuales en la UI** (con `npm run dev`):
  1. `/` → debajo del hero aparece el recuadro _"Disclosure: … help of AI, in case you hadn't noticed."_
  2. `/portfolio` → tras "Who I am" viene **Professional Experience** con 3 tarjetas; al final, **Certifications** con botón **"View credential"** que abre Credly en pestaña nueva.
  3. `/portfolio#skills` → bajo las barras de skills aparece _"These skills may not be 100% up to date — download the portfolio to see the full list."_
  4. Hamburguesa (arriba a la izquierda) → el panel muestra **"Download CV"** encima de "Go Home"; al pulsarlo el navegador **descarga `CV-AlanMadrigal.pdf`** (no lo abre en el visor). Ctrl/clic derecho → "Guardar enlace como" también funciona.
  5. Mismo panel → ítems _Experience_ y _Certifications_ llevan a las anclas de la página.
  6. Ambos temas (claro/oscuro): los acentos de tarjeta (`text-main`, `bg-accent-gradient` con `text-white dark:text-gray-900`) deben seguir pasando contraste.
- **Mocks/env**: los tests del feature no necesitan `.env`, ni MSW, ni GitHub; solo los mocks de módulo de `@/lib/actions/*` listados en §4. Tampoco necesitan leer el PDF (solo `fs.existsSync`).

## 8. Riesgos y no-hitos

- ~~El botón de descarga no descarga nada~~ — **resuelto en la segunda ronda**: ahora es un enlace que descarga `public/CV-AlanMadrigal.pdf` y se llama "Download CV".
- **El PDF no se pudo revisar** (el modelo no acepta entrada PDF): se verifica solo por existencia en disco y por el `href`; el contenido del CV no se validó.
- **Texto del usuario con formato raro**: _"(3-2)-member frontend development team"_ y _"Scrum / Scrumban"_ en `lib/resume.ts` — no se tocó (edición del usuario), pero conviene revisarlo.
- **`portfolio.md` fue reformateado por Prettier** (espacios dobles → simples) al correr `npm run format`; el contenido no cambió. Si el usuario quiere el archivo intocable, hay que añadirlo a `.prettierignore`.
- **La sección EDUCATION de `portfolio.md` no se tocó**: el md dice "CETI | 2021 – 2025" mientras el `Timeline` actual muestra "2021". No estaba en el pedido; queda como diferencia detectada.
- **El disclaimer de home queda bajo el hero de 100vh** en viewports ≥30vw: en escritorio está a un scroll de distancia, no visible sin desplazar.
- **Solo 1 certificación**: el componente mapea, pero no hay test con múltiples certificaciones (edge: 0 certificaciones → sección con título vacía).
- **URL de Credly no verificada en vivo** (offline); el test solo afirma el `href`.
- **Responsividad del enlace de descarga en paneles muy angostos** (`min-w-[70px]`): el texto se oculta bajo 260px de viewport y queda solo el icono (con `aria-label` como red).
- **Sin cambios de contraste**: no se tocó `--main` del tema `.light`; el residual conocido del slider de skills (1.96:1 en oscuro) sigue presente.
