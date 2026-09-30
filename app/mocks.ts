// Este archivo solo se debe importar en entorno de desarrollo
import { worker } from "../mocks/browser";

// Iniciar el worker de MSW
export function initMocks() {
  if (typeof window === "undefined") {
    return;
  }

  // Iniciar el worker solo en desarrollo
  if (process.env.NODE_ENV === "development") {
    worker.start({
      onUnhandledRequest: "bypass", // No mostrar advertencias para solicitudes no manejadas
    });
  }
}
