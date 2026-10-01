"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import type { Portfolio } from "@/interfaces/portfolio";
import { useRouter } from "next/navigation";

/**
 * Rejilla de proyectos con filtro por categoría. Los datos llegan ya
 * cacheados desde el servidor (props): este componente solo interactúa.
 */

// Declarado fuera del componente: si viviera dentro, cada render (p. ej.
// cada click en un filtro) crearía un nuevo tipo y React remontaría toda la
// rejilla, imágenes incluidas.
const ProjectItem = ({
  project,
  onOpen,
}: {
  project: Portfolio;
  onOpen: (title: string) => void;
}) => (
  <div
    onClick={() => onOpen(project.title)}
    className="text-foreground group relative min-h-40 cursor-pointer overflow-hidden transition-all duration-300 ease-in-out"
  >
    <div className="absolute inset-0 z-10 opacity-100 transition-opacity duration-300 group-hover:opacity-0 hover:z-0">
      <Image
        src={project.img}
        alt={project.title}
        fill
        className="object-cover"
      />
    </div>
    <div className="relative flex h-full flex-col items-start justify-between p-5 font-sans">
      <h3 className="text-main font-bold">
        {/* Equivalente por teclado del click en la tarjeta (el div con
            onClick no es enfocable). stopPropagation evita navegar dos veces. */}
        <Link
          href={`/projects/${project.title}`}
          onClick={(event) => event.stopPropagation()}
        >
          {project.title}
        </Link>
      </h3>
      <p className="py-2 text-start">{project.description}</p>
      <Link className="text-main text-sm underline" href={project.link}>
        View More
      </Link>
    </div>
  </div>
);

export default function Portfolio({
  id,
  projects,
}: {
  id: string;
  projects: Portfolio[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();

  // Memorizar la lista de categorías para evitar recálculos innecesarios
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      projects.map((project) => project.category),
    );
    return ["All", ...uniqueCategories];
  }, [projects]);

  // Memorizar los proyectos filtrados para mejorar el rendimiento
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") {
      return projects;
    }
    return projects.filter((project) => project.category === selectedCategory);
  }, [selectedCategory, projects]);

  const handleClick = (title: string) => {
    router.push(`/projects/${title}`);
  };

  return (
    <section className="pb-10" id={id}>
      <h2 className="text-main py-4 font-sans text-xl font-semibold md:text-3xl">
        Projects
      </h2>

      {/* Botones de filtrado con estado activo */}
      <div
        role="group"
        aria-label="Filter projects by category"
        className="text-foreground mb-4 flex flex-wrap items-center gap-2 px-2"
      >
        {categories.map((category, index) => (
          <div key={`${index + category}`}>
            <button
              className={`cursor-pointer transition-colors duration-300 ${selectedCategory === category ? "text-main" : "text-foreground"}`}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
            {index === categories.length - 1 ? null : (
              <span aria-hidden="true"> /</span>
            )}
          </div>
        ))}
      </div>

      {/* Grid de proyectos con animación */}
      <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2 md:grid-cols-4">
        {filteredProjects.map((project) => (
          <ProjectItem
            project={project}
            key={project.title}
            onOpen={handleClick}
          />
        ))}
      </div>
    </section>
  );
}
