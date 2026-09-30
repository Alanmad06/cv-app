import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Este archivo configura el servidor de MSW para Node.js (usado en pruebas)
export const server = setupServer(...handlers);
