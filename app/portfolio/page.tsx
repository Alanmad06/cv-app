import Box from "@/components/Box";

import Info from "@/components/Info";
import PortfolioC from "@/components/Portfolio";
import Timeline from "@/components/Timeline";
import SkillsContainer from "@/components/SkillsContainer";

import ToggleButton from "@/components/ToggleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Address from "@/components/Address";
import { fetchPortfolioProjects } from "@/lib/github";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Portfolio" };

/** La página completa se regenera como mucho cada hora (ISR). */
export const revalidate = 3600;

export default async function Portfolio() {
  const projects = await fetchPortfolioProjects();

  return (
    <div className="bg-background relative px-4 pt-10 pb-10">
      <div className="absolute top-2 right-2">
        <ToggleButton
          iconFirst={<FontAwesomeIcon icon={faMoon} size="xs" />}
          iconLast={<FontAwesomeIcon icon={faSun} size="xs" />}
        />
      </div>
      <Box
        id="about-me"
        title="Who I am"
        content=" Hi, I'm Alan Madrigal, a software engineering student passionate about building  applications.
       I enjoy working across the full stack, with a growing focus on web development, 
       cloud technologies, and system reliability.
       I’m currently expanding my skills in backend development, DevOps practices,
        and modern web technologies. Here is my portfolio I'm working on a better looking one 
        that really express who I am, 
        this one was a part of a course but still usefull ;)"
      />

      <PortfolioC id="portfolio" projects={projects} />
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
      <Address id="contacts" />
    </div>
  );
}
