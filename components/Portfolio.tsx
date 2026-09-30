"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import type { Portfolio } from "@/interfaces/portfolio";
import { useRouter } from "next/navigation";

export default function Portfolio({ id }: { id: string }) {
  const [projects, setProjects] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();

  // Fetch GitHub repositories from our API
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/github-repos");

        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setProjects(data.projects.length > 0 ? data.projects : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching GitHub repositories:", err);
        setError("Failed to load projects from GitHub");
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

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
  // Componente de proyecto para evitar duplicación de código
  const ProjectItem = ({
    project,
    index,
  }: {
    project: Portfolio;
    index: number;
  }) => (
    <div
      key={`${index + project.title}`}
      onClick={() => {
        handleClick(project.title);
      }}
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
        <h2 className="text-main font-bold">{project.title}</h2>
        <p className="py-2 text-start">{project.description}</p>
        <Link className="text-main text-sm underline" href={project.link}>
          View More
        </Link>
      </div>
    </div>
  );

  return (
    <section className="pb-10" id={id}>
      <h2 className="text-main py-4 font-sans text-xl font-semibold md:text-3xl">
        Projects
      </h2>

      {/* Botones de filtrado con estado activo */}
      <div className="text-foreground mb-4 flex flex-wrap items-center gap-2 px-2">
        {categories.map((category, index) => (
          <div key={`${index + category}`}>
            <button
              className={`cursor-pointer transition-colors duration-300 ${selectedCategory === category ? "text-main" : "text-foreground"}`}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
            {index === categories.length - 1 ? "" : " /"}
          </div>
        ))}
      </div>

      {/* Loading and error states */}
      {loading && (
        <div className="text-foreground py-4 text-center">
          Loading projects...
        </div>
      )}
      {error && <div className="py-4 text-center text-red-500">{error}</div>}

      {/* Grid de proyectos con animación */}
      <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2 md:grid-cols-4">
        {filteredProjects.map((project, index) => (
          <ProjectItem project={project} index={index} key={index} />
        ))}
      </div>
    </section>
  );
}
