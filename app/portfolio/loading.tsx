import PortfolioSkeleton from "@/components/PortfolioSkeleton";

/**
 * Fallback del segmento /portfolio. Sin este archivo, al pulsar "Know More"
 * la navegación esperaba a que fetchPortfolioProjects terminara (N+1
 * llamadas a GitHub) antes de commitear la ruta nueva; con él, el click
 * pinta el skeleton al instante y el contenido llega streamed.
 *
 * El div replica el contenedor raíz de la page para que, al sustituirlo,
 * no haya salto de layout/padding.
 */
export default function Loading() {
  return (
    <div className="bg-background relative px-4 pt-10 pb-10">
      <PortfolioSkeleton />
    </div>
  );
}
