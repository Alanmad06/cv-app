---
name: fix-vulnerabilities
description: Use when resolving dependency vulnerabilities reported by `yarn audit` (audit de vulnerabilidades, arreglar vulnerabilidades de librerías, security advisories, GHSA/CVE, añadir resolutions a package.json, actualizar yarn.lock). El goal es 0 vulnerabilidades.
---

# Fix Vulnerabilities (yarn audit)

## When to Use This Skill

- `yarn audit` reporta vulnerabilidades
- Llega una alerta de Dependabot / GHSA / CVE
- Después de añadir o actualizar una dependencia
- Revisar que una actualización no introdujo advisories nuevos

## Workflow

1. **Baseline deduplicado.** `yarn audit` repite un advisory por cada path, así que 49 hallazgos pueden ser
   40 advisories reales o solo 1 paquete. Obtén el JSON y deduplica por `github_advisory_id`:
   - En Windows PowerShell, redirige con `cmd /c "yarn audit --json > %TEMP%\yarn-audit.jsonl"` — el `>` de
     PowerShell escribe UTF-16 y `JSON.parse` falla con error de sintaxis.
   - Para cada advisory guarda: paquete, severidad, `vulnerable_versions`, `patched_versions`, paths y si
     `patched_versions` es `<0.0.0` (o "No patch available") = **no tiene arreglo**.
2. **Clasifica cada paquete**: ¿es dependencia **directa** o **transitiva**?
   - `yarn why <pkg>` y un grep en `package.json` / `yarn.lock`.
3. **Aplica el árbol de decisión** de abajo.
4. `yarn install` para regenerar `yarn.lock`.
5. Re-ejecuta `yarn audit` → debe quedar **0**, o solo advisories documentados sin versión parcheada.
6. Comprueba que no quedaron versiones muertas (sección *Verificación*).
7. Verificación completa antes de commit:
   `yarn lint && yarn typecheck && yarn format:check && yarn test --coverage=false && yarn build`

## Árbol de decisión

| Situación | Acción | Ejemplo real |
| --- | --- | --- |
| Paquete **directo** en `dependencies`/`devDependencies` con versión parcheada disponible | Sube la versión en `package.json`. Esta versión **sí se usa directamente**, así que no va en `resolutions`. | `next 15.2.4 → 15.5.27` (cerró 33 advisories, incl. 3 críticos). `eslint-config-next` se mueve en paralelo. |
| Paquete **transitivo** y el rango del padre **ya admite** la versión parcheada | **Solo `yarn.lock`**: `yarn upgrade <pkg>`. No añadas `resolutions`. | `sharp`: al subir `next`, su optionalDep pasó a `^0.34.3 \|\| ^0.35.4` y el lock resolvió `0.35.5` solo. |
| Paquete **transitivo** con pin exacto o rango incompatible con la versión parcheada | `resolutions` en `package.json` con la versión parcheada **exacta**. No hay otra forma duradera en yarn 1: editar el `yarn.lock` a mano se revierte en el próximo `yarn install`. | `postcss@8.4.31` (pin exacto de `next`) → `"resolutions": { "postcss": "8.5.28" }`. `deepmerge-ts@7.1.5` (pin de `@prisma/config`) → `8.0.2`. |
| **No existe versión parcheada** (`patched_versions: <0.0.0`) | Déjalo tal cual y documentalo. **Nunca** crees una resolución: no hay versión a la que apuntar, y una resolución sin consumidor es exactamente la "versión que no se está utilizando" que queremos evitar. | `braces@3.0.3` — GHSA-vfj7-8cjw-p6xm, "Patched versions: None", issue [micromatch/braces#70](https://github.com/micromatch/braces/issues/70) abierto desde sep 2026. |
| El advisory **no aplica** (paquete ya no está en el árbol, versión irrelevante, dev-only sin vector explotable) | Déjalo y documenta el motivo. Solo cuenta como "resuelto" si `yarn audit` deja de reportarlo. | — |

## Rules

- **Cada entrada de `resolutions` debe estar consumida.** Compruébalo con `yarn why <pkg>` antes de dejarla.
  Sin consumidor → bórrala. El objetivo es que no existan versiones en el lock que nadie usa.
- **Una sola versión por paquete en el árbol.** Si `yarn.lock` muestra dos entradas distintas para el mismo
  paquete, o la resolución empujó algo fuera del rango que el padre declara, revísalo.
- **Nunca subas de mayor un paquete directo sin correr el build completo.** `next`, `prisma` y `react` son
  los que rompen: build + tests siempre.
- **No uses `resolutions` para paquetes directos** — para eso está `dependencies`.
- **Un solo lockfile.** Dos lockfiles divergentes = el audit de un gestor no refleja lo que instala el otro.
- El warning `Resolution field "X" es incompatible con requested version "Y"` es **esperado**: es literalmente
  la señal de que la resolución está sobrescribiendo un pin vulnerable. No lo "arregles".
- **Re-audita siempre después de instalar.** Un upgrade puede traer advisories nuevos.
- Un paquete **dev-only** sigue contando en `yarn audit`; no lo descartes solo por eso. Pero sí anota el
  contexto (vector, severidad) al documentarlo como no-fixeable.

## Verificación de "sin versiones muertas"

```sh
yarn why <pkg>                 # debe listar consumidores reales
yarn audit                     # debe quedar 0, o solo no-fixeables documentados
```

En `yarn.lock`, un estado sano es **una sola entrada** por paquete donde todas las specs comparten la misma
versión:

```
postcss@8.4.31, postcss@8.5.28, postcss@^8.5.16, postcss@^8.5.3:
  version "8.5.28"
```

Estado insano (versiones duplicadas o una spec sin resolver):

```
postcss@8.4.31:
  version "8.4.31"     # ← sigue vulnerable a pesar de la resolución
```

## Registro de la última sesión (oct 2026)

| Paquete | Antes | Después | Mecanismo |
| --- | --- | --- | --- |
| `next` (+ 33 advisories, 3 critical) | 15.2.4 | 15.5.27 | `dependencies` (directo) |
| `eslint-config-next` | 15.2.4 | 15.5.27 | `devDependencies` (directo) |
| `postcss` (4 advisories) | 8.4.31 bajo `next` / 8.5.28 directo | 8.5.28 en todo el árbol | `resolutions` |
| `sharp` (2 advisories) | 0.33.5 | 0.35.5 | **solo `yarn.lock`**, sin resolutions |
| `deepmerge-ts` (1 advisory) | 7.1.5 | 8.0.2 | `resolutions` |
| `braces` (10 hallazgos) | 3.0.3 | 3.0.3 | **sin parche publicado** — no-fixeable |

Resultado: **49 → 10 hallazgos, 40 → 1 advisory**, y el único restante no tiene versión parcheada.
