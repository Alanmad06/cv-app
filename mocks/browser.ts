import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Este archivo configura el worker de MSW para el navegador
export const worker = setupWorker(...handlers);
