/**
 * Subconjunto de los campos de `GET /repos` que consume la app. La API de
 * GitHub devuelve muchos más (~90), pero no se usan: solo añaden ruido y
 * hacen creer que el resto del código los necesita.
 */
export interface Repository {
  name: string;
  /** `null` cuando el repo no tiene descripción. */
  description: string | null;
  html_url: string;
  owner: { login: string };
  /** Ausente en algunos endpoints (p. ej. la lista sin media type de topics). */
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
}

export interface ProjectData {
  data?: Repository;
  error?: unknown;
}
