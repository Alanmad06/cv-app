import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

/**
 * Nota discreta para avisos globales (portafolio mejorado con IA, skills
 * desactualizadas). El texto es contenido real y se anuncia tal cual; solo
 * el icono es decoración, por eso lleva aria-hidden.
 */
export default function Disclaimer({
  children,
  id,
  className = "",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <p
      id={id}
      className={`border-main/40 bg-surface-gradient text-foreground flex items-start gap-2 rounded-xl border border-dashed p-3 text-sm ${className}`}
    >
      <FontAwesomeIcon
        icon={faCircleInfo}
        aria-hidden
        className="text-main mt-0.5 shrink-0"
      />
      <span>{children}</span>
    </p>
  );
}
