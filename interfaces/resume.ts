/** Una posición de experiencia profesional (sección Experience). */
export interface Experience {
  /** Puesto ocupado: es el <h3> de la tarjeta. */
  role: string;
  company: string;
  /** Rango de fechas legible, p. ej. "August 2025 – Present". */
  period: string;
  /** Cliente asignado cuando la posición es por proyecto/contratación. */
  client?: string;
  bullets: string[];
  technologies: string[];
}

/** Certificación con credencial pública verificable (sección Certifications). */
export interface Certification {
  title: string;
  issuer: string;
  /** Vigencia legible, p. ej. "September 2026 – September 2027". */
  period: string;
  status: string;
  /** URL pública de la credencial (Credly). */
  url: string;
}
