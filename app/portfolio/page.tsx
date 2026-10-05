import Box from "@/components/Box";

import Certifications from "@/components/Certifications";
import Disclaimer from "@/components/Disclaimer";
import Experience from "@/components/Experience";
import Info from "@/components/Info";
import PortfolioC from "@/components/Portfolio";
import PortfolioSkeleton from "@/components/PortfolioSkeleton";
import Timeline from "@/components/Timeline";
import SkillsContainer from "@/components/SkillsContainer";

import ToggleButton from "@/components/ToggleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Address from "@/components/Address";
import { fetchPortfolioProjects } from "@/lib/github";
import { certifications, professionalExperience } from "@/lib/resume";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Portfolio" };

/** La página completa se regenera como mucho cada hora (ISR). */
export const revalidate = 3600;

export default function Portfolio() {
  // bg-page-gradient: tinte sutil de acento sobre el color plano del tema.
  // OJO: loading.tsx declara el mismo className y un test lo compara con
  // toBe(...): si cambia uno, tiene que cambiar el otro idéntico.
  return (
    <div className="bg-background bg-page-gradient relative px-4 pt-10 pb-10">
      <div className="absolute top-2 right-2">
        <ToggleButton
          iconFirst={<FontAwesomeIcon icon={faMoon} size="xs" />}
          iconLast={<FontAwesomeIcon icon={faSun} size="xs" />}
        />
      </div>
      <Box
        id="about-me"
        title="Who I am"
        content=" Hi, I'm Alan Madrigal, a software engineer with +1 year of experience working professionally passionate about building  applications.
       I enjoy working across the full stack, with a growing focus on web development, 
       cloud technologies, and system reliability.
       I’m currently expanding my skills in backend development, DevOps practices,
        and modern web technologies. Here is my portfolio I'm working on a better looking one 
        that really express who I am, 
        this one was a part of a course but still usefull ;)"
      />

      {/* Experiencia arriba: es lo primero que debe ver un reclutador. */}
      <Experience
        id="experience"
        title="Professional Experience"
        experiences={professionalExperience}
      />

      {/* El fetch vive en el child, no en esta función: así el shell de la
          página (Who I am, Skills, Timeline, Contacts) se pinta sin esperar
          a GitHub y solo la rejilla muestra el skeleton. */}
      <Suspense fallback={<PortfolioSkeleton />}>
        <PortfolioProjects />
      </Suspense>
      <Info
        id="Languages"
        info="Languages : Español - Native | English - B2 (Upper - Intermediate)"
      />
      <SkillsContainer id="skills" />
      <Timeline
        id="education"
        title="Education"
        timeline={[
          {
            date: "2018",
            title: "Preparatoria No.4 UDG",
            text: "Highschool Programming Web Cetificated",
          },
          {
            date: "2021",
            title: "Centro de Ensenanza Tecnica Industrial (CETI)",
            text: "Software Developmen Engineering",
          },
        ]}
      />
      <Certifications
        id="certifications"
        title="Certifications"
        certifications={certifications}
      />
      {/* Aviso de IA: misma nota que en home, al pie del portafolio. */}
      <Disclaimer id="ai-disclaimer" className="mt-4">
        Disclosure: this portfolio was built and improved with the help of AI,
        in case you hadn&apos;t noticed.
      </Disclaimer>
      <Address id="contacts" />
    </div>
  );
}

/**
 * Child async del Suspense: hace el N+1 a GitHub (repos + READMEs) fuera
 * del cuerpo de la page. Mientras resuelve, React muestra el
 * `PortfolioSkeleton` y el resto del shell ya está pintado.
 */
async function PortfolioProjects() {
  const projects = await fetchPortfolioProjects();
  return <PortfolioC id="portfolio" projects={projects} />;
}
