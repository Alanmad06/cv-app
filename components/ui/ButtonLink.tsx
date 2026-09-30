import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonLinkProps {
  /** Ruta de destino, con la misma semántica que `next/link`. */
  href: string;
  text: string;
  icon?: ReactNode;
  className?: string;
}

const BASE =
  "my-2 inline-flex h-10 max-w-40 min-w-10 cursor-pointer flex-nowrap items-center justify-center self-center rounded-md px-2 transition-all duration-300 ease-in-out";

/**
 * Navegación con aspecto de botón. Renderiza un `<a>` real (y no un
 * `<button>` con `router.push`): abre en pestaña nueva, se puede copiar,
 * y los lectores de pantalla lo annuncian como enlace.
 */
export default function ButtonLink({
  href,
  text,
  icon,
  className = "",
}: ButtonLinkProps) {
  return (
    <Link href={href} className={`${BASE} ${className}`}>
      {icon}
      <span className="pl-1 font-sans max-[260px]:hidden">{text}</span>
    </Link>
  );
}
