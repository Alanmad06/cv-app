"use server";

import { ProjectData, Repository } from "@/interfaces/repos";

export const fetchProject = async (title: string): Promise<ProjectData> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/Alanmad06/${title}`,
    );
    // Un 404 responde JSON válido ({ message: "Not Found" }); sin esta
    // comprobación se devolvería como si fuera un Repository y la página
    // intentaría renderizar un proyecto inexistente.
    if (!response.ok) {
      return { error: `GitHub responded ${response.status}` };
    }
    const data: Repository = await response.json();
    return { data };
  } catch (error) {
    return { error };
  }
};
