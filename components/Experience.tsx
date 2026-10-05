import type { Experience } from "@/interfaces/resume";

/**
 * Sección de experiencia profesional. Server component: los datos llegan
 * como props desde `lib/resume.ts`, sin estado ni fetch en el browser.
 */
export default function Experience({
  experiences,
  id,
  title,
}: {
  experiences: Experience[];
  id: string;
  title: string;
}) {
  return (
    <section id={id}>
      <h2 className="gradient-text py-4 font-sans text-xl font-semibold md:text-3xl">
        {title}
      </h2>
      <div className="flex flex-col gap-4">
        {experiences.map((job) => (
          // Mismo lenguaje visual que las tarjetas de Timeline (superficie
          // del tema + filo/borde de acento) para que la página sea 1 sola.
          <article
            key={`${job.role}-${job.period}`}
            className="border-main/40 bg-surface-gradient rounded-xl border p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
              <h3 className="font-sans text-lg font-semibold">{job.role}</h3>
              <p className="text-foreground font-sans text-sm">{job.period}</p>
            </div>
            {/* Empresa/cliente en el color de acento: --main pasa 4.5:1 como
                texto en ambos temas (ver comentario en globals.css). */}
            <p className="text-main font-sans text-sm">
              {job.company}
              {job.client ? ` · Client: ${job.client}` : ""}
            </p>
            <ul className="text-foreground mt-2 list-disc space-y-1 pl-5 text-sm">
              {job.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-accent-gradient rounded-sm px-2 py-1 text-xs text-white dark:text-gray-900"
                >
                  {tech}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
