"use client";
import { useState } from "react";
import LoginForm from "./LoginForm";
import Skills from "./Skills";
import SkillsForm from "./SkillsForm";

/**
 * Dueño único de la visibilidad de los dos modales. Los hermanos se
 * comunican mediante callbacks explícitos en lugar del antiguo bus de
 * eventos globales (`document.dispatchEvent(new CustomEvent(...))`),
 * que acoplaba Skills con los formularios sin que nada lo declarara.
 */
export default function SkillsContainer({ id }: { id: string }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSkillsFormOpen, setIsSkillsFormOpen] = useState(false);

  return (
    <section id={id}>
      <LoginForm open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <Skills
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenSkillsForm={() => setIsSkillsFormOpen(true)}
      />
      <SkillsForm
        open={isSkillsFormOpen}
        onClose={() => setIsSkillsFormOpen(false)}
      />
    </section>
  );
}
