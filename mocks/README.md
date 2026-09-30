# Configuración de Mock Service Worker (MSW)

Este directorio contiene la configuración de MSW para mockear solicitudes HTTP en tus pruebas y durante el desarrollo.

## Estructura

- `handlers.ts`: Define los manejadores de mock para diferentes endpoints de API.
- `browser.ts`: Configura el worker de MSW para el navegador (usado en desarrollo).
- `node.ts`: Configura el servidor de MSW para Node.js (usado en pruebas).

## Cómo usar MSW en tus pruebas

La configuración de MSW ya está integrada con Jest a través del archivo `jest.setup.ts`. No necesitas hacer nada adicional para usar los mocks en tus pruebas.

### Ejemplo de uso en pruebas

```javascript
import { server } from "../mocks/node";
import { http, HttpResponse } from "msw";

describe("Mi componente", () => {
  it("maneja una respuesta personalizada", async () => {
    // Sobreescribir un handler para esta prueba específica
    server.use(
      http.get("/api/mi-endpoint", () => {
        return HttpResponse.json({
          datos: "personalizados",
        });
      }),
    );

    // Tu prueba aquí...
  });
});
```

## Cómo usar MSW durante el desarrollo

Para activar los mocks durante el desarrollo, importa e inicializa el worker en tu archivo principal:

```javascript
// En app/layout.tsx o similar
import { initMocks } from "./mocks";

// Inicializar mocks en desarrollo
if (process.env.NODE_ENV === "development") {
  initMocks();
}
```

## Añadir nuevos mocks

Para añadir nuevos mocks, edita el archivo `handlers.ts` y añade nuevos manejadores según tus necesidades:

```javascript
http.get('/api/mi-nuevo-endpoint', () => {
  return HttpResponse.json([
    { id: 1, nombre: 'Dato 1' },
    { id: 2, nombre: 'Dato 2' },
  ]);
}),
```
