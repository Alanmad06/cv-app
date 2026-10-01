/**
 * Carga de datos de GitHub, invocada solo desde componentes de servidor.
 * No es una server action (el cliente nunca la llama): por eso vive aquí y
 * no en `lib/actions/`. Todos los fetches se cachean 1h con
 * `next: { revalidate }`, que es lo que sustituye al antiguo fetch en
 * cliente contra `/api/github-repos`.
 */

import type { Portfolio } from "@/interfaces/portfolio";
import type { ProjectData, Readme, Repository } from "@/interfaces/repos";

const GITHUB_USERNAME = "Alanmad06";

/** 1h: el listado cambia poco y el README casi nunca. */
const REVALIDATE_SECONDS = 3600;
const cachedFetch = { next: { revalidate: REVALIDATE_SECONDS } };

/** Formato de las descripciones: `Tipo | Tecnologías | Descripción`. */
const DESCRIPTION_REGEX = /^[\w\s-]+ \| [\w\s.,+-]+ \| .{5,}$/;

/**
 * Proyectos del portfolio (solo repos cuya descripción sigue el formato).
 * Devuelve `[]` en lugar de lanzar: un fallo de GitHub no debe tumbar la
 * página, que simplemente mostrará la rejilla vacía hasta la próxima
 * revalidación.
 */
export async function fetchPortfolioProjects(): Promise<Portfolio[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
      cachedFetch,
    );
    if (!response.ok) {
      throw new Error(`GitHub responded ${response.status}`);
    }

    const repos: Repository[] = await response.json();
    const eligible = repos.filter(
      (repo): repo is Repository & { description: string } =>
        !!repo.description && DESCRIPTION_REGEX.test(repo.description),
    );

    return Promise.all(eligible.map(parsePortfolioProject));
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return [];
  }
}

/** Interpreta `Tipo | Tecnologías | Descripción corta` y busca su imagen. */
async function parsePortfolioProject(
  repo: Repository & { description: string },
): Promise<Portfolio> {
  const [category, technologies, shortDescription] = repo.description
    .split("|")
    .map((part) => part.trim());

  return {
    title: repo.name,
    img: await fetchReadmeImage(repo.name),
    description: `${shortDescription} (${technologies})`,
    link: repo.html_url,
    category,
  };
}

/** Primera imagen del README o un recurso local de respaldo. */
async function fetchReadmeImage(repoName: string): Promise<string> {
  const fallback = `/assets/portfolio_img_${Math.floor(Math.random() * 2) + 1}.png`;
  const readme = await fetchReadme(GITHUB_USERNAME, repoName);
  return readme.images[0] ?? fallback;
}

/**
 * Lee el README: devuelve la primera fila de tabla (texto del proyecto) y
 * todas las imágenes markdown. Fallos y README ausentes = contenido vacío.
 */
export async function fetchReadme(
  owner: string,
  repo: string,
): Promise<Readme> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      cachedFetch,
    );
    if (!response.ok) {
      return { content: "", images: [] };
    }

    const readmeData = await response.json();
    const raw = Buffer.from(readmeData.content, "base64").toString("utf-8");

    const tableRow = raw.match(/\|\s*(.*?[\s\S]*?)(\n*?)\s*\|/);
    const images = (raw.match(/!\[.*?\]\((https:\/\/.*?)\)/g) ?? [])
      .map((match) => match.match(/!\[.*?\]\((https:\/\/.*?)\)/)?.[1] ?? "")
      .filter((url) => url !== "");

    return { content: tableRow ? tableRow[1] : "", images };
  } catch (error) {
    console.error(`Error fetching README for ${owner}/${repo}:`, error);
    return { content: "", images: [] };
  }
}

/** Un repo concreto. Un 404 de GitHub responde JSON válido, no un error. */
export async function fetchProject(title: string): Promise<ProjectData> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${title}`,
      cachedFetch,
    );
    // Sin esta comprobación, `{ message: "Not Found" }` se devolvería como si
    // fuera un Repository y la página renderizaría un proyecto inexistente.
    if (!response.ok) {
      return { error: `GitHub responded ${response.status}` };
    }
    const data: Repository = await response.json();
    return { data };
  } catch (error) {
    return { error };
  }
}
