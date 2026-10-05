import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward } from "@fortawesome/free-solid-svg-icons";
import ButtonLink from "@/components/ui/ButtonLink";
import type { Certification } from "@/interfaces/resume";

/**
 * Sección de certificaciones con enlace a la credencial pública (Credly).
 * Server component: datos estáticos vía props, igual que Experience.
 */
export default function Certifications({
  certifications,
  id,
  title,
}: {
  certifications: Certification[];
  id: string;
  title: string;
}) {
  return (
    <section id={id}>
      <h2 className="gradient-text py-4 font-sans text-xl font-semibold md:text-3xl">
        {title}
      </h2>
      <div className="flex flex-col gap-4">
        {certifications.map((cert) => (
          <article
            key={cert.url}
            className="border-main/40 bg-surface-gradient flex flex-col gap-2 rounded-xl border p-4"
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faAward}
                aria-hidden
                className="text-main"
              />
              <h3 className="font-sans text-lg font-semibold">{cert.title}</h3>
            </div>
            <p className="text-foreground text-sm">
              {cert.issuer} · Valid: {cert.period} · Status: {cert.status}
            </p>
            {/* Credencial externa: se abre en pestaña nueva para no perder
                el portafolio (por eso target="_blank" en ButtonLink). */}
            <ButtonLink
              href={cert.url}
              text="View credential"
              target="_blank"
              rel="noreferrer"
              className="bg-accent-gradient self-start text-white hover:brightness-110 dark:text-gray-900"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
