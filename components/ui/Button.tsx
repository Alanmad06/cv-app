"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/**
 * Acción (no navegación). El estilo base es mínimo a propósito: el tamaño,
 * la forma y el color los aporta cada consumidor vía `className` para no
 * heredar clases que entren en conflicto.
 */
export default function Button({
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center transition-all duration-300 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
