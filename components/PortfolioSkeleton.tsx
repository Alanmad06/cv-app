/**
 * Skeleton de la sección "Projects" de /portfolio. Es el fallback de dos
 * sitios: el Suspense interno de la page y el `loading.tsx` del segmento.
 *
 * A diferencia de ProjectSkeleton (que vive sobre el #313131 fijo de
 * /projects/[name]), esta sección va sobre `bg-background`, que cambia entre
 * temas: por eso los bloques usan `--foreground` con opacidad en vez de
 * grises hardcodeados.
 */

// Bloque placeholder base: pulso + color ligado al tema.
const bar = "animate-pulse rounded-md bg-foreground/10";

export default function PortfolioSkeleton() {
  return (
    <section className="pb-10" role="status">
      {/* Anuncia la carga una sola vez; los bloques decorativos quedan
          ocultos para los lectores de pantalla. */}
      <span className="sr-only">Loading projects</span>

      <div aria-hidden="true">
        {/* Título "Projects" (h2 real: text-xl md:text-3xl) */}
        <div className={`${bar} my-4 h-8 w-44`}></div>

        {/* Filtros por categoría */}
        <div className="mb-4 flex gap-2 px-2">
          <div className={`${bar} h-4 w-10`}></div>
          <div className={`${bar} h-4 w-16`}></div>
          <div className={`${bar} h-4 w-12`}></div>
        </div>

        {/* Rejilla: mismo grid que el Portfolio real (1 / 2 / 4 columnas) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`${bar} min-h-40 rounded-lg`}></div>
          ))}
        </div>
      </div>
    </section>
  );
}
