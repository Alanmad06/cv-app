"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import type { Portfolio } from "@/interfaces/portfolio";
import { useRouter } from "next/navigation";





export default function Portfolio() {
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
                const response = await fetch('/api/github-repos');

                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                setProjects(data.projects.length > 0 ? data.projects : []);
                setError(null);
            } catch (err) {
                console.error('Error fetching GitHub repositories:', err);
                setError('Failed to load projects from GitHub');

            } finally {
                setLoading(false);
            }
        };

        fetchRepositories();
    }, []);

    // Memorizar la lista de categorías para evitar recálculos innecesarios
    const categories = useMemo(() => {
        const uniqueCategories = new Set(projects.map(project => project.category));
        return ["All", ...uniqueCategories];
    }, [projects]);

    // Memorizar los proyectos filtrados para mejorar el rendimiento
    const filteredProjects = useMemo(() => {
        if (selectedCategory === "All") {
            return projects;
        }
        return projects.filter(project => project.category === selectedCategory);
    }, [selectedCategory, projects]);

    const handleClick = (title: string) => {
        router.push(`/projects/${title}`);
    }
    // Componente de proyecto para evitar duplicación de código
    const ProjectItem = ({ project, index }: { project: Portfolio, index: number }) => (
        <div key={`${index + project.title}`} onClick={() => {
            handleClick(project.title);
        }} className="text-foreground relative min-h-40  overflow-hidden group transition-all duration-300 ease-in-out cursor-pointer ">
            <div className="absolute inset-0 z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-300  hover:z-0">
                <Image
                    src={project.img}
                    alt={project.title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="relative flex flex-col  justify-between items-start p-5 h-full font-sans ">
                <h2 className="text-main font-bold">{project.title}</h2>
                <p className="text-start py-2">{project.description}</p>
                <Link className="text-sm underline text-main" href={project.link} >
                    View More
                </Link>
            </div>
        </div>
    );

    return (
        <div className="pb-10">
            <h2 className="font-semibold text-xl md:text-3xl py-4  font-sans text-main ">Projects</h2>



            {/* Botones de filtrado con estado activo */}
            <div className="flex flex-wrap mb-4 px-2 gap-2 text-foreground items-center">
                {categories.map((category, index) => (
                    <div key={`${index + category}`}>
                        <button
                            className={`  transition-colors duration-300 cursor-pointer ${selectedCategory === category ? 'text-main' : 'text-foreground '}`}
                            onClick={() => setSelectedCategory(category)}
                            aria-pressed={selectedCategory === category}
                        >
                            {category}
                        </button>
                        {(index === categories.length - 1) ? "" : "/"}
                    </div>
                ))}
            </div>

            {/* Loading and error states */}
            {loading && <div className="text-center py-4 text-foreground">Loading projects...</div>}
            {error && <div className="text-center py-4 text-red-500">{error}</div>}

            {/* Grid de proyectos con animación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {filteredProjects.map((project, index) => (
                    <ProjectItem project={project} index={index} key={index} />
                ))}
            </div>
        </div>
    );
}