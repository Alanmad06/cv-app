"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

interface ModalProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Invoked by the close button, Escape or a backdrop click. */
  onClose: () => void;
  /** Dialog title, rendered as the panel heading and used by aria-labelledby. */
  title: string;
  /** Extra classes for the panel (background, size...). */
  panelClassName?: string;
  /** Extra classes for the close button. */
  closeClassName?: string;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Extra classes for the title (e.g. a fixed color on white panels). */
  titleClassName?: string;
  children: ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  panelClassName = "bg-white",
  closeClassName = "text-gray-500 hover:text-gray-700",
  closeLabel = "Cerrar",
  titleClassName = "text-main",
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Callback fresco en cada render sin re-ejecutar el efecto del diálogo:
  // si el efecto dependiera de `onClose`, cada render del padre movería el
  // foco dentro del modal (y rompería la escritura en los inputs).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    dialogRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const isInside = active !== null && dialog.contains(active);

      if (event.shiftKey) {
        if (active === dialog || active === first || !isInside) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !isInside) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000008f]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCloseRef.current();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`w-full max-w-md rounded-md p-6 shadow-lg focus:outline-none ${panelClassName}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id={titleId}
            className={`text-xl font-semibold ${titleClassName}`}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={() => onCloseRef.current()}
            aria-label={closeLabel}
            className={`transition-colors ${closeClassName}`}
          >
            <FontAwesomeIcon icon={faTimes} aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
