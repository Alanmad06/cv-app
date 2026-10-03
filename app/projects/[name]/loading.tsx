import ProjectSkeleton from "@/components/ProjectSkeleton";

/**
 * Fallback del segmento /projects/[name]. Repite el <main> de la page para
 * que la sustitución por el contenido real sea transparente: sin este
 * contenedor se vería un destello del fondo del layout antes del #313131.
 *
 * El Suspense interno de la page sigue existiendo: este `loading.tsx`
 * cubre la navegación (commitea la ruta al instante) y el Suspense da
 * granularidad en el SSR directo (main + skeleton, luego contenido).
 */
export default function Loading() {
  return (
    <main className="container h-full min-w-[100vw] bg-[#313131] px-5 py-8">
      <ProjectSkeleton />
    </main>
  );
}
