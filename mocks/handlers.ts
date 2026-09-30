import { delay, http, HttpResponse } from "msw";

// Define tus handlers para mockear las solicitudes HTTP
export const handlers = [
  // Ejemplo de un handler para una solicitud GET
  http.get("/api/fetchSkills", async () => {
    await delay(1000); // Espera 1 segundo antes de responder la solicitud
    return HttpResponse.json([
      { id: 1, name: "JavaScript", level: 90 },
      { id: 2, name: "React", level: 85 },
      { id: 3, name: "TypeScript", level: 80 },
    ]);
  }),

  // Ejemplo de un handler para una solicitud POST

  // Puedes agregar más handlers según tus necesidades
];
